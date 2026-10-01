export type BacktestType =
  | 'probability'
  | 'matching'
  | 'risk_score'
  | 'warning'
  | 'propagation'
  | 'impact';

export type BacktestStatus =
  | 'queued'
  | 'running'
  | 'completed'
  | 'failed'
  | 'insufficient_data';

export type ValidationHealthStatus =
  | 'Strong'
  | 'Good'
  | 'Developing'
  | 'Limited'
  | 'Experimental'
  | 'Insufficient Data';

export interface BacktestRun {
  id: string;
  name: string;
  type: BacktestType;
  datasetVersion: string;
  modelVersion: string;
  startDate: string;
  endDate: string;
  evaluationHorizon: string;
  sampleSize: number;
  status: BacktestStatus;
  primaryMetricName: string;
  primaryMetricValue: number;
  primaryMetricFormatted: string;
  metrics: Record<string, number>;
  description: string;
  createdAt: string;
  outcomeDefinition: string;
  evaluationWindowDays: number;
}

export interface CalibrationBucket {
  probabilityRange: string;
  rangeMin: number;
  rangeMax: number;
  predictedProbability: number;
  observedFrequency: number;
  sampleSize: number;
  errorPp: number;
  isOverconfident: boolean;
  isUnderconfident: boolean;
  warningNote?: string;
}

export interface ModelVersion {
  id: string;
  modelType: BacktestType;
  version: string;
  name: string;
  createdDate: string;
  activeSince: string;
  evaluationWindow: string;
  dataset: string;
  methodology: string;
  sampleSize: number;
  status: ValidationHealthStatus;
  primaryMetric: {
    name: string;
    value: number;
    formatted: string;
    changeFromPrevious?: number;
    changeDirection?: 'improved' | 'worsened' | 'neutral';
  };
  metrics: Record<string, number>;
  changeLog: string[];
}

export interface HistoricalOutcome {
  id: string;
  eventId: string;
  eventTitle: string;
  outcomeType: string;
  observedValue?: number;
  resolved: boolean;
  resolutionTimestamp?: string;
  source?: string;
  description: string;
}

export interface ReplayTimestampTick {
  timestamp: string;
  label: string;
  hoursFromResolution: number;
  probabilityPct: number;
  riskScore: number;
  modeledExposureUsdM: number;
  potentialImpactUsdM: number;
  activeWarningsCount: number;
  activeSignalsCount: number;
  warningTriggered: boolean;
  warningMessage?: string;
  summaryNote: string;
  knownFacts: string[];
  unknownFutureFacts: string[];
  graphNodesActive: string[];
  graphEdgesActive: string[];
}

export interface HistoricalReplayEvent {
  id: string;
  eventId: string;
  title: string;
  category: string;
  date: string;
  resolutionTime: string;
  resolutionOutcome: string;
  ticks: ReplayTimestampTick[];
  finalOutcome: {
    occurred: boolean;
    finalProbability: number;
    brierScore: number;
    warningLeadTimeHours: number;
    outcomeSource: string;
  };
}

export interface ConfusionMatrixData {
  truePositive: number;
  falsePositive: number;
  falseNegative: number;
  trueNegative: number;
  totalEvaluated: number;
  precisionPct: number;
  recallPct: number;
  f1Score: number;
  medianLeadTimeHours: number;
  averageLeadTimeHours: number;
  p90LeadTimeHours: number;
}

export interface WarningThresholdPoint {
  thresholdScore: number;
  precisionPct: number;
  recallPct: number;
  averageLeadTimeHours: number;
  alertVolume: number;
}

export interface MatchingThresholdPoint {
  thresholdScore: number;
  precisionPct: number;
  recallPct: number;
  reviewVolume: number;
  falseMergeRatePct: number;
  falseSplitRatePct: number;
}

export interface HistoricalEventBacktestRecord {
  id: string;
  eventId: string;
  title: string;
  category: string;
  eventDate: string;
  predictionHorizon: string;
  predictedProbabilityPct: number;
  predictedRiskScore: number;
  modeledExposureUsdM: number;
  modeledImpactUsdM: number;
  observedOutcome: 'OCCURRED' | 'NOT_OCCURRED' | 'INCONCLUSIVE';
  observedOutcomeValue: number; // 1 or 0
  predictionErrorPp: number;
  warningIssued: boolean;
  warningLeadTimeHours?: number;
  propagationValidated: boolean;
  impactWithinRange: boolean;
  observedImpactProxyUsdM?: number;
  notes: string;
}

export interface ModelDriftPeriod {
  periodLabel: string;
  quarter: string;
  brierScore: number;
  calibrationError: number;
  sampleSize: number;
  driftDetected: boolean;
  driftMetricName?: string;
}
