import { GenieLampLogo } from "./GenieLampLogo";

// Smoke blobs: [xOffset, size, blur, opacity, delayS, durS, xDrift]
const SMOKE: [number, number, number, number, number, number, string][] = [
  [  0,  72, 26, 0.50, 0.0, 3.0,  "10px"],
  [-22,  52, 18, 0.42, 0.4, 2.8, "-20px"],
  [ 18,  60, 20, 0.46, 0.8, 3.2,  "22px"],
  [ -8,  85, 32, 0.28, 1.2, 4.0,  "-7px"],
  [ 14,  45, 14, 0.56, 0.2, 2.5,  "28px"],
  [-30,  65, 23, 0.40, 0.6, 3.1, "-25px"],
  [  6,  95, 36, 0.24, 1.7, 4.4,  "12px"],
  [-16,  42, 12, 0.62, 0.9, 2.3, "-14px"],
  [ 28,  58, 19, 0.44, 1.4, 3.4,  "18px"],
  [-38,  48, 16, 0.48, 0.3, 2.7, "-32px"],
  [ 44,  50, 17, 0.38, 1.0, 3.1,  "38px"],
  [-20,  70, 25, 0.32, 1.9, 3.7, "-18px"],
  [  2,  38, 10, 0.58, 0.5, 2.1,   "6px"],
  [-44,  80, 28, 0.30, 1.3, 3.9, "-40px"],
  [ 35,  44, 13, 0.50, 0.7, 2.6,  "32px"],
];

// Sparkle particles: [xOffset, delayS, size, durS]
const PARTICLES: [number, number, number, number][] = [
  [-52, 0.0, 5, 2.5], [ 36, 0.3, 6, 2.8], [-18, 0.7, 4, 2.1],
  [ 62, 1.0, 5, 3.0], [-72, 0.4, 3, 2.4], [ 20, 1.2, 7, 2.7],
  [-44, 0.8, 4, 2.2], [ 48, 0.1, 5, 3.1], [-28, 1.5, 4, 2.6],
  [ 78, 0.6, 6, 2.9], [-60, 1.1, 3, 2.4], [ 26, 0.5, 4, 2.3],
  [-88, 1.3, 5, 3.3], [ 88, 0.9, 3, 2.0], [ -6, 1.8, 6, 2.6],
  [ 44, 1.6, 4, 2.8], [-48, 0.2, 5, 2.2], [ 10, 1.4, 3, 3.0],
  [-34, 0.6, 6, 2.5], [ 66, 1.1, 4, 2.9], [-76, 0.8, 5, 3.2],
  [ 12, 0.4, 3, 2.0], [-14, 1.7, 7, 2.7], [ 55, 0.2, 4, 3.4],
];

export const GenieHero = () => (
  <div
    className="relative flex items-end justify-center select-none w-full"
    style={{ height: 480 }}
  >
    {/* Floor glow */}
    <div
      className="absolute bottom-[90px] left-1/2 rounded-full bg-primary/25 pointer-events-none"
      style={{
        width: 220,
        height: 55,
        filter: "blur(45px)",
        animation: "genie-floor-glow 2.6s ease-in-out infinite",
      }}
    />

    {/* Smoke cloud blobs */}
    {SMOKE.map(([dx, size, blur, opacity, delay, dur, drift], i) => (
      <div
        key={i}
        className="absolute rounded-full bg-primary pointer-events-none"
        style={{
          width: size,
          height: size,
          bottom: 92,
          left: `calc(50% + ${dx + 18}px - ${size / 2}px)`,
          opacity,
          filter: `blur(${blur}px)`,
          "--drift": drift,
          animation: `genie-rise ${dur}s ${delay}s ease-out infinite`,
        } as React.CSSProperties}
      />
    ))}

    {/* Sparkle particles */}
    {PARTICLES.map(([dx, delay, size, dur], i) => (
      <div
        key={i}
        className="absolute rounded-full bg-primary pointer-events-none"
        style={{
          width: size,
          height: size,
          bottom: 97,
          left: `calc(50% + ${dx + 18}px)`,
          animation: `genie-particle ${dur}s ${delay}s ease-out infinite`,
        }}
      />
    ))}

    {/* Lamp — the star of the show */}
    <div
      className="relative z-10 pointer-events-none"
      style={{ animation: "genie-lamp-pulse 2.3s ease-in-out infinite" }}
    >
      <GenieLampLogo size={190} className="text-primary" />
    </div>
  </div>
);
