import { useEffect, useRef, useState } from "react";
import { Loader2, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { instructorChat, loadChat, saveChat, type ChatMsg } from "@/lib/instructor";
import { useEffectSkipMount } from "@/hooks/useEffectSkipMount";
import type { TabProps } from "./types";

const STARTERS = [
    "What should I focus on this week?",
    "Am I ready to apply for jobs yet?",
    "What's the most common mistake people make in this field?",
];

export const MentorTab = ({ persona, ctx }: TabProps) => {
    const [messages, setMessages] = useState<ChatMsg[]>(loadChat());
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const endRef = useRef<HTMLDivElement>(null);

    // Skips the save that would otherwise fire on mount with whatever messages
    // loadChat() happened to seed (e.g. [] on a device Firestore hasn't
    // hydrated yet) — see useEffectSkipMount. Scrolling into view is safe to
    // run on every render including the first, so it stays a separate effect.
    useEffectSkipMount(() => saveChat(messages), [messages]);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const send = async (text: string) => {
        const content = text.trim();
        if (!content || loading) return;
        const history = [...messages, { role: "user" as const, content }];
        setMessages(history);
        setInput("");
        setLoading(true);
        try {
            const reply = await instructorChat(history, persona, ctx);
            setMessages([...history, { role: "assistant", content: reply || "…" }]);
        } catch {
            toast.error("Message failed. Try again.");
            setMessages(history);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="glass-card rounded-2xl p-6 flex flex-col h-[60vh]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {messages.length === 0 && (
                    <div className="text-center py-8">
                        <MessageSquare className="w-10 h-10 text-primary mx-auto mb-3" />
                        <p className="text-sm text-muted-foreground mb-4">Ask {persona.name} anything about your path.</p>
                        <div className="flex flex-col gap-2 max-w-sm mx-auto">
                            {STARTERS.map((s) => (
                                <button key={s} onClick={() => send(s)} className="text-sm text-left px-3 py-2 rounded-lg border border-border/60 bg-secondary/40 hover:border-primary/50 transition">
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}>
                        <div className={cn("max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
                            m.role === "user" ? "bg-gradient-gold text-primary-foreground" : "bg-secondary/60")}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-secondary/60 rounded-2xl px-4 py-2.5">
                            <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        </div>
                    </div>
                )}
                <div ref={endRef} />
            </div>

            <div className="flex gap-2 mt-4">
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && send(input)}
                    placeholder={`Message ${persona.name}…`}
                    className="flex-1 bg-secondary/50 border border-border/60 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary/60"
                />
                <button onClick={() => send(input)} disabled={loading || !input.trim()}
                    className="w-11 h-11 rounded-xl bg-gradient-gold flex items-center justify-center text-primary-foreground disabled:opacity-50 shrink-0">
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};
