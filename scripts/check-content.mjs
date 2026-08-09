import {
  DIMENSIONS,
  GROUPS,
  GUIDES,
  MARKETING_COPY,
  PROFILE_CODES,
  PROFILE_LIST,
} from '../packages/core/dist/index.js'
import { GUESS_ITEMS_VERSION, GUESS_QUESTIONS } from '../packages/core/dist/guess/index.js'

function assert(condition, message) {
  if (!condition) throw new Error(`Content verification failed: ${message}`)
}

function normalized(value) {
  return value.trim().replace(/\s+/g, ' ')
}

function assertUnique(values, label) {
  const clean = values.map(normalized)
  assert(clean.every(Boolean), `${label} contains an empty item`)
  assert(new Set(clean).size === clean.length, `${label} contains duplicate copy`)
}

assert(PROFILE_CODES.length === 16, 'expected 16 profiles')
assert(DIMENSIONS.length === 4, 'expected four dimensions')
assert(GROUPS.length === 4, 'expected four groups')
assert(GUIDES.length === 6, 'expected six guides')
assert(MARKETING_COPY.types.length === 16, 'expected 16 type campaign lines')
assert(MARKETING_COPY.groups.length === 4, 'expected four group campaign lines')
assert(GUESS_QUESTIONS.length === 200, 'expected 200 adaptive guess questions')
assertUnique(PROFILE_LIST.map((profile) => profile.name), 'profile names')
assertUnique(PROFILE_LIST.map((profile) => profile.tagline), 'profile taglines')
assertUnique(PROFILE_LIST.map((profile) => profile.description), 'profile descriptions')
assertUnique(PROFILE_LIST.map((profile) => profile.pressurePattern.pattern), 'profile pressure patterns')
assertUnique(PROFILE_LIST.flatMap((profile) => profile.traitPairs.flatMap((item) => [item.strength, item.overuse])), 'all profile strength/overuse copy')
assertUnique(PROFILE_LIST.flatMap((profile) => profile.rules), 'all profile rules')
assertUnique(MARKETING_COPY.types.map((item) => item.text), 'type campaign lines')
assertUnique(MARKETING_COPY.groups.map((item) => item.text), 'group campaign lines')
assertUnique(GUESS_QUESTIONS.map((item) => item.id), 'adaptive question IDs')
assertUnique(GUESS_QUESTIONS.map((item) => item.prompt), 'adaptive question copy')

assert(GUESS_QUESTIONS.filter((item) => item.kind === 'single').length === 144, 'expected 144 single-dimension guess questions')
assert(GUESS_QUESTIONS.filter((item) => item.kind === 'dual').length === 48, 'expected 48 dual-dimension guess questions')
assert(GUESS_QUESTIONS.filter((item) => item.kind === 'anchor').length === 8, 'expected eight guess anchors')
assert(new Set(GUESS_QUESTIONS.map((item) => item.context)).size === 8, 'guess questions must cover eight contexts')

const familyCounts = new Map()
for (const question of GUESS_QUESTIONS) {
  familyCounts.set(question.familyId, (familyCounts.get(question.familyId) || 0) + 1)
  assert(question.version === GUESS_ITEMS_VERSION, `${question.id} has a stale content version`)
  const loadingDimensions = Object.keys(question.loadings).sort()
  const directionDimensions = Object.keys(question.direction).sort()
  assert(JSON.stringify(loadingDimensions) === JSON.stringify(directionDimensions), `${question.id} direction keys must match its loadings`)
  assert(loadingDimensions.length === (question.kind === 'dual' ? 2 : 1), `${question.id} has the wrong dimension count`)
  for (const dimension of loadingDimensions) {
    assert(question.direction[dimension] === Math.sign(question.loadings[dimension]), `${question.id} direction must match its signed loading`)
  }
  const magnitude = Object.values(question.loadings).reduce((sum, value) => sum + Math.abs(value), 0)
  assert(Math.abs(magnitude - 1) < 0.0001, `${question.id} loadings must have unit magnitude`)
}
assert(Math.max(...familyCounts.values()) <= 2, 'guess question families must contain no more than two items')

for (const dimension of ['RS', 'HT', 'DA', 'PF']) {
  const singles = GUESS_QUESTIONS.filter((item) => item.kind === 'single' && item.loadings[dimension])
  assert(singles.length === 36, `${dimension} must have 36 single-dimension questions`)
  assert(singles.filter((item) => item.loadings[dimension] < 0).length === 18, `${dimension} left pole must have 18 questions`)
  assert(singles.filter((item) => item.loadings[dimension] > 0).length === 18, `${dimension} right pole must have 18 questions`)
  const anchors = GUESS_QUESTIONS.filter((item) => item.kind === 'anchor' && item.loadings[dimension])
  assert(anchors.length === 2, `${dimension} must have two review anchors`)
  assert(new Set(anchors.map((item) => item.direction[dimension])).size === 2, `${dimension} anchors must cover both directions`)
}

