import { useEffect, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { useLocation, Router as WouterRouter } from 'wouter';
import { ExogenShell } from '@/components/layout/ExogenShell';
import Overview from '@/pages/Overview';
import Signals from '@/pages/Signals';
import SignalDetailPage, {
  SignalDetailError,
  SignalDetailLoadingSkeleton,
} from '@/pages/SignalDetailPage';
import CanonicalEventsPage from '@/pages/CanonicalEventsPage';
import CanonicalEventDetailPage from '@/pages/CanonicalEventDetailPage';
import MatchingPage from '@/pages/MatchingPage';
import DataQualityPage from '@/pages/DataQualityPage';
import RiskOverviewPage from '@/pages/RiskOverviewPage';
import RiskSignalDetailPage from '@/pages/RiskSignalDetailPage';
import RiskTaxonomyPage from '@/pages/RiskTaxonomyPage';
import RiskRelationshipsPage from '@/pages/RiskRelationshipsPage';
import RiskTransmissionPage from '@/pages/RiskTransmissionPage';
import CompanyExposurePage from '@/pages/CompanyExposurePage';
import BusinessUnitDetailPage from '@/pages/BusinessUnitDetailPage';
import RiskGraphPage from '@/pages/RiskGraphPage';
import RiskScoresOverviewPage from '@/pages/RiskScoresOverviewPage';
import RiskScoreDetailPage from '@/pages/RiskScoreDetailPage';
import DollarImpactOverviewPage from '@/pages/DollarImpactOverviewPage';
import DollarImpactDetailPage from '@/pages/DollarImpactDetailPage';
import ScenarioEnginePage from '@/pages/ScenarioEnginePage';
import ImpactAggregationPage from '@/pages/ImpactAggregationPage';
import ExecutiveMonitoringPage from '@/pages/ExecutiveMonitoringPage';
import EarlyWarningsPage from '@/pages/EarlyWarningsPage';
import EarlyWarningDetailPage from '@/pages/EarlyWarningDetailPage';
import RiskPropagationPage from '@/pages/RiskPropagationPage';
import WatchlistPage from '@/pages/WatchlistPage';
import AlertsPage from '@/pages/AlertsPage';
import ValidationOverviewPage from '@/pages/ValidationOverviewPage';
import BacktestingPage from '@/pages/BacktestingPage';
import BacktestDetailPage from '@/pages/BacktestDetailPage';
import ProbabilityCalibrationPage from '@/pages/ProbabilityCalibrationPage';
import HistoricalReplayPage from '@/pages/HistoricalReplayPage';
import ModelPerformancePage from '@/pages/ModelPerformancePage';
import EarlyWarningValidationPage from '@/pages/EarlyWarningValidationPage';
import RiskScoreValidationPage from '@/pages/RiskScoreValidationPage';
import MatchingValidationPage from '@/pages/MatchingValidationPage';
import PropagationValidationPage from '@/pages/PropagationValidationPage';
import ImpactValidationPage from '@/pages/ImpactValidationPage';
import HistoricalEventDetailPage from '@/pages/HistoricalEventDetailPage';
import { getIntelligenceScenario } from '@/data/intelligence';
import type { IntelligenceScenario } from '@/types/intelligence';

const queryClient = new QueryClient();

function Router() {
  const [location, setLocation] = useLocation();
  useEffect(() => {
    if (location === '/') setLocation('/overview');
  }, [location, setLocation]);

  const signalMatch = location.match(/^\/signals\/([^/]+)$/);
  const signalId = signalMatch ? decodeURIComponent(signalMatch[1]) : null;
  const scenario = signalId ? getIntelligenceScenario(signalId) : undefined;

  const eventDetailMatch = location.match(/^\/events\/([^/]+)$/);
  const eventId = eventDetailMatch ? decodeURIComponent(eventDetailMatch[1]) : null;

  const riskScoreMatch = location.match(/^\/risk\/scores\/([^/]+)$/);
  const riskScoreId = riskScoreMatch ? decodeURIComponent(riskScoreMatch[1]) : null;

  const propagationMatch = location.match(/^\/risk\/propagation(?:\/([^/]+))?$/);
  const propagationId = propagationMatch && propagationMatch[1] ? decodeURIComponent(propagationMatch[1]) : null;
  const isPropagationRoute = location.startsWith('/risk/propagation');

  const earlyWarningDetailMatch = location.match(/^\/(?:early-warnings|warnings)\/([^/]+)$/);
  const earlyWarningId = earlyWarningDetailMatch ? decodeURIComponent(earlyWarningDetailMatch[1]) : null;
  const earlyWarningsRoute = location === '/early-warnings' || location === '/warnings';

  const impactDetailMatch = location.match(/^\/impact\/([^/]+)$/);
  const rawImpactId = impactDetailMatch ? decodeURIComponent(impactDetailMatch[1]) : null;
  const isSpecialImpactSubroute = rawImpactId === 'scenarios' || rawImpactId === 'aggregation';
  const impactId = !isSpecialImpactSubroute ? rawImpactId : null;

  const riskDetailMatch = location.match(/^\/risk\/([^/]+)$/);
  const rawRiskId = riskDetailMatch ? decodeURIComponent(riskDetailMatch[1]) : null;
  const isSpecialRiskSubroute =
    rawRiskId === 'taxonomy' ||
    rawRiskId === 'relationships' ||
    rawRiskId === 'transmission' ||
    rawRiskId === 'scores' ||
    rawRiskId === 'calibration' ||
    rawRiskId === 'propagation';
  const riskId = !isSpecialRiskSubroute ? rawRiskId : null;

  const businessUnitMatch = location.match(/^\/exposure\/business-unit\/([^/]+)$/);
  const unitId = businessUnitMatch ? decodeURIComponent(businessUnitMatch[1]) : null;

  const backtestEventMatch = location.match(/^\/backtesting\/events\/([^/]+)$/);
  const backtestEventId = backtestEventMatch ? decodeURIComponent(backtestEventMatch[1]) : null;

  const backtestRunMatch = location.match(/^\/backtesting\/([^/]+)$/);
  const rawBacktestRunId = backtestRunMatch ? decodeURIComponent(backtestRunMatch[1]) : null;
  const isSpecialBacktestSubroute =
    rawBacktestRunId === 'runs' ||
    rawBacktestRunId === 'warnings' ||
    rawBacktestRunId === 'risk-scores' ||
    rawBacktestRunId === 'matching' ||
    rawBacktestRunId === 'propagation' ||
    rawBacktestRunId === 'impact' ||
    rawBacktestRunId === 'events';
  const backtestRunId = !isSpecialBacktestSubroute ? rawBacktestRunId : null;

  const overviewRoute = location === '/' || location === '/overview';
  const monitoringRoute = location === '/monitoring' || location === '/executive';
  const signalsRoute = location === '/signals';
  const eventsRoute = location === '/events';
  const matchingRoute = location === '/matching';
  const dataQualityRoute = location === '/data-quality';

  const riskRoute = location === '/risk';
  const riskScoresRoute = location === '/risk/scores';
  const riskTaxonomyRoute = location === '/risk/taxonomy';
  const riskRelationshipsRoute = location === '/risk/relationships';
  const riskTransmissionRoute = location === '/risk/transmission';

  const impactRoute = location === '/impact';
  const impactScenariosRoute = location === '/impact/scenarios';
  const impactAggregationRoute = location === '/impact/aggregation';

  const watchlistRoute = location === '/watchlist' || location === '/watchlists';
  const alertsRoute = location === '/alerts';
  const exposureRoute = location === '/exposure';
  const riskGraphRoute = location === '/risk-graph';

  // Validation layer routes (Prompt 7)
  const validationRoute = location === '/validation';
  const calibrationRoute = location === '/calibration';
  const historicalReplayRoute = location === '/historical-replay';
  const modelPerformanceRoute = location === '/model-performance';
  const backtestWarningsRoute = location === '/backtesting/warnings';
  const backtestRiskScoresRoute = location === '/backtesting/risk-scores';
  const backtestMatchingRoute = location === '/backtesting/matching';
  const backtestPropagationRoute = location === '/backtesting/propagation';
  const backtestImpactRoute = location === '/backtesting/impact';
  const backtestOverviewRoute = location === '/backtesting' || location === '/backtesting/runs';

  let page: ReactNode;

  if (overviewRoute) {
    page = <Overview />;
  } else if (validationRoute) {
    page = <ValidationOverviewPage />;
  } else if (calibrationRoute) {
    page = <ProbabilityCalibrationPage />;
  } else if (historicalReplayRoute) {
    page = <HistoricalReplayPage />;
  } else if (modelPerformanceRoute) {
    page = <ModelPerformancePage />;
  } else if (backtestWarningsRoute) {
    page = <EarlyWarningValidationPage />;
  } else if (backtestRiskScoresRoute) {
    page = <RiskScoreValidationPage />;
  } else if (backtestMatchingRoute) {
    page = <MatchingValidationPage />;
  } else if (backtestPropagationRoute) {
    page = <PropagationValidationPage />;
  } else if (backtestImpactRoute) {
    page = <ImpactValidationPage />;
  } else if (backtestEventId) {
    page = <HistoricalEventDetailPage eventId={backtestEventId} />;
  } else if (backtestRunId) {
    page = <BacktestDetailPage runId={backtestRunId} />;
  } else if (backtestOverviewRoute) {
    page = <BacktestingPage />;
  } else if (monitoringRoute) {
    page = <ExecutiveMonitoringPage />;
  } else if (earlyWarningId) {
    page = <EarlyWarningDetailPage warningId={earlyWarningId} />;
  } else if (earlyWarningsRoute) {
    page = <EarlyWarningsPage />;
  } else if (isPropagationRoute) {
    page = <RiskPropagationPage propagationId={propagationId || undefined} />;
  } else if (watchlistRoute) {
    page = <WatchlistPage />;
  } else if (alertsRoute) {
    page = <AlertsPage />;
  } else if (signalsRoute) {
    page = <Signals />;
  } else if (signalId) {
    page = (
      <SignalDetailRoute
        key={signalId}
        signalId={signalId}
        initialScenario={scenario}
        onScenarioChange={(id) => setLocation(`/signals/${encodeURIComponent(id)}`)}
        onBack={() => setLocation('/signals')}
      />
    );
  } else if (eventsRoute) {
    page = <CanonicalEventsPage />;
  } else if (eventId) {
    page = <CanonicalEventDetailPage eventId={eventId} />;
  } else if (matchingRoute) {
    page = <MatchingPage />;
  } else if (dataQualityRoute) {
    page = <DataQualityPage />;
  } else if (riskScoresRoute) {
    page = <RiskScoresOverviewPage />;
  } else if (riskScoreId) {
    page = <RiskScoreDetailPage riskId={riskScoreId} />;
  } else if (impactScenariosRoute) {
    page = <ScenarioEnginePage />;
  } else if (impactAggregationRoute) {
    page = <ImpactAggregationPage />;
  } else if (impactId) {
    page = <DollarImpactDetailPage impactId={impactId} />;
  } else if (impactRoute) {
    page = <DollarImpactOverviewPage />;
  } else if (riskRoute) {
    page = <RiskOverviewPage />;
  } else if (riskTaxonomyRoute) {
    page = <RiskTaxonomyPage />;
  } else if (riskRelationshipsRoute) {
    page = <RiskRelationshipsPage />;
  } else if (riskTransmissionRoute) {
    page = <RiskTransmissionPage />;
  } else if (riskId) {
    page = <RiskSignalDetailPage riskId={riskId} />;
  } else if (exposureRoute) {
    page = <CompanyExposurePage />;
  } else if (unitId) {
    page = <BusinessUnitDetailPage unitId={unitId} />;
  } else if (riskGraphRoute) {
    page = <RiskGraphPage />;
  } else {
    page = <DeferredWorkspaceView onBack={() => setLocation('/overview')} />;
  }

  return (
    <RoutedErrorBoundary>
      <ExogenShell>
        {page}
      </ExogenShell>
    </RoutedErrorBoundary>
  );
}

function SignalDetailRoute({
  signalId,
  initialScenario,
  onScenarioChange,
  onBack,
}: {
  signalId: string;
  initialScenario?: IntelligenceScenario;
  onScenarioChange: (signalId: string) => void;
  onBack: () => void;
}) {
  const [attempt, setAttempt] = useState(0);
  const [scenario, setScenario] = useState<IntelligenceScenario | undefined>(undefined);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setScenario(undefined);
    const timer = window.setTimeout(() => {
      if (!active) return;
      const result = initialScenario ?? getIntelligenceScenario(signalId);
      if (result) {
        setScenario(result);
        setStatus('ready');
      } else {
        setStatus('error');
      }
    }, 140);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [attempt, initialScenario, signalId]);

  if (status === 'loading') return <SignalDetailLoadingSkeleton />;
  if (status === 'error' || !scenario) {
    return (
      <SignalDetailError
        title="SIGNAL NOT FOUND"
        message={`No bundled intelligence scenario matches “${signalId}”. Choose one of the available demo signals to continue.`}
        onRetry={() => setAttempt((current) => current + 1)}
        onBack={onBack}
      />
    );
  }
  return <SignalDetailPage scenario={scenario} onScenarioChange={onScenarioChange} />;
}

