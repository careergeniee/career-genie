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
    viewBox="0 0 105 110"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* 4-pointed star */}
    <path
      d="M82 10 L84.5 19 L93.5 21.5 L84.5 24 L82 33 L79.5 24 L70.5 21.5 L79.5 19 Z"
      fill="currentColor"
    />
    {/* Smoke wisp — S-curve from star down to spout */}
    <path
      d="M74 33 C70 43 76 53 70 63 C64 73 69 79 63 87"
      fill="none"
      stroke="currentColor"
      strokeWidth="6.5"
      strokeLinecap="round"
    />
    {/* Spout / nozzle */}
    <path
      d="M60 87 L70 79 L76 70"
      fill="none"
      stroke="currentColor"
      strokeWidth="6.5"
      strokeLinecap="round"
    />
    {/* Knob on top of lamp */}
    <circle cx="37" cy="70" r="5.5" fill="currentColor" />
    {/* Lid — tapered surface */}
    <path
      d="M16 82 Q18 74 37 72 Q54 70 59 78 L59 83 Q53 77 37 77 Q20 77 16 83 Z"
      fill="currentColor"
    />
    <ellipse cx="37" cy="82" rx="21.5" ry="5" fill="currentColor" />
    {/* Lamp body */}
    <path
      d="M59 82 Q65 95 58 103 Q47 110 29 109 Q12 108 7 99 Q3 90 8 84 Q14 78 36 77 Q52 76 59 82 Z"
      fill="currentColor"
    />
    {/* Handle loop */}
    <path
      d="M11 87 Q2 92 4 102 Q6 111 17 107"
      fill="none"
      stroke="currentColor"
      strokeWidth="6.5"
      strokeLinecap="round"
    />
  </svg>
);
