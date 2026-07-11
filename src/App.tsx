import { useEffect, useMemo, useRef, useState } from 'react'
import { QUESTIONS } from './data/questions'
import { scoreAssessment } from './lib/scoring'
import { LandingPage } from './components/LandingPage'
import { QuizPage } from './components/QuizPage'
import { ResultPage } from './components/ResultPage'
import { AboutDialog } from './components/AboutDialog'

export type Answers = Record<string, number | null>
export type AppView = 'landing' | 'quiz' | 'processing' | 'result'

type SavedSession = {
  version: string
  sessionId: string
  answers: Answers
  currentIndex: number
  updatedAt: number
}

const STORAGE_KEY = 'tt16:assessment:v1'
const ASSESSMENT_VERSION = 'tt16-1.0.0-demo'

function readSession(): SavedSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SavedSession
    if (parsed.version !== ASSESSMENT_VERSION || !parsed.answers) return null
    return parsed
  } catch {
    return null
  }
}

function createSession(): SavedSession {
  return {
    version: ASSESSMENT_VERSION,
    sessionId: crypto.randomUUID?.() ?? `tt16-${Date.now()}`,
    answers: {},
    currentIndex: 0,
    updatedAt: Date.now(),
  }
}

function createSampleAnswers(): Answers {
  return Object.fromEntries(
    QUESTIONS.map((question, index) => {
      if (question.kind === 'dimension' && question.dimension === 'RS') return [question.id, index % 3 === 0 ? -2 : -1]
      if (question.kind === 'dimension' && question.dimension === 'HT') return [question.id, index % 2 === 0 ? -2 : -1]
      if (question.kind === 'dimension' && question.dimension === 'DA') return [question.id, index % 2 === 0 ? 1 : 2]
      if (question.kind === 'dimension' && question.dimension === 'PF') return [question.id, index % 3 === 0 ? -2 : -1]
      if (question.kind === 'risk') return [question.id, (index % 3) - 1]
      return [question.id, -1]
    }),
  )
}

export default function App() {
  const savedAtLoad = useMemo(readSession, [])
  const [view, setView] = useState<AppView>('landing')
  const [session, setSession] = useState<SavedSession>(savedAtLoad ?? createSession)
  const [aboutOpen, setAboutOpen] = useState(false)
  const transitionTimer = useRef<number | null>(null)

  const answerCount = Object.keys(session.answers).length
  const hasProgress = answerCount > 0 && answerCount < QUESTIONS.length
  const result = useMemo(() => scoreAssessment(session.answers), [session.answers])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  }, [session])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [view])

  useEffect(
    () => () => {
      if (transitionTimer.current) window.clearTimeout(transitionTimer.current)
    },
    [],
  )

  const startFresh = () => {
    const fresh = createSession()
    setSession(fresh)
    setView('quiz')
  }

  const resume = () => setView('quiz')

  const previewResult = () => {
    setSession({
      ...createSession(),
      answers: createSampleAnswers(),
      currentIndex: QUESTIONS.length - 1,
    })
    setView('result')
  }

  const selectAnswer = (value: number | null) => {
    const question = QUESTIONS[session.currentIndex]
    const nextAnswers = { ...session.answers, [question.id]: value }
    setSession((current) => ({
      ...current,
      answers: nextAnswers,
      updatedAt: Date.now(),
    }))

    if (transitionTimer.current) window.clearTimeout(transitionTimer.current)
    transitionTimer.current = window.setTimeout(() => {
      if (session.currentIndex >= QUESTIONS.length - 1) {
        setView('processing')
        transitionTimer.current = window.setTimeout(() => setView('result'), 1150)
        return
      }
      setSession((current) => ({
        ...current,
        currentIndex: Math.min(current.currentIndex + 1, QUESTIONS.length - 1),
        updatedAt: Date.now(),
      }))
    }, 330)
  }

  const goBack = () => {
    if (session.currentIndex === 0) {
      setView('landing')
      return
    }
    setSession((current) => ({ ...current, currentIndex: current.currentIndex - 1 }))
  }

  const goNext = () => {
    if (session.currentIndex < QUESTIONS.length - 1) {
      setSession((current) => ({ ...current, currentIndex: current.currentIndex + 1 }))
    }
  }

  const restart = () => {
    localStorage.removeItem(STORAGE_KEY)
    startFresh()
  }

  return (
    <div className={`app app--${view}`}>
      {view === 'landing' && (
        <LandingPage
          hasProgress={hasProgress}
          answeredCount={answerCount}
          onStart={startFresh}
          onResume={resume}
          onPreview={previewResult}
          onAbout={() => setAboutOpen(true)}
        />
      )}

      {view === 'quiz' && (
        <QuizPage
          question={QUESTIONS[session.currentIndex]}
          index={session.currentIndex}
          total={QUESTIONS.length}
          selected={session.answers[QUESTIONS[session.currentIndex].id]}
          isAnswered={QUESTIONS[session.currentIndex].id in session.answers}
          answeredCount={answerCount}
          onSelect={selectAnswer}
          onBack={goBack}
          onNext={goNext}
          onExit={() => setView('landing')}
        />
      )}

      {view === 'processing' && (
        <main className="processing-screen" aria-live="polite">
          <div className="processing-orbit" aria-hidden="true">
            <span />
            <span />
            <span />
            <i>TT</i>
          </div>
          <p className="eyebrow">正在组合四个维度</p>
          <h1>生成你的交易人格</h1>
          <p>我们只在这台设备上计算，不上传你的逐题答案。</p>
        </main>
      )}

      {view === 'result' && (
        <ResultPage
          result={result}
          onRestart={restart}
          onHome={() => setView('landing')}
          onAbout={() => setAboutOpen(true)}
        />
      )}

      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
    </div>
  )
}
