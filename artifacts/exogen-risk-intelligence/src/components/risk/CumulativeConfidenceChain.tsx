import { AlertTriangle, ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import type { CumulativeConfidenceChain as ConfidenceChainData } from '@/types/risk-intelligence';

interface Props {
  chain: ConfidenceChainData;
}

export function CumulativeConfidenceChain({ chain }: Props) {
  const steps = [
    { label: 'Event Identity', value: chain.eventIdentityConfidencePct, note: 'Contract linkage match' },
    { label: 'Risk Mapping', value: chain.riskMappingConfidencePct, note: 'Event-to-risk taxonomy' },
    { label: 'Transmission Path', value: chain.transmissionConfidencePct, note: 'Economic mechanism flow' },
    { label: 'Exposure Model', value: chain.exposureConfidencePct, note: 'Business unit sensitivity' },
  ];

  return (
    <div className="rounded-[8px] border border-[#242b2f] bg-[#111417] p-5 text-[11px]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1e2428] pb-3">
        <div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#b8f34a]" />
            <span className="text-[9px] font-semibold uppercase tracking-[.18em] text-[#b8f34a]">
              CONFIDENCE DECOUPLING
            </span>
          </div>
          <h3 className="mt-1 text-[15px] font-medium text-[#edf0eb]">
            Multi-Stage Confidence Chain
          </h3>
        </div>
        <span className="text-[10px] text-[#7d888e]">
          Decoupled model lineage · No arbitrary metric multiplication
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((st, i) => (
          <div key={st.label} className="relative rounded border border-[#21272b] bg-[#0c0f11] p-3.5">
            <div className="flex items-center justify-between">
              <span className="mono text-[8px] text-[#636d72]">0{i + 1}</span>
              <span className="mono text-[14px] font-semibold text-[#b8f34a]">
                {st.value.toFixed(1)}%
              </span>
            </div>
            <div className="mt-1 font-semibold text-[#e1e6e0]">{st.label}</div>
            <p className="mt-0.5 text-[9px] text-[#7a868c]">{st.note}</p>
          </div>
        ))}
      </div>

      {/* Data Quality Impact Banner (Section 48) */}
      {chain.dataQualityWarning && chain.dataQualityWarning.isTriggered && (
        <div className="mt-4 rounded border border-[#524121] bg-[#1a160d] p-3 text-[11px] text-[#ded0a4]">
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={15} className="mt-0.5 shrink-0 text-[#f5c76c]" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold uppercase tracking-[.08em] text-[10px] text-[#f5c76c]">
                  DATA QUALITY ADJUSTMENT WARNING
                </span>
                <span className="text-[#594d34]">·</span>
                <span className="text-[10px] text-[#b9aa80]">Upstream freshness degradation</span>
              </div>
              <p className="mt-1 text-[11px] leading-relaxed text-[#c4b58c]">
                {chain.dataQualityWarning.reason} Unadjusted confidence: <strong className="mono">{chain.dataQualityWarning.unadjustedConfidencePct}%</strong> → Data quality adjusted confidence: <strong className="mono text-[#f5c76c]">{chain.dataQualityWarning.adjustedConfidencePct}%</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
