import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import {
  ArrowLeft,
  ChevronRight,
  Copy,
  Check,
  Building2,
  Activity,
  Sparkles,
  ShieldAlert,
  SlidersHorizontal,
  History,
  GitBranch,
  DollarSign,
  Bell,
  CheckCircle2,
  Layers,
  Network,
  Share2,
} from 'lucide-react';
import { getIntelligenceScenario } from '@/data/intelligence';
import { getBusinessUnit } from '@/data/risk-intelligence-data';
import { canonicalEventsList } from '@/data/canonical-matching-data';
import { backtestRunsList } from '@/data/validation-intelligence-data';
import { useActiveBusinessUnit } from '@/hooks/useActiveBusinessUnit';

interface BreadcrumbConfig {
  groupLabel: string;
  parentPath: string;
  parentLabel: string;
  currentLabel: string;
  entityCode?: string;
  typeBadge: string;
  icon: typeof Activity;
}

export function BreadcrumbBar() {
  const [location, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);
  const { isUnitActive } = useActiveBusinessUnit();

  const breadcrumb = useMemo<BreadcrumbConfig | null>(() => {
    // 1. Signals Detail: /signals/:id
    const signalMatch = location.match(/^\/signals\/([^/]+)$/);
    if (signalMatch) {
      const id = decodeURIComponent(signalMatch[1]);
      const scenario = getIntelligenceScenario(id);
      return {
        groupLabel: 'INTELLIGENCE',
        parentPath: '/signals',
        parentLabel: 'Signals',
        currentLabel: scenario ? scenario.signal.title : id,
        entityCode: id,
        typeBadge: 'SIGNAL DETAIL',
        icon: Activity,
      };
    }

    // 2. Canonical Events Detail: /events/:id
    const eventMatch = location.match(/^\/events\/([^/]+)$/);
    if (eventMatch) {
      const id = decodeURIComponent(eventMatch[1]);
      const evt = canonicalEventsList.find((e) => e.id === id);
      return {
        groupLabel: 'INTELLIGENCE',
        parentPath: '/events',
        parentLabel: 'Canonical Events',
        currentLabel: evt ? evt.title : id,
        entityCode: id,
        typeBadge: 'CANONICAL EVENT',
        icon: Sparkles,
      };
    }

    // 3. Business Unit Detail: /exposure/business-unit/:id
    const buMatch = location.match(/^\/exposure\/business-unit\/([^/]+)$/);
    if (buMatch) {
      const id = decodeURIComponent(buMatch[1]);
      const bu = getBusinessUnit(id);
      const isActive = isUnitActive(id);
      return {
        groupLabel: 'IMPACT & SCENARIOS',
        parentPath: '/exposure',
        parentLabel: 'Company Exposure',
        currentLabel: bu ? bu.name : id,
        entityCode: bu?.division,
        typeBadge: isActive ? 'ACTIVE BUSINESS UNIT' : 'BUSINESS UNIT',
        icon: Building2,
      };
    }

    // 4. Risk Scores Detail: /risk/scores/:id
    const riskScoreMatch = location.match(/^\/risk\/scores\/([^/]+)$/);
    if (riskScoreMatch) {
      const id = decodeURIComponent(riskScoreMatch[1]);
      return {
        groupLabel: 'RISK & QUANTITATIVE',
        parentPath: '/risk/scores',
        parentLabel: 'Risk Scores',
        currentLabel: `Risk Score Factor (${id})`,
        entityCode: id,
        typeBadge: 'SCORE DETAIL',
        icon: ShieldAlert,
      };
    }

    // 5. Risk Propagation Detail: /risk/propagation/:id
    const propMatch = location.match(/^\/risk\/propagation\/([^/]+)$/);
    if (propMatch) {
      const id = decodeURIComponent(propMatch[1]);
      return {
        groupLabel: 'RISK & QUANTITATIVE',
        parentPath: '/risk/propagation',
        parentLabel: 'Risk Propagation',
        currentLabel: `Transmission Chain (${id})`,
        entityCode: id,
        typeBadge: 'CASCADE PATH',
        icon: GitBranch,
      };
    }

    // 6. Generic Risk Factor Detail: /risk/:id
    const riskDetailMatch = location.match(/^\/risk\/([^/]+)$/);
    if (riskDetailMatch) {
      const id = decodeURIComponent(riskDetailMatch[1]);
      const excluded = ['scores', 'taxonomy', 'relationships', 'transmission', 'propagation', 'calibration'];
      if (!excluded.includes(id)) {
        return {
          groupLabel: 'RISK & QUANTITATIVE',
          parentPath: '/risk',
          parentLabel: 'Risk Overview',
          currentLabel: `Factor Analysis (${id})`,
          entityCode: id,
          typeBadge: 'RISK FACTOR',
          icon: ShieldAlert,
        };
      }
    }

    // 7. Early Warning Detail: /early-warnings/:id or /warnings/:id
    const warningMatch = location.match(/^\/(?:early-warnings|warnings)\/([^/]+)$/);
    if (warningMatch) {
      const id = decodeURIComponent(warningMatch[1]);
      return {
        groupLabel: 'EXECUTIVE MONITORING',
        parentPath: '/early-warnings',
        parentLabel: 'Early Warnings',
        currentLabel: `Warning Investigation (${id})`,
        entityCode: id,
        typeBadge: 'EARLY WARNING',
        icon: Bell,
      };
    }

    // 8. Dollar Impact Detail: /impact/:id
    const impactMatch = location.match(/^\/impact\/([^/]+)$/);
    if (impactMatch) {
      const id = decodeURIComponent(impactMatch[1]);
      if (id !== 'scenarios' && id !== 'aggregation') {
        return {
          groupLabel: 'IMPACT & SCENARIOS',
          parentPath: '/impact',
          parentLabel: 'Dollar Impact',
          currentLabel: `Loss Distribution (${id})`,
          entityCode: id,
          typeBadge: 'DOLLAR IMPACT',
          icon: DollarSign,
        };
      }
    }

    // 9. Backtesting Event Detail: /backtesting/events/:id
    const btEventMatch = location.match(/^\/backtesting\/events\/([^/]+)$/);
    if (btEventMatch) {
      const id = decodeURIComponent(btEventMatch[1]);
      return {
        groupLabel: 'VALIDATION & EMPIRICAL',
        parentPath: '/historical-replay',
        parentLabel: 'Historical Replay',
        currentLabel: `Replay Event (${id})`,
        entityCode: id,
        typeBadge: 'HISTORICAL REPLAY',
        icon: History,
      };
    }

    // 10. Backtesting Run Detail: /backtesting/:id
    const btRunMatch = location.match(/^\/backtesting\/([^/]+)$/);
    if (btRunMatch) {
      const id = decodeURIComponent(btRunMatch[1]);
      const special = ['runs', 'warnings', 'risk-scores', 'matching', 'propagation', 'impact', 'events'];
      if (!special.includes(id)) {
        const run = backtestRunsList.find((r) => r.id === id);
        return {
          groupLabel: 'VALIDATION & EMPIRICAL',
          parentPath: '/backtesting',
          parentLabel: 'Backtesting Runs',
          currentLabel: run ? run.name : `Run Audit (${id})`,
          entityCode: id,
          typeBadge: 'WALK-FORWARD RUN',
          icon: SlidersHorizontal,
        };
      }
    }

    // 11. Validation Sub-modules under /backtesting/*
    if (location === '/backtesting/warnings') {
      return {
        groupLabel: 'VALIDATION & EMPIRICAL',
        parentPath: '/validation',
        parentLabel: 'Model Validation',
        currentLabel: 'Early Warnings Sentinel Validation',
        entityCode: 'LAYER 1 AUDIT',
        typeBadge: 'SENTINEL AUDIT',
        icon: CheckCircle2,
      };
    }
    if (location === '/backtesting/risk-scores') {
      return {
        groupLabel: 'VALIDATION & EMPIRICAL',
        parentPath: '/validation',
        parentLabel: 'Model Validation',
        currentLabel: 'Risk Score Monotonicity Audit',
        entityCode: 'LAYER 2 AUDIT',
        typeBadge: 'QUANTILE AUDIT',
        icon: CheckCircle2,
      };
    }
    if (location === '/backtesting/matching') {
      return {
        groupLabel: 'VALIDATION & EMPIRICAL',
        parentPath: '/validation',
        parentLabel: 'Model Validation',
        currentLabel: 'Canonical Matching Quality Audit',
        entityCode: 'LAYER 3 AUDIT',
        typeBadge: 'MATCH AUDIT',
        icon: CheckCircle2,
      };
    }
    if (location === '/backtesting/propagation') {
      return {
        groupLabel: 'VALIDATION & EMPIRICAL',
        parentPath: '/validation',
        parentLabel: 'Model Validation',
        currentLabel: 'Propagation Transmission Chain Validation',
        entityCode: 'LAYER 4 AUDIT',
        typeBadge: 'NETWORK AUDIT',
        icon: CheckCircle2,
      };
    }
    if (location === '/backtesting/impact') {
      return {
        groupLabel: 'VALIDATION & EMPIRICAL',
        parentPath: '/validation',
        parentLabel: 'Model Validation',
        currentLabel: 'Dollar Impact Bound Coverage Audit',
        entityCode: 'LAYER 5 AUDIT',
        typeBadge: 'P&L AUDIT',
        icon: CheckCircle2,
      };
    }

    // 12. Impact Sub-routes
    if (location === '/impact/scenarios') {
      return {
        groupLabel: 'IMPACT & SCENARIOS',
        parentPath: '/impact',
        parentLabel: 'Dollar Impact',
        currentLabel: 'Scenario Stress Engine',
        entityCode: 'MULTI-FACTOR',
        typeBadge: 'STRESS TEST',
        icon: SlidersHorizontal,
      };
    }
    if (location === '/impact/aggregation') {
      return {
        groupLabel: 'IMPACT & SCENARIOS',
        parentPath: '/impact',
        parentLabel: 'Dollar Impact',
        currentLabel: 'Impact Aggregation & Capital Offsets',
        entityCode: 'CAPITAL BUFFER',
        typeBadge: 'PORTFOLIO AGGREGATION',
        icon: Layers,
      };
    }

    // 13. Risk Sub-routes
    if (location === '/risk/taxonomy') {
      return {
        groupLabel: 'RISK & QUANTITATIVE',
        parentPath: '/risk',
        parentLabel: 'Risk Overview',
        currentLabel: 'Factor Taxonomy & Ontology',
        entityCode: '48 FACTORS',
        typeBadge: 'TAXONOMY',
        icon: Network,
      };
    }
    if (location === '/risk/relationships') {
      return {
        groupLabel: 'RISK & QUANTITATIVE',
        parentPath: '/risk',
        parentLabel: 'Risk Overview',
        currentLabel: 'Factor Correlations & Relationships',
        entityCode: 'CROSS-ASSET BETA',
        typeBadge: 'CORRELATION',
        icon: Network,
      };
    }
    if (location === '/risk/transmission') {
      return {
        groupLabel: 'RISK & QUANTITATIVE',
        parentPath: '/risk',
        parentLabel: 'Risk Overview',
        currentLabel: 'Sector Risk Transmission Paths',
        entityCode: 'TRANSMISSION',
        typeBadge: 'CONTAGION MAP',
        icon: GitBranch,
      };
    }

    return null;
  }, [location]);

  if (!breadcrumb) return null;

  const Icon = breadcrumb.icon;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      data-testid="detail-breadcrumb-bar"
      className="sticky top-[60px] z-10 border-b border-[#1b2024] bg-[#090b0d]/95 px-4 py-2.5 backdrop-blur-md sm:px-6 lg:px-8 transition-colors"
    >
      <div className="mx-auto flex flex-wrap items-center justify-between gap-3 max-w-[1600px]">
        {/* Left: Quick 1-Level Back Action + Full Breadcrumb Path */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] min-w-0">
          {/* Back one level button */}
          <button
            type="button"
            data-testid="breadcrumb-back-button"
            onClick={() => setLocation(breadcrumb.parentPath)}
            className="group inline-flex items-center gap-1.5 rounded-[5px] border border-[#23292e] bg-[#101416] px-2.5 py-1 text-[11px] font-medium text-[#c5cbc7] hover:border-[#384249] hover:bg-[#151a1d] hover:text-[#f4f5f2] transition-all"
            title={`Navigate back one level to ${breadcrumb.parentLabel}`}
          >
            <ArrowLeft
              size={12}
              className="text-[#b8f34a] group-hover:-translate-x-0.5 transition-transform"
            />
            <span className="truncate">Back to {breadcrumb.parentLabel}</span>
          </button>

          <span className="hidden sm:inline-block h-3.5 w-[1px] bg-[#22272b]" />

          {/* Breadcrumb Hierarchy Trail */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 sm:gap-2 text-[11px] overflow-hidden">
            <button
              type="button"
              onClick={() => setLocation('/')}
              className="text-[#727c82] hover:text-[#b8f34a] transition-colors font-mono tracking-wider"
              title="EXOGEN Entry"
            >
              EXOGEN
            </button>

            <ChevronRight size={11} className="text-[#3e464c] shrink-0" />

            <span className="hidden md:inline text-[#5f686e] font-mono text-[10px] uppercase tracking-wider">
              {breadcrumb.groupLabel}
            </span>

            <ChevronRight size={11} className="hidden md:inline text-[#3e464c] shrink-0" />

            <button
              type="button"
              onClick={() => setLocation(breadcrumb.parentPath)}
              className="text-[#889297] hover:text-[#f4f5f2] transition-colors font-medium truncate max-w-[140px]"
            >
              {breadcrumb.parentLabel}
            </button>

            <ChevronRight size={11} className="text-[#3e464c] shrink-0" />

            {/* Active Detail Node */}
            <div className="flex items-center gap-1.5 min-w-0">
              <Icon size={12} className="text-[#b8f34a] shrink-0" />
              <span className="font-semibold text-[#f4f5f2] truncate max-w-[200px] sm:max-w-[320px]">
                {breadcrumb.currentLabel}
              </span>
            </div>
          </nav>
        </div>

        {/* Right: Metadata Tag + Quick Copy Link */}
        <div className="flex items-center gap-2 text-[10px] font-mono shrink-0 ml-auto">
          {breadcrumb.entityCode && (
            <span className="hidden lg:inline-block rounded bg-[#13171a] border border-[#22282d] px-2 py-0.5 text-[#929c97]">
              {breadcrumb.entityCode}
            </span>
          )}

          <span className="rounded bg-[#182015] border border-[#b8f34a]/30 px-2 py-0.5 font-semibold text-[#b8f34a]">
            {breadcrumb.typeBadge}
          </span>

          <button
            type="button"
            data-testid="breadcrumb-copy-link"
            onClick={handleCopyUrl}
            className="flex items-center gap-1 rounded border border-[#23292e] bg-[#101416] px-2 py-0.5 text-[#7a848a] hover:border-[#384249] hover:text-[#dbe1dd] transition-all"
            title="Copy current direct URL"
          >
            {copied ? <Check size={11} className="text-[#b8f34a]" /> : <Copy size={11} />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Share'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
