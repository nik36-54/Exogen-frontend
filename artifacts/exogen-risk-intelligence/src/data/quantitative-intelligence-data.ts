import type {
  RiskScoreResult,
  RiskScoreInput,
  RiskScoreDriver,
  RiskScoreCategory,
  RiskScoreHistoryPoint,
  SignificantEventLog,
  ImpactResult,
  ScenarioType,
  SensitivityAssumption,
  SensitivityMatrixData,
  CalculationProvenance,
  ImpactAggregationSummary,
  CustomScenarioInput,
} from '@/types/quantitative-intelligence';

export function calculateIllustrativeRiskScore(input: RiskScoreInput): {
  score: number;
  category: RiskScoreCategory;
  drivers: RiskScoreDriver[];
} {
  const pContrib = Math.round((input.probability / 100) * 27.5);
  const sContrib = Math.round((input.severity / 100) * 29.0);
  const eContrib = Math.round((input.exposure / 100) * 23.5);
  const prContrib = Math.round((input.propagation / 100) * 18.0);
  const confAdj = Math.round(((input.confidence - 80) / 100) * 10);

  const rawScore = pContrib + sContrib + eContrib + prContrib + confAdj;
  const score = Math.min(100, Math.max(0, rawScore));

  let category: RiskScoreCategory = 'LOW';
  if (score >= 85) category = 'CRITICAL';
  else if (score >= 70) category = 'HIGH';
  else if (score >= 40) category = 'MEDIUM';

  const drivers: RiskScoreDriver[] = [
    {
      factor: 'Probability',
      value: `${input.probability.toFixed(1)}%`,
      source: 'Market Consensus',
      contribution: pContrib,
      description: 'Aggregate prediction market consensus probability',
    },
    {
      factor: 'Severity',
      value: `${input.severity} / 100`,
      source: 'Risk Severity Model',
      contribution: sContrib,
      description: 'Categorical severity rating on institutional balance sheet',
    },
    {
      factor: 'Exposure',
      value: `${input.exposure} / 100`,
      source: 'Company Exposure Model',
      contribution: eContrib,
      description: 'Direct and indirect business unit asset/liability sensitivity',
    },
    {
      factor: 'Propagation',
      value: `${input.propagation} / 100`,
      source: 'Transmission Graph',
      contribution: prContrib,
      description: 'Breadth and cascade velocity across operational channels',
    },
    {
      factor: 'Confidence',
      value: `${input.confidence.toFixed(0)}%`,
      source: 'Data + Relationship Confidence',
      contribution: confAdj,
      description: 'Quality of source contracts, oracle verification, and mapping depth',
    },
  ];

  return { score, category, drivers };
}

export function runCustomScenarioCalculation(input: CustomScenarioInput): {
  potentialImpactUsdM: number;
  expectedImpactUsdM: number;
  riskScore: number;
  confidenceRating: 'HIGH' | 'MEDIUM' | 'LOW';
} {
  const baseImpact = (input.probabilityPct / 100) * input.modeledExposureUsdM * (input.scenarioMagnitudePct / 100) * input.transmissionMultiplier;
  const potentialImpactUsdM = Number(Math.max(0.1, baseImpact * 1.5).toFixed(1));
  const expectedImpactUsdM = Number((potentialImpactUsdM * (input.probabilityPct / 100)).toFixed(1));

  const compositeScoreInput: RiskScoreInput = {
    probability: input.probabilityPct,
    severity: Math.min(100, Math.round(input.scenarioMagnitudePct * 0.9)),
    exposure: Math.min(100, Math.round((input.modeledExposureUsdM / 30) * 80)),
    propagation: Math.min(100, Math.round(input.transmissionMultiplier * 60)),
    confidence: Math.max(30, Math.min(99, 85 + input.confidenceAdjustmentPct)),
  };

  const { score } = calculateIllustrativeRiskScore(compositeScoreInput);

  let confidenceRating: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
  if (compositeScoreInput.confidence >= 85) confidenceRating = 'HIGH';
  else if (compositeScoreInput.confidence < 70) confidenceRating = 'LOW';

  return {
    potentialImpactUsdM,
    expectedImpactUsdM,
    riskScore: score,
    confidenceRating,
  };
}

