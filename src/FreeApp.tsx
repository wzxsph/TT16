import { useEffect, useMemo, useState } from 'react'
import { AboutDialog } from './components/AboutDialog'
import { LandingPage } from './components/LandingPage'
import { QuizPage } from './components/QuizPage'
import { ResultPage } from './components/ResultPage'
import {
  COMMERCIAL_QUESTIONS,
  COMMERCIAL_QUESTIONNAIRE_VERSION,
} from './data/commercialQuestions'
import {
  scoreCommercialAssessment,
  type CommercialAnswers,
  type CommercialAssessmentScore,
} from './lib/commercialScoring'
import type { CommercialQuestionView } from './lib/api'

type FreeView = 'landing' | 'quiz' | 'processing' | 'result'

type StoredFreeState = {
  version: 'free-1'
  answers: CommercialAnswers
  currentIndex: number
  completed: boolean
}

const FREE_STORAGE_KEY = 'tt16:free:v1'

const freeQuestions: CommercialQuestionView[] = COMMERCIAL_QUESTIONS.map((question) => ({
  id: question.id,
  kind: question.kind,
  prompt: question.prompt,
  leftText: question.leftText,
  rightText: question.rightText,
  tag: question.tag,
  allowNA: question.allowNA,
}))

function readFreeState(): StoredFreeState | null {
  try {
    const raw = localStorage.getItem(FREE_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredFreeState
    if (parsed.version !== 'free-1' || typeof parsed.answers !== 'object') return null
    return parsed
  } catch {
    return null
  }
}

function sampleAnswers(): CommercialAnswers {
  return Object.fromEntries(
    COMMERCIAL_QUESTIONS.map((question) => [question.id, question.kind === 'pressure' ? 0 : -2]),
  )
}

export default function FreeApp() {
  const storedAtLoad = useMemo(readFreeState, [])
  const restoredResult = storedAtLoad?.completed
    ? scoreCommercialAssessment(storedAtLoad.answers)
    : null
  const [view, setView] = useState<FreeView>(restoredResult ? 'result' : 'landing')
  const [answers, setAnswers] = useState<CommercialAnswers>(storedAtLoad?.answers ?? {})
  const [currentIndex, setCurrentIndex] = useState(storedAtLoad?.currentIndex ?? 0)
  const [result, setResult] = useState<CommercialAssessmentScore | null>(restoredResult)
  const [isSample, setIsSample] = useState(false)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [busy, setBusy] = useState(false)
  const answerCount = Object.keys(answers).length
  const hasProgress = answerCount > 0 && answerCount < freeQuestions.length

  useEffect(() => {
    const state: StoredFreeState = {
      version: 'free-1',
      answers,
      currentIndex,
      completed: Boolean(result && !isSample),
    }
    localStorage.setItem(FREE_STORAGE_KEY, JSON.stringify(state))
  }, [answers, currentIndex, isSample, result])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [view])

  const reset = () => {
    localStorage.removeItem(FREE_STORAGE_KEY)
    setAnswers({})
    setCurrentIndex(0)
    setResult(null)
    setIsSample(false)
    setBusy(false)
  }

  const startFresh = () => {
    reset()
    setView('quiz')
  }

  const resume = () => {
    const firstUnanswered = freeQuestions.findIndex((question) => !(question.id in answers))
    setCurrentIndex(firstUnanswered >= 0 ? firstUnanswered : 0)
    setView('quiz')
  }

  const previewResult = () => {
    setResult(scoreCommercialAssessment(sampleAnswers()))
    setIsSample(true)
    setView('result')
  }

  const finish = (nextAnswers: CommercialAnswers) => {
    setBusy(true)
    setView('processing')
    window.setTimeout(() => {
      setResult(scoreCommercialAssessment(nextAnswers))
      setIsSample(false)
      setBusy(false)
      setView('result')
    }, 850)
  }

  const selectAnswer = (value: number | null) => {
    if (busy) return
    const question = freeQuestions[currentIndex]
    if (!question) return
    const nextAnswers = { ...answers, [question.id]: value }
    setAnswers(nextAnswers)
    if (currentIndex >= freeQuestions.length - 1) {
      finish(nextAnswers)
      return
    }
    setCurrentIndex((index) => index + 1)
  }

  const restart = () => {
    reset()
    setView('landing')
  }

  return (
    <div className={`app app--${view}`} data-runtime="free-pages">
      {view === 'landing' && (
        <LandingPage
          freeMode
          hasProgress={hasProgress}
          answeredCount={answerCount}
          busy={busy}
          onStart={startFresh}
          onResume={resume}
          onPreview={previewResult}
          onAbout={() => setAboutOpen(true)}
          onRecover={() => undefined}
          onSupport={() => undefined}
        />
      )}

      {view === 'quiz' && freeQuestions[currentIndex] && (
        <QuizPage
          question={freeQuestions[currentIndex]}
          index={currentIndex}
          total={freeQuestions.length}
          selected={answers[freeQuestions[currentIndex].id]}
          isAnswered={freeQuestions[currentIndex].id in answers}
          answeredCount={answerCount}
          saveStateLabel="进度已保存到本机"
          onSelect={selectAnswer}
          onBack={() => currentIndex === 0 ? setView('landing') : setCurrentIndex((index) => index - 1)}
          onNext={() => setCurrentIndex((index) => Math.min(index + 1, freeQuestions.length - 1))}
          onExit={() => setView('landing')}
        />
      )}

      {view === 'processing' && (
        <main className="processing-screen" aria-live="polite">
          <div className="processing-orbit" aria-hidden="true"><span /><span /><span /><i>TT</i></div>
          <p className="eyebrow">正在组合四个维度</p>
          <h1>生成你的交易人格</h1>
          <p>答案仅在当前浏览器中评分，不上传、不连接券商账户。</p>
        </main>
      )}

      {view === 'result' && result && (
        <ResultPage
          result={result}
          isSample={isSample}
          reportLabel={isSample ? '公开示例报告' : '免费完整报告'}
          onRestart={restart}
          onHome={() => setView('landing')}
          onAbout={() => setAboutOpen(true)}
        />
      )}

      <AboutDialog freeMode open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <span className="runtime-version" aria-hidden="true">{COMMERCIAL_QUESTIONNAIRE_VERSION}</span>
    </div>
  )
}
