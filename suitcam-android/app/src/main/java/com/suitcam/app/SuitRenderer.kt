package com.suitcam.app

import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.Path
import android.graphics.PointF
import android.graphics.RectF
import kotlin.math.atan2
import kotlin.math.hypot
import kotlin.math.min

/**
 * Rysuje filtr "czarny garnitur + ciemne okulary" na dowolnym Canvas.
 * Współrzędne twarzy muszą być już w układzie docelowego płótna
 * (podgląd na ekranie albo bitmapa zapisywanego zdjęcia).
 */
object SuitRenderer {

    private val jacketPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = 0xFF14171B.toInt()
        style = Paint.Style.FILL
    }
    private val lapelPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = 0xFF1F242B.toInt()
        style = Paint.Style.FILL
    }
    private val lapelEdgePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = 0xFF05070A.toInt()
        style = Paint.Style.STROKE
    }
    private val shirtPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = 0xFFF4F4F2.toInt()
        style = Paint.Style.FILL
    }
    private val tiePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = 0xFF0B0D10.toInt()
        style = Paint.Style.FILL
    }
    private val lensPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = 0xFF0A0A0C.toInt()
        style = Paint.Style.FILL
    }
    private val framePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = 0xFF000000.toInt()
        style = Paint.Style.STROKE
        strokeCap = Paint.Cap.ROUND
    }
    private val glossPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = 0x40FFFFFF
        style = Paint.Style.FILL
    }

    /**
     * Rysuje pełny filtr dla jednej twarzy.
     *
     * @param faceBox ramka twarzy w układzie płótna
     * @param leftEye pozycja lewego oka (może być null — wtedy szacowana z ramki)
     * @param rightEye pozycja prawego oka (może być null — wtedy szacowana z ramki)
     */
    fun draw(canvas: Canvas, faceBox: RectF, leftEye: PointF?, rightEye: PointF?) {
        if (faceBox.width() <= 0f || faceBox.height() <= 0f) return

        drawSuit(canvas, faceBox)

        val left = leftEye ?: PointF(
            faceBox.left + faceBox.width() * 0.30f,
            faceBox.top + faceBox.height() * 0.40f,
        )
        val right = rightEye ?: PointF(
            faceBox.left + faceBox.width() * 0.70f,
            faceBox.top + faceBox.height() * 0.40f,
        )
        drawGlasses(canvas, left, right, faceBox.width())
    }

    private fun drawSuit(canvas: Canvas, face: RectF) {
        val w = face.width()
        val h = face.height()
        val cx = face.centerX()
        val chin = face.bottom
        val neckW = w * 0.46f
        val neckH = h * 0.24f
        val shoulderY = chin + neckH
        val halfShoulder = w * 1.35f
        val bottom = min(canvas.height.toFloat(), shoulderY + h * 2.6f)

        // Marynarka: ramiona rozchodzące się od szyi w dół, do dolnej krawędzi kadru.
        val jacket = Path().apply {
            moveTo(cx - neckW * 0.55f, chin + neckH * 0.35f)
            quadTo(
                cx - halfShoulder * 0.55f, chin + neckH * 0.15f,
                cx - halfShoulder, shoulderY + h * 0.18f,
            )
            lineTo(cx - halfShoulder - w * 0.12f, bottom)
            lineTo(cx + halfShoulder + w * 0.12f, bottom)
            lineTo(cx + halfShoulder, shoulderY + h * 0.18f)
            quadTo(
                cx + halfShoulder * 0.55f, chin + neckH * 0.15f,
                cx + neckW * 0.55f, chin + neckH * 0.35f,
            )
            quadTo(cx, chin + neckH * 0.85f, cx - neckW * 0.55f, chin + neckH * 0.35f)
            close()
        }
        canvas.drawPath(jacket, jacketPaint)

        // Biała koszula widoczna w rozcięciu marynarki (kształt litery V).
        val shirtTop = chin + neckH * 0.30f
        val shirt = Path().apply {
            moveTo(cx - neckW * 0.60f, shirtTop)
            lineTo(cx, shoulderY + h * 1.15f)
            lineTo(cx + neckW * 0.60f, shirtTop)
            quadTo(cx, chin + neckH * 0.85f, cx - neckW * 0.60f, shirtTop)
            close()
        }
        canvas.drawPath(shirt, shirtPaint)

        // Krawat: węzeł pod kołnierzykiem i zwężający się materiał.
        val knotW = neckW * 0.34f
        val knotTop = chin + neckH * 0.55f
        val tie = Path().apply {
            moveTo(cx, knotTop)
            lineTo(cx + knotW * 0.5f, knotTop + knotW * 0.7f)
            lineTo(cx + knotW * 0.75f, shoulderY + h * 0.85f)
            lineTo(cx, shoulderY + h * 1.05f)
            lineTo(cx - knotW * 0.75f, shoulderY + h * 0.85f)
            lineTo(cx - knotW * 0.5f, knotTop + knotW * 0.7f)
            close()
        }
        canvas.drawPath(tie, tiePaint)

        // Klapy marynarki przykrywające brzegi koszuli.
        lapelEdgePaint.strokeWidth = w * 0.015f
        val leftLapel = Path().apply {
            moveTo(cx - neckW * 0.62f, chin + neckH * 0.32f)
            lineTo(cx - w * 0.06f, shoulderY + h * 0.95f)
            lineTo(cx - neckW * 1.15f, shoulderY + h * 0.55f)
            close()
        }
        val rightLapel = Path().apply {
            moveTo(cx + neckW * 0.62f, chin + neckH * 0.32f)
            lineTo(cx + w * 0.06f, shoulderY + h * 0.95f)
            lineTo(cx + neckW * 1.15f, shoulderY + h * 0.55f)
            close()
        }
        canvas.drawPath(leftLapel, lapelPaint)
        canvas.drawPath(leftLapel, lapelEdgePaint)
        canvas.drawPath(rightLapel, lapelPaint)
        canvas.drawPath(rightLapel, lapelEdgePaint)
    }

    private fun drawGlasses(canvas: Canvas, leftEye: PointF, rightEye: PointF, faceWidth: Float) {
        var left = leftEye
        var right = rightEye
        if (left.x > right.x) {
            val tmp = left
            left = right
            right = tmp
        }

        val cx = (left.x + right.x) / 2f
        val cy = (left.y + right.y) / 2f
        val dist = hypot(right.x - left.x, right.y - left.y)
        if (dist < 1f) return

        val angle = Math.toDegrees(
            atan2((right.y - left.y).toDouble(), (right.x - left.x).toDouble())
        ).toFloat()

        val lensW = dist * 0.72f
        val lensH = lensW * 0.68f
        val radius = lensH * 0.45f
        val stroke = lensH * 0.12f

        canvas.save()
        canvas.rotate(angle, cx, cy)

        val leftLens = RectF(
            cx - dist / 2f - lensW / 2f, cy - lensH / 2f,
            cx - dist / 2f + lensW / 2f, cy + lensH / 2f,
        )
        val rightLens = RectF(
            cx + dist / 2f - lensW / 2f, cy - lensH / 2f,
            cx + dist / 2f + lensW / 2f, cy + lensH / 2f,
        )
        canvas.drawRoundRect(leftLens, radius, radius, lensPaint)
        canvas.drawRoundRect(rightLens, radius, radius, lensPaint)

        framePaint.strokeWidth = stroke
        // Mostek między szkłami.
        canvas.drawLine(
            leftLens.right - stroke, cy - lensH * 0.2f,
            rightLens.left + stroke, cy - lensH * 0.2f,
            framePaint,
        )
        // Zauszniki w stronę uszu.
        canvas.drawLine(
            leftLens.left, cy - lensH * 0.15f,
            leftLens.left - faceWidth * 0.18f, cy - lensH * 0.32f,
            framePaint,
        )
        canvas.drawLine(
            rightLens.right, cy - lensH * 0.15f,
            rightLens.right + faceWidth * 0.18f, cy - lensH * 0.32f,
            framePaint,
        )

        // Delikatny odblask na szkłach.
        val glossLeft = RectF(
            leftLens.left + lensW * 0.15f, leftLens.top + lensH * 0.15f,
            leftLens.left + lensW * 0.50f, leftLens.top + lensH * 0.35f,
        )
        val glossRight = RectF(
            rightLens.left + lensW * 0.15f, rightLens.top + lensH * 0.15f,
            rightLens.left + lensW * 0.50f, rightLens.top + lensH * 0.35f,
        )
        canvas.drawRoundRect(glossLeft, radius / 2f, radius / 2f, glossPaint)
        canvas.drawRoundRect(glossRight, radius / 2f, radius / 2f, glossPaint)

        canvas.restore()
    }
}
