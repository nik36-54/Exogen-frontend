export type RiskScoreCategory = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ScenarioType = 'BASE' | 'UPSIDE' | 'DOWNSIDE' | 'SEVERE' | 'CUSTOM';

export type ConfidenceRating = 'HIGH' | 'MEDIUM' | 'LOW';

export interface RiskScoreInput {
  probability: number; // 0 - 100 (%)
  severity: number;    // 0 - 100
  exposure: number;    // 0 - 100
  propagation: number; // 0 - 100
  confidence: number;  // 0 - 100 (%)
}

export interface RiskScoreDriver {
  factor: 'Probability' | 'Severity' | 'Exposure' | 'Propagation' | 'Confidence';
  value: string;
  source: string;
  contribution: number; // e.g. +18, -3
  description: string;
}

export interface RiskScoreChangeDecomposition {
  probabilityChange: number;
  exposureChange: number;
  propagationChange: number;
  confidenceChange: number;
  netChange: number;
}

export interface RiskScoreHistoryPoint {
  timestamp: string;
  label: string;
  score: number;
  probabilityPct: number;
  note?: string;
}

export interface SignificantEventLog {
  time: string;
  title: string;
  category: string;
  description: string;
}

export interface RiskScoreResult {
  id: string;
  eventId: string;
  eventTitle: string;
  canonicalEventId: string;
  riskId: string;
  riskName: string;
  riskCategory: string;
  companyId: string;
  companyName: string;
  score: number; // 0 - 100
  category: RiskScoreCategory;
  scoreChange24h: number;
  probabilityPct: number;
  severity: number;
  exposureScore: number;
  propagationScore: number;
  confidencePct: number;
  modeledExposureUsdM: number;
  drivers: RiskScoreDriver[];
  changeDecomposition: RiskScoreChangeDecomposition;
  whyExplanation: {
    summary: string;
    primaryDrivers: { id: number; title: string; detail: string }[];
  };
  methodologyVersion: string;
  calculatedAt: string;
}

export interface ScenarioAssumption {
  factor: string;
  value: string;
  source: string;
  note?: string;
}

export interface BusinessUnitImpact {
  unitId: string;
  unitName: string;
  exposureUsdM: number;
  modeledImpactUsdM: number;
  direction: 'NEGATIVE' | 'POSITIVE' | 'MIXED';
  note: string;
}

export interface RiskCategoryImpact {
  riskCategory: string;
  modeledImpactUsdM: number;
  sharePct: number;
}

export interface ImpactRange {
  lowUsdM: number;
  baseUsdM: number;
  highUsdM: number;
  confidence: ConfidenceRating;
  reason: string;
}

export interface ImpactChangeDecomposition {
  probabilityUsdM: number;
  exposureUsdM: number;
  scenarioUsdM: number;
  transmissionUsdM: number;
  modelAdjustmentUsdM: number;
  netChangeUsdM: number;
}

export interface ImpactResult {
  id: string;
  eventId: string;
  eventTitle: string;
  riskName: string;
  companyName: string;
  activeScenario: ScenarioType;
  scenarioName: string;
  scenarioMagnitudePct: number;
  probabilityPct: number;
  modeledExposureUsdM: number;
  potentialImpactUsdM: number;
  expectedImpactUsdM: number;
  baseImpactUsdM: number;
  severeImpactUsdM: number;
  downsideImpactUsdM: number;
  upsideImpactUsdM: number;
  transmissionMultiplier: number;
  confidence: ConfidenceRating;
  confidencePct: number;
  impactRange: ImpactRange;
  byBusinessUnit: BusinessUnitImpact[];
  byRiskCategory: RiskCategoryImpact[];
  assumptions: ScenarioAssumption[];
  changeDecomposition: ImpactChangeDecomposition;
  modelVersions: {
    riskScoreModel: string;
    exposureModel: string;
    scenarioModel: string;
    calculationEngine: string;
  };
  calculatedAt: string;
}

export interface CustomScenarioInput {
  name: string;
  baseScenarioType: ScenarioType;
  probabilityPct: number;
  modeledExposureUsdM: number;
  scenarioMagnitudePct: number;
  transmissionMultiplier: number;
  confidenceAdjustmentPct: number;
}

export interface SensitivityAssumption {
  name: string;
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  bars: number; // 1-10
  rationale: string;
}

export interface SensitivityMatrixCell {
  probabilityPct: number;
  magnitudePct: number;
  modeledImpactUsdM: number;
}

export interface SensitivityMatrixData {
  probabilities: number[]; // e.g. [40, 60, 80]
  magnitudes: number[];    // e.g. [30, 60, 100]
  cells: SensitivityMatrixCell[][];
}

export interface CalculationProvenance {
  calculationId: string;
  eventId: string;
  eventTitle: string;
  canonicalEventId: string;
  consensusProbabilityPct: number;
  identityConfidencePct: number;
  riskRelationshipConfidencePct: number;
  exposureModelId: string;
  exposureModelUsdM: number;
  exposureConfidencePct: number;
  scenario: string;
  scenarioMagnitudePct: number;
  riskScore: number;
  potentialImpactUsdM: number;
  expectedImpactUsdM: number;
  modelVersions: {
    riskScoreModel: string;
    exposureModel: string;
    scenarioModel: string;
    calculationEngine: string;
  };
  calculatedAt: string;
  auditTrail: { step: string; status: 'VERIFIED' | 'PASS' | 'CALCULATED'; detail: string }[];
}

export interface ImpactAggregationSummary {
  companyId: string;
  companyName: string;
  totalModeledExposureUsdM: number;
  expectedImpactUsdM: number;
  downsideImpactUsdM: number;
  grossModeledImpactUsdM: number;
  overlapAdjustmentUsdM: number;
  adjustedModeledImpactUsdM: number;
  byRisk: { risk: string; amountUsdM: number; percentage: number }[];
  byBusinessUnit: { unit: string; amountUsdM: number; percentage: number }[];
  byEvent: {
    eventId: string;
    eventTitle: string;
    risk: string;
    exposureUsdM: number;
    expectedImpactUsdM: number;
    downsideImpactUsdM: number;
  }[];
  overlapIntegrity: {
    sharedRisk: string;
    eventsCount: number;
    naiveUsdM: number;
    adjustedUsdM: number;
    overlapUsdM: number;
    affectedEvents: string[];
    explanation: string;
  };
  correlatedRisks: {
    id: string;
    title: string;
    risks: string[];
    driverSummary: string;
  }[];
}
