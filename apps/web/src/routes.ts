import {
  DIMENSIONS,
  GROUPS,
  GUIDES,
  PROFILE_CODES,
  PROFILES,
  isTypeCode,
} from '@tt16/core'

export interface PageMeta {
  title: string
  description: string
  path: string
  imagePath: string
  noindex?: boolean
  breadcrumbs: readonly { name: string; path: string }[]
}

const ROOT_META: PageMeta = {
  title: 'TT16 · 交易人格十六型',
  description: '20 个真实交易情境，认识你的判断、周期、风险表达与执行方式。20 题、完整报告与分享素材全部免费。',
  path: '/',
  imagePath: '/images/og/site.png',
  breadcrumbs: [],
}

export const INDEXABLE_ROUTES = [
  '/',
  '/types/',
  ...PROFILE_CODES.map((code) => `/types/${code}/`),
  ...GROUPS.map((group) => `/groups/${group.slug}/`),
  '/dimensions/',
  ...DIMENSIONS.map((dimension) => `/dimensions/${dimension.slug}/`),
  '/compare/',
  '/tools/review/',
  '/guides/',
  ...GUIDES.map((guide) => `/guides/${guide.slug}/`),
  '/methodology/',
  '/privacy/',
  '/about/',
] as const

export const NOINDEX_ROUTES = [
  '/test/',
  '/result/',
  '/guess/',
  ...PROFILE_CODES.map((code) => `/types/${code}/print/`),
] as const

export const PRERENDER_ROUTES = [...INDEXABLE_ROUTES, ...NOINDEX_ROUTES]

export function normalizeRoute(pathname: string): string {
  const configuredBase = import.meta.env.BASE_URL.replace(/\/$/, '')
  let path = pathname.split('?')[0].split('#')[0] || '/'
  if (configuredBase && configuredBase !== '/' && path.startsWith(configuredBase)) {
    path = path.slice(configuredBase.length) || '/'
  }
  if (!path.startsWith('/')) path = `/${path}`
  if (path !== '/' && !path.endsWith('/')) path += '/'
  return path
}

export function getPageMeta(pathname: string): PageMeta {
  const path = normalizeRoute(pathname)
  if (path === '/') return ROOT_META
  if (path === '/test/') return { ...ROOT_META, title: '开始测试 · TT16', description: '在当前设备完成 20 道交易情境题；答案只保存在本机。', path, noindex: true }
  if (path === '/result/') return { ...ROOT_META, title: '我的本地报告 · TT16', description: '仅在当前设备可见的 TT16 本地人格报告。', path, noindex: true }
  if (path === '/guess/') return { ...ROOT_META, title: '让 TT16 猜猜你 · 快速猜型', description: '用动态问题让 TT16 猜测你更像哪种交易人格；纯本地运行，仅供娱乐和自我观察。', path, noindex: true }
  if (path === '/types/') return { ...ROOT_META, title: '16 型人格图鉴 · TT16', description: '公开浏览 TT16 全部 16 种交易决策风格，了解优势、盲点、压力模式与行动守则。', path, breadcrumbs: [{ name: '首页', path: '/' }, { name: '人格图鉴', path }] }
  if (path === '/dimensions/') return { ...ROOT_META, title: '四个决策维度 · TT16', description: '研究与信号、持有与交易、防守与进攻、计划与灵活：四组连续偏好，不做高低排名。', path, breadcrumbs: [{ name: '首页', path: '/' }, { name: '四个维度', path }] }
  if (path === '/compare/') return { ...ROOT_META, title: '双类型中性对照 · TT16', description: '对照任意两种 TT16 风格的共同倾向、分歧维度和沟通提醒，不生成匹配分。', path, breadcrumbs: [{ name: '首页', path: '/' }, { name: '类型对照', path }] }
  if (path === '/tools/review/') return { ...ROOT_META, title: '五分钟复盘检查 · TT16', description: '无需填写证券、金额或自由文本，用一张本地检查表复盘信息、时间、风险和执行。', path, breadcrumbs: [{ name: '首页', path: '/' }, { name: '复盘工具', path }] }
  if (path === '/guides/') return { ...ROOT_META, title: '方法指南 · TT16', description: '六篇简明指南，帮助你阅读人格报告、理解边界结果、分开偏好与压力并完成复盘。', path, breadcrumbs: [{ name: '首页', path: '/' }, { name: '方法指南', path }] }
  if (path === '/methodology/') return { ...ROOT_META, title: '模型与计分方法 · TT16', description: '了解 TT16 的四维模型、20 题本地计分、边界处理与明确的非诊断边界。', path, breadcrumbs: [{ name: '首页', path: '/' }, { name: '模型方法', path }] }
  if (path === '/privacy/') return { ...ROOT_META, title: '隐私说明 · TT16', description: 'TT16 本地保存与评分答案；匿名统计自愿开启，且不发送答案、人格结果或持久访客标识。', path, breadcrumbs: [{ name: '首页', path: '/' }, { name: '隐私说明', path }] }
  if (path === '/about/') return { ...ROOT_META, title: '关于 TT16', description: 'TT16 是开源、移动优先、永久免费且不提供投资建议的交易行为人格项目。', path, breadcrumbs: [{ name: '首页', path: '/' }, { name: '关于', path }] }

  const typeMatch = path.match(/^\/types\/([A-Z]{4})\/(print\/)?$/)
  if (typeMatch && isTypeCode(typeMatch[1])) {
    const code = typeMatch[1]
    const profile = PROFILES[code]
    const printable = Boolean(typeMatch[2])
    return {
      title: `${code} ${profile.name} · TT16 人格图鉴`,
      description: `${profile.tagline}。查看 ${profile.name} 的关键词、决策循环、优势与盲点、压力重置动作和协作提醒。`,
      path,
      imagePath: `/images/og/${code}.png`,
      noindex: printable,
      breadcrumbs: [
        { name: '首页', path: '/' },
        { name: '人格图鉴', path: '/types/' },
        { name: `${code} ${profile.name}`, path: `/types/${code}/` },
      ],
    }
  }

  const group = GROUPS.find((item) => path === `/groups/${item.slug}/`)
  if (group) return { ...ROOT_META, title: `${group.name} · TT16 四大族群`, description: `${group.tagline}${group.description}`, path, breadcrumbs: [{ name: '首页', path: '/' }, { name: '人格图鉴', path: '/types/' }, { name: group.name, path }] }

  const dimension = DIMENSIONS.find((item) => path === `/dimensions/${item.slug}/`)
  if (dimension) return { ...ROOT_META, title: `${dimension.title}维度 · TT16`, description: `${dimension.question}${dimension.left.description}${dimension.right.description}`, path, breadcrumbs: [{ name: '首页', path: '/' }, { name: '四个维度', path: '/dimensions/' }, { name: dimension.title, path }] }

  const guide = GUIDES.find((item) => path === `/guides/${item.slug}/`)
  if (guide) return { ...ROOT_META, title: `${guide.title} · TT16 指南`, description: guide.summary, path, breadcrumbs: [{ name: '首页', path: '/' }, { name: '方法指南', path: '/guides/' }, { name: guide.title, path }] }

  return { ...ROOT_META, title: '页面未找到 · TT16', description: '这个页面不存在，返回 TT16 首页或人格图鉴继续浏览。', path, noindex: true }
}

export function sitePath(path: string): string {
  const base = import.meta.env.BASE_URL
  return `${base}${path.replace(/^\//, '')}`
}
