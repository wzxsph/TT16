import type { DimensionKey, DimensionLetter } from './types.js'
import { PROFILE_LIST, type ProfileGroup, type TypeCode } from './profiles.js'

export interface DimensionDefinition {
  key: DimensionKey
  slug: string
  title: string
  question: string
  left: { letter: DimensionLetter; name: string; description: string }
  right: { letter: DimensionLetter; name: string; description: string }
  collaborationTip: string
}

export const DIMENSIONS: readonly DimensionDefinition[] = [
  {
    key: 'RS',
    slug: 'research-signal',
    title: '研究与信号',
    question: '你主要依据什么形成观点？',
    left: { letter: 'R', name: 'Research · 研究', description: '先理解企业、事实与估值，再形成判断。' },
    right: { letter: 'S', name: 'Signal · 信号', description: '先读取价格、强弱与市场反馈，再形成判断。' },
    collaborationTip: '把事实锚点与市场反馈分成两列，再约定什么证据足以改变共同判断。',
  },
  {
    key: 'HT',
    slug: 'hold-trade',
    title: '持有与交易',
    question: '你愿意给判断多长时间？',
    left: { letter: 'H', name: 'Hold · 持有', description: '用较长周期等待逻辑逐步兑现。' },
    right: { letter: 'T', name: 'Trade · 交易', description: '用较短反馈周期比较机会与时间成本。' },
    collaborationTip: '先写清共同观察期与复核节点，避免一方觉得太急、另一方觉得无限等待。',
  },
  {
    key: 'DA',
    slug: 'defensive-aggressive',
    title: '防守与进攻',
    question: '你怎样把确信转成风险表达？',
    left: { letter: 'D', name: 'Defensive · 防守', description: '优先限制单点影响，保留更多试错空间。' },
    right: { letter: 'A', name: 'Aggressive · 进攻', description: '在高确信时集中资源，清楚表达取舍。' },
    collaborationTip: '先统一总风险边界，再讨论集中或分散；两者回答的是不同层级的问题。',
  },
  {
    key: 'PF',
    slug: 'planned-flexible',
    title: '计划与灵活',
    question: '你如何执行和更新计划？',
    left: { letter: 'P', name: 'Planned · 计划', description: '依赖事前条件和固定复盘节奏。' },
    right: { letter: 'F', name: 'Flexible · 灵活', description: '根据新信息及时调整路径与节奏。' },
    collaborationTip: '把不可变边界与可调整部分分别写下，让计划和适应不再互相抵消。',
  },
] as const

export interface GroupDefinition {
  code: 'RH' | 'RT' | 'SH' | 'ST'
  slug: string
  name: ProfileGroup
  tagline: string
  description: string
  codes: readonly TypeCode[]
}

export const GROUPS: readonly GroupDefinition[] = [
  {
    code: 'RH',
    slug: 'enterprise-compounders',
    name: '企业复利族',
    tagline: '理解生意，让时间参与判断。',
    description: '以企业事实建立锚点，用更长周期观察逻辑兑现；差异主要来自风险表达与执行方式。',
    codes: ['RHDP', 'RHDF', 'RHAP', 'RHAF'],
  },
  {
    code: 'RT',
    slug: 'expectation-hunters',
    name: '预期差猎手族',
    tagline: '研究事实，也重视定价窗口。',
    description: '从研究出发，但用较短周期检查市场预期与事实之间的距离。',
    codes: ['RTDP', 'RTDF', 'RTAP', 'RTAF'],
  },
  {
    code: 'SH',
    slug: 'trend-navigators',
    name: '趋势赛道族',
    tagline: '识别方向，让市场持续证明。',
    description: '把市场反馈当作重要证据，并愿意给被确认的方向更多发展时间。',
    codes: ['SHDP', 'SHDF', 'SHAP', 'SHAF'],
  },
  {
    code: 'ST',
    slug: 'momentum-operators',
    name: '盘面动量族',
    tagline: '尊重反馈，在变化中保持节奏。',
    description: '使用短周期反馈快速行动；稳定性来自风险边界与对执行过程的记录。',
    codes: ['STDP', 'STDF', 'STAP', 'STAF'],
  },
] as const

export interface Guide {
  slug: string
  title: string
  summary: string
  sections: readonly { title: string; paragraphs: readonly string[] }[]
}

