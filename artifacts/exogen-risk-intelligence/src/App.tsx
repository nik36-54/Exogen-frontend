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
  const overviewRoute = location === '/' || location === '/overview';
  const signalsRoute = location === '/signals';

  let page = overviewRoute
    ? <Overview />
    : signalsRoute
      ? <Signals />
        : signalId
          ? <SignalDetailRoute
              key={signalId}
              signalId={signalId}
              initialScenario={scenario}
              onScenarioChange={(id) => setLocation(`/signals/${encodeURIComponent(id)}`)}
              onBack={() => setLocation('/signals')}
            />
          : <DeferredWorkspaceView onBack={() => setLocation('/overview')} />;

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
    '/signals': 'Signals', '/events': 'Canonical Events', '/risk': 'Risk',
    '/exposure': 'Exposure', '/impact': 'Impact', '/risk-graph': 'Risk Graph',
    '/warnings': 'Early Warnings', '/watchlist': 'Watchlist', '/data-quality': 'Data Quality',
    '/matching': 'Matching', '/backtesting': 'Backtesting', '/verification': 'Verification',
    '/settings': 'Settings',
  };
  const label = labels[location];
  if (!label) return <NotFound />;
  return (
    <section className="panel mx-auto mt-10 max-w-[620px] p-7 sm:p-9">
      <div className="mb-5 text-[9px] font-semibold tracking-[.16em] text-[#b8f34a]">EXOGEN · PHASE ONE</div>
      <h1 className="text-[23px] font-medium tracking-[-.04em] text-[#f2f3ef]">{label}</h1>
      <p className="mt-3 max-w-[440px] text-[12px] leading-6 text-[#8d969b]">This workspace destination is reserved for a later product phase. The executive Overview is the active demonstration experience.</p>
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
