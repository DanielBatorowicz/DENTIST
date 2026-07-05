package com.suitcam.app

import java.io.BufferedOutputStream
import java.net.ServerSocket
import java.net.Socket
import java.util.concurrent.ArrayBlockingQueue
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.TimeUnit
import kotlin.concurrent.thread

/**
 * Minimalny serwer HTTP strumieniujący MJPEG (multipart/x-mixed-replace).
 * Każdy podłączony klient (OBS, VLC, przeglądarka) dostaje na bieżąco
 * klatki JPEG z nałożonym filtrem.
 */
class MjpegServer(private val port: Int) {

    private val boundary = "suitcamframe"

    @Volatile
    private var serverSocket: ServerSocket? = null
    private val clients = CopyOnWriteArrayList<Client>()

    val isRunning: Boolean
        get() = serverSocket != null

    val hasClients: Boolean
        get() = clients.isNotEmpty()

    /** Startuje serwer; rzuca IOException, gdy port jest zajęty. */
    fun start() {
        if (isRunning) return
        val socket = ServerSocket(port)
        serverSocket = socket
        thread(name = "mjpeg-accept", isDaemon = true) {
            while (true) {
                val client = try {
                    socket.accept()
                } catch (e: Exception) {
                    break // serwer zatrzymany
                }
                val c = Client(client) { clients.remove(it) }
                clients.add(c)
                c.startWriter(boundary)
            }
        }
    }

    fun stop() {
        try {
            serverSocket?.close()
        } catch (_: Exception) {
        }
        serverSocket = null
        clients.forEach { it.close() }
        clients.clear()
    }

    /** Rozsyła klatkę JPEG do wszystkich klientów (bez blokowania nadawcy). */
    fun push(jpeg: ByteArray) {
        for (client in clients) {
            client.offer(jpeg)
        }
    }

    private class Client(
        private val socket: Socket,
        private val onClosed: (Client) -> Unit,
    ) {
        // Bufor na 2 klatki: wolny klient gubi klatki zamiast blokować kamerę.
        private val queue = ArrayBlockingQueue<ByteArray>(2)

        fun startWriter(boundary: String) = thread(name = "mjpeg-client", isDaemon = true) {
            try {
                val out = BufferedOutputStream(socket.getOutputStream())
                out.write(
                    (
                        "HTTP/1.0 200 OK\r\n" +
                            "Connection: close\r\n" +
                            "Cache-Control: no-cache\r\n" +
                            "Pragma: no-cache\r\n" +
                            // CORS: strona wideorozmowy w WebView rysuje ten strumień
                            // na canvasie — bez tego nagłówka canvas byłby "tainted".
                            "Access-Control-Allow-Origin: *\r\n" +
                            "Content-Type: multipart/x-mixed-replace; boundary=$boundary\r\n" +
                            "\r\n"
                        ).toByteArray()
                )
                while (!socket.isClosed) {
                    val frame = queue.poll(1, TimeUnit.SECONDS) ?: continue
                    out.write(
                        (
                            "--$boundary\r\n" +
                                "Content-Type: image/jpeg\r\n" +
                                "Content-Length: ${frame.size}\r\n" +
                                "\r\n"
                            ).toByteArray()
                    )
                    out.write(frame)
                    out.write("\r\n".toByteArray())
                    out.flush()
                }
            } catch (_: Exception) {
                // klient się rozłączył
            } finally {
                close()
            }
        }

        fun offer(frame: ByteArray) {
            if (!queue.offer(frame)) {
                queue.poll()
                queue.offer(frame)
            }
        }

        fun close() {
            try {
                socket.close()
            } catch (_: Exception) {
            }
            onClosed(this)
        }
    }
}
