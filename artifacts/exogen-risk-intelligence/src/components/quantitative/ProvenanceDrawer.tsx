import { FileCheck2, X, CheckCircle2, ChevronRight, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { CalculationProvenance } from '@/types/quantitative-intelligence';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  provenance: CalculationProvenance;
}

export function ProvenanceDrawer({ isOpen, onClose, provenance }: Props) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyAuditTrail = () => {
    navigator.clipboard?.writeText(JSON.stringify(provenance, null, 2));
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
              <FileCheck2 className="h-4 w-4 text-[#b8f34a]" />
              <h2 className="text-sm font-semibold tracking-wide text-[#f5f5f2]">
                CALCULATION PROVENANCE
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
            <span className="text-[10px] font-mono text-[#92989e]">{provenance.calculationId}</span>
            <span className="text-[9px] font-mono text-[#b8f34a]">TIMESTAMP: {provenance.calculatedAt}</span>
          </div>

          {/* End-to-End Chain */}
          <div className="mt-6">
            <div className="text-[11px] font-mono font-semibold tracking-wider text-[#92989e]">
              END-TO-END INTELLIGENCE AUDIT CHAIN
            </div>

            <div className="mt-3 divide-y divide-[#1e2225] rounded border border-[#24282c] bg-[#0a0a0b]/60">
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-[#92989e]">CANONICAL EVENT</span>
                <span className="font-mono font-medium text-[#b8f34a]">{provenance.canonicalEventId}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-[#92989e]">MARKET CONSENSUS (P_M)</span>
                <span className="font-mono font-medium text-[#f5f5f2]">{provenance.consensusProbabilityPct.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-[#92989e]">IDENTITY CONFIDENCE</span>
                <span className="font-mono font-medium text-[#f5f5f2]">{provenance.identityConfidencePct.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-[#92989e]">RISK RELATIONSHIP CONFIDENCE</span>
                <span className="font-mono font-medium text-[#f5f5f2]">{provenance.riskRelationshipConfidencePct}%</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-[#92989e]">EXPOSURE MODEL REFERENCE</span>
                <span className="font-mono font-medium text-[#f5f5f2]">{provenance.exposureModelId} (${provenance.exposureModelUsdM.toFixed(1)}M)</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-[#92989e]">EXPOSURE CONFIDENCE</span>
                <span className="font-mono font-medium text-[#f5f5f2]">{provenance.exposureConfidencePct}%</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs">
                <span className="text-[#92989e]">ACTIVE SCENARIO & MAGNITUDE</span>
                <span className="font-mono font-medium text-[#f5f5f2]">{provenance.scenario} ({provenance.scenarioMagnitudePct}%)</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs bg-[#171a1d]">
                <span className="text-[#92989e] font-semibold">COMPOSITE RISK SCORE</span>
                <span className="font-mono font-bold text-[#b8f34a]">{provenance.riskScore} / 100</span>
              </div>
              <div className="flex items-center justify-between px-3 py-2 text-xs bg-[#171a1d]">
                <span className="text-[#92989e] font-semibold">MODELED POTENTIAL IMPACT</span>
                <span className="font-mono font-bold text-[#b8f34a]">${provenance.potentialImpactUsdM.toFixed(1)}M</span>
              </div>
            </div>
          </div>

          {/* Model Versions */}
          <div className="mt-6">
            <div className="text-[11px] font-mono font-semibold tracking-wider text-[#92989e]">
              REGISTERED MODEL VERSIONS
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="rounded border border-[#24282c] bg-[#171a1d] p-2">
                <div className="text-[#656b70]">Risk Score Model</div>
                <div className="font-semibold text-[#f5f5f2]">{provenance.modelVersions.riskScoreModel}</div>
              </div>
              <div className="rounded border border-[#24282c] bg-[#171a1d] p-2">
                <div className="text-[#656b70]">Exposure Model</div>
                <div className="font-semibold text-[#f5f5f2]">{provenance.modelVersions.exposureModel}</div>
              </div>
              <div className="rounded border border-[#24282c] bg-[#171a1d] p-2">
                <div className="text-[#656b70]">Scenario Model</div>
                <div className="font-semibold text-[#f5f5f2]">{provenance.modelVersions.scenarioModel}</div>
              </div>
              <div className="rounded border border-[#24282c] bg-[#171a1d] p-2">
                <div className="text-[#656b70]">Calculation Engine</div>
                <div className="font-semibold text-[#f5f5f2]">{provenance.modelVersions.calculationEngine}</div>
              </div>
            </div>
          </div>

          {/* Audit Steps */}
          <div className="mt-6">
            <div className="text-[11px] font-mono font-semibold tracking-wider text-[#92989e]">
              EXECUTION AUDIT TRAIL
            </div>
            <div className="mt-2 space-y-2">
              {provenance.auditTrail.map((step, idx) => (
                <div key={idx} className="rounded border border-[#24282c] bg-[#171a1d] p-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#f5f5f2] flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#b8f34a]" />
                      {step.step}
                    </span>
                    <span className="rounded bg-[#b8f34a]/10 px-1 py-0.2 text-[9px] font-mono text-[#b8f34a]">
                      {step.status}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#92989e] leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 border-t border-[#24282c] pt-4">
          <button
            onClick={copyAuditTrail}
            className="flex w-full items-center justify-center gap-2 rounded bg-[#171a1d] border border-[#24282c] py-2 text-xs font-medium text-[#f5f5f2] hover:bg-[#1e2225]"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-[#b8f34a]" /> : <Copy className="h-3.5 w-3.5 text-[#92989e]" />}
            {copied ? 'Audit trail copied to clipboard' : 'Copy complete audit trail'}
          </button>
        </div>
      </div>
    </div>
  );
}
