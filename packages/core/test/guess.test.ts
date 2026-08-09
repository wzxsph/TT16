import { describe, expect, it } from 'vitest'
import { PROFILE_CODES, type TypeCode } from '../src/profiles'
import { DIMENSION_KEYS, type DimensionKey } from '../src/types'
import {
  GUESS_ITEMS_VERSION,
  GUESS_POLICY_VERSION,
  GUESS_QUESTIONS,
  applyGuessEvent,
  buildGuessCardModel,
  calculateGuessTraceReward,
  createGuessSession,
  getNextGuessAction,
  migrateStoredGuessSession,
  undoGuessEvent,
  type AdaptiveQuestionV1,
  type GuessAnswer,
  type GuessSessionV1,
} from '../src/guess'

const DIMENSION_INDEX: Readonly<Record<DimensionKey, number>> = { RS: 0, HT: 1, DA: 2, PF: 3 }
const RIGHT_LETTER: Readonly<Record<DimensionKey, string>> = { RS: 'S', HT: 'T', DA: 'A', PF: 'F' }

function alignment(code: TypeCode, question: AdaptiveQuestionV1): number {
  return DIMENSION_KEYS.reduce((sum, dimension) => {
    const vector = code[DIMENSION_INDEX[dimension]] === RIGHT_LETTER[dimension] ? 1 : -1
    return sum + (question.loadings[dimension] ?? 0) * vector
  }, 0)
}

function prototypeAnswer(code: TypeCode, question: AdaptiveQuestionV1): GuessAnswer {
  return alignment(code, question) >= 0 ? 2 : -2
}

function answerUntilDecision(
  initial: GuessSessionV1,
  code: TypeCode,
  maximum = 40,
): { session: GuessSessionV1; questions: number } {
  let session = initial
  let questions = 0
  while (questions < maximum) {
    const action = getNextGuessAction(session)
    if (action.kind !== 'question') break
    session = applyGuessEvent(session, {
      kind: 'answer',
      questionId: action.question.id,
      answer: prototypeAnswer(code, action.question),
    })
    questions += 1
  }
  return { session, questions }
}

function seededRandom(seed: number): () => number {
  let state = seed >>> 0
  return () => {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0
    return state / 4_294_967_296
  }
}

describe('adaptive guess content', () => {
  it('ships exactly 200 balanced, unique and locally authored questions', () => {
    expect(GUESS_ITEMS_VERSION).toBe('tt16-guess-items-1.0.0')
    expect(GUESS_POLICY_VERSION).toBe('tt16-guess-policy-1.0.0')
    expect(GUESS_QUESTIONS).toHaveLength(200)
    expect(GUESS_QUESTIONS.filter((question) => question.kind === 'single')).toHaveLength(144)
    expect(GUESS_QUESTIONS.filter((question) => question.kind === 'dual')).toHaveLength(48)
    expect(GUESS_QUESTIONS.filter((question) => question.kind === 'anchor')).toHaveLength(8)
    expect(new Set(GUESS_QUESTIONS.map((question) => question.id)).size).toBe(200)
    expect(new Set(GUESS_QUESTIONS.map((question) => question.prompt)).size).toBe(200)

    for (const dimension of DIMENSION_KEYS) {
      const singles = GUESS_QUESTIONS.filter(
        (question) => question.kind === 'single' && question.loadings[dimension],
      )
      expect(singles).toHaveLength(36)
      expect(singles.filter((question) => (question.loadings[dimension] ?? 0) < 0)).toHaveLength(18)
      expect(singles.filter((question) => (question.loadings[dimension] ?? 0) > 0)).toHaveLength(18)
      expect(GUESS_QUESTIONS.filter(
        (question) => question.kind === 'anchor' && question.loadings[dimension],
      )).toHaveLength(2)
    }

    const familyCounts = new Map<string, number>()
    for (const question of GUESS_QUESTIONS) {
      familyCounts.set(question.familyId, (familyCounts.get(question.familyId) ?? 0) + 1)
    }
    const familySizes = [...familyCounts.values()]
    expect(Math.max(...familySizes)).toBe(2)
    expect(new Set(GUESS_QUESTIONS.map((question) => question.context)).size).toBe(8)

    for (const question of GUESS_QUESTIONS) {
      const loadingDimensions = Object.keys(question.loadings).sort()
      expect(Object.keys(question.direction).sort()).toEqual(loadingDimensions)
      for (const dimension of loadingDimensions as DimensionKey[]) {
        expect(question.direction[dimension]).toBe(Math.sign(question.loadings[dimension] ?? 0))
      }
      const magnitude = DIMENSION_KEYS.reduce(
        (sum, dimension) => sum + Math.abs(question.loadings[dimension] ?? 0),
        0,
      )
      expect(magnitude).toBeCloseTo(1)
      expect(question.version).toBe(GUESS_ITEMS_VERSION)
    }

    const corpus = GUESS_QUESTIONS.map((question) => question.prompt).join('\n')
    expect(corpus).not.toMatch(/稳赚|保证收益|保本保收益|最佳人格|最差人格|能力排名|确诊|心理障碍/)
  })
})

