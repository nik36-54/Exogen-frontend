import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import {
  AlertTriangle,
  ArrowRight,
  Filter,
  Search,
  ShieldAlert,
  Sparkles,
  Sliders,
  CheckCircle2,
  Clock,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  earlyWarningsList,
  warningRulesList,
} from '@/data/monitoring-intelligence-data';
import type { WarningSeverity, WarningStatus } from '@/types/monitoring-intelligence';

export default function EarlyWarningsPage() {
  const [, setLocation] = useLocation();
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [showRules, setShowRules] = useState(false);

  const filteredWarnings = useMemo(() => {
    return earlyWarningsList.filter((w) => {
      const matchSearch =
        w.title.toLowerCase().includes(search.toLowerCase()) ||
        w.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
        w.riskName.toLowerCase().includes(search.toLowerCase()) ||
        w.businessUnitName.toLowerCase().includes(search.toLowerCase());

      const matchSeverity =
        severityFilter === 'ALL' || w.severity.toUpperCase() === severityFilter.toUpperCase();

      const matchStatus =
        statusFilter === 'ALL' || w.status.toUpperCase() === statusFilter.toUpperCase();

      return matchSearch && matchSeverity && matchStatus;
    });
  }, [search, severityFilter, statusFilter]);

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              CONTINUOUS SENSING & ALERTING · LAYER 06
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              AUTOMATED SENTINEL
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#f5f5f2] sm:text-3xl">
            Early Warnings
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            Material changes detected across the external environment and their modeled business consequences.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowRules(!showRules)}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-3.5 py-2 text-xs font-medium text-[#f5f5f2] hover:border-[#b8f34a]/60 hover:text-[#b8f34a]"
          >
            <Sliders className="h-3.5 w-3.5" />
            {showRules ? 'Hide Monitoring Rules' : 'View Monitoring Rules (8)'}
          </button>
        </div>
      </div>

      {/* Top Metrics Strip (Section 9) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="rounded-lg border border-[#24282c] bg-[#111416] p-3 text-center">
          <div className="text-[10px] font-mono uppercase text-[#92989e]">ACTIVE WARNINGS</div>
          <div className="mt-1 text-xl font-mono font-bold text-[#f5f5f2]">18</div>
        </div>

        <div className="rounded-lg border border-[#ff5c5c]/30 bg-[#ff5c5c]/5 p-3 text-center">
          <div className="text-[10px] font-mono uppercase text-[#ff5c5c]">CRITICAL</div>
          <div className="mt-1 text-xl font-mono font-bold text-[#ff5c5c]">3</div>
        </div>

        <div className="rounded-lg border border-[#b8f34a]/30 bg-[#b8f34a]/5 p-3 text-center">
          <div className="text-[10px] font-mono uppercase text-[#b8f34a]">HIGH</div>
          <div className="mt-1 text-xl font-mono font-bold text-[#b8f34a]">7</div>
        </div>

        <div className="rounded-lg border border-[#7c8cff]/30 bg-[#7c8cff]/5 p-3 text-center">
          <div className="text-[10px] font-mono uppercase text-[#7c8cff]">MEDIUM</div>
          <div className="mt-1 text-xl font-mono font-bold text-[#7c8cff]">8</div>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#111416] p-3 text-center">
          <div className="text-[10px] font-mono uppercase text-[#92989e]">NEW 24H</div>
          <div className="mt-1 text-xl font-mono font-bold text-[#f5f5f2]">6</div>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#111416] p-3 text-center">
          <div className="text-[10px] font-mono uppercase text-[#92989e]">ESCALATED</div>
          <div className="mt-1 text-xl font-mono font-bold text-[#ff5c5c]">4</div>
        </div>

        <div className="rounded-lg border border-[#24282c] bg-[#111416] p-3 text-center">
          <div className="text-[10px] font-mono uppercase text-[#92989e]">RESOLVED</div>
          <div className="mt-1 text-xl font-mono font-bold text-[#b8f34a]">11</div>
        </div>
      </div>

      {/* Monitoring Rules Drawer/Section (Section 15) */}
      {showRules && (
        <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4 animate-in fade-in-0 duration-150">
          <div className="flex items-center justify-between border-b border-[#24282c] pb-3">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#b8f34a]">
                SENTINEL LOGIC
              </span>
              <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
                Configured Early Warning Rules (Illustrative Prototype)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#656b70]">DEMO THRESHOLDS</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {warningRulesList.map((r) => (
              <div key={r.id} className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3.5 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#f5f5f2]">{r.name}</span>
                  <span className="font-mono text-[10px] text-[#b8f34a]">{r.threshold}</span>
                </div>
                <div className="text-[11px] text-[#92989e]">{r.description}</div>
                <div className="pt-2 text-[10px] font-mono text-[#656b70] flex items-center justify-between">
                  <span>Metric: {r.metric}</span>
                  <span className="text-[#b8f34a]">{r.activeCount} triggers</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Intelligence Feed (Section 10) */}
      <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
              ACTIVE SURVEILLANCE FEED
            </span>
            <h2 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
              Detected Material Changes
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#92989e]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search warnings..."
                className="rounded-lg border border-[#24282c] bg-[#171a1d] py-1.5 pl-8 pr-3 text-xs text-[#f5f5f2] placeholder-[#656b70] focus:border-[#b8f34a] focus:outline-none w-48"
              />
            </div>

            {/* Severity filter */}
            <div className="flex items-center rounded-lg border border-[#24282c] bg-[#0a0a0b] p-0.5 text-xs font-mono">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setSeverityFilter(sev)}
                  className={`px-2 py-1 rounded-md transition ${
                    severityFilter === sev
                      ? 'bg-[#171a1d] text-[#f5f5f2]'
                      : 'text-[#92989e] hover:text-[#f5f5f2]'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Warning Cards List */}
        <div className="space-y-3">
          {filteredWarnings.map((warn) => {
            const getSeverityBadge = () => {
              if (warn.severity === 'critical')
                return 'bg-[#ff5c5c]/10 text-[#ff5c5c] border-[#ff5c5c]/30';
              if (warn.severity === 'high')
                return 'bg-[#b8f34a]/10 text-[#b8f34a] border-[#b8f34a]/30';
              return 'bg-[#7c8cff]/10 text-[#7c8cff] border-[#7c8cff]/30';
            };

            const getStatusBadge = () => {
              if (warn.status === 'new') return 'bg-[#b8f34a]/10 text-[#b8f34a]';
              if (warn.status === 'escalated') return 'bg-[#ff5c5c]/10 text-[#ff5c5c]';
              return 'bg-[#171a1d] text-[#92989e]';
            };

            return (
              <div
                key={warn.id}
                onClick={() => setLocation(`/early-warnings/${warn.id}`)}
                className="group rounded-xl border border-[#24282c] bg-[#171a1d] p-5 transition hover:border-[#3b4440] cursor-pointer space-y-3.5"
              >
                {/* Top Row: Severity, Time, Type, Status */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-mono font-bold uppercase border ${getSeverityBadge()}`}>
                      {warn.severity}
                    </span>
                    <span className="text-xs font-mono text-[#656b70]">{warn.timeAgo}</span>
                    <span className="text-[10px] font-mono text-[#92989e]">({warn.type})</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px]">
                    <span className="text-[#656b70]">STATUS:</span>
                    <span className={`rounded px-1.5 py-0.2 uppercase font-bold ${getStatusBadge()}`}>
                      {warn.status}
                    </span>
                    <span className="text-[#656b70]">· Conf {warn.confidencePct}%</span>
                  </div>
                </div>

                {/* Event -> Risk -> Business Unit Flow Line */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-semibold text-[#f5f5f2] group-hover:text-[#b8f34a]">
                    {warn.eventTitle}
                  </span>
                  <span className="text-[#656b70]">→</span>
                  <span className="text-[#92989e]">{warn.riskName}</span>
                  <span className="text-[#656b70]">→</span>
                  <span className="text-[#f5f5f2]">{warn.businessUnitName}</span>
                  <span className="text-[#656b70]">→</span>
                  <span className="font-mono text-[#b8f34a] font-bold">
                    ${warn.exposureUsdM.toFixed(1)}M Exposure
                  </span>
                </div>

                {/* Quantitative Impact Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 rounded-lg border border-[#24282c] bg-[#0a0a0b]/80 p-3 text-xs font-mono">
                  <div>
                    <div className="text-[10px] text-[#656b70] uppercase">METRIC VALUE</div>
                    <div className="mt-0.5 font-bold text-[#f5f5f2]">
                      {warn.previousValue} → <span className="text-[#b8f34a]">{warn.currentValue}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[#656b70] uppercase">CHANGE DELTA</div>
                    <div className="mt-0.5 font-bold text-[#ff5c5c]">{warn.changeValue}</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[#656b70] uppercase">RISK SCORE</div>
                    <div className="mt-0.5 font-bold text-[#f5f5f2]">
                      {warn.previousRiskScore} → <span className="text-[#b8f34a]">{warn.riskScore}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] text-[#656b70] uppercase">DOWNSIDE IMPACT</div>
                    <div className="mt-0.5 font-bold text-[#ff5c5c]">
                      ${warn.previousImpactUsdM.toFixed(1)}M → ${warn.potentialImpactUsdM.toFixed(1)}M
                    </div>
                  </div>
                </div>

                {/* Bottom: Why it matters & CTA */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-[#92989e] max-w-3xl leading-relaxed">
                    <strong className="text-[#f5f5f2]">Why this matters: </strong>
                    {warn.whyItMatters}
                  </div>

                  <button className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#111416] px-3.5 py-1.5 text-xs font-semibold text-[#b8f34a] group-hover:bg-[#b8f34a] group-hover:text-[#0a0a0b] transition shrink-0">
                    Investigate
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
