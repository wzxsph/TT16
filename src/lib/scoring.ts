import {
  DIMENSION_KEYS,
  QUESTIONS,
  type AnswerValue,
  type BadgeKey,
  type DimensionKey,
  type DimensionLetter,
  type QuestionId,
} from "../data/questions";
import { PROFILES, type Profile, type TypeCode } from "../data/profiles";

export type AssessmentAnswers = Record<string, number | null>;

export interface DimensionDefinition {
  key: DimensionKey;
  leftLetter: DimensionLetter;
  rightLetter: DimensionLetter;
  anchorQuestionId: QuestionId;
}

export const DIMENSION_DEFINITIONS: readonly DimensionDefinition[] = [
  { key: "RS", leftLetter: "R", rightLetter: "S", anchorQuestionId: "Q05" },
  { key: "HT", leftLetter: "H", rightLetter: "T", anchorQuestionId: "Q07" },
  { key: "DA", leftLetter: "D", rightLetter: "A", anchorQuestionId: "Q13" },
  { key: "PF", leftLetter: "P", rightLetter: "F", anchorQuestionId: "Q19" },
] as const;

export interface DimensionScore {
  key: DimensionKey;
  leftLetter: DimensionLetter;
  rightLetter: DimensionLetter;
  leftPercent: number;
  rightPercent: number;
  chosenLetter: DimensionLetter;
  isBoundary: boolean;
}

export type BadgeLevel = "low" | "medium" | "high";

export interface BadgeScore {
  key: BadgeKey;
  name: string;
  score: number;
  level: BadgeLevel;
  levelLabel: string;
  advice: string;
}

export type QualityLevel = "high" | "medium" | "low" | "insufficient";

export interface AssessmentQuality {
  level: QualityLevel;
  answeredCount: number;
  totalQuestions: number;
  coveragePercent: number;
  coreAnsweredCount: number;
  coreCoveragePercent: number;
  dimensionAnsweredCounts: Record<DimensionKey, number>;
  consistencyPercent: number | null;
  meetsMinimum: boolean;
  unansweredQuestionIds: QuestionId[];
  invalidAnswerIds: QuestionId[];
  warnings: string[];
}

export type AssessmentStability = "stable" | "one_boundary" | "multiple_boundaries";

export interface AssessmentScore {
  typeCode: TypeCode;
  profile: Profile;
  dimensions: DimensionScore[];
  badges: BadgeScore[];
  quality: AssessmentQuality;
  stability: AssessmentStability;
}

interface BadgeEvidence {
  questionId: QuestionId;
  weight: number;
  direction?: 1 | -1;
}

interface BadgeDefinition {
  key: BadgeKey;
  name: string;
  evidence: readonly BadgeEvidence[];
  levelLabels: readonly [string, string, string];
  advice: string;
}

/**
 * The dedicated badge item carries the most weight. Cross-items only provide
 * supporting evidence, so a stable personality preference is not treated as a
 * behavioural bias by itself.
 */
const BADGE_DEFINITIONS: readonly BadgeDefinition[] = [
  {
    key: "fomo",
    name: "从众 / FOMO",
    evidence: [
      { questionId: "Q25", weight: 2 },
      { questionId: "Q04", weight: 0.35 },
      { questionId: "Q15", weight: 0.35 },
      { questionId: "Q20", weight: 0.3 },
    ],
    levelLabels: ["低敏感", "中敏感", "高敏感"],
    advice: "遇到暴涨、热搜或群聊刺激时，先经过固定冷静期，再按原计划决定是否行动。",
  },
  {
    key: "loss_aversion",
    name: "损失厌恶",
    evidence: [
      { questionId: "Q26", weight: 2 },
      { questionId: "Q21", weight: 0.3 },
      { questionId: "Q17", weight: 0.2 },
      { questionId: "Q19", weight: 0.2 },
    ],
    levelLabels: ["低", "中", "高"],
    advice: "把买入成本与当前判断分开，优先检查原论点是否失效，而不是等待回本。",
  },
  {
    key: "confidence_calibration",
    name: "信心校准",
    evidence: [
      { questionId: "Q27", weight: 2 },
      { questionId: "Q14", weight: 0.8 },
      { questionId: "Q13", weight: 0.25 },
      { questionId: "Q16", weight: 0.25 },
    ],
    levelLabels: ["稳健", "偏高", "过热"],
    advice: "连续盈利后仍使用固定风险预算，让仓位增长由新增证据而不是近期手感决定。",
  },
  {
    key: "trading_impulse",
    name: "交易冲动",
    evidence: [
      { questionId: "Q28", weight: 2 },
      { questionId: "Q19", weight: 0.35 },
      { questionId: "Q20", weight: 0.25 },
      { questionId: "Q21", weight: 0.25 },
      { questionId: "Q24", weight: 0.25 },
    ],
    levelLabels: ["稳定", "波动", "高风险"],
    advice: "止损或连续亏损后执行冷静期，复盘完成前不通过下一笔交易追回损失。",
  },
  {
    key: "drawdown_composure",
    name: "回撤镇定",
    evidence: [
      { questionId: "Q29", weight: 2 },
      { questionId: "Q28", weight: 0.4 },
      { questionId: "Q17", weight: 0.25, direction: -1 },
      { questionId: "Q19", weight: 0.2 },
    ],
    levelLabels: ["冷静", "紧张", "易失控"],
    advice: "在平静时写好回撤预案；波动发生后先逐项复核，再决定是否调整。",
  },
  {
    key: "review_consistency",
    name: "复盘一致性",
    evidence: [
      { questionId: "Q30", weight: 2 },
      { questionId: "Q22", weight: 1 },
      { questionId: "Q19", weight: 0.5 },
      { questionId: "Q24", weight: 0.2 },
    ],
    levelLabels: ["系统", "偶尔", "薄弱"],
    advice: "记录买卖理由、退出条件和过程质量，把一次结果与决策过程分开评价。",
  },
] as const;

