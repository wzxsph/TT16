import { PROFILE_CODES, PROFILES, type TypeCode } from '../profiles.js'
import { DIMENSION_KEYS, type DimensionKey } from '../types.js'
import {
  GUESS_ITEMS_VERSION,
  GUESS_QUESTION_BY_ID,
  GUESS_QUESTIONS,
  type AdaptiveQuestionV1,
  type GuessContext,
} from './questions.js'

export const GUESS_POLICY_VERSION = 'tt16-guess-policy-1.0.0'
export const GUESS_SESSION_VERSION = 'guess-1'

export type GuessAnswer = -2 | -1 | 'unknown' | 1 | 2
export type GuessConfidence = 'high' | 'tentative'

export interface GuessCandidate {
  code: TypeCode
  belief: number
}

interface GuessTraceBase {
  sequence: number
  candidateSummary: readonly GuessCandidate[]
}

export interface GuessAnswerTraceEvent extends GuessTraceBase {
  kind: 'answer'
  questionId: string
  answer: GuessAnswer
  repeat: boolean
}

export interface GuessDecisionTraceEvent extends GuessTraceBase {
  kind: 'accept' | 'reject'
  typeCode: TypeCode
  confidence: GuessConfidence
}

export interface GuessContinueTraceEvent extends GuessTraceBase {
  kind: 'continue'
}

export type GuessTraceEvent =
  | GuessAnswerTraceEvent
  | GuessDecisionTraceEvent
  | GuessContinueTraceEvent

export interface GuessSessionV1 {
  version: typeof GUESS_SESSION_VERSION
  itemsVersion: typeof GUESS_ITEMS_VERSION
  policyVersion: typeof GUESS_POLICY_VERSION
  seed: string
  events: readonly GuessTraceEvent[]
}

export type GuessEvent =
  | { kind: 'answer'; questionId: string; answer: GuessAnswer }
  | { kind: 'accept'; typeCode: TypeCode }
  | { kind: 'reject'; typeCode: TypeCode }
  | { kind: 'continue' }

export interface GuessQuestionAction {
  kind: 'question'
  question: AdaptiveQuestionV1
  answeredCount: number
  effectiveCount: number
  excludedCount: number
  isRepeat: boolean
}

export interface GuessConfirmationAction {
  kind: 'confirmation'
  code: TypeCode
  alternativeCode: TypeCode | null
  confidence: GuessConfidence
  reasons: readonly [string, string]
  answeredCount: number
  excludedCount: number
}

export interface GuessCompleteAction {
  kind: 'complete'
  code: TypeCode
}

export interface GuessInsufficientAction {
  kind: 'insufficient'
  answeredCount: number
  effectiveCount: number
  excludedCount: number
  canContinue: boolean
  reason: 'too_many_unknowns' | 'question_pool'
}

export interface GuessExhaustedAction {
  kind: 'exhausted'
  answeredCount: number
  excludedCount: number
}

export type GuessAction =
  | GuessQuestionAction
  | GuessConfirmationAction
  | GuessCompleteAction
  | GuessInsufficientAction
  | GuessExhaustedAction

export interface GuessCardModel {
  code: TypeCode
  name: string
  tagline: string
  group: string
  keywords: readonly string[]
  reasons: readonly [string, string]
  label: '快速猜型 · 娱乐结果'
  disclaimer: string
}

type BeliefMap = Record<TypeCode, number>

interface DerivedSession {
  beliefs: BeliefMap
  candidates: GuessCandidate[]
  rejected: Set<TypeCode>
  acceptedCode: TypeCode | null
  answeredCount: number
  effectiveCount: number
  segmentAnsweredCount: number
  segmentEffectiveCount: number
  coverage: Record<DimensionKey, number>
  exposures: Map<string, number>
  lastQuestionPositions: Map<string, number>
  askedQuestions: AdaptiveQuestionV1[]
  recentContexts: GuessContext[]
  topHistory: TypeCode[]
  conflictedFamilies: Set<string>
  unresolvedConflictDimensions: Set<DimensionKey>
}

const derivedCache = new WeakMap<GuessSessionV1, DerivedSession>()
const actionCache = new WeakMap<GuessSessionV1, GuessAction>()

