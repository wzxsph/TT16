import type { ReactNode } from 'react'
import { GitBranch } from 'lucide-react'
import { SOURCE_REPOSITORY_URL } from '../lib/project'
import { getPageMeta, sitePath } from '../routes'
import { BrandMark } from './Illustrations'

export function SiteLayout({ path, children }: { path: string; children: ReactNode }) {
  const meta = getPageMeta(path)
  return (
    <div className="content-site">
      <header className="content-header shell">
        <a className="brand" href={sitePath('/')} aria-label="TT16 首页">
          <BrandMark size={36} />
          <span className="brand-word">TT16</span>
          <span className="brand-divider" />
          <span className="brand-subtitle">交易人格十六型</span>
        </a>
        <nav className="content-nav" aria-label="主导航">
          <a href={sitePath('/types/')}>图鉴</a>
          <a href={sitePath('/dimensions/')}>维度</a>
          <a href={sitePath('/compare/')}>对照</a>
          <a href={sitePath('/tools/review/')}>复盘</a>
          <a href={sitePath('/guides/')}>指南</a>
          <a href={sitePath('/guess/')}>快速猜型</a>
          <a className="content-nav__cta" href={sitePath('/test/')}>开始测试</a>
        </nav>
      </header>
      {meta.breadcrumbs.length > 0 && (
        <nav className="breadcrumbs shell" aria-label="面包屑">
          {meta.breadcrumbs.map((item, index) => (
            <span key={item.path}>
              {index > 0 && <i aria-hidden="true">/</i>}
              {index === meta.breadcrumbs.length - 1 ? item.name : <a href={sitePath(item.path)}>{item.name}</a>}
            </span>
          ))}
        </nav>
      )}
      <main>{children}</main>
      <footer className="content-footer">
        <div className="shell content-footer__grid">
          <div>
            <a className="footer-logo" href={sitePath('/')}><BrandMark size={32} /><strong>TT16</strong></a>
            <p>描述决策偏好，不评价投资能力；不荐股、不排名、不诊断。</p>
          </div>
          <div><strong>探索</strong><a href={sitePath('/types/')}>16 型图鉴</a><a href={sitePath('/groups/enterprise-compounders/')}>四大族群</a><a href={sitePath('/dimensions/')}>四个维度</a></div>
          <div><strong>使用</strong><a href={sitePath('/guess/')}>快速猜型</a><a href={sitePath('/compare/')}>中性对照</a><a href={sitePath('/tools/review/')}>复盘检查</a><a href={sitePath('/guides/')}>方法指南</a></div>
          <div><strong>项目</strong><a href={sitePath('/methodology/')}>模型方法</a><a href={sitePath('/privacy/')}>隐私说明</a><a href={sitePath('/about/')}>关于</a><a href={SOURCE_REPOSITORY_URL} target="_blank" rel="noreferrer"><GitBranch size={14} /> 开源源码</a></div>
        </div>
        <div className="shell content-footer__bottom">AGPL-3.0-only · 内容版本 tt16-content-2.0.0 · 所有材料永久免费</div>
      </footer>
    </div>
  )
}
