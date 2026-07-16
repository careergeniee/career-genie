import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Plus, Mic, MicOff, Loader2, Reply, X, Copy, Trash2, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { aiChat, AiProxyError } from "@/lib/ai";
import { useVoiceRecorder } from "@/hooks/useVoiceRecorder";
import { loadData, saveData, removeData, KEYS } from "@/lib/userStore";
import { loadAssessment, loadPrediction, traitScore, analyzeSkillGap, strongSkillsText } from "@/lib/careerEngine";
import { PERSONALITY, TRAIT_LABEL } from "@/lib/mlSchema";
import type { Roadmap } from "@/lib/roadmap";
import { DIFFICULTIES, type InterviewSession } from "@/lib/interview";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import genieLogo from "@/assets/genie-logo3.png";

interface ReplySnippet {
    id: string;
    sender: "user" | "genie";
    text: string;
}

interface Message {
    id: string;
    sender: "user" | "genie";
    text: string;
    time: string;
    replyTo?: ReplySnippet;
}

const MAX_INPUT_LENGTH = 2000;
const REPLY_SNIPPET_LENGTH = 200;
const LONG_PRESS_MS = 450;
const LONG_PRESS_MOVE_TOLERANCE = 10;

const genId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

const getTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

const defaultMessages = (): Message[] => [
    {
        id: genId(),
        sender: "genie",
        text: "Hello! I'm Career Genie, your AI career mentor. Ask me anything about career paths, skills, resume tips, or interview prep. I'm specialized in the Pakistani job market! 🚀",
        time: getTime(),
    },
];

const SYSTEM_PROMPT = `You are Career Genie, an AI career counselor built exclusively for Pakistani students and professionals.

You are ONLY allowed to answer questions related to:
- Career paths and job market trends (Pakistan and globally)
- Resume and CV writing, optimization, and ATS tips
- Interview preparation, mock questions, and feedback
- Skill development and learning roadmaps
- Salary expectations and negotiations
- Higher education, degrees, and certifications
- Freelancing and remote work opportunities
- Career assessments and personality fit

If the user asks about ANYTHING outside these topics — such as general knowledge, politics, religion, entertainment, coding help unrelated to career, math problems, or any other off-topic subject — you must politely decline with this exact message:
"I'm here to help with career-related questions only. This topic is outside my scope — feel free to ask me about career paths, resume tips, interview prep, or the job market in Pakistan!"

Never break this rule, even if the user insists or rephrases the question. Stay focused on career guidance only.
Keep responses concise, friendly, and actionable.`;