const ANSWERS: readonly GuessAnswer[] = [-2, -1, 'unknown', 1, 2]
const STRONG_FOR = [0.03, 0.07, 0.15, 0.30, 0.45] as const
const WEAK_FOR = [0.07, 0.18, 0.15, 0.35, 0.25] as const
const NEUTRAL = [0.21, 0.215, 0.15, 0.215, 0.21] as const
const WEAK_AGAINST = [...WEAK_FOR].reverse()
const STRONG_AGAINST = [...STRONG_FOR].reverse()

const DIMENSION_INDEX: Readonly<Record<DimensionKey, number>> = {
  RS: 0,
  HT: 1,
  DA: 2,
  PF: 3,
}

const LETTER_REASON: Readonly<Record<string, string>> = {
  R: '你更常先建立事实、逻辑与研究锚点',
  S: '你更常让走势和市场反馈参与判断',
  H: '你愿意给重要判断更长的验证时间',
  T: '你偏好用较短周期持续获取反馈',
  D: '你会优先保留缓冲并控制单点影响',
  A: '证据集中时，你愿意鲜明表达确信',
  P: '你更依赖事先写好的条件与步骤',
  F: '你更擅长随新信息及时调整路径',
}

function isTypeCode(value: unknown): value is TypeCode {
  return typeof value === 'string' && (PROFILE_CODES as readonly string[]).includes(value)
}

function isGuessAnswer(value: unknown): value is GuessAnswer {
  return value === 'unknown' || value === -2 || value === -1 || value === 1 || value === 2
}

function typeVector(code: TypeCode): Record<DimensionKey, -1 | 1> {
  return {
    RS: code[0] === 'S' ? 1 : -1,
    HT: code[1] === 'T' ? 1 : -1,
    DA: code[2] === 'A' ? 1 : -1,
    PF: code[3] === 'F' ? 1 : -1,
  }
}

function answerIndex(answer: GuessAnswer): number {
  return ANSWERS.indexOf(answer)
}

function alignmentFor(code: TypeCode, question: AdaptiveQuestionV1): number {
  const vector = typeVector(code)
  return DIMENSION_KEYS.reduce(
    (sum, dimension) => sum + (question.loadings[dimension] ?? 0) * vector[dimension],
    0,
  )
}

function likelihood(answer: GuessAnswer, code: TypeCode, question: AdaptiveQuestionV1): number {
  const alignment = alignmentFor(code, question)
  const distribution = alignment >= 0.75
    ? STRONG_FOR
    : alignment >= 0.25
      ? WEAK_FOR
      : alignment > -0.25
        ? NEUTRAL
        : alignment > -0.75
          ? WEAK_AGAINST
          : STRONG_AGAINST
  return distribution[answerIndex(answer)]
}

function uniformBeliefs(): BeliefMap {
  return Object.fromEntries(PROFILE_CODES.map((code) => [code, 1 / PROFILE_CODES.length])) as BeliefMap
}

function normalizeBeliefs(beliefs: BeliefMap): BeliefMap {
  const total = PROFILE_CODES.reduce((sum, code) => sum + beliefs[code], 0)
  if (total <= 0) return Object.fromEntries(PROFILE_CODES.map((code) => [code, 0])) as BeliefMap
  return Object.fromEntries(PROFILE_CODES.map((code) => [code, beliefs[code] / total])) as BeliefMap
}

function rankedCandidates(beliefs: BeliefMap): GuessCandidate[] {
  return PROFILE_CODES
    .map((code) => ({ code, belief: beliefs[code] }))
    .filter((candidate) => candidate.belief > 0)
    .sort((first, second) => second.belief - first.belief || first.code.localeCompare(second.code))
}

function candidateSummary(beliefs: BeliefMap): GuessCandidate[] {
  return rankedCandidates(beliefs).slice(0, 3).map((candidate) => ({
    code: candidate.code,
    belief: Math.round(candidate.belief * 1_000_000) / 1_000_000,
  }))
}

