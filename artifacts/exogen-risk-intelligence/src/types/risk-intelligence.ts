import type { ConfidenceLevel, RiskLevel, TransmissionType } from './intelligence';

export type RelationshipType = 'DIRECT' | 'INDIRECT' | 'CONDITIONAL' | 'MIXED';

export type ImpactDirection = 'POSITIVE' | 'NEGATIVE' | 'MIXED' | 'UNCERTAIN';

export type EvidenceType =
  | 'RULE_BASED'
  | 'EMPIRICAL'
  | 'HISTORICAL'
  | 'STATISTICAL'
  | 'CORRELATIONAL'
  | 'EXPERT_DEFINED'
  | 'MIXED';

export type TransmissionNodeType =
  | 'EVENT'
  | 'RISK'
  | 'MACRO_VARIABLE'
  | 'MARKET_VARIABLE'
  | 'ECONOMIC_MECHANISM'
  | 'FINANCIAL_MECHANISM'
  | 'BUSINESS_UNIT'
  | 'EXPOSURE'
  | 'COMPANY';

export type TransmissionEdgeType =
  | 'CAUSES'
  | 'INFLUENCES'
  | 'PROPAGATES'
  | 'EXPOSES'
  | 'CORRELATES'
  | 'AMPLIFIES'
  | 'DAMPENS';

export interface RiskCategoryItem {
  id: string;
  name: string;
  description: string;
  subtypes: {
    id: string;
    name: string;
    parentCategory: string;
    description: string;
    activeEventsCount: number;
    affectedBusinessUnitsCount: number;
    activeExposureUsdM: number;
    avgConfidencePct: number;
    relatedEventIds: string[];
    affectedBusinessUnitIds: string[];
  }[];
}

export interface RiskSignalItem {
  id: string;
  name: string;
  category: string;
  parentCategory: string;
  description: string;
  severity: RiskLevel;
  activeEventsCount: number;
  affectedBusinessUnitsCount: number;
  totalModeledExposureUsdM: number;
  confidencePct: number;
  evidenceType: EvidenceType;
  primaryTransmission: string;
  relatedEvents: {
    id: string;
    title: string;
    probabilityPct: number;
    exposureUsdM: number;
    relationship: RelationshipType;
    direction: ImpactDirection;
  }[];
  affectedBusinessUnits: {
    id: string;
    name: string;
    division: string;
    exposureUsdM: number;
    direction: ImpactDirection;
    sensitivity: ConfidenceLevel;
    confidencePct: number;
  }[];
  whyExplanation: {
    event: string;
    macroEnvironment: string;
    financialMechanism: string;
    businessEffect: string;
    riskSummary: string;
  };
}

export interface RiskRelationshipItem {
  id: string;
  eventId: string;
  eventTitle: string;
  canonicalEventId: string;
  riskId: string;
  riskName: string;
  riskCategory: string;
  relationship: RelationshipType;
  direction: ImpactDirection;
  confidencePct: number;
  modeledExposureUsdM: number;
  modelBasis: string;
  evidenceType: EvidenceType;
  explanation: string;
  transmissionSummary: string;
  whyExplanation: {
    eventStep: string;
    rateOrMarketStep: string;
    financialMechanismStep: string;
    businessEffectStep: string;
    riskConclusionStep: string;
  };
  provenance: {
    sourceEventId: string;
    eventIdentityConfidencePct: number;
    relationshipConfidencePct: number;
    exposureModelId: string;
    exposureConfidencePct: number;
    version: string;
    updatedAt: string;
    history: {
      timestamp: string;
      action: string;
      confidence?: string;
    }[];
  };
}

export interface TransmissionNode {
  id: string;
  label: string;
  sublabel?: string;
  type: TransmissionNodeType;
  metric?: string;
  description: string;
  confidencePct?: number;
  status?: string;
  businessUnitId?: string;
  eventId?: string;
}

export interface TransmissionEdge {
  id: string;
  source: string;
  target: string;
  relationship: TransmissionEdgeType;
  direction: ImpactDirection;
  confidencePct: number;
  evidenceType: EvidenceType;
  isCausal: boolean;
  explanation: string;
  lastUpdated: string;
}

export interface TransmissionGraphData {
  id: string;
  title: string;
  eventId: string;
  canonicalEventTitle: string;
  nodes: TransmissionNode[];
  edges: TransmissionEdge[];
}

export interface BusinessUnitItem {
  id: string;
  name: string;
  division: string; // e.g. Commercial & Investment Bank, Consumer & Community Banking, Asset & Wealth Management
  description: string;
  activeRiskEventsCount: number;
  modeledExposureUsdM: number;
  highImpactCount: number;
  avgConfidencePct: number;
  exposureRange: {
    lowUsdM: number;
    baseUsdM: number;
    highUsdM: number;
  };
  currentRiskDrivers: {
    eventId: string;
    eventTitle: string;
    riskName: string;
    exposureUsdM: number;
    direction: ImpactDirection;
    confidencePct: number;
  }[];
  exposureByCategory: {
    category: string;
    amountUsdM: number;
    sharePct: number;
  }[];
  conditionalExposures?: {
    scenarioName: string;
    condition: string;
    direction: ImpactDirection;
    exposureUsdM: number;
    explanation: string;
  }[];
}

export interface EventBusinessUnitMatrixCell {
  eventId: string;
  eventTitle: string;
  riskName: string;
  category: string;
  units: Record<string, {
    amountUsdM: number;
    direction: ImpactDirection;
    confidencePct: number;
    relationship: RelationshipType;
  }>;
}

export interface CumulativeConfidenceChain {
  eventIdentityConfidencePct: number;
  riskMappingConfidencePct: number;
  transmissionConfidencePct: number;
  exposureConfidencePct: number;
  dataQualityWarning?: {
    isTriggered: boolean;
    reason: string;
    unadjustedConfidencePct: number;
    adjustedConfidencePct: number;
  };
}
