import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import { auth } from "@/lib/firebase";

// See src/lib/ai.ts for why this is needed on Cloudflare Pages.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function transcribeAudio(blob: Blob, mimeType: string): Promise<string> {
    const token = await auth.currentUser?.getIdToken();
    if (!token) throw new Error("Not signed in");

    const res = await fetch(`${API_BASE}/api/ai/transcribe`, {
        method: "POST",
        headers: { "Content-Type": mimeType, Authorization: `Bearer ${token}` },
        body: blob,
    });

    if (!res.ok) throw new Error(`Transcribe ${res.status}`);
    const data = (await res.json()) as { text: string };
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
    const startingRef = useRef(false);

    const start = useCallback(async () => {
        if (startingRef.current || recorderRef.current) return; // already starting/recording
        startingRef.current = true;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            chunksRef.current = [];

            recorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            recorder.onstop = async () => {
                stream.getTracks().forEach((t) => t.stop());
                recorderRef.current = null;
                const mimeType = recorder.mimeType || "audio/webm";
                const blob = new Blob(chunksRef.current, { type: mimeType });

                setTranscribing(true);
                try {
                    const text = await transcribeAudio(blob, mimeType);
                    if (text) onTranscript(text);
                    else toast.info("Didn't catch that — try again.");
                } catch {
                    toast.error("Transcription failed. Please try again.");
                } finally {
                    setTranscribing(false);
                }
            };

            recorderRef.current = recorder;
            recorder.start();
            setRecording(true);
        } catch {
            toast.error("Microphone access denied. Allow microphone in your browser settings.");
        } finally {
            startingRef.current = false;
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

    // Stop any live recording (and release the mic) if the owning component unmounts.
    useEffect(() => {
        return () => {
            recorderRef.current?.stop();
            recorderRef.current = null;
        };
    }, []);

    return { recording, transcribing, toggle, start, stop };
}