const dualByPair = new Map()
for (const question of GUESS_QUESTIONS.filter((item) => item.kind === 'dual')) {
  const dimensions = Object.keys(question.loadings).sort()
  const pair = dimensions.join('-')
  const bucket = dualByPair.get(pair) || []
  bucket.push(question)
  dualByPair.set(pair, bucket)
}
assert(dualByPair.size === 6, 'dual questions must cover all six unordered dimension pairs')
for (const [pair, questions] of dualByPair) {
  assert(questions.length === 8, `${pair} must contain eight dual questions`)
  const dimensions = pair.split('-')
  const directionCounts = new Map()
  for (const question of questions) {
    const combination = dimensions.map((dimension) => question.direction[dimension]).join(',')
    directionCounts.set(combination, (directionCounts.get(combination) || 0) + 1)
  }
  assert(directionCounts.size === 4, `${pair} must cover four direction combinations`)
  assert([...directionCounts.values()].every((count) => count === 2), `${pair} direction combinations must each appear twice`)
  for (const dimension of dimensions) {
    assert(
      questions.filter((question) => Math.abs(question.loadings[dimension]) === 0.65).length === 4,
      `${pair} must rotate the primary loading between dimensions`,
    )
  }
}

function trigrams(value) {
  const text = normalized(value).replace(/[，。；、“”\s]/g, '')
  const values = new Set()
  for (let index = 0; index <= text.length - 3; index += 1) values.add(text.slice(index, index + 3))
  return values
}

for (let first = 0; first < GUESS_QUESTIONS.length; first += 1) {
  const firstSet = trigrams(GUESS_QUESTIONS[first].prompt)
  for (let second = first + 1; second < GUESS_QUESTIONS.length; second += 1) {
    const secondSet = trigrams(GUESS_QUESTIONS[second].prompt)
    const overlap = [...firstSet].filter((item) => secondSet.has(item)).length
    const union = new Set([...firstSet, ...secondSet]).size
    assert(union === 0 || overlap / union < 0.94, `${GUESS_QUESTIONS[first].id} and ${GUESS_QUESTIONS[second].id} are near-duplicate prompts`)
  }
}

for (const profile of PROFILE_LIST) {
  assert(profile.keywords.length === 3, `${profile.code} must have three keywords`)
  assert(profile.traitPairs.length === 3, `${profile.code} must have three strength/overuse pairs`)
  assert(profile.environments.supportive.length === 2, `${profile.code} must have two supportive environments`)
  assert(profile.environments.challenging.length === 2, `${profile.code} must have two challenging environments`)
  assert(profile.pressurePattern.resetSteps.length === 3, `${profile.code} must have three reset actions`)
  assert(profile.rules.length === 5, `${profile.code} must have five rules`)
  assert(profile.reflectionPrompts.length === 3, `${profile.code} must have three reflection prompts`)
  assert(profile.collaboration.offers.length === 2, `${profile.code} must have two collaboration offers`)
  assert(profile.collaboration.needs.length === 2, `${profile.code} must have two collaboration needs`)
  assert(profile.collaboration.friction.length === 2, `${profile.code} must have two collaboration friction notes`)
  assert(profile.commonMisreads.length === 2, `${profile.code} must have two common misreads`)
  assertUnique(profile.keywords, `${profile.code} keywords`)
  assertUnique(profile.traitPairs.flatMap((item) => [item.strength, item.overuse]), `${profile.code} strength/overuse copy`)
  assertUnique(profile.rules, `${profile.code} rules`)
  assertUnique(profile.reflectionPrompts, `${profile.code} reflection prompts`)
}

const corpus = JSON.stringify({ PROFILE_LIST, DIMENSIONS, GROUPS, GUIDES, MARKETING_COPY, GUESS_QUESTIONS })
for (const [label, pattern] of [
  ['guaranteed returns', /稳赚|保证收益|保本保收益/],
  ['type ranking', /最佳人格|最差人格|能力排名|赢家人格/],
  ['diagnosis', /确诊|诊断为.{0,12}(人格|障碍)/],
  ['security recommendation', /建议(买入|卖出|加仓|清仓).{0,20}(股票|基金|证券)/],
]) {
  assert(!pattern.test(corpus), `prohibited ${label} claim found`)
}

console.log(`Content verified: ${PROFILE_CODES.length} profiles, ${GROUPS.length} groups, ${DIMENSIONS.length} dimensions, ${GUIDES.length} guides and ${GUESS_QUESTIONS.length} adaptive questions.`)
