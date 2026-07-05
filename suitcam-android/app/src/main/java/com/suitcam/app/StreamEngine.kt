package com.suitcam.app

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.PointF
import android.graphics.RectF
import java.io.ByteArrayOutputStream
import java.net.Inet4Address
import java.net.NetworkInterface

/**
 * "Wirtualna kamera" po sieci: nakłada filtr na klatki z kamery
 * i wystawia je jako strumień MJPEG pod http://IP-telefonu:PORT.
 * Na komputerze strumień można podłączyć w OBS (Start Virtual Camera),
 * VLC albo otworzyć w przeglądarce.
 */
class StreamEngine(val port: Int = 8080) : FrameSink {

    private val server = MjpegServer(port)

    val isRunning: Boolean
        get() = server.isRunning

    override val wantsFrames: Boolean
        get() = server.isRunning && server.hasClients

    /** Rzuca IOException, gdy port jest zajęty. */
    fun start() = server.start()

    fun stop() = server.stop()

    override fun submit(frame: Bitmap, faces: List<DetectedFace>) {
        val canvas = Canvas(frame)
        for (face in faces) {
            SuitRenderer.draw(
                canvas,
                RectF(face.boundingBox),
                face.leftEye?.let { PointF(it.x, it.y) },
                face.rightEye?.let { PointF(it.x, it.y) },
            )
        }
        val out = ByteArrayOutputStream()
        frame.compress(Bitmap.CompressFormat.JPEG, 72, out)
        server.push(out.toByteArray())
    }

    /** Adres strumienia w sieci lokalnej (null, gdy brak Wi-Fi). */
    fun streamUrl(): String? {
        val ip = try {
            NetworkInterface.getNetworkInterfaces().toList()
                .filter { it.isUp && !it.isLoopback }
                .flatMap { it.inetAddresses.toList() }
                .firstOrNull { it is Inet4Address && it.isSiteLocalAddress }
                ?.hostAddress
        } catch (e: Exception) {
            null
        }
        return ip?.let { "http://$it:$port" }
    }
}
