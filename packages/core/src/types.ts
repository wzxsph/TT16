export const DIMENSION_KEYS = ['RS', 'HT', 'DA', 'PF'] as const

export type DimensionKey = (typeof DIMENSION_KEYS)[number]
export type DimensionLetter = 'R' | 'S' | 'H' | 'T' | 'D' | 'A' | 'P' | 'F'
export type AnswerValue = -2 | -1 | 0 | 1 | 2
export type QuestionDirection = 1 | -1
