import { useState, useRef, useCallback } from "react";
import { toast } from "sonner";

async function transcribeAudio(blob: Blob, mimeType: string): Promise<string> {
    const ext = mimeType.includes("ogg") ? "ogg" : mimeType.includes("mp4") ? "mp4" : "webm";
    const file = new File([blob], `voice.${ext}`, { type: mimeType });

    const form = new FormData();
    form.append("file", file, file.name);
    form.append("model", "whisper-large-v3-turbo");

    const res = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
        method: "POST",
        headers: { Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}` },
        body: form,
    });

    if (!res.ok) throw new Error(`Groq ${res.status}`);
    const data = await res.json() as { text: string };
    return data.text.trim();
}

/**
 * Cross-browser voice recorder. Records via MediaRecorder, transcribes via
 * Groq Whisper. onTranscript is called with the final text after recording stops.
 */
export function useVoiceRecorder(onTranscript: (text: string) => void) {
    const [recording, setRecording] = useState(false);
    const [transcribing, setTranscribing] = useState(false);
    const recorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const start = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = async () => {
                stream.getTracks().forEach((t) => t.stop());
                const mimeType = recorder.mimeType || "audio/webm";
                const blob = new Blob(chunksRef.current, { type: mimeType });

                setTranscribing(true);
                try {
                    const text = await transcribeAudio(blob, mimeType);
                    if (text) onTranscript(text);
                    else toast.info("Didn't catch that — try again.");
                } catch {
                    toast.error("Transcription failed. Check your API key and try again.");
                } finally {
                    setTranscribing(false);
                }
            };

            recorderRef.current = recorder;
            recorder.start();
            setRecording(true);
        } catch {
            toast.error("Microphone access denied. Allow microphone in your browser settings.");
        }
    }, [onTranscript]);

    const stop = useCallback(() => {
        recorderRef.current?.stop();
        setRecording(false);
    }, []);

    const toggle = useCallback(() => {
        if (recording) stop();
        else start();
    }, [recording, start, stop]);

    return { recording, transcribing, toggle, start, stop };
}
