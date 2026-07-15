import { useState } from "react";
import { Settings, User, Trash2, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { KEYS, removeData } from "@/lib/userStore";

const inputCls =
    "w-full bg-secondary/50 border border-border/60 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/70";

const SectionCard = ({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) => (
    <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
            <Icon className="w-4 h-4 text-primary" />
            <h2 className="font-display font-bold">{title}</h2>
        </div>
        {children}
    </div>
);

const DATA_KEYS: { key: keyof typeof KEYS; label: string }[] = [
    { key: "chat", label: "Chat history" },
    { key: "instructorChat", label: "Instructor chat history" },
    { key: "interviewSessions", label: "Interview sessions" },
    { key: "resume", label: "Resume data" },
    { key: "resumeTemplate", label: "Resume template preference" },
    { key: "resumeRole", label: "ATS target role" },
    { key: "assessment", label: "Career assessment answers" },
    { key: "prediction", label: "Career prediction results" },
    { key: "roadmap", label: "Career roadmap" },
    { key: "instructorTasks", label: "Instructor progress" },
];

const SettingsPage = () => {
    const { user } = useAuth();
    const [displayName, setDisplayName] = useState(user?.displayName || "");
    const [savingName, setSavingName] = useState(false);
    const [cleared, setCleared] = useState<(keyof typeof KEYS)[]>([]);

    const saveDisplayName = async () => {
        if (!displayName.trim()) {
            toast.error("Name cannot be empty");
            return;
        }
        if (!auth.currentUser) return;
        setSavingName(true);
        try {
            await updateProfile(auth.currentUser, { displayName: displayName.trim() });
            toast.success("Display name updated");
        } catch {
            toast.error("Failed to update name. Try again.");
        } finally {
            setSavingName(false);
        }
    };

    const clearKey = (key: keyof typeof KEYS, label: string) => {
        removeData(KEYS[key]);
        setCleared((prev) => [...prev, key]);
        toast.success(`${label} cleared`);
    };

    const clearAll = () => {
        if (!window.confirm("Clear ALL your data? This cannot be undone.")) return;
        DATA_KEYS.forEach(({ key }) => removeData(KEYS[key]));
        setCleared(DATA_KEYS.map((d) => d.key));
        toast.success("All local data cleared");
    };

    return (
        <div className="min-h-screen p-6 lg:p-8 max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-11 h-11 rounded-xl bg-gradient-gold flex items-center justify-center shadow-[0_0_20px_hsl(48_96%_53%_/_0.4)]">
                    <Settings className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                    <h1 className="font-display text-2xl font-bold">Settings</h1>
                    <p className="text-sm text-muted-foreground">Manage your profile and app data</p>
                </div>
            </div>

            <div className="space-y-5">
                {/* Profile */}
                <SectionCard icon={User} title="Profile">
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                Display name
                            </label>
                            <div className="flex gap-2">
                                <input
                                    className={inputCls}
                                    value={displayName}
                                    onChange={(e) => setDisplayName(e.target.value)}
                                    placeholder="Your name"
                                    onKeyDown={(e) => e.key === "Enter" && saveDisplayName()}
                                />
                                <button
                                    onClick={saveDisplayName}
                                    disabled={savingName}
                                    className="flex items-center gap-2 px-4 rounded-lg bg-gradient-gold text-primary-foreground text-sm font-semibold shrink-0 disabled:opacity-60 transition-all hover:shadow-[0_0_16px_hsl(48_96%_53%_/_0.4)]"
                                >
                                    {savingName ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                                </button>
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                                Email
                            </label>
                            <input
                                className={cn(inputCls, "opacity-60 cursor-not-allowed")}
                                value={user?.email || ""}
                                disabled
                            />
                            <p className="text-[11px] text-muted-foreground mt-1">Email cannot be changed here.</p>
                        </div>
                    </div>
                </SectionCard>

                {/* Account info */}
                <SectionCard icon={ShieldCheck} title="Account">
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between py-2 border-b border-border/40">
                            <span className="text-muted-foreground">Email verified</span>
                            <span className={cn("font-medium", user?.emailVerified ? "text-green-400" : "text-red-400")}>
                                {user?.emailVerified ? "Yes" : "No"}
                            </span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-border/40">
                            <span className="text-muted-foreground">Account created</span>
                            <span className="font-medium">
                                {user?.metadata.creationTime
                                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                                    : "—"}
                            </span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-muted-foreground">Last sign in</span>
                            <span className="font-medium">
                                {user?.metadata.lastSignInTime
                                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                                    : "—"}
                            </span>
                        </div>
                    </div>
                </SectionCard>

                {/* Data management */}
                <SectionCard icon={Trash2} title="Data Management">
                    <p className="text-xs text-muted-foreground mb-4">
                        Clears data stored locally in this browser. Clear individual sections or everything at once.
                    </p>
                    <div className="space-y-2 mb-5">
                        {DATA_KEYS.map(({ key, label }) => (
                            <div
                                key={key}
                                className="flex items-center justify-between py-2 px-3 rounded-lg bg-secondary/40 border border-border/40"
                            >
                                <span className="text-sm">{label}</span>
                                {cleared.includes(key) ? (
                                    <span className="flex items-center gap-1 text-xs text-green-400">
                                        <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                                    </span>
                                ) : (
                                    <button
                                        onClick={() => clearKey(key, label)}
                                        className="text-xs text-muted-foreground hover:text-destructive transition-colors font-medium"
                                    >
                                        Clear
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={clearAll}
                        className="w-full py-2.5 rounded-xl border border-destructive/40 text-destructive text-sm font-semibold hover:bg-destructive/10 transition-colors"
                    >
                        Clear all data
                    </button>
                </SectionCard>
            </div>
        </div>
    );
};

export default SettingsPage;
