import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowDown,
  Check,
  CircleGauge,
  Clipboard,
  Copy,
  Download,
  Flame,
  Gauge,
  GitBranch,
  Info,
  Lightbulb,
  LockKeyhole,
  RefreshCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  Target,
  ThumbsUp,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react'
import type { AssessmentScore, DimensionScore } from '../lib/scoring'
import type { CommercialAssessmentScore } from '../lib/commercialScoring'
import { downloadShareCard, type ShareDimension } from '../lib/shareCard'
import { SOURCE_REPOSITORY_URL } from '../lib/project'
import { BrandMark, type IllustrationGroup } from './Illustrations'

type ResultPageProps = {
  result: AssessmentScore | CommercialAssessmentScore
  onRestart: () => void
  onHome: () => void
  onAbout: () => void
  onRecover?: () => void
  onSupport?: () => void
  onCardGenerate?: (format: 'square' | 'story') => void
  onShareClick?: (target: 'native' | 'clipboard') => void
  isSample?: boolean
  onFeedback?: (value: 'like' | 'neutral' | 'unlike') => Promise<void> | void
}

type ResultData = AssessmentScore | CommercialAssessmentScore

const groupCode: Record<AssessmentScore['profile']['group'], IllustrationGroup> = {
  企业复利族: 'RH',
  预期差猎手族: 'RT',
  趋势赛道族: 'SH',
  盘面动量族: 'ST',
}

const dimensionMeta = {
  RS: { question: '如何形成观点', left: '研究驱动', right: '信号驱动' },
  HT: { question: '愿意等待多久', left: '持有型', right: '交易型' },
  DA: { question: '怎样表达风险', left: '防守型', right: '进攻型' },
  PF: { question: '如何执行计划', left: '计划型', right: '灵活型' },
} as const

const qualityLabels = {
  high: '高可信结果',
  medium: '中等可信结果',
  low: '低可信结果',
  insufficient: '探索性结果',
} as const

const stabilityLabels = {
  stable: '四维倾向稳定',
  one_boundary: '一项接近边界',
  multiple_boundaries: '多项接近边界',
} as const

const badgeIcons = [Flame, TrendingDown, Gauge, Sparkles, CircleGauge, Clipboard]

const personalityImage = (typeCode: string) => `${import.meta.env.BASE_URL}images/personalities-v2/${typeCode}.webp`

function chosenPercent(dimension: DimensionScore) {
  return dimension.chosenLetter === dimension.leftLetter
    ? dimension.leftPercent
    : dimension.rightPercent
}

