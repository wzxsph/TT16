import { DIMENSIONS } from './catalog.js'
import { PROFILE_CODES, PROFILES, type ProfileV2, type TypeCode } from './profiles.js'

export interface SharedDimension {
  key: string
  letter: string
  title: string
  description: string
}

export interface DifferentDimension {
  key: string
  title: string
  first: { letter: string; name: string; description: string }
  second: { letter: string; name: string; description: string }
  communicationTip: string
}

export interface TypeComparison {
  first: Pick<ProfileV2, 'code' | 'name' | 'tagline'>
  second: Pick<ProfileV2, 'code' | 'name' | 'tagline'>
  sharedDimensions: readonly SharedDimension[]
  differentDimensions: readonly DifferentDimension[]
  summary: string
}

export function adjacentTypeCodes(code: TypeCode): readonly TypeCode[] {
  return PROFILE_CODES.filter(
    (candidate) => candidate !== code && [...candidate].filter((letter, index) => letter !== code[index]).length === 1,
  )
}

export function compareProfiles(firstCode: TypeCode, secondCode: TypeCode): TypeComparison {
  const first = PROFILES[firstCode]
  const second = PROFILES[secondCode]
  const sharedDimensions: SharedDimension[] = []
  const differentDimensions: DifferentDimension[] = []

  DIMENSIONS.forEach((dimension, index) => {
    const firstLetter = firstCode[index]
    const secondLetter = secondCode[index]
    const firstPole = dimension.left.letter === firstLetter ? dimension.left : dimension.right
    const secondPole = dimension.left.letter === secondLetter ? dimension.left : dimension.right
    if (firstLetter === secondLetter) {
      sharedDimensions.push({
        key: dimension.key,
        letter: firstLetter,
        title: dimension.title,
        description: firstPole.description,
      })
      return
    }
    differentDimensions.push({
      key: dimension.key,
      title: dimension.title,
      first: { letter: firstLetter, name: firstPole.name, description: firstPole.description },
      second: { letter: secondLetter, name: secondPole.name, description: secondPole.description },
      communicationTip: dimension.collaborationTip,
    })
  })

  const sharedCount = sharedDimensions.length
  const summary = firstCode === secondCode
    ? '两个选择指向同一类型。可以继续比较维度百分比与具体经历，而不是假设做法完全相同。'
    : `两个类型共享 ${sharedCount} 个维度、在 ${4 - sharedCount} 个维度上偏好不同。差异用于理解沟通与分工，不代表匹配度或能力高低。`

  return {
    first: { code: first.code, name: first.name, tagline: first.tagline },
    second: { code: second.code, name: second.name, tagline: second.tagline },
    sharedDimensions,
    differentDimensions,
    summary,
  }
}
