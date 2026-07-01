import { useState } from "react";
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
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully");
        navigate("/");
    };

    const displayName = user?.displayName || user?.email?.split("@")[0] || "Explorer";
    const initials = displayName.slice(0, 2).toUpperCase();

    // Real-data signals — no fabricated counts.
    const instructorPending = hasPendingTaskToday(loadTasks());
    const roadmap = loadData<Roadmap | null>("roadmap", null);
    const streak = roadmap ? currentStreak(roadmap.completionDates) : 0;

    return (
        <div className="min-h-screen flex bg-dash-bg">
            {/* Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar — hidden by default on every screen size, opens as an overlay on click */}
            <aside className={cn(
                "flex flex-col dash-sidebar-bg transition-transform duration-300 shrink-0",
                "fixed inset-y-0 left-0 z-50 w-64",
                !sidebarOpen && "-translate-x-full"
            )}>
                {/* Logo */}
                <div className="flex items-center gap-1 px-4 py-5 border-b border-white/10">
                    <img src={genieLogo} alt="Career Genie" className="w-11 h-11 object-contain shrink-0" />
                    <span className="font-display font-bold text-lg tracking-tight leading-none flex-1 text-dash-sidebar-foreground">
                        Career <span className="text-primary">Genie</span>
                    </span>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 text-dash-sidebar-foreground transition-colors"
                        aria-label="Close menu"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
                                    "flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-medium transition-all duration-200 group animate-fade-in-up",
                                    isActive
                                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                                        : "text-dash-sidebar-muted hover:text-dash-sidebar-foreground hover:bg-white/5"
                                )}
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon className={cn(
                                            "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
                                        )} />
                                        <span className="truncate flex-1">{item.label}</span>
                                        {showBadge && (
                                            <span className={cn(
                                                "w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center shrink-0",
                                                isActive ? "bg-primary-foreground text-primary" : "bg-primary text-primary-foreground"
                                            )}>
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
                    <div className="px-3 pb-3">
                        <div className="rounded-2xl bg-primary p-4 text-primary-foreground">
                            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
                                <Flame className="w-5 h-5" />
                            </div>
                            <p className="font-display font-bold text-2xl leading-none mb-1">{streak}-day streak</p>
                            <p className="text-xs text-primary-foreground/80 mb-3">Keep showing up on your roadmap.</p>
                            <NavLink
                                to="/dashboard/roadmap"
                                onClick={() => setSidebarOpen(false)}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold bg-black/15 hover:bg-black/25 transition-colors px-3 py-2 rounded-lg"
                            >
                                View roadmap <ChevronRight className="w-3 h-3" />
                            </NavLink>
                        </div>
                    </div>
                )}

                {/* Bottom section */}
                <div className="px-3 py-4 border-t border-white/10 space-y-1">
                    <NavLink
                        to="/dashboard/settings"
                        onClick={() => setSidebarOpen(false)}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-medium transition-all",
                            isActive ? "bg-primary text-primary-foreground" : "text-dash-sidebar-muted hover:text-dash-sidebar-foreground hover:bg-white/5"
                        )}
                    >
                        <Settings className="w-5 h-5 shrink-0" />
                        <span>Settings</span>
                    </NavLink>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-full text-sm font-medium transition-all text-dash-sidebar-muted hover:text-red-400 hover:bg-red-500/10"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span>Logout</span>
                    </button>

                    {/* User card */}
                    <div className="flex items-center gap-3 px-3 py-3 mt-2 rounded-xl bg-white/5">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 text-xs font-bold text-primary-foreground">
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
                {/* Top bar */}
                <div className="sticky top-0 z-30 flex items-center gap-3 px-4 h-14 border-b border-border/60 bg-background/90 backdrop-blur-sm">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-secondary transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-1">
                        <img src={genieLogo} alt="Career Genie" className="w-7 h-7 object-contain" />
                        <span className="font-display font-bold text-sm leading-none">
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