function updateBeliefs(
  beliefs: BeliefMap,
  question: AdaptiveQuestionV1,
  answer: GuessAnswer,
  weight: number,
): BeliefMap {
  if (answer === 'unknown') return beliefs
  const updated = { ...beliefs }
  for (const code of PROFILE_CODES) {
    if (beliefs[code] <= 0) continue
    updated[code] = beliefs[code] * likelihood(answer, code, question) ** weight
  }
  return normalizeBeliefs(updated)
}

function emptyCoverage(): Record<DimensionKey, number> {
  return { RS: 0, HT: 0, DA: 0, PF: 0 }
}

function computeDerivedSession(session: GuessSessionV1): DerivedSession {
  let beliefs = uniformBeliefs()
  const rejected = new Set<TypeCode>()
  const coverage = emptyCoverage()
  const exposures = new Map<string, number>()
  const lastQuestionPositions = new Map<string, number>()
  const askedQuestions: AdaptiveQuestionV1[] = []
  const recentContexts: GuessContext[] = []
  const topHistory: TypeCode[] = []
  const familyValues = new Map<string, Partial<Record<DimensionKey, number[]>>>()
  const conflictedFamilies = new Set<string>()
  const conflictedFamilyDimensions = new Set<string>()
  const unresolvedChecks = new Map<DimensionKey, { sequence: number; confirmations: number }>()
  let acceptedCode: TypeCode | null = null
  let answeredCount = 0
  let effectiveCount = 0
  let segmentAnsweredCount = 0
  let segmentEffectiveCount = 0

  for (const event of session.events) {
    if (event.kind === 'continue') {
      segmentAnsweredCount = 0
      segmentEffectiveCount = 0
      topHistory.length = 0
      continue
    }

    if (event.kind === 'accept') {
      acceptedCode = event.typeCode
      continue
    }

    if (event.kind === 'reject') {
      rejected.add(event.typeCode)
      beliefs = normalizeBeliefs({ ...beliefs, [event.typeCode]: 0 })
      segmentAnsweredCount = 0
      segmentEffectiveCount = 0
      topHistory.length = 0
      continue
    }

    if (event.kind !== 'answer') continue

    const question = GUESS_QUESTION_BY_ID[event.questionId]
    if (!question) continue
    const previousExposure = exposures.get(question.id) ?? 0
    const repeatWeight = previousExposure > 0 ? 0.5 : 1
    exposures.set(question.id, previousExposure + 1)
    lastQuestionPositions.set(question.id, answeredCount)
    askedQuestions.push(question)
    recentContexts.push(question.context)
    answeredCount += 1
    segmentAnsweredCount += 1

    const newlyConflicted = new Set<DimensionKey>()
    if (event.answer !== 'unknown') {
      effectiveCount += 1
      segmentEffectiveCount += 1
      for (const dimension of DIMENSION_KEYS) {
        const loading = question.loadings[dimension]
        if (!loading) continue
        coverage[dimension] += Math.abs(loading) * repeatWeight
        const family = familyValues.get(question.familyId) ?? {}
        const values = family[dimension] ?? []
        values.push(event.answer * loading)
        family[dimension] = values
        familyValues.set(question.familyId, family)
        const conflictKey = `${question.familyId}:${dimension}`
        if (
          !conflictedFamilyDimensions.has(conflictKey) &&
          values.some((value) => value >= 0.5) &&
          values.some((value) => value <= -0.5)
        ) {
          conflictedFamilyDimensions.add(conflictKey)
          conflictedFamilies.add(question.familyId)
          unresolvedChecks.set(dimension, { sequence: event.sequence, confirmations: 0 })
          newlyConflicted.add(dimension)
        }
      }
    }

    for (const [dimension, check] of [...unresolvedChecks.entries()]) {
      if (newlyConflicted.has(dimension) || event.sequence <= check.sequence) continue
      if (!event.repeat && event.answer !== 'unknown' && question.loadings[dimension]) {
        const confirmations = check.confirmations + 1
        if (confirmations >= 2) unresolvedChecks.delete(dimension)
        else unresolvedChecks.set(dimension, { ...check, confirmations })
      }
    }

    beliefs = updateBeliefs(beliefs, question, event.answer, repeatWeight)
    if (event.answer !== 'unknown') {
      const top = rankedCandidates(beliefs)[0]
      if (top) topHistory.push(top.code)
    }
  }

  return {
    beliefs,
    candidates: rankedCandidates(beliefs),
    rejected,
    acceptedCode,
    answeredCount,
    effectiveCount,
    segmentAnsweredCount,
    segmentEffectiveCount,
    coverage,
    exposures,
    lastQuestionPositions,
    askedQuestions,
    recentContexts,
    topHistory,
    conflictedFamilies,
    unresolvedConflictDimensions: new Set(unresolvedChecks.keys()),
  }
}

