import type { AdaptiveQuestionV1 } from './questions.js'

/**
 * Fixed, reviewed v1 item bank. Questions are checked in explicitly so production
 * never generates or accepts question copy at runtime.
 */
export const PUBLISHED_GUESS_ITEMS = Object.freeze([
  {
    "id": "G001",
    "familyId": "single-rs-01",
    "kind": "single",
    "context": "research",
    "prompt": "遇到陌生机会时，我会先弄清事实、逻辑和估值依据。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G002",
    "familyId": "single-rs-01",
    "kind": "single",
    "context": "research",
    "prompt": "遇到陌生机会时，我会先观察走势、成交和相对强弱。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G003",
    "familyId": "single-rs-02",
    "kind": "single",
    "context": "volatility",
    "prompt": "价格突然偏离预期时，我先检查原来的判断依据有没有变化。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G004",
    "familyId": "single-rs-02",
    "kind": "single",
    "context": "volatility",
    "prompt": "价格突然偏离预期时，我先检查市场反馈是否已经转向。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G005",
    "familyId": "single-rs-03",
    "kind": "single",
    "context": "collaboration",
    "prompt": "别人给出一个热门观点时，我更想追问原始来源和推理链条。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G006",
    "familyId": "single-rs-03",
    "kind": "single",
    "context": "collaboration",
    "prompt": "别人给出一个热门观点时，我更想知道市场是否已经形成共识和行动。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G007",
    "familyId": "single-rs-04",
    "kind": "single",
    "context": "research",
    "prompt": "信息彼此矛盾时，我会回到公告、数据和业务事实重新核对。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G008",
    "familyId": "single-rs-04",
    "kind": "single",
    "context": "research",
    "prompt": "信息彼此矛盾时，我会借助价格与成交的变化判断哪一方占优。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G009",
    "familyId": "single-rs-05",
    "kind": "single",
    "context": "signal",
    "prompt": "一段快速上涨本身不足以让我行动，我仍想先理解上涨原因。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G010",
    "familyId": "single-rs-05",
    "kind": "single",
    "context": "signal",
    "prompt": "一段快速上涨若伴随持续强势，会明显提高我的关注度。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G011",
    "familyId": "single-rs-06",
    "kind": "single",
    "context": "volatility",
    "prompt": "连续下跌时，我先复核长期假设是否被事实推翻。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G012",
    "familyId": "single-rs-06",
    "kind": "single",
    "context": "volatility",
    "prompt": "连续下跌时，我先判断价格结构是否已经否定原方向。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G013",
    "familyId": "single-rs-07",
    "kind": "single",
    "context": "research",
    "prompt": "筛选候选时，我更容易从经营质量、竞争力和估值开始。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G014",
    "familyId": "single-rs-07",
    "kind": "single",
    "context": "research",
    "prompt": "筛选候选时，我更容易从强弱、量价和活跃度开始。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G015",
    "familyId": "single-rs-08",
    "kind": "single",
    "context": "execution",
    "prompt": "决定退出时，原有论点失效对我的影响通常最大。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G016",
    "familyId": "single-rs-08",
    "kind": "single",
    "context": "execution",
    "prompt": "决定退出时，趋势或市场信号转弱对我的影响通常最大。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G017",
    "familyId": "single-rs-09",
    "kind": "single",
    "context": "signal",
    "prompt": "开始一天的观察时，我更愿意先读材料和更新事实清单。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G018",
    "familyId": "single-rs-09",
    "kind": "single",
    "context": "signal",
    "prompt": "开始一天的观察时，我更愿意先看整体强弱和盘面反馈。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G019",
    "familyId": "single-rs-10",
    "kind": "single",
    "context": "research",
    "prompt": "面对一条新消息，我会先拆解它可能影响哪些长期变量。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G020",
    "familyId": "single-rs-10",
    "kind": "single",
    "context": "research",
    "prompt": "面对一条新消息，我会先观察市场是否给出持续而明确的反应。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G021",
    "familyId": "single-rs-11",
    "kind": "single",
    "context": "review",
    "prompt": "建立确信感时，我更依赖自己能复述的证据和逻辑。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G022",
    "familyId": "single-rs-11",
    "kind": "single",
    "context": "review",
    "prompt": "建立确信感时，我更依赖价格行为持续验证判断。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G023",
    "familyId": "single-rs-12",
    "kind": "single",
    "context": "review",
    "prompt": "复盘一次决定时，我更关注最初的事实假设有没有写清。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G024",
    "familyId": "single-rs-12",
    "kind": "single",
    "context": "review",
    "prompt": "复盘一次决定时，我更关注当时是否读对了市场节奏。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G025",
    "familyId": "single-rs-13",
    "kind": "single",
    "context": "signal",
    "prompt": "在事实尚未弄清前，即使走势很强我也更愿意等待。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G026",
    "familyId": "single-rs-13",
    "kind": "single",
    "context": "signal",
    "prompt": "在信息尚不完整时，趋势确认会帮助我先形成初步判断。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G027",
    "familyId": "single-rs-14",
    "kind": "single",
    "context": "research",
    "prompt": "让我改变观点的通常是新的事实证据，而不是普通价格波动。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G028",
    "familyId": "single-rs-14",
    "kind": "single",
    "context": "research",
    "prompt": "持续的价格与成交变化会促使我比材料更新得更快。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G029",
    "familyId": "single-rs-15",
    "kind": "single",
    "context": "signal",
    "prompt": "过滤噪音时，我更相信可追溯的信息来源。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G030",
    "familyId": "single-rs-15",
    "kind": "single",
    "context": "signal",
    "prompt": "过滤噪音时，我更相信反复出现且能被市场验证的信号。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G031",
    "familyId": "single-rs-16",
    "kind": "single",
    "context": "research",
    "prompt": "比较两个候选时，我会优先比较业务质量与长期空间。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G032",
    "familyId": "single-rs-16",
    "kind": "single",
    "context": "research",
    "prompt": "比较两个候选时，我会优先比较当前强度与资金关注。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G033",
    "familyId": "single-rs-17",
    "kind": "single",
    "context": "collaboration",
    "prompt": "团队出现分歧时，我习惯用证据链逐项讨论。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G034",
    "familyId": "single-rs-17",
    "kind": "single",
    "context": "collaboration",
    "prompt": "团队出现分歧时，我习惯让后续市场反馈帮助裁决。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G035",
    "familyId": "single-rs-18",
    "kind": "single",
    "context": "review",
    "prompt": "错过一段行情后，我宁可重新研究，也不只因价格上涨追随。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "更常表现出 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G036",
    "familyId": "single-rs-18",
    "kind": "single",
    "context": "review",
    "prompt": "错过一段行情后，只要趋势仍健康，我仍愿意重新评估参与时机。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "更常表现出 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G037",
    "familyId": "single-ht-01",
    "kind": "single",
    "context": "horizon",
    "prompt": "一个判断需要较长时间兑现时，我通常愿意继续跟踪和等待。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G038",
    "familyId": "single-ht-01",
    "kind": "single",
    "context": "horizon",
    "prompt": "一个判断迟迟没有反馈时，我通常会寻找更快得到验证的机会。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G039",
    "familyId": "single-ht-02",
    "kind": "single",
    "context": "review",
    "prompt": "短期没有变化，不会自动削弱我对长期逻辑的兴趣。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G040",
    "familyId": "single-ht-02",
    "kind": "single",
    "context": "review",
    "prompt": "短期缺少变化，会明显降低我继续投入注意力的意愿。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G041",
    "familyId": "single-ht-03",
    "kind": "single",
    "context": "horizon",
    "prompt": "我更习惯用季度或年度节点观察判断是否兑现。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G042",
    "familyId": "single-ht-03",
    "kind": "single",
    "context": "horizon",
    "prompt": "我更习惯用天或周的节奏观察判断是否兑现。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G043",
    "familyId": "single-ht-04",
    "kind": "single",
    "context": "signal",
    "prompt": "即使近期没有催化，只要长期路径清晰，我仍愿意保留关注。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G044",
    "familyId": "single-ht-04",
    "kind": "single",
    "context": "signal",
    "prompt": "即使长期方向不错，近期没有催化也会让我暂时离开。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G045",
    "familyId": "single-ht-05",
    "kind": "single",
    "context": "execution",
    "prompt": "达到一个阶段目标后，只要核心逻辑仍在，我可能继续等待。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G046",
    "familyId": "single-ht-05",
    "kind": "single",
    "context": "execution",
    "prompt": "达到一个阶段目标后，我通常更愿意结束这一轮并寻找下一次机会。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G047",
    "familyId": "single-ht-06",
    "kind": "single",
    "context": "volatility",
    "prompt": "普通波动出现时，我倾向给原判断更多验证时间。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G048",
    "familyId": "single-ht-06",
    "kind": "single",
    "context": "volatility",
    "prompt": "普通波动出现时，我倾向缩短反馈周期并快速重新选择。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G049",
    "familyId": "single-ht-07",
    "kind": "single",
    "context": "horizon",
    "prompt": "我能接受一段较长的安静期，只要关键事实仍按路径推进。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G050",
    "familyId": "single-ht-07",
    "kind": "single",
    "context": "horizon",
    "prompt": "长时间缺少活跃反馈会让我觉得机会成本正在升高。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G051",
    "familyId": "single-ht-08",
    "kind": "single",
    "context": "review",
    "prompt": "复盘时，我更关心长期假设最终是否成立。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G052",
    "familyId": "single-ht-08",
    "kind": "single",
    "context": "review",
    "prompt": "复盘时，我更关心每个阶段的节奏和切换是否及时。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G053",
    "familyId": "single-ht-09",
    "kind": "single",
    "context": "collaboration",
    "prompt": "讨论一个方向时，我常提醒团队给逻辑足够的兑现时间。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G054",
    "familyId": "single-ht-09",
    "kind": "single",
    "context": "collaboration",
    "prompt": "讨论一个方向时，我常提醒团队明确近期反馈窗口。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G055",
    "familyId": "single-ht-10",
    "kind": "single",
    "context": "signal",
    "prompt": "短期热度下降但长期事实不变时，我的兴趣通常不会立刻消失。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G056",
    "familyId": "single-ht-10",
    "kind": "single",
    "context": "signal",
    "prompt": "短期热度明显下降时，即使长期故事没变，我也会降低关注。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G057",
    "familyId": "single-ht-11",
    "kind": "single",
    "context": "horizon",
    "prompt": "我更喜欢少量重要判断经过多次复核逐步展开。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G058",
    "familyId": "single-ht-11",
    "kind": "single",
    "context": "horizon",
    "prompt": "我更喜欢连续处理多个周期较短、反馈明确的判断。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G059",
    "familyId": "single-ht-12",
    "kind": "single",
    "context": "execution",
    "prompt": "做出决定后，我不介意经历一段时间才能看见结果。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G060",
    "familyId": "single-ht-12",
    "kind": "single",
    "context": "execution",
    "prompt": "做出决定后，我希望较快知道方向是否值得继续。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G061",
    "familyId": "single-ht-13",
    "kind": "single",
    "context": "volatility",
    "prompt": "一段逆风不会马上改变我的时间尺度。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G062",
    "familyId": "single-ht-13",
    "kind": "single",
    "context": "volatility",
    "prompt": "一段逆风会促使我更快缩短观察与行动周期。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G063",
    "familyId": "single-ht-14",
    "kind": "single",
    "context": "research",
    "prompt": "理解一个长期变化的全过程，会让我比捕捉短期节点更有投入感。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G064",
    "familyId": "single-ht-14",
    "kind": "single",
    "context": "research",
    "prompt": "找出近期最关键的变化节点，会让我比等待长期兑现更有投入感。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G065",
    "familyId": "single-ht-15",
    "kind": "single",
    "context": "review",
    "prompt": "我更容易因过早结束一个后来兑现的判断而遗憾。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G066",
    "familyId": "single-ht-15",
    "kind": "single",
    "context": "review",
    "prompt": "我更容易因停留太久、错过下一段节奏而遗憾。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G067",
    "familyId": "single-ht-16",
    "kind": "single",
    "context": "horizon",
    "prompt": "只要验证路径还在，我愿意让时间成为判断的一部分。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G068",
    "familyId": "single-ht-16",
    "kind": "single",
    "context": "horizon",
    "prompt": "只有持续收到新反馈，我才愿意让一个判断占用较长时间。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G069",
    "familyId": "single-ht-17",
    "kind": "single",
    "context": "collaboration",
    "prompt": "团队催促结果时，我常主张先确认长期里程碑是否变化。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G070",
    "familyId": "single-ht-17",
    "kind": "single",
    "context": "collaboration",
    "prompt": "团队等待过久时，我常主张设置更短的检查点。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G071",
    "familyId": "single-ht-18",
    "kind": "single",
    "context": "execution",
    "prompt": "面对多个选择，我倾向保留能长期跟踪的少数方向。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "更常表现出 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G072",
    "familyId": "single-ht-18",
    "kind": "single",
    "context": "execution",
    "prompt": "面对多个选择，我倾向轮换到近期反馈更清晰的方向。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "更常表现出 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G073",
    "familyId": "single-da-01",
    "kind": "single",
    "context": "risk",
    "prompt": "即使很有把握，我也会先确保单一判断不会主导整体结果。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G074",
    "familyId": "single-da-01",
    "kind": "single",
    "context": "risk",
    "prompt": "当确信度很高时，我愿意让少数判断拥有更鲜明的分量。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G075",
    "familyId": "single-da-02",
    "kind": "single",
    "context": "volatility",
    "prompt": "组合波动扩大时，我的第一反应通常是收紧整体风险边界。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G076",
    "familyId": "single-da-02",
    "kind": "single",
    "context": "volatility",
    "prompt": "组合波动扩大时，只要核心判断仍在，我能容忍更明显的起伏。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G077",
    "familyId": "single-da-03",
    "kind": "single",
    "context": "risk",
    "prompt": "我更安心于多个独立判断共同组成结果。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G078",
    "familyId": "single-da-03",
    "kind": "single",
    "context": "risk",
    "prompt": "我更安心于把主要精力放在少数最有把握的判断上。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G079",
    "familyId": "single-da-04",
    "kind": "single",
    "context": "execution",
    "prompt": "连续顺利之后，我仍倾向维持原来的风险预算。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G080",
    "familyId": "single-da-04",
    "kind": "single",
    "context": "execution",
    "prompt": "连续顺利之后，我可能适度提高对高确信方向的表达。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G081",
    "familyId": "single-da-05",
    "kind": "single",
    "context": "review",
    "prompt": "复盘时，我会优先检查有没有让单点风险变得过大。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G082",
    "familyId": "single-da-05",
    "kind": "single",
    "context": "review",
    "prompt": "复盘时，我会优先检查有没有因过度保守而稀释关键判断。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G083",
    "familyId": "single-da-06",
    "kind": "single",
    "context": "risk",
    "prompt": "不确定性升高时，我倾向把每个决定的影响控制得更小。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G084",
    "familyId": "single-da-06",
    "kind": "single",
    "context": "risk",
    "prompt": "不确定性升高时，我仍愿意对少数清晰方向保持集中表达。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G085",
    "familyId": "single-da-07",
    "kind": "single",
    "context": "collaboration",
    "prompt": "团队高度一致时，我仍会提醒大家保留分散与缓冲。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G086",
    "familyId": "single-da-07",
    "kind": "single",
    "context": "collaboration",
    "prompt": "团队高度一致且证据充分时，我愿意支持更明确的重点。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G087",
    "familyId": "single-da-08",
    "kind": "single",
    "context": "volatility",
    "prompt": "遇到连续失误时，我通常先降低整体暴露并恢复节奏。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G088",
    "familyId": "single-da-08",
    "kind": "single",
    "context": "volatility",
    "prompt": "遇到连续失误时，我会更集中地寻找一个高质量判断扭转状态。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G089",
    "familyId": "single-da-09",
    "kind": "single",
    "context": "risk",
    "prompt": "我会把睡得安稳和保持可调整空间看成重要约束。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G090",
    "familyId": "single-da-09",
    "kind": "single",
    "context": "risk",
    "prompt": "只要潜在价值足够清晰，我能接受更强的结果波动。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G091",
    "familyId": "single-da-10",
    "kind": "single",
    "context": "execution",
    "prompt": "面对多个相似机会，我更愿意分开验证而非只选一个。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G092",
    "familyId": "single-da-10",
    "kind": "single",
    "context": "execution",
    "prompt": "面对多个相似机会，我更愿意选出最有把握的少数重点。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G093",
    "familyId": "single-da-11",
    "kind": "single",
    "context": "review",
    "prompt": "一个判断正确但承担了过多风险，我仍会认为过程需要改进。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G094",
    "familyId": "single-da-11",
    "kind": "single",
    "context": "review",
    "prompt": "一个判断正确却表达得太轻，我会认为过程没有充分利用确信。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G095",
    "familyId": "single-da-12",
    "kind": "single",
    "context": "risk",
    "prompt": "我更关注最坏情况下自己还能否保持选择空间。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G096",
    "familyId": "single-da-12",
    "kind": "single",
    "context": "risk",
    "prompt": "我更关注判断正确时是否有足够清晰的表达。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G097",
    "familyId": "single-da-13",
    "kind": "single",
    "context": "volatility",
    "prompt": "突发变化出现时，我倾向先保护整体稳定性。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G098",
    "familyId": "single-da-13",
    "kind": "single",
    "context": "volatility",
    "prompt": "突发变化出现时，我倾向迅速把资源集中到最清晰的方向。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G099",
    "familyId": "single-da-14",
    "kind": "single",
    "context": "collaboration",
    "prompt": "别人非常兴奋时，我常补充边界、相关性和反方情景。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G100",
    "familyId": "single-da-14",
    "kind": "single",
    "context": "collaboration",
    "prompt": "别人过度犹豫时，我常推动大家明确最值得表达的核心判断。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G101",
    "familyId": "single-da-15",
    "kind": "single",
    "context": "risk",
    "prompt": "我认为留下余地本身就是判断质量的一部分。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G102",
    "familyId": "single-da-15",
    "kind": "single",
    "context": "risk",
    "prompt": "我认为确信形成后，敢于鲜明表达也是判断质量的一部分。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G103",
    "familyId": "single-da-16",
    "kind": "single",
    "context": "execution",
    "prompt": "行动前，我更容易先确定不能承受什么。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G104",
    "familyId": "single-da-16",
    "kind": "single",
    "context": "execution",
    "prompt": "行动前，我更容易先确定最值得投入注意力的方向。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G105",
    "familyId": "single-da-17",
    "kind": "single",
    "context": "review",
    "prompt": "回看压力时刻，我更认可自己曾主动减少单点依赖。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G106",
    "familyId": "single-da-17",
    "kind": "single",
    "context": "review",
    "prompt": "回看压力时刻，我更认可自己曾守住少数核心判断。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G107",
    "familyId": "single-da-18",
    "kind": "single",
    "context": "collaboration",
    "prompt": "共同决策时，我倾向让不同观点都保留一定试错空间。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "更常表现出 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G108",
    "familyId": "single-da-18",
    "kind": "single",
    "context": "collaboration",
    "prompt": "共同决策时，我倾向让证据最强的观点拥有更明确的优先级。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "更常表现出 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G109",
    "familyId": "single-pf-01",
    "kind": "single",
    "context": "execution",
    "prompt": "行动前，我通常希望把触发条件和退出条件写清楚。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G110",
    "familyId": "single-pf-01",
    "kind": "single",
    "context": "execution",
    "prompt": "行动前，我通常保留较大空间根据后续信息调整。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G111",
    "familyId": "single-pf-02",
    "kind": "single",
    "context": "signal",
    "prompt": "突发消息出现时，我会先检查它是否符合原来的行动框架。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G112",
    "familyId": "single-pf-02",
    "kind": "single",
    "context": "signal",
    "prompt": "突发消息出现时，我会先根据最新变化调整原来的行动框架。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G113",
    "familyId": "single-pf-03",
    "kind": "single",
    "context": "execution",
    "prompt": "预设条件已经触发时，我倾向先执行再复盘。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G114",
    "familyId": "single-pf-03",
    "kind": "single",
    "context": "execution",
    "prompt": "预设条件已经触发时，我仍会结合当下情境重新判断。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G115",
    "familyId": "single-pf-04",
    "kind": "single",
    "context": "review",
    "prompt": "我更喜欢在固定复盘节点集中修改规则。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G116",
    "familyId": "single-pf-04",
    "kind": "single",
    "context": "review",
    "prompt": "我更喜欢在环境变化时随时修改规则。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G117",
    "familyId": "single-pf-05",
    "kind": "single",
    "context": "volatility",
    "prompt": "压力升高时，事先写好的步骤会让我更容易保持稳定。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G118",
    "familyId": "single-pf-05",
    "kind": "single",
    "context": "volatility",
    "prompt": "压力升高时，保留临场调整空间会让我更容易保持稳定。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G119",
    "familyId": "single-pf-06",
    "kind": "single",
    "context": "execution",
    "prompt": "我不喜欢在行动过程中频繁改变最初定义的成功标准。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G120",
    "familyId": "single-pf-06",
    "kind": "single",
    "context": "execution",
    "prompt": "新信息足够重要时，我不介意在行动过程中重写成功标准。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G121",
    "familyId": "single-pf-07",
    "kind": "single",
    "context": "collaboration",
    "prompt": "共同执行前，我希望每个人先对流程和边界达成一致。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G122",
    "familyId": "single-pf-07",
    "kind": "single",
    "context": "collaboration",
    "prompt": "共同执行时，我希望每个人能根据现场变化快速补位。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G123",
    "familyId": "single-pf-08",
    "kind": "single",
    "context": "review",
    "prompt": "复盘一次失误时，我会先检查有没有偏离原计划。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G124",
    "familyId": "single-pf-08",
    "kind": "single",
    "context": "review",
    "prompt": "复盘一次失误时，我会先检查临场调整是否跟上变化。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G125",
    "familyId": "single-pf-09",
    "kind": "single",
    "context": "execution",
    "prompt": "面对熟悉情境，我更愿意复用已经验证过的清单。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G126",
    "familyId": "single-pf-09",
    "kind": "single",
    "context": "execution",
    "prompt": "面对熟悉情境，我仍愿意根据细节重新组织处理方式。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G127",
    "familyId": "single-pf-10",
    "kind": "single",
    "context": "signal",
    "prompt": "信息突然增多时，我倾向按既定优先级逐项处理。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G128",
    "familyId": "single-pf-10",
    "kind": "single",
    "context": "signal",
    "prompt": "信息突然增多时，我倾向立即重排优先级处理最紧迫变化。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G129",
    "familyId": "single-pf-11",
    "kind": "single",
    "context": "risk",
    "prompt": "不确定性较高时，我更依赖提前设定的边界。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G130",
    "familyId": "single-pf-11",
    "kind": "single",
    "context": "risk",
    "prompt": "不确定性较高时，我更依赖持续观察和动态调整。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G131",
    "familyId": "single-pf-12",
    "kind": "single",
    "context": "execution",
    "prompt": "开始之前，我喜欢知道接下来几步大致会怎样展开。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G132",
    "familyId": "single-pf-12",
    "kind": "single",
    "context": "execution",
    "prompt": "开始之前，我只需明确方向，具体步骤可以边走边定。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G133",
    "familyId": "single-pf-13",
    "kind": "single",
    "context": "collaboration",
    "prompt": "团队临时改变方向时，我会要求先说明原计划为什么失效。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G134",
    "familyId": "single-pf-13",
    "kind": "single",
    "context": "collaboration",
    "prompt": "团队临时改变方向时，只要新信息充分，我能迅速切换。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G135",
    "familyId": "single-pf-14",
    "kind": "single",
    "context": "review",
    "prompt": "我更担心临场冲动破坏一套原本合理的流程。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G136",
    "familyId": "single-pf-14",
    "kind": "single",
    "context": "review",
    "prompt": "我更担心僵化流程让自己错过已经发生的变化。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G137",
    "familyId": "single-pf-15",
    "kind": "single",
    "context": "execution",
    "prompt": "一个好流程对我而言应该容易记录、复现和检查。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G138",
    "familyId": "single-pf-15",
    "kind": "single",
    "context": "execution",
    "prompt": "一个好流程对我而言应该能随环境快速改变形态。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G139",
    "familyId": "single-pf-16",
    "kind": "single",
    "context": "volatility",
    "prompt": "节奏混乱时，我通常会回到清单和预设步骤。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G140",
    "familyId": "single-pf-16",
    "kind": "single",
    "context": "volatility",
    "prompt": "节奏混乱时，我通常会先处理眼前最强的新信号。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G141",
    "familyId": "single-pf-17",
    "kind": "single",
    "context": "research",
    "prompt": "形成判断后，我希望把行动条件转换成明确规则。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G142",
    "familyId": "single-pf-17",
    "kind": "single",
    "context": "research",
    "prompt": "形成判断后，我希望保留根据新证据灵活解释的空间。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G143",
    "familyId": "single-pf-18",
    "kind": "single",
    "context": "review",
    "prompt": "回看一次顺利执行，我更认可自己始终遵守了关键步骤。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "更常表现出 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G144",
    "familyId": "single-pf-18",
    "kind": "single",
    "context": "review",
    "prompt": "回看一次顺利执行，我更认可自己及时响应了意外变化。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "更常表现出 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G145",
    "familyId": "dual-rs-ht-00",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会先把事实与逻辑弄清，同时给判断更长的验证时间。",
    "loadings": {
      "RS": -0.65,
      "HT": -0.35
    },
    "direction": {
      "RS": -1,
      "HT": -1
    },
    "clue": "同时呈现 R 与 H 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G146",
    "familyId": "dual-rs-ht-01",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会先把事实与逻辑弄清，同时用较短周期持续校准。",
    "loadings": {
      "RS": -0.65,
      "HT": 0.35
    },
    "direction": {
      "RS": -1,
      "HT": 1
    },
    "clue": "同时呈现 R 与 T 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G147",
    "familyId": "dual-rs-ht-10",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会先观察市场反馈是否形成，同时给判断更长的验证时间。",
    "loadings": {
      "RS": 0.65,
      "HT": -0.35
    },
    "direction": {
      "RS": 1,
      "HT": -1
    },
    "clue": "同时呈现 S 与 H 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G148",
    "familyId": "dual-rs-ht-11",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会先观察市场反馈是否形成，同时用较短周期持续校准。",
    "loadings": {
      "RS": 0.65,
      "HT": 0.35
    },
    "direction": {
      "RS": 1,
      "HT": 1
    },
    "clue": "同时呈现 S 与 T 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G149",
    "familyId": "dual-rs-ht-00",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时先把事实与逻辑弄清，并且给判断更长的验证时间。",
    "loadings": {
      "RS": -0.35,
      "HT": -0.65
    },
    "direction": {
      "RS": -1,
      "HT": -1
    },
    "clue": "同时呈现 R 与 H 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G150",
    "familyId": "dual-rs-ht-01",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时先把事实与逻辑弄清，并且用较短周期持续校准。",
    "loadings": {
      "RS": -0.35,
      "HT": 0.65
    },
    "direction": {
      "RS": -1,
      "HT": 1
    },
    "clue": "同时呈现 R 与 T 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G151",
    "familyId": "dual-rs-ht-10",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时先观察市场反馈是否形成，并且给判断更长的验证时间。",
    "loadings": {
      "RS": 0.35,
      "HT": -0.65
    },
    "direction": {
      "RS": 1,
      "HT": -1
    },
    "clue": "同时呈现 S 与 H 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G152",
    "familyId": "dual-rs-ht-11",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时先观察市场反馈是否形成，并且用较短周期持续校准。",
    "loadings": {
      "RS": 0.35,
      "HT": 0.65
    },
    "direction": {
      "RS": 1,
      "HT": 1
    },
    "clue": "同时呈现 S 与 T 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G153",
    "familyId": "dual-rs-da-00",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会先把事实与逻辑弄清，同时先守住整体风险边界。",
    "loadings": {
      "RS": -0.65,
      "DA": -0.35
    },
    "direction": {
      "RS": -1,
      "DA": -1
    },
    "clue": "同时呈现 R 与 D 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G154",
    "familyId": "dual-rs-da-01",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会先把事实与逻辑弄清，同时对高确信方向做更鲜明表达。",
    "loadings": {
      "RS": -0.65,
      "DA": 0.35
    },
    "direction": {
      "RS": -1,
      "DA": 1
    },
    "clue": "同时呈现 R 与 A 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G155",
    "familyId": "dual-rs-da-10",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会先观察市场反馈是否形成，同时先守住整体风险边界。",
    "loadings": {
      "RS": 0.65,
      "DA": -0.35
    },
    "direction": {
      "RS": 1,
      "DA": -1
    },
    "clue": "同时呈现 S 与 D 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G156",
    "familyId": "dual-rs-da-11",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会先观察市场反馈是否形成，同时对高确信方向做更鲜明表达。",
    "loadings": {
      "RS": 0.65,
      "DA": 0.35
    },
    "direction": {
      "RS": 1,
      "DA": 1
    },
    "clue": "同时呈现 S 与 A 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G157",
    "familyId": "dual-rs-da-00",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时先把事实与逻辑弄清，并且先守住整体风险边界。",
    "loadings": {
      "RS": -0.35,
      "DA": -0.65
    },
    "direction": {
      "RS": -1,
      "DA": -1
    },
    "clue": "同时呈现 R 与 D 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G158",
    "familyId": "dual-rs-da-01",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时先把事实与逻辑弄清，并且对高确信方向做更鲜明表达。",
    "loadings": {
      "RS": -0.35,
      "DA": 0.65
    },
    "direction": {
      "RS": -1,
      "DA": 1
    },
    "clue": "同时呈现 R 与 A 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G159",
    "familyId": "dual-rs-da-10",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时先观察市场反馈是否形成，并且先守住整体风险边界。",
    "loadings": {
      "RS": 0.35,
      "DA": -0.65
    },
    "direction": {
      "RS": 1,
      "DA": -1
    },
    "clue": "同时呈现 S 与 D 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G160",
    "familyId": "dual-rs-da-11",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时先观察市场反馈是否形成，并且对高确信方向做更鲜明表达。",
    "loadings": {
      "RS": 0.35,
      "DA": 0.65
    },
    "direction": {
      "RS": 1,
      "DA": 1
    },
    "clue": "同时呈现 S 与 A 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G161",
    "familyId": "dual-rs-pf-00",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会先把事实与逻辑弄清，同时按预先写好的条件行动。",
    "loadings": {
      "RS": -0.65,
      "PF": -0.35
    },
    "direction": {
      "RS": -1,
      "PF": -1
    },
    "clue": "同时呈现 R 与 P 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G162",
    "familyId": "dual-rs-pf-01",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会先把事实与逻辑弄清，同时根据新信息及时调整。",
    "loadings": {
      "RS": -0.65,
      "PF": 0.35
    },
    "direction": {
      "RS": -1,
      "PF": 1
    },
    "clue": "同时呈现 R 与 F 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G163",
    "familyId": "dual-rs-pf-10",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会先观察市场反馈是否形成，同时按预先写好的条件行动。",
    "loadings": {
      "RS": 0.65,
      "PF": -0.35
    },
    "direction": {
      "RS": 1,
      "PF": -1
    },
    "clue": "同时呈现 S 与 P 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G164",
    "familyId": "dual-rs-pf-11",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会先观察市场反馈是否形成，同时根据新信息及时调整。",
    "loadings": {
      "RS": 0.65,
      "PF": 0.35
    },
    "direction": {
      "RS": 1,
      "PF": 1
    },
    "clue": "同时呈现 S 与 F 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G165",
    "familyId": "dual-rs-pf-00",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时先把事实与逻辑弄清，并且按预先写好的条件行动。",
    "loadings": {
      "RS": -0.35,
      "PF": -0.65
    },
    "direction": {
      "RS": -1,
      "PF": -1
    },
    "clue": "同时呈现 R 与 P 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G166",
    "familyId": "dual-rs-pf-01",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时先把事实与逻辑弄清，并且根据新信息及时调整。",
    "loadings": {
      "RS": -0.35,
      "PF": 0.65
    },
    "direction": {
      "RS": -1,
      "PF": 1
    },
    "clue": "同时呈现 R 与 F 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G167",
    "familyId": "dual-rs-pf-10",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时先观察市场反馈是否形成，并且按预先写好的条件行动。",
    "loadings": {
      "RS": 0.35,
      "PF": -0.65
    },
    "direction": {
      "RS": 1,
      "PF": -1
    },
    "clue": "同时呈现 S 与 P 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G168",
    "familyId": "dual-rs-pf-11",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时先观察市场反馈是否形成，并且根据新信息及时调整。",
    "loadings": {
      "RS": 0.35,
      "PF": 0.65
    },
    "direction": {
      "RS": 1,
      "PF": 1
    },
    "clue": "同时呈现 S 与 F 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G169",
    "familyId": "dual-ht-da-00",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会给判断更长的验证时间，同时先守住整体风险边界。",
    "loadings": {
      "HT": -0.65,
      "DA": -0.35
    },
    "direction": {
      "HT": -1,
      "DA": -1
    },
    "clue": "同时呈现 H 与 D 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G170",
    "familyId": "dual-ht-da-01",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会给判断更长的验证时间，同时对高确信方向做更鲜明表达。",
    "loadings": {
      "HT": -0.65,
      "DA": 0.35
    },
    "direction": {
      "HT": -1,
      "DA": 1
    },
    "clue": "同时呈现 H 与 A 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G171",
    "familyId": "dual-ht-da-10",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会用较短周期持续校准，同时先守住整体风险边界。",
    "loadings": {
      "HT": 0.65,
      "DA": -0.35
    },
    "direction": {
      "HT": 1,
      "DA": -1
    },
    "clue": "同时呈现 T 与 D 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G172",
    "familyId": "dual-ht-da-11",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会用较短周期持续校准，同时对高确信方向做更鲜明表达。",
    "loadings": {
      "HT": 0.65,
      "DA": 0.35
    },
    "direction": {
      "HT": 1,
      "DA": 1
    },
    "clue": "同时呈现 T 与 A 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G173",
    "familyId": "dual-ht-da-00",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时给判断更长的验证时间，并且先守住整体风险边界。",
    "loadings": {
      "HT": -0.35,
      "DA": -0.65
    },
    "direction": {
      "HT": -1,
      "DA": -1
    },
    "clue": "同时呈现 H 与 D 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G174",
    "familyId": "dual-ht-da-01",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时给判断更长的验证时间，并且对高确信方向做更鲜明表达。",
    "loadings": {
      "HT": -0.35,
      "DA": 0.65
    },
    "direction": {
      "HT": -1,
      "DA": 1
    },
    "clue": "同时呈现 H 与 A 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G175",
    "familyId": "dual-ht-da-10",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时用较短周期持续校准，并且先守住整体风险边界。",
    "loadings": {
      "HT": 0.35,
      "DA": -0.65
    },
    "direction": {
      "HT": 1,
      "DA": -1
    },
    "clue": "同时呈现 T 与 D 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G176",
    "familyId": "dual-ht-da-11",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时用较短周期持续校准，并且对高确信方向做更鲜明表达。",
    "loadings": {
      "HT": 0.35,
      "DA": 0.65
    },
    "direction": {
      "HT": 1,
      "DA": 1
    },
    "clue": "同时呈现 T 与 A 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G177",
    "familyId": "dual-ht-pf-00",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会给判断更长的验证时间，同时按预先写好的条件行动。",
    "loadings": {
      "HT": -0.65,
      "PF": -0.35
    },
    "direction": {
      "HT": -1,
      "PF": -1
    },
    "clue": "同时呈现 H 与 P 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G178",
    "familyId": "dual-ht-pf-01",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会给判断更长的验证时间，同时根据新信息及时调整。",
    "loadings": {
      "HT": -0.65,
      "PF": 0.35
    },
    "direction": {
      "HT": -1,
      "PF": 1
    },
    "clue": "同时呈现 H 与 F 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G179",
    "familyId": "dual-ht-pf-10",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会用较短周期持续校准，同时按预先写好的条件行动。",
    "loadings": {
      "HT": 0.65,
      "PF": -0.35
    },
    "direction": {
      "HT": 1,
      "PF": -1
    },
    "clue": "同时呈现 T 与 P 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G180",
    "familyId": "dual-ht-pf-11",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会用较短周期持续校准，同时根据新信息及时调整。",
    "loadings": {
      "HT": 0.65,
      "PF": 0.35
    },
    "direction": {
      "HT": 1,
      "PF": 1
    },
    "clue": "同时呈现 T 与 F 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G181",
    "familyId": "dual-ht-pf-00",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时给判断更长的验证时间，并且按预先写好的条件行动。",
    "loadings": {
      "HT": -0.35,
      "PF": -0.65
    },
    "direction": {
      "HT": -1,
      "PF": -1
    },
    "clue": "同时呈现 H 与 P 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G182",
    "familyId": "dual-ht-pf-01",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时给判断更长的验证时间，并且根据新信息及时调整。",
    "loadings": {
      "HT": -0.35,
      "PF": 0.65
    },
    "direction": {
      "HT": -1,
      "PF": 1
    },
    "clue": "同时呈现 H 与 F 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G183",
    "familyId": "dual-ht-pf-10",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时用较短周期持续校准，并且按预先写好的条件行动。",
    "loadings": {
      "HT": 0.35,
      "PF": -0.65
    },
    "direction": {
      "HT": 1,
      "PF": -1
    },
    "clue": "同时呈现 T 与 P 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G184",
    "familyId": "dual-ht-pf-11",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时用较短周期持续校准，并且根据新信息及时调整。",
    "loadings": {
      "HT": 0.35,
      "PF": 0.65
    },
    "direction": {
      "HT": 1,
      "PF": 1
    },
    "clue": "同时呈现 T 与 F 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G185",
    "familyId": "dual-da-pf-00",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会先守住整体风险边界，同时按预先写好的条件行动。",
    "loadings": {
      "DA": -0.65,
      "PF": -0.35
    },
    "direction": {
      "DA": -1,
      "PF": -1
    },
    "clue": "同时呈现 D 与 P 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G186",
    "familyId": "dual-da-pf-01",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会先守住整体风险边界，同时根据新信息及时调整。",
    "loadings": {
      "DA": -0.65,
      "PF": 0.35
    },
    "direction": {
      "DA": -1,
      "PF": 1
    },
    "clue": "同时呈现 D 与 F 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G187",
    "familyId": "dual-da-pf-10",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会对高确信方向做更鲜明表达，同时按预先写好的条件行动。",
    "loadings": {
      "DA": 0.65,
      "PF": -0.35
    },
    "direction": {
      "DA": 1,
      "PF": -1
    },
    "clue": "同时呈现 A 与 P 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G188",
    "familyId": "dual-da-pf-11",
    "kind": "dual",
    "context": "collaboration",
    "prompt": "信息还不完整时，我通常会对高确信方向做更鲜明表达，同时根据新信息及时调整。",
    "loadings": {
      "DA": 0.65,
      "PF": 0.35
    },
    "direction": {
      "DA": 1,
      "PF": 1
    },
    "clue": "同时呈现 A 与 F 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G189",
    "familyId": "dual-da-pf-00",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时先守住整体风险边界，并且按预先写好的条件行动。",
    "loadings": {
      "DA": -0.35,
      "PF": -0.65
    },
    "direction": {
      "DA": -1,
      "PF": -1
    },
    "clue": "同时呈现 D 与 P 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G190",
    "familyId": "dual-da-pf-01",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时先守住整体风险边界，并且根据新信息及时调整。",
    "loadings": {
      "DA": -0.35,
      "PF": 0.65
    },
    "direction": {
      "DA": -1,
      "PF": 1
    },
    "clue": "同时呈现 D 与 F 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G191",
    "familyId": "dual-da-pf-10",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时对高确信方向做更鲜明表达，并且按预先写好的条件行动。",
    "loadings": {
      "DA": 0.35,
      "PF": -0.65
    },
    "direction": {
      "DA": 1,
      "PF": -1
    },
    "clue": "同时呈现 A 与 P 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G192",
    "familyId": "dual-da-pf-11",
    "kind": "dual",
    "context": "review",
    "prompt": "回看一次重要决定，我更认可自己当时对高确信方向做更鲜明表达，并且根据新信息及时调整。",
    "loadings": {
      "DA": 0.35,
      "PF": 0.65
    },
    "direction": {
      "DA": 1,
      "PF": 1
    },
    "clue": "同时呈现 A 与 F 的处理偏好",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G193",
    "familyId": "anchor-rs",
    "kind": "anchor",
    "context": "review",
    "prompt": "即使没有人关注，我也愿意先靠独立研究形成判断。",
    "loadings": {
      "RS": -1
    },
    "direction": {
      "RS": -1
    },
    "clue": "复核 R 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G194",
    "familyId": "anchor-rs",
    "kind": "anchor",
    "context": "review",
    "prompt": "即使材料还不完整，持续的市场反馈也会帮助我形成判断。",
    "loadings": {
      "RS": 1
    },
    "direction": {
      "RS": 1
    },
    "clue": "复核 S 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G195",
    "familyId": "anchor-ht",
    "kind": "anchor",
    "context": "review",
    "prompt": "只要关键路径没有改变，我能接受结果晚一些出现。",
    "loadings": {
      "HT": -1
    },
    "direction": {
      "HT": -1
    },
    "clue": "复核 H 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G196",
    "familyId": "anchor-ht",
    "kind": "anchor",
    "context": "review",
    "prompt": "如果迟迟没有阶段反馈，我会倾向尽快切换观察对象。",
    "loadings": {
      "HT": 1
    },
    "direction": {
      "HT": 1
    },
    "clue": "复核 T 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G197",
    "familyId": "anchor-da",
    "kind": "anchor",
    "context": "review",
    "prompt": "再有把握的判断，我也希望保留足够的缓冲和退路。",
    "loadings": {
      "DA": -1
    },
    "direction": {
      "DA": -1
    },
    "clue": "复核 D 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G198",
    "familyId": "anchor-da",
    "kind": "anchor",
    "context": "review",
    "prompt": "证据足够集中时，我愿意让关键判断拥有明显优先级。",
    "loadings": {
      "DA": 1
    },
    "direction": {
      "DA": 1
    },
    "clue": "复核 A 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G199",
    "familyId": "anchor-pf",
    "kind": "anchor",
    "context": "review",
    "prompt": "环境越嘈杂，我越愿意依靠事先写好的步骤。",
    "loadings": {
      "PF": -1
    },
    "direction": {
      "PF": -1
    },
    "clue": "复核 P 端倾向",
    "version": "tt16-guess-items-1.0.0"
  },
  {
    "id": "G200",
    "familyId": "anchor-pf",
    "kind": "anchor",
    "context": "review",
    "prompt": "环境变化越快，我越愿意边观察边调整处理方式。",
    "loadings": {
      "PF": 1
    },
    "direction": {
      "PF": 1
    },
    "clue": "复核 F 端倾向",
    "version": "tt16-guess-items-1.0.0"
  }
] satisfies readonly AdaptiveQuestionV1[])
