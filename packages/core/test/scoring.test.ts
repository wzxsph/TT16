import { describe, expect, it } from 'vitest'
import {
  CONTENT_VERSION,
  QUESTIONS,
  QUESTIONNAIRE_VERSION,
  SCORING_VERSION,
  type QuestionId,
} from '../src/questions'
import { PROFILE_CODES, PROFILE_LIST, type TypeCode } from '../src/profiles'
import {
  dimensionQuestionCounts,
  scoreAssessment,
  type Answers,
} from '../src/scoring'
import { adjacentTypeCodes, compareProfiles } from '../src/compare'
import { migrateStoredAssessment } from '../src/storage'
import { buildShareCardModel } from '../src/share'

function filledAnswers(value: -2 | -1 | 0 | 1 | 2): Answers {
  return Object.fromEntries(QUESTIONS.map((question) => [question.id, value]))
}

function answersForType(code: TypeCode): Answers {
  const letterByDimension = {
    RS: code[0],
    HT: code[1],
    DA: code[2],
    PF: code[3],
  }

  return Object.fromEntries(
    QUESTIONS.map((question) => {
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

describe('canonical question bank', () => {
  it('contains exactly 16 dimension, 2 pressure and 2 consistency items', () => {
    expect(QUESTIONS).toHaveLength(20)
    expect(QUESTIONS.map((question) => question.id)).toEqual(
      Array.from({ length: 20 }, (_, index) => `C${String(index + 1).padStart(2, '0')}`),
    )
    expect(new Set(QUESTIONS.map((question) => question.id)).size).toBe(20)
    expect(QUESTIONS.filter((question) => question.kind === 'dimension')).toHaveLength(16)
    expect(QUESTIONS.filter((question) => question.kind === 'pressure')).toHaveLength(2)
    expect(QUESTIONS.filter((question) => question.kind === 'consistency')).toHaveLength(2)
    expect(dimensionQuestionCounts()).toEqual({ RS: 4, HT: 4, DA: 4, PF: 4 })
    expect({ QUESTIONNAIRE_VERSION, SCORING_VERSION, CONTENT_VERSION }).toEqual({
      QUESTIONNAIRE_VERSION: 'tt16-q20-1.0.0',
      SCORING_VERSION: 'tt16-score20-1.0.0',
      CONTENT_VERSION: 'tt16-content-2.0.0',
    })
  })
})

describe('local scoring', () => {
  it('maps the two extreme answer sets to RHDP and STAF', () => {
    expect(scoreAssessment(filledAnswers(-2)).typeCode).toBe('RHDP')
    expect(scoreAssessment(filledAnswers(2)).typeCode).toBe('STAF')
  })

  it('can deterministically generate every profile code', () => {
    for (const code of PROFILE_CODES) {
      const result = scoreAssessment(answersForType(code))
      expect(result.typeCode).toBe(code)
      expect(result.profile.code).toBe(code)
      expect(result.quality.level).toBe('complete')
    }
  })

  it('uses the configured anchor item on a perfect tie', () => {
    const answers = filledAnswers(-2)
    for (const id of ['C01', 'C02', 'C03'] satisfies QuestionId[]) {
      answers[id] = id === 'C03' ? 0 : -1
    }
    answers.C04 = 2

    const result = scoreAssessment(answers)
    const rs = result.dimensions.find((dimension) => dimension.key === 'RS')
    expect(rs).toMatchObject({ leftPercent: 50, rightPercent: 50, chosenLetter: 'S', isBoundary: true })
  })

  it('allows an unanswered pressure item without failing the quality gate', () => {
    const answers = filledAnswers(-2)
    answers.C17 = null
    answers.C18 = null

    const result = scoreAssessment(answers)
    expect(result.quality.level).toBe('complete')
    expect(result.pressure.every((item) => item.level === 'unknown')).toBe(true)
  })

  it('requires all core and consistency items before completion', () => {
    const answers = filledAnswers(-2)
    answers.C01 = null
    answers.C19 = null

    const result = scoreAssessment(answers)
    expect(result.quality.level).toBe('needs_review')
    expect(result.quality.unansweredRequiredQuestionIds).toEqual(['C01', 'C19'])
  })

  it('flags contradictory parallel items for free review', () => {
    const answers = filledAnswers(-2)
    answers.C19 = 2
    answers.C20 = 2

    const result = scoreAssessment(answers)
    expect(result.quality.level).toBe('needs_review')
    expect(result.quality.consistencyPercent).toBe(0)
  })

  it('ignores unknown answer keys and never mutates the input', () => {
    const answers = { ...filledAnswers(-2), unknown: 999 }
    const snapshot = structuredClone(answers)
    const first = scoreAssessment(answers)
    const second = scoreAssessment(answers)

    expect(first).toEqual(second)
    expect(answers).toEqual(snapshot)
  })
})

describe('ProfileV2 content', () => {
  it('provides a complete, balanced content shape for all 16 types', () => {
    for (const code of PROFILE_CODES) {
      const profile = scoreAssessment(answersForType(code)).profile
      expect(profile.keywords).toHaveLength(3)
      expect(profile.traitPairs).toHaveLength(3)
      expect(profile.rules).toHaveLength(5)
      expect(profile.environments.supportive).toHaveLength(2)
      expect(profile.environments.challenging).toHaveLength(2)
      expect(profile.pressurePattern.resetSteps).toHaveLength(3)
      expect(profile.reflectionPrompts).toHaveLength(3)
      expect(profile.collaboration.offers).toHaveLength(2)
      expect(profile.collaboration.needs).toHaveLength(2)
      expect(profile.collaboration.friction).toHaveLength(2)
      expect(profile.commonMisreads).toHaveLength(2)
      expect(adjacentTypeCodes(code)).toHaveLength(4)
      for (const collection of [profile.keywords, profile.rules, profile.reflectionPrompts, profile.commonMisreads]) {
        expect(new Set(collection).size).toBe(collection.length)
      }
    }
    expect(new Set(PROFILE_LIST.map((profile) => profile.name)).size).toBe(16)
    expect(new Set(PROFILE_LIST.map((profile) => profile.tagline)).size).toBe(16)
  })
})

describe('share-card model', () => {
  it('contains only public profile identity and four aggregate dimensions', () => {
    const result = scoreAssessment(answersForType('RHDP'))
    const model = buildShareCardModel(result)
    expect(model).toMatchObject({ code: 'RHDP', name: result.profile.name, group: result.profile.group })
    expect(model.dimensions).toHaveLength(4)
    expect(JSON.stringify(model)).not.toMatch(/C0\d|answer|user|session|identifier/i)
  })
})

describe('neutral type comparison', () => {
  it('covers all 120 unordered pairs without a compatibility score', () => {
    let pairs = 0
    PROFILE_CODES.forEach((first, firstIndex) => {
      PROFILE_CODES.slice(firstIndex + 1).forEach((second) => {
        const forward = compareProfiles(first, second)
        const reverse = compareProfiles(second, first)
        pairs += 1
        expect(forward.sharedDimensions.map((item) => item.key)).toEqual(reverse.sharedDimensions.map((item) => item.key))
        expect(reverse.first).toEqual(forward.second)
        expect(reverse.second).toEqual(forward.first)
        expect(reverse.summary).toBe(forward.summary)
        expect(reverse.differentDimensions).toEqual(forward.differentDimensions.map((item) => ({
          ...item,
          first: item.second,
          second: item.first,
        })))
        expect(forward.sharedDimensions.length + forward.differentDimensions.length).toBe(4)
        expect(JSON.stringify(forward)).not.toMatch(/匹配分|最佳搭档|能力排名/)
      })
    })
    expect(pairs).toBe(120)
  })
})

describe('assessment storage migration', () => {
  it('migrates valid v1 progress and discards unknown or invalid answers', () => {
    expect(migrateStoredAssessment({
      version: 'free-1',
      answers: { C01: -2, C02: 9, unknown: 1 },
      currentIndex: 99,
      completed: false,
    })).toEqual({
      version: 'assessment-2',
      answers: { C01: -2 },
      currentIndex: 19,
      completed: false,
    })
  })

  it('rejects malformed or unrelated state', () => {
    expect(migrateStoredAssessment(null)).toBeNull()
    expect(migrateStoredAssessment({ version: 'legacy-incompatible-1', answers: {} })).toBeNull()
    expect(migrateStoredAssessment({ version: 'free-1', answers: 'not-an-object' })).toBeNull()
  })

  it('never marks damaged legacy state complete when a required answer is missing', () => {
    const answers = filledAnswers(-2)
    delete answers.C19
    expect(migrateStoredAssessment({
      version: 'free-1',
      answers,
      currentIndex: 19,
      completed: true,
    })?.completed).toBe(false)
  })
})
