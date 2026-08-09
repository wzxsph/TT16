import { useEffect, useState } from 'react'
import {
  analyticsUnavailableByPolicy,
  getAnalyticsPreference,
  setAnalyticsPreference,
} from '../lib/analytics'
import { sitePath } from '../routes'

export function AnalyticsConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (analyticsUnavailableByPolicy()) return
    setVisible(getAnalyticsPreference() === null)
  }, [])

  if (!visible) return null

  const choose = (value: 'accepted' | 'declined') => {
    setAnalyticsPreference(value)
    setVisible(false)
  }

  return (
    <aside className="analytics-consent" aria-label="匿名统计选择">
      <div>
        <strong>是否帮助我们了解哪些公开页面更有用？</strong>
        <p>只统计页面、来源域名和六个固定事件；不发送答案、人格结果、自由文本或持久访客标识。<a href={sitePath('/privacy/')}>查看隐私说明</a></p>
      </div>
      <div className="analytics-consent__actions">
        <button className="button button--ghost button--compact" onClick={() => choose('declined')}>暂不参与</button>
        <button className="button button--dark button--compact" onClick={() => choose('accepted')}>同意匿名统计</button>
      </div>
    </aside>
  )
}
