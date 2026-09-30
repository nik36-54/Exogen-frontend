import { useState } from 'react';
import { useLocation } from 'wouter';
import {
  GitBranch,
  ArrowRight,
  Clock,
  ShieldAlert,
  Sparkles,
  Network,
  BriefcaseBusiness,
  DollarSign,
  Search,
} from 'lucide-react';
import { primaryFedPropagationRecord } from '@/data/monitoring-intelligence-data';
import { PropagationTimelineView } from '@/components/monitoring/PropagationTimelineView';

interface Props {
  propagationId?: string;
}

export default function RiskPropagationPage({ propagationId }: Props = {}) {
  const [, setLocation] = useLocation();
  const [activeEvent, setActiveEvent] = useState<'FED' | 'OIL' | 'GSIB'>(() => {
    if (propagationId?.toUpperCase().includes('OIL')) return 'OIL';
    if (propagationId?.toUpperCase().includes('GSIB')) return 'GSIB';
    return 'FED';
  });

  return (
    <div className="mx-auto max-w-[1400px] space-y-7 p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#24282c] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#b8f34a]">
              RISK INTELLIGENCE · TRANSMISSION & VELOCITY
            </span>
            <span className="rounded bg-[#171a1d] px-1.5 py-0.5 text-[9px] font-mono text-[#92989e] border border-[#24282c]">
              NETWORK MODEL
            </span>
          </div>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-[#f5f5f2] sm:text-3xl">
            Risk Propagation
          </h1>
          <p className="mt-1 text-sm text-[#92989e] max-w-3xl leading-relaxed">
            See how external events move through risks, business units, exposures, and financial consequences.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setLocation('/risk-graph')}
            className="flex items-center gap-1.5 rounded-lg border border-[#24282c] bg-[#171a1d] px-3.5 py-2 text-xs font-medium text-[#f5f5f2] hover:border-[#b8f34a]/60 hover:text-[#b8f34a] transition"
          >
            <Network className="h-3.5 w-3.5 text-[#b8f34a]" />
            Full Risk Graph →
          </button>
        </div>
      </div>

      {/* Event Selector Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#f5f5f2]">Active Event Propagation:</span>
          <div className="flex items-center rounded-lg border border-[#24282c] bg-[#0a0a0b] p-0.5 text-xs font-mono">
            <button
              onClick={() => setActiveEvent('FED')}
              className={`px-3 py-1 rounded-md transition ${
                activeEvent === 'FED' ? 'bg-[#171a1d] text-[#b8f34a] font-bold' : 'text-[#92989e]'
              }`}
            >
              Fed Rate Cut ≥50bps
            </button>
            <button
              onClick={() => setActiveEvent('OIL')}
              className={`px-3 py-1 rounded-md transition ${
                activeEvent === 'OIL' ? 'bg-[#171a1d] text-[#b8f34a] font-bold' : 'text-[#92989e]'
              }`}
            >
              Crude Oil &gt;$120
            </button>
            <button
              onClick={() => setActiveEvent('GSIB')}
              className={`px-3 py-1 rounded-md transition ${
                activeEvent === 'GSIB' ? 'bg-[#171a1d] text-[#b8f34a] font-bold' : 'text-[#92989e]'
              }`}
            >
              G-SIB Capital Rule
            </button>
          </div>
        </div>

        <div className="text-[11px] font-mono text-[#656b70]">
          ID: {primaryFedPropagationRecord.id}
        </div>
      </div>

      {/* Main Propagation Timeline Component */}
      <PropagationTimelineView record={primaryFedPropagationRecord} />
    </div>
  );
}