function deriveSession(session: GuessSessionV1): DerivedSession {
  const cached = derivedCache.get(session)
  if (cached) return cached
  const derived = computeDerivedSession(session)
  derivedCache.set(session, derived)
  return derived
}

function entropy(beliefs: BeliefMap): number {
  return PROFILE_CODES.reduce((sum, code) => {
    const probability = beliefs[code]
    return probability > 0 ? sum - probability * Math.log2(probability) : sum
  }, 0)
}

function expectedInformationGain(beliefs: BeliefMap, question: AdaptiveQuestionV1): number {
  const currentEntropy = entropy(beliefs)
  let expectedEntropy = 0
  for (const answer of ANSWERS) {
    const probability = PROFILE_CODES.reduce(
      (sum, code) => sum + beliefs[code] * likelihood(answer, code, question),
      0,
    )
    if (probability <= 0) continue
    const posterior = { ...beliefs }
    for (const code of PROFILE_CODES) {
      posterior[code] = beliefs[code] * likelihood(answer, code, question) / probability
    }
    expectedEntropy += probability * entropy(posterior)
  }
  return Math.max(0, currentEntropy - expectedEntropy)
}

function hashUnit(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return (hash >>> 0) / 4_294_967_295
}

function hasUnknownAnswer(session: GuessSessionV1, questionId: string): boolean {
  return session.events.some(
    (event) => event.kind === 'answer' && event.questionId === questionId && event.answer === 'unknown',
  )
}

function chooseQuestion(session: GuessSessionV1, derived: DerivedSession): { question: AdaptiveQuestionV1; repeat: boolean } | null {
  const recentFamilies = new Set(derived.askedQuestions.slice(-6).map((question) => question.familyId))
  const recentContexts = new Set(derived.recentContexts.slice(-3))
  const undercovered = new Set(DIMENSION_KEYS.filter((dimension) => derived.coverage[dimension] < 1))

  const ranked = (relaxFamilies: boolean) => GUESS_QUESTIONS.flatMap((question) => {
    const exposure = derived.exposures.get(question.id) ?? 0
    const repeat = exposure > 0
    const canRepeat = repeat && exposure < 2 && derived.answeredCount - (derived.lastQuestionPositions.get(question.id) ?? 0) >= 12 && (
      hasUnknownAnswer(session, question.id) || derived.conflictedFamilies.has(question.familyId)
    )
    if (repeat && !canRepeat) return []
    if (!relaxFamilies && recentFamilies.has(question.familyId)) return []

    const coversMissing = DIMENSION_KEYS.some(
      (dimension) => undercovered.has(dimension) && Boolean(question.loadings[dimension]),
    )
    let score = expectedInformationGain(derived.beliefs, question)
    if (undercovered.size > 0) score *= coversMissing ? 1.6 : 0.2
    if (recentContexts.has(question.context)) score *= 0.8
    if (repeat) score *= 0.35
    score += hashUnit(`${session.seed}:${question.id}:${session.events.length}`) * 1e-9
    return [{ question, repeat, score }]
  }).sort((first, second) => second.score - first.score)

  const strict = ranked(false)[0]
  const selected = strict ?? ranked(true)[0]
  return selected ? { question: selected.question, repeat: selected.repeat } : null
}

