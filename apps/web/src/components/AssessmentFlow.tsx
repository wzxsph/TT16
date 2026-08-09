import { useEffect, useState } from 'react'
import {
  QUESTIONS,
  migrateStoredAssessment,
  scoreAssessment,
  type Answers,
  type AssessmentResult,
  type StoredAssessmentV2,
} from '@tt16/core'
import { trackEvent } from '../lib/analytics'
import { sitePath } from '../routes'
import { QuizPage } from './QuizPage'
import { ResultPage } from './ResultPage'

const STORAGE_KEY = 'tt16:assessment:v2'
const LEGACY_STORAGE_KEY = 'tt16:free:v1'

export function clearStoredAssessment(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(LEGACY_STORAGE_KEY)
  } catch {
    // The assessment remains usable in memory when storage is unavailable.
  }
}

export function readStoredAssessment(): StoredAssessmentV2 | null {
  try {
    const currentRaw = localStorage.getItem(STORAGE_KEY)
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY)
    const raw = currentRaw ?? legacyRaw
    if (!raw) return null
    const migrated = migrateStoredAssessment(JSON.parse(raw))
    if (!migrated) {
      if (currentRaw) localStorage.removeItem(STORAGE_KEY)
      if (legacyRaw) localStorage.removeItem(LEGACY_STORAGE_KEY)
      return null
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
    if (legacyRaw) localStorage.removeItem(LEGACY_STORAGE_KEY)
    return migrated
  } catch {
    return null
  }
}

function persist(state: StoredAssessmentV2): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Private browsing and quota errors must not block local scoring.
  }
}

function LocalLoading({ label = '正在读取本机进度' }: { label?: string }) {
  return <main className="processing-screen" aria-live="polite"><div className="processing-orbit" aria-hidden="true"><span /><span /><span /><i>TT</i></div><p className="eyebrow">LOCAL FIRST</p><h1>{label}</h1><p>答案只在当前设备保存和评分，不上传、不连接券商账户。</p></main>
}

function MissingResult() {
  return <main className="missing-result"><div><span>本机暂无完整报告</span><h1>先完成 20 道情境题</h1><p>结果页不接收答案或人格参数，所以换设备或清除站点数据后无法从链接恢复个人报告。</p><a className="button button--dark" href={sitePath('/test/')}>开始测试</a><a href={sitePath('/types/')}>先浏览公开人格图鉴</a></div></main>
}

export function AssessmentFlow({ path }: { path: '/test/' | '/result/' }) {
  const [ready, setReady] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [answers, setAnswers] = useState<Answers>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [result, setResult] = useState<AssessmentResult | null>(null)

  useEffect(() => {
    const stored = readStoredAssessment()
    if (stored) {
      setAnswers(stored.answers)
      setCurrentIndex(stored.currentIndex)
      if (stored.completed) setResult(scoreAssessment(stored.answers))
    }
    setReady(true)
    if (path === '/test/') trackEvent('assessment_start')
  }, [path])

  useEffect(() => {
    if (!ready || result) return
    persist({ version: 'assessment-2', answers, currentIndex, completed: false })
  }, [answers, currentIndex, ready, result])

  if (!ready) return <LocalLoading />
  if (processing) return <LocalLoading label="正在组合四个维度" />
  if (path === '/result/' && !result) return <MissingResult />

  const finish = (nextAnswers: Answers) => {
    setProcessing(true)
    window.setTimeout(() => {
      const nextResult = scoreAssessment(nextAnswers)
      persist({ version: 'assessment-2', answers: nextAnswers, currentIndex: QUESTIONS.length - 1, completed: true })
      setResult(nextResult)
      setProcessing(false)
      window.history.replaceState(null, '', sitePath('/result/'))
      trackEvent('assessment_complete')
      window.scrollTo({ top: 0, behavior: 'instant' })
    }, 500)
  }

  const selectAnswer = (value: number | null) => {
    const question = QUESTIONS[currentIndex]
    if (!question) return
    const nextAnswers = { ...answers, [question.id]: value }
    setAnswers(nextAnswers)
    if (currentIndex === QUESTIONS.length - 1) finish(nextAnswers)
    else setCurrentIndex((index) => index + 1)
  }

  const restart = () => {
    clearStoredAssessment()
    setAnswers({})
    setCurrentIndex(0)
    setResult(null)
    setProcessing(false)
    window.history.replaceState(null, '', sitePath('/test/'))
    window.scrollTo({ top: 0, behavior: 'instant' })
    trackEvent('assessment_start')
  }

  if (result) {
    return <ResultPage result={result} onRestart={restart} onHome={() => window.location.assign(sitePath('/'))} onShareOpen={() => trackEvent('share_open')} onCardGenerate={() => trackEvent('share_save')} />
  }

  const question = QUESTIONS[currentIndex]
  return <QuizPage question={question} index={currentIndex} total={QUESTIONS.length} selected={answers[question.id]} isAnswered={question.id in answers} answeredCount={Object.keys(answers).length} onSelect={selectAnswer} onBack={() => currentIndex === 0 ? window.location.assign(sitePath('/')) : setCurrentIndex((index) => index - 1)} onNext={() => setCurrentIndex((index) => Math.min(index + 1, QUESTIONS.length - 1))} onExit={() => window.location.assign(sitePath('/'))} />
}
