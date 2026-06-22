import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    Bot, FileText, MessageSquare, Map, GraduationCap,
    LogOut, Settings, ChevronLeft, ChevronRight,
    LayoutDashboard, User, ClipboardList, Target, Menu, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import genieLogo from "@/assets/genie-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { DailyTaskReminder } from "@/components/DailyTaskReminder";

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
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully");
        navigate("/");
    };

    const displayName = user?.displayName || user?.email?.split("@")[0] || "Explorer";
    const initials = displayName.slice(0, 2).toUpperCase();

    return (
        <div className="min-h-screen flex bg-background">
            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "flex flex-col border-r border-border/60 transition-all duration-300 shrink-0",
                "bg-gradient-to-b from-card to-background",
                // Desktop: relative in flow
                "lg:relative lg:translate-x-0",
                // Mobile: fixed overlay, hidden by default
                "fixed inset-y-0 left-0 z-50 lg:static",
                !mobileOpen && "-translate-x-full lg:translate-x-0",
                collapsed ? "w-[72px]" : "w-64"
            )}>
                {/* Logo */}
                <div className={cn(
                    "flex items-center gap-1 px-4 py-5 border-b border-border/60",
                    collapsed && "justify-center px-0"
                )}>
                    <img src={genieLogo} alt="Career Genie" className="w-11 h-11 object-contain shrink-0" />
                    {!collapsed && (
                        <span className="font-display font-bold text-lg tracking-tight leading-none flex-1">
                            Career <span className="text-gradient-gold">Genie</span>
                        </span>
                    )}
                    {!collapsed && (
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden ml-auto w-7 h-7 flex items-center justify-center rounded-lg hover:bg-secondary transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Collapse toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-[72px] w-6 h-6 rounded-full bg-secondary border border-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors z-10"
                >
                    {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </button>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === "/dashboard"}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group",
                                collapsed && "justify-center px-0",
                                isActive
                                    ? "bg-primary/15 text-primary border border-primary/30"
                                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                            )}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={cn(
                                        "w-5 h-5 shrink-0 transition-transform group-hover:scale-110",
                                        isActive && "text-primary"
                                    )} />
                                    {!collapsed && <span className="truncate">{item.label}</span>}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom section */}
                <div className="px-3 py-4 border-t border-border/60 space-y-1">
                    <NavLink
                        to="/dashboard/settings"
                        onClick={() => setMobileOpen(false)}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                            collapsed && "justify-center px-0",
                            isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                        )}
                    >
                        <Settings className="w-5 h-5 shrink-0" />
                        {!collapsed && <span>Settings</span>}
                    </NavLink>

                    <button
                        onClick={handleLogout}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                            "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
                            collapsed && "justify-center px-0"
                        )}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {!collapsed && <span>Logout</span>}
                    </button>

                    {/* User card */}
                    <div className={cn(
                        "flex items-center gap-3 px-3 py-3 mt-2 rounded-xl bg-secondary/40 border border-border/60",
                        collapsed && "justify-center px-0"
                    )}>
                        <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center shrink-0 text-xs font-bold text-primary-foreground">
                            {initials}
                        </div>
                        {!collapsed && (
                            <div className="min-w-0">
                                <p className="text-sm font-semibold truncate">{displayName}</p>
                                <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto min-w-0">
                {/* Mobile top bar */}
                <div className="lg:hidden sticky top-0 z-30 flex items-center gap-3 px-4 h-14 border-b border-border/60 bg-background/90 backdrop-blur-sm">
                    <button
                        onClick={() => setMobileOpen(true)}
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