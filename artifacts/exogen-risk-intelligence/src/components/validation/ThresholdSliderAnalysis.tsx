import { useState } from 'react';
import { SlidersHorizontal, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { WarningThresholdPoint } from '@/types/validation-intelligence';

interface Props {
  tradeoffs: WarningThresholdPoint[];
}

export function ThresholdSliderAnalysis({ tradeoffs }: Props) {
  const [selectedScore, setSelectedScore] = useState<number>(70);

  const current =
    tradeoffs.find((t) => t.thresholdScore === selectedScore) ||
    tradeoffs[2]; // 70 is default

  return (
    <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1f2427] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              THRESHOLD SENSITIVITY CALIBRATION
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              POLICY SIMULATOR
            </span>
          </div>
          <h3 className="text-sm font-semibold text-[#f5f5f2]">
            Alert Threshold vs. Lead Time Tradeoff
          </h3>
        </div>

        <div className="text-xs font-mono text-[#6c7479]">
          Current Policy Threshold: <strong className="text-[#b8f34a]">Score &gt; {selectedScore}</strong>
        </div>
      </div>

      {/* Slider */}
      <div className="space-y-2 py-2">
        <div className="flex justify-between text-xs text-[#8d969b]">
          <span>More Sensitive (Score &gt; 60)</span>
          <span className="font-mono text-[#f5f5f2] font-bold">Cutoff Score: {selectedScore}</span>
          <span>More Selective (Score &gt; 85)</span>
        </div>
        <input
          type="range"
          min={60}
          max={85}
          step={5}
          value={selectedScore}
          onChange={(e) => setSelectedScore(Number(e.target.value))}
          className="w-full accent-[#b8f34a] cursor-pointer h-2 bg-[#1f2427] rounded-lg appearance-none"
        />
        <div className="flex justify-between text-[10px] font-mono text-[#6c7479] px-1">
          {tradeoffs.map((t) => (
            <span
              key={t.thresholdScore}
              className={t.thresholdScore === selectedScore ? 'text-[#b8f34a] font-bold' : ''}
            >
              {t.thresholdScore}
            </span>
          ))}
        </div>
      </div>

      {/* Simulated Output Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3">
          <div className="text-[10px] font-mono text-[#8d969b]">Precision</div>
          <div className="text-xl font-bold font-mono text-[#b8f34a] mt-1">
            {current.precisionPct.toFixed(1)}%
          </div>
          <div className="text-[10px] text-[#6c7479] mt-0.5">True alarm ratio</div>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3">
          <div className="text-[10px] font-mono text-[#8d969b]">Recall (Detection)</div>
          <div className="text-xl font-bold font-mono text-[#f5f5f2] mt-1">
            {current.recallPct.toFixed(1)}%
          </div>
          <div className="text-[10px] text-[#6c7479] mt-0.5">Events detected</div>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3">
          <div className="text-[10px] font-mono text-[#8d969b]">Avg Lead Time</div>
          <div className="text-xl font-bold font-mono text-[#e5c07b] mt-1">
            {current.averageLeadTimeHours.toFixed(1)}h
          </div>
          <div className="text-[10px] text-[#6c7479] mt-0.5">Advance notice</div>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3">
          <div className="text-[10px] font-mono text-[#8d969b]">Annual Alert Volume</div>
          <div className="text-xl font-bold font-mono text-[#f5f5f2] mt-1">
            {current.alertVolume}
          </div>
          <div className="text-[10px] text-[#6c7479] mt-0.5">Dispatches / year</div>
        </div>
      </div>

      {/* Dynamic Tradeoff Narrative */}
      <div className="rounded-lg border border-[#24282c] bg-[#0a0a0b] p-3 text-xs text-[#a0a8af] leading-relaxed">
        {selectedScore <= 65 ? (
          <div className="flex items-start gap-2">
            <AlertTriangle size={14} className="text-[#e5c07b] shrink-0 mt-0.5" />
            <span>
              <strong>High Sensitivity Mode:</strong> Maximizes advance notice ({current.averageLeadTimeHours}h lead time) and catches {current.recallPct}% of events, but generates higher notification volume ({current.alertVolume} alerts/yr) with a 30% false alarm rate.
            </span>
          </div>
        ) : selectedScore >= 80 ? (
          <div className="flex items-start gap-2">
            <ShieldCheck size={14} className="text-[#b8f34a] shrink-0 mt-0.5" />
            <span>
              <strong>High Precision Mode:</strong> Highly targeted with {current.precisionPct}% accuracy and only {current.alertVolume} total alerts, but sacrifices lead time ({current.averageLeadTimeHours}h) and misses {100 - current.recallPct}% of material outcomes.
            </span>
          </div>
        ) : (
          <div className="flex items-start gap-2">
            <ShieldCheck size={14} className="text-[#b8f34a] shrink-0 mt-0.5" />
            <span>
              <strong>Balanced Institutional Baseline:</strong> Provides optimal operational balance for JPMorgan risk committees — 18.4 hours of lead time, 88.4% detection, and low alert fatigue (376 alerts/yr).
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
