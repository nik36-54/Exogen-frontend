export type ConfidenceLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type DisagreementLevel = 'LOW' | 'MODERATE' | 'HIGH';
export type ImpactDirection = 'POSITIVE' | 'NEGATIVE' | 'MIXED' | 'UNCERTAIN';
export type TransmissionType = 'DIRECT' | 'INDIRECT';

export interface Signal {
  id: string;
  title: string;
  source: string;
  probabilityPct: number;
  change30dPp: number;
  strength: ConfidenceLevel;
  freshness: string;
  status: 'LIVE' | 'DELAYED' | 'CLOSED';
  lastUpdated: string;
  eventId: string;
  category: string;
  riskLevel: RiskLevel;
  highImpactSignalsCount?: number;
}

export interface Contract {
  id: string;
  marketId: string;
  venue: string;
  question: string;
  outcome: string;
  probabilityPct: number;
  liquidityUsdM: number;
  volumeUsdM: number;
  freshness: string;
  matchScorePct: number;
  resolutionSource: string;
  resolutionDate: string;
  outcomes: string[];
  createdAt: string;
  updatedAt: string;
  sourceUrl: string;
  oracleCompatible: boolean;
  status?: 'OPEN' | 'CLOSED';
  fellegiSunterScorePct?: number;
  fingerprint: string;
  matchFeatures: string[];
  resolutionSemantics: string;
}

export interface EventFingerprint {
  time: string;
  location: string;
  outcome: string;
  subject: string;
}

export interface CanonicalEvent {
  id: string;
  title: string;
  description: string;
  identityConfidencePct: number;
  matchStatus: 'CANONICAL' | 'REVIEW';
  fingerprint: EventFingerprint;
  matchExplanation: string;
}

export interface VenueConsensus {
  venue: string;
  probabilityPct: number;
  liquidityUsdM: number;
  freshness: string;
  matchScorePct: number;
  weightPct: number;
}

export interface MarketConsensus {
  probabilityPct: number;
  venues: VenueConsensus[];
  disagreementPp: number;
  disagreementLevel: DisagreementLevel;
  confidence: ConfidenceLevel;
  explanation: string;
}

export interface RiskProfile {
  name: string;
  category: string;
  relationship: TransmissionType;
  direction: ImpactDirection;
  confidencePct: number;
  severityPct: number;
  explanation: string;
  transmission: {
    direct: string[];
    indirect: string[];
  };
}

export interface BusinessUnitExposure {
  id: string;
  name: string;
  amountUsdM: number;
  sensitivity: ConfidenceLevel;
  direction: ImpactDirection;
  confidencePct: number;
  transmission: TransmissionType;
  explanation: string;
}

export interface RiskScoreFactors {
  probabilityPct: number;
  severityPct: number;
  exposurePct: number;
  propagationPct: number;
  confidencePct: number;
}

export interface ImpactScenario {
  baseUsdM: number;
  downsideUsdM: number;
  severeUsdM: number;
  expectedUsdM: number;
  exposureBasisUsdM: number;
  scenarioMagnitudePct: number;
  rangeMaxUsdM: number;
}

export interface Provenance {
  modelVersion: string;
  engineVersion: string;
  calculatedAt: string;
  snapshotAvailable: boolean;
  sourceSummary: string[];
}

export interface IntelligenceScenario {
  id: string;
  label: string;
  company: string;
  signal: Signal;
  contracts: Contract[];
  canonicalEvent: CanonicalEvent;
  consensus: MarketConsensus;
  risk: RiskProfile;
  exposures: BusinessUnitExposure[];
  riskScoreFactors: RiskScoreFactors;
  impact: ImpactScenario;
  provenance: Provenance;
  summary: {
    changed: string;
    whyItMatters: string;
    whatIsExposed: string;
    confidence: ConfidenceLevel;
  };
}

export interface CalculatedRiskScore {
  score: number;
  level: RiskLevel;
  factors: RiskScoreFactors;
  contributions: { key: keyof RiskScoreFactors; label: string; valuePct: number; weightPct: number }[];
}

export interface ImpactEstimate {
  probabilityPct: number;
  exposureUsdM: number;
  scenarioMagnitudePct: number;
  impactUsdM: number;
}