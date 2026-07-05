package com.suitcam.app

import android.graphics.Bitmap
import android.graphics.Matrix
import android.graphics.PointF
import android.graphics.Rect
import androidx.annotation.OptIn
import androidx.camera.core.ExperimentalGetImage
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetectorOptions
import com.google.mlkit.vision.face.FaceLandmark

/**
 * Wynik detekcji pojedynczej twarzy w układzie współrzędnych
 * obrazu z kamery (po uwzględnieniu rotacji).
 */
data class DetectedFace(
    val boundingBox: Rect,
    val leftEye: PointF?,
    val rightEye: PointF?,
)

/** Odbiorca gotowych klatek z filtrem (np. serwer wirtualnej kamery). */
interface FrameSink {
    /** Czy w tej chwili ktoś potrzebuje klatek (oszczędza konwersję YUV→Bitmap). */
    val wantsFrames: Boolean

    /** Klatka w naturalnej orientacji + twarze wykryte na tej klatce. */
    fun submit(frame: Bitmap, faces: List<DetectedFace>)
}

/**
 * Analizator klatek CameraX: wykrywa twarze i punkty oczu przez ML Kit,
 * przekazuje je do nakładki rysującej filtr, a przy aktywnym streamie
 * dostarcza też całe klatki do [FrameSink].
 */
class FaceAnalyzer(
    private val frameSink: FrameSink? = null,
    private val onFaces: (faces: List<DetectedFace>, imageWidth: Int, imageHeight: Int) -> Unit,
) : ImageAnalysis.Analyzer {

    private val detector = FaceDetection.getClient(
        FaceDetectorOptions.Builder()
            .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_FAST)
            .setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_ALL)
            .setMinFaceSize(0.15f)
            .build()
    )

    @OptIn(ExperimentalGetImage::class)
    override fun analyze(imageProxy: ImageProxy) {
        val mediaImage = imageProxy.image
        if (mediaImage == null) {
            imageProxy.close()
            return
        }
        val rotation = imageProxy.imageInfo.rotationDegrees
        val input = InputImage.fromMediaImage(mediaImage, rotation)
        // Po obróceniu o 90/270 stopni szerokość i wysokość zamieniają się miejscami.
        val width = if (rotation == 90 || rotation == 270) imageProxy.height else imageProxy.width
        val height = if (rotation == 90 || rotation == 270) imageProxy.width else imageProxy.height

        // Konwersja musi nastąpić przed zamknięciem imageProxy.
        val frame = if (frameSink?.wantsFrames == true) toUprightBitmap(imageProxy, rotation) else null

        detector.process(input)
            .addOnSuccessListener { faces ->
                val detected = faces.map { face ->
                    DetectedFace(
                        boundingBox = face.boundingBox,
                        leftEye = face.getLandmark(FaceLandmark.LEFT_EYE)?.position,
                        rightEye = face.getLandmark(FaceLandmark.RIGHT_EYE)?.position,
                    )
                }
                onFaces(detected, width, height)
                if (frame != null) {
                    frameSink?.submit(frame, detected)
                }
            }
            .addOnCompleteListener { imageProxy.close() }
    }

    private fun toUprightBitmap(proxy: ImageProxy, rotation: Int): Bitmap? = try {
        var bitmap = proxy.toBitmap()
        if (rotation != 0) {
            val matrix = Matrix().apply { postRotate(rotation.toFloat()) }
            bitmap = Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
        }
        if (!bitmap.isMutable) {
            bitmap = bitmap.copy(Bitmap.Config.ARGB_8888, true)
        }
        bitmap
    } catch (e: Exception) {
        null
    }

    fun close() = detector.close()
}
