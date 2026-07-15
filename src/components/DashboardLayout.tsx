import { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    Bot, FileText, MessageSquare, Map, GraduationCap,
    LogOut, Settings, ChevronRight,
    LayoutDashboard, ClipboardList, Target, Menu, X, Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import genieLogo from "@/assets/genie-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { DailyTaskReminder } from "@/components/DailyTaskReminder";
import { loadData } from "@/lib/userStore";
import { loadTasks, hasPendingTaskToday } from "@/lib/instructor";
import { currentStreak, type Roadmap } from "@/lib/roadmap";
import Iridescence from "@/components/Iridescence";

const navItems = [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Career Assessment", path: "/dashboard/assessment", icon: ClipboardList },
    { label: "Career Match", path: "/dashboard/careers", icon: Target },
    { label: "Senior Instructor", path: "/dashboard/instructor", icon: GraduationCap },
    { label: "AI Chatbot", path: "/dashboard/chat", icon: Bot },
    { label: "Resume Builder", path: "/dashboard/resume", icon: FileText },
    { label: "Interview Prep", path: "/dashboard/interview", icon: MessageSquare },
    { label: "Roadmap", path: "/dashboard/roadmap", icon: Map },
];

export const DashboardLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully");
        navigate("/");
    };

    // Keyboard-only users: Escape closes the sidebar, and focus moves into it on open
    // so Tab doesn't wander into the visually-obscured content behind the backdrop.
    useEffect(() => {
        if (!sidebarOpen) return;
        closeButtonRef.current?.focus();
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSidebarOpen(false);
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [sidebarOpen]);

    const displayName = user?.displayName || user?.email?.split("@")[0] || "Explorer";
    const initials = displayName.slice(0, 2).toUpperCase();

    // Real-data signals — no fabricated counts.
    const instructorPending = hasPendingTaskToday(loadTasks());
    const roadmap = loadData<Roadmap | null>("roadmap", null);
    const streak = roadmap ? currentStreak(roadmap.completionDates) : 0;

    return (
        <div className="min-h-screen flex relative">
            {/* Ambient animated background, tinted in the site's burnt-sienna palette —
                shared across the whole dashboard shell so every module sits on top of it. */}
            <div className="fixed inset-0 -z-10 opacity-40 pointer-events-none">
                <Iridescence color={[0.7569, 0.2667, 0.0549]} speed={0.4} amplitude={0.1} mouseReact={false} />
            </div>

            {/* Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar — hidden by default on every screen size, opens as an overlay on click.
                HUD/console styling: glass panels + a glowing rail track the active route instead
                of a solid pill-fill, echoing a targeting readout rather than a mobile nav list. */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-label="Dashboard navigation"
                className={cn(
                    "flex flex-col relative overflow-hidden dash-sidebar-bg transition-transform duration-300 shrink-0",
                    "fixed inset-y-0 left-0 z-50 w-64",
                    "shadow-[inset_-1px_0_0_hsl(19_86%_40%_/_0.15),12px_0_40px_-16px_hsl(19_86%_40%_/_0.25)]",
                    !sidebarOpen && "-translate-x-full"
                )}>
                {/* Faint circuit-grid texture, reused from the site's own .grid-bg utility */}
                <div className="absolute inset-0 grid-bg pointer-events-none" />

                {/* Logo */}
                <div className="relative flex items-center gap-1 px-4 py-5">
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-primary/40 blur-lg rounded-full animate-pulse" />
                        <img src={genieLogo} alt="Career Genie" className="relative w-11 h-11 object-contain" />
                    </div>
                    <span className="font-display font-bold text-lg tracking-tight leading-none flex-1 text-dash-sidebar-foreground">
                        Career <span className="text-primary">Genie</span>
                    </span>
                    <button
                        ref={closeButtonRef}
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-dash-sidebar-foreground transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="relative h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                {/* Nav */}
                <nav className="relative flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    <p className="px-3 pb-2 text-[10px] font-mono uppercase tracking-[0.2em] text-dash-sidebar-muted/60">
                        // Navigation
                    </p>
                    {navItems.map((item, i) => {
                        const showBadge = item.path === "/dashboard/instructor" && instructorPending;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.path === "/dashboard"}
                                onClick={() => setSidebarOpen(false)}
                                style={{ animationDelay: `${i * 40}ms` }}
                                className={({ isActive }) => cn(
                                    "relative flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group animate-fade-in-up border",
                                    isActive
                                        ? "bg-primary/10 text-primary border-primary/30 shadow-[0_0_16px_hsl(19_86%_40%_/_0.15)]"
                                        : "text-dash-sidebar-muted border-transparent hover:text-dash-sidebar-foreground hover:bg-white/5 hover:border-white/10"
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-full bg-primary shadow-[0_0_8px_2px_hsl(19_86%_40%_/_0.7)]" />
                                        )}
                                        <item.icon className={cn(
                                            "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
                                        )} />
                                        <span className="truncate flex-1">{item.label}</span>
                                        {showBadge && (
                                            <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0 bg-primary text-primary-foreground shadow-[0_0_8px_hsl(19_86%_40%_/_0.6)]">
                                                1
                                            </span>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Streak widget — only shown when user has an active streak */}
                {roadmap && streak > 0 && (
                    <div className="relative px-3 pb-3">
                        <div className="rounded-xl border border-primary/30 bg-primary/10 backdrop-blur-sm p-4 text-dash-sidebar-foreground shadow-[0_0_20px_hsl(19_86%_40%_/_0.1)]">
                            <div className="w-9 h-9 rounded-lg border border-primary/40 bg-primary/10 flex items-center justify-center mb-3">
                                <Flame className="w-5 h-5 text-primary" />
                            </div>
                            <p className="font-display font-bold text-2xl leading-none mb-1">{streak}-day streak</p>
                            <p className="text-xs text-dash-sidebar-muted mb-3">Keep showing up on your roadmap.</p>
                            <NavLink
                                to="/dashboard/roadmap"
                                onClick={() => setSidebarOpen(false)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 border border-primary/30 hover:bg-primary/20 transition-colors px-3 py-2 rounded-lg"
                            >
                                View roadmap <ChevronRight className="w-3 h-3" />
                            </NavLink>
                        </div>
                    </div>
                )}

                {/* Bottom section */}
                <div className="relative px-3 py-4 space-y-1">
                    <div className="h-px mb-3 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <NavLink
                        to="/dashboard/settings"
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-lg text-sm font-medium transition-all border",
                            isActive ? "bg-primary/10 text-primary border-primary/30" : "text-dash-sidebar-muted border-transparent hover:text-dash-sidebar-foreground hover:bg-white/5 hover:border-white/10"
                        )}
                    >
                        <Settings className="w-5 h-5 shrink-0" />
                        <span>Settings</span>
                    </NavLink>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-lg text-sm font-medium transition-all border border-transparent text-dash-sidebar-muted hover:text-red-400 hover:bg-red-500/10 hover:border-red-500/20"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span>Logout</span>
                    </button>

                    {/* User card */}
                    <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-xs font-bold text-primary-foreground shadow-[0_0_10px_hsl(19_86%_40%_/_0.5)]">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold truncate text-dash-sidebar-foreground">{displayName}</p>
                            <p className="text-xs text-dash-sidebar-muted truncate">{user?.email}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto min-w-0">
                {/* Top bar — floating pill, matching the homepage navbar */}
                <div className="sticky top-4 z-30 mx-4 mb-2 flex items-center gap-3 h-16 px-3 pl-5 rounded-full bg-foreground/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.25)]">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-background/10 text-background transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-1">
                        <img src={genieLogo} alt="Career Genie" className="w-7 h-7 object-contain" />
                        <span className="font-display font-bold text-sm leading-none text-background">
                            Career <span className="text-gradient-gold">Genie</span>
                        </span>
                    </div>
                </div>
                <DailyTaskReminder />
                <Outlet />
            </main>
        </div>
    );
};