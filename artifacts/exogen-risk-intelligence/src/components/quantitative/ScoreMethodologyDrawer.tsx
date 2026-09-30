import { ShieldAlert, X, ChevronRight, HelpCircle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ScoreMethodologyDrawer({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-150">
      <div className="w-full max-w-lg border-l border-[#24282c] bg-[#111416] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#24282c] pb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-[#b8f34a]" />
              <h2 className="text-sm font-semibold tracking-wide text-[#f5f5f2]">
                RISK SCORE METHODOLOGY
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded p-1 text-[#92989e] hover:bg-[#1e2225] hover:text-[#f5f5f2]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between rounded bg-[#171a1d] px-3 py-1.5 border border-[#24282c]">
            <span className="text-[10px] font-mono text-[#92989e]">MODEL: RISK SCORE MODEL · VERSION 0.1</span>
            <span className="rounded bg-[#7c8cff]/10 px-1.5 py-0.5 text-[9px] font-mono font-medium text-[#7c8cff]">
              ILLUSTRATIVE v0.1
            </span>
          </div>

          <div className="mt-4 rounded border border-[#24282c] bg-[#0a0a0b]/60 p-3 text-xs leading-relaxed text-[#92989e]">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#f5f5f2]">
              <HelpCircle className="h-3.5 w-3.5 text-[#b8f34a]" />
              Purpose of the Exogen Risk Score
            </div>
            <p className="mt-1 text-[11px] text-[#92989e]">
              Quantify the relative significance of external events using probability, severity, exposure, propagation, and confidence. The score answers: <em className="text-[#f5f5f2]">"How significant is this risk relative to others across our entire landscape?"</em>
            </p>
          </div>

          {/* Model Inputs */}
          <div className="mt-6 space-y-3">
            <div className="text-[11px] font-mono font-semibold tracking-wider text-[#92989e]">
              PRIMARY MODEL INPUTS
            </div>

            <div className="space-y-2">
              <div className="rounded border border-[#24282c] bg-[#171a1d] p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#f5f5f2]">1. Probability</span>
                  <span className="font-mono text-[10px] text-[#b8f34a]">WEIGHT ~28%</span>
                </div>
                <p className="mt-1 text-[11px] text-[#92989e]">
                  Market consensus probability derived from normalized prediction venue contracts (Polymarket, Kalshi).
                </p>
              </div>

              <div className="rounded border border-[#24282c] bg-[#171a1d] p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#f5f5f2]">2. Severity</span>
                  <span className="font-mono text-[10px] text-[#b8f34a]">WEIGHT ~29%</span>
                </div>
                <p className="mt-1 text-[11px] text-[#92989e]">
                  Potential business consequence rating on institutional financial health, regulatory compliance, and operational integrity.
                </p>
              </div>

              <div className="rounded border border-[#24282c] bg-[#171a1d] p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#f5f5f2]">3. Exposure</span>
                  <span className="font-mono text-[10px] text-[#b8f34a]">WEIGHT ~24%</span>
                </div>
                <p className="mt-1 text-[11px] text-[#92989e]">
                  Modeled company balance sheet sensitivity and asset/liability exposure at risk.
                </p>
              </div>

              <div className="rounded border border-[#24282c] bg-[#171a1d] p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#f5f5f2]">4. Propagation</span>
                  <span className="font-mono text-[10px] text-[#b8f34a]">WEIGHT ~18%</span>
                </div>
                <p className="mt-1 text-[11px] text-[#92989e]">
                  Breadth, path count, and velocity of transmission across operational channels and interconnected business divisions.
                </p>
              </div>

              <div className="rounded border border-[#24282c] bg-[#171a1d] p-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#f5f5f2]">5. Confidence Adjustment</span>
                  <span className="font-mono text-[10px] text-[#7c8cff]">EVIDENCE DAMPENER</span>
                </div>
                <p className="mt-1 text-[11px] text-[#92989e]">
                  Adjusts score upward or downward based on source contract freshness, oracle verification, and semantic matching confidence.
                </p>
              </div>
            </div>
          </div>

          {/* Flow Architecture */}
          <div className="mt-6">
            <div className="text-[11px] font-mono font-semibold tracking-wider text-[#92989e]">
              MODEL STRUCTURE FLOW
            </div>
            <div className="mt-2 rounded border border-[#24282c] bg-[#0a0a0b] p-3 text-[11px] font-mono text-[#92989e] space-y-1">
              <div className="flex items-center gap-2 text-[#f5f5f2]">
                <ChevronRight className="h-3 w-3 text-[#b8f34a]" /> Probability (Market Consensus)
              </div>
              <div className="pl-4 text-[#656b70]">+</div>
              <div className="flex items-center gap-2 text-[#f5f5f2]">
                <ChevronRight className="h-3 w-3 text-[#b8f34a]" /> Severity (Consequence Model)
              </div>
              <div className="pl-4 text-[#656b70]">+</div>
              <div className="flex items-center gap-2 text-[#f5f5f2]">
                <ChevronRight className="h-3 w-3 text-[#b8f34a]" /> Exposure (Company Asset Mapping)
              </div>
              <div className="pl-4 text-[#656b70]">+</div>
              <div className="flex items-center gap-2 text-[#f5f5f2]">
                <ChevronRight className="h-3 w-3 text-[#b8f34a]" /> Propagation (Transmission Graph)
              </div>
              <div className="pl-4 text-[#656b70]">+</div>
              <div className="flex items-center gap-2 text-[#7c8cff]">
                <ChevronRight className="h-3 w-3 text-[#7c8cff]" /> Confidence Adjustment (Data Quality)
              </div>
              <div className="pl-4 text-[#b8f34a]">↓</div>
              <div className="font-bold text-[#b8f34a] bg-[#b8f34a]/10 p-1.5 rounded">
                = Composite Risk Score (0 – 100)
              </div>
            </div>
          </div>
        </div>

        {/* Footer Notice */}
        <div className="mt-8 border-t border-[#24282c] pt-4">
          <p className="text-[10px] text-[#656b70] leading-relaxed">
            Note: Illustrative scoring model — v0.1. This formula represents an active structural prototype for institutional preview. The production calculation engine will be calibrated against historical balance-sheet stress events.
          </p>
          <button
            onClick={onClose}
            className="mt-3 w-full rounded border border-[#24282c] bg-[#171a1d] py-2 text-xs font-medium text-[#f5f5f2] hover:bg-[#1e2225]"
          >
            Close Methodology
          </button>
        </div>
      </div>
    </div>
  );
}
