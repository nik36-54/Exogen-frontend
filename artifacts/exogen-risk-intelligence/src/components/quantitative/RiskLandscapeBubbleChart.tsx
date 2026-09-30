import { useState } from 'react';
import { useLocation } from 'wouter';
import { Sparkles, Info } from 'lucide-react';
import type { RiskScoreResult } from '@/types/quantitative-intelligence';

interface Props {
  risks: RiskScoreResult[];
  activeRiskId?: string;
}

export function RiskLandscapeBubbleChart({ risks, activeRiskId }: Props) {
  const [, setLocation] = useLocation();
  const [hoveredRisk, setHoveredRisk] = useState<RiskScoreResult | null>(null);

  // Probability is X (0 - 100%), Severity is Y (0 - 100)
  return (
    <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#24282c] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
              CROSS-PORTFOLIO POSITIONING
            </span>
            <span className="rounded bg-[#b8f34a]/10 px-1.5 py-0.5 text-[9px] font-mono text-[#b8f34a]">
              LIVE RISKS
            </span>
          </div>
          <h3 className="mt-1 text-base font-semibold text-[#f5f5f2]">
            Risk Landscape (Probability × Severity)
          </h3>
        </div>
        <div className="text-[11px] font-mono text-[#92989e]">
          Bubble diameter = Modeled Exposure ($M)
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div className="mt-5 relative h-80 rounded-lg border border-[#24282c] bg-[#0a0a0b]/80 p-6 overflow-hidden">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-20">
          <div className="border-r border-b border-[#3b4440]" />
          <div className="border-r border-b border-[#3b4440]" />
          <div className="border-r border-b border-[#3b4440]" />
          <div className="border-b border-[#3b4440]" />
          <div className="border-r border-b border-[#3b4440]" />
          <div className="border-r border-b border-[#3b4440]" />
          <div className="border-r border-b border-[#3b4440]" />
          <div className="border-b border-[#3b4440]" />
          <div className="border-r border-b border-[#3b4440]" />
          <div className="border-r border-b border-[#3b4440]" />
          <div className="border-r border-b border-[#3b4440]" />
          <div className="border-b border-[#3b4440]" />
          <div className="border-r border-[#3b4440]" />
          <div className="border-r border-[#3b4440]" />
          <div className="border-r border-[#3b4440]" />
          <div />
        </div>

        {/* Quadrant Watermark Labels */}
        <div className="absolute top-3 left-4 text-[9px] font-mono uppercase tracking-wider text-[#656b70]">
          High Severity · Low Prob
        </div>
        <div className="absolute top-3 right-4 text-[9px] font-mono uppercase tracking-wider text-[#ff5c5c]/70">
          Critical Quadrant (High Severity · High Prob)
        </div>
        <div className="absolute bottom-3 left-4 text-[9px] font-mono uppercase tracking-wider text-[#656b70]">
          Low Severity · Low Prob
        </div>
        <div className="absolute bottom-3 right-4 text-[9px] font-mono uppercase tracking-wider text-[#656b70]">
          High Prob · Moderate Severity
        </div>

        {/* X and Y Axis Titles */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-mono font-medium text-[#92989e]">
          Market Consensus Probability (P_M) →
        </div>
        <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-mono font-medium text-[#92989e] origin-left">
          Severity Rating →
        </div>

        {/* Risk Bubbles */}
        {risks.map((risk) => {
          // X: 0 - 100% -> map to 12% - 88%
          const leftPct = Math.max(12, Math.min(88, risk.probabilityPct * 0.85 + 5));
          // Y: 0 - 100 -> map to 88% - 12% (higher severity = lower top)
          const topPct = Math.max(12, Math.min(88, 100 - (risk.severity * 0.85 + 5)));

          // Size mapped from modeledExposureUsdM (e.g. 10M to 45M -> 24px to 54px)
          const sizePx = Math.max(26, Math.min(54, (risk.modeledExposureUsdM / 45) * 44 + 18));
          const isSelected = activeRiskId === risk.id;

          const getBubbleColor = () => {
            if (risk.category === 'CRITICAL' || risk.score >= 80) return 'bg-[#ff5c5c]/20 border-[#ff5c5c] text-[#ff5c5c]';
            if (risk.category === 'HIGH' || risk.score >= 70) return 'bg-[#b8f34a]/20 border-[#b8f34a] text-[#b8f34a]';
            return 'bg-[#7c8cff]/20 border-[#7c8cff] text-[#7c8cff]';
          };

          return (
            <div
              key={risk.id}
              onClick={() => setLocation(`/risk/scores/${risk.id}`)}
              onMouseEnter={() => setHoveredRisk(risk)}
              onMouseLeave={() => setHoveredRisk(null)}
              className="absolute cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 group"
              style={{
                left: `${leftPct}%`,
                top: `${topPct}%`,
              }}
            >
              <div
                className={`rounded-full border-2 flex items-center justify-center font-mono text-[11px] font-bold shadow-lg transition-transform group-hover:scale-125 ${
                  isSelected ? 'ring-2 ring-white ring-offset-2 ring-offset-black scale-110' : ''
                } ${getBubbleColor()}`}
                style={{
                  width: `${sizePx}px`,
                  height: `${sizePx}px`,
                }}
              >
                {risk.score}
              </div>

              {/* Tag Label */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap text-[10px] font-mono text-[#f5f5f2] bg-[#111416]/90 px-1.5 py-0.5 rounded border border-[#24282c] pointer-events-none group-hover:border-[#b8f34a]">
                {risk.riskName.split(' ')[0]} (${risk.modeledExposureUsdM.toFixed(0)}M)
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover Info Card */}
      <div className="mt-3 flex items-center justify-between rounded bg-[#171a1d] px-3.5 py-2 border border-[#24282c] text-xs">
        {hoveredRisk ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-semibold text-[#f5f5f2]">{hoveredRisk.eventTitle}</span>
            <span className="font-mono text-[#b8f34a]">Score: {hoveredRisk.score}</span>
            <span className="font-mono text-[#92989e]">Prob: {hoveredRisk.probabilityPct.toFixed(1)}%</span>
            <span className="font-mono text-[#92989e]">Severity: {hoveredRisk.severity}</span>
            <span className="font-mono text-[#92989e]">Exposure: ${hoveredRisk.modeledExposureUsdM.toFixed(1)}M</span>
          </div>
        ) : (
          <div className="text-[11px] text-[#656b70] flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5 text-[#92989e]" />
            Hover over any risk bubble to preview parameters or click to open full Score Detail.
          </div>
        )}
      </div>
    </div>
  );
}
