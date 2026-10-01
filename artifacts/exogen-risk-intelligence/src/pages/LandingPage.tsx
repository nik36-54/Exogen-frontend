import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookmarkCheck,
  Briefcase,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Command,
  Compass,
  Cpu,
  Database,
  DollarSign,
  Eye,
  FileCheck2,
  Filter,
  Gauge,
  GitBranch,
  Globe,
  History,
  Layers,
  LayoutDashboard,
  Lock,
  Network,
  Play,
  RotateCcw,
  Scale,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  TrendingDown,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import { GlobalSearchModal } from '@/components/search/GlobalSearchModal';
import { LiveIndicator } from '@/components/overview/Status';
import { validationSummaryMetrics, validationHealthIndicators } from '@/data/validation-intelligence-data';
import { businessUnitsList } from '@/data/risk-intelligence-data';
import { intelligenceScenarios } from '@/data/intelligence';
import { canonicalEventsList } from '@/data/canonical-matching-data';

interface InteractiveShockSignal {
  id: string;
  name: string;
  category: string;
  consensusProb: number;
  exogenProb: number;
  baseImpactUsdM: number;
  leadTimeHours: number;
  primaryBU: string;
  propagationHops: number;
  transmissionPath: string[];
  description: string;
}

const SHOCK_SIGNALS: InteractiveShockSignal[] = [
  {
    id: 'SIG-FED-CUT',
    name: 'FOMC Benchmark Rate Cut ≥50 bps',
    category: 'Macroeconomic / Monetary Policy',
    consensusProb: 44,
    exogenProb: 68,
    baseImpactUsdM: 142.5,
    leadTimeHours: 28.4,
    primaryBU: 'Commercial Banking',
    propagationHops: 3,
    transmissionPath: ['Fed Funds Futures', 'Treasury Yield Curve', 'CRE Fixed Refinancing Spreads', 'Commercial Loan Impairment'],
    description: 'Rapid easing signal detected via prediction markets pricing emergency inter-meeting or aggressive 50 bps easing action.',
  },
  {
    id: 'SIG-EUR-GAS',
    name: 'European Natural Gas Transit Curtailment',
    category: 'Energy / Geopolitical',
    consensusProb: 31,
    exogenProb: 59,
    baseImpactUsdM: 88.0,
    leadTimeHours: 16.2,
    primaryBU: 'Global Markets & Trading',
    propagationHops: 4,
    transmissionPath: ['Dutch TTF Futures', 'Power Gen Margins', 'Industrial Chemical Margins', 'Counterparty Credit Default'],
    description: 'Flow curtailment through secondary pipeline interconnectors with unhedged corporate European industrial exposures.',
  },
  {
    id: 'SIG-SUEZ-CANAL',
    name: 'Bab el-Mandeb & Red Sea Maritime Rerouting',
    category: 'Supply Chain / Freight',
    consensusProb: 52,
    exogenProb: 81,
    baseImpactUsdM: 115.4,
    leadTimeHours: 22.0,
    primaryBU: 'Asset & Wealth Management',
    propagationHops: 3,
    transmissionPath: ['Container Spot Rates (SCFI)', 'Cape of Good Hope Fuel Surcharges', 'Consumer Goods Margin Squeeze'],
    description: 'Prolonged maritime transit bypass expanding shipping voyage days by 14 days and compounding vessel war-risk premiums.',
  },
  {
    id: 'SIG-TAIWAN-STRAIT',
    name: 'Taiwan Strait Semiconductor Transit Exercise',
    category: 'Geopolitics / Critical Tech',
    consensusProb: 24,
    exogenProb: 47,
    baseImpactUsdM: 265.0,
    leadTimeHours: 36.5,
    primaryBU: 'Global Markets & Trading',
    propagationHops: 4,
    transmissionPath: ['Taiwan Strait Vessel Density', 'Foundry Lead-Time Spreads', 'Automotive OEM Halts', 'Tech Sector Equity Volatility'],
    description: 'Asymmetric naval drill zones overlapping key shipping lanes for leading-edge sub-5nm wafer shipments.',
  },
];

interface ModuleDirectoryItem {
  id: string;
  name: string;
  category: 'Validation' | 'Risk' | 'Impact' | 'Intelligence' | 'Executive';
  path: string;
  tagline: string;
  metrics: string;
  badge: string;
}

