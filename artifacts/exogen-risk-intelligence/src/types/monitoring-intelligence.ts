export type WarningSeverity = 'low' | 'medium' | 'high' | 'critical';

export type WarningStatus =
  | 'new'
  | 'acknowledged'
  | 'investigating'
  | 'escalated'
  | 'resolved'
  | 'expired'
  | 'suppressed';

export type ChangeType =
  | 'PROBABILITY_ACCELERATION'
  | 'RISK_SCORE_ESCALATION'
  | 'EXPOSURE_INCREASE'
  | 'DOLLAR_IMPACT_CHANGE'
  | 'NEW_CANONICAL_EVENT'
  | 'NEW_RISK_RELATIONSHIP'
  | 'PROPAGATION_DETECTED'
  | 'CROSS_VENUE_DISAGREEMENT'
  | 'DATA_FRESHNESS_WARNING'
  | 'MATCHING_REVIEW_REQUIRED'
  | 'THRESHOLD_CROSSED';

export interface EarlyWarning {
  id: string;
  type: ChangeType;
  title: string;
  severity: WarningSeverity;
  status: WarningStatus;
  detectedAt: string;
  timeAgo: string;

  // Connected entities
  eventId: string;
  eventTitle: string;
  canonicalEventId: string;
  riskId: string;
  riskName: string;
  businessUnitId: string;
  businessUnitName: string;
  companyId: string;
  companyName: string;

  // Change quantification
  metricName: string;
  previousValue: string;
  currentValue: string;
  changeValue: string;
  changeDirection: 'INCREASE' | 'DECREASE' | 'NEUTRAL';

  // Connected impact
  riskScore: number;
  previousRiskScore: number;
  exposureUsdM: number;
  previousExposureUsdM: number;
  potentialImpactUsdM: number;
  previousImpactUsdM: number;

  whyItMatters: string;
  whyGeneratedReasons: string[];
  confidencePct: number;

  // Provenance & rule
  triggeredRuleId: string;
  ruleDescription: string;
  relatedWarningIds?: string[];
  downstreamEffectsCount: number;

  statusHistory: { status: WarningStatus; timestamp: string; actor: string; note: string }[];
}

export interface WarningRule {
  id: string;
  name: string;
  metric: string;
  condition: string;
  threshold: string;
  severity: WarningSeverity;
  description: string;
  activeCount: number;
}

export interface WatchlistItem {
  id: string;
  entityId: string;
  name: string;
  type: 'EVENT' | 'RISK' | 'BUSINESS_UNIT' | 'EXPOSURE' | 'COMPANY';
  group: string;
  currentProbabilityPct?: number;
  riskScore?: number;
  exposureUsdM?: number;
  potentialImpactUsdM?: number;
  change24h: string;
  lastUpdated: string;
  status: 'WATCHING' | 'PAUSED' | 'ALERT_ACTIVE';
  warningCount: number;
  hasMaterialChange: boolean;
  recentChangesSummary: {
    probabilityChange?: string;
    scoreChange?: string;
    exposureChange?: string;
    impactChange?: string;
    newWarningsCount?: number;
    newRelationshipsCount?: number;
  };
}

export interface AlertRule {
  id: string;
  name: string;
  entityType: 'EVENT' | 'RISK' | 'BUSINESS_UNIT' | 'EXPOSURE' | 'COMPANY';
  entityId: string;
  entityName: string;
  metric: 'probability' | 'risk_score' | 'exposure' | 'impact' | 'confidence' | 'freshness';
  operator: 'gt' | 'gte' | 'lt' | 'lte' | 'change_gt';
  threshold: number;
  thresholdLabel: string;
  additionalCondition?: string;
  notificationChannel: 'IN_APP' | 'EMAIL' | 'ALL';
  frequency: 'IMMEDIATELY' | 'HOURLY' | 'DAILY_DIGEST';
  enabled: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
  triggerCount: number;
}

export interface TriggeredAlert {
  id: string;
  ruleId: string;
  ruleName: string;
  entityName: string;
  entityId: string;
  entityType: string;
  currentValue: string;
  previousValue: string;
  changeDelta: string;
  triggeredAt: string;
  reason: string;
  severity: WarningSeverity;
  isRead: boolean;
  deduplicationGroupId?: string;
  downstreamCount?: number;
}

export interface PropagationStep {
  stepNumber: number;
  title: string;
  nodeType: 'EVENT' | 'MACRO' | 'RISK' | 'TRANSMISSION' | 'BUSINESS_UNIT' | 'EXPOSURE' | 'IMPACT';
  detail: string;
  timestamp: string;
  latencyMinutes: number;
  relationshipType: string;
  direction: 'positive' | 'negative' | 'mixed';
  confidencePct: number;
  amountUsdM?: number;
}

export interface RiskPropagationRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  primaryRiskName: string;
  sourceNodeTitle: string;
  targetBusinessUnit: string;
  exposureUsdM: number;
  potentialImpactUsdM: number;
  detectedAt: string;
  totalPropagationVelocityMin: number;
  depth: number;
  steps: PropagationStep[];
  velocityBreakdown: { phase: string; minutes: number }[];
  depthHierarchy: { depthLevel: number; title: string; detail: string }[];
}

export interface MaterialChangeItem {
  id: string;
  time: string;
  title: string;
  changeType: ChangeType;
  eventTitle: string;
  eventId: string;
  oldValue: string;
  newValue: string;
  magnitude: string;
  affectedRisk: string;
  affectedBusinessUnit: string;
  impactChangeUsdM: number;
  confidencePct: number;
  ctaPath: string;
  ctaLabel: string;
}

export interface ExecutiveMonitoringSummary {
  headline: string;
  secondaryLine: string;
  activeWarningsCount: number;
  criticalWarningsCount: number;
  highSignificanceChangesCount: number;
  downsideExposureIncreaseUsdM: number;
  newPropagationPathsCount: number;
  highConfidenceRiskPercentage: number;
  lastUpdatedTimestamp: string;
  sinceYesterdaySummary: {
    materialChangesCount: number;
    risksEscalatedCount: number;
    exposuresIncreasedCount: number;
    newPropagationsCount: number;
    newCanonicalEventsCount: number;
    largestChange: {
      eventTitle: string;
      probabilityDelta: string;
      potentialImpactDelta: string;
      riskScoreDelta: string;
      eventId: string;
    };
  };
}
