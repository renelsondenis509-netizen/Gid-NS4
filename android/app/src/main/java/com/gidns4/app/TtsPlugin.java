package com.gidns4.app;

import android.speech.tts.TextToSpeech;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.Locale;

@CapacitorPlugin(name = "Tts")
public class TtsPlugin extends Plugin implements TextToSpeech.OnInitListener {
    private TextToSpeech tts;
    private boolean ready = false;

    @Override
    public void load() {
        tts = new TextToSpeech(getContext(), this);
    }

    @Override
    public void onInit(int status) {
        if (status != TextToSpeech.SUCCESS) return;
        int result = tts.setLanguage(Locale.FRENCH);
        if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
            result = tts.setLanguage(new Locale("fr"));
            if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                tts.setLanguage(Locale.getDefault());
            }
        }
        ready = true;
    }

    @PluginMethod
    public void speak(PluginCall call) {
        if (!ready) { call.reject("TTS not ready"); return; }
        String text = call.getString("text", "");
        if (text.isEmpty()) { call.resolve(); return; }
        float rate = call.getFloat("rate", 0.9f);
        tts.setSpeechRate(rate);
        tts.stop();
        tts.speak(text, TextToSpeech.QUEUE_FLUSH, null, "gidns4_tts");
        call.resolve();
    }

    @PluginMethod
    public void stop(PluginCall call) {
        if (ready) tts.stop();
        call.resolve();
    }
}
