import { useState } from 'react';
import { Clock, TrendingUp, Sparkles, Filter } from 'lucide-react';

interface Props {
  eventId?: string;
}

export function ChangeTimelineView({ eventId = 'CE-000184' }: Props) {
  const [metric, setMetric] = useState<'PROB' | 'SCORE' | 'EXP' | 'IMPACT'>('PROB');

  const timelineData = {
    PROB: [
      { time: '10:02 UTC', value: '66.1%', delta: '+5.1pp', note: 'Kalshi afternoon institutional bloc volume' },
      { time: '09:48 UTC', value: '61.0%', delta: '+6.0pp', note: 'Post-PCE consensus cross-venue consolidation' },
      { time: '09:31 UTC', value: '55.0%', delta: '+6.0pp', note: 'European session close repositioning' },
      { time: '09:14 UTC', value: '49.0%', delta: '+7.0pp', note: 'Initial headline release reaction spike' },
      { time: '09:02 UTC', value: '42.0%', delta: 'Base', note: 'Pre-release morning benchmark baseline' },
    ],
    SCORE: [
      { time: '10:02 UTC', value: '78 / 100', delta: '+4 pts', note: 'Entered HIGH risk classification tier' },
      { time: '09:48 UTC', value: '74 / 100', delta: '+5 pts', note: 'Transmission velocity adjustment' },
      { time: '09:31 UTC', value: '69 / 100', delta: '+8 pts', note: 'Exposure mapping upward calibration' },
      { time: '09:14 UTC', value: '61 / 100', delta: '+10 pts', note: 'Probability acceleration factor' },
      { time: '09:02 UTC', value: '51 / 100', delta: 'Base', note: 'Baseline moderate risk rating' },
    ],
    EXP: [
      { time: '10:02 UTC', value: '$27.8M', delta: '+$5.0M', note: 'Markets fixed-income portfolio added' },
      { time: '09:48 UTC', value: '$22.8M', delta: '+$4.2M', note: 'Refinancing duration expansion' },
      { time: '09:31 UTC', value: '$18.6M', delta: '+$2.4M', note: 'Commercial Banking credit facility renewal' },
      { time: '09:02 UTC', value: '$14.2M', delta: 'Base', note: 'Baseline direct credit exposure' },
    ],
    IMPACT: [
      { time: '10:02 UTC', value: '$18.4M', delta: '+$3.6M', note: 'Downside scenario magnitude 65%' },
      { time: '09:48 UTC', value: '$14.8M', delta: '+$3.8M', note: 'Second-order transmission effect' },
      { time: '09:31 UTC', value: '$11.0M', delta: '+$3.0M', note: 'Spread contraction elasticity adjustment' },
      { time: '09:02 UTC', value: '$8.0M', delta: 'Base', note: 'Initial base case modeled loss' },
    ],
  };

  const currentPoints = timelineData[metric];

  return (
    <div className="rounded-xl border border-[#24282c] bg-[#111416] p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#24282c] pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#92989e]">
            CHANGE DETECTION LOG
          </span>
          <h3 className="mt-0.5 text-base font-semibold text-[#f5f5f2]">
            Change Detection Timeline
          </h3>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center rounded-lg border border-[#24282c] bg-[#0a0a0b] p-0.5 text-xs font-mono">
          {(['PROB', 'SCORE', 'EXP', 'IMPACT'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMetric(m)}
              className={`px-3 py-1 rounded-md transition ${
                metric === m
                  ? 'bg-[#171a1d] text-[#f5f5f2] font-semibold'
                  : 'text-[#92989e] hover:text-[#f5f5f2]'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {currentPoints.map((pt, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between gap-3 rounded-lg border border-[#24282c] bg-[#171a1d] p-3 text-xs"
          >
            <div className="flex items-start gap-3">
              <span className="font-mono text-[11px] font-bold text-[#b8f34a] pt-0.5 shrink-0">
                {pt.time}
              </span>
              <div>
                <div className="font-semibold text-[#f5f5f2]">{pt.note}</div>
                <div className="mt-0.5 text-[10px] text-[#656b70]">Detected by Automated Ingestion Sentinel</div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="font-mono font-bold text-sm text-[#f5f5f2]">{pt.value}</div>
              <div className="text-[10px] font-mono text-[#ff5c5c] font-medium">{pt.delta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
