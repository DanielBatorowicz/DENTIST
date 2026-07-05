package com.suitcam.app

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.ImageProxy
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.ContextCompat
import com.suitcam.app.databinding.ActivityMainBinding
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var cameraExecutor: ExecutorService

    private var lensFacing = CameraSelector.LENS_FACING_FRONT
    private var imageCapture: ImageCapture? = null
    private var analyzer: FaceAnalyzer? = null
    private val streamEngine = StreamEngine(port = 8080)

    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { results ->
        if (results[Manifest.permission.CAMERA] == true) {
            startCamera()
        } else {
            Toast.makeText(this, R.string.camera_permission_denied, Toast.LENGTH_LONG).show()
            finish()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        cameraExecutor = Executors.newSingleThreadExecutor()

        binding.captureButton.setOnClickListener { takePhoto() }
        binding.switchButton.setOnClickListener { switchCamera() }
        binding.streamButton.setOnClickListener { toggleStream() }

        requestPermissionsIfNeeded()
    }

    private fun requestPermissionsIfNeeded() {
        val needed = mutableListOf(Manifest.permission.CAMERA)
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.P) {
            needed += Manifest.permission.WRITE_EXTERNAL_STORAGE
        }
        val missing = needed.any {
            ContextCompat.checkSelfPermission(this, it) != PackageManager.PERMISSION_GRANTED
        }
        if (missing) {
            permissionLauncher.launch(needed.toTypedArray())
        } else {
            startCamera()
        }
    }

    private fun startCamera() {
        val providerFuture = ProcessCameraProvider.getInstance(this)
        providerFuture.addListener({
            val provider = providerFuture.get()
            bindCameraUseCases(provider)
        }, ContextCompat.getMainExecutor(this))
    }

    private fun bindCameraUseCases(provider: ProcessCameraProvider) {
        val selector = CameraSelector.Builder()
            .requireLensFacing(lensFacing)
            .build()

        val preview = Preview.Builder().build().also {
            it.setSurfaceProvider(binding.previewView.surfaceProvider)
        }

        val capture = ImageCapture.Builder()
            .setCaptureMode(ImageCapture.CAPTURE_MODE_MINIMIZE_LATENCY)
            .build()
        imageCapture = capture

        analyzer?.close()
        val faceAnalyzer = FaceAnalyzer(frameSink = streamEngine) { faces, width, height ->
            binding.overlay.update(faces, width, height)
        }
        analyzer = faceAnalyzer

        val analysis = ImageAnalysis.Builder()
            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
            .build()
            .also { it.setAnalyzer(cameraExecutor, faceAnalyzer) }

        binding.overlay.isMirrored = lensFacing == CameraSelector.LENS_FACING_FRONT
        binding.overlay.clear()

        try {
            provider.unbindAll()
            provider.bindToLifecycle(this, selector, preview, capture, analysis)
        } catch (e: Exception) {
            Toast.makeText(this, R.string.camera_start_failed, Toast.LENGTH_LONG).show()
        }
    }

    private fun toggleStream() {
        if (streamEngine.isRunning) {
            streamEngine.stop()
            binding.streamInfo.visibility = android.view.View.GONE
            binding.streamButton.setText(R.string.stream_start)
            return
        }
        try {
            streamEngine.start()
        } catch (e: Exception) {
            Toast.makeText(this, R.string.stream_failed, Toast.LENGTH_LONG).show()
            return
        }
        val url = streamEngine.streamUrl()
        if (url == null) {
            streamEngine.stop()
            Toast.makeText(this, R.string.stream_no_wifi, Toast.LENGTH_LONG).show()
            return
        }
        binding.streamInfo.text = getString(R.string.stream_info, url)
        binding.streamInfo.visibility = android.view.View.VISIBLE
        binding.streamButton.setText(R.string.stream_stop)
    }

    private fun switchCamera() {
        lensFacing = if (lensFacing == CameraSelector.LENS_FACING_FRONT) {
            CameraSelector.LENS_FACING_BACK
        } else {
            CameraSelector.LENS_FACING_FRONT
        }
        startCamera()
    }

    private fun takePhoto() {
        val capture = imageCapture ?: return
        binding.captureButton.isEnabled = false
        Toast.makeText(this, R.string.processing_photo, Toast.LENGTH_SHORT).show()

        capture.takePicture(
            cameraExecutor,
            object : ImageCapture.OnImageCapturedCallback() {
                override fun onCaptureSuccess(image: ImageProxy) {
                    PhotoProcessor.processAndSave(
                        context = this@MainActivity,
                        image = image,
                        mirrored = lensFacing == CameraSelector.LENS_FACING_FRONT,
                        ioExecutor = cameraExecutor,
                    ) { saved ->
                        runOnUiThread {
                            binding.captureButton.isEnabled = true
                            val message = if (saved) R.string.photo_saved else R.string.photo_save_failed
                            Toast.makeText(this@MainActivity, message, Toast.LENGTH_LONG).show()
                        }
                    }
                }

                override fun onError(exception: ImageCaptureException) {
                    runOnUiThread {
                        binding.captureButton.isEnabled = true
                        Toast.makeText(
                            this@MainActivity, R.string.photo_save_failed, Toast.LENGTH_LONG
                        ).show()
                    }
                }
            }
        )
    }

    override fun onDestroy() {
        super.onDestroy()
        streamEngine.stop()
        analyzer?.close()
        cameraExecutor.shutdown()
    }
}
