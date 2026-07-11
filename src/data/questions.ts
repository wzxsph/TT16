export const DIMENSION_KEYS = ["RS", "HT", "DA", "PF"] as const;

export type DimensionKey = (typeof DIMENSION_KEYS)[number];
export type DimensionLetter = "R" | "S" | "H" | "T" | "D" | "A" | "P" | "F";
export type AnswerValue = -2 | -1 | 0 | 1 | 2;
export type QuestionKind = "dimension" | "risk" | "consistency";
export type QuestionDirection = 1 | -1;

export const BADGE_KEYS = [
  "fomo",
  "loss_aversion",
  "confidence_calibration",
  "trading_impulse",
  "drawdown_composure",
  "review_consistency",
] as const;

export type BadgeKey = (typeof BADGE_KEYS)[number];

export interface AnswerScaleOption {
  value: AnswerValue;
  label: string;
}

export const ANSWER_SCALE: readonly AnswerScaleOption[] = [
  { value: -2, label: "更接近 A" },
  { value: -1, label: "略接近 A" },
  { value: 0, label: "视情况" },
  { value: 1, label: "略接近 B" },
  { value: 2, label: "更接近 B" },
] as const;

interface BaseQuestion {
  id: string;
  kind: QuestionKind;
  prompt: string;
  leftText: string;
  rightText: string;
  tag: string;
  allowNA: boolean;
  /** Present only for core dimension items; optional here for ergonomic UI reads. */
  dimension?: DimensionKey;
}

export interface DimensionQuestion extends BaseQuestion {
  kind: "dimension";
  dimension: DimensionKey;
  direction: QuestionDirection;
  weight: number;
}

export interface RiskQuestion extends BaseQuestion {
  kind: "risk";
  badge: BadgeKey;
}

export type BadgeQuestion = RiskQuestion;

export interface ConsistencyQuestion extends BaseQuestion {
  kind: "consistency";
  comparisonDimension: DimensionKey;
  comparisonQuestionIds: readonly string[];
}

export type Question = DimensionQuestion | RiskQuestion | ConsistencyQuestion;

/**
 * TT16 v0.1 assessment bank from PRD appendix B.
 *
 * A value of -2 selects the A/left description most strongly; +2 selects the
 * B/right description most strongly. `null` represents "未经历过 / 不适用".
 */
