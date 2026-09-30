import type { ConfidenceLevel } from './intelligence';

export type EventMatchStatus = 'CANONICAL' | 'REVIEW' | 'DISTINCT' | 'LOW_CONFIDENCE' | 'STALE' | 'INVALID';

export type MatchDecisionType = 'MERGE' | 'DISTINCT' | 'REVIEW';

export type OracleCompatibilityStatus = 'TRUE' | 'FALSE' | 'UNKNOWN';

export type DataQualityHealthStatus = 'HEALTHY' | 'AGING' | 'STALE' | 'INVALID' | 'MONITOR';

export interface FingerprintComponentDetail {
  code: 'T' | 'L' | 'O' | 'S';
  name: 'Time' | 'Location' | 'Outcome' | 'Subject';
  normalizedValue: string;
  extractionConfidencePct: number;
  rawValues: { venue: string; value: string }[];
  description: string;
}

export interface CanonicalEventRecord {
  id: string;
  title: string;
  description: string;
  category: string;
  contractsCount: number;
  venuesCount: number;
  venues: string[];
  identityConfidencePct: number;
  consensusProbabilityPct: number;
  freshness: string;
  status: EventMatchStatus;
  createdAt: string;
  updatedAt: string;
  signalId?: string; // Links to Signal in Prompt 2
  riskCategory: string;
  subject: string;
  location: string;
  timeWindow: string;
  outcomeDefinition: string;
  eventType: string;
  resolutionSource: string;
  fingerprint: {
    formula: string;
    time: string;
    location: string;
    outcome: string;
    subject: string;
    components: FingerprintComponentDetail[];
  };
  normalizationDetails: {
    rawQuestion: string;
    rawDescription: string;
    rawResolutionRules: string;
    parsedTime: string;
    parsedLocation: string;
    parsedOutcome: string;
    parsedSubject: string;
    normalizedStatement: string;
    confidencePct: number;
  };
  associatedContracts: {
    id: string;
    venue: string;
    question: string;
    probabilityPct: number;
    liquidityUsdM: number;
    volumeUsdM: number;
    freshness: string;
    oracleCompatible: OracleCompatibilityStatus;
    matchScorePct: number;
    status: 'OPEN' | 'RESOLVED' | 'CLOSED';
    resolutionSource: string;
    marketUrl: string;
    ageMinutes: number;
  }[];
  sameEventRationale: {
    subjectMatch: boolean;
    timeMatch: boolean;
    locationMatch: boolean;
    outcomeMatch: boolean;
    resolutionMatch: boolean;
    overallConfidencePct: number;
    explanation: string;
    nuanceNote?: string;
  };
  differentEventRationale?: {
    materialDifferenceField: string;
    eventAValue: string;
    eventBValue: string;
    explanation: string;
  };
  provenance: {
    recordId: string;
    createdAt: string;
    sourceContractsCount: number;
    matchDecisionsCount: number;
    normalizationVersion: string;
    matchingEngineVersion: string;
    lastUpdated: string;
    auditLog: {
      timestamp: string;
      actor: 'SYSTEM' | 'REVIEWER' | 'INGESTION';
      action: string;
      confidencePct?: number;
      notes: string;
    }[];
  };
}

export interface MatchPairFeature {
  name: string;
  score: number; // 0 to 1
  weight: number; // contribution
  explanation: string;
}

export interface MatchCandidatePair {
  id: string;
  eventAId: string;
  eventBId: string;
  eventATitle: string;
  eventBTitle: string;
  venueA: string;
  venueB: string;
  matchScorePct: number;
  identityConfidence: ConfidenceLevel;
  semanticDifference: string;
  differenceType: 'WORDING_ONLY' | 'OUTCOME_THRESHOLD' | 'CONDITION_SEMANTICS' | 'TIME_WINDOW' | 'OPPOSING_OUTCOME';
  recommendation: MatchDecisionType;
  status: MatchDecisionType;
  uncertaintyScorePct: number;
  potentialDownsideImpactUsdM: number;
  createdAt: string;
  freshness: string;
  eventA: {
    id: string;
    time: string;
    location: string;
    subject: string;
    outcome: string;
    resolution: string;
    probabilityPct: number;
    liquidityUsdM: number;
  };
  eventB: {
    id: string;
    time: string;
    location: string;
    subject: string;
    outcome: string;
    resolution: string;
    probabilityPct: number;
    liquidityUsdM: number;
  };
  features: {
    time: MatchPairFeature;
    location: MatchPairFeature;
    subject: MatchPairFeature;
    outcome: MatchPairFeature;
    resolution: MatchPairFeature;
  };
  fellegiSunter: {
    score: number; // e.g. +8.42 or -3.17
    matchProbabilityPct: number;
    label: string;
    mProbabilities: Record<string, number>;
    uProbabilities: Record<string, number>;
  };
  decisionRationale: {
    title: string;
    matchScore: number;
    points: string[];
    summary: string;
  };
  history: {
    time: string;
    action: string;
    actor: string;
    detail: string;
  }[];
}

export interface DataQualityDimension {
  id: string;
  dimension: string;
  scorePct: number;
  status: DataQualityHealthStatus;
  issueCount: number;
  issueDescription: string;
  trend: 'STABLE' | 'IMPROVING' | 'DEGRADING';
}

export interface IngestionPipelineStage {
  id: string;
  name: string;
  stageOrder: number;
  status: 'HEALTHY' | 'DEGRADED' | 'WARNING';
  processedCount: number;
  failedCount: number;
  averageLatencyMs: number;
  lastSuccessfulRun: string;
  failureRatePct: number;
  recentErrors: {
    timestamp: string;
    contractId?: string;
    venue?: string;
    message: string;
  }[];
}

export interface ContractFreshnessRecord {
  id: string;
  contractTitle: string;
  venue: string;
  probabilityPct: number;
  lastUpdated: string;
  ageMinutes: number;
  status: 'Fresh' | 'Aging' | 'Stale' | 'Unknown';
  updateFrequency: string;
  lastSuccessfulIngestion: string;
  expectedRefreshInterval: string;
  canonicalEventId: string;
  affectedRiskSignalsCount: number;
  affectedExposureUsdM: number;
  recentProbabilities: { timestamp: string; probabilityPct: number }[];
}

export interface OracleCompatibilityRecord {
  id: string;
  eventTitle: string;
  venue: string;
  oracleSource: string;
  compatibility: OracleCompatibilityStatus;
  confidencePct: number;
  resolutionCondition: string;
  rationale: string;
  authoritativeSourceValid: boolean;
}

export interface ContractValidationCheck {
  id: string;
  contractId: string;
  venue: string;
  title: string;
  checks: {
    name: string;
    passed: boolean;
    detail?: string;
  }[];
  isValid: boolean;
  failureReasons?: string[];
}

export interface DataQualityAlert {
  id: string;
  severity: 'WARNING' | 'CRITICAL' | 'INFO';
  title: string;
  description: string;
  category: 'FRESHNESS' | 'ORACLE' | 'VALIDATION' | 'REVIEW';
  affectedCount: number;
  filterTarget: string;
  timestamp: string;
  affectedDownstream: {
    canonicalEventsCount: number;
    riskSignalsCount: number;
    exposureAllocationsCount: number;
  };
}
