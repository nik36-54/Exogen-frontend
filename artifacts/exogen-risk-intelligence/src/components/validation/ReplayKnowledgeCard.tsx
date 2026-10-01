import { CheckCircle2, CircleDashed, ShieldAlert, Sparkles, TrendingUp, AlertTriangle } from 'lucide-react';
import type { ReplayTimestampTick } from '@/types/validation-intelligence';

interface Props {
  tick: ReplayTimestampTick;
}

export function ReplayKnowledgeCard({ tick }: Props) {
  return (
    <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1f2427] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              INFORMATION BOUNDARY · NO LOOK-AHEAD BIAS
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              STRICT TIME-ISOLATION
            </span>
          </div>
          <h3 className="text-base font-semibold text-[#f5f5f2] mt-0.5">
            What Exogen Knew at {tick.label} ({tick.timestamp})
          </h3>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-[#6c7479]">REPLAY STATE</span>
          <div className="text-xs font-mono text-[#8d969b]">
            Evaluation: <span className="text-[#f5f5f2]">Clean Historical Walk</span>
          </div>
        </div>
      </div>

      {/* Snapshot metrics strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3">
          <div className="text-[10px] font-mono uppercase text-[#8d969b]">Market Probability</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-[#f5f5f2]">{tick.probabilityPct.toFixed(1)}%</span>
            <span className="text-[10px] font-mono text-[#8d969b]">consensus</span>
          </div>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3">
          <div className="text-[10px] font-mono uppercase text-[#8d969b]">Exogen Risk Score</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className={`text-xl font-bold font-mono ${
              tick.riskScore >= 70 ? 'text-[#ff5c5c]' : tick.riskScore >= 40 ? 'text-[#e5c07b]' : 'text-[#b8f34a]'
            }`}>
              {tick.riskScore}
            </span>
            <span className="text-[10px] font-mono text-[#8d969b]">/ 100</span>
          </div>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3">
          <div className="text-[10px] font-mono uppercase text-[#8d969b]">Modeled Exposure</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-[#f5f5f2]">${tick.modeledExposureUsdM.toFixed(1)}M</span>
            <span className="text-[10px] font-mono text-[#8d969b]">EXP-00072</span>
          </div>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3">
          <div className="text-[10px] font-mono uppercase text-[#8d969b]">Downside Impact</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="text-xl font-bold font-mono text-[#ff5c5c]">${tick.potentialImpactUsdM.toFixed(1)}M</span>
            <span className="text-[10px] font-mono text-[#8d969b]">simulated</span>
          </div>
        </div>
      </div>

      {/* Narrative note */}
      <div className="rounded-lg border border-[#24282c] bg-[#0d0f11] p-3.5 text-xs text-[#c8cece] leading-relaxed">
        <span className="font-semibold text-[#f5f5f2] mr-1">Snapshot Context:</span>
        {tick.summaryNote}
      </div>

      {/* Two columns: Known Facts vs Not Yet Known Future */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Known Facts */}
        <div className="rounded-lg border border-[#1e2a1d] bg-[#111712]/50 p-4 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#b8f34a]">
            <CheckCircle2 size={14} className="text-[#b8f34a]" />
            <span>KNOWN TO EXOGEN AT THIS TIMESTAMP</span>
          </div>
          <ul className="space-y-2 text-xs text-[#d6ded5]">
            {tick.knownFacts.map((fact, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-[#b8f34a] font-mono text-[10px] mt-0.5">✓</span>
                <span className="leading-snug">{fact}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Not Yet Known (Future Information) */}
        <div className="rounded-lg border border-[#29221d] bg-[#191410]/50 p-4 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#e5c07b]">
            <CircleDashed size={14} className="text-[#e5c07b]" />
            <span>NOT YET KNOWN (FUTURE BLINDED)</span>
          </div>
          {tick.unknownFutureFacts.length > 0 ? (
            <ul className="space-y-2 text-xs text-[#a89d93]">
              {tick.unknownFutureFacts.map((fact, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#e5c07b] font-mono text-[10px] mt-0.5">○</span>
                  <span className="leading-snug">{fact}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-[#8d969b] italic">
              All future outcomes have resolved at this timestamp. Replay cycle complete.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
