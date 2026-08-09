import { useEffect, useMemo, useRef, useState } from 'react'
import {
  ArrowLeft,
  BrainCircuit,
  Check,
  ChevronLeft,
  Download,
  Eye,
  HardDrive,
  Lightbulb,
  LockKeyhole,
  RefreshCcw,
  Share2,
  Sparkles,
  Undo2,
  X,
} from 'lucide-react'
import { PROFILES, type TypeCode } from '@tt16/core'
import {
  applyGuessEvent,
  buildGuessCardModel,
  getNextGuessAction,
  undoGuessEvent,
  type GuessAnswer,
  type GuessSessionV1,
} from '@tt16/core/guess'
import { downloadGuessCard } from '../lib/guessCard'
import {
  clearStoredGuessSession,
  newLocalGuessSession,
  persistGuessSession,
  readStoredGuessSession,
} from '../lib/guessStorage'
import { sitePath } from '../routes'
import { BrandMark } from './Illustrations'

const ANSWER_OPTIONS: readonly { value: GuessAnswer; label: string; detail: string }[] = [
  { value: 2, label: '是', detail: '很符合我的常见做法' },
  { value: 1, label: '可能是', detail: '多数时候比较接近' },
  { value: 'unknown', label: '不知道或不适用', detail: '没有经历，或现在说不清' },
  { value: -1, label: '可能不是', detail: '多数时候不太接近' },
  { value: -2, label: '不是', detail: '明显不符合我的常见做法' },
]

const CONTEXT_LABELS = {
  research: '研究与信息',
  signal: '市场反馈',
  horizon: '时间周期',
  volatility: '波动情境',
  risk: '风险表达',
  execution: '计划执行',
  collaboration: '协作讨论',
  review: '事后复盘',
} as const

function portrait(code: TypeCode): string {
  return `${import.meta.env.BASE_URL}images/personalities-v2/${code}.webp`
}

function GuessHeader({ session, onBack }: { session: GuessSessionV1; onBack: () => void }) {
  const answered = session.events.filter((event) => event.kind === 'answer').length
  const excluded = session.events.filter((event) => event.kind === 'reject').length
  return (
    <header className="guess-header">
      <a className="quiz-brand" href={sitePath('/')} aria-label="返回 TT16 首页"><BrandMark size={34} /><span>TT16</span></a>
      <div className="guess-local-state"><HardDrive size={15} /><span>纯本地 · {answered} 已回答 · {excluded} 已排除</span></div>
      <div className="guess-header__actions">
        <button className="guess-undo" onClick={onBack} disabled={session.events.length === 0}><Undo2 size={16} />撤销</button>
        <a className="icon-button" href={sitePath('/')} aria-label="保存并返回首页"><X size={20} /></a>
      </div>
    </header>
  )
}

function ProfileIdentity({ code, compact = false }: { code: TypeCode; compact?: boolean }) {
  const profile = PROFILES[code]
  return (
    <div className={`guess-identity ${compact ? 'guess-identity--compact' : ''}`}>
      <img src={portrait(code)} alt={`${profile.name}人格插画`} />
      <div><span>{code}</span><strong>{profile.name}</strong><small>{profile.group}</small></div>
    </div>
  )
}

