import { useState } from 'react';
import { Check, RotateCcw, Sliders, X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  autoMergeThreshold: number;
  reviewThreshold: number;
  onSave: (autoMerge: number, review: number) => void;
}

export function ThresholdConfigDrawer({
  isOpen,
  onClose,
  autoMergeThreshold,
  reviewThreshold,
  onSave,
}: Props) {
  const [autoMerge, setAutoMerge] = useState(autoMergeThreshold);
  const [review, setReview] = useState(reviewThreshold);

  if (!isOpen) return null;

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
        aria-labelledby="threshold-drawer-title"
        className="w-full max-w-[420px] bg-[#111417] border-l border-[#262e33] flex flex-col justify-between shadow-2xl p-6"
      >
        <div>
          <div className="flex items-center justify-between border-b border-[#20272b] pb-4">
            <div className="flex items-center gap-2">
              <Sliders size={15} className="text-[#b8f34a]" />
              <h3 id="threshold-drawer-title" className="text-[14px] font-semibold text-[#edf1eb]">
                Match Threshold Calibration
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

          <div className="mt-2 text-[10px] text-[#6d777d]">
            Current demo thresholds · backend calibration profile
          </div>

          <div className="mt-6 space-y-6">
            {/* Auto Merge Slider */}
            <div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#b8f34a]">AUTO-MERGE THRESHOLD</span>
                <span className="mono text-[12px] font-semibold text-[#b8f34a]">
                  ≥ {autoMerge.toFixed(2)}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-[#869197]">
                Pairs scoring at or above this cutoff are automatically consolidated without human intervention.
              </p>
              <input
                type="range"
                min="0.75"
                max="0.98"
                step="0.01"
                value={autoMerge}
                onChange={(e) => setAutoMerge(parseFloat(e.target.value))}
                className="mt-3 w-full accent-[#b8f34a]"
              />
            </div>

            {/* Review Slider */}
            <div>
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#f5c76c]">REVIEW FLOOR THRESHOLD</span>
                <span className="mono text-[12px] font-semibold text-[#f5c76c]">
                  ≥ {review.toFixed(2)}
                </span>
              </div>
              <p className="mt-1 text-[10px] text-[#869197]">
                Pairs between this floor and auto-merge threshold are diverted to analyst review queues.
              </p>
              <input
                type="range"
                min="0.40"
                max="0.80"
                step="0.01"
                value={review}
                onChange={(e) => setReview(parseFloat(e.target.value))}
                className="mt-3 w-full accent-[#f5c76c]"
              />
            </div>

            {/* Visual Bands Summary */}
            <div className="rounded-[6px] border border-[#23292d] bg-[#0c0f11] p-4 text-[11px]">
              <span className="text-[9px] font-semibold tracking-[.1em] text-[#6f797f]">CLASSIFICATION BANDS</span>
              <div className="mt-3 space-y-2 font-mono text-[10px]">
                <div className="flex items-center justify-between rounded bg-[#172016] px-2.5 py-1.5 text-[#b8f34a]">
                  <span>AUTO-MERGE</span>
                  <span>≥ {autoMerge.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between rounded bg-[#241e14] px-2.5 py-1.5 text-[#f5c76c]">
                  <span>MANUAL REVIEW</span>
                  <span>{review.toFixed(2)} – {(autoMerge - 0.01).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between rounded bg-[#1b1c1e] px-2.5 py-1.5 text-[#889399]">
                  <span>KEEP DISTINCT</span>
                  <span>&lt; {review.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-[#20272b] pt-4">
          <button
            type="button"
            onClick={() => {
              setAutoMerge(0.90);
              setReview(0.65);
            }}
            className="flex items-center gap-1 text-[11px] text-[#7b868c] hover:text-[#d3d8d5]"
          >
            <RotateCcw size={12} />
            <span>Reset to default</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(autoMerge, review);
              onClose();
            }}
            className="flex items-center gap-1.5 rounded bg-[#b8f34a] px-3.5 py-1.5 text-[11px] font-semibold text-[#0a0a0b] hover:bg-[#c7f864]"
          >
            <Check size={13} />
            <span>Apply Thresholds</span>
          </button>
        </div>
      </div>
    </div>
  );
}