export const riskScoresList: RiskScoreResult[] = [
  {
    id: 'RS-FED-RATE-CUT',
    eventId: 'CE-000184',
    eventTitle: 'Federal Reserve cuts benchmark rate by ≥50 bps before March 2027',
    canonicalEventId: 'CE-000184',
    riskId: 'RSK-INT-RATE',
    riskName: 'Interest Rate Risk',
    riskCategory: 'Market Risk',
    companyId: 'JPMC',
    companyName: 'JPMorgan Chase & Co.',
    score: 78,
    category: 'HIGH',
    scoreChange24h: 9,
    probabilityPct: 66.1,
    severity: 72,
    exposureScore: 84,
    propagationScore: 61,
    confidencePct: 87,
    modeledExposureUsdM: 27.8,
    drivers: [
      { factor: 'Probability', value: '66.1%', source: 'Market Consensus', contribution: 18, description: 'Elevated market expectation for aggressive central bank easing' },
      { factor: 'Severity', value: '72 / 100', source: 'Risk Severity Model', contribution: 21, description: 'Net interest margin pressure across deposit and fixed rate asset books' },
      { factor: 'Exposure', value: '84 / 100', source: 'Company Exposure Model', contribution: 19, description: '$27.8M direct modeled asset/liability sensitivity across 4 BUs' },
      { factor: 'Propagation', value: '61 / 100', source: 'Transmission Graph', contribution: 11, description: 'Direct transmission into lending spreads and mortgage refinance wave' },
      { factor: 'Confidence', value: '87%', source: 'Data + Relationship Confidence', contribution: -3, description: 'High data quality; modest adjustment for uncertainty in long-tail yield curve slope' },
    ],
    changeDecomposition: {
      probabilityChange: 6,
      exposureChange: 3,
      propagationChange: 2,
      confidenceChange: -2,
      netChange: 9,
    },
    whyExplanation: {
      summary: 'The risk has a high market probability, meaningful business-unit exposure, and multiple transmission paths. Cross-venue agreement is strong, increasing confidence in the signal.',
      primaryDrivers: [
        { id: 1, title: 'High market probability', detail: 'Consensus probability surged to 66.1% backed by $4.2M Polymarket and Kalshi institutional volume.' },
        { id: 2, title: 'Material business exposure', detail: 'Modeled exposure of $27.8M concentrated heavily in Commercial Banking and Markets trading inventory.' },
        { id: 3, title: 'Multiple transmission paths', detail: 'Transmission graph maps simultaneous repricing across prime loans, deposit betas, and MBS prepayments.' },
        { id: 4, title: 'Strong event identity confidence', detail: 'Cross-venue contract matching identity confidence sits at 94.2% with verified Federal Reserve H.15 oracle source.' },
      ],
    },
    methodologyVersion: 'v0.1',
    calculatedAt: '2 minutes ago',
  },
  {
    id: 'RS-OIL-SHOCK',
    eventId: 'CE-000219',
    eventTitle: 'Brent crude oil exceeds $120/barrel before Dec 2026',
    canonicalEventId: 'CE-000219',
    riskId: 'RSK-COMMODITY',
    riskName: 'Commodity Risk',
    riskCategory: 'Market Risk',
    companyId: 'JPMC',
    companyName: 'JPMorgan Chase & Co.',
    score: 64,
    category: 'MEDIUM',
    scoreChange24h: 6,
    probabilityPct: 41.8,
    severity: 81,
    exposureScore: 61,
    propagationScore: 55,
    confidencePct: 74,
    modeledExposureUsdM: 19.2,
    drivers: [
      { factor: 'Probability', value: '41.8%', source: 'Market Consensus', contribution: 12, description: 'Geopolitical Strait of Hormuz risk premium priced in contracts' },
      { factor: 'Severity', value: '81 / 100', source: 'Risk Severity Model', contribution: 23, description: 'Direct inflation spike affecting transport, airlines, and industrial borrower credit' },
      { factor: 'Exposure', value: '61 / 100', source: 'Company Exposure Model', contribution: 15, description: '$19.2M syndicated energy loans and commodity derivatives exposure' },
      { factor: 'Propagation', value: '55 / 100', source: 'Transmission Graph', contribution: 10, description: 'Propagation via headline CPI and delayed Fed rate cuts' },
      { factor: 'Confidence', value: '74%', source: 'Data + Relationship Confidence', contribution: 4, description: 'Liquid energy prediction markets with robust EIA oracle checks' },
    ],
    changeDecomposition: {
      probabilityChange: 4,
      exposureChange: 2,
      propagationChange: 1,
      confidenceChange: -1,
      netChange: 6,
    },
    whyExplanation: {
      summary: 'Elevated severity and geopolitical uncertainty offset moderate market probability, producing a balanced medium-risk classification.',
      primaryDrivers: [
        { id: 1, title: 'Energy credit vulnerability', detail: 'Significant secondary exposure through airline, shipping, and trucking credit portfolios.' },
        { id: 2, title: 'Hedging and trading volatility', detail: 'Commodities trading desk margin calls and VaR threshold escalations.' },
        { id: 3, title: 'Stagflationary spillover', detail: 'Higher energy prices dampen retail consumer discretionary spending and debt service.' },
      ],
    },
    methodologyVersion: 'v0.1',
    calculatedAt: '14 minutes ago',
  },
  {
    id: 'RS-GSIB-REG',
    eventId: 'CE-000304',
    eventTitle: 'US enacts enhanced capital adequacy rule for G-SIBs',
    canonicalEventId: 'CE-000304',
    riskId: 'RSK-REG-CAPITAL',
    riskName: 'Regulatory Capital Risk',
    riskCategory: 'Regulatory Risk',
    companyId: 'JPMC',
    companyName: 'JPMorgan Chase & Co.',
    score: 73,
    category: 'HIGH',
    scoreChange24h: 14,
    probabilityPct: 38.4,
    severity: 91,
    exposureScore: 79,
    propagationScore: 70,
    confidencePct: 91,
    modeledExposureUsdM: 34.7,
    drivers: [
      { factor: 'Probability', value: '38.4%', source: 'Market Consensus', contribution: 11, description: 'Congressional committee hearing scheduling lifted rule adoption odds' },
      { factor: 'Severity', value: '91 / 100', source: 'Risk Severity Model', contribution: 27, description: 'Direct requirement for additional Tier 1 common equity buffers' },
      { factor: 'Exposure', value: '79 / 100', source: 'Company Exposure Model', contribution: 20, description: '$34.7M modeled compliance, capital allocation, and ROE dampening' },
      { factor: 'Propagation', value: '70 / 100', source: 'Transmission Graph', contribution: 13, description: 'Constrains balance sheet deployment across all 4 major business divisions' },
      { factor: 'Confidence', value: '91%', source: 'Data + Relationship Confidence', contribution: 2, description: 'Strict Federal Register oracle rules with verified statutory text' },
    ],
    changeDecomposition: {
      probabilityChange: 8,
      exposureChange: 4,
      propagationChange: 2,
      confidenceChange: 0,
      netChange: 14,
    },
    whyExplanation: {
      summary: 'Very high structural severity and direct balance sheet constraint offset a sub-50% probability, generating a critical regulatory priority.',
      primaryDrivers: [
        { id: 1, title: 'Extreme capital severity', detail: 'Potential 150-200 bps surcharge on risk-weighted assets requiring retained earnings retention.' },
        { id: 2, title: 'Broad balance sheet friction', detail: 'Reduces return on tangible common equity (ROTCE) across investment banking and prime brokerage.' },
        { id: 3, title: 'High legislative confidence', detail: 'Official rulemaking notice on Federal Register confirmed statutory timeline.' },
      ],
    },
    methodologyVersion: 'v0.1',
    calculatedAt: '32 minutes ago',
  },
  {
    id: 'RS-CHIP-EXPORT',
    eventId: 'CE-000412',
    eventTitle: 'Semiconductor foundry disruption or bilateral export block',
    canonicalEventId: 'CE-000412',
    riskId: 'RSK-TECH-SUPPLY',
    riskName: 'Supply Chain & Technology Risk',
    riskCategory: 'Operational Risk',
    companyId: 'JPMC',
    companyName: 'JPMorgan Chase & Co.',
    score: 68,
    category: 'MEDIUM',
    scoreChange24h: 3,
    probabilityPct: 29.5,
    severity: 88,
    exposureScore: 71,
    propagationScore: 64,
    confidencePct: 82,
    modeledExposureUsdM: 22.4,
    drivers: [
      { factor: 'Probability', value: '29.5%', source: 'Market Consensus', contribution: 8, description: 'Bilateral trade tension and foundry supply checks' },
      { factor: 'Severity', value: '88 / 100', source: 'Risk Severity Model', contribution: 26, description: 'Hardware procurement stops for data centers and trading server infrastructure' },
      { factor: 'Exposure', value: '71 / 100', source: 'Company Exposure Model', contribution: 18, description: '$22.4M tech portfolio lending and internal infrastructure CAPEX' },
      { factor: 'Propagation', value: '64 / 100', source: 'Transmission Graph', contribution: 13, description: 'Secondary impact on enterprise client software/hardware equities' },
      { factor: 'Confidence', value: '82%', source: 'Data + Relationship Confidence', contribution: 3, description: 'Verified Department of Commerce BIS publication rules' },
    ],
    changeDecomposition: {
      probabilityChange: 2,
      exposureChange: 1,
      propagationChange: 1,
      confidenceChange: -1,
      netChange: 3,
    },
    whyExplanation: {
      summary: 'High operational severity and systemic tech supply exposure driven by geopolitical friction and data center dependency.',
      primaryDrivers: [
        { id: 1, title: 'Internal server procurement risk', detail: 'Cloud and high-frequency trading server refresh cycles vulnerable to component embargo.' },
        { id: 2, title: 'Tech sector borrower stress', detail: 'Semiconductor fab equipment clients face revenue curtailment.' },
      ],
    },
    methodologyVersion: 'v0.1',
    calculatedAt: '1 hour ago',
  },
  {
    id: 'RS-CRE-DEFAULT',
    eventId: 'CE-000529',
    eventTitle: 'US Tier-1 metropolitan office commercial mortgage default rate exceeds 8.5%',
    canonicalEventId: 'CE-000529',
    riskId: 'RSK-CREDIT-CRE',
    riskName: 'Commercial Real Estate Credit Risk',
    riskCategory: 'Credit Risk',
    companyId: 'JPMC',
    companyName: 'JPMorgan Chase & Co.',
    score: 71,
    category: 'HIGH',
    scoreChange24h: -2,
    probabilityPct: 52.3,
    severity: 76,
    exposureScore: 68,
    propagationScore: 58,
    confidencePct: 79,
    modeledExposureUsdM: 18.9,
    drivers: [
      { factor: 'Probability', value: '52.3%', source: 'Market Consensus', contribution: 15, description: 'High probability of elevated delinquency in suburban & CBD office debt' },
      { factor: 'Severity', value: '76 / 100', source: 'Risk Severity Model', contribution: 22, description: 'Loan loss reserves (CECL) required under distress restructuring' },
      { factor: 'Exposure', value: '68 / 100', source: 'Company Exposure Model', contribution: 17, description: '$18.9M in non-recourse senior office mortgages and CMBS mezzanine' },
      { factor: 'Propagation', value: '58 / 100', source: 'Transmission Graph', contribution: 11, description: 'Spillover to regional bank syndication partners and municipal tax bases' },
      { factor: 'Confidence', value: '79%', source: 'Data + Relationship Confidence', contribution: 6, description: 'Trepp and Real Capital Analytics verified tracking indices' },
    ],
    changeDecomposition: {
      probabilityChange: -2,
      exposureChange: 0,
      propagationChange: -1,
      confidenceChange: 1,
      netChange: -2,
    },
    whyExplanation: {
      summary: 'Substantial market expectation of office mortgage stress and concentrated credit exposure trigger a high-risk rating.',
      primaryDrivers: [
        { id: 1, title: 'Elevated baseline probability', detail: 'Over 52% probability priced in across Kalshi commercial real estate index contracts.' },
        { id: 2, title: 'Allowance provision acceleration', detail: 'Potential addition to allowance for loan and lease losses (ALLL).' },
      ],
    },
    methodologyVersion: 'v0.1',
    calculatedAt: '2 hours ago',
  },
  {
    id: 'RS-CYBER-INFRA',
    eventId: 'CE-000671',
    eventTitle: 'Critical SWIFT interbank network automated settlement outage',
    canonicalEventId: 'CE-000671',
    riskId: 'RSK-CYBER-OPERATIONAL',
    riskName: 'Cyber & Operational Risk',
    riskCategory: 'Operational Risk',
    companyId: 'JPMC',
    companyName: 'JPMorgan Chase & Co.',
    score: 65,
    category: 'MEDIUM',
    scoreChange24h: 1,
    probabilityPct: 14.2,
    severity: 96,
    exposureScore: 91,
    propagationScore: 84,
    confidencePct: 86,
    modeledExposureUsdM: 41.0,
    drivers: [
      { factor: 'Probability', value: '14.2%', source: 'Market Consensus', contribution: 4, description: 'Low probability tail risk event' },
      { factor: 'Severity', value: '96 / 100', source: 'Risk Severity Model', contribution: 29, description: 'Catastrophic settlement friction and intraday liquidity gridlock' },
      { factor: 'Exposure', value: '91 / 100', source: 'Company Exposure Model', contribution: 22, description: '$41.0M potential operational collateral and failed trade penalties' },
      { factor: 'Propagation', value: '84 / 100', source: 'Transmission Graph', contribution: 16, description: 'Systemic contagion through correspondent banking network' },
      { factor: 'Confidence', value: '86%', source: 'Data + Relationship Confidence', contribution: -6, description: 'Historical outage baselines with established BIS standards' },
    ],
    changeDecomposition: {
      probabilityChange: 1,
      exposureChange: 0,
      propagationChange: 0,
      confidenceChange: 0,
      netChange: 1,
    },
    whyExplanation: {
      summary: 'Catastrophic severity and extreme balance sheet exposure are balanced by low market likelihood, creating an active vigilance item.',
      primaryDrivers: [
        { id: 1, title: 'Extreme operational severity', detail: 'Intraday payments standstill threatens contractual settlement finality.' },
        { id: 2, title: 'High propagation velocity', detail: 'Cross-border interbank liabilities freeze within minutes of gateway disruption.' },
      ],
    },
    methodologyVersion: 'v0.1',
    calculatedAt: '3 hours ago',
  },
];

