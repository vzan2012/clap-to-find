package com.vzan2012.clapfinder;

import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private Ringtone nativeAlarm;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        this.bridge.getWebView().post(new Runnable() {
            @Override
            public void run() {
                WebView webView = bridge.getWebView();
                
                // 1. Create the JavaScript-to-Java bridge interface
                webView.addJavascriptInterface(new Object() {
                    @JavascriptInterface
                    public void playAlarm() {
                        stopAlarm(); // Stop any active alarm first
                        
                        // Grab the device's default ALARM sound (falls back to Ringtone if not set)
                        Uri alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_ALARM);
                        if (alarmUri == null) {
                            alarmUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_RINGTONE);
                        }
                        
                        nativeAlarm = RingtoneManager.getRingtone(getApplicationContext(), alarmUri);
                        if (nativeAlarm != null) {
                            nativeAlarm.play();
                        }
                    }

                    @JavascriptInterface
                    public void stopAlarm() {
                        if (nativeAlarm != null && nativeAlarm.isPlaying()) {
                            nativeAlarm.stop();
                        }
                    }
                }, "AndroidAlarm"); // <-- This is the name we'll call in JS

                // 2. Keep your existing permission interceptor
                webView.setWebChromeClient(new WebChromeClient() {
                    @Override
                    public void onPermissionRequest(final PermissionRequest request) {
                        MainActivity.this.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                request.grant(request.getResources());
                            }
                        });
                    }
                });
            }
        });
    }
}