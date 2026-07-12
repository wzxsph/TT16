import {
  COMMERCIAL_CONTENT_VERSION,
  COMMERCIAL_QUESTIONS,
  COMMERCIAL_QUESTIONNAIRE_VERSION,
  COMMERCIAL_SCORING_VERSION,
  type CommercialQuestionId,
  type PressureKey,
} from '../data/commercialQuestions'
import { DIMENSION_KEYS, type AnswerValue, type DimensionKey, type DimensionLetter } from '../data/questions'
import { PROFILES, type Profile, type TypeCode } from '../data/profiles'

export type CommercialAnswers = Record<string, number | null>

export interface CommercialDimensionScore {
  key: DimensionKey
  leftLetter: DimensionLetter
  rightLetter: DimensionLetter
  leftPercent: number
  rightPercent: number
  chosenLetter: DimensionLetter
  isBoundary: boolean
}

export interface CommercialPressureScore {
  key: PressureKey
  score: number | null
  level: 'low' | 'medium' | 'high' | 'unknown'
  name: string
  label: string
  advice: string
}

export type CommercialQualityLevel = 'eligible' | 'needs_review'

export interface CommercialQuality {
  level: CommercialQualityLevel
  requiredAnsweredCount: number
  requiredQuestionCount: number
  coreAnsweredCount: number
  consistencyPercent: number | null
  unansweredRequiredQuestionIds: CommercialQuestionId[]
  invalidAnswerIds: CommercialQuestionId[]
  warnings: string[]
}

export interface CommercialAssessmentScore {
  typeCode: TypeCode
  profile: Profile
  dimensions: CommercialDimensionScore[]
  pressure: CommercialPressureScore[]
  quality: CommercialQuality
  stability: 'stable' | 'one_boundary' | 'multiple_boundaries'
  versions: {
    questionnaire: string
    scoring: string
    content: string
  }
}

interface DimensionDefinition {
  key: DimensionKey
  leftLetter: DimensionLetter
  rightLetter: DimensionLetter
  anchorQuestionId: CommercialQuestionId
}

const DIMENSION_DEFINITIONS: readonly DimensionDefinition[] = [
  { key: 'RS', leftLetter: 'R', rightLetter: 'S', anchorQuestionId: 'C04' },
  { key: 'HT', leftLetter: 'H', rightLetter: 'T', anchorQuestionId: 'C05' },
  { key: 'DA', leftLetter: 'D', rightLetter: 'A', anchorQuestionId: 'C09' },
  { key: 'PF', leftLetter: 'P', rightLetter: 'F', anchorQuestionId: 'C13' },
]

function isAnswerValue(value: unknown): value is AnswerValue {
  return typeof value === 'number' && Number.isInteger(value) && value >= -2 && value <= 2
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value))
}

