export const GlowOrbs = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/20 blur-[120px] animate-glow-pulse" />
    <div className="absolute top-1/3 -right-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-[140px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
    <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-accent-glow/15 blur-[120px] animate-glow-pulse" style={{ animationDelay: '4s' }} />
  </div>
);