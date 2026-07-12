import { Check, ChevronLeft, Copy, CreditCard, FileText, LockKeyhole, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react'
import type { OrderPayload, PaywallPayload } from '../lib/api'
import { BrandMark } from './Illustrations'

type PaywallPageProps = {
  paywall: PaywallPayload
  order: OrderPayload | null
  busy: boolean
  error: string | null
  onBuy: () => void
  onConfirmSandbox: () => void
  onQueryOrder: () => void
  onInvite: () => void
  onSaveRecovery: () => void
  onRecover: () => void
  onSupport: () => void
  onHome: () => void
  onAbout: () => void
}

export function PaywallPage({
  paywall,
  order,
  busy,
  error,
  onBuy,
  onConfirmSandbox,
  onQueryOrder,
  onInvite,
  onSaveRecovery,
  onRecover,
  onSupport,
  onHome,
  onAbout,
}: PaywallPageProps) {
  return (
    <main className="paywall-page">
      <header className="result-header shell">
        <button className="brand" onClick={onHome} aria-label="返回首页">
          <BrandMark size={36} />
          <span className="brand-word">TT16</span>
          <span className="brand-divider" />
          <span className="brand-subtitle">报告已生成</span>
        </button>
        <button onClick={onAbout}>购买与隐私说明</button>
      </header>

      <section className="paywall-shell shell">
        <button className="paywall-back" onClick={onHome}><ChevronLeft size={17} />稍后再看</button>
        <div className="paywall-grid">
          <article className="paywall-preview" aria-label="已锁定的人格报告预览">
            <div className="paywall-preview__glow" />
            <div className="paywall-lock"><LockKeyhole size={26} /></div>
            <p className="eyebrow">YOUR REPORT IS READY</p>
            <div className="paywall-code">••••</div>
            <h1>你的 TT16 已经生成</h1>
            <p>人格代码、专属称号、四维分数和完整报告将在解锁后立即显示。</p>
            <div className="paywall-blur-lines" aria-hidden="true"><i /><i /><i /></div>
          </article>

          <article className="paywall-offer">
            <div className="paywall-offer__icon"><Sparkles /></div>
            <p className="eyebrow">ONE-TIME UNLOCK</p>
            <h2>完整交易人格报告</h2>
            <p className="paywall-offer__lead">一次购买，永久查看当前报告，不自动续费。</p>

            <ul className="paywall-outline">
              {paywall.reportOutline.map((item) => <li key={item}><Check size={16} />{item}</li>)}
            </ul>

            <div className="paywall-price">
              <span>一次解锁</span>
              <strong>{paywall.product.displayPrice}</strong>
            </div>

            {error && <div className="paywall-error" role="alert">{error}</div>}

            {!order && (
              <button className="button button--primary button--large paywall-buy" onClick={onBuy} disabled={busy}>
                <CreditCard size={18} />{busy ? '正在创建订单…' : `立即解锁 ${paywall.product.displayPrice}`}
              </button>
            )}

            {order?.checkout?.mode === 'sandbox' && (
              <div className="sandbox-checkout">
                <strong>沙盒模拟支付</strong>
                <p>{order.checkout.warning}</p>
                <div className="order-recovery-card">
                  <span>订单号</span>
                  <code>{order.orderId}</code>
                  <button type="button" onClick={onSaveRecovery}><Copy size={15} />保存恢复信息</button>
                </div>
                <button className="button button--dark button--large" onClick={onConfirmSandbox} disabled={busy}>
                  {busy ? '正在确认交付…' : '模拟支付成功并查看报告'}
                </button>
              </div>
            )}

            {order && !order.checkout && (
              <div className="order-status-card" aria-live="polite">
                <div><span>订单状态</span><strong>{order.status === 'fulfilled' ? '报告已交付' : order.status === 'payment_pending' ? '等待支付确认' : order.status}</strong></div>
                <code>{order.orderId}</code>
                <button className="button button--ghost" onClick={onQueryOrder} disabled={busy}>
                  <RotateCcw size={16} />{busy ? '正在查询…' : '重新查询订单'}
                </button>
              </div>
            )}

            <button className="text-button paywall-invite" onClick={onInvite}>
              <FileText size={16} />先保存一张非结果邀请卡
            </button>

            <button className="text-button paywall-invite" onClick={onRecover}>
              <RotateCcw size={16} />恢复已有订单或报告
            </button>

            <button className="text-button paywall-invite" onClick={onSupport}>
              <ShieldCheck size={16} />售后、退款与数据权利
            </button>

            <div className="paywall-trust">
              <span><ShieldCheck size={14} />娱乐测试，不构成投资建议</span>
              <span><LockKeyhole size={14} />未付款前不会展示或下发你的结果</span>
            </div>
          </article>
        </div>
      </section>
    </main>
  )
}