const ALL_MODULES: ModuleDirectoryItem[] = [
  // Validation
  { id: 'mod-val', name: 'Model Validation Command Center', category: 'Validation', path: '/validation', tagline: 'Unified empirical scorecard, reliability matrix & Brier diagnostics', metrics: 'Brier: 0.142 · ECE: 7.1%', badge: 'EMPIRICAL AUDIT' },
  { id: 'mod-bt', name: 'Backtesting Engine & Runs', category: 'Validation', path: '/backtesting', tagline: 'Walk-forward out-of-sample backtesting runs across historical windows', metrics: '1,248 Evaluated Events', badge: 'WALK-FORWARD' },
  { id: 'mod-calib', name: 'Probability Calibration Curves', category: 'Validation', path: '/calibration', tagline: 'Reliability diagrams, Platt scaling, and empirical probability deciles', metrics: '87.8% Calibration Score', badge: 'RELIABILITY' },
  { id: 'mod-replay', name: 'Historical Event Replay Simulator', category: 'Validation', path: '/historical-replay', tagline: 'Counterfactual step-by-step historical event unfolding and lead times', metrics: '18.4h Avg Lead Time', badge: 'COUNTERFACTUAL' },
  { id: 'mod-perf', name: 'Model Performance Scorecard', category: 'Validation', path: '/model-performance', tagline: 'Five-layer architectural benchmark: Precision, Recall, Monotonicity', metrics: '94.1% Precision', badge: '5-LAYER AUDIT' },
  { id: 'mod-v-warn', name: 'Early Warnings Validation', category: 'Validation', path: '/backtesting/warnings', tagline: 'Early warning precision, false alarm rate & alert threshold tuning', metrics: '83.3% Alert Precision', badge: 'SENTINEL AUDIT' },
  { id: 'mod-v-scores', name: 'Risk Score Validation', category: 'Validation', path: '/backtesting/risk-scores', tagline: 'Rank-order monotonicity, hazard differentiation, and quantile splits', metrics: '0.82 Monotonicity', badge: 'QUANTILE AUDIT' },
  { id: 'mod-v-match', name: 'Canonical Matching Validation', category: 'Validation', path: '/backtesting/matching', tagline: 'Pairwise entity resolution accuracy against resolved ground-truth', metrics: '92.9% F1 Score', badge: 'ENTITY MATCH' },
  { id: 'mod-v-prop', name: 'Propagation Transmission Validation', category: 'Validation', path: '/backtesting/propagation', tagline: 'Transmission graph edge fidelity and multi-hop contagion bounds', metrics: '88.5% Edge Precision', badge: 'GRAPH AUDIT' },
  { id: 'mod-v-imp', name: 'Dollar Impact Bound Validation', category: 'Validation', path: '/backtesting/impact', tagline: 'Modeled financial loss intervals evaluated against reported balance sheets', metrics: '82.0% Bound Coverage', badge: 'P&L AUDIT' },

  // Executive
  { id: 'mod-mon', name: 'Executive Monitoring Center', category: 'Executive', path: '/monitoring', tagline: 'Top-level C-suite macro dashboard, overnight shifts & critical changes', metrics: '18 Active Signals · 8 Changes', badge: 'EXECUTIVE OVERVIEW' },
  { id: 'mod-ew', name: 'Early Warnings Sentinel', category: 'Executive', path: '/early-warnings', tagline: 'Automated threshold triggers with lead time indicators and escalation', metrics: '3 High-Priority Warnings', badge: 'REAL-TIME SENTINEL' },
  { id: 'mod-watch', name: 'Institutional Watchlists', category: 'Executive', path: '/watchlist', tagline: 'Customized factor baskets, portfolio exposures & surveillance groups', metrics: '4 Corporate Portfolios', badge: 'SURVEILLANCE' },
  { id: 'mod-alert', name: 'Alerts Dispatcher', category: 'Executive', path: '/alerts', tagline: 'Multi-channel enterprise risk alerts, trigger logs & mitigation routing', metrics: '12 Rules Active', badge: 'DISPATCH' },
  { id: 'mod-rgraph', name: 'Enterprise Risk Graph', category: 'Executive', path: '/risk-graph', tagline: 'Interactive 3D network visualizing factor dependencies & balance sheets', metrics: '142 Nodes · 384 Edges', badge: 'NETWORK GRAPH' },

  // Risk
  { id: 'mod-rscores', name: 'Quantitative Risk Scores', category: 'Risk', path: '/risk/scores', tagline: 'Multi-factor risk score decomposition across 8 operational axes', metrics: '78 Max Factor Score', badge: 'HAZARD RATING' },
  { id: 'mod-rprop', name: 'Risk Propagation & Transmission', category: 'Risk', path: '/risk/propagation', tagline: 'Deterministic and probabilistic shock cascades across sectors', metrics: 'Up to 4-Hop Contagion', badge: 'CONTAGION' },
  { id: 'mod-rtax', name: 'Factor Taxonomy & Ontology', category: 'Risk', path: '/risk/taxonomy', tagline: 'Exogenous risk hierarchy: Geopolitical, Macro, Environmental, Supply', metrics: '48 Formal Factors', badge: 'ONTOLOGY' },
  { id: 'mod-rrel', name: 'Factor Relationships & Correlations', category: 'Risk', path: '/risk/relationships', tagline: 'Empirical correlation matrices and cross-asset beta coefficients', metrics: '0.68 Median Correlation', badge: 'CORRELATION' },
  { id: 'mod-rover', name: 'Enterprise Risk Overview', category: 'Risk', path: '/risk', tagline: 'Holistic cross-division enterprise risk matrix & factor heatmaps', metrics: 'High Overall Exposure', badge: 'RISK MATRIX' },
  { id: 'mod-expo', name: 'Company Exposure Portfolio', category: 'Risk', path: '/exposure', tagline: 'Balance sheet division breakdowns and capital adequacy sensitivity', metrics: '$12.4B Total Modeled Exposure', badge: 'BALANCE SHEET' },

  // Impact
  { id: 'mod-imp', name: 'Quantitative Dollar Impact', category: 'Impact', path: '/impact', tagline: 'Probabilistic loss distributions, Value-at-Risk and downside envelopes', metrics: '$382M Expected Net Loss', badge: 'LOSS DISTRIBUTION' },
  { id: 'mod-scen', name: 'Scenario Stress Engine', category: 'Impact', path: '/impact/scenarios', tagline: 'Interactive multi-variable shock generator with real-time recalculation', metrics: '5 Standard Stress Scenarios', badge: 'STRESS TEST' },
  { id: 'mod-agg', name: 'Impact Aggregation & Capital', category: 'Impact', path: '/impact/aggregation', tagline: 'Division-level aggregation with correlation offsets and capital buffers', metrics: 'Diversification Benefit: $64M', badge: 'CAPITAL ADEQUACY' },

  // Intelligence
  { id: 'mod-sig', name: 'Real-Time Signals Terminal', category: 'Intelligence', path: '/signals', tagline: 'Continuous prediction markets consensus vs internal asymmetric models', metrics: '48 Monitored Signals', badge: 'PREDICTION MARKETS' },
  { id: 'mod-evt', name: 'Canonical Events Registry', category: 'Intelligence', path: '/events', tagline: 'Deduplicated canonical event definitions with resolution criteria', metrics: '24 Resolved Events', badge: 'CANONICAL RESOLUTION' },
  { id: 'mod-dq', name: 'Data Quality & Ingestion Telemetry', category: 'Intelligence', path: '/data-quality', tagline: 'Feed latency, contract depth, anomaly detection & data lineage', metrics: '99.98% Pipeline Uptime', badge: 'DATA INTEGRITY' },
  { id: 'mod-match', name: 'Prediction Matching Engine', category: 'Intelligence', path: '/matching', tagline: 'Fellegi-Sunter semantic and categorical linkage verification', metrics: '92.9% Match Precision', badge: 'SEMANTIC LINKAGE' },
];

