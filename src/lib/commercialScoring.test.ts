import { describe, expect, it } from 'vitest'
import {
  COMMERCIAL_QUESTIONS,
  type CommercialQuestionId,
} from '../data/commercialQuestions'
import { PROFILE_CODES, type TypeCode } from '../data/profiles'
import {
  commercialDimensionQuestionCounts,
  scoreCommercialAssessment,
  type CommercialAnswers,
} from './commercialScoring'

function filledAnswers(value: -2 | -1 | 0 | 1 | 2): CommercialAnswers {
  return Object.fromEntries(COMMERCIAL_QUESTIONS.map((question) => [question.id, value]))
}

function answersForType(code: TypeCode): CommercialAnswers {
  const letterByDimension = {
    RS: code[0],
    HT: code[1],
    DA: code[2],
    PF: code[3],
  }

  return Object.fromEntries(
    COMMERCIAL_QUESTIONS.map((question) => {
      if (question.kind === 'dimension') {
        const useRight = letterByDimension[question.dimension] === {
          RS: 'S',
          HT: 'T',
          DA: 'A',
          PF: 'F',
        }[question.dimension]
        return [question.id, useRight ? 2 : -2]
      }

      if (question.kind === 'consistency') {
        const useRight = letterByDimension[question.comparisonDimension] === {
          RS: 'S',
          HT: 'T',
          DA: 'A',
          PF: 'F',
        }[question.comparisonDimension]
        return [question.id, useRight ? 2 : -2]
      }

      return [question.id, 0]
    }),
  )
}

describe('commercial question bank', () => {
  it('contains exactly 16 dimension, 2 pressure and 2 consistency items', () => {
    expect(COMMERCIAL_QUESTIONS).toHaveLength(20)
    expect(new Set(COMMERCIAL_QUESTIONS.map((question) => question.id)).size).toBe(20)
    expect(COMMERCIAL_QUESTIONS.filter((question) => question.kind === 'dimension')).toHaveLength(16)
    expect(COMMERCIAL_QUESTIONS.filter((question) => question.kind === 'pressure')).toHaveLength(2)
    expect(COMMERCIAL_QUESTIONS.filter((question) => question.kind === 'consistency')).toHaveLength(2)
    expect(commercialDimensionQuestionCounts()).toEqual({ RS: 4, HT: 4, DA: 4, PF: 4 })
  })
})

describe('commercial scoring', () => {
  it('maps the two extreme answer sets to RHDP and STAF', () => {
    expect(scoreCommercialAssessment(filledAnswers(-2)).typeCode).toBe('RHDP')
    expect(scoreCommercialAssessment(filledAnswers(2)).typeCode).toBe('STAF')
  })

  it('can deterministically generate every profile code', () => {
    for (const code of PROFILE_CODES) {
      const result = scoreCommercialAssessment(answersForType(code))
      expect(result.typeCode).toBe(code)
      expect(result.profile.code).toBe(code)
      expect(result.quality.level).toBe('eligible')
    }
  })

  it('uses the configured anchor item on a perfect tie', () => {
    const answers = filledAnswers(-2)
    for (const id of ['C01', 'C02', 'C03'] satisfies CommercialQuestionId[]) {
      answers[id] = id === 'C03' ? 0 : -1
    }
    answers.C04 = 2

    const result = scoreCommercialAssessment(answers)
    const rs = result.dimensions.find((dimension) => dimension.key === 'RS')
    expect(rs).toMatchObject({ leftPercent: 50, rightPercent: 50, chosenLetter: 'S', isBoundary: true })
  })

  it('allows an unanswered pressure item without failing the quality gate', () => {
    const answers = filledAnswers(-2)
    answers.C17 = null
    answers.C18 = null

    const result = scoreCommercialAssessment(answers)
    expect(result.quality.level).toBe('eligible')
    expect(result.pressure.every((item) => item.level === 'unknown')).toBe(true)
  })

  it('requires all core and consistency items before payment eligibility', () => {
    const answers = filledAnswers(-2)
    answers.C01 = null
    answers.C19 = null

    const result = scoreCommercialAssessment(answers)
    expect(result.quality.level).toBe('needs_review')
    expect(result.quality.unansweredRequiredQuestionIds).toEqual(['C01', 'C19'])
  })

  it('flags contradictory parallel items for free review', () => {
    const answers = filledAnswers(-2)
    answers.C19 = 2
    answers.C20 = 2

    const result = scoreCommercialAssessment(answers)
    expect(result.quality.level).toBe('needs_review')
    expect(result.quality.consistencyPercent).toBe(0)
  })

  it('ignores unknown answer keys and never mutates the input', () => {
    const answers = { ...filledAnswers(-2), unknown: 999 }
    const snapshot = structuredClone(answers)
    const first = scoreCommercialAssessment(answers)
    const second = scoreCommercialAssessment(answers)

    expect(first).toEqual(second)
    expect(answers).toEqual(snapshot)
  })
})