export const riskScoreHistoryData: Record<string, {
  '24H': RiskScoreHistoryPoint[];
  '7D': RiskScoreHistoryPoint[];
  '30D': RiskScoreHistoryPoint[];
  '90D': RiskScoreHistoryPoint[];
}> = {
  'RS-FED-RATE-CUT': {
    '24H': [
      { timestamp: '2026-09-29T10:00:00Z', label: '10:00', score: 69, probabilityPct: 60.1, note: 'Initial session score' },
      { timestamp: '2026-09-29T14:00:00Z', label: '14:00', score: 70, probabilityPct: 61.4 },
      { timestamp: '2026-09-29T18:00:00Z', label: '18:00', score: 71, probabilityPct: 62.0 },
      { timestamp: '2026-09-29T22:00:00Z', label: '22:00', score: 72, probabilityPct: 62.8 },
      { timestamp: '2026-09-30T06:00:00Z', label: '06:00', score: 74, probabilityPct: 64.2, note: 'European trading volume pickup' },
      { timestamp: '2026-09-30T09:44:00Z', label: '09:44', score: 76, probabilityPct: 65.5, note: 'PCE release surge' },
      { timestamp: '2026-09-30T11:05:00Z', label: '11:05', score: 78, probabilityPct: 66.1, note: 'Current score (+9 24h)' },
    ],
    '7D': [
      { timestamp: '2026-09-24T00:00:00Z', label: 'Sep 24', score: 62, probabilityPct: 53.0 },
      { timestamp: '2026-09-25T00:00:00Z', label: 'Sep 25', score: 64, probabilityPct: 55.4 },
      { timestamp: '2026-09-26T00:00:00Z', label: 'Sep 26', score: 65, probabilityPct: 56.8 },
      { timestamp: '2026-09-27T00:00:00Z', label: 'Sep 27', score: 66, probabilityPct: 57.2 },
      { timestamp: '2026-09-28T00:00:00Z', label: 'Sep 28', score: 67, probabilityPct: 58.5 },
      { timestamp: '2026-09-29T00:00:00Z', label: 'Sep 29', score: 69, probabilityPct: 60.1 },
      { timestamp: '2026-09-30T00:00:00Z', label: 'Sep 30', score: 78, probabilityPct: 66.1 },
    ],
    '30D': [
      { timestamp: '2026-09-01T00:00:00Z', label: 'Sep 01', score: 54, probabilityPct: 44.0 },
      { timestamp: '2026-09-08T00:00:00Z', label: 'Sep 08', score: 58, probabilityPct: 48.2 },
      { timestamp: '2026-09-15T00:00:00Z', label: 'Sep 15', score: 61, probabilityPct: 52.0 },
      { timestamp: '2026-09-22T00:00:00Z', label: 'Sep 22', score: 63, probabilityPct: 54.5 },
      { timestamp: '2026-09-30T00:00:00Z', label: 'Sep 30', score: 78, probabilityPct: 66.1 },
    ],
    '90D': [
      { timestamp: '2026-07-01T00:00:00Z', label: 'Jul 01', score: 48, probabilityPct: 38.0 },
      { timestamp: '2026-07-20T00:00:00Z', label: 'Jul 20', score: 50, probabilityPct: 40.5 },
      { timestamp: '2026-08-10T00:00:00Z', label: 'Aug 10', score: 52, probabilityPct: 42.1 },
      { timestamp: '2026-08-30T00:00:00Z', label: 'Aug 30', score: 55, probabilityPct: 45.8 },
      { timestamp: '2026-09-30T00:00:00Z', label: 'Sep 30', score: 78, probabilityPct: 66.1 },
    ],
  },
};

