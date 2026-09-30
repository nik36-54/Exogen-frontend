import { Copy, Check, FileCheck, Layers, Sparkles, X, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  probabilityPct: number;
  exposureUsdM: number;
  scenarioMagnitudePct: number;
  transmissionMultiplier: number;
  confidencePct: number;
  potentialImpactUsdM: number;
  scenarioName: string;
  eventId: string;
  onOpenProvenance?: () => void;
}

export function CalculationDetailsDrawer({
  isOpen,
  onClose,
  probabilityPct,
  exposureUsdM,
  scenarioMagnitudePct,
  transmissionMultiplier,
  confidencePct,
  potentialImpactUsdM,
  scenarioName,
  eventId,
  onOpenProvenance,
}: Props) {
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyInputs = () => {
    const text = JSON.stringify(
      {
        eventId,
        scenario: scenarioName,
        probabilityPct,
        exposureUsdM,
        scenarioMagnitudePct,
        transmissionMultiplier,
        confidencePct,
        potentialImpactUsdM,
        engineVersion: 'v0.1-illustrative',
        timestamp: new Date().toISOString(),
      },
      null,
      2
    );
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in-0 duration-150">
      <div className="w-full max-w-lg border-l border-[#24282c] bg-[#111416] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#24282c] pb-4">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#b8f34a]" />
              <h2 className="text-sm font-semibold tracking-wide text-[#f5f5f2]">
                CALCULATION DETAILS
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
            <span className="text-[10px] font-mono text-[#92989e]">ENGINE: V0.1 · SCENARIO: {scenarioName.toUpperCase()}</span>
            <span className="rounded bg-[#b8f34a]/10 px-1.5 py-0.5 text-[9px] font-mono font-medium text-[#b8f34a]">
              DEMO MODEL
            </span>
          </div>

          {/* Section: Inputs */}
          <div className="mt-6 space-y-4">
            <div>
              <div className="text-[11px] font-mono font-semibold tracking-wider text-[#92989e]">
                01 · CALCULATION INPUTS
              </div>
              <div className="mt-2 divide-y divide-[#1e2225] rounded border border-[#24282c] bg-[#0a0a0b]/60">
                <div className="flex items-center justify-between px-3 py-2 text-xs">
                  <span className="text-[#92989e]">Market Probability (P_M)</span>
                  <span className="font-mono font-medium text-[#f5f5f2]">{probabilityPct.toFixed(1)}%</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 text-xs">
                  <span className="text-[#92989e]">Modeled Exposure (EXP)</span>
                  <span className="font-mono font-medium text-[#f5f5f2]">${exposureUsdM.toFixed(1)}M</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 text-xs">
                  <span className="text-[#92989e]">Scenario Magnitude (S_M)</span>
                  <span className="font-mono font-medium text-[#f5f5f2]">{scenarioMagnitudePct}%</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 text-xs">
                  <span className="text-[#92989e]">Transmission Multiplier (T_X)</span>
                  <span className="font-mono font-medium text-[#f5f5f2]">{transmissionMultiplier.toFixed(1)}x</span>
                </div>
                <div className="flex items-center justify-between px-3 py-2 text-xs">
                  <span className="text-[#92989e]">Evidence Confidence</span>
                  <span className="font-mono font-medium text-[#f5f5f2]">{confidencePct}%</span>
                </div>
              </div>
            </div>

            {/* Section: Formula Framework */}
            <div>
              <div className="text-[11px] font-mono font-semibold tracking-wider text-[#92989e]">
                02 · CALCULATION CHAIN
              </div>
              <div className="mt-2 rounded border border-[#24282c] bg-[#171a1d] p-3 text-xs leading-relaxed text-[#92989e]">
                <div className="font-mono text-[11px] text-[#f5f5f2] mb-1">
                  Impact = P_M × Exposure × S_Magnitude × T_Multiplier
                </div>
                <div className="text-[11px] text-[#656b70]">
                  Illustrative calculation framework for prototype visualization. Real-time Monte Carlo loss simulations will supersede in production backend.
                </div>
              </div>
            </div>

            {/* Section: Output */}
            <div>
              <div className="text-[11px] font-mono font-semibold tracking-wider text-[#92989e]">
                03 · RESULTING POTENTIAL IMPACT
              </div>
              <div className="mt-2 flex items-center justify-between rounded border border-[#b8f34a]/30 bg-[#b8f34a]/5 p-4">
                <div>
                  <div className="text-[10px] font-mono text-[#92989e]">POTENTIAL DOLLAR IMPACT</div>
                  <div className="text-2xl font-mono font-bold text-[#b8f34a]">
                    ${potentialImpactUsdM.toFixed(1)}M
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-[#92989e]">SCENARIO RANGE</div>
                  <div className="text-xs font-mono text-[#f5f5f2]">
                    ${(potentialImpactUsdM * 0.7).toFixed(1)}M – ${(potentialImpactUsdM * 1.35).toFixed(1)}M
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 border-t border-[#24282c] pt-4 flex flex-col gap-2">
          <button
            onClick={copyInputs}
            className="flex items-center justify-center gap-2 rounded border border-[#24282c] bg-[#171a1d] py-2 text-xs font-medium text-[#f5f5f2] transition hover:bg-[#1e2225]"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[#b8f34a]" /> : <Copy className="h-3.5 w-3.5 text-[#92989e]" />}
            {copied ? 'Copied calculation parameters to clipboard' : 'Copy calculation inputs'}
          </button>

          {onOpenProvenance ? (
            <button
              onClick={() => {
                onClose();
                onOpenProvenance();
              }}
              className="flex items-center justify-center gap-2 rounded bg-[#b8f34a] py-2 text-xs font-medium text-[#0a0a0b] transition hover:bg-[#a6e03b]"
            >
              <FileCheck className="h-3.5 w-3.5" />
              View full audit provenance
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                setLocation(`/events/${eventId}`);
              }}
              className="flex items-center justify-center gap-2 rounded border border-[#24282c] bg-[#171a1d] py-2 text-xs font-medium text-[#b8f34a] transition hover:bg-[#1e2225]"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Inspect Canonical Event ({eventId})
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