function ShareDialog({
  open,
  onClose,
  result,
  group,
  onCardGenerate,
  onShareClick,
}: {
  open: boolean
  onClose: () => void
  result: ResultData
  group: IllustrationGroup
  onCardGenerate?: (format: 'square' | 'story') => void
  onShareClick?: (target: 'native' | 'clipboard') => void
}) {
  const [format, setFormat] = useState<'square' | 'story'>('square')
  const [copied, setCopied] = useState(false)
  const dimensions: ShareDimension[] = result.dimensions.map((dimension) => ({
    letter: dimension.chosenLetter,
    label: dimensionMeta[dimension.key][dimension.chosenLetter === dimension.leftLetter ? 'left' : 'right'],
    percent: chosenPercent(dimension),
  }))

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKeyDown)
    document.body.classList.add('modal-open')
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('modal-open')
    }
  }, [onClose, open])

  if (!open) return null

  const saveCard = async () => {
    await downloadShareCard({
      code: result.typeCode,
      name: result.profile.name,
      tagline: result.profile.tagline,
      group,
      dimensions,
      format,
      imageUrl: personalityImage(result.typeCode),
    })
    onCardGenerate?.(format)
  }

  const copyShareText = async () => {
    const text = `我的 TT16 是 ${result.typeCode} · ${result.profile.name}：${result.profile.tagline}。你是哪一种交易人格？`
    if (navigator.share) {
      try {
        await navigator.share({ title: `TT16 · ${result.profile.name}`, text, url: window.location.href })
        onShareClick?.('native')
        return
      } catch {
        // The user can cancel the native share sheet; copying remains available.
      }
    }
    await navigator.clipboard?.writeText(`${text} ${window.location.href}`)
    onShareClick?.('clipboard')
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="share-dialog" role="dialog" aria-modal="true" aria-labelledby="share-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="dialog-header">
          <div className="dialog-brand"><BrandMark size={35} /><span>TT16 分享卡</span></div>
          <button className="icon-button" onClick={onClose} aria-label="关闭"><X /></button>
        </header>
        <div className="share-dialog__body">
          <div className="share-preview-wrap">
            <div className={`share-preview share-preview--${format}`} data-group={group}>
              <div className="share-preview__brand"><BrandMark size={17} />TT16 · 交易人格</div>
              <div className="share-preview__content">
                <strong>{result.typeCode}</strong>
                <h3>{result.profile.name}</h3>
                <p>{result.profile.tagline}</p>
              </div>
              <div className="share-preview__art">
                <img src={personalityImage(result.typeCode)} alt="" />
              </div>
              <div className="share-preview__bars">
                {dimensions.map((dimension) => (
                  <div className="share-preview__bar" key={dimension.letter}>
                    <b>{dimension.letter}</b>
                    <i><span style={{ width: `${dimension.percent}%` }} /></i>
                    <em>{dimension.percent}%</em>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="share-controls">
            <p className="eyebrow">SHARE YOUR TYPE</p>
            <h2 id="share-title">把交易人格，分享给同路人</h2>
            <p>分享卡只包含人格身份和四维倾向，不会展示你的逐题答案或风险徽章。</p>
            <div className="format-switch" role="radiogroup" aria-label="分享卡尺寸">
              <button className={format === 'square' ? 'is-selected' : ''} onClick={() => setFormat('square')} role="radio" aria-checked={format === 'square'}>
                <strong>方形卡片 1:1</strong><span>适合群聊、动态与社区</span>
              </button>
              <button className={format === 'story' ? 'is-selected' : ''} onClick={() => setFormat('story')} role="radio" aria-checked={format === 'story'}>
                <strong>故事卡片 9:16</strong><span>适合朋友圈与手机长图</span>
              </button>
            </div>
            <div className="share-controls__actions">
              <button className="button button--primary" onClick={saveCard}><Download size={17} />保存高清图片</button>
              <button className="button button--ghost" onClick={copyShareText}>
                {copied ? <Check size={17} /> : <Copy size={17} />}
                {copied ? '分享文案已复制' : '分享链接与文案'}
              </button>
            </div>
            <div className="share-privacy"><LockKeyhole size={14} />本地生成，不上传原始答案；保存的图片不含用户标识。</div>
          </div>
        </div>
      </section>
    </div>
  )
}

export function ResultPage({ result, onRestart, onHome, onAbout, onRecover, onSupport, onCardGenerate, onShareClick, isSample = false, onFeedback }: ResultPageProps) {
  const [shareOpen, setShareOpen] = useState(false)
  const [checkedRules, setCheckedRules] = useState<number[]>([])
  const [feedback, setFeedback] = useState<string | null>(null)
  const group = groupCode[result.profile.group]
  const topBadges = useMemo(
    () => 'badges' in result ? [...result.badges].sort((first, second) => second.score - first.score).slice(0, 3) : [],
    [result],
  )

  const qualityLabel = 'badges' in result ? qualityLabels[result.quality.level] : '商业报告已解锁'

  const chooseFeedback = async (value: 'like' | 'neutral' | 'unlike') => {
    setFeedback(value)
    await onFeedback?.(value)
  }

  const toggleRule = (index: number) => {
    setCheckedRules((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])
  }

  return (
    <main className="result-page" data-group={group}>
      <header className="result-header shell">
        <button className="brand" onClick={onHome} aria-label="返回首页">
          <BrandMark size={36} />
          <span className="brand-word">TT16</span>
          <span className="brand-divider" />
          <span className="brand-subtitle">{isSample ? '公开示例报告' : '我的交易人格报告'}</span>
        </button>
        <div className="result-header__actions">
          {onRecover && <button onClick={onRecover}>恢复 / 售后</button>}
          {onSupport && <button onClick={onSupport}>提交工单</button>}
          <button onClick={onAbout}>模型说明</button>
          <a className="source-link" href={SOURCE_REPOSITORY_URL} target="_blank" rel="noreferrer" aria-label="查看源代码"><GitBranch size={15} /><span>源代码</span></a>
          <button className="button button--dark button--compact" onClick={() => setShareOpen(true)}><Share2 size={16} />分享结果</button>
        </div>
      </header>

      <section className="result-hero-wrap shell">
        {isSample && <div className="sample-report-banner"><Info size={15} />这是公开示例报告，不是你的测试结果。</div>}
        <div className="result-hero">
          <div className="result-hero__copy">
            <div className="result-kicker">你的 TT16 交易人格</div>
            <div className="result-code">{result.typeCode}</div>
            <h1 className="result-name">{result.profile.name}</h1>
            <p className="result-tagline">{result.profile.tagline}</p>
            <div className="result-chips">
              <span>{result.profile.group}</span>
              <span>{qualityLabel}</span>
              <span>{stabilityLabels[result.stability]}</span>
            </div>
            <div className="result-actions">
              <button className="button button--primary button--large" onClick={() => setShareOpen(true)}><Share2 size={18} />生成我的人格卡</button>
              <button className="button button--ghost button--large" onClick={() => document.querySelector('#report')?.scrollIntoView({ behavior: 'smooth' })}>阅读完整报告<ArrowDown size={18} /></button>
            </div>
          </div>
          <div className="result-hero__visual">
            <img
              className="personality-portrait"
              src={personalityImage(result.typeCode)}
              alt={`${result.profile.name}人格插画`}
            />
            <div className="result-seal">TRADETYPE<br />16 · REPORT</div>
          </div>
        </div>

        <div className="result-dimensions" aria-label="四维人格倾向">
          {result.dimensions.map((dimension) => {
            const meta = dimensionMeta[dimension.key]
            const percent = chosenPercent(dimension)
            return (
              <article className="result-dimension" key={dimension.key}>
                <div className="result-dimension__top"><strong>{dimension.chosenLetter}</strong><span>{meta.question}</span></div>
                <div className="result-dimension__bar"><span style={{ width: `${percent}%` }} /></div>
                <div className="result-dimension__labels"><span>{dimension.leftLetter} {dimension.leftPercent}%</span><span>{dimension.rightPercent}% {dimension.rightLetter}</span></div>
              </article>
            )
          })}
        </div>
      </section>

      <div className="result-content shell" id="report">
        <section className="result-intro">
          <p className="eyebrow">YOUR DECISION PATTERN</p>
          <h2>你不是在追求更多信息，<br />而是在建立一套自己的判断秩序。</h2>
          <p>{result.profile.description}</p>
        </section>

        <section className="report-section">
          <div className="report-section__heading">
            <div><p className="eyebrow">STRENGTHS &amp; SHADOWS</p><h2>优势，以及它的另一面</h2></div>
            <p>每项优势在过度使用时，都可能变成盲点。把两面放在一起看，才是一张完整画像。</p>
          </div>
          <div className="trait-pairs">
            {result.profile.strengths.map((strength, index) => (
              <article className="trait-pair" key={strength}>
                <div className="trait-side">
                  <div className="trait-side__label"><Sparkles size={13} />优势 {String(index + 1).padStart(2, '0')}</div>
                  <h3>你的自然力量</h3>
                  <p>{strength}</p>
                </div>
                <div className="trait-side trait-side--watch">
                  <div className="trait-side__label"><AlertTriangle size={13} />过度使用时</div>
                  <h3>需要留心的盲点</h3>
                  <p>{result.profile.blindspots[index]}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="report-section">
          <div className="report-section__heading">
            <div><p className="eyebrow">MARKET WEATHER</p><h2>什么环境更容易发挥？</h2></div>
            <p>人格不是策略推荐。这里描述的是你更容易保持清晰、或更容易失去边界的市场结构。</p>
          </div>
          <div className="environment-grid">
            <article className="environment-card">
              <div className="environment-card__title"><TrendingUp size={21} /><h3>更容易顺手的环境</h3></div>
              <ul>{result.profile.bestEnvironments.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="environment-card">
              <div className="environment-card__title"><TrendingDown size={21} /><h3>需要降低确信的环境</h3></div>
              <ul>{result.profile.riskEnvironments.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>
        </section>

        <section className="report-section">
          <div className="pressure-card">
            <div className="pressure-card__icon"><AlertTriangle /></div>
            <div>
              <p className="eyebrow">UNDER PRESSURE</p>
              <h3>压力下，你可能偏离自己的原有方法</h3>
              <p>{result.profile.pressure}</p>
              <div className="pressure-signal">暂停信号：当计划里的“例外”开始比规则更多</div>
            </div>
          </div>
        </section>

        <section className="report-section">
          <div className="report-section__heading">
            <div><p className="eyebrow">RISK SIGNALS</p><h2>三个值得留意的风险信号</h2></div>
            <p>徽章是行为提醒，不参与人格代码，也不是心理诊断。分数会在题库验证后继续校准。</p>
          </div>
          <div className="badge-grid">
            {'badges' in result
              ? topBadges.map((badge, index) => {
                  const Icon = badgeIcons[index]
                  return (
                    <article className="risk-badge" key={badge.key}>
                      <div className="risk-badge__top"><span className="risk-badge__icon"><Icon size={21} /></span><span className={`risk-level risk-level--${badge.level}`}>{badge.levelLabel}</span></div>
                      <h3>{badge.name}</h3>
                      <p>这个信号在近期压力或高波动情境中，可能比平时更明显。</p>
                      <div className="risk-meter"><span style={{ width: `${badge.score}%` }} /></div>
                      <div className="risk-advice"><Lightbulb size={12} /> {badge.advice}</div>
                    </article>
                  )
                })
              : result.pressure.map((item, index) => {
                  const Icon = badgeIcons[index]
                  const meter = item.score ?? 50
                  return (
                    <article className="risk-badge" key={item.key}>
                      <div className="risk-badge__top"><span className="risk-badge__icon"><Icon size={21} /></span><span className={`risk-level risk-level--${item.level}`}>{item.label}</span></div>
                      <h3>{item.name}</h3>
                      <p>这个模块来自商业版压力场景题，不参与四字母人格代码。</p>
                      <div className="risk-meter"><span style={{ width: `${meter}%` }} /></div>
                      <div className="risk-advice"><Lightbulb size={12} /> {item.advice}</div>
                    </article>
                  )
                })}
          </div>
        </section>

        <section className="report-section">
          <div className="rules-panel">
            <div className="rules-panel__intro">
              <p className="eyebrow">MY TRADING RULES</p>
              <h2>给 {result.profile.name} 的五条守则</h2>
              <p>勾选你最想带走的规则。好的守则不是“保持理性”，而是在关键时刻知道下一步具体做什么。</p>
            </div>
            <ol className="rules-list">
              {result.profile.rules.map((rule, index) => (
                <li key={rule}>
                  <span>{rule}</span>
                  <button className={`rule-check ${checkedRules.includes(index) ? 'is-checked' : ''}`} onClick={() => toggleRule(index)} aria-label={`${checkedRules.includes(index) ? '取消' : '勾选'}守则 ${index + 1}`}>
                    {checkedRules.includes(index) && <Check size={16} />}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="feedback-panel">
          <div><h3>{feedback ? '谢谢，你的反馈已记录' : '这份结果像你吗？'}</h3><p>你的反馈会帮助我们继续校准题目与人格文案。</p></div>
          <div className="feedback-options">
            {[['像我', 'like'], ['有一点', 'neutral'], ['不太像', 'unlike']].map(([label, value]) => (
              <button key={value} className={feedback === value ? 'is-selected' : ''} onClick={() => chooseFeedback(value as 'like' | 'neutral' | 'unlike')}>{value === 'like' && <ThumbsUp size={13} />} {label}</button>
            ))}
          </div>
        </section>

        <div className="result-disclaimer">
          <ShieldCheck size={13} /> TT16 结果仅供自我观察与娱乐，不构成证券投资建议、收益承诺、风险承受能力评估或任何金融产品推荐。市场有风险，投资决策应结合你的财务状况、投资目标和独立判断。
          <div className="result-bottom-actions">
            <button onClick={onAbout}><Info size={13} />模型与隐私说明</button>
            <button onClick={onRestart}><RefreshCcw size={13} />重新测试</button>
          </div>
        </div>
      </div>

      <ShareDialog
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        result={result}
        group={group}
        onCardGenerate={onCardGenerate}
        onShareClick={onShareClick}
      />
    </main>
  )
}