export const significantEventsLogs: SignificantEventLog[] = [
  { time: '09:42', title: 'Probability increased', category: 'MARKET', description: 'Kalshi contract volume spiked by $840k after headline core PCE inflation print.' },
  { time: '09:44', title: 'Consensus updated', category: 'CONSENSUS', description: 'Weighted cross-venue market consensus jumped from 61.2% to 66.1%.' },
  { time: '10:12', title: 'Exposure model updated', category: 'EXPOSURE', description: 'Treasury ALM portfolio duration sensitivity revised with refreshed mortgage prepayment curve.' },
  { time: '11:05', title: 'Risk score increased', category: 'SCORE', description: 'Composite Risk Score re-evaluated from 69 to 78 (+9 points, HIGH tier).' },
];

export const primaryImpactDetail: ImpactResult = {
  id: 'IMP-FED-RATE-CUT',
  eventId: 'CE-000184',
  eventTitle: 'Federal Reserve cuts benchmark rate by ≥50 bps before March 2027',
  riskName: 'Interest Rate Risk',
  companyName: 'JPMorgan Chase & Co.',
  activeScenario: 'DOWNSIDE',
  scenarioName: 'Downside Scenario',
  scenarioMagnitudePct: 65,
  probabilityPct: 66.1,
  modeledExposureUsdM: 27.8,
  potentialImpactUsdM: 18.4,
  expectedImpactUsdM: 12.1,
  baseImpactUsdM: 8.2,
  downsideImpactUsdM: 18.4,
  severeImpactUsdM: 31.7,
  upsideImpactUsdM: 3.9,
  transmissionMultiplier: 1.0,
  confidence: 'MEDIUM',
  confidencePct: 87,
  impactRange: {
    lowUsdM: 12.7,
    baseUsdM: 18.4,
    highUsdM: 24.9,
    confidence: 'MEDIUM',
    reason: 'Exposure mapping is strong across Commercial Banking, but scenario magnitude and deposit repricing lag remain subject to empirical variance.',
  },
  byBusinessUnit: [
    {
      unitId: 'BU-COMM-BANK',
      unitName: 'Commercial Banking',
      exposureUsdM: 6.8,
      modeledImpactUsdM: -4.4,
      direction: 'NEGATIVE',
      note: 'Compressed net interest margin on floating-rate corporate credit facility renewals.',
    },
    {
      unitId: 'BU-MARKETS',
      unitName: 'Markets (Fixed Income & Currencies)',
      exposureUsdM: 5.1,
      modeledImpactUsdM: 3.3,
      direction: 'MIXED',
      note: 'Mark-to-market trading inventory gains partially offset by yield curve steepening volatility.',
    },
    {
      unitId: 'BU-AWM',
      unitName: 'Asset & Wealth Management',
      exposureUsdM: 3.7,
      modeledImpactUsdM: 2.1,
      direction: 'MIXED',
      note: 'Fee expansion on surging liquidity inflows into fixed income and equity funds.',
    },
    {
      unitId: 'BU-CONS-BANK',
      unitName: 'Consumer Banking',
      exposureUsdM: 2.8,
      modeledImpactUsdM: 1.7,
      direction: 'POSITIVE',
      note: 'Lower mortgage borrowing rates stimulate origination pipelines and refinancing fee velocity.',
    },
  ],
  byRiskCategory: [
    { riskCategory: 'Interest Rate Risk', modeledImpactUsdM: 11.2, sharePct: 60.9 },
    { riskCategory: 'Credit Risk', modeledImpactUsdM: 3.8, sharePct: 20.7 },
    { riskCategory: 'Liquidity Risk', modeledImpactUsdM: 2.1, sharePct: 11.4 },
    { riskCategory: 'Other / Residual', modeledImpactUsdM: 1.3, sharePct: 7.0 },
  ],
  assumptions: [
    { factor: 'Probability', value: '66.1%', source: 'Market Consensus', note: 'Cross-venue weighted Polymarket & Kalshi pricing' },
    { factor: 'Exposure', value: '$27.8M', source: 'Company Exposure Model', note: 'EXP-00072 mapped across 4 business divisions' },
    { factor: 'Magnitude', value: '65%', source: 'Scenario Assumption', note: 'Downside scenario repricing pressure standard' },
    { factor: 'Transmission', value: '1.0x', source: 'Base Model', note: 'Linear rate cascade through prime lending rates' },
    { factor: 'Confidence', value: '87%', source: 'Data Quality Layer', note: 'Verified Federal Reserve H.15 statutory oracle' },
  ],
  changeDecomposition: {
    probabilityUsdM: 2.4,
    exposureUsdM: 1.8,
    scenarioUsdM: 1.2,
    transmissionUsdM: 0.9,
    modelAdjustmentUsdM: -0.3,
    netChangeUsdM: 6.0,
  },
  modelVersions: {
    riskScoreModel: 'v0.1',
    exposureModel: 'v0.1',
    scenarioModel: 'v0.1',
    calculationEngine: 'v0.1',
  },
  calculatedAt: '2 minutes ago',
};

