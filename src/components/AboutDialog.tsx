import { useEffect } from 'react'
import { Building2, Database, Eye, ReceiptText, Scale, ShieldCheck, X } from 'lucide-react'
import { BrandMark } from './Illustrations'

type AboutDialogProps = {
  open: boolean
  onClose: () => void
}

export function AboutDialog({ open, onClose }: AboutDialogProps) {
  useEffect(() => {
    if (!open) return
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', handleKey)
    document.body.classList.add('modal-open')
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.classList.remove('modal-open')
    }
  }, [onClose, open])

  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="about-dialog" role="dialog" aria-modal="true" aria-labelledby="about-title" onMouseDown={(event) => event.stopPropagation()}>
        <header className="dialog-header">
          <div className="dialog-brand"><BrandMark size={38} /><span>TT16</span></div>
          <button className="icon-button" onClick={onClose} aria-label="关闭"><X /></button>
        </header>
        <div className="about-dialog__body">
          <p className="eyebrow">ABOUT THE MODEL</p>
          <h2 id="about-title">模型、隐私与购买说明</h2>
          <p className="about-lead">TT16 是面向 18 岁以上用户的交易行为风格娱乐自评。它观察你如何形成观点、等待兑现、表达风险和执行计划，并把四个连续维度组合成 16 种人格。</p>

          <div className="about-points">
            <article><Eye /><div><h3>描述倾向，不做诊断</h3><p>人格代码不是能力、收益或智力排名；边界维度也可能随市场环境变化。</p></div></article>
            <article><Scale /><div><h3>中立呈现两端</h3><p>研究与信号、持有与交易、进攻与防守、计划与灵活都有各自适用条件。</p></div></article>
            <article><Database /><div><h3>最少收集与安全恢复</h3><p>商业版会把匿名会话、逐题选项、评分版本、订单和交付状态保存到服务端；不采集姓名、身份证、券商账户、持仓、流水或资金规模。</p></div></article>
            <article><ShieldCheck /><div><h3>不构成投资建议</h3><p>结果仅供自我观察与娱乐，不提供股票、行业、仓位比例或收益预测。</p></div></article>
            <article><ReceiptText /><div><h3>一次购买与数字交付</h3><p>完整报告标价 ¥4.9，一次购买、不自动续费。支付成功后立即交付当前版本报告；重复扣款或交付失败可提交售后处理。</p></div></article>
            <article><Building2 /><div><h3>当前为沙盒内测</h3><p>当前环境仅支持模拟支付，不会产生真实扣款。正式经营主体、支付商户、客服渠道和服务时间确认前，不会开放真实收费。</p></div></article>
          </div>

          <div className="about-notice">
            <strong>隐私、售后与用户权利</strong>
            <p>你可以使用订单号和高熵恢复凭证找回已购报告。数据查询、更正、删除、撤回和退款请求将在正式客服入口中受理；账务、反欺诈和法定义务所需记录可能依法保留。TT16 与 MBTI、Myers-Briggs、券商及交易所均无关联，也未宣称心理测量认证或收益改善效果。</p>
          </div>
        </div>
        <footer className="dialog-footer"><span>评估版本：tt16-commercial-1.1.0 · 内测政策 v1.0</span><button className="button button--dark button--compact" onClick={onClose}>我知道了</button></footer>
      </section>
    </div>
  )
}
