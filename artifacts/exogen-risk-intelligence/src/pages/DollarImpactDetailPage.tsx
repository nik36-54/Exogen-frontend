import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft,
  ArrowRight,
  DollarSign,
  SlidersHorizontal,
  Layers,
  Sparkles,
  HelpCircle,
  FileCheck2,
  TrendingUp,
  History,
  ShieldAlert,
} from 'lucide-react';
import {
  getImpactDetail,
  getCalculationProvenance,
} from '@/data/quantitative-intelligence-data';
import { ImpactCalculationChain } from '@/components/quantitative/ImpactCalculationChain';
import { ImpactDecompositionView } from '@/components/quantitative/ImpactDecompositionView';
import { ImpactRangeVisualizer } from '@/components/quantitative/ImpactRangeVisualizer';
import { CalculationDetailsDrawer } from '@/components/quantitative/CalculationDetailsDrawer';
import { ProvenanceDrawer } from '@/components/quantitative/ProvenanceDrawer';

interface Props {
  impactId: string;
}

export default function DollarImpactDetailPage({ impactId }: Props) {
  const [, setLocation] = useLocation();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [provenanceOpen, setProvenanceOpen] = useState(false);
  const [historyTab, setHistoryTab] = useState<'24H' | '7D' | '30D' | '90D'>('24H');

  const impact = getImpactDetail(impactId);
  const provenance = getCalculationProvenance();

  // Mock historical trajectories for Base, Downside, Severe
  const historySeries = {
    '24H': [
      { label: '10:00', base: 7.8, downside: 12.4, severe: 28.2 },
      { label: '14:00', base: 7.9, downside: 13.5, severe: 29.1 },
      { label: '18:00', base: 8.0, downside: 14.8, severe: 30.0 },
      { label: '22:00', base: 8.1, downside: 16.0, severe: 30.8 },
      { label: '06:00', base: 8.1, downside: 17.2, severe: 31.2 },
      { label: '11:00', base: 8.2, downside: 18.4, severe: 31.7 },
    ],
    '7D': [
      { label: 'Sep 24', base: 6.5, downside: 11.2, severe: 24.5 },
      { label: 'Sep 26', base: 7.0, downside: 12.8, severe: 26.0 },
      { label: 'Sep 28', base: 7.5, downside: 14.5, severe: 28.4 },
      { label: 'Sep 30', base: 8.2, downside: 18.4, severe: 31.7 },
    ],
    '30D': [
      { label: 'Sep 01', base: 5.2, downside: 9.8, severe: 20.0 },
      { label: 'Sep 10', base: 6.0, downside: 11.5, severe: 22.8 },
      { label: 'Sep 20', base: 7.1, downside: 14.0, severe: 26.5 },
      { label: 'Sep 30', base: 8.2, downside: 18.4, severe: 31.7 },
    ],
    '90D': [
      { label: 'Jul 01', base: 4.5, downside: 8.2, severe: 18.0 },
      { label: 'Aug 01', base: 5.5, downside: 10.5, severe: 21.0 },
      { label: 'Sep 01', base: 6.8, downside: 13.0, severe: 25.5 },
      { label: 'Sep 30', base: 8.2, downside: 18.4, severe: 31.7 },
    ],
  };

  const currentPoints = historySeries[historyTab];

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Breadcrumb Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setLocation('/impact')}
          className="inline-flex items-center gap-1.5 text-xs text-[#92989e] hover:text-[#f5f5f2] transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dollar Impact Directory
        </button>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-[#656b70]">ENGINE: v0.1</span>
          <button
            onClick={() => setDetailsOpen(true)}
            className="inline-flex items-center gap-1 text-xs text-[#b8f34a] hover:underline"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            Inspect Calculation Chain
          </button>
        </div>
      </div>

      {/* Hero Header */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#b8f34a]">
                POTENTIAL DOLLAR IMPACT · MODEL SPECIFICATION
              </span>
              <span className="text-[10px] font-mono text-[#656b70]">({impact.id})</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#f5f5f2] sm:text-3xl">
              {impact.eventTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#92989e]">
              <span>Risk: <strong className="text-[#f5f5f2]">{impact.riskName}</strong></span>
              <span>·</span>
              <span>Target: <strong className="text-[#f5f5f2]">{impact.companyName}</strong></span>
              <span>·</span>
              <span>Scenario: <strong className="text-[#7c8cff]">{impact.scenarioName} ({impact.scenarioMagnitudePct}%)</strong></span>
            </div>
          </div>

          {/* Big Dollar Value Callout */}
          <div className="flex items-center gap-5 rounded-xl border border-[#b8f34a]/30 bg-[#0a0a0b] p-5 shrink-0 shadow-lg">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
                POTENTIAL DOLLAR IMPACT
              </div>
              <div className="text-4xl sm:text-5xl font-mono font-bold text-[#b8f34a] mt-1">
                ${impact.potentialImpactUsdM.toFixed(1)}M
              </div>
              <div className="mt-1 text-[10px] font-mono text-[#656b70]">
                Illustrative model output — v0.1
              </div>
            </div>

            <div className="h-12 w-px bg-[#24282c]" />

            <div className="space-y-1 text-right text-xs font-mono">
              <div className="text-[#92989e]">
                Expected: <strong className="text-[#f5f5f2]">${impact.expectedImpactUsdM.toFixed(1)}M</strong>
              </div>
              <div className="text-[#656b70]">
                Base: ${impact.baseImpactUsdM.toFixed(1)}M
              </div>
              <div className="text-[#ff5c5c]">
                Severe: ${impact.severeImpactUsdM.toFixed(1)}M
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Core Calculation Chain Flow */}
      <ImpactCalculationChain
        probabilityPct={impact.probabilityPct}
        modeledExposureUsdM={impact.modeledExposureUsdM}
        scenarioMagnitudePct={impact.scenarioMagnitudePct}
        potentialImpactUsdM={impact.potentialImpactUsdM}
        scenarioName={impact.scenarioName}
        onOpenDetails={() => setDetailsOpen(true)}
        onOpenScenarios={() => setLocation('/impact/scenarios')}
      />

      {/* Multi-Dimensional Decomposition (BU vs Risk) */}
      <ImpactDecompositionView
        byBusinessUnit={impact.byBusinessUnit}
        byRiskCategory={impact.byRiskCategory}
      />

      {/* Impact Range & Confidence Visualizer */}
      <ImpactRangeVisualizer
        range={impact.impactRange}
        modeledImpactUsdM={impact.potentialImpactUsdM}
      />

      {/* Longitudinal Impact History & Change Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* History Chart */}
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
          <div className="flex items-center justify-between border-b border-[#24282c] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
                HISTORICAL EVOLUTION
              </span>
              <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
                Impact Trajectory Over Time
              </h3>
            </div>

            {/* Time Toggle */}
            <div className="flex items-center rounded-lg border border-[#24282c] bg-[#0a0a0b] p-0.5 text-xs font-mono">
              {(['24H', '7D', '30D', '90D'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setHistoryTab(t)}
                  className={`px-2.5 py-0.5 rounded-md transition ${
                    historyTab === t
                      ? 'bg-[#171a1d] text-[#f5f5f2]'
                      : 'text-[#92989e] hover:text-[#f5f5f2]'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-[#24282c] bg-[#0a0a0b]/80 p-4">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#92989e] mb-3">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#ff5c5c]" /> Severe</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#b8f34a]" /> Downside</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-[#7c8cff]" /> Base</span>
            </div>

            <div className="h-36 flex items-end gap-3 pt-4 border-b border-[#24282c]">
              {currentPoints.map((pt, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex items-end justify-center gap-1 h-28">
                    <div
                      className="w-1.5 rounded-t bg-[#7c8cff]/50"
                      style={{ height: `${(pt.base / 35) * 100}%` }}
                    />
                    <div
                      className="w-2 rounded-t bg-[#b8f34a]"
                      style={{ height: `${(pt.downside / 35) * 100}%` }}
                    />
                    <div
                      className="w-1.5 rounded-t bg-[#ff5c5c]/50"
                      style={{ height: `${(pt.severe / 35) * 100}%` }}
                    />
                  </div>
                  <span className="mt-1 text-[9px] font-mono text-[#656b70] truncate max-w-[45px]">
                    {pt.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between text-[10px] font-mono text-[#656b70]">
              <span>Base: $8.2M</span>
              <span className="text-[#b8f34a]">Downside: $18.4M</span>
              <span className="text-[#ff5c5c]">Severe: $31.7M</span>
            </div>
          </div>
        </div>

        {/* Change Attribution: Why did impact move? */}
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-[#24282c] pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
                  EXPLAINABILITY DRILLDOWN
                </span>
                <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
                  Why did impact move?
                </h3>
              </div>
              <div className="rounded bg-[#ff5c5c]/10 px-2 py-0.5 text-xs font-mono font-bold text-[#ff5c5c]">
                +$6.0M ($12.4M → $18.4M)
              </div>
            </div>

            <p className="mt-3 text-xs text-[#92989e] leading-relaxed">
              Factor-by-factor attribution of the +$6.0M shift in modeled downside impact:
            </p>

            <div className="mt-4 divide-y divide-[#1e2225] rounded-lg border border-[#24282c] bg-[#171a1d]">
              <div className="flex items-center justify-between p-2.5 text-xs">
                <span className="text-[#92989e]">Probability Shift (+4.9%)</span>
                <span className="font-mono font-semibold text-[#ff5c5c]">+$2.4M</span>
              </div>
              <div className="flex items-center justify-between p-2.5 text-xs">
                <span className="text-[#92989e]">Exposure Model Refresh</span>
                <span className="font-mono font-semibold text-[#ff5c5c]">+$1.8M</span>
              </div>
              <div className="flex items-center justify-between p-2.5 text-xs">
                <span className="text-[#92989e]">Scenario Assumption Repricing</span>
                <span className="font-mono font-semibold text-[#ff5c5c]">+$1.2M</span>
              </div>
              <div className="flex items-center justify-between p-2.5 text-xs">
                <span className="text-[#92989e]">Transmission Velocity Factor</span>
                <span className="font-mono font-semibold text-[#ff5c5c]">+$0.9M</span>
              </div>
              <div className="flex items-center justify-between p-2.5 text-xs">
                <span className="text-[#92989e]">Model Version Variance</span>
                <span className="font-mono font-semibold text-[#b8f34a]">-$0.3M</span>
              </div>
              <div className="flex items-center justify-between p-2.5 text-xs bg-[#0a0a0b]/60">
                <span className="font-bold text-[#f5f5f2]">Net Impact Movement</span>
                <span className="font-mono font-bold text-[#ff5c5c]">+$6.0M</span>
              </div>
            </div>
          </div>

          <div className="mt-4 text-[10px] text-[#656b70]">
            Change decomposition updated continuously from underlying market consensus and corporate asset/liability mapping models.
          </div>
        </div>
      </div>

      {/* Quantitative Provenance Overview Card */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-3">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#b8f34a]">
              AUDIT TRAIL & VERIFICATION
            </span>
            <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
              Calculation Provenance Record
            </h3>
          </div>

          <button
            onClick={() => setProvenanceOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-3 py-1.5 text-xs font-medium text-[#f5f5f2] hover:bg-[#1e2225]"
          >
            <FileCheck2 className="h-3.5 w-3.5 text-[#b8f34a]" />
            View complete audit trail →
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3">
            <div className="text-[10px] font-mono text-[#656b70]">CALCULATION ID</div>
            <div className="mt-1 font-mono font-bold text-[#f5f5f2]">{provenance.calculationId}</div>
          </div>
          <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3">
            <div className="text-[10px] font-mono text-[#656b70]">CANONICAL EVENT</div>
            <div className="mt-1 font-mono font-bold text-[#b8f34a]">{provenance.canonicalEventId}</div>
          </div>
          <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3">
            <div className="text-[10px] font-mono text-[#656b70]">EXPOSURE MODEL</div>
            <div className="mt-1 font-mono font-bold text-[#f5f5f2]">{provenance.exposureModelId}</div>
          </div>
          <div className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3">
            <div className="text-[10px] font-mono text-[#656b70]">CALCULATED AT</div>
            <div className="mt-1 font-mono font-medium text-[#92989e]">{provenance.calculatedAt}</div>
          </div>
        </div>
      </div>

      {/* Drawers */}
      <CalculationDetailsDrawer
        isOpen={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        probabilityPct={impact.probabilityPct}
        exposureUsdM={impact.modeledExposureUsdM}
        scenarioMagnitudePct={impact.scenarioMagnitudePct}
        transmissionMultiplier={impact.transmissionMultiplier}
        confidencePct={impact.confidencePct}
        potentialImpactUsdM={impact.potentialImpactUsdM}
        scenarioName={impact.scenarioName}
        eventId={impact.eventId}
        onOpenProvenance={() => setProvenanceOpen(true)}
      />

      <ProvenanceDrawer
        isOpen={provenanceOpen}
        onClose={() => setProvenanceOpen(false)}
        provenance={provenance}
      />
    </div>
  );
}
