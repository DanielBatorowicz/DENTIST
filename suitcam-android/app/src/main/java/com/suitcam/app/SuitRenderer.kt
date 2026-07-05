package com.suitcam.app

import android.graphics.Canvas
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.Path
import android.graphics.PointF
import android.graphics.RectF
import android.graphics.Shader
import kotlin.math.atan2
import kotlin.math.hypot
import kotlin.math.min

/**
 * Rysuje filtr "czarny garnitur + ciemne okulary" na dowolnym Canvas.
 * Współrzędne twarzy muszą być już w układzie docelowego płótna
 * (podgląd na ekranie, klatka streamu albo bitmapa zapisywanego zdjęcia).
 */
object SuitRenderer {

    private val fillPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.FILL
    }
    private val strokePaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        style = Paint.Style.STROKE
        strokeCap = Paint.Cap.ROUND
        strokeJoin = Paint.Join.ROUND
    }

    fun draw(canvas: Canvas, faceBox: RectF, leftEye: PointF?, rightEye: PointF?) {
        if (faceBox.width() <= 0f || faceBox.height() <= 0f) return

        drawSuit(canvas, faceBox)

        val left = leftEye ?: PointF(
            faceBox.left + faceBox.width() * 0.31f,
            faceBox.top + faceBox.height() * 0.42f,
        )
        val right = rightEye ?: PointF(
            faceBox.left + faceBox.width() * 0.69f,
            faceBox.top + faceBox.height() * 0.42f,
        )
        drawGlasses(canvas, left, right, faceBox.width())
    }

    // ------------------------------------------------------------------ garnitur

    private fun drawSuit(canvas: Canvas, face: RectF) {
        val w = face.width()
        val h = face.height()
        val cx = face.centerX()
        val chin = face.bottom
        val neckW = w * 0.44f
        val neckH = h * 0.26f
        val shoulderY = chin + neckH
        val halfShoulder = w * 1.4f
        val bottom = min(canvas.height.toFloat(), shoulderY + h * 3f)

        val collarY = chin + neckH * 0.30f
        val collarLx = cx - neckW * 0.62f
        val collarRx = cx + neckW * 0.62f

        // Marynarka: miękko zaokrąglone ramiona, rękawy lekko rozszerzające się w dół.
        val jacket = Path().apply {
            moveTo(collarLx, collarY)
            cubicTo(
                cx - w * 0.80f, chin + neckH * 0.02f,
                cx - halfShoulder * 0.95f, shoulderY - h * 0.12f,
                cx - halfShoulder, shoulderY + h * 0.25f,
            )
            cubicTo(
                cx - halfShoulder - w * 0.10f, shoulderY + h * 0.9f,
                cx - halfShoulder - w * 0.15f, bottom - h * 0.6f,
                cx - halfShoulder - w * 0.17f, bottom,
            )
            lineTo(cx + halfShoulder + w * 0.17f, bottom)
            cubicTo(
                cx + halfShoulder + w * 0.15f, bottom - h * 0.6f,
                cx + halfShoulder + w * 0.10f, shoulderY + h * 0.9f,
                cx + halfShoulder, shoulderY + h * 0.25f,
            )
            cubicTo(
                cx + halfShoulder * 0.95f, shoulderY - h * 0.12f,
                cx + w * 0.80f, chin + neckH * 0.02f,
                collarRx, collarY,
            )
            quadTo(cx, chin + neckH * 0.95f, collarLx, collarY)
            close()
        }
        fillPaint.shader = LinearGradient(
            cx, chin, cx, bottom,
            0xFF2A2F37.toInt(), 0xFF0A0C0F.toInt(), Shader.TileMode.CLAMP,
        )
        canvas.drawPath(jacket, fillPaint)
        fillPaint.shader = null

        // Delikatne światło na ramionach.
        strokePaint.color = 0x24FFFFFF
        strokePaint.strokeWidth = w * 0.035f
        val highlightL = Path().apply {
            moveTo(cx - w * 0.55f, chin + neckH * 0.14f)
            quadTo(
                cx - halfShoulder * 0.78f, shoulderY - h * 0.06f,
                cx - halfShoulder * 0.96f, shoulderY + h * 0.20f,
            )
        }
        val highlightR = Path().apply {
            moveTo(cx + w * 0.55f, chin + neckH * 0.14f)
            quadTo(
                cx + halfShoulder * 0.78f, shoulderY - h * 0.06f,
                cx + halfShoulder * 0.96f, shoulderY + h * 0.20f,
            )
        }
        canvas.drawPath(highlightL, strokePaint)
        canvas.drawPath(highlightR, strokePaint)

        // Koszula w rozcięciu marynarki.
        val shirtBottomY = shoulderY + h * 1.3f
        val shirt = Path().apply {
            moveTo(collarLx, collarY)
            lineTo(cx, shirtBottomY)
            lineTo(collarRx, collarY)
            quadTo(cx, chin + neckH * 0.90f, collarLx, collarY)
            close()
        }
        fillPaint.shader = LinearGradient(
            cx, collarY, cx, shirtBottomY,
            0xFFFFFFFF.toInt(), 0xFFD6D6D2.toInt(), Shader.TileMode.CLAMP,
        )
        canvas.drawPath(shirt, fillPaint)
        fillPaint.shader = null

        // Kołnierzyk koszuli: dwa skrzydełka schodzące do węzła krawata.
        val knotTop = chin + neckH * 0.55f
        val wingL = Path().apply {
            moveTo(collarLx, collarY - neckH * 0.10f)
            lineTo(cx - neckW * 0.06f, knotTop + neckH * 0.18f)
            lineTo(cx - neckW * 0.44f, knotTop + neckH * 0.30f)
            close()
        }
        val wingR = Path().apply {
            moveTo(collarRx, collarY - neckH * 0.10f)
            lineTo(cx + neckW * 0.06f, knotTop + neckH * 0.18f)
            lineTo(cx + neckW * 0.44f, knotTop + neckH * 0.30f)
            close()
        }
        fillPaint.color = 0xFFFFFFFF.toInt()
        canvas.drawPath(wingL, fillPaint)
        canvas.drawPath(wingR, fillPaint)
        strokePaint.color = 0xFFC9C9C4.toInt()
        strokePaint.strokeWidth = w * 0.010f
        canvas.drawPath(wingL, strokePaint)
        canvas.drawPath(wingR, strokePaint)

        // Krawat: węzeł + zwężający się materiał z połyskiem.
        val knotW = neckW * 0.36f
        val knotH = knotW * 0.95f
        val knot = Path().apply {
            moveTo(cx - knotW * 0.50f, knotTop)
            lineTo(cx + knotW * 0.50f, knotTop)
            lineTo(cx + knotW * 0.38f, knotTop + knotH)
            lineTo(cx - knotW * 0.38f, knotTop + knotH)
            close()
        }
        fillPaint.shader = LinearGradient(
            cx, knotTop, cx, knotTop + knotH,
            0xFF3C4350.toInt(), 0xFF1B2029.toInt(), Shader.TileMode.CLAMP,
        )
        canvas.drawPath(knot, fillPaint)
        fillPaint.shader = null

        val tieTipY = shirtBottomY - h * 0.02f
        val tie = Path().apply {
            moveTo(cx - knotW * 0.38f, knotTop + knotH * 0.90f)
            lineTo(cx + knotW * 0.38f, knotTop + knotH * 0.90f)
            lineTo(cx + knotW * 0.85f, tieTipY - h * 0.22f)
            lineTo(cx, tieTipY)
            lineTo(cx - knotW * 0.85f, tieTipY - h * 0.22f)
            close()
        }
        fillPaint.shader = LinearGradient(
            cx, knotTop + knotH, cx, tieTipY,
            0xFF2E3540.toInt(), 0xFF11141A.toInt(), Shader.TileMode.CLAMP,
        )
        canvas.drawPath(tie, fillPaint)
        fillPaint.shader = null

        strokePaint.color = 0x30FFFFFF
        strokePaint.strokeWidth = w * 0.014f
        canvas.drawLine(
            cx - knotW * 0.30f, knotTop + knotH,
            cx - knotW * 0.10f, tieTipY - h * 0.10f,
            strokePaint,
        )

        // Klapy marynarki z wcięciem (notch lapel), lekko jaśniejsze od korpusu.
        val lapelL = Path().apply {
            moveTo(collarLx - w * 0.02f, collarY - neckH * 0.05f)
            quadTo(
                cx - neckW * 0.55f, shoulderY + h * 0.55f,
                cx - w * 0.04f, shoulderY + h * 1.10f,
            )
            lineTo(cx - neckW * 1.05f, shoulderY + h * 0.50f)
            lineTo(cx - neckW * 1.28f, shoulderY + h * 0.22f)
            close()
        }
        val lapelR = Path().apply {
            moveTo(collarRx + w * 0.02f, collarY - neckH * 0.05f)
            quadTo(
                cx + neckW * 0.55f, shoulderY + h * 0.55f,
                cx + w * 0.04f, shoulderY + h * 1.10f,
            )
            lineTo(cx + neckW * 1.05f, shoulderY + h * 0.50f)
            lineTo(cx + neckW * 1.28f, shoulderY + h * 0.22f)
            close()
        }
        fillPaint.shader = LinearGradient(
            cx, collarY, cx, shoulderY + h * 1.10f,
            0xFF353C46.toInt(), 0xFF1B2027.toInt(), Shader.TileMode.CLAMP,
        )
        canvas.drawPath(lapelL, fillPaint)
        canvas.drawPath(lapelR, fillPaint)
        fillPaint.shader = null
        strokePaint.color = 0xFF07090C.toInt()
        strokePaint.strokeWidth = w * 0.014f
        canvas.drawPath(lapelL, strokePaint)
        canvas.drawPath(lapelR, strokePaint)

        // Guziki marynarki.
        val buttonR = w * 0.045f
        for (by in floatArrayOf(shoulderY + h * 1.45f, shoulderY + h * 1.85f)) {
            if (by + buttonR > bottom) break
            fillPaint.color = 0xFF07090C.toInt()
            canvas.drawCircle(cx, by, buttonR, fillPaint)
            fillPaint.color = 0x46FFFFFF
            canvas.drawCircle(cx - buttonR * 0.30f, by - buttonR * 0.30f, buttonR * 0.30f, fillPaint)
        }

        // Poszetka w kieszonce na lewej piersi.
        val psx = cx - w * 0.95f
        val psy = shoulderY + h * 1.15f
        if (psy < bottom) {
            val pocketSquare = Path().apply {
                moveTo(psx - w * 0.12f, psy)
                lineTo(psx + w * 0.12f, psy)
                lineTo(psx + w * 0.06f, psy - h * 0.14f)
                lineTo(psx - w * 0.05f, psy - h * 0.10f)
                close()
            }
            fillPaint.color = 0xFFF2F2EE.toInt()
            canvas.drawPath(pocketSquare, fillPaint)
            strokePaint.color = 0xFF07090C.toInt()
            strokePaint.strokeWidth = w * 0.012f
            canvas.drawLine(psx - w * 0.14f, psy, psx + w * 0.14f, psy, strokePaint)
        }
    }

    // ------------------------------------------------------------------ okulary

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

        val lensW = dist * 0.82f
        val lensH = lensW * 0.72f
        val topY = cy - lensH * 0.48f
        // Soczewki w stylu wayfarer: mocniej zaokrąglone na dole niż na górze.
        val rTop = lensH * 0.28f
        val rBottom = lensH * 0.55f
        val radii = floatArrayOf(rTop, rTop, rTop, rTop, rBottom, rBottom, rBottom, rBottom)

        canvas.save()
        canvas.rotate(angle, cx, cy)

        val leftRect = RectF(
            cx - dist / 2f - lensW / 2f, topY,
            cx - dist / 2f + lensW / 2f, topY + lensH,
        )
        val rightRect = RectF(
            cx + dist / 2f - lensW / 2f, topY,
            cx + dist / 2f + lensW / 2f, topY + lensH,
        )

        // Zauszniki rysowane pod resztą oprawek.
        strokePaint.color = 0xFF0B0B0D.toInt()
        strokePaint.strokeWidth = lensH * 0.14f
        canvas.drawLine(
            leftRect.left + rTop * 0.4f, topY + lensH * 0.12f,
            leftRect.left - faceWidth * 0.22f, topY - lensH * 0.10f,
            strokePaint,
        )
        canvas.drawLine(
            rightRect.right - rTop * 0.4f, topY + lensH * 0.12f,
            rightRect.right + faceWidth * 0.22f, topY - lensH * 0.10f,
            strokePaint,
        )
        // Zawiasy.
        fillPaint.color = 0xFF3C3C44.toInt()
        canvas.drawCircle(leftRect.left + rTop * 0.35f, topY + lensH * 0.14f, lensH * 0.07f, fillPaint)
        canvas.drawCircle(rightRect.right - rTop * 0.35f, topY + lensH * 0.14f, lensH * 0.07f, fillPaint)

        // Szkła z gradientem (u dołu lekko prześwitujące).
        val lenses = Path().apply {
            addRoundRect(leftRect, radii, Path.Direction.CW)
            addRoundRect(rightRect, radii, Path.Direction.CW)
        }
        fillPaint.shader = LinearGradient(
            cx, topY, cx, topY + lensH,
            0xFF0E0E12.toInt(), 0xC83E3E4A.toInt(), Shader.TileMode.CLAMP,
        )
        canvas.drawPath(lenses, fillPaint)
        fillPaint.shader = null

        // Oprawki.
        strokePaint.color = 0xFF050506.toInt()
        strokePaint.strokeWidth = lensH * 0.09f
        canvas.drawPath(lenses, strokePaint)

        // Górna belka łącząca obie soczewki.
        fillPaint.color = 0xFF050506.toInt()
        val bar = RectF(
            leftRect.left - lensH * 0.05f, topY - lensH * 0.10f,
            rightRect.right + lensH * 0.05f, topY + lensH * 0.16f,
        )
        canvas.drawRoundRect(bar, lensH * 0.08f, lensH * 0.08f, fillPaint)

        // Mostek na nosie.
        strokePaint.strokeWidth = lensH * 0.10f
        val bridge = Path().apply {
            moveTo(leftRect.right - lensH * 0.05f, topY + lensH * 0.24f)
            quadTo(cx, topY + lensH * 0.38f, rightRect.left + lensH * 0.05f, topY + lensH * 0.24f)
        }
        canvas.drawPath(bridge, strokePaint)

        // Ukośne odblaski na każdej soczewce.
        for (rect in listOf(leftRect, rightRect)) {
            val lcx = rect.centerX()
            val lcy = rect.centerY()
            canvas.save()
            canvas.rotate(-18f, lcx, lcy)
            fillPaint.color = 0x46FFFFFF
            canvas.drawRoundRect(
                RectF(
                    lcx - lensW * 0.30f, lcy - lensH * 0.34f,
                    lcx - lensW * 0.12f, lcy + lensH * 0.22f,
                ),
                lensW * 0.08f, lensW * 0.08f, fillPaint,
            )
            fillPaint.color = 0x28FFFFFF
            canvas.drawRoundRect(
                RectF(
                    lcx - lensW * 0.04f, lcy - lensH * 0.34f,
                    lcx + lensW * 0.04f, lcy + lensH * 0.22f,
                ),
                lensW * 0.06f, lensW * 0.06f, fillPaint,
            )
            canvas.restore()
        }

        canvas.restore()
    }
}