export function GuessFlow() {
  const [session, setSession] = useState<GuessSessionV1 | null>(null)
  const [pendingAnswer, setPendingAnswer] = useState<GuessAnswer | null>(null)
  const [thinking, setThinking] = useState(false)
  const [copied, setCopied] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    setSession(readStoredGuessSession() ?? newLocalGuessSession())
    return () => {
      if (timeoutRef.current !== null) window.clearTimeout(timeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (session) persistGuessSession(session)
  }, [session])

  const action = useMemo(() => session ? getNextGuessAction(session) : null, [session])

  const goBack = () => {
    if (!session || thinking) return
    if (session.events.length === 0) {
      window.location.assign(sitePath('/'))
      return
    }
    setSession(undoGuessEvent(session))
    setCopied(false)
  }

  const answer = (value: GuessAnswer) => {
    if (!session || action?.kind !== 'question' || thinking) return
    setPendingAnswer(value)
    setThinking(true)
    timeoutRef.current = window.setTimeout(() => {
      try {
        setSession(applyGuessEvent(session, { kind: 'answer', questionId: action.question.id, answer: value }))
      } finally {
        setPendingAnswer(null)
        setThinking(false)
        timeoutRef.current = null
      }
    }, 400)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goBack()
        return
      }
      if (action?.kind !== 'question' || thinking) return
      const index = Number(event.key) - 1
      if (index >= 0 && index < ANSWER_OPTIONS.length) answer(ANSWER_OPTIONS[index].value)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const decide = (accepted: boolean) => {
    if (!session || action?.kind !== 'confirmation') return
    setSession(applyGuessEvent(session, {
      kind: accepted ? 'accept' : 'reject',
      typeCode: action.code,
    }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const continueGuessing = () => {
    if (!session || action?.kind !== 'insufficient' || !action.canContinue) return
    setSession(applyGuessEvent(session, { kind: 'continue' }))
  }

  const restart = () => {
    clearStoredGuessSession()
    setSession(newLocalGuessSession())
    setPendingAnswer(null)
    setThinking(false)
    setCopied(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!session || !action) return null

  if (action.kind === 'question') {
    return (
      <main className="guess-screen">
        <GuessHeader session={session} onBack={goBack} />
        <div className={`guess-thinking-line ${thinking ? 'is-thinking' : ''}`} aria-hidden="true"><span /></div>
        <section className="guess-stage">
          <div className="guess-stage__meta">
            <button onClick={goBack}><ChevronLeft size={17} />上一题</button>
            <span>{action.isRepeat ? '复核一个刚才不确定的线索' : CONTEXT_LABELS[action.question.context]}</span>
            <small>模型会在证据足够时主动猜</small>
          </div>
          <article className="guess-question-card" key={action.question.id}>
            <div className="guess-question-kicker"><BrainCircuit size={16} />第 {action.answeredCount + 1} 个观察{action.isRepeat && <em>受控复核</em>}</div>
            <h1>{action.question.prompt}</h1>
            <p>按过去 12 个月更常见的做法回答；这里没有标准答案。</p>
            <div className="guess-answer-list" role="radiogroup" aria-label="选择回答">
              {ANSWER_OPTIONS.map((option, index) => (
                <button
                  key={String(option.value)}
                  type="button"
                  role="radio"
                  aria-checked={pendingAnswer === option.value}
                  aria-label={`${option.label}，快捷键 ${index + 1}`}
                  className={pendingAnswer === option.value ? 'is-selected' : ''}
                  disabled={thinking}
                  onClick={() => answer(option.value)}
                >
                  <kbd>{index + 1}</kbd><strong>{option.label}</strong><span>{option.detail}</span>
                </button>
              ))}
            </div>
            <div className="guess-privacy-note"><LockKeyhole size={14} />答案和候选权重只保存在本机，不进入统计，也不会出现在链接中。</div>
          </article>
          <div className="guess-stage__footer">
            <span>{thinking ? <><Sparkles size={14} />正在更新候选…</> : <><Eye size={14} />题目会根据前面的回答变化</>}</span>
            <button onClick={goBack} disabled={thinking}><ArrowLeft size={16} />撤销上一步</button>
          </div>
        </section>
      </main>
    )
  }

  if (action.kind === 'confirmation') {
    const profile = PROFILES[action.code]
    return (
      <main className="guess-screen guess-screen--decision">
        <GuessHeader session={session} onBack={goBack} />
        <section className="guess-decision shell">
          <div className="guess-decision__copy">
            <span className={`guess-confidence guess-confidence--${action.confidence}`}><Sparkles size={14} />{action.confidence === 'high' ? '把握较高' : '我仍在犹豫'}</span>
            <p className="eyebrow">TT16 MAKES A GUESS</p>
            <h1>你更像<br /><strong>{action.code} · {profile.name}</strong><br />是吗？</h1>
            <p>{profile.tagline}</p>
            <div className="guess-reasons"><span>为什么这样猜</span>{action.reasons.map((reason) => <div key={reason}><Lightbulb size={16} />{reason}</div>)}</div>
            <div className="guess-decision__actions">
              <button className="button button--primary button--large" onClick={() => decide(true)}><Check size={19} />猜对了</button>
              <button className="button button--ghost button--large" onClick={() => decide(false)}><RefreshCcw size={18} />不准，继续猜</button>
            </div>
            <small>你的确认只影响当前本机会话，不会被上传或用来在线训练。</small>
          </div>
          <div className="guess-decision__visual">
            <ProfileIdentity code={action.code} />
            {action.alternativeCode && <aside><span>另一种可能</span><ProfileIdentity code={action.alternativeCode} compact /></aside>}
            <div className="guess-remaining">已经回答 {action.answeredCount} 题 · 还可排除 {16 - action.excludedCount} 种候选</div>
          </div>
        </section>
      </main>
    )
  }

  if (action.kind === 'complete') {
    const card = buildGuessCardModel(session)
    if (!card) return null
    const save = () => void downloadGuessCard(card, portrait(card.code))
    const share = async () => {
      const url = new URL(sitePath(`/types/${card.code}/`), window.location.origin).toString()
      const text = `TT16 快速猜我更像 ${card.code} · ${card.name}。这是一张纯本地娱乐猜测卡。`
      if (navigator.share) {
        try {
          await navigator.share({ title: `TT16 快速猜型 · ${card.name}`, text, url })
          return
        } catch {
          // Cancellation leaves the copy fallback available.
        }
      }
      await navigator.clipboard?.writeText(`${text} ${url}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    }
    return (
      <main className="guess-screen guess-screen--complete">
        <GuessHeader session={session} onBack={goBack} />
        <section className="guess-complete shell">
          <div className="guess-card-preview">
            <span>{card.label}</span>
            <img src={portrait(card.code)} alt={`${card.name}人格插画`} />
            <div><small>{card.code}</small><h1>{card.name}</h1><p>{card.tagline}</p></div>
            <ul>{card.reasons.map((reason) => <li key={reason}><Check size={15} />{reason}</li>)}</ul>
            <footer>纯本地娱乐猜测 · 正式报告请完成标准 20 题</footer>
          </div>
          <div className="guess-complete__copy">
            <p className="eyebrow">YOU CONFIRMED THE GUESS</p>
            <h2>这次猜中了。</h2>
            <p>{card.disclaimer}</p>
            <div className="keyword-row">{card.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
            <div className="guess-complete__actions">
              <button className="button button--primary" onClick={save}><Download size={17} />保存娱乐卡</button>
              <button className="button button--ghost" onClick={share}>{copied ? <Check size={17} /> : <Share2 size={17} />}{copied ? '公开链接已复制' : '分享公开类型页'}</button>
              <a className="button button--ghost" href={sitePath(`/types/${card.code}/`)}>查看 {card.name} 详情</a>
              <a className="button button--dark" href={sitePath('/test/')}>完成正式 20 题</a>
            </div>
            <button className="guess-reset" onClick={restart}><RefreshCcw size={15} />清除本机猜型记录，再玩一次</button>
          </div>
        </section>
      </main>
    )
  }

  const insufficient = action.kind === 'insufficient'
  return (
    <main className="guess-screen guess-screen--empty">
      <GuessHeader session={session} onBack={goBack} />
      <section className="guess-empty-state">
        <BrainCircuit size={46} />
        <p className="eyebrow">{insufficient ? 'NOT ENOUGH SIGNAL' : 'NO FORCED RESULT'}</p>
        <h1>{insufficient ? '这次信息还不够' : '这次我没有猜中'}</h1>
        <p>{insufficient ? '“不知道或不适用”不会被硬算成某种倾向。你可以再回答一组问题，也可以改做标准 20 题。' : '16 种候选都被你否认了。快速猜型到此结束，不强行给出一个标签。'}</p>
        <div>
          {insufficient && action.canContinue && <button className="button button--primary" onClick={continueGuessing}>继续给我一些线索</button>}
          <a className="button button--dark" href={sitePath('/test/')}>转到标准 20 题</a>
          <a className="button button--ghost" href={sitePath('/types/')}>浏览 16 型图鉴</a>
        </div>
        <button className="guess-reset" onClick={restart}><RefreshCcw size={15} />清除记录并重新开始</button>
      </section>
    </main>
  )
}