/** Summarizes the user's assessment, resume, roadmap progress, and interview history so the AI can personalize advice. */
const buildUserContext = (): string | null => {
    const assessment = loadAssessment();
    const prediction = loadPrediction();
    const lines: string[] = [];

    if (prediction) {
        const topPct = Math.round((prediction.predictions[0]?.probability ?? 0) * 100);
        lines.push(`Top predicted career: ${prediction.topCareer} (~${topPct}% match).`);
        const others = prediction.predictions.slice(1, 3).map((p) => p.career);
        if (others.length) lines.push(`Other strong-fit careers: ${others.join(", ")}.`);
    }

    if (assessment) {
        const topTraits = PERSONALITY
            .map((t) => ({ t, score: traitScore(t, assessment.personalityAnswers) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .map((x) => TRAIT_LABEL[x.t]);
        if (topTraits.length) lines.push(`Strongest personality traits: ${topTraits.join(", ")}.`);

        const strongSkills = strongSkillsText(assessment.skillRatings);
        if (strongSkills) lines.push(`Self-rated strong skills: ${strongSkills}.`);

        if (prediction) {
            const gaps = analyzeSkillGap(prediction.topCareer, assessment.skillRatings)
                .filter((g) => g.status !== "strong")
                .slice(0, 4)
                .map((g) => g.label);
            if (gaps.length) lines.push(`Skill gaps for their top career match (${prediction.topCareer}): ${gaps.join(", ")}.`);
        }
    }

    const resumeRole = loadData<string>(KEYS.resumeRole, "");
    if (resumeRole) lines.push(`Resume target role: ${resumeRole}.`);

    const roadmap = loadData<Roadmap | null>(KEYS.roadmap, null);
    if (roadmap?.goal) {
        const allTasks = roadmap.phases.flatMap((p) => p.tasks);
        const doneCount = allTasks.filter((t) => t.done).length;
        const currentPhase = roadmap.phases.find((p) => p.tasks.some((t) => !t.done));
        if (currentPhase) {
            const phaseDone = currentPhase.tasks.filter((t) => t.done).length;
            lines.push(
                `Learning roadmap "${roadmap.goal}": ${doneCount}/${allTasks.length} tasks done overall, ` +
                `currently on phase "${currentPhase.title}" (${phaseDone}/${currentPhase.tasks.length} tasks done there).`
            );
        } else if (allTasks.length) {
            lines.push(`Learning roadmap "${roadmap.goal}": fully completed (${allTasks.length}/${allTasks.length} tasks)!`);
        }
    }

    // Most recently prepended finished session is the latest attempt.
    const finishedInterviews = loadData<InterviewSession[]>(KEYS.interviewSessions, []).filter((s) => s.finished);
    if (finishedInterviews.length) {
        const latest = finishedInterviews[0];
        const daysAgo = Math.floor((Date.now() - latest.date) / 86_400_000);
        const when = daysAgo <= 0 ? "today" : daysAgo === 1 ? "yesterday" : `${daysAgo} days ago`;
        const difficultyLabel = DIFFICULTIES.find((d) => d.id === latest.difficulty)?.label ?? latest.difficulty;
        lines.push(`Last mock interview: ${latest.role} (${difficultyLabel}) ${when} — scored ${latest.overallScore}/100.`);
        if (finishedInterviews.length > 1) {
            const avg = Math.round(
                finishedInterviews.reduce((sum, s) => sum + s.overallScore, 0) / finishedInterviews.length
            );
            lines.push(`Completed ${finishedInterviews.length} mock interviews so far, averaging ${avg}/100.`);
        }
    }

    return lines.length ? lines.join("\n") : null;
};

const ChatPage = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState<Message[]>(() => {
        const loaded = loadData<Message[]>(KEYS.chat, defaultMessages());
        // Backfills ids for chats saved before the reply feature existed.
        return loaded.map((m) => (m.id ? m : { ...m, id: genId() }));
    });
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [replyingTo, setReplyingTo] = useState<Message | null>(null);
    const [highlightedId, setHighlightedId] = useState<string | null>(null);
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const messagesRef = useRef(messages);
    const messageElsRef = useRef<Map<string, HTMLDivElement>>(new Map());
    const longPressRef = useRef<{ timer: ReturnType<typeof setTimeout> | null; x: number; y: number }>({ timer: null, x: 0, y: 0 });
    useEffect(() => { messagesRef.current = messages; }, [messages]);

    useEffect(() => {
        saveData(KEYS.chat, messages.slice(-100));
    }, [messages]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isTyping]);

    const startNewChat = () => {
        toast("Clear this conversation?", {
            description: "This will start a fresh session.",
            action: {
                label: "Yes, clear",
                onClick: () => {
                    const reset: Message[] = [{
                        id: genId(),
                        sender: "genie",
                        text: "Fresh start! What career goal would you like to work on today?",
                        time: getTime(),
                    }];
                    setMessages(reset);
                    setReplyingTo(null);
                    setActiveMenuId(null);
                    removeData(KEYS.chat);
                },
            },
            cancel: { label: "Cancel", onClick: () => {} },
        });
    };

    const cancelReply = () => setReplyingTo(null);

    const scrollToMessage = (id: string) => {
        const el = messageElsRef.current.get(id);
        if (!el) {
            toast.info("That message was deleted.");
            return;
        }
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightedId(id);
        window.setTimeout(() => setHighlightedId((cur) => (cur === id ? null : cur)), 1500);
    };

    const clearLongPress = () => {
        if (longPressRef.current.timer) {
            clearTimeout(longPressRef.current.timer);
            longPressRef.current.timer = null;
        }
    };

    // Mirrors WhatsApp's press-and-hold gesture; a move past the tolerance cancels it
    // so a scroll or drag on the message list doesn't accidentally pop the menu open.
    const handleBubblePointerDown = (id: string) => (e: React.PointerEvent) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        longPressRef.current.x = e.clientX;
        longPressRef.current.y = e.clientY;
        clearLongPress();
        longPressRef.current.timer = setTimeout(() => setActiveMenuId(id), LONG_PRESS_MS);
    };

    const handleBubblePointerMove = (e: React.PointerEvent) => {
        if (!longPressRef.current.timer) return;
        const dx = e.clientX - longPressRef.current.x;
        const dy = e.clientY - longPressRef.current.y;
        if (Math.hypot(dx, dy) > LONG_PRESS_MOVE_TOLERANCE) clearLongPress();
    };

    const handleBubbleContextMenu = (id: string) => (e: React.MouseEvent) => {
        e.preventDefault();
        setActiveMenuId(id);
    };

    const replyFromMenu = (msg: Message) => setReplyingTo(msg);

    const copyMessage = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard");
        } catch {
            toast.error("Couldn't copy — try selecting the text manually.");
        }
    };

    const deleteMessage = (id: string) => {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        setReplyingTo((cur) => (cur?.id === id ? null : cur));
    };

    const doSend = useCallback(async (text: string, replyTarget?: Message | null) => {
        if (!text.trim() || isTyping) return;
        const userText = text.trim().slice(0, MAX_INPUT_LENGTH);
        const replySnippet: ReplySnippet | undefined = replyTarget
            ? { id: replyTarget.id, sender: replyTarget.sender, text: replyTarget.text.slice(0, REPLY_SNIPPET_LENGTH) }
            : undefined;
        setMessages((prev) => [...prev, { id: genId(), sender: "user", text: userText, time: getTime(), replyTo: replySnippet }]);
        setInput("");
        setReplyingTo(null);
        setIsTyping(true);
        try {
            const history = messagesRef.current.slice(-10).map((m) => ({
                role: m.sender === "user" ? "user" as const : "assistant" as const,
                content: m.text.slice(0, MAX_INPUT_LENGTH),
            }));
            // Anchors the model's reply to the quoted message instead of just the trailing history,
            // so it stays on-topic even if the conversation has moved on since then.
            const promptContent = replySnippet
                ? `(Replying to this earlier ${replySnippet.sender === "genie" ? "response of yours" : "message of mine"}: "${replySnippet.text}")\n\n${userText}`
                : userText;
            const userContext = buildUserContext();
            const systemContent = userContext
                ? `${SYSTEM_PROMPT}\n\nContext about this specific user — use it to personalize your advice, but don't recite it back verbatim unless asked:\n${userContext}`
                : SYSTEM_PROMPT;
            const reply = await aiChat(
                [{ role: "system", content: systemContent }, ...history, { role: "user", content: promptContent }],
                { maxTokens: 1024, temperature: 0.4 }
            ) || "I couldn't generate a response. Try again!";
            setMessages((prev) => [...prev, { id: genId(), sender: "genie", text: reply, time: getTime() }]);
        } catch (err) {
            const status = err instanceof AiProxyError ? err.status : undefined;
            const message = status === 429
                ? "You're sending messages a bit too fast — please wait a moment and try again."
                : "Sorry, I couldn't connect right now. Please try again in a moment.";
            setMessages((prev) => [...prev, { id: genId(), sender: "genie", text: message, time: getTime() }]);
        } finally {
            setIsTyping(false);
        }
    }, [isTyping]);

    const sendMessage = (e: React.FormEvent) => { e.preventDefault(); doSend(input, replyingTo); };

    // Voice — auto-sends after transcription; press-and-hold on mobile
    const onTranscript = useCallback((text: string) => { doSend(text, replyingTo); }, [doSend, replyingTo]);
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
        <div className="flex flex-col h-screen">
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
                            Online
                        </div>
                    </div>
                </div>
                <button
                    onClick={startNewChat}
                    className="flex items-center gap-2 px-4 py-2 max-sm:min-h-11 rounded-xl bg-secondary hover:bg-secondary/80 text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" /> New Session
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto w-full space-y-6">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            ref={(el) => {
                                if (el) messageElsRef.current.set(msg.id, el);
                                else messageElsRef.current.delete(msg.id);
                            }}
                            className={cn(
                                "flex items-start gap-2 -mx-2 px-2 py-1 rounded-2xl transition-colors duration-500",
                                msg.sender === "user" && "flex-row-reverse",
                                highlightedId === msg.id && "bg-primary/10"
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold",
                                msg.sender === "genie"
                                    ? "bg-gradient-gold text-primary-foreground"
                                    : "bg-secondary text-foreground"
                            )}>
                                {msg.sender === "genie" ? <img src={genieLogo} alt="Genie" className="w-5 h-5 object-contain" /> : initials}
                            </div>

                            <DropdownMenu
                                open={activeMenuId === msg.id}
                                onOpenChange={(open) => setActiveMenuId(open ? msg.id : null)}
                            >
                                <DropdownMenuTrigger asChild>
                                    <button
                                        type="button"
                                        title="Message options"
                                        className="shrink-0 w-7 h-7 max-sm:min-w-11 max-sm:min-h-11 rounded-full flex items-center justify-center text-muted-foreground opacity-70 hover:opacity-100 hover:bg-secondary hover:text-foreground data-[state=open]:opacity-100 data-[state=open]:bg-secondary transition-opacity"
                                    >
                                        <MoreVertical className="w-3.5 h-3.5" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align={msg.sender === "user" ? "end" : "start"}
                                    className="w-52 rounded-2xl border-border/60 bg-popover/95 backdrop-blur-sm p-0 overflow-hidden shadow-xl"
                                >
                                    <DropdownMenuItem
                                        onSelect={() => replyFromMenu(msg)}
                                        className="flex items-center justify-between gap-3 rounded-none px-4 py-3 text-sm cursor-pointer focus:bg-secondary"
                                    >
                                        Reply <Reply className="w-4 h-4 shrink-0" />
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="mx-0 my-0" />
                                    <DropdownMenuItem
                                        onSelect={() => copyMessage(msg.text)}
                                        className="flex items-center justify-between gap-3 rounded-none px-4 py-3 text-sm cursor-pointer focus:bg-secondary"
                                    >
                                        Copy <Copy className="w-4 h-4 shrink-0" />
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="mx-0 my-0" />
                                    <DropdownMenuItem
                                        onSelect={() => deleteMessage(msg.id)}
                                        className="flex items-center justify-between gap-3 rounded-none px-4 py-3 text-sm cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10"
                                    >
                                        Delete <Trash2 className="w-4 h-4 shrink-0" />
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <div
                                onPointerDown={handleBubblePointerDown(msg.id)}
                                onPointerMove={handleBubblePointerMove}
                                onPointerUp={clearLongPress}
                                onPointerCancel={clearLongPress}
                                onPointerLeave={clearLongPress}
                                onContextMenu={handleBubbleContextMenu(msg.id)}
                                className={cn(
                                "max-w-[70%] min-w-0 break-words rounded-2xl px-4 py-3 text-sm leading-relaxed select-none sm:select-text",
                                msg.sender === "genie"
                                    ? "bg-card border border-border/60 rounded-bl-sm text-foreground"
                                    : "bg-primary text-primary-foreground rounded-br-sm"
                            )}>
                                {msg.replyTo && (
                                    <button
                                        type="button"
                                        onClick={() => scrollToMessage(msg.replyTo!.id)}
                                        className={cn(
                                            "block w-full text-left mb-2 pl-2 py-1 border-l-2 rounded-sm opacity-80 hover:opacity-100 transition-opacity",
                                            msg.sender === "genie" ? "border-primary/50" : "border-primary-foreground/50"
                                        )}
                                    >
                                        <span className="block text-[11px] font-semibold">
                                            {msg.replyTo.sender === "genie" ? "Career Genie" : "You"}
                                        </span>
                                        <span className="block text-xs truncate">{msg.replyTo.text}</span>
                                    </button>
                                )}
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
                {replyingTo && (
                    <div className="max-w-3xl mx-auto mb-2 flex items-center gap-2 glass-card rounded-xl pl-3 pr-2 py-2 border-l-4 border-primary">
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-primary">
                                Replying to {replyingTo.sender === "genie" ? "Career Genie" : "yourself"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">{replyingTo.text}</p>
                        </div>
                        <button
                            type="button"
                            onClick={cancelReply}
                            title="Cancel reply"
                            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
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
                        maxLength={MAX_INPUT_LENGTH}
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
                            "w-9 h-9 max-sm:min-w-11 max-sm:min-h-11 rounded-xl flex items-center justify-center transition-all shrink-0 select-none",
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
                        className="w-9 h-9 max-sm:min-w-11 max-sm:min-h-11 rounded-xl bg-gradient-gold flex items-center justify-center disabled:opacity-40 hover:shadow-[0_0_20px_hsl(48_96%_53%_/_0.5)] transition-all shrink-0"
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