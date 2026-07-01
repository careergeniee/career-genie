interface BubbleStatItem {
    label: string;
    value: number; // 0-100
}

const COLORS = [
    "bg-primary text-primary-foreground",
    "bg-foreground text-background",
    "bg-primary/15 text-foreground",
];

/** Packed-circle breakdown, sized proportionally to each item's value (0-100). */
export const BubbleStat = ({ items }: { items: BubbleStatItem[] }) => {
    const max = Math.max(...items.map((i) => i.value), 1);

    return (
        <div className="flex items-end gap-4 flex-wrap">
            {items.map((it, i) => {
                const size = 56 + Math.round((it.value / max) * 88);
                return (
                    <div
                        key={it.label}
                        className={`rounded-full flex flex-col items-center justify-center shrink-0 animate-pop-in ${COLORS[i % COLORS.length]}`}
                        style={{ width: size, height: size, animationDelay: `${i * 90}ms` }}
                    >
                        <span className="font-display font-bold text-base leading-none">{it.value}%</span>
                        <span className="text-[9px] opacity-80 mt-1 px-1.5 text-center leading-tight">{it.label}</span>
                    </div>
                );
            })}
        </div>
    );
};