function isAnswerValue(value: unknown): value is AnswerValue {
  return typeof value === "number" && Number.isInteger(value) && value >= -2 && value <= 2;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

function scoreDimension(
  definition: DimensionDefinition,
  answers: AssessmentAnswers,
): DimensionScore {
  let contribution = 0;
  let maximumMagnitude = 0;

  for (const question of QUESTIONS) {
    if (question.kind !== "dimension" || question.dimension !== definition.key) {
      continue;
    }

    const answer = answers[question.id];
    if (!isAnswerValue(answer)) {
      continue;
    }

    contribution += answer * question.direction * question.weight;
    maximumMagnitude += 2 * question.weight;
  }

  const rawScore = maximumMagnitude === 0 ? 0 : contribution / maximumMagnitude;
  const rightPercent = clamp(Math.round((rawScore + 1) * 50), 0, 100);
  const leftPercent = 100 - rightPercent;
  let chosenLetter =
    leftPercent >= rightPercent ? definition.leftLetter : definition.rightLetter;

  if (leftPercent === rightPercent) {
    const anchorAnswer = answers[definition.anchorQuestionId];
    const anchorQuestion = QUESTIONS.find(
      (question) => question.id === definition.anchorQuestionId,
    );

    if (
      isAnswerValue(anchorAnswer) &&
      anchorQuestion?.kind === "dimension" &&
      anchorAnswer * anchorQuestion.direction > 0
    ) {
      chosenLetter = definition.rightLetter;
    }
  }

  return {
    key: definition.key,
    leftLetter: definition.leftLetter,
    rightLetter: definition.rightLetter,
    leftPercent,
    rightPercent,
    chosenLetter,
    isBoundary: rightPercent >= 48 && rightPercent <= 52,
  };
}

function scoreBadge(definition: BadgeDefinition, answers: AssessmentAnswers): BadgeScore {
  let weightedScore = 0;
  let totalWeight = 0;

  for (const item of definition.evidence) {
    const answer = answers[item.questionId];
    if (!isAnswerValue(answer)) {
      continue;
    }

    const direction = item.direction ?? 1;
    const itemScore = (answer * direction + 2) * 25;
    weightedScore += itemScore * item.weight;
    totalWeight += item.weight;
  }

  // With no evidence, remain neutral instead of inventing a low or high bias.
  const score = totalWeight === 0 ? 50 : Math.round(weightedScore / totalWeight);
  const level: BadgeLevel = score <= 39 ? "low" : score <= 69 ? "medium" : "high";
  const labelIndex = level === "low" ? 0 : level === "medium" ? 1 : 2;

  return {
    key: definition.key,
    name: definition.name,
    score,
    level,
    levelLabel: definition.levelLabels[labelIndex],
    advice: definition.advice,
  };
}

function calculateConsistency(answers: AssessmentAnswers): number | null {
  const agreementScores: number[] = [];

  for (const question of QUESTIONS) {
    if (question.kind !== "consistency") {
      continue;
    }

    const consistencyAnswer = answers[question.id];
    if (!isAnswerValue(consistencyAnswer)) {
      continue;
    }

    const comparisonAnswers = question.comparisonQuestionIds
      .map((questionId) => answers[questionId])
      .filter(isAnswerValue);

    if (comparisonAnswers.length === 0) {
      continue;
    }

    const comparisonMean =
      comparisonAnswers.reduce<number>((sum, answer) => sum + answer, 0) /
      comparisonAnswers.length;
    const difference = Math.abs(consistencyAnswer - comparisonMean);
    agreementScores.push(clamp(Math.round((1 - difference / 4) * 100), 0, 100));
  }

  if (agreementScores.length === 0) {
    return null;
  }

  return Math.round(
    agreementScores.reduce((sum, score) => sum + score, 0) / agreementScores.length,
  );
}

function assessQuality(answers: AssessmentAnswers): AssessmentQuality {
  const unansweredQuestionIds: QuestionId[] = [];
  const invalidAnswerIds: QuestionId[] = [];
  const dimensionAnsweredCounts: Record<DimensionKey, number> = {
    RS: 0,
    HT: 0,
    DA: 0,
    PF: 0,
  };

  let answeredCount = 0;
  let coreAnsweredCount = 0;

  for (const question of QUESTIONS) {
    const value = answers[question.id];

    if (value === null || typeof value === "undefined") {
      unansweredQuestionIds.push(question.id);
      continue;
    }

    if (!isAnswerValue(value)) {
      invalidAnswerIds.push(question.id);
      continue;
    }

    answeredCount += 1;
    if (question.kind === "dimension") {
      coreAnsweredCount += 1;
      dimensionAnsweredCounts[question.dimension] += 1;
    }
  }

  const consistencyPercent = calculateConsistency(answers);
  const hasEnoughPerDimension = DIMENSION_KEYS.every(
    (key) => dimensionAnsweredCounts[key] >= 4,
  );
  const meetsMinimum = answeredCount >= 26 && hasEnoughPerDimension;
  const coveragePercent = Math.round((answeredCount / QUESTIONS.length) * 100);
  const coreQuestionCount = QUESTIONS.filter((question) => question.kind === "dimension").length;
  const coreCoveragePercent = Math.round((coreAnsweredCount / coreQuestionCount) * 100);
  const warnings: string[] = [];

  if (!hasEnoughPerDimension) {
    warnings.push("至少一个核心维度少于 4 个有效答案。请补答后再确认结果。");
  }
  if (answeredCount < 26) {
    warnings.push("总有效答案少于 26 个，当前结果覆盖不足。");
  }
  if (invalidAnswerIds.length > 0) {
    warnings.push("检测到超出 -2 到 2 五档范围的答案，已按未作答处理。");
  }
  if (consistencyPercent !== null && consistencyPercent < 50) {
    warnings.push("平行题回答差异较大，结果可能受近期情境或理解差异影响。");
  }

  let level: QualityLevel;
  if (!meetsMinimum) {
    level = "insufficient";
  } else if (coveragePercent < 88 || (consistencyPercent !== null && consistencyPercent < 50)) {
    level = "low";
  } else if (
    coveragePercent < 100 ||
    consistencyPercent === null ||
    consistencyPercent < 75
  ) {
    level = "medium";
  } else {
    level = "high";
  }

  return {
    level,
    answeredCount,
    totalQuestions: QUESTIONS.length,
    coveragePercent,
    coreAnsweredCount,
    coreCoveragePercent,
    dimensionAnsweredCounts,
    consistencyPercent,
    meetsMinimum,
    unansweredQuestionIds,
    invalidAnswerIds,
    warnings,
  };
}

/**
 * Deterministically scores an answer set against TT16 v0.1.
 *
 * - Missing, null, fractional, or out-of-range answers do not contribute.
 * - A perfect 50/50 dimension uses its configured anchor item; a neutral or
 *   unavailable anchor deterministically falls back to the left letter.
 * - The function never mutates the supplied answer map.
 */
export function scoreAssessment(answers: AssessmentAnswers): AssessmentScore {
  const dimensions = DIMENSION_DEFINITIONS.map((definition) =>
    scoreDimension(definition, answers),
  );
  const typeCode = dimensions.map((dimension) => dimension.chosenLetter).join("") as TypeCode;
  const boundaryCount = dimensions.filter((dimension) => dimension.isBoundary).length;
  const stability: AssessmentStability =
    boundaryCount === 0
      ? "stable"
      : boundaryCount === 1
        ? "one_boundary"
        : "multiple_boundaries";

  return {
    typeCode,
    profile: PROFILES[typeCode],
    dimensions,
    badges: BADGE_DEFINITIONS.map((definition) => scoreBadge(definition, answers)),
    quality: assessQuality(answers),
    stability,
  };
}
