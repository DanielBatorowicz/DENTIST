package com.suitcam.app

import android.content.Context
import android.graphics.Canvas
import android.graphics.PointF
import android.graphics.RectF
import android.util.AttributeSet
import android.view.View
import kotlin.math.max
import kotlin.math.min

/**
 * Przezroczysta nakładka nad podglądem kamery. Mapuje współrzędne twarzy
 * z układu obrazu analizy na układ widoku (tryb FILL_CENTER jak w PreviewView)
 * i rysuje filtr garnituru z okularami.
 */
class SuitOverlayView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
) : View(context, attrs) {

    private var faces: List<DetectedFace> = emptyList()
    private var imageWidth = 0
    private var imageHeight = 0

    /** Kamera przednia daje lustrzany podgląd — odbijamy współrzędne w poziomie. */
    var isMirrored = true

    fun update(newFaces: List<DetectedFace>, width: Int, height: Int) {
        faces = newFaces
        imageWidth = width
        imageHeight = height
        postInvalidate()
    }

    fun clear() {
        faces = emptyList()
        postInvalidate()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        if (imageWidth <= 0 || imageHeight <= 0) return

        val scale = max(
            width.toFloat() / imageWidth,
            height.toFloat() / imageHeight,
        )
        val offsetX = (imageWidth * scale - width) / 2f
        val offsetY = (imageHeight * scale - height) / 2f

        fun mapX(x: Float): Float {
            val mapped = x * scale - offsetX
            return if (isMirrored) width - mapped else mapped
        }

        fun mapY(y: Float): Float = y * scale - offsetY

        for (face in faces) {
            val x1 = mapX(face.boundingBox.left.toFloat())
            val x2 = mapX(face.boundingBox.right.toFloat())
            val box = RectF(
                min(x1, x2),
                mapY(face.boundingBox.top.toFloat()),
                max(x1, x2),
                mapY(face.boundingBox.bottom.toFloat()),
            )
            val leftEye = face.leftEye?.let { PointF(mapX(it.x), mapY(it.y)) }
            val rightEye = face.rightEye?.let { PointF(mapX(it.x), mapY(it.y)) }
            SuitRenderer.draw(canvas, box, leftEye, rightEye)
        }
    }
}