export const GUIDES: readonly Guide[] = [
  {
    slug: 'how-to-read-your-report',
    title: '怎样阅读一份 TT16 报告',
    summary: '先看连续维度，再看类型；先认出默认动作，再选择一条可观察的调整。',
    sections: [
      { title: '类型是索引，不是结论', paragraphs: ['四字母代码把四个连续维度压缩成一个容易记忆的入口。相同类型的人，百分比、经历与现实约束仍可能完全不同。'] },
      { title: '把优势和盲点成对阅读', paragraphs: ['报告中的盲点不是缺陷清单，而是同一力量使用过度后的另一面。最有价值的问题是：它在什么情境下开始越界？'] },
      { title: '只带走一个动作', paragraphs: ['选择一条能被观察、能在下一次复盘中核对的守则，比同时记住所有提醒更有效。'] },
    ],
  },
  {
    slug: 'type-is-not-skill',
    title: '人格类型为什么不代表交易能力',
    summary: '偏好描述“通常怎样决定”，能力评价需要完全不同的证据。',
    sections: [
      { title: '偏好不等于结果', paragraphs: ['研究、信号、持有、交易、防守、进攻、计划与灵活都可能在不同环境中发挥，也都可能被过度使用。'] },
      { title: 'TT16 不测什么', paragraphs: ['TT16 不测知识、收益、风险承受能力、财务状况或投资适当性，也不据此推荐证券和仓位。'] },
    ],
  },
  {
    slug: 'understand-boundary-results',
    title: '结果接近维度边界，意味着什么',
    summary: '接近 50/50 不是测错了，而是两种偏好都可能随情境出现。',
    sections: [
      { title: '边界是一条提醒', paragraphs: ['当一个维度接近边界，四字母代码对这一部分的概括力更弱。阅读报告时应同时查看两端描述。'] },
      { title: '不要为了稳定而重测', paragraphs: ['短期内反复作答容易把记忆中的上一轮选项带入答案。更好的做法是隔一段时间，在真实情境变化后再比较。'] },
    ],
  },
  {
    slug: 'preference-and-pressure',
    title: '稳定偏好与压力反应要分开看',
    summary: '平时的方法和压力下的动作可能不是同一件事。',
    sections: [
      { title: '压力会缩短选择空间', paragraphs: ['踏空、回撤或连续反馈不利时，人更容易重复熟悉动作，或突然走向平时偏好的反面。'] },
      { title: '用暂停信号代替自我评价', paragraphs: ['与其要求自己“保持理性”，不如提前定义一个可观察的暂停信号，例如例外开始多于规则。'] },
    ],
  },
  {
    slug: 'compare-two-styles',
    title: '怎样比较两种决策风格',
    summary: '比较用于理解分工与沟通，不用于挑选赢家。',
    sections: [
      { title: '先找共同语言', paragraphs: ['共享维度往往决定两个人最容易快速达成共识的部分，也可能形成共同盲区。'] },
      { title: '把分歧翻译成问题', paragraphs: ['不同维度不必争论谁正确，可以转成“需要什么证据”“等待多久”“风险上限是什么”“哪些部分允许调整”。'] },
    ],
  },
  {
    slug: 'five-minute-review',
    title: '用五分钟做一次决策复盘',
    summary: '不记录证券或金额，也能复盘信息、时间、风险和执行。',
    sections: [
      { title: '记录过程而非身份', paragraphs: ['只回答四个问题：我看了什么、给了多久、怎样限制影响、何时改变计划。'] },
      { title: '寻找下一次可观察动作', paragraphs: ['复盘不是证明自己属于某型，而是找出下一次出现相似情境时能被看见的一小步。'] },
    ],
  },
] as const

export const MARKETING_COPY = {
  project: {
    short: '20 个真实交易情境，认识你的判断、周期、风险表达与执行方式。完整报告永久免费。',
    medium: 'TT16 是一个开源、移动端优先的交易行为人格项目。完成 20 道情境题，查看四维倾向、16 型完整报告与可分享人格卡；答案只在本机评分。',
    long: 'TT16 用四组连续维度描述交易决策偏好：研究或信号、持有或交易、防守或进攻、计划或灵活。它不评判收益能力，不连接券商账户，也不提供证券建议。20 题、完整报告、人格图鉴、对照工具和分享素材全部免费。',
  },
  types: PROFILE_LIST.map((profile) => ({
    code: profile.code,
    text: `${profile.code} · ${profile.name}｜${profile.tagline}。关键词：${profile.keywords.join('、')}。这是一种决策偏好，不是能力或收益排名。`,
  })),
  groups: GROUPS.map((group) => ({ code: group.code, text: `${group.name}｜${group.tagline}${group.description}` })),
} as const
