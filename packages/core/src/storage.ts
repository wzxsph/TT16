import { QUESTIONS, type QuestionId } from './questions.js'
import { isAnswerValue, type Answers } from './scoring.js'

export interface StoredAssessmentV2 {
  version: 'assessment-2'
  answers: Answers
  currentIndex: number
  completed: boolean
}

type LegacyFreeState = {
  version?: unknown
  answers?: unknown
  currentIndex?: unknown
  completed?: unknown
}

const QUESTION_IDS = new Set<string>(QUESTIONS.map((question) => question.id))
const REQUIRED_QUESTION_IDS = QUESTIONS.filter((question) => !question.allowNA).map((question) => question.id)

export function migrateStoredAssessment(value: unknown): StoredAssessmentV2 | null {
  if (!value || typeof value !== 'object') return null
  const candidate = value as LegacyFreeState
  if (candidate.version !== 'free-1' && candidate.version !== 'assessment-2') return null
  if (!candidate.answers || typeof candidate.answers !== 'object' || Array.isArray(candidate.answers)) return null

  const answers: Answers = {}
  for (const [id, answer] of Object.entries(candidate.answers)) {
    if (!QUESTION_IDS.has(id)) continue
    if (answer === null || isAnswerValue(answer)) answers[id as QuestionId] = answer
  }

  const currentIndex = typeof candidate.currentIndex === 'number' && Number.isInteger(candidate.currentIndex)
    ? Math.max(0, Math.min(QUESTIONS.length - 1, candidate.currentIndex))
    : 0
  return {
    version: 'assessment-2',
    answers,
    currentIndex,
    completed: candidate.completed === true && REQUIRED_QUESTION_IDS.every((id) => isAnswerValue(answers[id])),
  }
}
