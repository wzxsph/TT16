import type { AssessmentResult } from './scoring.js'

export interface ShareDimension {
  letter: string
  label: string
  percent: number
}

export interface ShareCardModel {
  code: string
  name: string
  tagline: string
  group: string
  dimensions: readonly ShareDimension[]
}

const LABELS = {
  R: '研究驱动', S: '信号驱动',
  H: '持有型', T: '交易型',
  D: '防守型', A: '进攻型',
  P: '计划型', F: '灵活型',
} as const

export function buildShareCardModel(result: AssessmentResult): ShareCardModel {
  return {
    code: result.typeCode,
    name: result.profile.name,
    tagline: result.profile.tagline,
    group: result.profile.group,
    dimensions: result.dimensions.map((dimension) => ({
      letter: dimension.chosenLetter,
      label: LABELS[dimension.chosenLetter],
      percent: dimension.chosenLetter === dimension.leftLetter ? dimension.leftPercent : dimension.rightPercent,
    })),
  }
}
