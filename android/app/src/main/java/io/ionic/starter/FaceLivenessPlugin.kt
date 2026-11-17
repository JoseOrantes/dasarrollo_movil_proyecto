package io.ionic.starter

import android.app.Activity
import android.content.Intent
import android.util.Log
import androidx.activity.result.ActivityResult
import com.amplifyframework.auth.cognito.AWSCognitoAuthPlugin
import com.amplifyframework.core.Amplify
import com.amplifyframework.logging.AndroidLoggingPlugin
import com.amplifyframework.logging.LogLevel
import com.getcapacitor.JSObject
import com.getcapacitor.Plugin
import com.getcapacitor.PluginCall
import com.getcapacitor.PluginMethod
import com.getcapacitor.annotation.ActivityCallback
import com.getcapacitor.annotation.CapacitorPlugin

@CapacitorPlugin(name = "FaceLiveness")
class FaceLivenessPlugin : Plugin() {

    companion object {
        private var amplifyListo = false
    }

    override fun load() {
        super.load()
        if (!amplifyListo) {
            try {
                Amplify.addPlugin(AndroidLoggingPlugin(LogLevel.DEBUG))
                Amplify.addPlugin(AWSCognitoAuthPlugin())
                Amplify.configure(context.applicationContext)
                amplifyListo = true
            } catch (e: Exception) {
                Log.e("FaceLiveness", "Error configurando Amplify", e)
            }
        }
    }

    @PluginMethod
    fun startLiveness(call: PluginCall) {
        val sessionId = call.getString("sessionId") ?: return call.reject("Falta sessionId")
        val region = call.getString("region", "us-east-2")

        val intent = Intent(context, LivenessActivity::class.java).apply {
            putExtra("sessionId", sessionId)
            putExtra("region", region)
        }
        startActivityForResult(call, intent, "onResultadoLiveness")
    }

    @ActivityCallback
    private fun onResultadoLiveness(call: PluginCall?, result: ActivityResult) {
        if (call == null) return
        if (result.resultCode == Activity.RESULT_OK) {
            call.resolve(JSObject().put("completed", true))
        } else {
            val errorMsg = result.data?.getStringExtra("error") ?: "Cancelado"
            call.reject(errorMsg)
        }
    }
}
