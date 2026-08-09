import type { AnswerValue, DimensionKey, DimensionLetter, QuestionDirection } from './types.js'

export const ASSESSMENT_VERSION = 'tt16-assessment-2.0.0'
export const QUESTIONNAIRE_VERSION = 'tt16-q20-1.0.0'
export const SCORING_VERSION = 'tt16-score20-1.0.0'
export const CONTENT_VERSION = 'tt16-content-2.0.0'

export type QuestionKind = 'dimension' | 'pressure' | 'consistency'
export type PressureKey = 'missed_rally' | 'drawdown'

interface BaseQuestion {
  id: string
  kind: QuestionKind
  prompt: string
  leftText: string
  rightText: string
  tag: string
  allowNA: boolean
}

export interface DimensionQuestion extends BaseQuestion {
  kind: 'dimension'
  dimension: DimensionKey
  direction: QuestionDirection
  weight: number
}

export interface PressureQuestion extends BaseQuestion {
  kind: 'pressure'
  pressureKey: PressureKey
}

export interface ConsistencyQuestion extends BaseQuestion {
  kind: 'consistency'
  comparisonDimension: DimensionKey
  comparisonQuestionIds: readonly string[]
}

export type Question = DimensionQuestion | PressureQuestion | ConsistencyQuestion

export const ANSWER_SCALE: readonly { value: AnswerValue; label: string }[] = [
  { value: -2, label: '更接近 A' },
  { value: -1, label: '略接近 A' },
  { value: 0, label: '视情况' },
  { value: 1, label: '略接近 B' },
  { value: 2, label: '更接近 B' },
] as const

/**
 * TT16's canonical 20-item assessment. Core dimension and consistency items
 * are required. Pressure items allow an explicit “未经历” answer and only
 * personalize scenario modules. Answers are scored locally on every platform.
 */
