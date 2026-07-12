import { useEffect, useMemo, useRef, useState } from 'react'
import { AboutDialog } from './components/AboutDialog'
import { LandingPage } from './components/LandingPage'
import { PaywallPage } from './components/PaywallPage'
import { QuizPage } from './components/QuizPage'
import { RecoveryDialog } from './components/RecoveryDialog'
import { ResultPage } from './components/ResultPage'
import { SupportDialog } from './components/SupportDialog'
import {
  ApiError,
  completeCommercialSession,
  confirmSandboxOrder,
  createCommercialSupportCase,
  createCommercialOrder,
  createCommercialSession,
  getCommercialOrder,
  getCommercialReport,
  getSampleReport,
  recoverCommercialReport,
  requestCommercialRefund,
  restoreCommercialSession,
  saveCommercialAnswer,
  sendCommercialFeedback,
  type CommercialQuestionView,
  type OrderPayload,
  type PaywallPayload,
  type SupportCaseKind,
} from './lib/api'
import { acquisitionChannel, trackCommercialEvent } from './lib/analytics'
import type { CommercialAssessmentScore } from './lib/commercialScoring'
import { downloadInviteCard } from './lib/inviteCard'

export type Answers = Record<string, number | null>
export type AppView = 'landing' | 'quiz' | 'processing' | 'paywall' | 'result'

type StoredCommercialState = {
  version: 'commercial-1'
  sessionId: string
  recoveryToken: string
  questionnaireVersion: string
  questions: CommercialQuestionView[]
  answers: Answers
  currentIndex: number
  orderId?: string
  reportToken?: string
  updatedAt: number
}

const STORAGE_KEY = 'tt16:commercial:v1'

function readStoredState(): StoredCommercialState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredCommercialState
    if (
      parsed.version !== 'commercial-1' ||
      !parsed.sessionId ||
      !parsed.recoveryToken ||
      !Array.isArray(parsed.questions)
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds))
}

