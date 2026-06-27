"use client";

// Score-over-time trend as a lightweight SVG line chart. Replaces the earlier
// Recharts version to keep the dependency surface aligned with Spectrum and
// avoid pulling a second charting runtime. Colours come from Spectrum tokens.
// Renders an accessible text summary alongside the visual for screen readers.

export interface TrendPoint {
  date: string;
  score: number;
}

export function ScoreTrend({ data }: { data: TrendPoint[] }) {
  const width = 640;
  const height = 200;
  const pad = { top: 12, right: 16, bottom: 28, left: 32 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const xs = data.map((_, i) => (data.length === 1 ? 0.5 : i / (data.length - 1)));
  const points = data.map((d, i) => ({
    x: pad.left + xs[i] * innerW,
    y: pad.top + (1 - d.score / 100) * innerH,
    ...d,
  }));

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  const accent = "var(--spectrum-accent-color-900, #2680eb)";
  const grid = "var(--spectrum-gray-200, #e1e1e1)";
  const axisText = "var(--spectrum-gray-600, #6e6e6e)";

  return (
    <div style={{ width: "100%" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        role="img"
        aria-label={`Score trend across ${data.length} scans, from ${data[0]?.score ?? "n/a"} to ${
          data[data.length - 1]?.score ?? "n/a"
        }`}
      >
        {[0, 25, 50, 75, 100].map((tick) => {
          const y = pad.top + (1 - tick / 100) * innerH;
          return (
            <g key={tick}>
              <line x1={pad.left} y1={y} x2={width - pad.right} y2={y} stroke={grid} strokeDasharray="3 3" />
              <text x={pad.left - 8} y={y + 4} fontSize={11} fill={axisText} textAnchor="end">
                {tick}
              </text>
            </g>
          );
        })}

        <path d={path} fill="none" stroke={accent} strokeWidth={2.5} strokeLinejoin="round" />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3.5} fill={accent} />
            <text x={p.x} y={height - 8} fontSize={11} fill={axisText} textAnchor="middle">
              {p.date}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
