interface BarTrendItem {
    label: string;
    value: number;
}

/** Small animated vertical bar chart for a dark panel. Most recent bar is highlighted. */
export const BarTrend = ({ items, max = 100 }: { items: BarTrendItem[]; max?: number }) => (
    <div className="flex items-end gap-3 h-32">
        {items.map((it, i) => {
            const isLast = i === items.length - 1;
            const heightPct = Math.max(6, Math.round((it.value / max) * 100));
            return (
                <div key={`${it.label}-${i}`} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                    <div className="relative w-full flex-1 flex items-end">
                        <div
                            className={`w-full rounded-t-lg origin-bottom animate-grow-bar ${isLast ? "bg-primary" : "bg-white/15"}`}
                            style={{ height: `${heightPct}%`, animationDelay: `${i * 60}ms` }}
                        />
                    </div>
                    <span className="text-[10px] text-white/50 truncate w-full text-center">{it.label}</span>
                </div>
            );
        })}
    </div>
);
