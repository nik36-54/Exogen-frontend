import { Activity, AlertOctagon, CheckCircle2, Clock, X } from 'lucide-react';
import type { IngestionPipelineStage } from '@/types/canonical-matching';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  stage: IngestionPipelineStage | null;
}

export function IngestionHealthDrawer({ isOpen, onClose, stage }: Props) {
  if (!isOpen || !stage) return null;

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
        aria-labelledby="ingestion-drawer-title"
        className="w-full max-w-[460px] bg-[#111417] border-l border-[#262e33] flex flex-col justify-between shadow-2xl p-6 overflow-y-auto"
      >
        <div>
          <div className="flex items-center justify-between border-b border-[#20272b] pb-4">
            <div className="flex items-center gap-2">
              <Activity size={15} className="text-[#b8f34a]" />
              <h3 id="ingestion-drawer-title" className="text-[14px] font-semibold text-[#edf1eb]">
                Pipeline Stage: {stage.name}
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

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded border border-[#21272b] bg-[#0c0f11] p-3 text-center">
              <span className="text-[9px] font-semibold tracking-[.1em] text-[#6a7479]">PROCESSED</span>
              <div className="mono mt-1 text-[20px] font-semibold text-[#edf1eb]">
                {stage.processedCount.toLocaleString()}
              </div>
            </div>
            <div className="rounded border border-[#21272b] bg-[#0c0f11] p-3 text-center">
              <span className="text-[9px] font-semibold tracking-[.1em] text-[#6a7479]">FAILED</span>
              <div className={`mono mt-1 text-[20px] font-semibold ${stage.failedCount > 0 ? 'text-[#ff6b6b]' : 'text-[#b8f34a]'}`}>
                {stage.failedCount}
              </div>
            </div>
            <div className="rounded border border-[#21272b] bg-[#0c0f11] p-3 text-center">
              <span className="text-[9px] font-semibold tracking-[.1em] text-[#6a7479]">AVERAGE LATENCY</span>
              <div className="mono mt-1 text-[20px] font-semibold text-[#b8f34a]">
                {stage.averageLatencyMs}ms
              </div>
            </div>
            <div className="rounded border border-[#21272b] bg-[#0c0f11] p-3 text-center">
              <span className="text-[9px] font-semibold tracking-[.1em] text-[#6a7479]">FAILURE RATE</span>
              <div className="mono mt-1 text-[20px] font-semibold text-[#8e989d]">
                {stage.failureRatePct.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between rounded border border-[#21272b] bg-[#0e1214] px-3.5 py-2.5 text-[11px]">
            <span className="text-[#848f95]">Last successful execution:</span>
            <span className="mono text-[#b8f34a]">{stage.lastSuccessfulRun}</span>
          </div>

          <div className="mt-6">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold tracking-[.12em] text-[#6c767c]">
              <AlertOctagon size={12} className="text-[#f5c76c]" />
              <span>RECENT SYSTEM LOG ERRORS</span>
            </div>
            <div className="mt-2.5 space-y-2">
              {stage.recentErrors.length ? (
                stage.recentErrors.map((err, i) => (
                  <div key={i} className="rounded border border-[#262c30] bg-[#0c0f11] p-3 text-[10px]">
                    <div className="flex items-center justify-between text-[#6a7479]">
                      <span className="mono">{err.timestamp}</span>
                      {err.contractId && <span className="mono text-[#8a969c]">{err.contractId}</span>}
                    </div>
                    <p className="mt-1 text-[#cfd6ce]">{err.message}</p>
                  </div>
                ))
              ) : (
                <div className="rounded border border-[#1d2320] bg-[#101511] p-3 text-center text-[10px] text-[#97b889]">
                  <CheckCircle2 size={13} className="mx-auto mb-1 text-[#b8f34a]" />
                  Zero critical failures in last rolling 24-hour buffer.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-[#20272b] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded bg-[#171b1e] py-2 text-[11px] font-medium text-[#cdd3cf] hover:bg-[#202529]"
          >
            Close Stage Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
