import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Plus, Mic, MicOff, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { groq } from "@/lib/groq";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import genieLogo from "@/assets/genie-logo3.jpeg";

interface Message {
    sender: "user" | "genie";
    text: string;
    time: string;
}

const getTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const SYSTEM_PROMPT = `You are Career Genie, an expert AI career counselor specialized in helping Pakistani students and professionals. You provide guidance on:
- Career paths and job market trends in Pakistan and globally
- Resume building and optimization
- Interview preparation and tips
- Skill development recommendations
- Salary negotiations
- Higher education and certifications
Keep responses concise, friendly, and actionable.`;

const ChatPage = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>(() => {
        const saved = localStorage.getItem("cg_chat");
        return saved
            ? JSON.parse(saved)
            : [
                {
                    sender: "genie",
                    text: "Hello! I'm Career Genie, your AI career mentor. Ask me anything about career paths, skills, resume tips, or interview prep. I'm specialized in the Pakistani job market! 🚀",
                    time: getTime(),
                },
            ];
    });
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const messagesRef = useRef(messages);
    useEffect(() => { messagesRef.current = messages; }, [messages]);

    useEffect(() => {
        localStorage.setItem("cg_chat", JSON.stringify(messages.slice(-100)));
    }, [messages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const startNewChat = () => {
        if (window.confirm("Start a new session? This will clear the current conversation.")) {
            const reset: Message[] = [
                {
                    sender: "genie",
                    text: "Fresh start! What career goal would you like to work on today?",
                    time: getTime(),
                },
            ];
            setMessages(reset);
            localStorage.removeItem("cg_chat");
        }
    };

    const doSend = useCallback(async (text: string) => {
        if (!text.trim() || isTyping) return;
        const userText = text.trim();
        setMessages((prev) => [...prev, { sender: "user", text: userText, time: getTime() }]);
        setInput("");
        setIsTyping(true);
        try {
            const history = messagesRef.current.slice(-10).map((m) => ({
                role: m.sender === "user" ? "user" as const : "assistant" as const,
                content: m.text,
            }));
            const completion = await groq.chat.completions.create({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    ...history,
                    { role: "user", content: userText },
                ],
                max_tokens: 1024,
                temperature: 0.7,
            });
            const reply = completion.choices[0]?.message?.content || "I couldn't generate a response. Try again!";
            setMessages((prev) => [...prev, { sender: "genie", text: reply, time: getTime() }]);
        } catch {
            setMessages((prev) => [...prev, {
                sender: "genie",
                text: "Something went wrong connecting to the AI. Check your API key in the .env file.",
                time: getTime(),
            }]);
        } finally {
            setIsTyping(false);
        }
    }, [isTyping]);

    const sendMessage = (e: React.FormEvent) => { e.preventDefault(); doSend(input); };

    // Voice — auto-sends after transcription; press-and-hold on mobile
    const onTranscript = useCallback((text: string) => { doSend(text); }, [doSend]);
    const { recording, transcribing, toggle: toggleVoice, start: startVoice, stop: stopVoice } = useVoiceRecorder(onTranscript);

    const handleMicPointerDown = useCallback((e: React.PointerEvent) => {
        if (e.pointerType === "touch") {
            e.preventDefault(); // prevents click from also firing
            if (!recording && !transcribing) startVoice();
        }
    }, [recording, transcribing, startVoice]);

    const handleMicPointerUp = useCallback((e: React.PointerEvent) => {
        if (e.pointerType === "touch" && recording) stopVoice();
    }, [recording, stopVoice]);

    const handleMicPointerLeave = useCallback((e: React.PointerEvent) => {
        if (e.pointerType === "touch" && recording) stopVoice();
    }, [recording, stopVoice]);

    const displayName = user?.displayName || user?.email?.split("@")[0] || "You";
    const initials = displayName.slice(0, 2).toUpperCase();

    return (
        <div className="flex flex-col h-screen bg-background">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-card/40 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-gold flex items-center justify-center shadow-[0_0_20px_hsl(48_96%_53%_/_0.4)]">
                        <img src={genieLogo} alt="Genie" className="w-6 h-6 object-contain" />
                    </div>
                    <div>
                        <h2 className="font-display font-bold">AI Career Mentor</h2>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            Online · Powered by Llama 3.3
                        </div>
                    </div>
                </div>
                <button
                    onClick={startNewChat}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" /> New Session
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto w-full space-y-6">
                    {messages.map((msg, i) => (
                        <div key={i} className={cn("flex items-end gap-3", msg.sender === "user" && "flex-row-reverse")}>
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold",
                                msg.sender === "genie"
                                    ? "bg-gradient-gold text-primary-foreground"
                                    : "bg-secondary text-foreground"
                            )}>
                                {msg.sender === "genie" ? <img src={genieLogo} alt="Genie" className="w-5 h-5 object-contain" /> : initials}
                            </div>

                            <div className={cn(
                                "max-w-[70%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                                msg.sender === "genie"
                                    ? "bg-card border border-border/60 rounded-bl-sm text-foreground"
                                    : "bg-primary text-primary-foreground rounded-br-sm"
                            )}>
                                <p className="whitespace-pre-wrap">{msg.text}</p>
                                <p className={cn(
                                    "text-[10px] mt-1.5",
                                    msg.sender === "genie" ? "text-muted-foreground" : "text-primary-foreground/70"
                                )}>
                                    {msg.time}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Typing indicator */}
                    {isTyping && (
                        <div className="flex items-end gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center">
                                <img src={genieLogo} alt="Genie" className="w-5 h-5 object-contain" />
                            </div>
                            <div className="bg-card border border-border/60 rounded-2xl rounded-bl-sm px-4 py-3">
                                <div className="flex gap-1">
                                    {[0, 1, 2].map((i) => (
                                        <span
                                            key={i}
                                            className="w-2 h-2 rounded-full bg-primary/60 animate-bounce"
                                            style={{ animationDelay: `${i * 150}ms` }}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={bottomRef} />
                </div>
            </div>

            {/* Input */}
            <div className="shrink-0 px-4 pb-6 pt-3 border-t border-border/60 bg-card/20 backdrop-blur-sm">
                <form
                    onSubmit={sendMessage}
                    className="max-w-3xl mx-auto flex items-center gap-3 glass-card rounded-2xl px-4 py-3"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={recording ? "Listening…" : transcribing ? "Transcribing…" : "Ask about jobs, skills, career paths..."}
                        disabled={isTyping}
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                    <button
                        type="button"
                        onClick={toggleVoice}
                        onPointerDown={handleMicPointerDown}
                        onPointerUp={handleMicPointerUp}
                        onPointerLeave={handleMicPointerLeave}
                        onPointerCancel={handleMicPointerLeave}
                        disabled={transcribing || isTyping}
                        title={recording ? "Release to send" : "Hold to speak (mobile) · Click to toggle (desktop)"}
                        className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center transition-all shrink-0 select-none",
                            recording
                                ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                                : "bg-secondary text-muted-foreground hover:text-foreground border border-border/60 disabled:opacity-40"
                        )}
                    >
                        {transcribing
                            ? <Loader2 className="w-4 h-4 animate-spin" />
                            : recording
                                ? <MicOff className="w-4 h-4" />
                                : <Mic className="w-4 h-4" />}
                    </button>
                    <button
                        type="submit"
                        disabled={isTyping || !input.trim()}
                        className="w-9 h-9 rounded-xl bg-gradient-gold flex items-center justify-center disabled:opacity-40 hover:shadow-[0_0_20px_hsl(48_96%_53%_/_0.5)] transition-all shrink-0"
                    >
                        <Send className="w-4 h-4 text-primary-foreground" />
                    </button>
                </form>
                <p className="text-center text-xs text-muted-foreground mt-2">
                    Career Genie AI · Specialized for Pakistani job market
                </p>
            </div>
        </div>
    );
};

export default ChatPage;