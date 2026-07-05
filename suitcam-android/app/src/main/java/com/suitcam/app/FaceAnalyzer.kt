package com.suitcam.app

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

/**
 * Analizator klatek CameraX: wykrywa twarze i punkty oczu przez ML Kit
 * i przekazuje je do nakładki rysującej garnitur oraz okulary.
 */
class FaceAnalyzer(
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

        detector.process(input)
            .addOnSuccessListener { faces ->
                onFaces(
                    faces.map { face ->
                        DetectedFace(
                            boundingBox = face.boundingBox,
                            leftEye = face.getLandmark(FaceLandmark.LEFT_EYE)?.position,
                            rightEye = face.getLandmark(FaceLandmark.RIGHT_EYE)?.position,
                        )
                    },
                    width,
                    height,
                )
            }
            .addOnCompleteListener { imageProxy.close() }
    }

    fun close() = detector.close()
}
