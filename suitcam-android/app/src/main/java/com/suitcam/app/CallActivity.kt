package com.suitcam.app

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.webkit.PermissionRequest
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.ContextCompat
import com.suitcam.app.databinding.ActivityCallBinding
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

/**
 * Rozmowa na żywo z filtrem: otwiera dowolne spotkanie webowe (Jitsi itp.)
 * w WebView i podmienia w nim kamerę na obraz z nałożonym garniturem
 * i okularami. Rozmówca dołącza zwykłym linkiem w przeglądarce.
 *
 * Jak to działa: kamera + ML Kit + SuitRenderer produkują klatki MJPEG na
 * lokalnym porcie (tylko wewnątrz telefonu), a wstrzyknięty skrypt podmienia
 * navigator.mediaDevices.getUserMedia tak, by strona spotkania zamiast
 * prawdziwej kamery dostała strumień z canvasa rysującego te klatki.
 */
class CallActivity : AppCompatActivity() {

    private lateinit var binding: ActivityCallBinding
    private lateinit var cameraExecutor: ExecutorService
    private var analyzer: FaceAnalyzer? = null
    private val streamEngine = StreamEngine(port = LOCAL_PORT)

    private val micPermission = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (!granted) {
            Toast.makeText(this, R.string.call_mic_denied, Toast.LENGTH_LONG).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCallBinding.inflate(layoutInflater)
        setContentView(binding.root)

        cameraExecutor = Executors.newSingleThreadExecutor()

        binding.callUrl.setText(defaultRoomUrl())
        binding.joinButton.setOnClickListener { joinCall() }
        binding.shareButton.setOnClickListener { shareLink() }

        setupWebView()

        try {
            streamEngine.start()
        } catch (e: Exception) {
            Toast.makeText(this, R.string.stream_failed, Toast.LENGTH_LONG).show()
        }

        if (ContextCompat.checkSelfPermission(this, Manifest.permission.RECORD_AUDIO)
            != PackageManager.PERMISSION_GRANTED
        ) {
            micPermission.launch(Manifest.permission.RECORD_AUDIO)
        }
    }

    override fun onResume() {
        super.onResume()
        startCameraAnalysis()
    }

    private fun defaultRoomUrl(): String =
        "https://meet.ffmuc.net/SuitCam" + (1000..9999).random()

    /** Kamera bez podglądu: tylko analiza twarzy zasilająca lokalny strumień. */
    private fun startCameraAnalysis() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
            != PackageManager.PERMISSION_GRANTED
        ) {
            Toast.makeText(this, R.string.camera_permission_denied, Toast.LENGTH_LONG).show()
            return
        }
        val providerFuture = ProcessCameraProvider.getInstance(this)
        providerFuture.addListener({
            val provider = providerFuture.get()
            analyzer?.close()
            val faceAnalyzer = FaceAnalyzer(frameSink = streamEngine) { _, _, _ -> }
            analyzer = faceAnalyzer
            val analysis = ImageAnalysis.Builder()
                .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                .build()
                .also { it.setAnalyzer(cameraExecutor, faceAnalyzer) }
            try {
                provider.unbindAll()
                provider.bindToLifecycle(this, CameraSelector.DEFAULT_FRONT_CAMERA, analysis)
            } catch (e: Exception) {
                Toast.makeText(this, R.string.camera_start_failed, Toast.LENGTH_LONG).show()
            }
        }, ContextCompat.getMainExecutor(this))
    }

    private fun setupWebView() {
        val settings = binding.webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.mediaPlaybackRequiresUserGesture = false
        // Strona spotkania jest https, a lokalny strumień http://127.0.0.1 —
        // wewnątrz WebView to bezpieczne (ruch nie opuszcza telefonu).
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        settings.userAgentString =
            "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 " +
                "(KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36"

        binding.webView.webChromeClient = object : WebChromeClient() {
            override fun onPermissionRequest(request: PermissionRequest) {
                runOnUiThread { request.grant(request.resources) }
            }
        }

        val patch = buildCameraPatchScript(LOCAL_PORT)
        binding.webView.webViewClient = object : WebViewClient() {
            // navigator.mediaDevices istnieje od początku życia strony, więc
            // patch nakładamy jak najwcześniej (start) i ponawiamy po załadowaniu.
            // Znacznik __suitcam chroni przed podwójnym patchem.
            override fun onPageStarted(view: WebView, url: String?, favicon: android.graphics.Bitmap?) {
                view.evaluateJavascript(patch, null)
            }

            override fun onPageFinished(view: WebView, url: String) {
                view.evaluateJavascript(patch, null)
            }
        }
    }

    private fun joinCall() {
        val url = binding.callUrl.text.toString().trim()
        if (url.isEmpty()) return
        binding.webView.loadUrl(url)
    }

    private fun shareLink() {
        val url = binding.callUrl.text.toString().trim()
        if (url.isEmpty()) return
        val intent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, getString(R.string.call_share_text, url))
        }
        startActivity(Intent.createChooser(intent, getString(R.string.call_share)))
    }

    /**
     * Skrypt podmieniający getUserMedia: wideo pochodzi z canvasa rysującego
     * lokalny strumień MJPEG z filtrem, audio z prawdziwego mikrofonu.
     */
    private fun buildCameraPatchScript(port: Int): String = """
        (function() {
          if (!navigator.mediaDevices || navigator.mediaDevices.__suitcam) return;
          navigator.mediaDevices.__suitcam = true;
          var origGUM = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
          var videoPromise = null;
          function filteredVideo() {
            if (videoPromise) return videoPromise;
            videoPromise = new Promise(function(resolve, reject) {
              var img = new Image();
              img.crossOrigin = 'anonymous';
              var canvas = document.createElement('canvas');
              var ctx = canvas.getContext('2d');
              var started = false;
              img.onload = function() {
                if (started) return;
                started = true;
                canvas.width = img.naturalWidth || 640;
                canvas.height = img.naturalHeight || 480;
                setInterval(function() {
                  try { ctx.drawImage(img, 0, 0, canvas.width, canvas.height); } catch (e) {}
                }, 66);
                resolve(canvas.captureStream(15));
              };
              img.onerror = function() {
                if (!started) reject(new Error('SuitCam: brak strumienia z kamery'));
              };
              img.src = 'http://127.0.0.1:$port/';
              setTimeout(function() {
                if (!started) reject(new Error('SuitCam: timeout strumienia'));
              }, 8000);
            });
            return videoPromise;
          }
          navigator.mediaDevices.getUserMedia = function(constraints) {
            constraints = constraints || {};
            if (!constraints.video) return origGUM(constraints);
            return filteredVideo().then(function(v) {
              var out = new MediaStream();
              v.getVideoTracks().forEach(function(t) { out.addTrack(t); });
              if (constraints.audio) {
                return origGUM({ audio: constraints.audio }).then(function(a) {
                  a.getAudioTracks().forEach(function(t) { out.addTrack(t); });
                  return out;
                });
              }
              return out;
            });
          };
        })();
    """.trimIndent()

    override fun onDestroy() {
        super.onDestroy()
        streamEngine.stop()
        analyzer?.close()
        cameraExecutor.shutdown()
        binding.webView.destroy()
    }

    companion object {
        // Port inny niż 8080, żeby nie kolidować ze streamem z głównego ekranu.
        private const val LOCAL_PORT = 8087
    }
}