describe('adaptive guess policy', () => {
  it('is deterministic for a fixed seed and supports undo by replay', () => {
    let first = createGuessSession('deterministic-seed')
    let second = createGuessSession('deterministic-seed')
    expect(getNextGuessAction(first)).toEqual(getNextGuessAction(second))

    const action = getNextGuessAction(first)
    expect(action.kind).toBe('question')
    if (action.kind !== 'question') return
    first = applyGuessEvent(first, { kind: 'answer', questionId: action.question.id, answer: 2 })
    second = applyGuessEvent(second, { kind: 'answer', questionId: action.question.id, answer: 2 })
    const next = getNextGuessAction(first)
    expect(next).toEqual(getNextGuessAction(second))
    expect(getNextGuessAction(undoGuessEvent(first))).toEqual(action)
  })

  it('keeps unknown answers neutral and stops an all-unknown segment at 18 questions', () => {
    let session = createGuessSession('unknown-only')
    let previousSummary: unknown = null
    for (let index = 0; index < 18; index += 1) {
      const action = getNextGuessAction(session)
      expect(action.kind).toBe('question')
      if (action.kind !== 'question') return
      session = applyGuessEvent(session, { kind: 'answer', questionId: action.question.id, answer: 'unknown' })
      const trace = session.events.at(-1)
      if (previousSummary) expect(trace?.candidateSummary).toEqual(previousSummary)
      previousSummary = trace?.candidateSummary
    }
    const insufficient = getNextGuessAction(session)
    expect(insufficient).toMatchObject({
      kind: 'insufficient',
      answeredCount: 18,
      effectiveCount: 0,
      canContinue: true,
    })
    session = applyGuessEvent(session, { kind: 'continue' })
    expect(getNextGuessAction(session).kind).toBe('question')
  })

  it('guesses all 16 noiseless prototypes correctly within 12 effective answers', () => {
    for (const code of PROFILE_CODES) {
      const { session, questions } = answerUntilDecision(createGuessSession(`prototype-${code}`), code)
      const action = getNextGuessAction(session)
      expect(action).toMatchObject({ kind: 'confirmation', code, confidence: 'high' })
      expect(questions).toBeGreaterThanOrEqual(6)
      expect(questions).toBeLessThanOrEqual(12)
    }
  })

  it('does not re-guess a rejected type and creates only an entertainment card after acceptance', () => {
    const firstRun = answerUntilDecision(createGuessSession('reject-once'), 'RHDP')
    const firstGuess = getNextGuessAction(firstRun.session)
    expect(firstGuess.kind).toBe('confirmation')
    if (firstGuess.kind !== 'confirmation') return
    const rejected = applyGuessEvent(firstRun.session, { kind: 'reject', typeCode: firstGuess.code })
    const secondRun = answerUntilDecision(rejected, 'RHDF')
    const secondGuess = getNextGuessAction(secondRun.session)
    expect(secondGuess.kind).toBe('confirmation')
    if (secondGuess.kind !== 'confirmation') return
    expect(secondGuess.code).not.toBe(firstGuess.code)

    const accepted = applyGuessEvent(secondRun.session, { kind: 'accept', typeCode: secondGuess.code })
    expect(getNextGuessAction(accepted)).toEqual({ kind: 'complete', code: secondGuess.code })
    expect(buildGuessCardModel(accepted)).toMatchObject({
      code: secondGuess.code,
      label: '快速猜型 · 娱乐结果',
    })
    expect(JSON.stringify(buildGuessCardModel(accepted))).not.toMatch(/answer|questionId|belief|percent/i)
    expect(calculateGuessTraceReward(accepted)).toBeGreaterThan(0)
  })

  it('can reject every type once and then ends without forcing a result', { timeout: 20_000 }, () => {
    let session = createGuessSession('reject-all-types')
    const rejected: TypeCode[] = []
    let effectiveSinceGuess = 0

    for (let guard = 0; guard < 240; guard += 1) {
      const action = getNextGuessAction(session)
      if (action.kind === 'question') {
        session = applyGuessEvent(session, { kind: 'answer', questionId: action.question.id, answer: 2 })
        effectiveSinceGuess += 1
        continue
      }
      if (action.kind === 'confirmation') {
        expect(effectiveSinceGuess).toBeGreaterThanOrEqual(rejected.length === 0 ? 6 : 3)
        rejected.push(action.code)
        session = applyGuessEvent(session, { kind: 'reject', typeCode: action.code })
        effectiveSinceGuess = 0
        continue
      }
      if (action.kind === 'insufficient' && action.canContinue) {
        session = applyGuessEvent(session, { kind: 'continue' })
        continue
      }
      break
    }

    expect(rejected).toHaveLength(16)
    expect(new Set(rejected).size).toBe(16)
    expect(getNextGuessAction(session)).toMatchObject({ kind: 'exhausted', excludedCount: 16 })
    expect(buildGuessCardModel(session)).toBeNull()
  })

  it('safely rebuilds valid local traces and rejects damaged or stale storage', () => {
    const start = createGuessSession('migration')
    const action = getNextGuessAction(start)
    expect(action.kind).toBe('question')
    if (action.kind !== 'question') return
    const answered = applyGuessEvent(start, { kind: 'answer', questionId: action.question.id, answer: 1 })
    expect(migrateStoredGuessSession(JSON.parse(JSON.stringify(answered)))).toEqual(answered)
    expect(migrateStoredGuessSession({ ...answered, policyVersion: 'stale-policy' })).toBeNull()
    expect(migrateStoredGuessSession({ ...answered, events: [{ kind: 'answer', questionId: 'missing', answer: 2 }] })).toBeNull()
    expect(migrateStoredGuessSession(null)).toBeNull()
  })

  it('keeps the true prototype within the first three guesses under synthetic noise', { timeout: 120_000 }, () => {
    let successful = 0
    let total = 0

    for (let codeIndex = 0; codeIndex < PROFILE_CODES.length; codeIndex += 1) {
      const code = PROFILE_CODES[codeIndex]
      for (let run = 0; run < 100; run += 1) {
        const random = seededRandom(codeIndex * 1_000 + run + 9)
        let session = createGuessSession(`noise-${code}-${run}`)
        let guesses = 0
        let hit = false

        for (let guard = 0; guard < 100; guard += 1) {
          const action = getNextGuessAction(session)
          if (action.kind === 'question') {
            let answer = prototypeAnswer(code, action.question)
            const sample = random()
            if (sample < 0.15) answer = 'unknown'
            else if (sample < 0.25 && answer !== 'unknown') answer = answer === 2 ? -2 : 2
            session = applyGuessEvent(session, { kind: 'answer', questionId: action.question.id, answer })
            continue
          }
          if (action.kind === 'confirmation') {
            guesses += 1
            if (action.code === code) {
              hit = true
              break
            }
            session = applyGuessEvent(session, { kind: 'reject', typeCode: action.code })
            if (guesses >= 3) break
            continue
          }
          if (action.kind === 'insufficient' && action.canContinue) {
            session = applyGuessEvent(session, { kind: 'continue' })
            continue
          }
          break
        }

        if (hit) successful += 1
        total += 1
      }
    }

    expect(total).toBe(1_600)
    expect(successful / total).toBeGreaterThanOrEqual(0.90)
  })
})
