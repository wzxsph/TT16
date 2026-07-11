import { useEffect } from 'react'
import { Database, Eye, Scale, ShieldCheck, X } from 'lucide-react'
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
          <h2 id="about-title">关于交易人格十六型</h2>
          <p className="about-lead">TT16 是一套交易行为风格自评框架。它观察你如何形成观点、等待兑现、表达风险和执行计划，并把四个连续维度组合成 16 种人格。</p>

          <div className="about-points">
            <article><Eye /><div><h3>描述倾向，不做诊断</h3><p>人格代码不是能力、收益或智力排名；边界维度也可能随市场环境变化。</p></div></article>
            <article><Scale /><div><h3>中立呈现两端</h3><p>研究与信号、持有与交易、进攻与防守、计划与灵活都有各自适用条件。</p></div></article>
            <article><Database /><div><h3>Demo 数据只留本机</h3><p>逐题答案保存在浏览器 localStorage，可随时清除；本版本不连接券商账户。</p></div></article>
            <article><ShieldCheck /><div><h3>不构成投资建议</h3><p>结果仅供自我观察与娱乐，不提供股票、行业、仓位比例或收益预测。</p></div></article>
          </div>

          <div className="about-notice">
            <strong>重要说明</strong>
            <p>TT16 与 MBTI、Myers-Briggs 及任何券商均无关联。当前题库为 v0.1 研究草案，尚未完成心理测量验证，不应替代独立判断、财务规划或投资适当性评估。</p>
          </div>
        </div>
        <footer className="dialog-footer"><span>模型版本：tt16-1.0.0-demo</span><button className="button button--dark button--compact" onClick={onClose}>我知道了</button></footer>
      </section>
    </div>
  )
}
