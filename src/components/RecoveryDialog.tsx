import { useEffect, useState } from 'react'
import { KeyRound, RotateCcw, ShieldCheck, X } from 'lucide-react'
import { BrandMark } from './Illustrations'

type RecoveryDialogProps = {
  open: boolean
  defaultOrderId?: string
  defaultRecoveryToken?: string
  busy: boolean
  error: string | null
  onClose: () => void
  onRecover: (orderId: string, recoveryToken: string) => Promise<void>
}

export function RecoveryDialog({
  open,
  defaultOrderId = '',
  defaultRecoveryToken = '',
  busy,
  error,
  onClose,
  onRecover,
}: RecoveryDialogProps) {
  const [orderId, setOrderId] = useState(defaultOrderId)
  const [recoveryToken, setRecoveryToken] = useState(defaultRecoveryToken)

  useEffect(() => {
    if (!open) return
    setOrderId(defaultOrderId)
    setRecoveryToken(defaultRecoveryToken)
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKey)
    document.body.classList.add('modal-open')
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.classList.remove('modal-open')
    }
  }, [defaultOrderId, defaultRecoveryToken, open])

  if (!open) return null

  const canSubmit = orderId.trim().length > 10 && recoveryToken.trim().length > 20 && !busy

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="recovery-dialog" role="dialog" aria-modal="true" aria-labelledby="recovery-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="dialog-header">
          <div className="dialog-brand"><BrandMark size={36} /><span>报告恢复</span></div>
          <button className="icon-button" onClick={onClose} aria-label="关闭"><X /></button>
        </header>
        <div className="recovery-dialog__body">
          <span className="recovery-icon"><RotateCcw /></span>
          <p className="eyebrow">RECOVER YOUR REPORT</p>
          <h2 id="recovery-title">找回已购买的报告</h2>
          <p>输入订单号和恢复凭证。系统采用统一错误提示，不会公开订单是否存在，也不会返回逐题答案。</p>

          <label>
            <span>订单号</span>
            <input value={orderId} onChange={(event) => setOrderId(event.target.value)} autoComplete="off" placeholder="ord_…" />
          </label>
          <label>
            <span>恢复凭证</span>
            <input value={recoveryToken} onChange={(event) => setRecoveryToken(event.target.value)} autoComplete="off" placeholder="请粘贴购买时保存的恢复凭证" type="password" />
          </label>

          {error && <div className="landing-error" role="alert">{error}</div>}
          <button className="button button--primary button--large recovery-submit" disabled={!canSubmit} onClick={() => onRecover(orderId.trim(), recoveryToken.trim())}>
            <KeyRound size={18} />{busy ? '正在安全核验…' : '恢复报告'}
          </button>
          <div className="recovery-safety"><ShieldCheck size={15} />恢复凭证只用于本次核验，不会展示在报告中。</div>
        </div>
      </section>
    </div>
  )
}