export const QUESTIONS = [
  {
    id: 'C01',
    kind: 'dimension',
    prompt: '发现一只陌生股票时，你通常先看什么？',
    leftText: '我会先读财报、商业模式和估值。',
    rightText: '我会先看走势、成交量、相对强弱和市场反馈。',
    tag: '观点形成',
    allowNA: false,
    dimension: 'RS',
    direction: 1,
    weight: 1,
  },
  {
    id: 'C02',
    kind: 'dimension',
    prompt: '买入后价格下跌时，你会先检查什么？',
    leftText: '我先复核公司逻辑和估值是否变化。',
    rightText: '我先检查趋势、量价和市场是否否定。',
    tag: '持仓管理',
    allowNA: false,
    dimension: 'RS',
    direction: 1,
    weight: 1,
  },
  {
    id: 'C03',
    kind: 'dimension',
    prompt: '错过一段上涨后，你更可能怎么做？',
    leftText: '我宁可等到理解价值再决定。',
    rightText: '我会在趋势确认时考虑跟随。',
    tag: '追涨情境',
    allowNA: false,
    dimension: 'RS',
    direction: 1,
    weight: 1,
  },
  {
    id: 'C04',
    kind: 'dimension',
    prompt: '你通常依据什么决定卖出？',
    leftText: '投资论点或估值明显改变。',
    rightText: '价格结构或市场信号明显转弱。',
    tag: '退出依据',
    allowNA: false,
    dimension: 'RS',
    direction: 1,
    weight: 1,
  },
  {
    id: 'C05',
    kind: 'dimension',
    prompt: '买入时，你通常设想持有多久？',
    leftText: '数月到数年。',
    rightText: '数天到数周。',
    tag: '周期锚点',
    allowNA: false,
    dimension: 'HT',
    direction: 1,
    weight: 1,
  },
  {
    id: 'C06',
    kind: 'dimension',
    prompt: '逻辑没变但三个月不涨时，你更接近哪种反应？',
    leftText: '我愿意继续等待。',
    rightText: '我会考虑换到更活跃的机会。',
    tag: '机会成本',
    allowNA: false,
    dimension: 'HT',
    direction: 1,
    weight: 1,
  },
  {
    id: 'C07',
    kind: 'dimension',
    prompt: '一家公司三年成长清晰但近期没有催化，你怎么看？',
    leftText: '即使近期没有催化，我仍觉得有吸引力。',
    rightText: '即使长期不错，近期没有催化也会降低我的兴趣。',
    tag: '催化偏好',
    allowNA: false,
    dimension: 'HT',
    direction: 1,
    weight: 1,
  },
  {
    id: 'C08',
    kind: 'dimension',
    prompt: '达到短期目标价后，你更可能怎么处理？',
    leftText: '只要长期论点仍强，我可能继续持有。',
    rightText: '我更倾向落袋并寻找下一笔。',
    tag: '兑现方式',
    allowNA: false,
    dimension: 'HT',
    direction: 1,
    weight: 1,
  },
  {
    id: 'C09',
    kind: 'dimension',
    prompt: '非常看好一只股票时，你会如何表达确信？',
    leftText: '即使很看好，单只股票也会受到明确仓位上限约束。',
    rightText: '当确信度很高时，我愿意让少数股票占较大仓位。',
    tag: '集中度',
    allowNA: false,
    dimension: 'DA',
    direction: 1,
    weight: 1,
  },
  {
    id: 'C10',
    kind: 'dimension',
    prompt: '连续几笔盈利后，你会调整下一笔的仓位吗？',
    leftText: '我仍按原风险预算下单。',
    rightText: '我会适度放大仓位抓住状态。',
    tag: '信心校准',
    allowNA: false,
    dimension: 'DA',
    direction: 1,
    weight: 1,
  },
  {
    id: 'C11',
    kind: 'dimension',
    prompt: '你更偏好哪一种组合结构？',
    leftText: '多个中等把握机会组成的分散组合。',
    rightText: '少数高把握机会的集中表达。',
    tag: '组合结构',
    allowNA: false,
    dimension: 'DA',
    direction: 1,
    weight: 1,
  },
  {
    id: 'C12',
    kind: 'dimension',
    prompt: '面对组合波动，你更接近哪种取向？',
    leftText: '我会主动降低仓位，避免回撤进入不舒服区间。',
    rightText: '只要赔率足够，我能接受组合出现较深波动。',
    tag: '回撤容忍',
    allowNA: false,
    dimension: 'DA',
    direction: 1,
    weight: 1,
  },
  {
    id: 'C13',
    kind: 'dimension',
    prompt: '下单前，你通常会准备到什么程度？',
    leftText: '我通常写清买入理由、仓位和退出条件。',
    rightText: '我更愿意先参与，再根据后续信息决定如何处理。',
    tag: '计划程度',
    allowNA: false,
    dimension: 'PF',
    direction: 1,
    weight: 1,
  },
  {
    id: 'C14',
    kind: 'dimension',
    prompt: '突发利好出现时，你更可能怎么行动？',
    leftText: '我会先检查是否符合原计划再行动。',
    rightText: '我会优先根据新信息快速调整。',
    tag: '新闻反应',
    allowNA: false,
    dimension: 'PF',
    direction: 1,
    weight: 1,
  },
  {
    id: 'C15',
    kind: 'dimension',
    prompt: '价格触及预设止损，但直觉觉得会反弹时，你怎么做？',
    leftText: '我仍偏向执行预设止损。',
    rightText: '我会结合当下情况重新判断。',
    tag: '止损执行',
    allowNA: false,
    dimension: 'PF',
    direction: 1,
    weight: 1,
  },
  {
    id: 'C16',
    kind: 'dimension',
    prompt: '你通常在什么时候调整策略规则？',
    leftText: '我通常在预设复盘节点调整。',
    rightText: '市场状态变化时，我会立即调整规则和打法。',
    tag: '策略适应',
    allowNA: false,
    dimension: 'PF',
    direction: 1,
    weight: 1,
  },
  {
    id: 'C17',
    kind: 'pressure',
    prompt: '一只没研究过的股票三天上涨 25%，朋友都在讨论。',
    leftText: '我会先放回观察清单。',
    rightText: '我会先买一点或尽快参与，避免继续错过。',
    tag: '踏空反应',
    allowNA: true,
    pressureKey: 'missed_rally',
  },
  {
    id: 'C18',
    kind: 'pressure',
    prompt: '组合一周下跌 10% 时，你更接近哪种反应？',
    leftText: '我会先按预案逐项复核。',
    rightText: '我会先快速卖出一部分，让自己安心。',
    tag: '回撤反应',
    allowNA: true,
    pressureKey: 'drawdown',
  },
  {
    id: 'C19',
    kind: 'consistency',
    prompt: '我很少提前写清退出条件，通常临盘决定如何处理。',
    leftText: '完全不符合',
    rightText: '非常符合',
    tag: 'P/F 平行题',
    allowNA: false,
    comparisonDimension: 'PF',
    comparisonQuestionIds: ['C13', 'C15', 'C16'],
  },
  {
    id: 'C20',
    kind: 'consistency',
    prompt: '即使最初是长期逻辑，我也常因为几天不涨就换股。',
    leftText: '完全不符合',
    rightText: '非常符合',
    tag: 'H/T 平行题',
    allowNA: false,
    comparisonDimension: 'HT',
    comparisonQuestionIds: ['C05', 'C06', 'C07'],
  },
] as const satisfies readonly Question[]

export type QuestionId = (typeof QUESTIONS)[number]['id']

export const QUESTION_BY_ID = Object.freeze(
  Object.fromEntries(QUESTIONS.map((question) => [question.id, question])),
) as Readonly<Record<QuestionId, (typeof QUESTIONS)[number]>>

export const DIMENSION_LETTERS: Readonly<
  Record<DimensionKey, readonly [DimensionLetter, DimensionLetter]>
> = {
  RS: ['R', 'S'],
  HT: ['H', 'T'],
  DA: ['D', 'A'],
  PF: ['P', 'F'],
}
