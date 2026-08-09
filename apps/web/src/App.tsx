import { useEffect, useState } from 'react'
import { AnalyticsConsent } from './components/AnalyticsConsent'
import { AssessmentFlow, readStoredAssessment } from './components/AssessmentFlow'
import { ContentPage } from './components/ContentPages'
import { LandingPage } from './components/LandingPage'
import { GuessLoader } from './components/GuessLoader'
import { trackPageView } from './lib/analytics'
import { getPageMeta, normalizeRoute, sitePath } from './routes'

function HomePage() {
  const [progress, setProgress] = useState({ count: 0, completed: false })
  useEffect(() => {
    const stored = readStoredAssessment()
    setProgress({ count: stored ? Object.keys(stored.answers).length : 0, completed: stored?.completed ?? false })
  }, [])
  const hasProgress = progress.count > 0
  return <LandingPage hasProgress={hasProgress} answeredCount={progress.count} onStart={() => window.location.assign(sitePath('/test/'))} onResume={() => window.location.assign(sitePath(progress.completed ? '/result/' : '/test/'))} onGuess={() => window.location.assign(sitePath('/guess/'))} onPreview={() => window.location.assign(sitePath('/types/RHDP/'))} />
}

export function App({ pathname }: { pathname: string }) {
  const path = normalizeRoute(pathname)
  const meta = getPageMeta(path)

  useEffect(() => {
    if (path !== '/guess/') trackPageView(path, meta.title)
  }, [meta.title, path])

  let page
  if (path === '/') page = <HomePage />
  else if (path === '/test/' || path === '/result/') page = <AssessmentFlow path={path} />
  else if (path === '/guess/') page = <GuessLoader />
  else page = <ContentPage pathname={path} />

  return <div className="app" data-runtime="free-local-v2">{page}{!path.includes('/print/') && path !== '/guess/' && <AnalyticsConsent />}</div>
}
