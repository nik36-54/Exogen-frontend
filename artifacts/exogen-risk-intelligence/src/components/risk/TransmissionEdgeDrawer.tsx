import { Activity, Clock, ShieldCheck, X } from 'lucide-react';
import type { TransmissionEdge } from '@/types/risk-intelligence';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  edge: TransmissionEdge | null;
  sourceLabel?: string;
  targetLabel?: string;
}

export function TransmissionEdgeDrawer({
  isOpen,
  onClose,
  edge,
  sourceLabel,
  targetLabel,
}: Props) {
  if (!isOpen || !edge) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="edge-drawer-title"
        className="w-full max-w-[440px] bg-[#111417] border-l border-[#262e33] flex flex-col justify-between shadow-2xl p-6 overflow-y-auto"
      >
        <div>
          <div className="flex items-center justify-between border-b border-[#20272b] pb-4">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-[#b8f34a]" />
              <h3 id="edge-drawer-title" className="text-[14px] font-semibold text-[#edf1eb]">
                Transmission Edge Inspector
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-[#7a8489] hover:bg-[#181d20] hover:text-[#d3d8d5]"
            >
              <X size={15} />
            </button>
          </div>

          <div className="mt-4 rounded border border-[#21272b] bg-[#0c0f11] p-3 text-[11px]">
            <span className="block text-[8px] font-semibold tracking-[.1em] text-[#6b767b]">
              PATH CONNECTION
            </span>
            <div className="mt-2 flex items-center justify-between font-medium text-[#edf1ec]">
              <span className="truncate max-w-[150px]">{sourceLabel || edge.source}</span>
              <span className="mono text-[#b8f34a]">→ {edge.relationship} →</span>
              <span className="truncate max-w-[150px] text-right">{targetLabel || edge.target}</span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 text-[11px]">
            <div className="rounded border border-[#1f2427] bg-[#0c0f11] p-3 text-center">
              <span className="text-[8px] font-semibold tracking-[.1em] text-[#6b767b]">RELATIONSHIP TYPE</span>
              <div className="mono mt-1 font-semibold text-[#edf0eb]">{edge.relationship}</div>
              <span className="text-[8px] text-[#677277]">{edge.isCausal ? 'Direct Causal' : 'Correlational'}</span>
            </div>

            <div className="rounded border border-[#1f2427] bg-[#0c0f11] p-3 text-center">
              <span className="text-[8px] font-semibold tracking-[.1em] text-[#6b767b]">CONFIDENCE</span>
              <div className="mono mt-1 font-semibold text-[#b8f34a]">{edge.confidencePct.toFixed(1)}%</div>
              <span className="text-[8px] text-[#677277]">Modeled certainty</span>
            </div>

            <div className="rounded border border-[#1f2427] bg-[#0c0f11] p-3 text-center">
              <span className="text-[8px] font-semibold tracking-[.1em] text-[#6b767b]">EVIDENCE BASIS</span>
              <div className="mono mt-1 font-semibold text-[#d4ded3]">{edge.evidenceType}</div>
              <span className="text-[8px] text-[#677277]">Calibrated framework</span>
            </div>

            <div className="rounded border border-[#1f2427] bg-[#0c0f11] p-3 text-center">
              <span className="text-[8px] font-semibold tracking-[.1em] text-[#6b767b]">IMPACT DIRECTION</span>
              <div className={`mono mt-1 font-semibold ${edge.direction === 'NEGATIVE' ? 'text-[#ff6b6b]' : edge.direction === 'POSITIVE' ? 'text-[#b8f34a]' : 'text-[#f5c76c]'}`}>
                {edge.direction}
              </div>
              <span className="text-[8px] text-[#677277]">Vector trajectory</span>
            </div>
          </div>

          <div className="mt-5">
            <span className="text-[9px] font-semibold tracking-[.12em] text-[#69747a]">
              ECONOMIC MECHANISM EXPLANATION
            </span>
            <div className="mt-1.5 rounded border border-[#23292d] bg-[#0c0f11] p-3 text-[11px] leading-relaxed text-[#b1bbb3]">
              {edge.explanation}
            </div>
            <div className="mt-2 text-[10px] text-[#6a7479] italic">
              Illustrative transmission model · JPMorgan Chase demonstration scenario.
            </div>
          </div>
        </div>

        <div className="border-t border-[#20272b] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded bg-[#171b1e] py-2 text-[11px] font-medium text-[#cdd3cf] hover:bg-[#202529]"
          >
            Close Edge Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
