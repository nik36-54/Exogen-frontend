import { CheckCircle2, HelpCircle, ShieldCheck, X, XCircle } from 'lucide-react';
import type { OracleCompatibilityRecord } from '@/types/canonical-matching';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  record: OracleCompatibilityRecord | null;
}

export function OracleExplanationModal({ isOpen, onClose, record }: Props) {
  if (!isOpen || !record) return null;

  return (
    <div
      role="presentation"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="oracle-modal-title"
        className="w-full max-w-[500px] overflow-hidden rounded-[8px] border border-[#353f44] bg-[#111417] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-[#21282c] px-5 py-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-[#b8f34a]" />
            <h3 id="oracle-modal-title" className="text-[14px] font-semibold text-[#edf1eb]">
              Oracle Compatibility Rationale
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#788287] hover:bg-[#1a1f23] hover:text-[#d3d8d5]"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5 text-[12px] leading-relaxed text-[#9ba5aa]">
          <div className="flex items-center justify-between rounded border border-[#23292d] bg-[#0c0f11] p-3">
            <div>
              <span className="block text-[9px] font-semibold tracking-[.1em] text-[#6b767b]">
                EVALUATED EVENT
              </span>
              <span className="font-medium text-[#edf0eb]">{record.eventTitle}</span>
            </div>
            <div className="text-right">
              <span className="block text-[9px] font-semibold tracking-[.1em] text-[#6b767b]">
                COMPATIBILITY
              </span>
              <span
                className={`mono text-[11px] font-semibold ${
                  record.compatibility === 'TRUE'
                    ? 'text-[#b8f34a]'
                    : record.compatibility === 'UNKNOWN'
                    ? 'text-[#f5c76c]'
                    : 'text-[#ff6b6b]'
                }`}
              >
                {record.compatibility} ({record.confidencePct}%)
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <span className="text-[10px] font-semibold text-[#78848a]">Designated Resolution Oracle:</span>
              <div className="mt-1 rounded border border-[#21272b] bg-[#14181b] p-2.5 font-mono text-[11px] text-[#e3e8e2]">
                {record.oracleSource}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-semibold text-[#78848a]">Specific Resolution Condition:</span>
              <div className="mt-1 rounded border border-[#21272b] bg-[#14181b] p-2.5 text-[11px] text-[#ccd3cc]">
                {record.resolutionCondition}
              </div>
            </div>

            <div
              className={`rounded border p-3 ${
                record.compatibility === 'TRUE'
                  ? 'border-[#394931] bg-[#141d13] text-[#bde08f]'
                  : record.compatibility === 'UNKNOWN'
                  ? 'border-[#4e4024] bg-[#1d1810] text-[#e5cf9b]'
                  : 'border-[#4f2929] bg-[#1c1212] text-[#f1a4a4]'
              }`}
            >
              <span className="font-semibold uppercase tracking-[.08em] text-[10px]">
                Why {record.compatibility}?
              </span>
              <p className="mt-1 text-[11px] leading-relaxed">
                {record.rationale}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end border-t border-[#21282c] bg-[#0e1214] px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded bg-[#191e21] px-4 py-1.5 text-[11px] font-medium text-[#c9d0cc] hover:bg-[#23292d]"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
