import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

vi.mock("@/lib/firebase", () => ({
    auth: { currentUser: null },
    db: {},
}));

import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";

class FakeTrack {
    stop = vi.fn();
}
class FakeStream {
    private tracks = [new FakeTrack()];
    getTracks() {
        return this.tracks;
    }
}
class FakeMediaRecorder {
    static instances: FakeMediaRecorder[] = [];
    mimeType = "audio/webm";
    ondataavailable: ((e: { data: { size: number } }) => void) | null = null;
    onstop: (() => void) | null = null;
    start = vi.fn();
    stop = vi.fn(() => this.onstop?.());
    constructor(public stream: FakeStream) {
        FakeMediaRecorder.instances.push(this);
    }
}

const flush = async () => {
    await Promise.resolve();
    await Promise.resolve();
};

describe("useVoiceRecorder", () => {
    beforeEach(() => {
        FakeMediaRecorder.instances = [];
        (globalThis as unknown as { MediaRecorder: unknown }).MediaRecorder = FakeMediaRecorder;
    });

    it("aborts and releases the mic on a fast tap-and-release (stop arrives before getUserMedia resolves)", async () => {
        // Regression test: `recording` only flips true once getUserMedia +
        // MediaRecorder setup finishes. A release before that landed used to
        // see `recording` still false and call start() again -- a no-op
        // against the in-flight start -- so the mic kept recording forever.
        let resolveGetUserMedia!: (stream: FakeStream) => void;
        const stream = new FakeStream();
        Object.defineProperty(globalThis.navigator, "mediaDevices", {
            configurable: true,
            value: { getUserMedia: vi.fn(() => new Promise<FakeStream>((r) => (resolveGetUserMedia = r))) },
        });

        const { result } = renderHook(() => useVoiceRecorder(vi.fn()));

        act(() => {
            result.current.toggle(); // press -> start() begins, awaiting getUserMedia
        });
        act(() => {
            result.current.toggle(); // release before setup finishes -> should register as a stop
        });

        await act(async () => {
            resolveGetUserMedia(stream);
            await flush();
        });

        expect(stream.getTracks()[0].stop).toHaveBeenCalled();
        expect(FakeMediaRecorder.instances).toHaveLength(0);
        expect(result.current.recording).toBe(false);
    });

    it("releases the mic if the component unmounts while getUserMedia is still pending", async () => {
        let resolveGetUserMedia!: (stream: FakeStream) => void;
        const stream = new FakeStream();
        Object.defineProperty(globalThis.navigator, "mediaDevices", {
            configurable: true,
            value: { getUserMedia: vi.fn(() => new Promise<FakeStream>((r) => (resolveGetUserMedia = r))) },
        });

        const { result, unmount } = renderHook(() => useVoiceRecorder(vi.fn()));

        act(() => {
            result.current.start();
        });
        unmount();

        await act(async () => {
            resolveGetUserMedia(stream);
            await flush();
        });

        expect(stream.getTracks()[0].stop).toHaveBeenCalled();
        expect(FakeMediaRecorder.instances).toHaveLength(0);
    });

    it("still records normally when start resolves before any stop/unmount", async () => {
        let resolveGetUserMedia!: (stream: FakeStream) => void;
        const stream = new FakeStream();
        Object.defineProperty(globalThis.navigator, "mediaDevices", {
            configurable: true,
            value: { getUserMedia: vi.fn(() => new Promise<FakeStream>((r) => (resolveGetUserMedia = r))) },
        });

        const { result } = renderHook(() => useVoiceRecorder(vi.fn()));

        act(() => {
            result.current.toggle();
        });

        await act(async () => {
            resolveGetUserMedia(stream);
            await flush();
        });

        expect(FakeMediaRecorder.instances).toHaveLength(1);
        expect(result.current.recording).toBe(true);
        expect(stream.getTracks()[0].stop).not.toHaveBeenCalled();
    });
});
