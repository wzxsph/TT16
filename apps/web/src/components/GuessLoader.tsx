import { useEffect, useState, type ComponentType } from 'react'
import { BrainCircuit, LockKeyhole } from 'lucide-react'
import { sitePath } from '../routes'
import { BrandMark } from './Illustrations'

export function GuessLoader() {
  const [Flow, setFlow] = useState<ComponentType | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    void import('./GuessFlow')
      .then((module) => { if (active) setFlow(() => module.GuessFlow) })
      .catch(() => { if (active) setFailed(true) })
    return () => { active = false }
  }, [])

  if (Flow) return <Flow />

  return (
    <main className="guess-loader" aria-live="polite">
      <a className="guess-loader__brand" href={sitePath('/')}><BrandMark size={38} /><strong>TT16</strong></a>
      <div className="guess-loader__orbit" aria-hidden="true"><BrainCircuit /><span /><span /></div>
      <p className="eyebrow">LOCAL ADAPTIVE GUESS</p>
      <h1>{failed ? '快速猜型暂时没有载入' : '正在准备本地题库'}</h1>
      <p><LockKeyhole size={15} />200 条题目按需载入；回答与判断只留在当前设备。</p>
      {failed && <a className="button button--dark" href={sitePath('/')}>返回首页</a>}
    </main>
  )
}