export const QUESTIONS = [
  {
    id: "Q01",
    kind: "dimension",
    prompt: "发现一只陌生股票时，你通常先看什么？",
    leftText: "我会先读财报、商业模式和估值。",
    rightText: "我会先看走势、成交量、相对强弱和市场反馈。",
    tag: "观点形成",
    allowNA: false,
    dimension: "RS",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q02",
    kind: "dimension",
    prompt: "买入后价格下跌时，你会先检查什么？",
    leftText: "我先复核公司逻辑和估值是否变化。",
    rightText: "我先检查趋势、量价和市场是否否定。",
    tag: "持仓管理",
    allowNA: false,
    dimension: "RS",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q03",
    kind: "dimension",
    prompt: "财报发布前，哪类信息对你更重要？",
    leftText: "我更关注收入、利润、指引与合理估值。",
    rightText: "我更关注市场预期、仓位拥挤和价格反应。",
    tag: "事件决策",
    allowNA: false,
    dimension: "RS",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q04",
    kind: "dimension",
    prompt: "错过一段上涨后，你更可能怎么做？",
    leftText: "我宁可等到理解价值再决定。",
    rightText: "我会在趋势确认时考虑跟随。",
    tag: "追涨情境",
    allowNA: false,
    dimension: "RS",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q05",
    kind: "dimension",
    prompt: "你的确信通常来自哪里？",
    leftText: "主要来自独立研究能否自洽。",
    rightText: "主要来自多个市场信号是否相互确认。",
    tag: "确信来源",
    allowNA: false,
    dimension: "RS",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q06",
    kind: "dimension",
    prompt: "你通常依据什么决定卖出？",
    leftText: "投资论点或估值明显改变。",
    rightText: "价格结构或市场信号明显转弱。",
    tag: "退出依据",
    allowNA: false,
    dimension: "RS",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q07",
    kind: "dimension",
    prompt: "买入时，你通常设想持有多久？",
    leftText: "数月到数年。",
    rightText: "数天到数周。",
    tag: "周期锚点",
    allowNA: false,
    dimension: "HT",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q08",
    kind: "dimension",
    prompt: "逻辑没变但三个月不涨时，你更接近哪种反应？",
    leftText: "我愿意继续等待。",
    rightText: "我会考虑换到更活跃的机会。",
    tag: "机会成本",
    allowNA: false,
    dimension: "HT",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q09",
    kind: "dimension",
    prompt: "你更偏好哪一种收益机制？",
    leftText: "通过少数高质量决策长期复利。",
    rightText: "通过多次交易持续捕捉波段。",
    tag: "收益机制",
    allowNA: false,
    dimension: "HT",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q10",
    kind: "dimension",
    prompt: "一家公司三年成长清晰但近期没有催化，你怎么看？",
    leftText: "即使近期没有催化，我仍觉得有吸引力。",
    rightText: "即使长期不错，近期没有催化也会降低我的兴趣。",
    tag: "催化偏好",
    allowNA: false,
    dimension: "HT",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q11",
    kind: "dimension",
    prompt: "你通常多久系统检查一次组合？",
    leftText: "主要按月或季度检查。",
    rightText: "几乎每天都会重新评估是否需要换仓。",
    tag: "评估频率",
    allowNA: false,
    dimension: "HT",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q12",
    kind: "dimension",
    prompt: "达到短期目标价后，你更可能怎么处理？",
    leftText: "只要长期论点仍强，我可能继续持有。",
    rightText: "我更倾向落袋并寻找下一笔。",
    tag: "兑现方式",
    allowNA: false,
    dimension: "HT",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q13",
    kind: "dimension",
    prompt: "非常看好一只股票时，你会如何表达确信？",
    leftText: "即使很看好，单只股票也会受到明确仓位上限约束。",
    rightText: "当确信度很高时，我愿意让少数股票占较大仓位。",
    tag: "集中度",
    allowNA: false,
    dimension: "DA",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q14",
    kind: "dimension",
    prompt: "连续几笔盈利后，你会调整下一笔的仓位吗？",
    leftText: "我仍按原风险预算下单。",
    rightText: "我会适度放大仓位抓住状态。",
    tag: "信心校准",
    allowNA: false,
    dimension: "DA",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q15",
    kind: "dimension",
    prompt: "面对陌生但热门的主题，你通常怎么参与？",
    leftText: "我通常先用很小仓位观察。",
    rightText: "我愿意用有存在感的仓位参与。",
    tag: "探索仓位",
    allowNA: false,
    dimension: "DA",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q16",
    kind: "dimension",
    prompt: "你更偏好哪一种组合结构？",
    leftText: "多个中等把握机会组成的分散组合。",
    rightText: "少数高把握机会的集中表达。",
    tag: "组合结构",
    allowNA: false,
    dimension: "DA",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q17",
    kind: "dimension",
    prompt: "面对组合波动，你更接近哪种取向？",
    leftText: "我会主动降低仓位，避免回撤进入不舒服区间。",
    rightText: "只要赔率足够，我能接受组合出现较深波动。",
    tag: "回撤容忍",
    allowNA: false,
    dimension: "DA",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q18",
    kind: "dimension",
    prompt: "机会清晰时，你如何看待杠杆或复杂衍生品？",
    leftText: "我通常避免用它们放大风险。",
    rightText: "在规则允许且机会清晰时，我愿意用它们增强表达。",
    tag: "工具使用",
    allowNA: true,
    dimension: "DA",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q19",
    kind: "dimension",
    prompt: "下单前，你通常会准备到什么程度？",
    leftText: "我通常写清买入理由、仓位和退出条件。",
    rightText: "我更愿意先参与，再根据后续信息决定如何处理。",
    tag: "计划程度",
    allowNA: false,
    dimension: "PF",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q20",
    kind: "dimension",
    prompt: "突发利好出现时，你更可能怎么行动？",
    leftText: "我会先检查是否符合原计划再行动。",
    rightText: "我会优先根据新信息快速调整。",
    tag: "新闻反应",
    allowNA: false,
    dimension: "PF",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q21",
    kind: "dimension",
    prompt: "价格触及预设止损，但直觉觉得会反弹时，你怎么做？",
    leftText: "我仍偏向执行预设止损。",
    rightText: "我会结合当下情况重新判断。",
    tag: "止损执行",
    allowNA: false,
    dimension: "PF",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q22",
    kind: "dimension",
    prompt: "你通常如何复盘交易？",
    leftText: "我会使用交易日志、清单或固定复盘流程。",
    rightText: "我更依赖经验和盘感，不喜欢把流程写得很死。",
    tag: "复盘方式",
    allowNA: false,
    dimension: "PF",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q23",
    kind: "dimension",
    prompt: "你的仓位通常怎样决定？",
    leftText: "通常由预设公式或风险预算决定。",
    rightText: "通常根据当下确信度和盘面感觉灵活决定。",
    tag: "仓位执行",
    allowNA: false,
    dimension: "PF",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q24",
    kind: "dimension",
    prompt: "你通常在什么时候调整策略规则？",
    leftText: "我通常在预设复盘节点调整。",
    rightText: "市场状态变化时，我会立即调整规则和打法。",
    tag: "策略适应",
    allowNA: false,
    dimension: "PF",
    direction: 1,
    weight: 1,
  },
  {
    id: "Q25",
    kind: "risk",
    prompt: "一只没研究过的股票三天上涨 25%，朋友都在讨论。",
    leftText: "我会先放回观察清单。",
    rightText: "我会先买一点或尽快参与，避免继续错过。",
    tag: "从众 / FOMO",
    allowNA: true,
    dimension: undefined,
    badge: "fomo",
  },
  {
    id: "Q26",
    kind: "risk",
    prompt: "持仓亏损 20%，而且原逻辑已经变弱。",
    leftText: "我会按证据减仓或退出。",
    rightText: "我更愿意等价格回到成本附近再处理。",
    tag: "损失厌恶",
    allowNA: true,
    dimension: undefined,
    badge: "loss_aversion",
  },
  {
    id: "Q27",
    kind: "risk",
    prompt: "连续三笔盈利后，你会如何处理下一笔交易？",
    leftText: "我会保持原风险预算。",
    rightText: "我会明显提高下一笔仓位。",
    tag: "信心校准",
    allowNA: true,
    dimension: undefined,
    badge: "confidence_calibration",
  },
  {
    id: "Q28",
    kind: "risk",
    prompt: "止损后，你通常会怎么做？",
    leftText: "我会暂停并复盘，再决定是否重新进入。",
    rightText: "我常想尽快换一笔或重新进入，把损失赚回来。",
    tag: "交易冲动",
    allowNA: true,
    dimension: undefined,
    badge: "trading_impulse",
  },
  {
    id: "Q29",
    kind: "risk",
    prompt: "组合一周下跌 10% 时，你更接近哪种反应？",
    leftText: "我会先按预案逐项复核。",
    rightText: "我会先快速卖出一部分，让自己安心。",
    tag: "回撤镇定",
    allowNA: true,
    dimension: undefined,
    badge: "drawdown_composure",
  },
  {
    id: "Q30",
    kind: "risk",
    prompt: "一笔交易结束后，你通常怎么复盘？",
    leftText: "我会记录买卖理由和过程质量。",
    rightText: "我主要看赚亏，很快转向下一笔。",
    tag: "复盘一致性",
    allowNA: true,
    dimension: undefined,
    badge: "review_consistency",
  },
  {
    id: "Q31",
    kind: "consistency",
    prompt: "我很少提前写清退出条件，通常临盘决定如何处理。",
    leftText: "完全不符合",
    rightText: "非常符合",
    tag: "P/F 平行反向",
    allowNA: false,
    dimension: undefined,
    comparisonDimension: "PF",
    comparisonQuestionIds: ["Q19", "Q21", "Q22"],
  },
  {
    id: "Q32",
    kind: "consistency",
    prompt: "即使最初是长期逻辑，我也常因为几天不涨就换股。",
    leftText: "完全不符合",
    rightText: "非常符合",
    tag: "H/T 平行反向",
    allowNA: false,
    dimension: undefined,
    comparisonDimension: "HT",
    comparisonQuestionIds: ["Q07", "Q08", "Q11"],
  },
] as const satisfies readonly Question[];

export type QuestionId = (typeof QUESTIONS)[number]["id"];

export const QUESTION_BY_ID = Object.freeze(
  Object.fromEntries(QUESTIONS.map((question) => [question.id, question])),
) as Readonly<Record<QuestionId, (typeof QUESTIONS)[number]>>;
