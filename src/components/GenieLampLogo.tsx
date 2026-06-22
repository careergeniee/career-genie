export const GenieLampLogo = ({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 115"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* 4-pointed elongated star */}
    <path
      d="M71 5 L74 15 L84 18 L74 21 L71 31 L68 21 L58 18 L68 15 Z"
      fill="currentColor"
    />

    {/* Smoke ribbon — thick stroke, starts inside dome so dome covers the base cap */}
    <path
      d="M38 60 C24 50 13 37 13 27 C13 17 23 11 37 11 C52 11 67 15 69 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="13"
      strokeLinecap="round"
    />

    {/* Lamp body (main elliptical chamber) */}
    <ellipse cx="44" cy="79" rx="30" ry="13" fill="currentColor" />

    {/* Spout — filled wedge pointing upper-right */}
    <path
      d="M72 68 Q81 60 85 50 Q87 46 84 45 Q81 44 79 48 Q75 57 69 67 Z"
      fill="currentColor"
    />

    {/* Dome lid — upper half-ellipse covering lamp body top */}
    <path d="M16 66 A 28 14 0 0 0 72 66 Z" fill="currentColor" />

    {/* Dome knob */}
    <circle cx="44" cy="51" r="5.5" fill="currentColor" />

    {/* Handle — circular ring with visible hole */}
    <circle cx="15" cy="79" r="13" fill="currentColor" />
    <circle cx="15" cy="79" r="7" fill="white" />

    {/* Pedestal stem (narrow) */}
    <rect x="38" y="92" width="12" height="9" rx="1" fill="currentColor" />

    {/* Pedestal foot (wide base) */}
    <rect x="28" y="101" width="32" height="8" rx="4" fill="currentColor" />
  </svg>
);