export default function App() {
  const storedAtLoad = useMemo(readStoredState, [])
  const [view, setView] = useState<AppView>('landing')
  const [sessionId, setSessionId] = useState(storedAtLoad?.sessionId ?? '')
  const [recoveryToken, setRecoveryToken] = useState(storedAtLoad?.recoveryToken ?? '')
  const [questionnaireVersion, setQuestionnaireVersion] = useState(storedAtLoad?.questionnaireVersion ?? '')
  const [questions, setQuestions] = useState<CommercialQuestionView[]>(storedAtLoad?.questions ?? [])
  const [answers, setAnswers] = useState<Answers>(storedAtLoad?.answers ?? {})
  const [currentIndex, setCurrentIndex] = useState(storedAtLoad?.currentIndex ?? 0)
  const [paywall, setPaywall] = useState<PaywallPayload | null>(null)
  const [order, setOrder] = useState<OrderPayload | null>(null)
  const [orderId, setOrderId] = useState(storedAtLoad?.orderId)
  const [reportToken, setReportToken] = useState(storedAtLoad?.reportToken)
  const [result, setResult] = useState<CommercialAssessmentScore | null>(null)
  const [isSample, setIsSample] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [aboutOpen, setAboutOpen] = useState(false)
  const [recoveryOpen, setRecoveryOpen] = useState(false)
  const [supportOpen, setSupportOpen] = useState(false)
  const restoring = useRef(false)
  const landingTracked = useRef(false)

  const answerCount = Object.keys(answers).length
  const hasProgress = Boolean(sessionId) && answerCount > 0 && answerCount < questions.length

  useEffect(() => {
    if (landingTracked.current) return
    landingTracked.current = true
    trackCommercialEvent('landing_view', {
      properties: {
        device: window.matchMedia('(max-width: 700px)').matches ? 'mobile' : 'desktop',
        referrer: document.referrer ? 'external' : 'direct',
      },
    })
  }, [])

  useEffect(() => {
    if (!sessionId || !recoveryToken) return
    const state: StoredCommercialState = {
      version: 'commercial-1',
      sessionId,
      recoveryToken,
      questionnaireVersion,
      questions,
      answers,
      currentIndex,
      orderId,
      reportToken,
      updatedAt: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [answers, currentIndex, orderId, questionnaireVersion, questions, recoveryToken, reportToken, sessionId])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [view])

  useEffect(() => {
    if (!storedAtLoad || restoring.current) return
    restoring.current = true

    const restore = async () => {
      try {
        if (storedAtLoad.reportToken) {
          const response = await getCommercialReport(storedAtLoad.reportToken)
          setResult(response.report)
          setView('result')
          trackCommercialEvent('report_view', {
            sessionId: storedAtLoad.sessionId,
            reportVersion: response.report.versions.content,
            properties: { loadStatus: 'restored_local_token' },
          })
          return
        }

        const restored = await restoreCommercialSession(
          storedAtLoad.sessionId,
          storedAtLoad.recoveryToken,
        )
        setQuestions(restored.questions)
        setQuestionnaireVersion(restored.questionnaireVersion)
        setAnswers(Object.fromEntries(restored.answers.map((item) => [item.questionId, item.value])))

        let restoredPaywall: PaywallPayload | null = null
        if (['paywalled', 'purchased'].includes(restored.status)) {
          const completed = await completeCommercialSession(
            storedAtLoad.sessionId,
            storedAtLoad.recoveryToken,
          )
          if (completed.status === 'paywalled') {
            restoredPaywall = completed
            setPaywall(completed)
          }
        }

        if (storedAtLoad.orderId) {
          const restoredOrder = await getCommercialOrder(
            storedAtLoad.orderId,
            storedAtLoad.recoveryToken,
          )
          setOrder(restoredOrder)
          if (restoredOrder.reportToken) {
            setReportToken(restoredOrder.reportToken)
            const response = await getCommercialReport(restoredOrder.reportToken)
            setResult(response.report)
            setView('result')
            trackCommercialEvent('report_view', {
              sessionId: storedAtLoad.sessionId,
              orderId: storedAtLoad.orderId,
              reportVersion: response.report.versions.content,
              properties: { loadStatus: 'restored_order' },
            })
            return
          }
        }

        if (restoredPaywall) setView('paywall')
      } catch {
        setError('上次进度暂时无法从服务端恢复，你可以稍后重试或重新开始。')
      }
    }

    void restore()
  }, [storedAtLoad])

  const resetLocalState = () => {
    localStorage.removeItem(STORAGE_KEY)
    setSessionId('')
    setRecoveryToken('')
    setQuestionnaireVersion('')
    setQuestions([])
    setAnswers({})
    setCurrentIndex(0)
    setPaywall(null)
    setOrder(null)
    setOrderId(undefined)
    setReportToken(undefined)
    setResult(null)
    setIsSample(false)
    setError(null)
  }

  const startFresh = async () => {
    setBusy(true)
    setError(null)
    try {
      const session = await createCommercialSession(acquisitionChannel())
      resetLocalState()
      setSessionId(session.sessionId)
      setRecoveryToken(session.recoveryToken)
      setQuestionnaireVersion(session.questionnaireVersion)
      setQuestions(session.questions)
      setView('quiz')
      trackCommercialEvent('test_start', {
        sessionId: session.sessionId,
        questionnaireVersion: session.questionnaireVersion,
      })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '暂时无法开始测试。')
    } finally {
      setBusy(false)
    }
  }

  const resume = async () => {
    if (!sessionId || !recoveryToken) {
      await startFresh()
      return
    }
    setBusy(true)
    setError(null)
    try {
      const restored = await restoreCommercialSession(sessionId, recoveryToken)
      setQuestions(restored.questions)
      setQuestionnaireVersion(restored.questionnaireVersion)
      setAnswers(Object.fromEntries(restored.answers.map((item) => [item.questionId, item.value])))

      if (['paywalled', 'purchased'].includes(restored.status)) {
        const completed = await completeCommercialSession(sessionId, recoveryToken)
        if (completed.status === 'paywalled') {
          setPaywall(completed)
          if (orderId) {
            const restoredOrder = await getCommercialOrder(orderId, recoveryToken)
            setOrder(restoredOrder)
            if (restoredOrder.reportToken) {
              setReportToken(restoredOrder.reportToken)
              const response = await getCommercialReport(restoredOrder.reportToken)
              setResult(response.report)
              setIsSample(false)
              setView('result')
              return
            }
          }
          setView('paywall')
          return
        }
      }
      setView('quiz')
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '暂时无法恢复测试。')
    } finally {
      setBusy(false)
    }
  }

  const previewResult = async () => {
    setBusy(true)
    setError(null)
    try {
      const sample = await getSampleReport()
      setResult(sample.report)
      setIsSample(true)
      setView('result')
      trackCommercialEvent('report_view', {
        reportVersion: sample.report.versions.content,
        properties: { loadStatus: 'sample' },
      })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '示例报告暂时无法打开。')
    } finally {
      setBusy(false)
    }
  }

  const finishAssessment = async () => {
    if (!sessionId || !recoveryToken) return
    setView('processing')
    setError(null)
    try {
      const [completed] = await Promise.all([
        completeCommercialSession(sessionId, recoveryToken),
        wait(3000),
      ])
      if (completed.status === 'needs_review') {
        trackCommercialEvent('test_complete', {
          sessionId,
          questionnaireVersion,
          properties: { quality: 'needs_review' },
        })
        setError(completed.quality.warnings.join(' '))
        const reviewId = completed.quality.unansweredRequiredQuestionIds[0]
        if (reviewId) {
          const reviewIndex = questions.findIndex((question) => question.id === reviewId)
          if (reviewIndex >= 0) setCurrentIndex(reviewIndex)
        } else {
          setCurrentIndex(Math.max(0, questions.length - 2))
        }
        setView('quiz')
        return
      }
      setPaywall(completed)
      setView('paywall')
      trackCommercialEvent('test_complete', {
        sessionId,
        questionnaireVersion,
        properties: { quality: 'eligible' },
      })
      trackCommercialEvent('paywall_view', {
        sessionId,
        questionnaireVersion,
        priceVersion: completed.priceVersion,
        paywallVersion: completed.paywallVersion,
      })
    } catch (caught) {
      const message = caught instanceof ApiError ? caught.message : '报告生成失败，请稍后再试。'
      setError(message)
      setView('quiz')
    }
  }

  const selectAnswer = async (value: number | null) => {
    const question = questions[currentIndex]
    if (!question || !sessionId || !recoveryToken || busy) return

    setBusy(true)
    setError(null)
    const previousAnswers = answers
    setAnswers((current) => ({ ...current, [question.id]: value }))

    try {
      await saveCommercialAnswer(sessionId, recoveryToken, question.id, value)
      trackCommercialEvent('question_answer', {
        sessionId,
        questionnaireVersion,
        properties: {
          questionId: question.id,
          position: currentIndex + 1,
          answerState: value === null ? 'not_experienced' : 'answered',
        },
      })
      await wait(180)
      if (currentIndex >= questions.length - 1) {
        await finishAssessment()
      } else {
        setCurrentIndex((index) => Math.min(index + 1, questions.length - 1))
      }
    } catch (caught) {
      setAnswers(previousAnswers)
      setError(caught instanceof Error ? caught.message : '答案保存失败，请重试。')
    } finally {
      setBusy(false)
    }
  }

  const buyReport = async () => {
    if (!sessionId || !recoveryToken) return
    setBusy(true)
    setError(null)
    try {
      const created = await createCommercialOrder(sessionId, recoveryToken)
      setOrder(created)
      setOrderId(created.orderId)
      trackCommercialEvent('payment_start', {
        sessionId,
        orderId: created.orderId,
        questionnaireVersion,
        properties: {
          provider: created.provider,
          amountFen: created.amountFen,
          sandbox: created.checkout?.mode === 'sandbox',
        },
      })
      if (!created.checkout && created.status !== 'fulfilled') {
        setError('支付渠道正在准备中，请稍后查询订单状态。')
      }
      if (created.status === 'fulfilled') {
        const restoredOrder = await getCommercialOrder(created.orderId, recoveryToken)
        setOrder(restoredOrder)
        if (restoredOrder.reportToken) {
          const response = await getCommercialReport(restoredOrder.reportToken)
          setReportToken(restoredOrder.reportToken)
          setResult(response.report)
          setIsSample(false)
          setView('result')
        }
      }
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '订单创建失败，请稍后再试。')
    } finally {
      setBusy(false)
    }
  }

  const confirmSandbox = async () => {
    if (!orderId || !recoveryToken) return
    setBusy(true)
    setError(null)
    try {
      const confirmed = await confirmSandboxOrder(orderId, recoveryToken)
      const response = await getCommercialReport(confirmed.reportToken)
      setReportToken(confirmed.reportToken)
      setResult(response.report)
      setIsSample(false)
      setView('result')
      trackCommercialEvent('payment_success', {
        sessionId,
        orderId,
        questionnaireVersion,
        properties: { amountFen: order?.amountFen ?? 490, confirmationSource: 'sandbox' },
      })
      trackCommercialEvent('report_view', {
        sessionId,
        orderId,
        reportVersion: response.report.versions.content,
        properties: { loadStatus: 'delivered' },
      })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '报告交付失败，请稍后重试。')
    } finally {
      setBusy(false)
    }
  }

  const queryOrderStatus = async () => {
    if (!orderId || !recoveryToken) return
    setBusy(true)
    setError(null)
    try {
      const refreshed = await getCommercialOrder(orderId, recoveryToken)
      setOrder(refreshed)
      if (refreshed.reportToken) {
        const response = await getCommercialReport(refreshed.reportToken)
        setReportToken(refreshed.reportToken)
        setResult(response.report)
        setIsSample(false)
        setView('result')
        trackCommercialEvent('report_view', {
          sessionId,
          orderId,
          reportVersion: response.report.versions.content,
          properties: { loadStatus: 'order_query' },
        })
        return
      }
      setError(refreshed.status === 'payment_pending'
        ? '支付结果尚未确认，请稍后再次查询；请勿重复付款。'
        : `当前订单状态：${refreshed.status}`)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '订单查询失败，请稍后重试。')
    } finally {
      setBusy(false)
    }
  }

  const saveInviteCard = () => {
    downloadInviteCard()
    trackCommercialEvent('card_generate', {
      sessionId,
      properties: { format: 'square', result: 'download_started', paid: false },
    })
  }

  const saveRecoveryInfo = async () => {
    if (!orderId || !recoveryToken) return
    const recoveryInfo = [
      'TT16 报告恢复信息',
      `订单号：${orderId}`,
      `恢复凭证：${recoveryToken}`,
      '请像保管密码一样保存，不要公开分享。',
    ].join('\n')
    try {
      await navigator.clipboard.writeText(recoveryInfo)
      setError('订单号与恢复凭证已复制，请保存到安全位置。')
    } catch {
      setError('浏览器未允许复制，请打开“恢复已有订单”手动保存。')
    }
  }

  const recoverExistingReport = async (candidateOrderId: string, candidateRecoveryToken: string) => {
    setBusy(true)
    setError(null)
    try {
      const recovered = await recoverCommercialReport(candidateOrderId, candidateRecoveryToken)
      if (recovered.status !== 'fulfilled' || !recovered.reportToken) {
        setError('订单尚未完成交付，请稍后再次查询。')
        return
      }
      const response = await getCommercialReport(recovered.reportToken)
      setOrderId(candidateOrderId)
      setRecoveryToken(candidateRecoveryToken)
      setReportToken(recovered.reportToken)
      setResult(response.report)
      setIsSample(false)
      setRecoveryOpen(false)
      setView('result')
      trackCommercialEvent('report_view', {
        orderId: candidateOrderId,
        reportVersion: response.report.versions.content,
        properties: { loadStatus: 'recovered_manual' },
      })
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '恢复失败，请核对信息后重试。')
    } finally {
      setBusy(false)
    }
  }

  const submitSupportCase = async (input: {
    kind: SupportCaseKind
    message: string
    contact?: string
    includeCurrentOrder: boolean
  }): Promise<string | null> => {
    setBusy(true)
    setError(null)
    try {
      if (input.kind === 'refund_request' && input.includeCurrentOrder && orderId && recoveryToken) {
        const refund = await requestCommercialRefund(orderId, recoveryToken, {
          reasonCode: 'user_request',
          message: input.message,
          contact: input.contact,
        })
        setOrder((current) => current ? { ...current, status: refund.orderStatus } : current)
        trackCommercialEvent('refund_request', {
          sessionId,
          orderId,
          properties: { source: 'support_center', caseId: refund.caseId ?? 'existing' },
        })
        return refund.caseId
      }

      const response = await createCommercialSupportCase({
        kind: input.kind,
        message: input.message,
        contact: input.contact,
        orderId: input.includeCurrentOrder ? orderId : undefined,
        recoveryToken: input.includeCurrentOrder ? recoveryToken : undefined,
      })
      if (input.kind === 'refund_request') {
        trackCommercialEvent('refund_request', {
          sessionId,
          orderId: input.includeCurrentOrder ? orderId : undefined,
          properties: { source: 'support_center', caseId: response.caseId },
        })
      }
      return response.caseId
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : '工单提交失败，请稍后重试。')
      return null
    } finally {
      setBusy(false)
    }
  }

  const restart = () => {
    resetLocalState()
    setView('landing')
  }

  return (
    <div className={`app app--${view}`}>
      {view === 'landing' && (
        <LandingPage
          hasProgress={hasProgress}
          answeredCount={answerCount}
          busy={busy}
          error={error}
          onStart={startFresh}
          onResume={resume}
          onPreview={previewResult}
          onAbout={() => setAboutOpen(true)}
          onRecover={() => { setError(null); setRecoveryOpen(true) }}
          onSupport={() => { setError(null); setSupportOpen(true) }}
        />
      )}

      {view === 'quiz' && questions[currentIndex] && (
        <QuizPage
          question={questions[currentIndex]}
          index={currentIndex}
          total={questions.length}
          selected={answers[questions[currentIndex].id]}
          isAnswered={questions[currentIndex].id in answers}
          answeredCount={answerCount}
          onSelect={selectAnswer}
          onBack={() => currentIndex === 0 ? setView('landing') : setCurrentIndex((index) => index - 1)}
          onNext={() => setCurrentIndex((index) => Math.min(index + 1, questions.length - 1))}
          onExit={() => setView('landing')}
        />
      )}

      {view === 'processing' && (
        <main className="processing-screen" aria-live="polite">
          <div className="processing-orbit" aria-hidden="true"><span /><span /><span /><i>TT</i></div>
          <p className="eyebrow">正在组合四个维度</p>
          <h1>生成你的交易人格</h1>
          <p>服务端正在完成版本化评分与报告快照，不连接任何券商账户。</p>
        </main>
      )}

      {view === 'paywall' && paywall && (
        <PaywallPage
          paywall={paywall}
          order={order}
          busy={busy}
          error={error}
          onBuy={buyReport}
          onConfirmSandbox={confirmSandbox}
          onQueryOrder={queryOrderStatus}
          onInvite={saveInviteCard}
          onSaveRecovery={saveRecoveryInfo}
          onRecover={() => { setError(null); setRecoveryOpen(true) }}
          onSupport={() => { setError(null); setSupportOpen(true) }}
          onHome={() => setView('landing')}
          onAbout={() => setAboutOpen(true)}
        />
      )}

      {view === 'result' && result && (
        <ResultPage
          result={result}
          isSample={isSample}
          onRestart={restart}
          onHome={() => setView('landing')}
          onAbout={() => setAboutOpen(true)}
          onRecover={() => { setError(null); setRecoveryOpen(true) }}
          onSupport={() => { setError(null); setSupportOpen(true) }}
          onCardGenerate={(format) => trackCommercialEvent('card_generate', {
            sessionId,
            orderId,
            properties: { format, result: 'download_started', paid: !isSample },
          })}
          onShareClick={(target) => trackCommercialEvent('share_click', {
            sessionId,
            orderId,
            properties: { target, paid: !isSample },
          })}
          onFeedback={
            reportToken
              ? (value) => sendCommercialFeedback(reportToken, value).then(() => undefined)
              : undefined
          }
        />
      )}

      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <RecoveryDialog
        open={recoveryOpen}
        defaultOrderId={orderId}
        defaultRecoveryToken={recoveryToken}
        busy={busy}
        error={error}
        onClose={() => { setRecoveryOpen(false); setError(null) }}
        onRecover={recoverExistingReport}
      />
      <SupportDialog
        open={supportOpen}
        defaultOrderId={orderId}
        hasOrderCredential={Boolean(orderId && recoveryToken)}
        busy={busy}
        error={error}
        onClose={() => { setSupportOpen(false); setError(null) }}
        onSubmit={submitSupportCase}
      />
    </div>
  )
}
