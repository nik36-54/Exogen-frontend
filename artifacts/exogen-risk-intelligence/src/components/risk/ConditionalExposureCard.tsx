import { AlertTriangle, ArrowRight, HelpCircle, Layers, Split } from 'lucide-react';
import type { ImpactDirection } from '@/types/risk-intelligence';

interface Scenario {
  scenarioName: string;
  condition: string;
  direction: ImpactDirection;
  exposureUsdM: number;
  explanation: string;
}

interface Props {
  scenarios: Scenario[];
  title?: string;
}

export function ConditionalExposureCard({ scenarios, title = 'Conditional Exposure Scenarios' }: Props) {
  if (!scenarios || scenarios.length === 0) return null;

  return (
    <article className="rounded-[8px] border border-[#242b2f] bg-[#111417] p-5 text-[11px]">
      <div className="flex items-center justify-between border-b border-[#1f2428] pb-3">
        <div className="flex items-center gap-2">
          <Split size={15} className="text-[#b8f34a]" />
          <h3 className="text-[14px] font-medium text-[#edf0eb]">{title}</h3>
        </div>
        <span className="mono text-[9px] text-[#717b81]">Macro Regime Branching</span>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {scenarios.map((sc, i) => (
          <div
            key={i}
            className={`rounded-[6px] border p-3.5 ${
              sc.direction === 'NEGATIVE'
                ? 'border-[#442323] bg-[#161010]'
                : sc.direction === 'POSITIVE'
                ? 'border-[#2d412b] bg-[#121a11]'
                : 'border-[#483d26] bg-[#1a1710]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="mono text-[9px] font-semibold text-[#8ca3b8]">SCENARIO 0{i + 1}</span>
              <span
                className={`mono text-[11px] font-semibold ${
                  sc.direction === 'NEGATIVE'
                    ? 'text-[#ff6b6b]'
                    : sc.direction === 'POSITIVE'
                    ? 'text-[#b8f34a]'
                    : 'text-[#f5c76c]'
                }`}
              >
                {sc.direction === 'NEGATIVE' ? '-' : sc.direction === 'POSITIVE' ? '+' : '±'}$
                {sc.exposureUsdM.toFixed(1)}M
              </span>
            </div>

            <div className="mt-1.5 text-[13px] font-medium text-[#edf1eb]">{sc.scenarioName}</div>
            <div className="mt-1 text-[10px] text-[#8e989d]">
              <strong className="text-[#c5cdc3]">Trigger condition:</strong> {sc.condition}
            </div>

            <p className="mt-2 text-[10px] leading-relaxed text-[#b1bbb3] border-t border-[#23292d] pt-2">
              {sc.explanation}
            </p>
          </div>
        ))}
      </div>
    </article>
  );
}
