import { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

interface Props {
    title: string;
    desc: string;
    Icon: LucideIcon;
}

const ComingSoon = ({ title, desc, Icon }: Props) => (
    <div className="min-h-screen flex items-center justify-center p-6">
        <div className="glass-card rounded-3xl p-12 text-center max-w-md w-full">
            <div className="w-16 h-16 rounded-2xl bg-gradient-gold flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_hsl(48_96%_53%_/_0.4)]">
                <Icon className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl font-bold mb-3">{title}</h2>
            <p className="text-muted-foreground mb-6">{desc}</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-sm text-primary font-medium">
                <Sparkles className="w-4 h-4" /> Coming Soon
            </div>
        </div>
    </div>
);

export default ComingSoon;