import { X, HelpCircle, FileCheck, Layers, Sparkles, BookOpen, AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ValidationMethodologyDrawer({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
    >
      <div className="h-full w-full max-w-lg border-l border-[#24282c] bg-[#111416] p-6 shadow-2xl overflow-y-auto soft-scrollbar space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#24282c] pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#b8f34a]" />
            <h3 className="text-base font-semibold text-[#f5f5f2]">
              Validation Methodology & Metrics Guide
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#8d969b] hover:bg-[#1a1e22] hover:text-[#f5f5f2]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Core Principles */}
        <div className="rounded-lg border border-[#1e2a1d] bg-[#121a13] p-4 text-xs text-[#c6d4c5] space-y-2">
          <div className="font-semibold text-[#b8f34a] flex items-center gap-1.5">
            <Sparkles size={14} />
            <span>Strict Temporal Integrity (No Look-Ahead Bias)</span>
          </div>
          <p className="leading-relaxed text-[#b1c0b0]">
            Every backtest and historical replay evaluation uses strictly the information known at the historical prediction timestamp $T_0$. Revisions, subsequent contract splits, or post-hoc outcome data are rigorously blinded until resolution time.
          </p>
        </div>

        {/* Definitions List */}
        <div className="space-y-4 text-xs">
          <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3.5 space-y-1.5">
            <div className="font-mono font-semibold text-[#b8f34a]">Brier Score</div>
            <p className="text-[#a0a8af] leading-relaxed">
              Measures the mean squared difference between predicted probabilities and actual binary outcomes (y in 0 or 1):
            </p>
            <div className="font-mono text-[11px] bg-[#0a0a0b] p-2 rounded text-[#f5f5f2] border border-[#24282c]">
              {'Brier = (1 / N) * Σ (f_t - o_t)²'}
            </div>
            <p className="text-[11px] text-[#6c7479]">
              Lower is better. A score of 0.0 indicates perfect foresight; 0.25 represents an uninformative 50/50 baseline coin toss. Exogen achieves 0.142.
            </p>
          </div>

          <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3.5 space-y-1.5">
            <div className="font-mono font-semibold text-[#b8f34a]">Log Loss (Cross-Entropy)</div>
            <p className="text-[#a0a8af] leading-relaxed">
              Heavily penalizes overconfident predictions that turn out incorrect:
            </p>
            <div className="font-mono text-[11px] bg-[#0a0a0b] p-2 rounded text-[#f5f5f2] border border-[#24282c]">
              {'LogLoss = -(1 / N) * Σ [o_t * ln(f_t) + (1 - o_t) * ln(1 - f_t)]'}
            </div>
            <p className="text-[11px] text-[#6c7479]">
              Ensures market consensus models avoid extreme tail certainty without strong liquidity backing.
            </p>
          </div>

          <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3.5 space-y-1.5">
            <div className="font-mono font-semibold text-[#b8f34a]">Expected Calibration Error (ECE)</div>
            <p className="text-[#a0a8af] leading-relaxed">
              Weighted average difference between predicted confidence and observed empirical frequency across probability deciles:
            </p>
            <div className="font-mono text-[11px] bg-[#0a0a0b] p-2 rounded text-[#f5f5f2] border border-[#24282c]">
              {'ECE = Σ (|B_m| / N) * |acc(B_m) - conf(B_m)|'}
            </div>
            <p className="text-[11px] text-[#6c7479]">
              Exogen’s ECE is 0.071 (7.1%), reflecting dependable calibration across the 30%–70% range.
            </p>
          </div>

          <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3.5 space-y-1.5">
            <div className="font-mono font-semibold text-[#b8f34a]">Warning Lead Time</div>
            <p className="text-[#a0a8af] leading-relaxed">
              The time delta between the moment an automated sentinel warning fires and the timestamp when the material event resolution is confirmed on official registries:
            </p>
            <div className="font-mono text-[11px] bg-[#0a0a0b] p-2 rounded text-[#f5f5f2] border border-[#24282c]">
              {'ΔT_lead = T_outcome - T_warning'}
            </div>
            <p className="text-[11px] text-[#6c7479]">
              Exogen delivers a median lead time of 14.2 hours and an average of 18.4 hours, giving enterprise risk desks actionable operational breathing room.
            </p>
          </div>

          <div className="rounded-lg border border-[#24282c] bg-[#161a1d] p-3.5 space-y-1.5">
            <div className="font-mono font-semibold text-[#b8f34a]">Range Coverage (Impact Validation)</div>
            <p className="text-[#a0a8af] leading-relaxed">
              The proportion of realized financial proxy outcomes that fell within Exogen’s modeled [Base, Downside] dollar impact bracket.
            </p>
            <p className="text-[11px] text-[#6c7479]">
              Current coverage is 82.0% across 214 evaluated corporate stress proxy cases.
            </p>
          </div>
        </div>

        {/* Institutional disclaimer */}
        <div className="rounded-lg border border-[#24282c] bg-[#0a0a0b] p-3 text-[11px] text-[#8d969b] leading-relaxed">
          <span className="font-semibold text-[#f5f5f2]">Notice on Synthetic Validation:</span> Validation metrics presented in this workspace are calculated from synthetic backtesting datasets for demonstration purposes. They reflect the mathematical architecture and evaluation methodologies of the Exogen engine.
        </div>
      </div>
    </div>
  );
}
