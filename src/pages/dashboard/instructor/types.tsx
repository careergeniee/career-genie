import type { personaFor, buildUserContext } from "@/lib/instructor";

export interface TabProps {
    persona: ReturnType<typeof personaFor>;
    ctx: ReturnType<typeof buildUserContext>;
}

export const Chip = ({ children }: { children: React.ReactNode }) => (
    <span className="text-xs px-2.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary font-medium">
        {children}
    </span>
);
