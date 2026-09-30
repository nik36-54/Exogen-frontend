import { CheckCircle2, X, Activity, ShieldCheck, Clock } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function SystemMonitoringStatusModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  const subsystems = [
    { name: 'Signal Ingestion (Polymarket & Kalshi)', status: 'Healthy', latency: '320ms', note: 'Continuous normalized poll active' },
    { name: 'Canonical Event Matching', status: 'Healthy', latency: '410ms', note: 'Fellegi-Sunter pair linkage engine operating' },
    { name: 'Risk Taxonomy & Causal Mapping', status: 'Healthy', latency: '190ms', note: '6 primary risk categories aligned' },
    { name: 'Company Exposure Models', status: 'Healthy', latency: '540ms', note: 'JPMorgan Chase balance sheet EXP-00072 active' },
    { name: 'Early Warning Sentinel Engine', status: 'Healthy', latency: '120ms', note: '8 automated threshold rules evaluating' },
  ];

  return (
    <div
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in-0 duration-150"
    >
      <div className="w-full max-w-lg rounded-xl border border-[#24282c] bg-[#111416] p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-[#24282c] pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#b8f34a] animate-pulse" />
            <h2 className="text-sm font-semibold tracking-wide text-[#f5f5f2]">
              EXOGEN SYSTEM MONITORING STATUS
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded p-1 text-[#92989e] hover:bg-[#1e2225] hover:text-[#f5f5f2]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-[#171a1d] px-3.5 py-2 border border-[#24282c] text-xs font-mono">
          <span className="text-[#92989e]">LAST SUCCESSFUL SYNC</span>
          <span className="font-semibold text-[#b8f34a]">09:31:42 UTC (42 sec ago)</span>
        </div>

        <div className="space-y-2.5">
          {subsystems.map((sub) => (
            <div
              key={sub.name}
              className="rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-xs flex items-center justify-between"
            >
              <div>
                <div className="font-medium text-[#f5f5f2]">{sub.name}</div>
                <div className="mt-0.5 text-[11px] text-[#92989e]">{sub.note}</div>
              </div>

              <div className="text-right shrink-0">
                <span className="inline-flex items-center gap-1 rounded bg-[#b8f34a]/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[#b8f34a]">
                  <CheckCircle2 className="h-3 w-3" />
                  {sub.status}
                </span>
                <div className="mt-1 text-[10px] font-mono text-[#656b70]">{sub.latency}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-[#24282c] pt-3 text-[11px] text-[#656b70] flex items-center justify-between">
          <span>Illustrative system health monitor.</span>
          <button
            onClick={onClose}
            className="rounded border border-[#24282c] bg-[#171a1d] px-3 py-1.5 text-xs text-[#f5f5f2] hover:bg-[#1e2225]"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
