import { useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  ArrowDown,
  Check,
  Copy,
  Download,
  GitBranch,
  Info,
  Lightbulb,
  LockKeyhole,
  RefreshCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react'
import type { AssessmentResult, DimensionScore } from '@tt16/core'
import { downloadShareCard, renderShareCard, type ShareCardInput, type ShareDimension } from '../lib/shareCard'
import { SOURCE_REPOSITORY_URL } from '../lib/project'
import { sitePath } from '../routes'
import { BrandMark, type IllustrationGroup } from './Illustrations'

type ResultPageProps = {
  result: AssessmentResult
  onRestart: () => void
  onHome: () => void
  onCardGenerate?: (format: 'square' | 'story') => void
  onShareOpen?: () => void
  onShareClick?: (target: 'native' | 'clipboard') => void
}

const groupCode: Record<AssessmentResult['profile']['group'], IllustrationGroup> = {
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

const stabilityLabels = {
  stable: '四维倾向稳定',
  one_boundary: '一项接近边界',
  multiple_boundaries: '多项接近边界',
} as const

const personalityImage = (typeCode: string) => `${import.meta.env.BASE_URL}images/personalities-v2/${typeCode}.webp`

function chosenPercent(dimension: DimensionScore) {
  return dimension.chosenLetter === dimension.leftLetter ? dimension.leftPercent : dimension.rightPercent
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
  result: AssessmentResult
  group: IllustrationGroup
  onCardGenerate?: (format: 'square' | 'story') => void
  onShareClick?: (target: 'native' | 'clipboard') => void
}) {
  const [format, setFormat] = useState<'square' | 'story'>('square')
  const [copied, setCopied] = useState(false)
  const [previewUrl, setPreviewUrl] = useState('')
  const dimensions: ShareDimension[] = useMemo(() => result.dimensions.map((dimension) => ({
    letter: dimension.chosenLetter,
    label: dimensionMeta[dimension.key][dimension.chosenLetter === dimension.leftLetter ? 'left' : 'right'],
    percent: chosenPercent(dimension),
  })), [result.dimensions])
  const cardInput = useMemo<ShareCardInput>(() => ({
    code: result.typeCode,
    name: result.profile.name,
    tagline: result.profile.tagline,
    group,
    dimensions,
    format,
    imageUrl: personalityImage(result.typeCode),
  }), [dimensions, format, group, result.profile.name, result.profile.tagline, result.typeCode])

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', closeOnEscape)
    document.body.classList.add('modal-open')
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      document.body.classList.remove('modal-open')
    }
  }, [onClose, open])

  useEffect(() => {
    if (!open) return
    let active = true
    setPreviewUrl('')
    void renderShareCard(cardInput).then((canvas) => {
      if (active && canvas) setPreviewUrl(canvas.toDataURL('image/png', 1))
    })
    return () => { active = false }
  }, [cardInput, open])

  if (!open) return null

  const saveCard = async () => {
    await downloadShareCard(cardInput)
    onCardGenerate?.(format)
  }

  const shareProfile = async () => {
    const relativeUrl = sitePath(`/types/${result.typeCode}/`)
    const url = new URL(relativeUrl, window.location.origin).toString()
    const text = `我的 TT16 是 ${result.typeCode} · ${result.profile.name}：${result.profile.tagline}。你是哪一种交易人格？`
    if (navigator.share) {
      try {
        await navigator.share({ title: `TT16 · ${result.profile.name}`, text, url })
        onShareClick?.('native')
        return
      } catch {
        // Cancellation keeps the copy action available.
      }
    }
    await navigator.clipboard?.writeText(`${text} ${url}`)
    onShareClick?.('clipboard')
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="share-dialog" role="dialog" aria-modal="true" aria-labelledby="share-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="dialog-header"><div className="dialog-brand"><BrandMark size={35} /><span>TT16 分享卡</span></div><button className="icon-button" onClick={onClose} aria-label="关闭"><X /></button></header>
        <div className="share-dialog__body">
          <div className="share-preview-wrap">{previewUrl ? <img className={`share-preview-image share-preview-image--${format}`} src={previewUrl} alt={`${result.profile.name} ${format === 'square' ? '方形' : '故事'}人格卡高清预览`} /> : <div className="share-preview-loading" role="status">正在本地绘制高清人格卡…</div>}</div>
          <div className="share-controls">
            <p className="eyebrow">SHARE YOUR TYPE</p><h2 id="share-title">把人格说明分享给同路人</h2><p>图片只包含公开人格身份和四维倾向，不展示逐题答案或用户标识。</p>
            <div className="format-switch" role="radiogroup" aria-label="分享卡尺寸"><button className={format === 'square' ? 'is-selected' : ''} onClick={() => setFormat('square')} role="radio" aria-checked={format === 'square'}><strong>方形卡片 1:1</strong><span>适合群聊、动态与社区</span></button><button className={format === 'story' ? 'is-selected' : ''} onClick={() => setFormat('story')} role="radio" aria-checked={format === 'story'}><strong>故事卡片 9:16</strong><span>适合朋友圈与手机长图</span></button></div>
            <div className="share-controls__actions"><button className="button button--primary" onClick={saveCard}><Download size={17} />保存高清图片</button><button className="button button--ghost" onClick={shareProfile}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? '公开链接已复制' : '分享公开类型页'}</button></div>
            <div className="share-privacy"><LockKeyhole size={14} />本地生成，不上传答案；分享链接不含答案、维度百分比或用户标识。</div>
          </div>
        </div>
      </section>
    </div>
  )
}

