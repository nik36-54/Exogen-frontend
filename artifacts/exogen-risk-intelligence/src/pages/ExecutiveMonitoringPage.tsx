import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  CheckCircle2,
  Clock,
  Eye,
  FileCheck2,
  GitBranch,
  Layers,
  Network,
  RotateCcw,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  executiveMonitoringSummaryMock,
  materialChangesList,
  earlyWarningsList,
  watchlistsMock,
} from '@/data/monitoring-intelligence-data';
import { SignatureExpandableChain } from '@/components/monitoring/SignatureExpandableChain';
import { SystemMonitoringStatusModal } from '@/components/monitoring/SystemMonitoringStatusModal';
import { NotificationCenterDrawer } from '@/components/monitoring/NotificationCenterDrawer';

export default function ExecutiveMonitoringPage() {
  const [, setLocation] = useLocation();
  const [statusOpen, setStatusOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const summary = executiveMonitoringSummaryMock;

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Top Banner: Status & Headline (Sections 5 & 44) */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              COMMAND CENTER · CONTINUOUS SENSING
            </span>
            <button
              onClick={() => setStatusOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#24282c] bg-[#111416] px-2.5 py-0.5 text-[10px] font-mono text-[#92989e] hover:border-[#b8f34a] hover:text-[#f5f5f2] transition"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#b8f34a] animate-pulse" />
              MONITORING · Last updated 42s ago
            </button>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#f5f5f2] sm:text-3xl">
            {summary.headline}
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            {summary.secondaryLine}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setNotifOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-3.5 py-2 text-xs font-medium text-[#f5f5f2] hover:border-[#b8f34a]/60 hover:text-[#b8f34a] transition"
          >
            <Bell className="h-3.5 w-3.5 text-[#b8f34a]" />
            Recent Activity (4)
          </button>
          <button
            onClick={() => setLocation('/early-warnings')}
            className="flex items-center gap-1.5 rounded-lg bg-[#b8f34a] px-3.5 py-2 text-xs font-semibold text-[#0a0a0b] hover:bg-[#a6e03b] transition"
          >
            Early Warnings ({summary.activeWarningsCount})
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Executive Monitoring Summary Strip (Section 56) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <div
          onClick={() => setLocation('/early-warnings')}
          className="rounded-lg border border-[#24282c] bg-[#111416] p-3.5 cursor-pointer transition hover:border-[#3b4440]"
        >
          <div className="text-[10px] font-mono uppercase text-[#92989e]">ACTIVE WARNINGS</div>
          <div className="mt-1 text-2xl font-mono font-bold text-[#f5f5f2]">
            {summary.activeWarningsCount}
          </div>
          <div className="mt-0.5 text-[10px] text-[#ff5c5c] font-mono">
            {summary.criticalWarningsCount} Critical Severity
          </div>
        </div>

        <div
          onClick={() => setLocation('/early-warnings')}
          className="rounded-lg border border-[#24282c] bg-[#111416] p-3.5 cursor-pointer transition hover:border-[#3b4440]"
        >
          <div className="text-[10px] font-mono uppercase text-[#92989e]">HIGH SIGNIFICANCE CHANGES</div>
          <div className="mt-1 text-2xl font-mono font-bold text-[#b8f34a]">
            {summary.highSignificanceChangesCount}
          </div>
          <div className="mt-0.5 text-[10px] text-[#656b70]">Since midnight UTC</div>
        </div>

        <div
          onClick={() => setLocation('/impact')}
          className="rounded-lg border border-[#24282c] bg-[#111416] p-3.5 cursor-pointer transition hover:border-[#3b4440]"
        >
          <div className="text-[10px] font-mono uppercase text-[#92989e]">DOWNSIDE EXPOSURE REVISION</div>
          <div className="mt-1 text-2xl font-mono font-bold text-[#ff5c5c]">
            +${summary.downsideExposureIncreaseUsdM.toFixed(1)}M
          </div>
          <div className="mt-0.5 text-[10px] text-[#656b70]">Gross modeled change</div>
        </div>

        <div
          onClick={() => setLocation('/risk/propagation')}
          className="rounded-lg border border-[#24282c] bg-[#111416] p-3.5 cursor-pointer transition hover:border-[#3b4440]"
        >
          <div className="text-[10px] font-mono uppercase text-[#92989e]">NEW PROPAGATIONS</div>
          <div className="mt-1 text-2xl font-mono font-bold text-[#7c8cff]">
            {summary.newPropagationPathsCount}
          </div>
          <div className="mt-0.5 text-[10px] text-[#656b70]">Multi-BU transmission</div>
        </div>

        <div
          onClick={() => setLocation('/data-quality')}
          className="rounded-lg border border-[#24282c] bg-[#111416] p-3.5 cursor-pointer transition hover:border-[#3b4440]"
        >
          <div className="text-[10px] font-mono uppercase text-[#92989e]">DATA CONFIDENCE HEALTH</div>
          <div className="mt-1 text-2xl font-mono font-bold text-[#b8f34a]">
            {summary.highConfidenceRiskPercentage}%
          </div>
          <div className="mt-0.5 text-[10px] text-[#656b70]">Validated oracles</div>
        </div>
      </div>

      {/* Signature Exogen Experience (Section 79) */}
      <SignatureExpandableChain />

      {/* Two-Column Grid: Left "What Changed", Right "Since Yesterday" & Active Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 Cols): Primary "What Changed" Feed (Section 6) */}
        <div className="lg:col-span-7 rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
          <div className="border-b border-[#24282c] pb-3 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#b8f34a]">
                INTRADAY SENSING FEED
              </span>
              <h2 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
                What Changed
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#656b70]">
              LIVE DETECTION STREAM
            </span>
          </div>

          <div className="space-y-3">
            {materialChangesList.map((chg) => (
              <div
                key={chg.id}
                onClick={() => setLocation(chg.ctaPath)}
                className="group rounded-lg border border-[#24282c] bg-[#171a1d] p-3.5 transition hover:border-[#3b4440] cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-bold text-[#b8f34a]">{chg.time}</span>
                    <span className="font-semibold text-[#f5f5f2] group-hover:text-[#b8f34a]">
                      {chg.title}
                    </span>
                  </div>
                  <span className="rounded bg-[#0a0a0b] px-2 py-0.5 text-[10px] font-mono font-semibold text-[#ff5c5c] border border-[#24282c]">
                    {chg.magnitude}
                  </span>
                </div>

                <div className="mt-2 text-xs text-[#92989e] flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Event: <strong className="text-[#f5f5f2]">{chg.eventTitle}</strong></span>
                  <span>·</span>
                  <span>Shift: <span className="font-mono text-[#656b70]">{chg.oldValue} →</span> <span className="font-mono font-bold text-[#f5f5f2]">{chg.newValue}</span></span>
                  {chg.impactChangeUsdM > 0 && (
                    <>
                      <span>·</span>
                      <span className="font-mono text-[#ff5c5c]">Impact +${chg.impactChangeUsdM.toFixed(1)}M</span>
                    </>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[#24282c] pt-2 text-[11px]">
                  <span className="text-[#656b70]">
                    Affects {chg.affectedRisk} → {chg.affectedBusinessUnit}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-[#b8f34a]">
                    {chg.ctaLabel} <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column (5 Cols): "Since Yesterday" + Watchlist Highlights */}
        <div className="lg:col-span-5 space-y-6">
          {/* "What Changed Since Yesterday?" Component (Section 42) */}
          <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
            <div className="border-b border-[#24282c] pb-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
                EXECUTIVE SUMMARY
              </span>
              <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
                Since Yesterday
              </h3>
            </div>

            <div className="rounded-lg border border-[#24282c] bg-[#0a0a0b] p-3 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[#92989e]">Material changes detected:</span>
                <span className="font-mono font-bold text-[#b8f34a]">{summary.sinceYesterdaySummary.materialChangesCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#92989e]">Risks escalated to high tier:</span>
                <span className="font-mono font-bold text-[#ff5c5c]">{summary.sinceYesterdaySummary.risksEscalatedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#92989e]">Exposures revised upward:</span>
                <span className="font-mono font-bold text-[#f5f5f2]">{summary.sinceYesterdaySummary.exposuresIncreasedCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#92989e]">New propagation paths mapped:</span>
                <span className="font-mono font-bold text-[#7c8cff]">{summary.sinceYesterdaySummary.newPropagationsCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#92989e]">New canonical events synthesized:</span>
                <span className="font-mono font-bold text-[#f5f5f2]">{summary.sinceYesterdaySummary.newCanonicalEventsCount}</span>
              </div>
            </div>

            {/* Largest Change Callout */}
            <div className="rounded-lg border border-[#ff5c5c]/30 bg-[#ff5c5c]/5 p-3.5 text-xs">
              <div className="text-[10px] font-mono uppercase text-[#ff5c5c] font-bold">
                LARGEST SINGLE VARIANCE
              </div>
              <div className="mt-1 font-semibold text-[#f5f5f2]">
                {summary.sinceYesterdaySummary.largestChange.eventTitle}
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 font-mono text-[10px]">
                <div className="rounded bg-[#0a0a0b] p-1.5 border border-[#24282c]">
                  <div className="text-[#656b70]">PROBABILITY</div>
                  <div className="text-[#b8f34a] font-bold">+24.1pp</div>
                </div>
                <div className="rounded bg-[#0a0a0b] p-1.5 border border-[#24282c]">
                  <div className="text-[#656b70]">RISK SCORE</div>
                  <div className="text-[#ff5c5c] font-bold">+27 pts</div>
                </div>
                <div className="rounded bg-[#0a0a0b] p-1.5 border border-[#24282c]">
                  <div className="text-[#656b70]">IMPACT</div>
                  <div className="text-[#ff5c5c] font-bold">+$10.4M</div>
                </div>
              </div>
              <button
                onClick={() => setLocation('/early-warnings/WARN-FED-RATE-CUT')}
                className="mt-3 w-full flex items-center justify-center gap-1.5 rounded bg-[#ff5c5c] py-1.5 text-xs font-semibold text-[#0a0a0b] hover:bg-[#ff4040]"
              >
                Investigate Largest Change →
              </button>
            </div>
          </div>

          {/* Persistent Watchlist Snapshot (Section 28 & 30) */}
          <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5 space-y-4">
            <div className="border-b border-[#24282c] pb-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
                  ACTIVE PORTFOLIO SENTINEL
                </span>
                <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
                  Watchlist Status
                </h3>
              </div>
              <button
                onClick={() => setLocation('/watchlist')}
                className="text-xs text-[#b8f34a] hover:underline"
              >
                View all ({watchlistsMock.length}) →
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {watchlistsMock.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => setLocation('/watchlist')}
                  className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 hover:border-[#3b4440] cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#f5f5f2] truncate max-w-[200px]">
                      {item.name}
                    </span>
                    <span className="font-mono text-[#b8f34a] font-bold">
                      {item.riskScore ? `Score: ${item.riskScore}` : ''}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-[#92989e]">
                    <span>{item.change24h}</span>
                    <span className="text-[#656b70]">{item.lastUpdated}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SystemMonitoringStatusModal
        isOpen={statusOpen}
        onClose={() => setStatusOpen(false)}
      />

      <NotificationCenterDrawer
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
      />
    </div>
  );
}
