import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    Bot, FileText, MessageSquare, Map, GraduationCap, Globe2,
    LogOut, Settings, ChevronLeft, ChevronRight,
    LayoutDashboard, User, ClipboardList, Target
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
    { label: "3D Career Verse", path: "/dashboard/career-verse", icon: Globe2 },
];

export const DashboardLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
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
            {/* Sidebar */}
            <aside className={cn(
                "relative flex flex-col border-r border-border/60 transition-all duration-300 shrink-0",
                "bg-gradient-to-b from-card to-background",
                collapsed ? "w-[72px]" : "w-64"
            )}>
                {/* Logo */}
                <div className={cn(
                    "flex items-center gap-3 px-4 py-5 border-b border-border/60",
                    collapsed && "justify-center px-0"
                )}>
                    <img src={genieLogo} alt="Career Genie" className="w-11 h-11 object-contain shrink-0" />
                    {!collapsed && (
                        <span className="font-display font-bold text-lg tracking-tight">
                            Career <span className="text-gradient-gold">Genie</span>
                        </span>
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
                                    {!collapsed && item.path === "/dashboard/career-verse" && (
                                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground font-medium">
                                            Soon
                                        </span>
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom section */}
                <div className="px-3 py-4 border-t border-border/60 space-y-1">
                    <NavLink
                        to="/dashboard/settings"
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
            <main className="flex-1 overflow-auto">
                <DailyTaskReminder />
                <Outlet />
            </main>
        </div>
    );
};