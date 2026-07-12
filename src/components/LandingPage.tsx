import {
  ArrowRight,
  BarChart3,
  Check,
  Clock3,
  Compass,
  Fingerprint,
  GitBranch,
  LockKeyhole,
  MousePointer2,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import { BrandMark, HeroIllustration, MiniScene } from './Illustrations'
import { SOURCE_REPOSITORY_URL } from '../lib/project'

type LandingPageProps = {
  hasProgress: boolean
  answeredCount: number
  busy?: boolean
  error?: string | null
  onStart: () => void
  onResume: () => void
  onPreview: () => void
  onAbout: () => void
  onRecover: () => void
  onSupport: () => void
}

const dimensions = [
  {
    index: '01',
    question: '你主要看什么？',
    left: 'R · 研究',
    right: 'S · 信号',
    caption: '观点从公司价值出发，还是从市场反馈出发',
    color: 'purple',
  },
  {
    index: '02',
    question: '你愿意等多久？',
    left: 'H · 持有',
    right: 'T · 交易',
    caption: '让逻辑慢慢兑现，还是持续捕捉阶段机会',
    color: 'coral',
  },
  {
    index: '03',
    question: '你通常下多大？',
    left: 'D · 防守',
    right: 'A · 进攻',
    caption: '优先控制组合波动，还是集中表达确信度',
    color: 'green',
  },
  {
    index: '04',
    question: '你怎么执行？',
    left: 'P · 计划',
    right: 'F · 灵活',
    caption: '依赖预设规则，还是根据信息快速调整',
    color: 'gold',
  },
]

const groups = [
  {
    group: 'RH' as const,
    code: 'R × H',
    title: '企业复利族',
    description: '理解生意，等待价值慢慢长大。',
    people: '复利园丁 · 价值守望者 · 高确信舵手 · 信仰船长',
  },
  {
    group: 'RT' as const,
    code: 'R × T',
    title: '预期差猎手族',
    description: '研究事实，也敏锐捕捉定价变化。',
    people: '财报工程师 · 事件雷达 · 预期差狙击手 · 错杀猎手',
  },
  {
    group: 'SH' as const,
    code: 'S × H',
    title: '趋势赛道族',
    description: '识别方向，让市场证明判断。',
    people: '趋势配置师 · 轮动领航员 · 赛道骑士 · 主题追光者',
  },
  {
    group: 'ST' as const,
    code: 'S × T',
    title: '盘面动量族',
    description: '尊重反馈，在变化里保持速度。',
    people: '系统波段手 · 盘面游侠 · 突破狙击手 · 火箭驾驶员',
  },
]

export function LandingPage({
  hasProgress,
  answeredCount,
  busy = false,
  error = null,
  onStart,
  onResume,
  onPreview,
  onAbout,
  onRecover,
  onSupport,
}: LandingPageProps) {
  const scrollToModel = () => document.querySelector('#model')?.scrollIntoView({ behavior: 'smooth' })

  return (
    <>
      <header className="site-header shell">
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="TT16 首页">
          <BrandMark size={38} />
          <span className="brand-word">TT16</span>
          <span className="brand-divider" />
          <span className="brand-subtitle">交易人格十六型</span>
        </button>
        <nav className="site-nav" aria-label="主导航">
          <button onClick={scrollToModel}>认识模型</button>
          <button onClick={onRecover}>恢复报告</button>
          <button onClick={onAbout}>关于 TT16</button>
          <a className="source-link" href={SOURCE_REPOSITORY_URL} target="_blank" rel="noreferrer"><GitBranch size={15} />开源源码</a>
          <button className="nav-cta" onClick={hasProgress ? onResume : onStart}>
            {hasProgress ? '继续测试' : '开始测试'}
            <ArrowRight size={16} />
          </button>
        </nav>
      </header>

      <main>
        <section className="hero shell">
          <div className="hero-copy">
            <div className="eyebrow-pill">
              <Sparkles size={15} />
              20 个真实交易情境 · 发现你的稳定倾向
            </div>
            <h1>
              你是哪一种
              <br />
              <span>交易人格？</span>
            </h1>
            <p className="hero-lead">
              你依靠什么形成判断，愿意等多久，如何使用仓位，又怎样执行计划？四个维度，组合出属于你的交易风格。
            </p>
            <div className="commerce-note"><strong>测试免费完成</strong><span>完整结果与报告 ¥4.9</span><span>一次购买，不自动续费</span></div>
            {error && <div className="landing-error" role="alert">{error}</div>}
            <div className="hero-actions">
              <button className="button button--primary button--large" onClick={hasProgress ? onResume : onStart} disabled={busy}>
                {busy ? '正在创建安全会话…' : hasProgress ? `继续上次测试 · ${answeredCount}/20` : '开始认识自己'}
                <ArrowRight size={19} />
              </button>
              <button className="text-button" onClick={onPreview}>
                先看示例报告
                <span aria-hidden="true">↗</span>
              </button>
            </div>
            <ul className="trust-row" aria-label="测试说明">
              <li><Clock3 />约 3–5 分钟</li>
              <li><LockKeyhole />无需注册</li>
              <li><ShieldCheck />娱乐测试 · 非投资建议</li>
            </ul>
          </div>
          <div className="hero-visual">
            <HeroIllustration />
            <div className="floating-note floating-note--top">
              <span>4</span>
              个核心维度
            </div>
            <div className="floating-note floating-note--bottom">
              <span>16</span>
              种交易人格
            </div>
          </div>
        </section>

        <section className="signal-strip" aria-label="产品原则">
          <div className="shell signal-strip__inner">
            <span><Check />不评判“会不会赚钱”</span>
            <span><Check />每种风格都有优势与盲点</span>
            <span><Check />给你一份可执行的交易守则</span>
          </div>
        </section>

        <section className="section shell intro-section" id="model">
          <div className="section-heading section-heading--split">
            <div>
              <p className="eyebrow">不是标签，是一张决策地图</p>
              <h2>四个问题，拼出你的交易方式</h2>
            </div>
            <p>我们不把研究说成理性，也不把灵活等同冲动。每个维度都只描述一种偏好，不做高低排名。</p>
          </div>
          <div className="dimension-grid">
            {dimensions.map((dimension) => (
              <article className={`dimension-card dimension-card--${dimension.color}`} key={dimension.index}>
                <div className="dimension-card__top">
                  <span>{dimension.index}</span>
                  <Compass size={22} />
                </div>
                <h3>{dimension.question}</h3>
                <p>{dimension.caption}</p>
                <div className="dimension-axis">
                  <strong>{dimension.left}</strong>
                  <i />
                  <strong>{dimension.right}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="section groups-section">
          <div className="shell">
            <div className="section-heading section-heading--center">
              <p className="eyebrow">16 种风格，没有标准答案</p>
              <h2>先认识四大交易阵营</h2>
              <p>同一个方法，在不同市场里会呈现完全不同的力量。找到自己的“使用说明”，比模仿别人的答案更重要。</p>
            </div>
            <div className="group-grid">
              {groups.map((item) => (
                <article className={`group-card group-card--${item.group.toLowerCase()}`} key={item.group}>
                  <div className="group-card__visual"><MiniScene group={item.group} /></div>
                  <div className="group-card__copy">
                    <span className="group-code">{item.code}</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <small>{item.people}</small>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section shell steps-section">
          <div className="section-heading section-heading--center">
            <p className="eyebrow">一次不费力的自我复盘</p>
            <h2>从真实选择，到可执行洞察</h2>
          </div>
          <div className="steps-grid">
            <article>
              <span className="step-icon"><MousePointer2 /></span>
              <small>STEP 01</small>
              <h3>回答真实情境</h3>
              <p>不是“理想中的你”，而是回想过去一年真正做过的选择。</p>
            </article>
            <article>
              <span className="step-icon"><Fingerprint /></span>
              <small>STEP 02</small>
              <h3>组合四维画像</h3>
              <p>连续百分比保留细节；即使同一类型，也能看见不同倾向。</p>
            </article>
            <article>
              <span className="step-icon"><BarChart3 /></span>
              <small>STEP 03</small>
              <h3>带走行动守则</h3>
              <p>看见优势过度使用后的盲点，并保存一份自己的复盘清单。</p>
            </article>
          </div>
        </section>

        <section className="section shell cta-panel">
          <div className="cta-panel__copy">
            <p className="eyebrow">准备好了吗？</p>
            <h2>给自己的交易方式，做一次系统复盘。</h2>
            <p>测试免费完成，完整报告 ¥4.9；不连接券商账户。</p>
          </div>
          <button className="button button--light button--large" onClick={onStart}>
            开始 20 道情境题
            <ArrowRight size={19} />
          </button>
          <RefreshCcw className="cta-panel__deco" aria-hidden="true" />
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell site-footer__inner">
          <div className="footer-brand">
            <BrandMark size={34} />
            <div><strong>TT16</strong><span>TradeType 16 · 交易人格十六型</span></div>
          </div>
          <p>结果仅供自我观察与娱乐，不构成投资建议、收益承诺或风险承受能力评估。</p>
          <div className="footer-links">
            <button onClick={onRecover}>恢复报告</button>
            <button onClick={onSupport}>售后与数据权利</button>
            <button onClick={onAbout}>模型、隐私与售后</button>
            <a href={SOURCE_REPOSITORY_URL} target="_blank" rel="noreferrer">AGPL-3.0 源码</a>
            <span>Commercial preview v1.1</span>
          </div>
        </div>
      </footer>
    </>
  )
}