export const sensitivityAssumptions: SensitivityAssumption[] = [
  { name: 'Probability', level: 'HIGH', bars: 9, rationale: 'Shifts in market consensus directly scale expected impact and trigger threshold transitions.' },
  { name: 'Exposure', level: 'HIGH', bars: 8, rationale: 'Asset/liability baseline size linearly multiplies total financial consequence.' },
  { name: 'Scenario Magnitude', level: 'MEDIUM', bars: 6, rationale: 'Severity assumption governs spread contraction elasticity.' },
  { name: 'Transmission', level: 'MEDIUM', bars: 5, rationale: 'Network cascade velocity across collateralized funding markets.' },
  { name: 'Confidence', level: 'LOW', bars: 3, rationale: 'Operates as an evidence damper rather than primary magnitude multiplier.' },
];

export const sensitivityMatrix: SensitivityMatrixData = {
  probabilities: [40, 60, 80],
  magnitudes: [30, 60, 100],
  cells: [
    [
      { probabilityPct: 40, magnitudePct: 30, modeledImpactUsdM: 5.2 },
      { probabilityPct: 60, magnitudePct: 30, modeledImpactUsdM: 7.8 },
      { probabilityPct: 80, magnitudePct: 30, modeledImpactUsdM: 10.4 },
    ],
    [
      { probabilityPct: 40, magnitudePct: 60, modeledImpactUsdM: 10.0 },
      { probabilityPct: 60, magnitudePct: 60, modeledImpactUsdM: 15.1 },
      { probabilityPct: 80, magnitudePct: 60, modeledImpactUsdM: 20.2 },
    ],
    [
      { probabilityPct: 40, magnitudePct: 100, modeledImpactUsdM: 16.7 },
      { probabilityPct: 60, magnitudePct: 100, modeledImpactUsdM: 25.0 },
      { probabilityPct: 80, magnitudePct: 100, modeledImpactUsdM: 33.4 },
    ],
  ],
};