export function ResultPage({ result, onRestart, onHome, onCardGenerate, onShareOpen, onShareClick }: ResultPageProps) {
  const [shareOpen, setShareOpen] = useState(false)
  const [checkedRules, setCheckedRules] = useState<number[]>([])
  const [feedback, setFeedback] = useState<'like' | 'neutral' | 'unlike' | null>(null)
  const group = groupCode[result.profile.group]
  const qualityLabel = result.quality.level === 'complete' ? '回答已完成' : '建议复核答案'
  const openShare = () => { setShareOpen(true); onShareOpen?.() }
  const toggleRule = (index: number) => setCheckedRules((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])

  return (
    <main className="result-page" data-group={group}>
      <header className="result-header shell">
        <button className="brand" onClick={onHome} aria-label="返回首页"><BrandMark size={36} /><span className="brand-word">TT16</span><span className="brand-divider" /><span className="brand-subtitle">我的本地人格报告</span></button>
        <div className="result-header__actions"><a href={sitePath('/methodology/')}>模型说明</a><a className="source-link" href={SOURCE_REPOSITORY_URL} target="_blank" rel="noreferrer"><GitBranch size={15} /><span>源代码</span></a><button className="button button--dark button--compact" onClick={openShare}><Share2 size={16} />分享结果</button></div>
      </header>

      <section className="result-hero-wrap shell">
        <div className="result-hero"><div className="result-hero__copy"><div className="result-kicker">你的 TT16 交易人格</div><div className="result-code">{result.typeCode}</div><h1 className="result-name">{result.profile.name}</h1><p className="result-tagline">{result.profile.tagline}</p><div className="keyword-row">{result.profile.keywords.map((item) => <span key={item}>{item}</span>)}</div><div className="result-chips"><span>{result.profile.group}</span><span>{qualityLabel}</span><span>{stabilityLabels[result.stability]}</span></div><div className="result-actions"><button className="button button--primary button--large" onClick={openShare}><Share2 size={18} />生成我的人格卡</button><button className="button button--ghost button--large" onClick={() => document.querySelector('#report')?.scrollIntoView({ behavior: 'smooth' })}>阅读完整报告<ArrowDown size={18} /></button></div></div><div className="result-hero__visual"><img className="personality-portrait" src={personalityImage(result.typeCode)} alt={`${result.profile.name}人格插画`} /><div className="result-seal">TRADETYPE<br />16 · REPORT</div></div></div>
        <div className="result-dimensions" aria-label="四维人格倾向">{result.dimensions.map((dimension) => { const meta = dimensionMeta[dimension.key]; const percent = chosenPercent(dimension); return <article className="result-dimension" key={dimension.key}><div className="result-dimension__top"><strong>{dimension.chosenLetter}</strong><span>{meta.question}</span>{dimension.isBoundary && <small>接近边界</small>}</div><div className="result-dimension__bar"><span style={{ width: `${percent}%` }} /></div><div className="result-dimension__labels"><span>{dimension.leftLetter} {dimension.leftPercent}%</span><span>{dimension.rightPercent}% {dimension.rightLetter}</span></div></article> })}</div>
      </section>

      <div className="result-content shell" id="report">
        <section className="result-intro"><p className="eyebrow">YOUR DECISION PATTERN</p><h2>类型是阅读入口，<br />连续维度保留你的细节。</h2><p>{result.profile.description}</p></section>

        <section className="report-section"><div className="report-section__heading"><div><p className="eyebrow">DECISION LOOP</p><h2>观察、判断、行动、复盘</h2></div><p>这四步描述你更自然的处理顺序，不代表唯一正确的流程。</p></div><ol className="decision-loop"><li><span>01</span><strong>观察</strong><p>{result.profile.decisionLoop.observe}</p></li><li><span>02</span><strong>判断</strong><p>{result.profile.decisionLoop.decide}</p></li><li><span>03</span><strong>行动</strong><p>{result.profile.decisionLoop.act}</p></li><li><span>04</span><strong>复盘</strong><p>{result.profile.decisionLoop.review}</p></li></ol></section>

        <section className="report-section"><div className="report-section__heading"><div><p className="eyebrow">STRENGTHS &amp; SHADOWS</p><h2>优势，以及它的另一面</h2></div><p>每项优势在过度使用时都可能变成盲点。把两面放在一起看，才是一张完整画像。</p></div><div className="trait-pairs">{result.profile.traitPairs.map((pair, index) => <article className="trait-pair" key={pair.strength}><div className="trait-side"><div className="trait-side__label"><Sparkles size={13} />优势 {String(index + 1).padStart(2, '0')}</div><h3>你的自然力量</h3><p>{pair.strength}</p></div><div className="trait-side trait-side--watch"><div className="trait-side__label"><AlertTriangle size={13} />过度使用时</div><h3>需要留心的盲点</h3><p>{pair.overuse}</p></div></article>)}</div></section>

        <section className="report-section"><div className="report-section__heading"><div><p className="eyebrow">MARKET WEATHER</p><h2>什么环境更容易发挥？</h2></div><p>这里描述的是你更容易保持清晰或失去边界的环境结构，不是策略推荐。</p></div><div className="environment-grid"><article className="environment-card"><div className="environment-card__title"><TrendingUp size={21} /><h3>较容易保持清晰</h3></div><ul>{result.profile.environments.supportive.map((item) => <li key={item}>{item}</li>)}</ul></article><article className="environment-card"><div className="environment-card__title"><TrendingDown size={21} /><h3>更需要降低确信</h3></div><ul>{result.profile.environments.challenging.map((item) => <li key={item}>{item}</li>)}</ul></article></div></section>

        <section className="report-section"><div className="pressure-card"><div className="pressure-card__icon"><AlertTriangle /></div><div><p className="eyebrow">UNDER PRESSURE</p><h3>压力下，你可能偏离原有方法</h3><p>{result.profile.pressurePattern.pattern}</p><div className="pressure-reset-list">{result.profile.pressurePattern.resetSteps.map((item, index) => <span key={item}><strong>{index + 1}</strong>{item}</span>)}</div></div></div></section>

        <section className="report-section"><div className="report-section__heading"><div><p className="eyebrow">PRESSURE RESPONSES</p><h2>两项压力反应</h2></div><p>它们不参与四字母代码，也不是心理诊断；选择“未经历”时只显示通用提醒。</p></div><div className="badge-grid">{result.pressure.map((item) => <article className="risk-badge" key={item.key}><div className="risk-badge__top"><span className="risk-badge__icon"><AlertTriangle size={21} /></span><span className={`risk-level risk-level--${item.level}`}>{item.label}</span></div><h3>{item.name}</h3><p>{item.score === null ? '本题选择了未经历，不据此推断你的反应。' : '回想过去一年，这项提醒可能在高压或高波动情境中更明显。'}</p>{item.score !== null && <div className="risk-meter"><span style={{ width: `${item.score}%` }} /></div>}<div className="risk-advice"><Lightbulb size={12} /> {item.advice}</div></article>)}</div></section>

        <section className="report-section"><div className="rules-panel"><div className="rules-panel__intro"><p className="eyebrow">MY FIVE RULES</p><h2>给 {result.profile.name} 的五条守则</h2><p>勾选最想带走的一条。勾选状态只存在当前页面，不会被记录或发送。</p></div><ol className="rules-list">{result.profile.rules.map((rule, index) => <li key={rule}><span>{rule}</span><button className={`rule-check ${checkedRules.includes(index) ? 'is-checked' : ''}`} onClick={() => toggleRule(index)} aria-label={`${checkedRules.includes(index) ? '取消' : '勾选'}守则 ${index + 1}`}>{checkedRules.includes(index) && <Check size={16} />}</button></li>)}</ol></div></section>

        <section className="report-section"><div className="report-section__heading"><div><p className="eyebrow">COLLABORATION</p><h2>协作中的贡献、需要与摩擦</h2></div></div><div className="three-column-cards"><article><h3>常带来的贡献</h3><ul>{result.profile.collaboration.offers.map((item) => <li key={item}>{item}</li>)}</ul></article><article><h3>通常需要</h3><ul>{result.profile.collaboration.needs.map((item) => <li key={item}>{item}</li>)}</ul></article><article><h3>可能的摩擦</h3><ul>{result.profile.collaboration.friction.map((item) => <li key={item}>{item}</li>)}</ul></article></div></section>

        <section className="feedback-panel"><div><h3>{feedback ? '选择已保存在本页' : '这份结果像你吗？'}</h3><p>这里只帮助你自我校对，不会上传；刷新或离开后即清空。</p></div><div className="feedback-options">{([['像我', 'like'], ['有一点', 'neutral'], ['不太像', 'unlike']] as const).map(([label, value]) => <button key={value} className={feedback === value ? 'is-selected' : ''} onClick={() => setFeedback(value)}>{label}</button>)}</div></section>

        <div className="result-disclaimer"><ShieldCheck size={13} /> TT16 结果仅供自我观察与娱乐，不构成证券投资建议、收益承诺、风险承受能力评估、投资适当性评价或心理诊断。<div className="result-bottom-actions"><a href={sitePath(`/types/${result.typeCode}/`)}><Info size={13} />查看公开类型页</a><button onClick={onRestart}><RefreshCcw size={13} />重新测试</button></div></div>
      </div>
      <ShareDialog open={shareOpen} onClose={() => setShareOpen(false)} result={result} group={group} onCardGenerate={onCardGenerate} onShareClick={onShareClick} />
    </main>
  )
}
