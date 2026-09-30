import { AlertTriangle, Check, Layers, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventATitle: string;
  eventBTitle: string;
}

export function MergeConfirmModal({ isOpen, onClose, onConfirm, eventATitle, eventBTitle }: Props) {
  if (!isOpen) return null;

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
        aria-labelledby="merge-modal-title"
        className="w-full max-w-[500px] overflow-hidden rounded-[8px] border border-[#374147] bg-[#111518] shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
      >
        <div className="flex items-center justify-between border-b border-[#21282c] px-5 py-4">
          <div className="flex items-center gap-2">
            <Layers size={15} className="text-[#b8f34a]" />
            <h3 id="merge-modal-title" className="text-[14px] font-semibold tracking-[.06em] text-[#edf1eb]">
              MERGE EVENTS?
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

        <div className="p-5 text-[12px] leading-relaxed text-[#9aa3a8]">
          <p>
            These contracts will be reconciled and permanently associated with the same canonical event definition:
          </p>

          <div className="my-3 space-y-2 rounded border border-[#21272b] bg-[#0c0f11] p-3 text-[11px]">
            <div className="truncate text-[#d4dad2]">
              <strong className="text-[#727d82]">A:</strong> {eventATitle}
            </div>
            <div className="truncate text-[#d4dad2]">
              <strong className="text-[#727d82]">B:</strong> {eventBTitle}
            </div>
          </div>

          <div className="rounded border border-[#3b3420] bg-[#1a1811] p-3 text-[11px] text-[#e0cf9b]">
            <span className="font-semibold text-[#f5c76c]">This action will recalculate:</span>
            <ul className="mt-1.5 list-disc space-y-1 pl-4 text-[#cfc199]">
              <li>Consensus probability (venue liquidity re-weighting)</li>
              <li>Risk mapping and transmission propagation</li>
              <li>JPMorgan Chase business unit exposure allocations</li>
              <li>Downstream dollar impact distributions</li>
            </ul>
          </div>

          <p className="mt-3 text-[10px] text-[#6b767c]">
            (Frontend state simulation · will emit state change for active demo session)
          </p>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-[#21282c] bg-[#0e1214] px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-[#2a3237] px-3 py-1.5 text-[11px] text-[#939da2] hover:bg-[#151a1d] hover:text-[#e4e8e4]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-1.5 rounded border border-[#526a3c] bg-[#22301c] px-4 py-1.5 text-[11px] font-semibold text-[#b8f34a] hover:bg-[#2b3c23]"
          >
            <Check size={13} />
            <span>Confirm Merge</span>
          </button>
        </div>
      </div>
    </div>
  );
}
