import { useState } from 'react';
import { Info, AlertTriangle, Sparkles } from 'lucide-react';
import type { CalibrationBucket } from '@/types/validation-intelligence';

interface Props {
  buckets: CalibrationBucket[];
  overallBrierScore?: number;
  overallCalibError?: number;
  onSelectBucket?: (bucket: CalibrationBucket) => void;
}

export function CalibrationCurveChart({
  buckets,
  overallBrierScore = 0.142,
  overallCalibError = 0.071,
  onSelectBucket,
}: Props) {
  const [hoveredBucket, setHoveredBucket] = useState<CalibrationBucket | null>(null);

  // SVG dimensions
  const width = 560;
  const height = 340;
  const padding = { top: 25, right: 30, bottom: 50, left: 55 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const scaleX = (val: number) => padding.left + (val / 100) * plotWidth;
  const scaleY = (val: number) => padding.top + plotHeight - (val / 100) * plotHeight;

  // Polyline points for actual curve
  const pointsString = buckets
    .map((b) => `${scaleX(b.predictedProbability)},${scaleY(b.observedFrequency)}`)
    .join(' ');

  return (
    <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f2427] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              RELIABILITY DIAGRAM · DECILE CALIBRATION
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              SYNTHETIC BENCHMARK
            </span>
          </div>
          <h3 className="text-sm font-semibold text-[#f5f5f2]">
            Predicted Probability vs. Observed Frequency
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="text-[#6c7479]">Brier Score:</span>
            <span className="text-[#b8f34a] font-semibold">{overallBrierScore.toFixed(3)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[#6c7479]">ECE:</span>
            <span className="text-[#f5f5f2] font-semibold">{(overallCalibError * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative flex justify-center">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full max-w-[620px] select-none overflow-visible"
        >
          {/* Subtle grid lines */}
          {[0, 20, 40, 60, 80, 100].map((tick) => (
            <g key={tick}>
              {/* Horizontal grid */}
              <line
                x1={padding.left}
                y1={scaleY(tick)}
                x2={padding.left + plotWidth}
                y2={scaleY(tick)}
                stroke="#1f2427"
                strokeDasharray="3 3"
              />
              <text
                x={padding.left - 10}
                y={scaleY(tick) + 3}
                fill="#60686d"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="end"
              >
                {tick}%
              </text>

              {/* Vertical grid */}
              <line
                x1={scaleX(tick)}
                y1={padding.top}
                x2={scaleX(tick)}
                y2={padding.top + plotHeight}
                stroke="#1f2427"
                strokeDasharray="3 3"
              />
              <text
                x={scaleX(tick)}
                y={padding.top + plotHeight + 20}
                fill="#60686d"
                fontSize="10"
                fontFamily="monospace"
                textAnchor="middle"
              >
                {tick}%
              </text>
            </g>
          ))}

          {/* Well-calibrated zone highlight (30% to 70%) */}
          <rect
            x={scaleX(30)}
            y={scaleY(70)}
            width={scaleX(70) - scaleX(30)}
            height={scaleY(30) - scaleY(70)}
            fill="#b8f34a"
            fillOpacity="0.04"
            stroke="#b8f34a"
            strokeOpacity="0.15"
            strokeDasharray="4 4"
          />

          {/* Perfect calibration 45-degree reference line */}
          <line
            x1={scaleX(0)}
            y1={scaleY(0)}
            x2={scaleX(100)}
            y2={scaleY(100)}
            stroke="#555f65"
            strokeWidth="1.5"
            strokeDasharray="5 5"
          />

          {/* Actual calibration line */}
          <polyline
            fill="none"
            stroke="#b8f34a"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsString}
          />

          {/* Points */}
          {buckets.map((b) => {
            const cx = scaleX(b.predictedProbability);
            const cy = scaleY(b.observedFrequency);
            const isHovered = hoveredBucket?.probabilityRange === b.probabilityRange;
            const isSmallSample = b.sampleSize < 25;

            return (
              <g
                key={b.probabilityRange}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredBucket(b)}
                onMouseLeave={() => setHoveredBucket(null)}
                onClick={() => onSelectBucket?.(b)}
              >
                {/* Glow ring when hovered */}
                {isHovered && (
                  <circle cx={cx} cy={cy} r="10" fill="#b8f34a" fillOpacity="0.25" />
                )}

                {/* Point circle */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 6 : 4.5}
                  fill={isSmallSample ? '#e5c07b' : '#b8f34a'}
                  stroke="#0a0a0b"
                  strokeWidth="2"
                />

                {/* Vertical error stem to 45-deg line */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={cy}
                    x2={cx}
                    y2={scaleY(b.predictedProbability)}
                    stroke="#ff5c5c"
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                  />
                )}
              </g>
            );
          })}

          {/* Axis Labels */}
          <text
            x={padding.left + plotWidth / 2}
            y={height - 10}
            fill="#8d969b"
            fontSize="11"
            fontFamily="monospace"
            textAnchor="middle"
          >
            Predicted Probability (%) →
          </text>
          <text
            x={15}
            y={padding.top + plotHeight / 2}
            fill="#8d969b"
            fontSize="11"
            fontFamily="monospace"
            textAnchor="middle"
            transform={`rotate(-90 15 ${padding.top + plotHeight / 2})`}
          >
            Observed Frequency (%) →
          </text>
        </svg>

        {/* Floating tooltip when bucket is hovered */}
        {hoveredBucket && (
          <div className="absolute right-4 top-2 max-w-xs rounded-lg border border-[#24282c] bg-[#161a1d] p-3 shadow-xl text-left pointer-events-none z-10">
            <div className="flex items-center justify-between border-b border-[#24282c] pb-1.5">
              <span className="font-mono text-xs font-bold text-[#f5f5f2]">
                Bucket: {hoveredBucket.probabilityRange}
              </span>
              <span className="text-[10px] font-mono text-[#92989e]">
                n = {hoveredBucket.sampleSize} events
              </span>
            </div>
            <div className="mt-2 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-[#8d969b]">Avg Predicted:</span>
                <span className="font-mono text-[#f5f5f2]">{hoveredBucket.predictedProbability.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8d969b]">Observed Rate:</span>
                <span className="font-mono text-[#b8f34a] font-semibold">{hoveredBucket.observedFrequency.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8d969b]">Calibration Gap:</span>
                <span className={`font-mono font-medium ${hoveredBucket.errorPp < 0 ? 'text-[#ff7b72]' : 'text-[#7ee787]'}`}>
                  {hoveredBucket.errorPp > 0 ? `+${hoveredBucket.errorPp.toFixed(1)}pp` : `${hoveredBucket.errorPp.toFixed(1)}pp`}
                  {hoveredBucket.isOverconfident ? ' (Overconfident)' : hoveredBucket.isUnderconfident ? ' (Underconfident)' : ' (Calibrated)'}
                </span>
              </div>
              {hoveredBucket.warningNote && (
                <div className="mt-1 flex items-start gap-1 rounded bg-[#2b2518] p-1.5 text-[10px] text-[#e5c07b]">
                  <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                  <span>{hoveredBucket.warningNote}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Legend & Analytical Interpretation */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#1f2427] pt-3 text-[11px] text-[#92989e]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-0.5 w-4 bg-[#555f65] border-t border-dashed border-[#8d969b]" />
            <span>Perfect Calibration (y = x)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#b8f34a]" />
            <span className="text-[#f5f5f2]">Exogen Probability Model v0.3</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#e5c07b]" />
            <span>Small Sample (n &lt; 25)</span>
          </div>
        </div>

        <div className="text-[10px] font-mono text-[#6c7479]">
          Optimal zone: 30%–70% probability
        </div>
      </div>
    </div>
  );
}
