import type {
  CalculatedRiskScore,
  ImpactEstimate,
  RiskLevel,
  RiskScoreFactors,
} from '../types/intelligence';

export const riskScoreWeights: Record<keyof RiskScoreFactors, number> = {
  probabilityPct: 0.1,
  severityPct: 0.2,
  exposurePct: 0.3,
  propagationPct: 0.1,
  confidencePct: 0.3,
};

const riskScoreLabels: Record<keyof RiskScoreFactors, string> = {
  probabilityPct: 'Probability',
  severityPct: 'Severity',
  exposurePct: 'Exposure',
  propagationPct: 'Propagation',
  confidencePct: 'Confidence',
};

export function calculateRiskScore(factors: RiskScoreFactors): CalculatedRiskScore {
  const contributions = (Object.keys(riskScoreWeights) as (keyof RiskScoreFactors)[]).map((key) => ({
    key,
    label: riskScoreLabels[key],
    valuePct: factors[key],
    weightPct: riskScoreWeights[key] * 100,
  }));
  const score = Math.round(
    contributions.reduce((total, item) => total + item.valuePct * (item.weightPct / 100), 0),
  );
  const level: RiskLevel = score >= 85 ? 'CRITICAL' : score >= 70 ? 'HIGH' : score >= 45 ? 'MEDIUM' : 'LOW';

  return { score, level, factors, contributions };
}

export function calculateImpactEstimate(input: Omit<ImpactEstimate, 'impactUsdM'>): ImpactEstimate {
  const probability = input.probabilityPct / 100;
  const magnitude = input.scenarioMagnitudePct / 100;
  const impactUsdM = Math.round(probability * input.exposureUsdM * magnitude * 10) / 10;
  return { ...input, impactUsdM };
}

export function sumExposureUsdM(amounts: number[]): number {
  return Math.round(amounts.reduce((total, amount) => total + amount, 0) * 10) / 10;
}