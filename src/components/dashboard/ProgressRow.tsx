import { Progress } from "@/components/ui/progress";

export const ProgressRow = ({ label, value, index = 0 }: { label: string; value: number; index?: number }) => (
    <div className="animate-pop-in" style={{ animationDelay: `${index * 60}ms` }}>
        <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-medium">{label}</span>
            <span className="dash-pill">{value}%</span>
        </div>
        <Progress value={value} className="h-2.5" />
    </div>
);
