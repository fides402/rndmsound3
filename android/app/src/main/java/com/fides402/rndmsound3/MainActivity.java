package com.fides402.rndmsound3;

import android.os.Bundle;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onPause() {
        super.onPause();
        // Prevent WebView from pausing media when app goes to background
        if (bridge != null) {
            WebView webView = bridge.getWebView();
            if (webView != null) {
                webView.onResume();
            }
        }
    }
}