function scoreDimension(
  definition: DimensionDefinition,
  answers: CommercialAnswers,
): CommercialDimensionScore {
  let contribution = 0
  let maximumMagnitude = 0

  for (const question of COMMERCIAL_QUESTIONS) {
    if (question.kind !== 'dimension' || question.dimension !== definition.key) continue

    const answer = answers[question.id]
    if (!isAnswerValue(answer)) continue

    contribution += answer * question.direction * question.weight
    maximumMagnitude += 2 * question.weight
  }

  const rawScore = maximumMagnitude === 0 ? 0 : contribution / maximumMagnitude
  const rightPercent = clamp(Math.round((rawScore + 1) * 50), 0, 100)
  const leftPercent = 100 - rightPercent
  let chosenLetter = leftPercent >= rightPercent ? definition.leftLetter : definition.rightLetter

  if (leftPercent === rightPercent) {
    const anchorAnswer = answers[definition.anchorQuestionId]
    const anchorQuestion = COMMERCIAL_QUESTIONS.find(
      (question) => question.id === definition.anchorQuestionId,
    )

    if (
      isAnswerValue(anchorAnswer) &&
      anchorQuestion?.kind === 'dimension' &&
      anchorAnswer * anchorQuestion.direction > 0
    ) {
      chosenLetter = definition.rightLetter
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
  }
}

function calculateConsistency(answers: CommercialAnswers): number | null {
  const agreementScores: number[] = []

  for (const question of COMMERCIAL_QUESTIONS) {
    if (question.kind !== 'consistency') continue

    const consistencyAnswer = answers[question.id]
    if (!isAnswerValue(consistencyAnswer)) continue

    const comparisonAnswers = question.comparisonQuestionIds
      .map((questionId) => answers[questionId])
      .filter(isAnswerValue)

    if (comparisonAnswers.length === 0) continue

    const comparisonMean =
      comparisonAnswers.reduce<number>((sum, answer) => sum + answer, 0) /
      comparisonAnswers.length
    const difference = Math.abs(consistencyAnswer - comparisonMean)
    agreementScores.push(clamp(Math.round((1 - difference / 4) * 100), 0, 100))
  }

  if (agreementScores.length === 0) return null

  return Math.round(
    agreementScores.reduce((sum, score) => sum + score, 0) / agreementScores.length,
  )
}

function assessQuality(answers: CommercialAnswers): CommercialQuality {
  const unansweredRequiredQuestionIds: CommercialQuestionId[] = []
  const invalidAnswerIds: CommercialQuestionId[] = []
  let requiredAnsweredCount = 0
  let coreAnsweredCount = 0

  const requiredQuestions = COMMERCIAL_QUESTIONS.filter((question) => !question.allowNA)

  for (const question of COMMERCIAL_QUESTIONS) {
    const answer = answers[question.id]

    if (answer === null || typeof answer === 'undefined') {
      if (!question.allowNA) unansweredRequiredQuestionIds.push(question.id)
      continue
    }

    if (!isAnswerValue(answer)) {
      invalidAnswerIds.push(question.id)
      continue
    }

    if (!question.allowNA) requiredAnsweredCount += 1
    if (question.kind === 'dimension') coreAnsweredCount += 1
  }

  const consistencyPercent = calculateConsistency(answers)
  const warnings: string[] = []

  if (unansweredRequiredQuestionIds.length > 0) {
    warnings.push('仍有必答题未完成，请补答后再生成报告。')
  }
  if (invalidAnswerIds.length > 0) {
    warnings.push('检测到超出五档范围的答案，请重新选择。')
  }
  if (consistencyPercent !== null && consistencyPercent < 50) {
    warnings.push('部分平行情境的回答差异较大，建议免费复核相关题目后再生成报告。')
  }

  const eligible =
    requiredAnsweredCount === requiredQuestions.length &&
    invalidAnswerIds.length === 0 &&
    consistencyPercent !== null &&
    consistencyPercent >= 50

  return {
    level: eligible ? 'eligible' : 'needs_review',
    requiredAnsweredCount,
    requiredQuestionCount: requiredQuestions.length,
    coreAnsweredCount,
    consistencyPercent,
    unansweredRequiredQuestionIds,
    invalidAnswerIds,
    warnings,
  }
}

function scorePressure(answers: CommercialAnswers): CommercialPressureScore[] {
  const content: Record<
    PressureKey,
    { name: string; labels: readonly [string, string, string]; advice: string }
  > = {
    missed_rally: {
      name: '踏空反应',
      labels: ['能保持观察', '会感到拉扯', '容易追赶行情'],
      advice: '遇到暴涨和群聊刺激时，先经过固定冷静期，再按原计划决定是否参与。',
    },
    drawdown: {
      name: '回撤反应',
      labels: ['倾向按预案复核', '压力下会摇摆', '容易先卖出求安心'],
      advice: '在平静时写好回撤预案；波动发生后先逐项复核，再决定是否调整。',
    },
  }

  return COMMERCIAL_QUESTIONS.filter((question) => question.kind === 'pressure').map(
    (question) => {
      const answer = answers[question.id]
      if (!isAnswerValue(answer)) {
        return {
          key: question.pressureKey,
          score: null,
          level: 'unknown' as const,
          name: content[question.pressureKey].name,
          label: '未经历，使用通用情境说明',
          advice: content[question.pressureKey].advice,
        }
      }

      const score = (answer + 2) * 25
      const level = score <= 39 ? 'low' : score <= 69 ? 'medium' : 'high'
      const labelIndex = level === 'low' ? 0 : level === 'medium' ? 1 : 2
      return {
        key: question.pressureKey,
        score,
        level,
        name: content[question.pressureKey].name,
        label: content[question.pressureKey].labels[labelIndex],
        advice: content[question.pressureKey].advice,
      }
    },
  )
}

/**
 * Deterministically scores the commercial 20-item model.
 *
 * The function is intentionally pure so the same module can run in tests and
 * the edge worker. Production clients must treat the server result as the
 * authority and must not receive this object before entitlement is granted.
 */
export function scoreCommercialAssessment(
  answers: CommercialAnswers,
): CommercialAssessmentScore {
  const dimensions = DIMENSION_DEFINITIONS.map((definition) =>
    scoreDimension(definition, answers),
  )
  const typeCode = dimensions.map((dimension) => dimension.chosenLetter).join('') as TypeCode
  const boundaryCount = dimensions.filter((dimension) => dimension.isBoundary).length

  return {
    typeCode,
    profile: PROFILES[typeCode],
    dimensions,
    pressure: scorePressure(answers),
    quality: assessQuality(answers),
    stability:
      boundaryCount === 0
        ? 'stable'
        : boundaryCount === 1
          ? 'one_boundary'
          : 'multiple_boundaries',
    versions: {
      questionnaire: COMMERCIAL_QUESTIONNAIRE_VERSION,
      scoring: COMMERCIAL_SCORING_VERSION,
      content: COMMERCIAL_CONTENT_VERSION,
    },
  }
}

export function isCommercialAnswerValue(value: unknown): value is AnswerValue {
  return isAnswerValue(value)
}

export function commercialDimensionQuestionCounts(): Record<DimensionKey, number> {
  return Object.fromEntries(
    DIMENSION_KEYS.map((key) => [
      key,
      COMMERCIAL_QUESTIONS.filter(
        (question) => question.kind === 'dimension' && question.dimension === key,
      ).length,
    ]),
  ) as Record<DimensionKey, number>
}
