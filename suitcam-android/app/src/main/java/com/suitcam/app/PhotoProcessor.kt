package com.suitcam.app

import android.content.ContentValues
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Matrix
import android.graphics.PointF
import android.graphics.RectF
import android.os.Build
import android.provider.MediaStore
import androidx.camera.core.ImageProxy
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetectorOptions
import com.google.mlkit.vision.face.FaceLandmark
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.Executor

/**
 * Przetwarza zrobione zdjęcie: wykrywa twarze, nakłada filtr garnituru
 * z okularami i zapisuje wynik do galerii (MediaStore, album SuitCam).
 */
object PhotoProcessor {

    private val detector by lazy {
        FaceDetection.getClient(
            FaceDetectorOptions.Builder()
                .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_ACCURATE)
                .setLandmarkMode(FaceDetectorOptions.LANDMARK_MODE_ALL)
                .setMinFaceSize(0.1f)
                .build()
        )
    }

    /**
     * @param mirrored true dla kamery przedniej — zdjęcie jest odbijane,
     *                 żeby wyglądało tak samo jak podgląd
     * @param onResult wywoływane z informacją, czy zapis się powiódł
     *                 (uwaga: z wątku roboczego)
     */
    fun processAndSave(
        context: Context,
        image: ImageProxy,
        mirrored: Boolean,
        ioExecutor: Executor,
        onResult: (Boolean) -> Unit,
    ) {
        val bitmap = try {
            toUprightBitmap(image, mirrored)
        } catch (e: Exception) {
            null
        } finally {
            image.close()
        }
        if (bitmap == null) {
            onResult(false)
            return
        }

        detector.process(InputImage.fromBitmap(bitmap, 0))
            .addOnSuccessListener { faces ->
                ioExecutor.execute {
                    val result = bitmap.copy(Bitmap.Config.ARGB_8888, true)
                    val canvas = Canvas(result)
                    for (face in faces) {
                        SuitRenderer.draw(
                            canvas,
                            RectF(face.boundingBox),
                            face.getLandmark(FaceLandmark.LEFT_EYE)?.position?.let { PointF(it.x, it.y) },
                            face.getLandmark(FaceLandmark.RIGHT_EYE)?.position?.let { PointF(it.x, it.y) },
                        )
                    }
                    onResult(saveToGallery(context, result))
                }
            }
            .addOnFailureListener {
                ioExecutor.execute { onResult(saveToGallery(context, bitmap)) }
            }
    }

    /** Dekoduje JPEG z ImageProxy i obraca/odbija go do naturalnej orientacji. */
    private fun toUprightBitmap(image: ImageProxy, mirrored: Boolean): Bitmap {
        val buffer = image.planes[0].buffer
        val bytes = ByteArray(buffer.remaining())
        buffer.get(bytes)
        val decoded = BitmapFactory.decodeByteArray(bytes, 0, bytes.size)
            ?: throw IllegalStateException("Nie udało się zdekodować zdjęcia")

        val rotation = image.imageInfo.rotationDegrees
        if (rotation == 0 && !mirrored) return decoded

        val matrix = Matrix().apply {
            postRotate(rotation.toFloat())
            if (mirrored) postScale(-1f, 1f)
        }
        return Bitmap.createBitmap(decoded, 0, 0, decoded.width, decoded.height, matrix, true)
    }

    private fun saveToGallery(context: Context, bitmap: Bitmap): Boolean {
        val name = "SuitCam_" +
            SimpleDateFormat("yyyyMMdd_HHmmss", Locale.US).format(Date()) + ".jpg"
        val values = ContentValues().apply {
            put(MediaStore.Images.Media.DISPLAY_NAME, name)
            put(MediaStore.Images.Media.MIME_TYPE, "image/jpeg")
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                put(MediaStore.Images.Media.RELATIVE_PATH, "Pictures/SuitCam")
            }
        }
        return try {
            val uri = context.contentResolver.insert(
                MediaStore.Images.Media.EXTERNAL_CONTENT_URI, values
            ) ?: return false
            context.contentResolver.openOutputStream(uri)?.use { stream ->
                bitmap.compress(Bitmap.CompressFormat.JPEG, 92, stream)
            } ?: return false
            true
        } catch (e: Exception) {
            false
        }
    }
}
