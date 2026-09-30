import { intelligenceScenarios } from './intelligence';
import type { RiskLevel } from '../components/overview/Status';

export type EventRecord = {
  id: string;
  signalId: string;
  title: string;
  category: string;
  probability: string;
  previousProbability: string;
  exposure: string;
  previousExposure: string;
  risk: RiskLevel;
  age: string;
  change30d: string;
  sources: string[];
  confidence: RiskLevel;
};

export const eventRecords: EventRecord[] = intelligenceScenarios.map((scenario) => ({
  id: scenario.signal.eventId,
  signalId: scenario.signal.id,
  title: scenario.signal.title,
  category: scenario.signal.category,
  probability: `${scenario.signal.probabilityPct.toFixed(1)}%`,
  previousProbability: `${(scenario.signal.probabilityPct - scenario.signal.change30dPp).toFixed(1)}%`,
  exposure: `$${scenario.impact.downsideUsdM.toFixed(1)}M`,
  previousExposure: `$${Math.max(scenario.impact.baseUsdM, scenario.impact.downsideUsdM - 2.6).toFixed(1)}M`,
  risk: scenario.signal.riskLevel,
  age: scenario.signal.freshness,
  change30d: `+${scenario.signal.change30dPp.toFixed(1)} pp`,
  sources: scenario.contracts.map((contract) => contract.venue.toUpperCase()),
  confidence: scenario.consensus.confidence as RiskLevel,
}));

export const exposureBreakdown = [
  { label: 'Supply Chain', value: '$7.8M', width: '100%', color: '#b8f34a' },
  { label: 'Revenue', value: '$4.9M', width: '63%', color: '#899294' },
  { label: 'Credit', value: '$2.7M', width: '35%', color: '#727d80' },
  { label: 'Regulatory', value: '$1.8M', width: '23%', color: '#626e73' },
  { label: 'Market', value: '$1.2M', width: '15%', color: '#535f64' },
];

export type Timeframe = '24H' | '7D' | '30D' | '90D';
export const exposureSeries: Record<Timeframe, { label: string; value: number }[]> = {
  '24H': [
    { label: '00:00', value: 16.8 }, { label: '04:00', value: 16.9 }, { label: '08:00', value: 17.1 },
    { label: '12:00', value: 17.0 }, { label: '16:00', value: 17.5 }, { label: '20:00', value: 18.4 },
  ],
  '7D': [
    { label: 'Mon', value: 15.9 }, { label: 'Tue', value: 16.3 }, { label: 'Wed', value: 16.1 },
    { label: 'Thu', value: 16.7 }, { label: 'Fri', value: 17.1 }, { label: 'Sat', value: 17.4 }, { label: 'Sun', value: 18.4 },
  ],
  '30D': [
    { label: 'May 01', value: 12.8 }, { label: 'May 06', value: 13.4 }, { label: 'May 11', value: 13.1 },
    { label: 'May 16', value: 14.6 }, { label: 'May 21', value: 14.2 }, { label: 'May 26', value: 16.1 }, { label: 'May 31', value: 18.4 },
  ],
  '90D': [
    { label: 'Mar 01', value: 10.6 }, { label: 'Mar 15', value: 11.4 }, { label: 'Mar 29', value: 12.2 },
    { label: 'Apr 12', value: 11.9 }, { label: 'Apr 26', value: 13.6 }, { label: 'May 10', value: 14.8 },
    { label: 'May 24', value: 16.1 }, { label: 'Jun 07', value: 18.4 },
  ],
};