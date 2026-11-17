package io.ionic.starter

import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.material3.MaterialTheme
import androidx.compose.ui.Modifier
import androidx.core.content.ContextCompat
import com.amplifyframework.ui.liveness.ui.FaceLivenessDetector

class LivenessActivity : ComponentActivity() {

    private val cameraLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { granted ->
        if (granted) mostrarDetector() else cerrarConError("Permiso de camara denegado")
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
            == PackageManager.PERMISSION_GRANTED) {
            mostrarDetector()
        } else {
            cameraLauncher.launch(Manifest.permission.CAMERA)
        }
    }

    private fun mostrarDetector() {
        val sessionId = intent.getStringExtra("sessionId")
            ?: return cerrarConError("Sin sessionId")
        val region = intent.getStringExtra("region") ?: "us-east-2"

        setContent {
            MaterialTheme {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .windowInsetsPadding(WindowInsets.safeDrawing)
                ) {
                    FaceLivenessDetector(
                        sessionId = sessionId,
                        region = region,
                        onComplete = {
                            setResult(Activity.RESULT_OK, Intent().putExtra("completed", true))
                            finish()
                        },
                        onError = { error ->
                            val causas = generateSequence(error.throwable) { it.cause }
                                .take(8)
                                .joinToString(" -> ") { it.javaClass.name }
                            Log.e(
                                "FaceLiveness",
                                "onError tipo=${error.javaClass.name} mensaje=${error.message} " +
                                    "recomendacion=${error.recoverySuggestion} causas=$causas",
                                error.throwable
                            )
                            cerrarConError(error.message ?: "Fallo prueba de vida")
                        }
                    )
                }
            }
        }
    }

    private fun cerrarConError(mensaje: String) {
        setResult(Activity.RESULT_CANCELED, Intent().putExtra("error", mensaje))
        finish()
    }
}
