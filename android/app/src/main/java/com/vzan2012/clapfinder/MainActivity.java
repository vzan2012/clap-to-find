package com.vzan2012.clapfinder;

import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.WebChromeClient;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Wait for the Capacitor webview bridge to initialize
        this.bridge.getWebView().post(new Runnable() {
            @Override
            public void run() {
                WebView webView = bridge.getWebView();
                
                // Intercept web runtime hardware requests and grant them natively
                webView.setWebChromeClient(new WebChromeClient() {
                    @Override
                    public void onPermissionRequest(final PermissionRequest request) {
                        MainActivity.this.runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                // Explicitly grants the WebView wrapper permission to grab the microphone stream
                                request.grant(request.getResources());
                            }
                        });
                    }
                });
            }
        });
    }
}