function DeferredWorkspaceView({ onBack }: { onBack: () => void }) {
  const [location] = useLocation();
  const labels: Record<string, string> = {
    '/verification': 'Verification',
    '/settings': 'Settings',
  };
  const label = labels[location];
  if (!label) return <NotFound />;
  return (
    <section className="panel mx-auto mt-10 max-w-[620px] p-7 sm:p-9">
      <div className="mb-5 text-[9px] font-semibold tracking-[.16em] text-[#b8f34a]">EXOGEN · ENTERPRISE WORKSPACE</div>
      <h1 className="text-[23px] font-medium tracking-[-.04em] text-[#f2f3ef]">{label}</h1>
      <p className="mt-3 max-w-[440px] text-[12px] leading-6 text-[#8d969b]">This workspace destination is configured with enterprise defaults. The Executive Monitoring Center, Early Warnings, Alert Sentinels, Risk Scores, and Scenario Simulation are active in live sensing mode.</p>
      <button type="button" data-testid="return-to-overview" onClick={onBack} className="mt-7 inline-flex items-center rounded border border-[#3b4440] bg-[#b8f34a]/[.08] px-3 py-2 text-[10px] font-medium text-[#c6f574] transition-colors hover:bg-[#b8f34a]/[.14]">Return to Overview</button>
    </section>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
