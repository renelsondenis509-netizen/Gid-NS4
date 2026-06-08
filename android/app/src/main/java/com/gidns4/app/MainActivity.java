package com.gidns4.app;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(android.os.Bundle savedInstanceState) {
        registerPlugin(TtsPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