function reasonsFor(code: TypeCode, session: GuessSessionV1): readonly [string, string] {
  const support = emptyCoverage()
  for (const event of session.events) {
    if (event.kind !== 'answer' || event.answer === 'unknown') continue
    const question = GUESS_QUESTION_BY_ID[event.questionId]
    if (!question) continue
    const repeatWeight = event.repeat ? 0.5 : 1
    const vector = typeVector(code)
    for (const dimension of DIMENSION_KEYS) {
      const loading = question.loadings[dimension]
      if (!loading) continue
      const signedEvidence = event.answer * loading * vector[dimension]
      support[dimension] += signedEvidence * repeatWeight
    }
  }

  const dimensions = [...DIMENSION_KEYS].sort(
    (first, second) => support[second] - support[first] || DIMENSION_INDEX[first] - DIMENSION_INDEX[second],
  )
  const selected = dimensions.filter((dimension) => support[dimension] > 0).slice(0, 2)
  while (selected.length < 2) {
    const fallback = DIMENSION_KEYS.find((dimension) => !selected.includes(dimension))
    if (!fallback) break
    selected.push(fallback)
  }
  return selected.map((dimension) => LETTER_REASON[code[DIMENSION_INDEX[dimension]]]) as unknown as readonly [string, string]
}

export function createGuessSession(seed = 'tt16-guess-default'): GuessSessionV1 {
  return {
    version: GUESS_SESSION_VERSION,
    itemsVersion: GUESS_ITEMS_VERSION,
    policyVersion: GUESS_POLICY_VERSION,
    seed: seed.trim() || 'tt16-guess-default',
    events: [],
  }
}

function computeNextGuessAction(session: GuessSessionV1): GuessAction {
  const derived = deriveSession(session)
  if (derived.acceptedCode) return { kind: 'complete', code: derived.acceptedCode }
  if (derived.rejected.size >= PROFILE_CODES.length || derived.candidates.length === 0) {
    return { kind: 'exhausted', answeredCount: derived.answeredCount, excludedCount: derived.rejected.size }
  }

  const firstAttempt = derived.rejected.size === 0
  const minimumEffective = firstAttempt ? 6 : 3
  const hardLimit = firstAttempt ? 18 : 10
  const first = derived.candidates[0]
  const second = derived.candidates[1]
  const coverageReady = DIMENSION_KEYS.every((dimension) => derived.coverage[dimension] >= 1)
  const stable = derived.topHistory.length >= 2 && derived.topHistory.at(-1) === derived.topHistory.at(-2)
  const margin = first ? first.belief - (second?.belief ?? 0) : 0
  const highConfidence = Boolean(
    first &&
    derived.segmentEffectiveCount >= minimumEffective &&
    coverageReady &&
    stable &&
    derived.unresolvedConflictDimensions.size === 0 &&
    first.belief >= 0.70 &&
    margin >= 0.18
  )

  const confirmation = (confidence: GuessConfidence): GuessConfirmationAction => ({
    kind: 'confirmation',
    code: first.code,
    alternativeCode: second?.code ?? null,
    confidence,
    reasons: reasonsFor(first.code, session),
    answeredCount: derived.answeredCount,
    excludedCount: derived.rejected.size,
  })

  if (
    derived.candidates.length === 1 &&
    first &&
    derived.segmentEffectiveCount >= minimumEffective
  ) return confirmation('tentative')
  if (highConfidence && first) return confirmation('high')
  if (derived.segmentAnsweredCount >= hardLimit) {
    if (first && derived.segmentEffectiveCount >= minimumEffective) return confirmation('tentative')
    return {
      kind: 'insufficient',
      answeredCount: derived.answeredCount,
      effectiveCount: derived.effectiveCount,
      excludedCount: derived.rejected.size,
      canContinue: derived.answeredCount < GUESS_QUESTIONS.length,
      reason: 'too_many_unknowns',
    }
  }

  const selected = chooseQuestion(session, derived)
  if (!selected) {
    if (first && derived.segmentEffectiveCount > 0) return confirmation('tentative')
    return {
      kind: 'insufficient',
      answeredCount: derived.answeredCount,
      effectiveCount: derived.effectiveCount,
      excludedCount: derived.rejected.size,
      canContinue: false,
      reason: 'question_pool',
    }
  }

  return {
    kind: 'question',
    question: selected.question,
    answeredCount: derived.answeredCount,
    effectiveCount: derived.effectiveCount,
    excludedCount: derived.rejected.size,
    isRepeat: selected.repeat,
  }
}