export const probabilityImpactCurvePoints = [
  { probabilityPct: 40, impactUsdM: 7.2 },
  { probabilityPct: 50, impactUsdM: 9.1 },
  { probabilityPct: 60, impactUsdM: 10.9 },
  { probabilityPct: 70, impactUsdM: 12.7 },
  { probabilityPct: 80, impactUsdM: 14.6 },
];

export const calculationProvenanceMock: CalculationProvenance = {
  calculationId: 'CALC-2026-0930-8472',
  eventId: 'CE-000184',
  eventTitle: 'Federal Reserve cuts benchmark rate by ≥50 bps before March 2027',
  canonicalEventId: 'CE-000184',
  consensusProbabilityPct: 66.1,
  identityConfidencePct: 94.2,
  riskRelationshipConfidencePct: 87,
  exposureModelId: 'EXP-00072',
  exposureModelUsdM: 27.8,
  exposureConfidencePct: 82,
  scenario: 'Downside Scenario',
  scenarioMagnitudePct: 65,
  riskScore: 78,
  potentialImpactUsdM: 18.4,
  expectedImpactUsdM: 12.1,
  modelVersions: {
    riskScoreModel: 'v0.1',
    exposureModel: 'v0.1',
    scenarioModel: 'v0.1',
    calculationEngine: 'v0.1',
  },
  calculatedAt: '2026-09-30 11:05:14 UTC',
  auditTrail: [
    { step: 'Event Ingestion & Normalization', status: 'VERIFIED', detail: 'Ingested 6 contracts across Polymarket and Kalshi. Match confidence 94.2%.' },
    { step: 'Market Consensus Synthesis', status: 'VERIFIED', detail: 'Volume-weighted Bayesian blend computed consensus probability P_M = 66.1%.' },
    { step: 'Risk Relationship Mapping', status: 'VERIFIED', detail: 'Direct causal tie to Interest Rate Risk confirmed with 87% relationship confidence.' },
    { step: 'Transmission Propagation', status: 'VERIFIED', detail: 'Propagated through 4 business units and 2 secondary liquidity channels.' },
    { step: 'Exposure Model Calculation', status: 'PASS', detail: 'EXP-00072 applied to balance sheet baseline, yielding $27.8M gross exposure.' },
    { step: 'Scenario Magnitude Application', status: 'CALCULATED', detail: 'Downside 65% magnitude parameter executed, outputting $18.4M potential impact.' },
  ],
};

