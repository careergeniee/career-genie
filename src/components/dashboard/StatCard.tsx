import { LucideIcon } from "lucide-react";
import { useCountUp } from "@/hooks/useCountUp";

interface StatCardProps {
    icon: LucideIcon;
    title: string;
    value: string | number;
    delta?: string;
    index?: number;
}

export const StatCard = ({ icon: Icon, title, value, delta, index = 0 }: StatCardProps) => {
    const numeric = typeof value === "number";
    const animated = useCountUp(numeric ? value : 0);

    return (
        <div
            className="dash-card-hover p-5 animate-pop-in"
            style={{ animationDelay: `${index * 70}ms` }}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                    <Icon className="w-4 h-4 text-primary" />
                </div>
                {delta && <span className="dash-pill">{delta}</span>}
            </div>
            <div className="font-display text-2xl font-bold truncate">
                {numeric ? animated : value}
            </div>
            <div className="text-xs text-muted-foreground mt-1">{title}</div>
        </div>
    );
};
