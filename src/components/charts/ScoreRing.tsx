// Signature element: a circular score gauge. Spectrum has no radial-gauge
// primitive, so this is hand-rolled SVG, but it draws its colours from
// Spectrum's semantic status tokens so it reads as part of the system.

function colorFor(score: number): string {
  if (score >= 90) return "var(--spectrum-positive-color-900, #2d9d78)";
  if (score >= 70) return "var(--spectrum-notice-color-900, #d97706)";
  if (score >= 50) return "var(--spectrum-orange-900, #d4500a)";
  return "var(--spectrum-negative-color-900, #d31510)";
}

export function ScoreRing({
  score,
  size = 160,
  stroke = 12,
  label,
}: {
  score: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = colorFor(score);

  return (
    <div
      style={{ position: "relative", width: size, height: size, display: "grid", placeItems: "center" }}
      role="img"
      aria-label={`Accessibility score ${score} out of 100`}
    >
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--spectrum-gray-200, #e1e1e1)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 700ms ease, stroke 400ms ease" }}
        />
      </svg>
      <div style={{ position: "absolute", textAlign: "center" }}>
        <div style={{ fontSize: 40, fontWeight: 700, fontVariantNumeric: "tabular-nums", color }}>
          {score}
        </div>
        {label && (
          <div style={{ fontSize: 12, color: "var(--spectrum-gray-600, #6e6e6e)", marginTop: 2 }}>
            {label}
          </div>
        )}
      </div>
    </div>
  );
}