export default function LandingPage() {
  const [, setLocation] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedSignalIndex, setSelectedSignalIndex] = useState(0);
  const [shockSeverity, setShockSeverity] = useState(100);
  const [activeSandboxTab, setActiveSandboxTab] = useState<'SHOCK' | 'SENTINEL' | 'TRANSMISSION' | 'CALIBRATION'>('SHOCK');
  const [moduleFilter, setModuleFilter] = useState<'All' | 'Validation' | 'Risk' | 'Impact' | 'Intelligence' | 'Executive'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const currentSignal = SHOCK_SIGNALS[selectedSignalIndex];

  // Dynamic calculations based on interactive slider
  const dynamicImpact = useMemo(() => {
    const multiplier = shockSeverity / 100;
    return (currentSignal.baseImpactUsdM * multiplier).toFixed(1);
  }, [currentSignal, shockSeverity]);

  const dynamicSpread = useMemo(() => {
    return currentSignal.exogenProb - currentSignal.consensusProb;
  }, [currentSignal]);

  const filteredModules = useMemo(() => {
    return ALL_MODULES.filter((m) => {
      const matchesCategory = moduleFilter === 'All' || m.category === moduleFilter;
      const matchesQuery =
        !searchQuery.trim() ||
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.badge.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [moduleFilter, searchQuery]);

  const navigateTo = (path: string) => {
    setLocation(path);
  };

  return (
    <div className="min-h-screen bg-[#070809] text-[#f4f5f2] selection:bg-[#b8f34a]/30 selection:text-[#b8f34a]">
      {/* Top Ambient Glow Line */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#b8f34a]/80 to-transparent z-50 pointer-events-none" />

      {/* Institutional Top Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-[#1b2024] bg-[#070809]/95 backdrop-blur-md">
        <div className="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <button
            type="button"
            data-testid="landing-logo-button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3.5 text-left group cursor-pointer focus:outline-none"
            title="EXOGEN"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#b8f34a]/40 bg-[#b8f34a]/10 shadow-[0_0_15px_rgba(184,243,74,0.15)] group-hover:border-[#b8f34a] transition-colors">
              <span className="h-3 w-3 rotate-45 border-[2px] border-[#b8f34a]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[15px] font-bold tracking-[.25em] text-[#f4f5f2] group-hover:text-[#b8f34a] transition-colors">EXOGEN</span>
                <span className="text-[10px] font-mono tracking-wider text-[#b8f34a] border border-[#b8f34a]/30 px-1.5 py-[1px] rounded bg-[#b8f34a]/5">
                  v2.4 PROD
                </span>
              </div>
              <div className="text-[9px] font-mono tracking-wide text-[#6c767e]">
                EXOGENOUS RISK & EMPIRICAL VALIDATION ENGINE
              </div>
            </div>
          </button>

          {/* Center Navigation Anchors */}
          <nav className="hidden lg:flex items-center gap-6 text-[12px] font-medium text-[#889299]">
            <a href="#overview" className="hover:text-[#f4f5f2] transition-colors">Overview</a>
            <a href="#sandbox" className="hover:text-[#f4f5f2] transition-colors">Interactive Sandbox</a>
            <a href="#modules" className="hover:text-[#f4f5f2] transition-colors">Platform Modules</a>
            <a href="#empirical" className="hover:text-[#f4f5f2] transition-colors">Empirical Validation</a>
            <a href="#deep-links" className="hover:text-[#f4f5f2] transition-colors">Entity Directory</a>
            <a href="#architecture" className="hover:text-[#f4f5f2] transition-colors">Architecture</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-testid="landing-search-trigger"
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-[#23292e] bg-[#111417] px-3 py-1.5 text-[11px] text-[#828c92] hover:border-[#38424a] hover:text-[#d3d8d6] transition-all"
            >
              <Search size={13} className="text-[#8e989d]" />
              <span className="hidden sm:inline">Search platform</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-[#2e373d] bg-[#181d21] px-1.5 py-0.5 text-[9px] font-mono text-[#778087]">
                <Command size={9} /> K
              </kbd>
            </button>

            <button
              type="button"
              data-testid="enter-platform-btn"
              onClick={() => navigateTo('/overview')}
              className="flex items-center gap-2 rounded-lg border border-[#b8f34a]/50 bg-[#b8f34a] px-3.5 py-1.5 text-[12px] font-semibold text-[#0a0c0e] shadow-[0_0_20px_rgba(184,243,74,0.2)] hover:bg-[#c9fa65] hover:shadow-[0_0_25px_rgba(184,243,74,0.35)] transition-all"
            >
              <Terminal size={14} />
              <span>Launch Terminal</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main id="overview" className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-24">
        {/* HERO SECTION */}
        <section className="relative text-center max-w-4xl mx-auto space-y-7">
          <div className="inline-flex items-center gap-2.5 rounded-full border border-[#293238] bg-[#101417]/80 px-3.5 py-1 text-[11px] text-[#8f9aa1]">
            <LiveIndicator compact />
            <span>CONTINUOUS RISK INTELLIGENCE & EMPIRICAL PROOF</span>
            <span className="text-[#3e4850]">·</span>
            <span className="font-mono text-[#b8f34a]">1,248 HISTORICAL EVENTS EVALUATED</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#f4f5f2] leading-[1.12]">
            Bridge Exogenous Shocks <br />
            <span className="bg-gradient-to-r from-[#f4f5f2] via-[#e5f5cc] to-[#b8f34a] bg-clip-text text-transparent">
              Directly to Corporate Balance Sheets
            </span>
          </h1>

          <p className="text-base sm:text-lg text-[#88939a] leading-relaxed max-w-3xl mx-auto">
            From asymmetric prediction market signals to Bayesian canonical clustering, graph-based transmission modeling, and audited dollar-at-risk exposure across Global Markets, Commercial Banking, and Asset Management.
          </p>

          {/* Dual Primary Call-to-Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <button
              type="button"
              data-testid="hero-launch-terminal"
              onClick={() => navigateTo('/overview')}
              className="flex items-center gap-2 rounded-lg bg-[#b8f34a] px-6 py-3 text-[13px] font-semibold text-[#08090a] shadow-[0_0_30px_rgba(184,243,74,0.3)] hover:bg-[#cbfb69] transition-all"
            >
              <LayoutDashboard size={15} />
              <span>Launch Enterprise Terminal (/overview)</span>
              <ArrowRight size={15} />
            </button>

            <button
              type="button"
              data-testid="hero-model-validation"
              onClick={() => navigateTo('/validation')}
              className="flex items-center gap-2 rounded-lg border border-[#2b3339] bg-[#121619] px-5 py-3 text-[13px] font-medium text-[#d9dedb] hover:border-[#414d56] hover:bg-[#161c20] transition-all"
            >
              <CheckCircle2 size={15} className="text-[#b8f34a]" />
              <span>Model Validation Scorecard (/validation)</span>
            </button>

            <a
              href="#sandbox"
              className="flex items-center gap-2 rounded-lg border border-[#22282d] bg-transparent px-4 py-3 text-[13px] font-medium text-[#7d8890] hover:text-[#f4f5f2] transition-colors"
            >
              <SlidersHorizontal size={14} />
              <span>Interactive Sandbox ↓</span>
            </a>
          </div>

          {/* Real Live Metrics Ticker Banner */}
          <div className="pt-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-4 rounded-xl border border-[#1d2226] bg-[#0c0e10]/90 shadow-2xl">
              <div className="text-left p-2.5 border-r border-[#191e21] last:border-r-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#687278]">EVALUATED EVENTS</div>
                <div className="text-xl font-bold font-mono text-[#f4f5f2] mt-0.5">1,248</div>
                <div className="text-[9px] text-[#869299] mt-0.5">Out-of-sample data</div>
              </div>
              <div className="text-left p-2.5 border-r border-[#191e21] last:border-r-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#687278]">BRIER SCORE</div>
                <div className="text-xl font-bold font-mono text-[#b8f34a] mt-0.5">0.142</div>
                <div className="text-[9px] text-[#869299] mt-0.5">vs 0.228 baseline</div>
              </div>
              <div className="text-left p-2.5 border-r border-[#191e21] last:border-r-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#687278]">LEAD TIME</div>
                <div className="text-xl font-bold font-mono text-[#f4f5f2] mt-0.5">18.4 hrs</div>
                <div className="text-[9px] text-[#869299] mt-0.5">Avg warning margin</div>
              </div>
              <div className="text-left p-2.5 border-r border-[#191e21] last:border-r-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#687278]">MATCHING F1</div>
                <div className="text-xl font-bold font-mono text-[#b8f34a] mt-0.5">92.9%</div>
                <div className="text-[9px] text-[#869299] mt-0.5">Canonical linkage</div>
              </div>
              <div className="text-left p-2.5 border-r border-[#191e21] last:border-r-0">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#687278]">PORTFOLIO EXP.</div>
                <div className="text-xl font-bold font-mono text-[#f4f5f2] mt-0.5">$12.4B</div>
                <div className="text-[9px] text-[#869299] mt-0.5">Modeled corporate scope</div>
              </div>
              <div className="text-left p-2.5">
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#687278]">BUSINESS UNITS</div>
                <div className="text-xl font-bold font-mono text-[#f4f5f2] mt-0.5">4 Units</div>
                <div className="text-[9px] text-[#869299] mt-0.5">JPMorgan Chase demo</div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 2: LIVE INTERACTIVE SANDBOX (BACK-AND-FORTH ACTIONS) */}
        <section id="sandbox" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1e2327] pb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
                LIVE INTERACTIVE SANDBOX
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#f4f5f2] mt-1">
                Explore Shocks, Sentinels, & Propagation in Real-Time
              </h2>
              <p className="text-[12px] text-[#838d94] mt-1">
                Interact with live parameters below and directly launch the corresponding platform engine.
              </p>
            </div>

            {/* Sandbox Tabs */}
            <div className="flex items-center gap-1 p-1 rounded-lg border border-[#23292e] bg-[#0e1113]">
              <button
                type="button"
                onClick={() => setActiveSandboxTab('SHOCK')}
                className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
                  activeSandboxTab === 'SHOCK'
                    ? 'bg-[#1b2126] text-[#b8f34a] shadow-sm'
                    : 'text-[#7e888f] hover:text-[#f4f5f2]'
                }`}
              >
                Macro Shock Simulator
              </button>
              <button
                type="button"
                onClick={() => setActiveSandboxTab('SENTINEL')}
                className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
                  activeSandboxTab === 'SENTINEL'
                    ? 'bg-[#1b2126] text-[#b8f34a] shadow-sm'
                    : 'text-[#7e888f] hover:text-[#f4f5f2]'
                }`}
              >
                Early Warning Sentinel
              </button>
              <button
                type="button"
                onClick={() => setActiveSandboxTab('TRANSMISSION')}
                className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
                  activeSandboxTab === 'TRANSMISSION'
                    ? 'bg-[#1b2126] text-[#b8f34a] shadow-sm'
                    : 'text-[#7e888f] hover:text-[#f4f5f2]'
                }`}
              >
                Cascade Network
              </button>
              <button
                type="button"
                onClick={() => setActiveSandboxTab('CALIBRATION')}
                className={`px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
                  activeSandboxTab === 'CALIBRATION'
                    ? 'bg-[#1b2126] text-[#b8f34a] shadow-sm'
                    : 'text-[#7e888f] hover:text-[#f4f5f2]'
                }`}
              >
                Empirical Deciles
              </button>
            </div>
          </div>

          {/* TAB 1: MACRO SHOCK SIMULATOR */}
          {activeSandboxTab === 'SHOCK' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 rounded-xl border border-[#22282d] bg-[#0d1012]">
              {/* Left Selector: Signals */}
              <div className="lg:col-span-5 space-y-4">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#6e777e]">
                  1. SELECT MONITORED EXOGENOUS SHOCK
                </div>
                <div className="space-y-2">
                  {SHOCK_SIGNALS.map((sig, idx) => {
                    const isSelected = idx === selectedSignalIndex;
                    return (
                      <button
                        key={sig.id}
                        type="button"
                        onClick={() => setSelectedSignalIndex(idx)}
                        className={`w-full text-left p-3 rounded-lg border transition-all ${
                          isSelected
                            ? 'border-[#b8f34a]/60 bg-[#141a1c] shadow-[0_0_15px_rgba(184,243,74,0.08)]'
                            : 'border-[#1f2428] bg-[#101315] hover:border-[#2f373d] text-[#869197]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className={isSelected ? 'text-[#b8f34a] font-bold' : 'text-[#6f787f]'}>
                            {sig.id}
                          </span>
                          <span className="text-[#889297]">{sig.category}</span>
                        </div>
                        <div className={`text-[12px] font-semibold mt-1 ${isSelected ? 'text-[#f4f5f2]' : 'text-[#b3b9b6]'}`}>
                          {sig.name}
                        </div>
                        <div className="flex items-center gap-3 text-[10px] font-mono mt-2 text-[#7c868d]">
                          <span>Consensus: {sig.consensusProb}%</span>
                          <span>·</span>
                          <span className="text-[#b8f34a]">Exogen: {sig.exogenProb}%</span>
                          <span>·</span>
                          <span>Lead: {sig.leadTimeHours}h</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Direct Link to Signal */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => navigateTo(`/signals/${currentSignal.id}`)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#b8f34a] hover:underline"
                  >
                    <span>View Complete Signal Analytics (/signals/{currentSignal.id})</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>

              {/* Right: Dynamic Impact & Cascade Simulator */}
              <div className="lg:col-span-7 space-y-5 border-t lg:border-t-0 lg:border-l border-[#1f2428] lg:pl-6 pt-4 lg:pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#6e777e]">
                    2. SHOCK SEVERITY MULTIPLIER & STRESS TESTING
                  </div>
                  <button
                    type="button"
                    onClick={() => setShockSeverity(100)}
                    className="flex items-center gap-1 text-[10px] font-mono text-[#7b858c] hover:text-[#f4f5f2]"
                  >
                    <RotateCcw size={10} /> Reset (100%)
                  </button>
                </div>

                {/* Severity Slider */}
                <div className="space-y-2 p-4 rounded-lg border border-[#1f2428] bg-[#111417]">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-[#96a0a7]">Simulated Severity Multiplier:</span>
                    <span className="font-mono font-bold text-[#b8f34a] text-sm">{shockSeverity}%</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="180"
                    step="5"
                    value={shockSeverity}
                    onChange={(e) => setShockSeverity(Number(e.target.value))}
                    className="w-full h-1.5 bg-[#20262b] rounded-lg appearance-none cursor-pointer accent-[#b8f34a]"
                  />
                  <div className="flex justify-between text-[9px] font-mono text-[#5b646a]">
                    <span>50% (Mild Shock)</span>
                    <span>100% (Baseline Modeled)</span>
                    <span>180% (Extreme Stress Tail)</span>
                  </div>
                </div>

                {/* Dynamically Recalculated Output Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-[#23292e] bg-[#101316]">
                    <div className="text-[9px] font-mono text-[#6c757c]">SIMULATED DOWNSIDE P&L</div>
                    <div className="text-xl font-bold font-mono text-[#ff6b6b] mt-1">-${dynamicImpact}M</div>
                    <div className="text-[9px] text-[#7d878e] mt-0.5">Modeled Value-at-Risk</div>
                  </div>
                  <div className="p-3 rounded-lg border border-[#23292e] bg-[#101316]">
                    <div className="text-[9px] font-mono text-[#6c757c]">ASYMMETRIC EDGE</div>
                    <div className="text-xl font-bold font-mono text-[#b8f34a] mt-1">+{dynamicSpread} pp</div>
                    <div className="text-[9px] text-[#7d878e] mt-0.5">Exogen vs Consensus</div>
                  </div>
                  <div className="p-3 rounded-lg border border-[#23292e] bg-[#101316]">
                    <div className="text-[9px] font-mono text-[#6c757c]">PRIMARY EXPOSED UNIT</div>
                    <div className="text-xs font-semibold text-[#f4f5f2] mt-1.5 truncate">{currentSignal.primaryBU}</div>
                    <div className="text-[9px] text-[#7d878e] mt-0.5">Highest concentration</div>
                  </div>
                </div>

                {/* Transmission Hop Chain */}
                <div className="space-y-2 p-3.5 rounded-lg border border-[#1f2428] bg-[#101315]">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#6e777e]">
                    TRANSMISSION CASCADE PATH ({currentSignal.propagationHops} HOPS)
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    {currentSignal.transmissionPath.map((step, idx) => (
                      <span key={step} className="flex items-center gap-1.5">
                        <span className="rounded bg-[#171c20] border border-[#252c32] px-2 py-0.5 text-[#d0d6d3] font-mono text-[10px]">
                          {step}
                        </span>
                        {idx < currentSignal.transmissionPath.length - 1 && (
                          <ChevronRight size={12} className="text-[#515a60]" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Direct Action Buttons to Engine */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <button
                    type="button"
                    data-testid="sandbox-open-scenarios"
                    onClick={() => navigateTo('/impact/scenarios')}
                    className="flex items-center gap-1.5 rounded-lg border border-[#b8f34a]/40 bg-[#162015] px-3.5 py-2 text-[11px] font-semibold text-[#b8f34a] hover:bg-[#1d2b1c] transition-colors"
                  >
                    <SlidersHorizontal size={13} />
                    <span>Run in Full Scenario Engine (/impact/scenarios)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigateTo('/risk/propagation')}
                    className="flex items-center gap-1.5 rounded-lg border border-[#262c31] bg-[#121517] px-3.5 py-2 text-[11px] font-medium text-[#c4cac7] hover:border-[#38424a] transition-colors"
                  >
                    <GitBranch size={13} />
                    <span>Explore Propagation Graph (/risk/propagation)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: EARLY WARNING SENTINEL PREVIEW */}
          {activeSandboxTab === 'SENTINEL' && (
            <div className="p-6 rounded-xl border border-[#22282d] bg-[#0d1012] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#b8f34a]">
                    AUTOMATED THRESHOLD ESCALATION
                  </div>
                  <h3 className="text-base font-semibold text-[#f4f5f2]">
                    Active Early Warnings Monitored by the Sentinel Layer
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('/early-warnings')}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-[#b8f34a] hover:underline"
                >
                  <span>Open Full Early Warnings Command Console</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border border-[#3d2424] bg-[#191111] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-[#ff8080] border border-[#ff8080]/30 px-1.5 py-0.5 rounded">
                      CRITICAL ALERT
                    </span>
                    <span className="text-[10px] font-mono text-[#778086]">T-14.2h lead</span>
                  </div>
                  <div className="text-sm font-semibold text-[#f4f5f2]">
                    Federal Reserve Emergency Rate Shift
                  </div>
                  <p className="text-[11px] text-[#939ca2] leading-relaxed">
                    Prediction consensus jumped +24.1pp overnight to 66.1%. Triggered auto-escalation rule ER-001.
                  </p>
                  <div className="pt-2 border-t border-[#2d1b1b] flex items-center justify-between text-[11px]">
                    <span className="text-[#a4adb3]">Exposure: $18.4M</span>
                    <button
                      type="button"
                      onClick={() => navigateTo('/early-warnings/WARN-FED-RATE-CUT')}
                      className="text-[#ff8080] hover:underline font-mono text-[10px]"
                    >
                      Investigate →
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-[#3b321c] bg-[#161410] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-[#f5c76c] border border-[#f5c76c]/30 px-1.5 py-0.5 rounded">
                      ELEVATED THREAT
                    </span>
                    <span className="text-[10px] font-mono text-[#778086]">T-22.0h lead</span>
                  </div>
                  <div className="text-sm font-semibold text-[#f4f5f2]">
                    Strait of Hormuz Tanker Transit Halt
                  </div>
                  <p className="text-[11px] text-[#939ca2] leading-relaxed">
                    Naval exercise notification overlapping commercial transit corridors. Insurance premiums spiking.
                  </p>
                  <div className="pt-2 border-t border-[#292316] flex items-center justify-between text-[11px]">
                    <span className="text-[#a4adb3]">Exposure: $28.0M</span>
                    <button
                      type="button"
                      onClick={() => navigateTo('/early-warnings')}
                      className="text-[#f5c76c] hover:underline font-mono text-[10px]"
                    >
                      Investigate →
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-lg border border-[#202922] bg-[#0f1511] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-[#b8f34a] border border-[#b8f34a]/30 px-1.5 py-0.5 rounded">
                      EARLY ADVISORY
                    </span>
                    <span className="text-[10px] font-mono text-[#778086]">T-36.5h lead</span>
                  </div>
                  <div className="text-sm font-semibold text-[#f4f5f2]">
                    Taiwan Semiconductor Packaging Run
                  </div>
                  <p className="text-[11px] text-[#939ca2] leading-relaxed">
                    Lead time spreads widening across advanced automotive substrates. Early advisory broadcast.
                  </p>
                  <div className="pt-2 border-t border-[#172219] flex items-center justify-between text-[11px]">
                    <span className="text-[#a4adb3]">Exposure: $12.5M</span>
                    <button
                      type="button"
                      onClick={() => navigateTo('/early-warnings')}
                      className="text-[#b8f34a] hover:underline font-mono text-[10px]"
                    >
                      Investigate →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CASCADE NETWORK */}
          {activeSandboxTab === 'TRANSMISSION' && (
            <div className="p-6 rounded-xl border border-[#22282d] bg-[#0d1012] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#b8f34a]">
                    DYNAMIC RISK TRANSMISSION GRAPH
                  </div>
                  <h3 className="text-base font-semibold text-[#f4f5f2]">
                    Cascade Architecture: From Exogenous Shock to Corporate Balance Sheets
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('/risk-graph')}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-[#b8f34a] hover:underline"
                >
                  <span>Launch 3D Risk Graph (/risk-graph)</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-lg border border-[#273037] bg-[#121619] space-y-2">
                  <div className="text-[9px] font-mono text-[#b8f34a]">LAYER 1: SENSING</div>
                  <div className="text-sm font-bold text-[#f4f5f2]">1,248 Signals</div>
                  <div className="text-[11px] text-[#7d8890]">Polymarket, Kalshi, Metaculus feeds</div>
                </div>
                <div className="p-4 rounded-lg border border-[#273037] bg-[#121619] space-y-2">
                  <div className="text-[9px] font-mono text-[#b8f34a]">LAYER 2: CANONICAL</div>
                  <div className="text-sm font-bold text-[#f4f5f2]">Clustering</div>
                  <div className="text-[11px] text-[#7d8890]">Fellegi-Sunter 92.9% F1 linkage</div>
                </div>
                <div className="p-4 rounded-lg border border-[#273037] bg-[#121619] space-y-2">
                  <div className="text-[9px] font-mono text-[#b8f34a]">LAYER 3: NETWORK</div>
                  <div className="text-sm font-bold text-[#f4f5f2]">Transmission</div>
                  <div className="text-[11px] text-[#7d8890]">142 nodes, 384 contagion edges</div>
                </div>
                <div className="p-4 rounded-lg border border-[#273037] bg-[#121619] space-y-2">
                  <div className="text-[9px] font-mono text-[#b8f34a]">LAYER 4: IMPACT</div>
                  <div className="text-sm font-bold text-[#f4f5f2]">$12.4B Exposure</div>
                  <div className="text-[11px] text-[#7d8890]">4 JPMorgan Chase balance sheet units</div>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  type="button"
                  onClick={() => navigateTo('/risk/propagation')}
                  className="flex items-center gap-2 rounded-lg border border-[#3b454d] bg-[#171d22] px-4 py-2 text-[12px] font-semibold text-[#f4f5f2] hover:bg-[#20272d]"
                >
                  <GitBranch size={14} className="text-[#b8f34a]" />
                  <span>Inspect Propagation Transmission Chains (/risk/propagation)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: CALIBRATION & EMPIRICAL DECILES */}
          {activeSandboxTab === 'CALIBRATION' && (
            <div className="p-6 rounded-xl border border-[#22282d] bg-[#0d1012] space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#b8f34a]">
                    PROBABILITY CALIBRATION & RELIABILITY DIAGRAM
                  </div>
                  <h3 className="text-base font-semibold text-[#f4f5f2]">
                    Empirical Ground-Truth Frequency vs Model Forecasts
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => navigateTo('/calibration')}
                  className="flex items-center gap-1.5 text-[11px] font-semibold text-[#b8f34a] hover:underline"
                >
                  <span>Open Full Calibration Engine (/calibration)</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
                {[
                  { decile: '0-10%', forecast: '5.2%', observed: '4.8%', diff: '-0.4pp' },
                  { decile: '20-30%', forecast: '24.8%', observed: '25.3%', diff: '+0.5pp' },
                  { decile: '40-50%', forecast: '45.1%', observed: '43.9%', diff: '-1.2pp' },
                  { decile: '60-70%', forecast: '65.4%', observed: '67.1%', diff: '+1.7pp' },
                  { decile: '80-90%', forecast: '84.6%', observed: '81.2%', diff: '-3.4pp' },
                ].map((item) => (
                  <div key={item.decile} className="p-3 rounded-lg border border-[#22282d] bg-[#111417]">
                    <div className="text-[10px] font-mono text-[#b8f34a]">{item.decile}</div>
                    <div className="text-xs font-mono text-[#f4f5f2] mt-1">Obs: {item.observed}</div>
                    <div className="text-[9px] font-mono text-[#768188]">Pred: {item.forecast}</div>
                    <div className="text-[9px] font-mono text-[#b8f34a] mt-1">{item.diff}</div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-[12px]">
                <button
                  type="button"
                  onClick={() => navigateTo('/historical-replay')}
                  className="flex items-center gap-1.5 text-[#b8f34a] hover:underline font-semibold"
                >
                  <History size={14} />
                  <span>Launch Historical Event Replay Simulator (/historical-replay)</span>
                </button>
                <span className="text-[#404a52]">·</span>
                <button
                  type="button"
                  onClick={() => navigateTo('/validation')}
                  className="flex items-center gap-1.5 text-[#e1e6e3] hover:underline"
                >
                  <CheckCircle2 size={14} />
                  <span>View All 5 Validation Layers (/validation)</span>
                </button>
              </div>
            </div>
          )}
        </section>

        {/* SECTION 3: PLATFORM DIRECTORY & DEEP LINK MAP */}
        <section id="modules" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#1e2327] pb-4">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
                COMPLETE PLATFORM DIRECTORY
              </div>
              <h2 className="text-2xl font-bold tracking-tight text-[#f4f5f2] mt-1">
                Every Page, Engine, and Tool in EXOGEN
              </h2>
              <p className="text-[12px] text-[#838d94] mt-1">
                Directly accessible with full back-and-forth navigation and deep-link routing.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {(['All', 'Validation', 'Risk', 'Impact', 'Intelligence', 'Executive'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setModuleFilter(cat)}
                  className={`px-3 py-1 text-[11px] font-medium rounded-md transition-colors ${
                    moduleFilter === cat
                      ? 'bg-[#b8f34a] text-[#07090a] font-semibold'
                      : 'bg-[#121619] border border-[#232a2f] text-[#848e94] hover:text-[#f4f5f2]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Search modules input */}
          <div className="relative max-w-md">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#687278]" />
            <input
              type="text"
              placeholder="Filter modules by name, metric, or route..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-[#23292e] bg-[#0f1214] pl-9 pr-4 py-2 text-[12px] text-[#f4f5f2] placeholder-[#626c72] focus:border-[#b8f34a] focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#778086] hover:text-[#f4f5f2]"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Module Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredModules.map((item) => (
              <div
                key={item.id}
                onClick={() => navigateTo(item.path)}
                className="group relative cursor-pointer p-4 rounded-xl border border-[#202529] bg-[#0c0e10] hover:border-[#38434a] hover:bg-[#111417] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-2">
                    <span className="text-[#6d767d]">{item.category.toUpperCase()}</span>
                    <span className="text-[#b8f34a] border border-[#b8f34a]/30 px-1.5 py-0.5 rounded text-[9px]">
                      {item.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#f4f5f2] group-hover:text-[#b8f34a] transition-colors flex items-center justify-between">
                    <span>{item.name}</span>
                    <ArrowUpRight size={14} className="text-[#646e74] group-hover:text-[#b8f34a] transition-colors" />
                  </h3>
                  <p className="text-[11px] text-[#869096] mt-1.5 leading-relaxed">
                    {item.tagline}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#1a1f22] flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#727d84]">{item.metrics}</span>
                  <span className="text-[#8e989e] group-hover:underline">{item.path}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 4: REAL ENTITY DEEP LINK HUB (SIGNALS, CANONICAL EVENTS, BUSINESS UNITS) */}
        <section id="deep-links" className="scroll-mt-24 space-y-6">
          <div className="border-b border-[#1e2327] pb-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              DIRECT ENTITY JUMP SHOWCASE
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#f4f5f2] mt-1">
              One-Click Deep Links to Live Entities
            </h2>
            <p className="text-[12px] text-[#838d94] mt-1">
              Test back-and-forth actions directly with concrete signals, canonical events, backtest runs, and corporate business units.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Signals Card */}
            <div className="p-4 rounded-xl border border-[#202529] bg-[#0c0e10] space-y-3">
              <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-[#b8f34a]">
                <Activity size={14} />
                <span>EXOGENOUS SIGNALS</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { id: 'SIG-FED-CUT', label: 'Fed Rate Cut ≥50 bps' },
                  { id: 'SIG-EUR-GAS', label: 'European Gas Transit' },
                  { id: 'SIG-SUEZ-CANAL', label: 'Red Sea Marine Corridor' },
                  { id: 'SIG-TAIWAN-STRAIT', label: 'Taiwan Strait Wafer Transit' },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => navigateTo(`/signals/${s.id}`)}
                    className="w-full text-left p-2 rounded-lg border border-[#1b2023] bg-[#101315] hover:border-[#38434a] hover:bg-[#14191c] text-[11px] flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="font-mono text-[9px] text-[#b8f34a]">{s.id}</div>
                      <div className="font-medium text-[#d9dedc] truncate">{s.label}</div>
                    </div>
                    <ArrowRight size={12} className="text-[#687278]" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigateTo('/signals')}
                className="w-full text-center text-[10px] font-mono text-[#8a949a] hover:text-[#f4f5f2] pt-1"
              >
                View all 48 signals (/signals) →
              </button>
            </div>

            {/* Canonical Events Card */}
            <div className="p-4 rounded-xl border border-[#202529] bg-[#0c0e10] space-y-3">
              <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-[#b8f34a]">
                <Sparkles size={14} />
                <span>CANONICAL EVENTS</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { id: 'EVT-FOMC-50BPS-CUT', label: 'FOMC 50bps Emergency Cut' },
                  { id: 'EVT-HORMUZ-BLOCKADE', label: 'Strait of Hormuz Blockade' },
                  { id: 'EVT-ECB-SURPRISE-HIKE', label: 'ECB Surprise Rate Hike' },
                  { id: 'EVT-SUEZ-CORRIDOR-HAZARD', label: 'Suez Security Escalation' },
                ].map((ev) => (
                  <button
                    key={ev.id}
                    type="button"
                    onClick={() => navigateTo(`/events/${ev.id}`)}
                    className="w-full text-left p-2 rounded-lg border border-[#1b2023] bg-[#101315] hover:border-[#38434a] hover:bg-[#14191c] text-[11px] flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="font-mono text-[9px] text-[#b8f34a]">{ev.id}</div>
                      <div className="font-medium text-[#d9dedc] truncate">{ev.label}</div>
                    </div>
                    <ArrowRight size={12} className="text-[#687278]" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigateTo('/events')}
                className="w-full text-center text-[10px] font-mono text-[#8a949a] hover:text-[#f4f5f2] pt-1"
              >
                View all canonical events (/events) →
              </button>
            </div>

            {/* Business Units Card */}
            <div className="p-4 rounded-xl border border-[#202529] bg-[#0c0e10] space-y-3">
              <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-[#b8f34a]">
                <Building2 size={14} />
                <span>ENTERPRISE UNITS</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { id: 'global-markets', label: 'Global Markets & Trading', exp: '$5.4B' },
                  { id: 'commercial-banking', label: 'Commercial Banking', exp: '$3.8B' },
                  { id: 'asset-management', label: 'Asset Management', exp: '$2.1B' },
                  { id: 'consumer-banking', label: 'Consumer & Community', exp: '$1.1B' },
                ].map((bu) => (
                  <button
                    key={bu.id}
                    type="button"
                    onClick={() => navigateTo(`/exposure/business-unit/${bu.id}`)}
                    className="w-full text-left p-2 rounded-lg border border-[#1b2023] bg-[#101315] hover:border-[#38434a] hover:bg-[#14191c] text-[11px] flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="font-medium text-[#d9dedc] truncate">{bu.label}</div>
                      <div className="font-mono text-[9px] text-[#818b91]">Modeled Exp: {bu.exp}</div>
                    </div>
                    <ArrowRight size={12} className="text-[#687278]" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigateTo('/exposure')}
                className="w-full text-center text-[10px] font-mono text-[#8a949a] hover:text-[#f4f5f2] pt-1"
              >
                View company exposure (/exposure) →
              </button>
            </div>

            {/* Historical Backtests Card */}
            <div className="p-4 rounded-xl border border-[#202529] bg-[#0c0e10] space-y-3">
              <div className="flex items-center gap-2 text-[11px] font-mono font-semibold text-[#b8f34a]">
                <History size={14} />
                <span>AUDITED BACKTESTS</span>
              </div>
              <div className="space-y-1.5">
                {[
                  { id: 'BT-2024-Q3-SYSTEMIC', label: '2024 Q3 Systemic Macro Shock', type: 'Multi-Factor' },
                  { id: 'BT-2024-Q2-MACRO', label: '2024 Q2 Yield Curve Inversion', type: 'Rates Shock' },
                  { id: 'BT-2024-Q1-GEOPOLITICS', label: '2024 Q1 Maritime Blockade', type: 'Freight Spike' },
                  { id: 'BT-2023-Q4-ENERGY', label: '2023 Q4 Gas Storage Squeeze', type: 'Energy Vol' },
                ].map((bt) => (
                  <button
                    key={bt.id}
                    type="button"
                    onClick={() => navigateTo(`/backtesting/${bt.id}`)}
                    className="w-full text-left p-2 rounded-lg border border-[#1b2023] bg-[#101315] hover:border-[#38434a] hover:bg-[#14191c] text-[11px] flex items-center justify-between transition-all"
                  >
                    <div>
                      <div className="font-mono text-[9px] text-[#b8f34a]">{bt.id}</div>
                      <div className="font-medium text-[#d9dedc] truncate">{bt.label}</div>
                    </div>
                    <ArrowRight size={12} className="text-[#687278]" />
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigateTo('/backtesting')}
                className="w-full text-center text-[10px] font-mono text-[#8a949a] hover:text-[#f4f5f2] pt-1"
              >
                View backtest registry (/backtesting) →
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 5: FIVE-LAYER ARCHITECTURE */}
        <section id="architecture" className="scroll-mt-24 space-y-6">
          <div className="border-b border-[#1e2327] pb-4">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              ENGINE ARCHITECTURE
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-[#f4f5f2] mt-1">
              Deterministic 5-Layer End-to-End Pipeline
            </h2>
            <p className="text-[12px] text-[#838d94] mt-1">
              Zero lookahead bias. Every prediction timestamped, matched, propagated, and backtested against official settlements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="p-4 rounded-xl border border-[#202529] bg-[#0c0e10] space-y-2">
              <div className="text-[10px] font-mono text-[#b8f34a]">LAYER 1</div>
              <h3 className="text-sm font-semibold text-[#f4f5f2]">Prediction Markets Ingestion</h3>
              <p className="text-[11px] text-[#848e95] leading-relaxed">
                Ingests Polymarket, Kalshi, and Metaculus contracts with volume-weighted liquidity checks and spread calibration.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#202529] bg-[#0c0e10] space-y-2">
              <div className="text-[10px] font-mono text-[#b8f34a]">LAYER 2</div>
              <h3 className="text-sm font-semibold text-[#f4f5f2]">Canonical Matching Engine</h3>
              <p className="text-[11px] text-[#848e95] leading-relaxed">
                Fellegi-Sunter pairwise linkage clusters raw speculative bets into deduplicated canonical events (92.9% F1 score).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#202529] bg-[#0c0e10] space-y-2">
              <div className="text-[10px] font-mono text-[#b8f34a]">LAYER 3</div>
              <h3 className="text-sm font-semibold text-[#f4f5f2]">Knowledge Graph Propagation</h3>
              <p className="text-[11px] text-[#848e95] leading-relaxed">
                142 enterprise entities and 384 transmission edges quantify multi-hop shock cascades across supply chains and sectors.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#202529] bg-[#0c0e10] space-y-2">
              <div className="text-[10px] font-mono text-[#b8f34a]">LAYER 4</div>
              <h3 className="text-sm font-semibold text-[#f4f5f2]">Dollar Impact & Balance Sheet</h3>
              <p className="text-[11px] text-[#848e95] leading-relaxed">
                Translates transmission shocks to corporate balance sheets, revenue margins, credit default risk, and Value-at-Risk.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-[#202529] bg-[#0c0e10] space-y-2">
              <div className="text-[10px] font-mono text-[#b8f34a]">LAYER 5</div>
              <h3 className="text-sm font-semibold text-[#f4f5f2]">Empirical Backtesting Engine</h3>
              <p className="text-[11px] text-[#848e95] leading-relaxed">
                Walk-forward out-of-sample audits evaluate Brier scores (0.142), calibration error (7.1%), and early warning lead times.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 6: INSTITUTIONAL GOVERNANCE & COMPLIANCE */}
        <section className="p-8 rounded-2xl border border-[#202529] bg-gradient-to-b from-[#0f1215] to-[#0a0c0e] space-y-6">
          <div className="max-w-2xl">
            <div className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              INSTITUTIONAL TRUST & GOVERNANCE
            </div>
            <h2 className="text-xl font-bold tracking-tight text-[#f4f5f2] mt-1">
              Built for Enterprise Risk Committees & Treasury Operations
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#14191d] border border-[#232a30] text-[#b8f34a]">
                <ShieldCheck size={18} />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#f4f5f2]">SR 11-7 Model Risk Governance</div>
                <div className="text-[11px] text-[#838d94] mt-1 leading-relaxed">
                  Rigorous conceptual soundness, ongoing monitoring, and out-of-sample verification for Tier-1 banks.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#14191d] border border-[#232a30] text-[#b8f34a]">
                <Lock size={18} />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#f4f5f2]">Deterministic Audit Trails</div>
                <div className="text-[11px] text-[#838d94] mt-1 leading-relaxed">
                  Every backtest run, warning trigger, and risk score is permanently versioned with dataset hashes.
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#14191d] border border-[#232a30] text-[#b8f34a]">
                <Database size={18} />
              </div>
              <div>
                <div className="text-xs font-semibold text-[#f4f5f2]">Air-Gapped & Enterprise Connectors</div>
                <div className="text-[11px] text-[#838d94] mt-1 leading-relaxed">
                  Seamless integration with internal ERPs, Bloomberg AIM, Aladdin, and corporate treasury systems.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="text-center py-12 space-y-5 border-t border-[#1e2327]">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#f4f5f2]">
            Ready to Explore the Live Risk Terminal?
          </h2>
          <p className="text-[13px] text-[#899399] max-w-xl mx-auto">
            Switch between the EXOGEN entry interface and the interactive risk intelligence terminal with zero friction.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              type="button"
              data-testid="bottom-launch-terminal"
              onClick={() => navigateTo('/overview')}
              className="flex items-center gap-2 rounded-lg bg-[#b8f34a] px-6 py-3 text-[13px] font-semibold text-[#070809] shadow-[0_0_25px_rgba(184,243,74,0.25)] hover:bg-[#cbfb69] transition-all"
            >
              <Terminal size={15} />
              <span>Launch Enterprise Platform (/overview)</span>
              <ArrowRight size={15} />
            </button>

            <button
              type="button"
              onClick={() => navigateTo('/validation')}
              className="flex items-center gap-2 rounded-lg border border-[#272f34] bg-[#101416] px-5 py-3 text-[13px] font-medium text-[#dce1de] hover:border-[#3d4850] transition-colors"
            >
              <CheckCircle2 size={15} className="text-[#b8f34a]" />
              <span>Model Validation Scorecard (/validation)</span>
            </button>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[#1a1f22] bg-[#070809] py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1440px] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-[4px] border border-[#b8f34a]/30 bg-[#b8f34a]/10">
              <span className="h-2 w-2 rotate-45 border-[1.5px] border-[#b8f34a]" />
            </div>
            <span className="text-[13px] font-bold tracking-[.2em] text-[#f4f5f2]">EXOGEN RISK INTELLIGENCE</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[11px] text-[#717c82]">
            <a href="#overview" className="hover:text-[#f4f5f2]">Overview</a>
            <a href="#sandbox" className="hover:text-[#f4f5f2]">Sandbox</a>
            <a href="#modules" className="hover:text-[#f4f5f2]">All Modules</a>
            <a href="#deep-links" className="hover:text-[#f4f5f2]">Entity Directory</a>
            <a href="#architecture" className="hover:text-[#f4f5f2]">Architecture</a>
            <button type="button" onClick={() => navigateTo('/overview')} className="text-[#b8f34a] hover:underline font-mono">
              Launch Terminal →
            </button>
          </div>

          <div className="text-[10px] font-mono text-[#5b656b]">
            © 2026 EXOGEN RISK INTELLIGENCE · JPMORGAN CHASE DEMO
          </div>
        </div>
      </footer>

      {/* Global Search Modal */}
      <GlobalSearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
