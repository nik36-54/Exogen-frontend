import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  CircleHelp,
  Clock,
  ExternalLink,
  Layers,
  Network,
  Scale,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { businessUnitsList, getBusinessUnit } from '@/data/risk-intelligence-data';
import { ExposureRangeBar } from '@/components/risk/ExposureRangeBar';
import { ConditionalExposureCard } from '@/components/risk/ConditionalExposureCard';
import type { ImpactDirection } from '@/types/risk-intelligence';

interface Props {
  unitId: string;
}

export default function BusinessUnitDetailPage({ unitId }: Props) {
  const [, setLocation] = useLocation();
  const [whyOpen, setWhyOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'EXPOSURE' | 'CONFIDENCE'>('EXPOSURE');

  const unit = getBusinessUnit(unitId) || businessUnitsList[0];

  const sortedDrivers = [...unit.currentRiskDrivers].sort((a, b) => {
    if (sortBy === 'EXPOSURE') return b.exposureUsdM - a.exposureUsdM;
    return b.confidencePct - a.confidencePct;
  });

  const getDirectionBadge = (direction: ImpactDirection) => {
    switch (direction) {
      case 'NEGATIVE':
        return <span className="mono text-[10px] font-semibold text-[#ff6b6b]">NEGATIVE</span>;
      case 'POSITIVE':
        return <span className="mono text-[10px] font-semibold text-[#b8f34a]">POSITIVE</span>;
      case 'MIXED':
        return <span className="mono text-[10px] font-semibold text-[#f5c76c]">MIXED</span>;
      default:
        return <span className="mono text-[10px] font-semibold text-[#8e989d]">UNCERTAIN</span>;
    }
  };

  return (
    <div className="space-y-7">
      {/* Top back navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setLocation('/exposure')}
          className="flex items-center gap-1.5 text-[11px] text-[#869197] hover:text-[#dce1dc] transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Back to Company Exposure</span>
        </button>

        <button
          type="button"
          onClick={() => setLocation('/risk-graph')}
          className="flex items-center gap-1.5 rounded border border-[#485c33] bg-[#1a2516] px-3 py-1.5 text-[11px] font-semibold text-[#b8f34a] hover:bg-[#22311c]"
        >
          <Network size={13} />
          <span>Explore {unit.name} in Risk Graph</span>
        </button>
      </div>

      {/* Header (Section 21) */}
      <section className="rounded-[8px] border border-[#23292d] bg-[#111416] p-6">
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="mono rounded bg-[#172015] px-2 py-0.5 font-semibold text-[#b8f34a]">
            {unit.division}
          </span>
          <span className="mono text-[#6c777d]">{unit.id}</span>
          <span className="text-[#3a4348]">·</span>
          <span className="text-[#9aa4a9]">JPMorgan Chase Demo Unit</span>
        </div>

        <h1 className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[#f2f4ef] sm:text-[26px]">
          {unit.name}
        </h1>
        <p className="mt-2 max-w-4xl text-[13px] leading-relaxed text-[#8f9aa0]">
          {unit.description}
        </p>

        {/* Header Meta Metrics */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#1f2427] pt-5 sm:grid-cols-4">
          <div>
            <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">ACTIVE RISK EVENTS</span>
            <div className="mono mt-1 text-[22px] font-semibold text-[#edf1eb]">
              {unit.activeRiskEventsCount}
            </div>
            <span className="text-[9px] text-[#616b71]">External catalysts</span>
          </div>
          <div>
            <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">BASE MODELED EXPOSURE</span>
            <div className="mono mt-1 text-[22px] font-semibold text-[#b8f34a]">
              ${unit.modeledExposureUsdM.toFixed(1)}M
            </div>
            <span className="text-[9px] text-[#616b71]">Net allocated downside</span>
          </div>
          <div>
            <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">HIGH IMPACT ALERTS</span>
            <div className="mono mt-1 text-[22px] font-semibold text-[#ff6b6b]">
              {unit.highImpactCount}
            </div>
            <span className="text-[9px] text-[#616b71]">Severe sensitivity</span>
          </div>
          <div>
            <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">AVG CONFIDENCE</span>
            <div className="mono mt-1 text-[22px] font-semibold text-[#edf1eb]">
              {unit.avgConfidencePct.toFixed(1)}%
            </div>
            <span className="text-[9px] text-[#616b71]">Relationship certainty</span>
          </div>
        </div>
      </section>

      {/* Section 26: Exposure Range Spread */}
      <ExposureRangeBar
        lowUsdM={unit.exposureRange.lowUsdM}
        baseUsdM={unit.exposureRange.baseUsdM}
        highUsdM={unit.exposureRange.highUsdM}
        title={`${unit.name} Exposure Range Distribution`}
      />

      {/* Section 22: Exposure Breakdown by Risk Category */}
      <section className="rounded-[8px] border border-[#23292d] bg-[#111417] p-5 sm:p-6 text-[11px]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f2427] pb-3">
          <div>
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              PORTFOLIO COMPOSITION
            </span>
            <h2 className="mt-1 text-[16px] font-medium text-[#edf0eb]">
              Exposure Breakdown by Risk Category
            </h2>
          </div>
          <span className="mono text-[10px] text-[#6d777d]">
            Total Allocated: ${unit.modeledExposureUsdM.toFixed(1)}M
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {unit.exposureByCategory.map((cat) => (
            <div key={cat.category}>
              <div className="flex justify-between text-[11px]">
                <span className="font-medium text-[#edf0ec]">{cat.category}</span>
                <span className="mono text-[#b8f34a]">
                  ${cat.amountUsdM.toFixed(1)}M ({cat.sharePct.toFixed(1)}%)
                </span>
              </div>
              <div className="mt-1 h-2 w-full rounded-full bg-[#1b2023]">
                <div
                  className="h-2 rounded-full bg-[#b8f34a]"
                  style={{ width: `${Math.min(100, Math.max(5, cat.sharePct))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 28: Conditional Exposure Scenarios */}
      {unit.conditionalExposures && (
        <ConditionalExposureCard
          scenarios={unit.conditionalExposures}
          title={`${unit.name} Conditional Exposure Scenarios`}
        />
      )}

      {/* Current Risk Drivers Table (Section 21 & 24) */}
      <section className="rounded-[8px] border border-[#23292d] bg-[#111417] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1f2427] pb-3">
          <div>
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              ACTIVE CATALYSTS
            </span>
            <h2 className="mt-1 text-[16px] font-medium text-[#edf0eb]">
              Current Risk Drivers for {unit.name}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 text-[10px]">
            <span className="text-[#6d777d]">Sort by:</span>
            <button
              type="button"
              onClick={() => setSortBy('EXPOSURE')}
              className={`rounded px-2.5 py-1 ${
                sortBy === 'EXPOSURE' ? 'bg-[#1b221a] text-[#b8f34a] font-semibold' : 'text-[#848e93]'
              }`}
            >
              Exposure
            </button>
            <button
              type="button"
              onClick={() => setSortBy('CONFIDENCE')}
              className={`rounded px-2.5 py-1 ${
                sortBy === 'CONFIDENCE' ? 'bg-[#1b221a] text-[#b8f34a] font-semibold' : 'text-[#848e93]'
              }`}
            >
              Confidence
            </button>
          </div>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-[#1f2427] text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">
                <th className="py-2 pl-2">CANONICAL EVENT</th>
                <th className="py-2">RISK CLASS</th>
                <th className="py-2">DIRECTION</th>
                <th className="py-2 text-right">ALLOCATED EXPOSURE</th>
                <th className="py-2 pr-2 text-right">CONFIDENCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b2023]">
              {sortedDrivers.map((driver) => (
                <tr
                  key={driver.eventId}
                  onClick={() => setLocation(`/events/${driver.eventId}`)}
                  className="cursor-pointer transition-colors hover:bg-[#14181a]"
                >
                  <td className="max-w-[260px] py-3 pl-2">
                    <div className="font-medium text-[#edf1eb] hover:text-[#b8f34a] transition-colors truncate">
                      {driver.eventTitle}
                    </div>
                    <div className="mono text-[8px] text-[#6b767b]">{driver.eventId}</div>
                  </td>
                  <td className="py-3 text-[#9ba5aa] whitespace-nowrap">{driver.riskName}</td>
                  <td className="py-3">{getDirectionBadge(driver.direction)}</td>
                  <td className="mono py-3 text-right font-medium text-[#b8f34a]">
                    ${driver.exposureUsdM.toFixed(1)}M
                  </td>
                  <td className="mono py-3 pr-2 text-right text-[#d4ded3]">
                    {driver.confidencePct.toFixed(0)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
