import type { DimensionKey } from '../types.js'
import { PUBLISHED_GUESS_ITEMS } from './items.js'

export const GUESS_ITEMS_VERSION = 'tt16-guess-items-1.0.0'

export type GuessQuestionKind = 'single' | 'dual' | 'anchor'
export type GuessContext =
  | 'research'
  | 'signal'
  | 'horizon'
  | 'volatility'
  | 'risk'
  | 'execution'
  | 'collaboration'
  | 'review'

export interface AdaptiveQuestionV1 {
  id: string
  familyId: string
  kind: GuessQuestionKind
  context: GuessContext
  prompt: string
  loadings: Readonly<Partial<Record<DimensionKey, number>>>
  direction: Readonly<Partial<Record<DimensionKey, -1 | 1>>>
  clue: string
  version: typeof GUESS_ITEMS_VERSION
}

export const GUESS_QUESTIONS: readonly AdaptiveQuestionV1[] = PUBLISHED_GUESS_ITEMS

export const GUESS_QUESTION_BY_ID: Readonly<Record<string, AdaptiveQuestionV1>> = Object.freeze(
  Object.fromEntries(GUESS_QUESTIONS.map((question) => [question.id, question])),
)