export const impactAggregationSummary: ImpactAggregationSummary = {
  companyId: 'JPMC',
  companyName: 'JPMorgan Chase & Co.',
  totalModeledExposureUsdM: 142.6,
  expectedImpactUsdM: 68.4,
  downsideImpactUsdM: 96.2,
  grossModeledImpactUsdM: 48.2,
  overlapAdjustmentUsdM: -16.5,
  adjustedModeledImpactUsdM: 31.7,
  byRisk: [
    { risk: 'Market Risk', amountUsdM: 42.7, percentage: 30.0 },
    { risk: 'Credit Risk', amountUsdM: 31.4, percentage: 22.0 },
    { risk: 'Regulatory Risk', amountUsdM: 24.8, percentage: 17.4 },
    { risk: 'Liquidity Risk', amountUsdM: 18.1, percentage: 12.7 },
    { risk: 'Other / Operational', amountUsdM: 25.6, percentage: 17.9 },
  ],
  byBusinessUnit: [
    { unit: 'Commercial Banking', amountUsdM: 44.8, percentage: 31.4 },
    { unit: 'Corporate & Investment Bank', amountUsdM: 39.2, percentage: 27.5 },
    { unit: 'Asset & Wealth Management', amountUsdM: 32.5, percentage: 22.8 },
    { unit: 'Consumer & Community Banking', amountUsdM: 26.1, percentage: 18.3 },
  ],
  byEvent: [
    { eventId: 'CE-000184', eventTitle: 'Fed cuts benchmark rate ≥50bps', risk: 'Interest Rate Risk', exposureUsdM: 27.8, expectedImpactUsdM: 12.1, downsideImpactUsdM: 18.4 },
    { eventId: 'CE-000219', eventTitle: 'Brent crude oil >$120/barrel', risk: 'Commodity Risk', exposureUsdM: 19.2, expectedImpactUsdM: 7.4, downsideImpactUsdM: 13.1 },
    { eventId: 'CE-000304', eventTitle: 'Enhanced G-SIB capital rule', risk: 'Regulatory Risk', exposureUsdM: 34.7, expectedImpactUsdM: 11.8, downsideImpactUsdM: 22.6 },
    { eventId: 'CE-000412', eventTitle: 'Semiconductor foundry disruption', risk: 'Supply Chain Risk', exposureUsdM: 22.4, expectedImpactUsdM: 6.6, downsideImpactUsdM: 15.2 },
    { eventId: 'CE-000529', eventTitle: 'Tier-1 office CRE defaults >8.5%', risk: 'Credit Risk', exposureUsdM: 18.9, expectedImpactUsdM: 9.9, downsideImpactUsdM: 14.8 },
    { eventId: 'CE-000671', eventTitle: 'SWIFT automated settlement outage', risk: 'Operational Risk', exposureUsdM: 41.0, expectedImpactUsdM: 5.8, downsideImpactUsdM: 26.5 },
  ],
  overlapIntegrity: {
    sharedRisk: 'Interest Rate Risk',
    eventsCount: 3,
    naiveUsdM: 48.2,
    adjustedUsdM: 31.7,
    overlapUsdM: 16.5,
    affectedEvents: [
      'CE-000184: Fed cuts benchmark rate ≥50bps',
      'CE-000192: 10Y/2Y Treasury yield curve uninverts by >40bps',
      'CE-000205: US bank deposit beta exceeds 0.58 across retail balances',
    ],
    explanation: 'Naive summation double-counts overlapping loan prepayment and deposit duration sensitivity. Exogen correlation matrix discounts correlated rate trajectories.',
  },
  correlatedRisks: [
    {
      id: 'CORR-01',
      title: 'Monetary Easing & Asset Repricing Cluster',
      risks: ['Fed rate cut', 'Yield curve steepening', 'Deposit repricing'],
      driverSummary: 'Shared driver: Federal Open Market Committee rate path revisions impacting asset liability management.',
    },
    {
      id: 'CORR-02',
      title: 'Energy Shock & Transportation Credit Stress',
      risks: ['Crude oil >$120', 'Headline CPI resurgence', 'Airline debt default'],
      driverSummary: 'Shared driver: Middle Eastern supply restriction cascading through refined fuel benchmarks.',
    },
  ],
};

// API Service Abstractions
export function getRiskScoresList(): RiskScoreResult[] {
  return riskScoresList;
}

export function getRiskScore(riskIdOrEventId: string): RiskScoreResult | undefined {
  return (
    riskScoresList.find((r) => r.id === riskIdOrEventId || r.eventId === riskIdOrEventId || r.canonicalEventId === riskIdOrEventId) ||
    riskScoresList[0]
  );
}

export function getRiskScoreHistory(riskId: string, range: '24H' | '7D' | '30D' | '90D' = '24H'): RiskScoreHistoryPoint[] {
  const history = riskScoreHistoryData[riskId] || riskScoreHistoryData['RS-FED-RATE-CUT'];
  return history[range] || history['24H'];
}

export function getImpactDetail(impactIdOrEventId?: string): ImpactResult {
  return primaryImpactDetail;
}

export function getCalculationProvenance(calculationId?: string): CalculationProvenance {
  return calculationProvenanceMock;
}

export function getImpactAggregation(companyId: string = 'JPMC'): ImpactAggregationSummary {
  return impactAggregationSummary;
}
