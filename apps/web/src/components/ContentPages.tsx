import { useEffect, useMemo, useState } from 'react'
import {
  ArrowRight,
  Check,
  CircleHelp,
  Download,
  ExternalLink,
  Lightbulb,
  Printer,
  RefreshCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react'
import {
  DIMENSIONS,
  GROUPS,
  GUIDES,
  MARKETING_COPY,
  PROFILE_CODES,
  PROFILE_LIST,
  PROFILES,
  adjacentTypeCodes,
  compareProfiles,
  isTypeCode,
  type ProfileV2,
  type TypeCode,
} from '@tt16/core'
import { trackEvent } from '../lib/analytics'
import { normalizeRoute, sitePath } from '../routes'
import { AdSlot } from './AdSlot'
import { SiteLayout } from './SiteLayout'

const groupSlugByName = Object.fromEntries(GROUPS.map((group) => [group.name, group.slug]))
const portrait = (code: TypeCode) => `${import.meta.env.BASE_URL}images/personalities-v2/${code}.webp`

function PageIntro({ eyebrow, title, lead }: { eyebrow: string; title: string; lead: string }) {
  return <header className="content-intro shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{lead}</p></header>
}

function BoundaryNotice() {
  return <div className="boundary-notice"><ShieldCheck size={18} /><p>TT16 只描述决策偏好，不测收益能力、知识水平、风险承受能力或投资适当性，也不构成证券建议。</p></div>
}

function ProfileCard({ profile }: { profile: ProfileV2 }) {
  return (
    <a className="profile-card" href={sitePath(`/types/${profile.code}/`)}>
      <div className="profile-card__image"><img src={portrait(profile.code)} alt="" loading="lazy" /></div>
      <div><span>{profile.code} · {profile.group}</span><h2>{profile.name}</h2><p>{profile.tagline}</p><small>{profile.keywords.join(' · ')}</small></div>
      <ArrowRight aria-hidden="true" />
    </a>
  )
}

function TypesIndex() {
  return (
    <SiteLayout path="/types/">
      <PageIntro eyebrow="PERSONALITY ATLAS" title="16 型公开人格图鉴" lead="先浏览，再测试。每一型都公开提供完整说明、相邻类型、可打印单页与分享素材；没有隐藏章节。" />
      <section className="content-section shell">
        <div className="group-filter-row">{GROUPS.map((group) => <a key={group.code} href={sitePath(`/groups/${group.slug}/`)}><strong>{group.code}</strong><span>{group.name}</span></a>)}</div>
        <div className="profile-grid">{PROFILE_LIST.map((profile) => <ProfileCard key={profile.code} profile={profile} />)}</div>
        <AdSlot placement="atlas_mid" />
        <BoundaryNotice />
      </section>
    </SiteLayout>
  )
}

function ProfileDetail({ code }: { code: TypeCode }) {
  const profile = PROFILES[code]
  const adjacent = adjacentTypeCodes(code)
  return (
    <SiteLayout path={`/types/${code}/`}>
      <section className="type-hero shell" data-group={code.slice(0, 2)}>
        <div className="type-hero__copy"><p className="eyebrow">{profile.group}</p><span className="type-code">{code}</span><h1>{profile.name}</h1><p className="type-tagline">{profile.tagline}</p><div className="keyword-row">{profile.keywords.map((item) => <span key={item}>{item}</span>)}</div><div className="type-actions"><a className="button button--dark" href={sitePath('/test/')}>开始 20 题测试</a><a className="button button--ghost" href={sitePath(`/types/${code}/print/`)}><Printer size={17} />A4 打印单页</a></div></div>
        <img src={portrait(code)} alt={`${profile.name}低多边形人格插画`} />
      </section>
      <article className="type-content shell">
        <section className="type-summary"><p>{profile.description}</p><BoundaryNotice /></section>
        <section className="content-block"><div className="block-heading"><p className="eyebrow">DECISION LOOP</p><h2>你的决策循环</h2></div><ol className="decision-loop"><li><span>01</span><strong>观察</strong><p>{profile.decisionLoop.observe}</p></li><li><span>02</span><strong>判断</strong><p>{profile.decisionLoop.decide}</p></li><li><span>03</span><strong>行动</strong><p>{profile.decisionLoop.act}</p></li><li><span>04</span><strong>复盘</strong><p>{profile.decisionLoop.review}</p></li></ol></section>
        <section className="content-block"><div className="block-heading"><p className="eyebrow">STRENGTHS &amp; OVERUSE</p><h2>三组力量与过度使用</h2></div><div className="pair-grid">{profile.traitPairs.map((pair, index) => <article key={pair.strength}><span>0{index + 1}</span><div><h3><Sparkles size={16} />自然力量</h3><p>{pair.strength}</p></div><div><h3><Scale size={16} />过度使用时</h3><p>{pair.overuse}</p></div></article>)}</div></section>
        <section className="content-block"><div className="block-heading"><p className="eyebrow">ENVIRONMENTS</p><h2>适配环境与风险环境</h2></div><div className="two-column-cards"><article><h3>较容易保持清晰</h3><ul>{profile.environments.supportive.map((item) => <li key={item}>{item}</li>)}</ul></article><article><h3>更需要降低确信</h3><ul>{profile.environments.challenging.map((item) => <li key={item}>{item}</li>)}</ul></article></div></section>
        <section className="content-block pressure-block"><div><p className="eyebrow">PRESSURE RESET</p><h2>压力模式与三个重置动作</h2><p>{profile.pressurePattern.pattern}</p></div><ol>{profile.pressurePattern.resetSteps.map((item, index) => <li key={item}><span>{index + 1}</span>{item}</li>)}</ol></section>
        <section className="content-block"><div className="block-heading"><p className="eyebrow">FIVE RULES</p><h2>五条可观察守则</h2></div><ol className="rules-cards">{profile.rules.map((rule, index) => <li key={rule}><span>{String(index + 1).padStart(2, '0')}</span><p>{rule}</p></li>)}</ol></section>
        <section className="content-block"><div className="block-heading"><p className="eyebrow">COLLABORATION</p><h2>协作中的贡献、需要与摩擦点</h2></div><div className="three-column-cards"><article><h3>你常带来的贡献</h3><ul>{profile.collaboration.offers.map((item) => <li key={item}>{item}</li>)}</ul></article><article><h3>你通常需要</h3><ul>{profile.collaboration.needs.map((item) => <li key={item}>{item}</li>)}</ul></article><article><h3>可能出现的摩擦</h3><ul>{profile.collaboration.friction.map((item) => <li key={item}>{item}</li>)}</ul></article></div></section>
        <section className="content-block"><div className="block-heading"><p className="eyebrow">REFLECTION</p><h2>三个复盘问题</h2></div><div className="prompt-list">{profile.reflectionPrompts.map((item) => <p key={item}><CircleHelp size={18} />{item}</p>)}</div></section>
        <section className="content-block"><div className="block-heading"><p className="eyebrow">COMMON MISREADS</p><h2>两个常见误解</h2></div><div className="misread-grid">{profile.commonMisreads.map((item) => <p key={item}><Lightbulb size={18} />{item}</p>)}</div></section>
        <section className="content-block adjacent-block"><div><p className="eyebrow">ONE LETTER AWAY</p><h2>只差一个维度的相邻类型</h2></div><div>{adjacent.map((item) => <a key={item} href={sitePath(`/types/${item}/`)}><strong>{item}</strong><span>{PROFILES[item].name}</span></a>)}</div></section>
        <AdSlot placement="type_detail_end" />
      </article>
    </SiteLayout>
  )
}

function GroupsPage({ slug }: { slug: string }) {
  const group = GROUPS.find((item) => item.slug === slug)
  if (!group) return <NotFound />
  return <SiteLayout path={`/groups/${slug}/`}><PageIntro eyebrow={`${group.code} · GROUP`} title={group.name} lead={`${group.tagline}${group.description}`} /><section className="content-section shell"><div className="profile-grid">{group.codes.map((code) => <ProfileCard key={code} profile={PROFILES[code]} />)}</div><div className="group-copy-card"><h2>适合传播的一句话</h2><p>{MARKETING_COPY.groups.find((item) => item.code === group.code)?.text}</p><p>族群是前两个维度形成的阅读入口，不代表共同策略、收益水平或适合的证券。</p></div></section></SiteLayout>
}

function DimensionsPage({ slug }: { slug?: string }) {
  const dimension = slug ? DIMENSIONS.find((item) => item.slug === slug) : undefined
  const path = dimension ? `/dimensions/${dimension.slug}/` : '/dimensions/'
  return <SiteLayout path={path}><PageIntro eyebrow="FOUR CONTINUOUS AXES" title={dimension ? dimension.title : '四个连续决策维度'} lead={dimension ? dimension.question : '四组偏好共同组成四字母类型。每个维度都保留百分比和边界状态，不把任何一端当成更好的答案。'} /><section className="content-section shell">{dimension ? <div className="dimension-detail"><article><span>{dimension.left.letter}</span><h2>{dimension.left.name}</h2><p>{dimension.left.description}</p></article><div><span>连续光谱</span><i /></div><article><span>{dimension.right.letter}</span><h2>{dimension.right.name}</h2><p>{dimension.right.description}</p></article><aside><Users size={20} /><div><h3>协作提醒</h3><p>{dimension.collaborationTip}</p></div></aside></div> : <div className="dimension-index-grid">{DIMENSIONS.map((item) => <a key={item.key} href={sitePath(`/dimensions/${item.slug}/`)}><span>{item.left.letter} ↔ {item.right.letter}</span><h2>{item.title}</h2><p>{item.question}</p><small>{item.left.name} / {item.right.name}</small></a>)}</div>}<BoundaryNotice /></section></SiteLayout>
}

function ComparePage() {
  const [first, setFirst] = useState<TypeCode>('RHDP')
  const [second, setSecond] = useState<TypeCode>('STAF')
  useEffect(() => trackEvent('compare_open'), [])
  const comparison = useMemo(() => compareProfiles(first, second), [first, second])
  const choose = (value: string, setter: (code: TypeCode) => void) => { if (isTypeCode(value)) setter(value) }
  return <SiteLayout path="/compare/"><PageIntro eyebrow="NEUTRAL COMPARISON" title="两种风格，放在同一张桌上" lead="看共同语言、分歧维度与沟通提醒。不生成匹配分、不推荐最佳搭档，也不比较能力高低。" /><section className="content-section shell"><div className="compare-picker"><label>类型 A<select value={first} onChange={(event) => choose(event.target.value, setFirst)}>{PROFILE_LIST.map((item) => <option key={item.code} value={item.code}>{item.code} · {item.name}</option>)}</select></label><span>×</span><label>类型 B<select value={second} onChange={(event) => choose(event.target.value, setSecond)}>{PROFILE_LIST.map((item) => <option key={item.code} value={item.code}>{item.code} · {item.name}</option>)}</select></label></div><div className="compare-identities"><a href={sitePath(`/types/${first}/`)}><img src={portrait(first)} alt="" /><strong>{comparison.first.code} · {comparison.first.name}</strong><span>{comparison.first.tagline}</span></a><a href={sitePath(`/types/${second}/`)}><img src={portrait(second)} alt="" /><strong>{comparison.second.code} · {comparison.second.name}</strong><span>{comparison.second.tagline}</span></a></div><p className="compare-summary">{comparison.summary}</p><div className="comparison-sections"><section><h2>共同倾向</h2>{comparison.sharedDimensions.length ? comparison.sharedDimensions.map((item) => <article key={item.key}><strong>{item.letter} · {item.title}</strong><p>{item.description}</p></article>) : <p>四个维度都不同。先从双方愿意共同验证的事实与边界开始。</p>}</section><section><h2>分歧维度与沟通提醒</h2>{comparison.differentDimensions.length ? comparison.differentDimensions.map((item) => <article key={item.key}><strong>{item.title}：{item.first.letter} ↔ {item.second.letter}</strong><p>{item.first.name}：{item.first.description}</p><p>{item.second.name}：{item.second.description}</p><aside><Lightbulb size={15} />{item.communicationTip}</aside></article>) : <p>类型相同也不代表经历、维度百分比和现实约束完全相同。</p>}</section></div><AdSlot placement="compare_end" /></section></SiteLayout>
}

const REVIEW_ITEMS = [
  '我能说清这次判断主要依据事实证据还是市场反馈。',
  '我在行动前写清了这次判断需要多长时间验证。',
  '我知道什么新证据会让我复核原判断。',
  '我先确定了可承受影响，再决定如何表达确信。',
  '我能区分计划中的更新条件与临场合理化。',
  '踏空或回撤出现时，我先执行了预先定义的暂停动作。',
  '我没有用一次结果证明整套方法一定正确或错误。',
  '我已经选出下一次能够被观察的一项小改动。',
] as const

function ReviewTool() {
  const [checked, setChecked] = useState<number[]>([])
  const toggle = (index: number) => setChecked((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index])
  return <SiteLayout path="/tools/review/"><PageIntro eyebrow="LOCAL REVIEW TOOL" title="五分钟决策复盘检查" lead="不填写证券、金额、账户或自由文本。勾选只存在当前页面内，刷新即清空。" /><section className="content-section shell"><div className="review-tool"><div className="review-score"><strong>{checked.length}</strong><span>/ {REVIEW_ITEMS.length} 项已核对</span><p>{checked.length < 3 ? '先找出一项最容易观察的缺口。' : checked.length < 7 ? '过程已经更清楚，再补一个停止条件。' : '记录得很完整；下一步只带走一个动作。'}</p></div><ol>{REVIEW_ITEMS.map((item, index) => <li key={item}><button type="button" role="checkbox" aria-checked={checked.includes(index)} onClick={() => toggle(index)} className={checked.includes(index) ? 'is-checked' : ''}><span>{checked.includes(index) && <Check size={16} />}</span><p>{item}</p></button></li>)}</ol><div className="review-actions"><button className="button button--ghost" onClick={() => setChecked([])}><RefreshCcw size={16} />清空本页</button><a className="button button--dark" href={sitePath('/guides/five-minute-review/')}>阅读复盘指南</a></div></div><AdSlot placement="tool_end" /><BoundaryNotice /></section></SiteLayout>
}

function GuidesPage({ slug }: { slug?: string }) {
  const guide = slug ? GUIDES.find((item) => item.slug === slug) : undefined
  if (slug && !guide) return <NotFound />
  const path = guide ? `/guides/${guide.slug}/` : '/guides/'
  return <SiteLayout path={path}><PageIntro eyebrow="METHOD GUIDES" title={guide?.title ?? '六篇方法指南'} lead={guide?.summary ?? '从怎样读报告，到怎样比较两种风格和完成五分钟复盘。内容短、可操作、全部公开。'} /><section className="content-section shell">{guide ? <article className="guide-article">{guide.sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}<BoundaryNotice /><nav><a href={sitePath('/guides/')}>返回全部指南</a><a href={sitePath('/tools/review/')}>打开复盘工具 <ArrowRight size={15} /></a></nav></article> : <div className="guide-grid">{GUIDES.map((item, index) => <a key={item.slug} href={sitePath(`/guides/${item.slug}/`)}><span>{String(index + 1).padStart(2, '0')}</span><h2>{item.title}</h2><p>{item.summary}</p><small>阅读全文 <ArrowRight size={14} /></small></a>)}</div>}</section></SiteLayout>
}

function MethodologyPage() {
  return <SiteLayout path="/methodology/"><PageIntro eyebrow="METHODOLOGY" title="四维模型与本地计分" lead="把实现边界讲清楚，比把测试包装成确定答案更重要。" /><article className="prose-page shell"><section><h2>现行正式版本</h2><p>题库版本 <code>tt16-q20-1.0.0</code>，计分版本 <code>tt16-score20-1.0.0</code>，内容版本 <code>tt16-content-2.0.0</code>。20 题包括 16 道维度题、2 道压力情境题和 2 道平行情境检查题。</p></section><section><h2>四个连续维度</h2><p>每道维度题使用五档选择，按方向与固定权重累计，再转换为两端合计 100% 的连续结果。四字母代码只是方便阅读的索引；接近 50/50 时会明确标记边界。</p></section><section><h2>快速猜型是独立娱乐模式</h2><p>快速猜型使用 <code>tt16-guess-items-1.0.0</code> 的 200 条独立情境和 <code>tt16-guess-policy-1.0.0</code> 的本地选题策略。它维护 16 个候选的内部权重，每次选择预期信息增益较高的问题，并在证据达到门槛时主动询问“是这个类型吗”。内部权重没有经过真实人群校准，所以界面只显示“把握较高”或“仍在犹豫”，不展示准确率百分比。</p></section><section><h2>压力题不参与类型代码</h2><p>踏空与回撤两项只用于提供独立的压力反应提醒。选择“未经历”不会阻止报告生成，也不会被推断成某种人格。</p></section><section><h2>质量与限制</h2><p>正式测试的完整状态不等于心理测量信效度认证；快速猜型的合成模拟也只用于代码防回归，不代表真实用户准确率。项目不宣称能预测收益或改善投资表现。</p></section><section><h2>本地处理</h2><p>浏览器直接加载公开题库并在本机计算。正式答案、快速猜型轨迹和候选权重都不会发送给 TT16；清除站点数据即可删除本地进度。</p></section><BoundaryNotice /></article></SiteLayout>
}

function PrivacyPage() {
  return <SiteLayout path="/privacy/"><PageIntro eyebrow="PRIVACY" title="隐私最小化，从默认关闭开始" lead="无需账户，不连接券商，不建立用户画像。答案与报告默认只存在当前设备。" /><article className="prose-page shell"><section><h2>答题与本地存储</h2><p>TT16 使用 <code>tt16:assessment:v2</code> 保存正式答题进度和本地报告状态，并自动迁移旧版 <code>tt16:free:v1</code>；快速猜型使用独立的 <code>tt16:guess:v1</code> 保存随机种子、题目回答、猜测确认和本地候选摘要。损坏或版本不兼容的数据会被忽略，二者不会互相改写。</p></section><section><h2>快速猜型不进入统计</h2><p>快速猜型页面不调用匿名统计，也不发送题目编号、回答、被猜类型、候选权重或接受与否。当前版本没有学习接口，用户确认只影响本机会话，不会在线更新公共模型。</p></section><section><h2>其他页面的自愿匿名统计</h2><p>首次访问可选择是否参与。拒绝、开启“请勿跟踪”（DNT）或缺少统计配置时，不发出统计请求。允许后只发送页面、来源域名和固定事件：开始、完成、打开分享、保存分享卡、打开对照和打开打印；不发送答案、人格代码、维度百分比、自由文本或持久访客标识。</p></section><section><h2>广告边界</h2><p>广告默认关闭。未来仅允许在人格图鉴中段、人格详情末尾、对照末尾与工具末尾出现；首页主视觉、正式答题、快速猜型、生成过程、报告核心区和分享卡永不放广告。广告失败不会影响任何内容。</p></section><section><h2>删除数据</h2><p>清除浏览器中本网站的站点数据即可移除正式答题、快速猜型与统计选择。TT16 不要求姓名、手机号、身份证、券商凭证、持仓、收入、债务或风险承受能力信息。</p></section></article></SiteLayout>
}

function AboutPage() {
  return <SiteLayout path="/about/"><PageIntro eyebrow="ABOUT TT16" title="一份免费的决策风格使用说明" lead={MARKETING_COPY.project.long} /><article className="prose-page shell"><section><h2>我们做什么</h2><p>TT16 把研究或信号、持有或交易、防守或进攻、计划或灵活四组偏好组合成 16 种公开人格。标准 20 题生成连续维度报告；快速猜型则用动态问答提供独立的娱乐入口。</p></section><section><h2>我们不做什么</h2><p>不推荐证券、不承诺收益、不评价能力、不诊断心理状态，也不收集个人财务与券商数据。TT16 与 MBTI、Myers-Briggs、Akinator、券商或交易所没有关联。</p></section><section><h2>永久免费与开源</h2><p>快速猜型、正式测试、完整报告、图鉴、对照、指南、A4 单页、分享卡和 Open Graph 图片全部免费。项目使用 AGPL-3.0-only 许可证开放对应源码；未来广告只补贴运营，不形成解锁门槛。</p></section><section><h2>为什么做微信小程序</h2><p>主要用户使用中文并重视微信内分享，因此 Web 内容和微信小程序共用同一套无平台依赖核心。快速猜型先在 Web 验证交互，小程序后续复用同一算法，不另建第二套判断逻辑。</p></section><a className="button button--dark" href="https://github.com/wzxsph/TT16" target="_blank" rel="noreferrer">查看 GitHub 源码 <ExternalLink size={16} /></a></article></SiteLayout>
}

function PrintProfile({ code }: { code: TypeCode }) {
  const profile = PROFILES[code]
  const printNow = () => { trackEvent('print_open'); window.print() }
  return <main className="print-profile"><header><div><strong>TT16</strong><span>{code} · {profile.group}</span></div><button onClick={printNow}><Printer size={16} />打印 / 存为 PDF</button></header><section><div><p className="eyebrow">A4 PERSONALITY SHEET</p><h1>{profile.name}</h1><h2>{profile.tagline}</h2><div className="keyword-row">{profile.keywords.map((item) => <span key={item}>{item}</span>)}</div><p>{profile.description}</p></div><img src={portrait(code)} alt={`${profile.name}插画`} /></section><div className="print-grid"><article><h3>决策循环</h3><ol><li>{profile.decisionLoop.observe}</li><li>{profile.decisionLoop.decide}</li><li>{profile.decisionLoop.act}</li><li>{profile.decisionLoop.review}</li></ol></article><article><h3>优势 / 过度使用</h3>{profile.traitPairs.map((item) => <p key={item.strength}><strong>{item.strength}</strong><span>{item.overuse}</span></p>)}</article><article><h3>压力重置</h3><p>{profile.pressurePattern.pattern}</p><ol>{profile.pressurePattern.resetSteps.map((item) => <li key={item}>{item}</li>)}</ol></article><article><h3>五条守则</h3><ol>{profile.rules.map((item) => <li key={item}>{item}</li>)}</ol></article></div><footer>TT16 仅描述决策偏好，不评价投资能力，不构成投资建议、收益承诺、风险评估或心理诊断。 · tt16-content-2.0.0</footer></main>
}

function NotFound() {
  return <SiteLayout path="/404/"><section className="not-found shell"><span>404</span><h1>这一页还没有内容</h1><p>回到公开人格图鉴，或开始 20 题本地测试。</p><div><a className="button button--dark" href={sitePath('/types/')}>浏览图鉴</a><a className="button button--ghost" href={sitePath('/test/')}>开始测试</a></div></section></SiteLayout>
}

export function ContentPage({ pathname }: { pathname: string }) {
  const path = normalizeRoute(pathname)
  if (path === '/types/') return <TypesIndex />
  if (path === '/dimensions/') return <DimensionsPage />
  if (path === '/compare/') return <ComparePage />
  if (path === '/tools/review/') return <ReviewTool />
  if (path === '/guides/') return <GuidesPage />
  if (path === '/methodology/') return <MethodologyPage />
  if (path === '/privacy/') return <PrivacyPage />
  if (path === '/about/') return <AboutPage />
  const typeMatch = path.match(/^\/types\/([A-Z]{4})\/(print\/)?$/)
  if (typeMatch && isTypeCode(typeMatch[1])) return typeMatch[2] ? <PrintProfile code={typeMatch[1]} /> : <ProfileDetail code={typeMatch[1]} />
  const groupMatch = path.match(/^\/groups\/([^/]+)\/$/)
  if (groupMatch) return <GroupsPage slug={groupMatch[1]} />
  const dimensionMatch = path.match(/^\/dimensions\/([^/]+)\/$/)
  if (dimensionMatch) return <DimensionsPage slug={dimensionMatch[1]} />
  const guideMatch = path.match(/^\/guides\/([^/]+)\/$/)
  if (guideMatch) return <GuidesPage slug={guideMatch[1]} />
  return <NotFound />
}
