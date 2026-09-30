import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  Calendar,
  CheckCircle2,
  CircleHelp,
  Clock,
  ExternalLink,
  GitBranch,
  Layers,
  Network,
  Scale,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { getRisk, riskSignalsList } from '@/data/risk-intelligence-data';
import type { ImpactDirection } from '@/types/risk-intelligence';

interface Props {
  riskId: string;
}

export default function RiskSignalDetailPage({ riskId }: Props) {
  const [, setLocation] = useLocation();
  const [whyOpen, setWhyOpen] = useState(false);

  const risk = getRisk(riskId) || riskSignalsList[0];

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
      {/* Top back navigation & quick actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setLocation('/risk')}
          className="flex items-center gap-1.5 text-[11px] text-[#869197] hover:text-[#dce1dc] transition-colors"
        >
          <ArrowLeft size={13} />
          <span>Back to Risk Intelligence</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLocation('/risk/transmission')}
            className="flex items-center gap-1.5 rounded border border-[#2b3337] bg-[#14181b] px-3 py-1.5 text-[11px] text-[#939da2] hover:border-[#424d53] hover:text-[#dce1dc]"
          >
            <GitBranch size={13} />
            <span>View transmission paths</span>
          </button>
          <button
            type="button"
            onClick={() => setLocation('/exposure')}
            className="flex items-center gap-1.5 rounded border border-[#2b3337] bg-[#14181b] px-3 py-1.5 text-[11px] text-[#939da2] hover:border-[#424d53] hover:text-[#dce1dc]"
          >
            <Building2 size={13} />
            <span>View affected business units</span>
          </button>
          <button
            type="button"
            onClick={() => setLocation('/risk-graph')}
            className="flex items-center gap-1.5 rounded border border-[#485c33] bg-[#1a2516] px-3 py-1.5 text-[11px] font-semibold text-[#b8f34a] hover:bg-[#22311c]"
          >
            <Network size={13} />
            <span>Explore in Risk Graph</span>
          </button>
        </div>
      </div>

      {/* Header (Section 5) */}
      <section className="rounded-[8px] border border-[#23292d] bg-[#111416] p-6">
        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          <span className="mono rounded bg-[#172015] px-2 py-0.5 font-semibold text-[#b8f34a]">
            {risk.parentCategory}
          </span>
          <span className="mono text-[#6c777d]">{risk.id}</span>
          <span className="text-[#3a4348]">·</span>
          <span className="text-[#9aa4a9]">{risk.evidenceType}</span>
        </div>

        <h1 className="mt-3 text-[22px] font-semibold tracking-[-0.03em] text-[#f2f4ef] sm:text-[26px]">
          {risk.name}
        </h1>
        <p className="mt-2 max-w-4xl text-[13px] leading-relaxed text-[#8f9aa0]">
          {risk.description}
        </p>

        {/* Header Meta Metrics */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#1f2427] pt-5 sm:grid-cols-5">
          <div>
            <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">RISK CATEGORY</span>
            <div className="mt-1 text-[16px] font-medium text-[#edf1eb]">
              {risk.parentCategory}
            </div>
            <span className="text-[9px] text-[#616b71]">Taxonomy Level 1</span>
          </div>
          <div>
            <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">ACTIVE EVENTS</span>
            <div className="mono mt-1 text-[22px] font-semibold text-[#edf1eb]">
              {risk.activeEventsCount}
            </div>
            <span className="text-[9px] text-[#616b71]">Mapped triggers</span>
          </div>
          <div>
            <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">AFFECTED UNITS</span>
            <div className="mono mt-1 text-[22px] font-semibold text-[#edf1eb]">
              {risk.affectedBusinessUnitsCount}
            </div>
            <span className="text-[9px] text-[#616b71]">JPMorgan units</span>
          </div>
          <div>
            <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">TOTAL EXPOSURE</span>
            <div className="mono mt-1 text-[22px] font-semibold text-[#b8f34a]">
              ${risk.totalModeledExposureUsdM.toFixed(1)}M
            </div>
            <span className="text-[9px] text-[#616b71]">Modeled sensitivity</span>
          </div>
          <div>
            <span className="text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">CONFIDENCE</span>
            <div className="mono mt-1 text-[22px] font-semibold text-[#edf1eb]">
              {risk.confidencePct.toFixed(1)}%
            </div>
            <span className="text-[9px] text-[#616b71]">Relationship certainty</span>
          </div>
        </div>
      </section>

      {/* Section 12: Why does this event create this risk? */}
      <section className="rounded-[8px] border border-[#23292d] bg-[#111417] p-6">
        <div className="flex items-center justify-between border-b border-[#1f2427] pb-3">
          <div>
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              CAUSAL EXPLAINABILITY
            </span>
            <h2 className="mt-1 text-[17px] font-medium text-[#edf0eb]">
              Why does this event map to {risk.name}?
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setWhyOpen(!whyOpen)}
            className="flex items-center gap-1 text-[11px] text-[#b8f34a] hover:underline"
          >
            <CircleHelp size={12} />
            <span>{whyOpen ? 'Collapse reasoning chain' : 'Inspect reasoning chain'}</span>
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-5 text-[11px]">
            <div className="rounded border border-[#21272b] bg-[#0c0f11] p-3.5">
              <span className="mono text-[8px] text-[#636d72]">01. TRIGGER EVENT</span>
              <div className="mt-1.5 font-medium text-[#edf1ec]">{risk.whyExplanation.event}</div>
            </div>
            <div className="rounded border border-[#21272b] bg-[#0c0f11] p-3.5">
              <span className="mono text-[8px] text-[#636d72]">02. MACRO ENVIRONMENT</span>
              <div className="mt-1.5 font-medium text-[#edf1ec]">{risk.whyExplanation.macroEnvironment}</div>
            </div>
            <div className="rounded border border-[#21272b] bg-[#0c0f11] p-3.5">
              <span className="mono text-[8px] text-[#636d72]">03. FINANCIAL MECHANISM</span>
              <div className="mt-1.5 font-medium text-[#edf1ec]">{risk.whyExplanation.financialMechanism}</div>
            </div>
            <div className="rounded border border-[#21272b] bg-[#0c0f11] p-3.5">
              <span className="mono text-[8px] text-[#636d72]">04. BUSINESS EFFECT</span>
              <div className="mt-1.5 font-medium text-[#edf1ec]">{risk.whyExplanation.businessEffect}</div>
            </div>
            <div className="rounded border border-[#31482f] bg-[#151f14] p-3.5">
              <span className="mono text-[8px] text-[#b8f34a]">05. RISK CLASSIFICATION</span>
              <div className="mt-1.5 font-semibold text-[#b8f34a]">{risk.whyExplanation.riskSummary}</div>
            </div>
          </div>

          <div className="rounded border border-[#1f2427] bg-[#0c0f11] p-3 text-[10px] text-[#717b81] italic">
            Illustrative causal model · JPMorgan Chase demonstration scenario.
          </div>
        </div>
      </section>

      {/* Affected Business Units Section */}
      <section className="rounded-[8px] border border-[#23292d] bg-[#111417] p-6">
        <div className="flex items-center justify-between border-b border-[#1f2427] pb-3">
          <div>
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              INTERNAL TRANSMISSION
            </span>
            <h2 className="mt-1 text-[17px] font-medium text-[#edf0eb]">
              Affected JPMorgan Business Units
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setLocation('/exposure')}
            className="flex items-center gap-1 text-[11px] text-[#b8f34a] hover:underline"
          >
            <span>View all business units</span>
            <ArrowRight size={11} />
          </button>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-[#1f2427] text-[9px] font-semibold tracking-[.12em] text-[#6d777d]">
                <th className="py-2.5 pl-3">BUSINESS UNIT</th>
                <th className="py-2.5">DIVISION</th>
                <th className="py-2.5">DIRECTION</th>
                <th className="py-2.5">SENSITIVITY</th>
                <th className="py-2.5 text-right">EXPOSURE</th>
                <th className="py-2.5 pr-3 text-right">CONFIDENCE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1b2023]">
              {risk.affectedBusinessUnits.map((u) => (
                <tr
                  key={u.id}
                  onClick={() => setLocation(`/exposure/business-unit/${u.id}`)}
                  className="cursor-pointer transition-colors hover:bg-[#15191c]"
                >
                  <td className="py-3 pl-3 font-medium text-[#edf1eb] hover:text-[#b8f34a]">
                    {u.name}
                  </td>
                  <td className="py-3 text-[#9ba5aa]">{u.division}</td>
                  <td className="py-3">{getDirectionBadge(u.direction)}</td>
                  <td className="py-3 text-[#ccd3cc]">{u.sensitivity}</td>
                  <td className="mono py-3 text-right font-medium text-[#b8f34a]">
                    ${u.exposureUsdM.toFixed(1)}M
                  </td>
                  <td className="mono py-3 pr-3 text-right text-[#edf1eb]">
                    {u.confidencePct.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Related External Events Section */}
      <section className="rounded-[8px] border border-[#23292d] bg-[#111417] p-6">
        <div className="flex items-center justify-between border-b border-[#1f2427] pb-3">
          <div>
            <span className="text-[9px] font-semibold tracking-[.18em] text-[#b8f34a]">
              MACRO TRIGGER REPERTOIRE
            </span>
            <h2 className="mt-1 text-[17px] font-medium text-[#edf0eb]">
              Related External Events
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setLocation('/events')}
            className="flex items-center gap-1 text-[11px] text-[#b8f34a] hover:underline"
          >
            <span>View canonical events</span>
            <ArrowRight size={11} />
          </button>
        </div>

        <div className="mt-4 space-y-2.5">
          {risk.relatedEvents.map((evt) => (
            <div
              key={evt.id}
              onClick={() => setLocation(`/events/${evt.id}`)}
              className="flex flex-col justify-between rounded-[6px] border border-[#21272b] bg-[#0c0f11] p-3 text-[11px] cursor-pointer transition-colors hover:border-[#38434a] hover:bg-[#13171a] sm:flex-row sm:items-center"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="mono text-[9px] text-[#6d777d]">{evt.id}</span>
                  <span className="text-[#3b4348]">·</span>
                  <span className="mono text-[10px] text-[#b8f34a]">{evt.probabilityPct}% consensus</span>
                  <span className="text-[#3b4348]">·</span>
                  <span className="text-[10px] text-[#869298]">{evt.relationship}</span>
                </div>
                <div className="mt-1 font-medium text-[#edf0eb]">{evt.title}</div>
              </div>

              <div className="mt-2 flex items-center gap-3 sm:mt-0">
                <div className="text-right">
                  <span className="block text-[8px] text-[#6b767b]">MODELED EXPOSURE</span>
                  <span className="mono text-[12px] font-semibold text-[#b8f34a]">
                    ${evt.exposureUsdM.toFixed(1)}M
                  </span>
                </div>
                <span className="text-[#848f95]">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
