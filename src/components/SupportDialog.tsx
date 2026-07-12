import { useEffect, useState } from 'react'
import { CheckCircle2, Headphones, ShieldCheck, X } from 'lucide-react'
import type { SupportCaseKind } from '../lib/api'
import { BrandMark } from './Illustrations'

type SupportDialogProps = {
  open: boolean
  defaultOrderId?: string
  hasOrderCredential: boolean
  busy: boolean
  error: string | null
  onClose: () => void
  onSubmit: (input: {
    kind: SupportCaseKind
    message: string
    contact?: string
    includeCurrentOrder: boolean
  }) => Promise<string | null>
}

const kindLabels: Record<SupportCaseKind, string> = {
  delivery_problem: '支付后未收到报告',
  duplicate_payment: '疑似重复支付',
  refund_request: '退款与售后咨询',
  privacy_request: '数据查询、更正或删除',
  other: '其他问题',
}

export function SupportDialog({
  open,
  defaultOrderId,
  hasOrderCredential,
  busy,
  error,
  onClose,
  onSubmit,
}: SupportDialogProps) {
  const [kind, setKind] = useState<SupportCaseKind>('delivery_problem')
  const [message, setMessage] = useState('')
  const [contact, setContact] = useState('')
  const [includeCurrentOrder, setIncludeCurrentOrder] = useState(hasOrderCredential)
  const [caseId, setCaseId] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setIncludeCurrentOrder(hasOrderCredential)
    setCaseId(null)
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKey)
    document.body.classList.add('modal-open')
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.classList.remove('modal-open')
    }
  }, [hasOrderCredential, open])

  if (!open) return null

  const canSubmit = message.trim().length >= 10
    && (includeCurrentOrder || contact.trim().length >= 3)
    && !busy

  const submit = async () => {
    const createdCaseId = await onSubmit({
      kind,
      message: message.trim(),
      contact: contact.trim() || undefined,
      includeCurrentOrder,
    })
    if (createdCaseId) setCaseId(createdCaseId)
  }

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="support-dialog" role="dialog" aria-modal="true" aria-labelledby="support-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="dialog-header">
          <div className="dialog-brand"><BrandMark size={36} /><span>TT16 售后与数据权利</span></div>
          <button className="icon-button" onClick={onClose} aria-label="关闭"><X /></button>
        </header>
        <div className="support-dialog__body">
          {caseId ? (
            <div className="support-success">
              <CheckCircle2 />
              <p className="eyebrow">REQUEST RECEIVED</p>
              <h2 id="support-title">请求已登记</h2>
              <p>请保存工单号。当前为沙盒内测，工单只用于验证产品流程，不承诺正式客服时效。</p>
              <code>{caseId}</code>
              <button className="button button--dark" onClick={onClose}>完成</button>
            </div>
          ) : (
            <>
              <span className="support-icon"><Headphones /></span>
              <p className="eyebrow">SUPPORT CENTER</p>
              <h2 id="support-title">提交售后或数据请求</h2>
              <p className="support-lead">订单相关请求会先核验本机恢复凭证；无订单请求需要留下可回复的联系方式。</p>

              <label>
                <span>问题类型</span>
                <select value={kind} onChange={(event) => setKind(event.target.value as SupportCaseKind)}>
                  {Object.entries(kindLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
                </select>
              </label>

              {hasOrderCredential && (
                <label className="support-order-check">
                  <input type="checkbox" checked={includeCurrentOrder} onChange={(event) => setIncludeCurrentOrder(event.target.checked)} />
                  <span>关联当前订单 <code>{defaultOrderId}</code></span>
                </label>
              )}

              <label>
                <span>问题说明（至少 10 个字）</span>
                <textarea value={message} onChange={(event) => setMessage(event.target.value)} maxLength={1000} placeholder="请说明发生时间、现象和你希望我们如何处理；不要填写身份证、支付密码等敏感信息。" />
              </label>
              <label>
                <span>联系方式{includeCurrentOrder ? '（选填）' : '（必填）'}</span>
                <input value={contact} onChange={(event) => setContact(event.target.value)} maxLength={200} autoComplete="off" placeholder="邮箱、微信号或其他可回复方式" />
              </label>

              {error && <div className="landing-error" role="alert">{error}</div>}
              <button className="button button--primary button--large support-submit" disabled={!canSubmit} onClick={submit}>
                {busy ? '正在提交…' : '提交请求'}
              </button>
              <div className="recovery-safety"><ShieldCheck size={15} />不会在工单中保存恢复凭证明文。</div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