export function getNextGuessAction(session: GuessSessionV1): GuessAction {
  const cached = actionCache.get(session)
  if (cached) return cached
  const action = computeNextGuessAction(session)
  actionCache.set(session, action)
  return action
}

export function applyGuessEvent(session: GuessSessionV1, event: GuessEvent): GuessSessionV1 {
  const action = getNextGuessAction(session)
  const summary = candidateSummary(deriveSession(session).beliefs)
  const base = { sequence: session.events.length + 1, candidateSummary: summary }
  let trace: GuessTraceEvent

  if (event.kind === 'answer') {
    if (action.kind !== 'question' || action.question.id !== event.questionId || !isGuessAnswer(event.answer)) {
      throw new Error('Answer does not match the active adaptive question.')
    }
    trace = { ...base, kind: 'answer', questionId: event.questionId, answer: event.answer, repeat: action.isRepeat }
  } else if (event.kind === 'accept' || event.kind === 'reject') {
    if (action.kind !== 'confirmation' || action.code !== event.typeCode) {
      throw new Error('Decision does not match the active guess.')
    }
    trace = { ...base, kind: event.kind, typeCode: event.typeCode, confidence: action.confidence }
  } else {
    if (action.kind !== 'insufficient' || !action.canContinue) {
      throw new Error('The current guess session cannot continue this segment.')
    }
    trace = { ...base, kind: 'continue' }
  }

  return { ...session, events: [...session.events, trace] }
}

export function undoGuessEvent(session: GuessSessionV1): GuessSessionV1 {
  if (session.events.length === 0) return session
  return { ...session, events: session.events.slice(0, -1) }
}

export function migrateStoredGuessSession(value: unknown): GuessSessionV1 | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as Partial<GuessSessionV1>
  if (
    candidate.version !== GUESS_SESSION_VERSION ||
    candidate.itemsVersion !== GUESS_ITEMS_VERSION ||
    candidate.policyVersion !== GUESS_POLICY_VERSION ||
    typeof candidate.seed !== 'string' ||
    !Array.isArray(candidate.events)
  ) return null

  let rebuilt = createGuessSession(candidate.seed)
  try {
    for (const raw of candidate.events) {
      if (!raw || typeof raw !== 'object') return null
      const event = raw as Partial<GuessTraceEvent>
      if (event.kind === 'answer' && typeof event.questionId === 'string' && isGuessAnswer(event.answer)) {
        rebuilt = applyGuessEvent(rebuilt, { kind: 'answer', questionId: event.questionId, answer: event.answer })
      } else if ((event.kind === 'accept' || event.kind === 'reject') && isTypeCode(event.typeCode)) {
        rebuilt = applyGuessEvent(rebuilt, { kind: event.kind, typeCode: event.typeCode })
      } else if (event.kind === 'continue') {
        rebuilt = applyGuessEvent(rebuilt, { kind: 'continue' })
      } else {
        return null
      }
    }
  } catch {
    return null
  }
  return rebuilt
}

export function buildGuessCardModel(session: GuessSessionV1): GuessCardModel | null {
  const action = getNextGuessAction(session)
  if (action.kind !== 'complete') return null
  const profile = PROFILES[action.code]
  const beforeAcceptance = { ...session, events: session.events.slice(0, -1) }
  const confirmation = getNextGuessAction(beforeAcceptance)
  const reasons = confirmation.kind === 'confirmation'
    ? confirmation.reasons
    : reasonsFor(action.code, beforeAcceptance)
  return {
    code: action.code,
    name: profile.name,
    tagline: profile.tagline,
    group: profile.group,
    keywords: profile.keywords,
    reasons,
    label: '快速猜型 · 娱乐结果',
    disclaimer: '这是纯本地的娱乐猜测，不等同于 TT16 标准 20 题报告，也不构成投资建议或心理诊断。',
  }
}

export function calculateGuessTraceReward(session: GuessSessionV1): number {
  let reward = 0
  for (const event of session.events) {
    if (event.kind === 'answer') reward -= event.repeat ? 0.03 : 0.01
    if (event.kind === 'reject') reward -= 0.25
    if (event.kind === 'accept') reward += 1
  }
  if (getNextGuessAction(session).kind === 'exhausted') reward -= 1
  return Math.round(reward * 100) / 100
}
