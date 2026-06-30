import { ResumePreview } from "@/components/resume/ResumePreview";
import { sampleResume } from "@/lib/resume";
import genieLogo from "@/assets/genie-logo3.png";

const resume = sampleResume();

/**
 * Composited live preview of the real Resume Builder + AI Chat UI,
 * styled as a floating browser-frame mockup for the homepage hero.
 */
export const HeroShowcase = () => (
    <div className="relative w-full max-w-md">
        {/* Peeking resume preview — real ResumePreview component, scaled down */}
        <div className="absolute -right-4 -top-10 w-36 sm:w-44 rotate-6 rounded-xl overflow-hidden border border-border shadow-2xl bg-white hidden sm:block">
            <div className="h-[230px] sm:h-[280px] overflow-hidden">
                <div className="origin-top-left scale-[0.21] w-[800px] pointer-events-none">
                    <ResumePreview data={resume} template="modern" />
                </div>
            </div>
        </div>

        {/* Main card — real Chat UI bubbles, styled as a browser frame */}
        <div className="relative glass-card rounded-2xl shadow-2xl overflow-hidden border border-border">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border/60 bg-card/60">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                <span className="ml-3 text-[10px] text-muted-foreground font-medium truncate">
                    careergenie.app/dashboard/chat
                </span>
            </div>

            <div className="p-5">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border/60">
                    <div className="w-8 h-8 rounded-full bg-gradient-gold flex items-center justify-center shrink-0">
                        <img src={genieLogo} alt="Genie" className="w-5 h-5 object-contain" />
                    </div>
                    <div>
                        <div className="text-sm font-bold">AI Career Mentor</div>
                        <div className="flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs text-muted-foreground">Online</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="bg-secondary rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-xs max-w-[85%]">
                        What career suits a CS graduate in Pakistan?
                    </div>
                    <div className="bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-3.5 py-2.5 text-xs ml-auto max-w-[85%]">
                        <strong>Software Engineering</strong> and <strong>Data Science</strong> are top picks right now. Freelancing is booming too!
                    </div>
                </div>
            </div>
        </div>

        {/* Floating stat badges */}
        <div className="absolute -bottom-5 -left-5 glass-card rounded-xl px-4 py-2.5 shadow-xl flex items-center gap-2.5">
            <span className="font-display text-xl font-bold text-gradient-gold leading-none">6</span>
            <span className="text-[10px] text-muted-foreground leading-tight">AI Tools<br />Built-in</span>
        </div>
        <div className="absolute -top-4 left-8 sm:left-12 glass-card rounded-full px-3.5 py-1.5 shadow-xl text-[11px] font-semibold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> 100% Free
        </div>
    </div>
);
