import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'
import { PROFILE_LIST, type ProfileGroup } from '../packages/core/src/profiles.ts'

const root = fileURLToPath(new URL('..', import.meta.url))
const outputDir = path.join(root, 'public', 'images', 'og')
const portraitDir = path.join(root, 'public', 'images', 'personalities-v2')

const palette: Record<ProfileGroup, { accent: string; pale: string; second: string }> = {
  企业复利族: { accent: '#725a9f', pale: '#eee9f7', second: '#b9a7d4' },
  预期差猎手族: { accent: '#b96052', pale: '#fae9e4', second: '#e6a493' },
  趋势赛道族: { accent: '#377d6d', pale: '#e3f2ec', second: '#8fc4b2' },
  盘面动量族: { accent: '#b67f24', pale: '#faefcf', second: '#e1b966' },
}

const escapeXml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

function profileSvg(profile: (typeof PROFILE_LIST)[number]) {
  const colors = palette[profile.group]
  return Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#f7f3e9"/>
    <circle cx="1055" cy="95" r="280" fill="${colors.pale}"/>
    <circle cx="85" cy="615" r="170" fill="${colors.second}" opacity=".38"/>
    <rect x="52" y="48" width="1096" height="534" rx="32" fill="#fffdf8" stroke="#e2ddd2"/>
    <text x="92" y="112" font-family="Arial,sans-serif" font-size="31" font-weight="800" fill="#26343a">TT16</text>
    <text x="190" y="112" font-family="Noto Sans CJK SC,PingFang SC,sans-serif" font-size="19" font-weight="600" fill="#66757a">交易人格十六型</text>
    <text x="92" y="218" font-family="Arial,sans-serif" font-size="78" font-weight="800" letter-spacing="-3" fill="${colors.accent}">${profile.code}</text>
    <text x="88" y="305" font-family="Noto Serif CJK SC,Songti SC,serif" font-size="64" font-weight="700" fill="#26343a">${escapeXml(profile.name)}</text>
    <text x="92" y="356" font-family="Noto Sans CJK SC,PingFang SC,sans-serif" font-size="23" font-weight="600" fill="#526166">${escapeXml(profile.tagline)}</text>
    <rect x="92" y="402" width="132" height="38" rx="19" fill="${colors.pale}"/><text x="158" y="427" text-anchor="middle" font-family="Noto Sans CJK SC,sans-serif" font-size="16" font-weight="700" fill="${colors.accent}">${escapeXml(profile.keywords[0])}</text>
    <rect x="234" y="402" width="132" height="38" rx="19" fill="${colors.pale}"/><text x="300" y="427" text-anchor="middle" font-family="Noto Sans CJK SC,sans-serif" font-size="16" font-weight="700" fill="${colors.accent}">${escapeXml(profile.keywords[1])}</text>
    <rect x="376" y="402" width="132" height="38" rx="19" fill="${colors.pale}"/><text x="442" y="427" text-anchor="middle" font-family="Noto Sans CJK SC,sans-serif" font-size="16" font-weight="700" fill="${colors.accent}">${escapeXml(profile.keywords[2])}</text>
    <text x="92" y="516" font-family="Noto Sans CJK SC,PingFang SC,sans-serif" font-size="16" fill="#7a8587">描述决策偏好 · 不荐股 · 不排名 · 不诊断</text>
    <text x="92" y="548" font-family="Arial,sans-serif" font-size="14" font-weight="700" fill="#9aa2a2">TT16 · FREE &amp; OPEN SOURCE</text>
  </svg>`)
}

function siteSvg() {
  return Buffer.from(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#f7f3e9"/>
    <circle cx="1030" cy="80" r="330" fill="#e3f2ec"/><circle cx="40" cy="650" r="260" fill="#eee9f7"/>
    <text x="80" y="122" font-family="Arial,sans-serif" font-size="36" font-weight="800" fill="#26343a">TT16</text>
    <text x="80" y="270" font-family="Noto Serif CJK SC,Songti SC,serif" font-size="76" font-weight="700" fill="#26343a">你是哪一种</text>
    <text x="80" y="365" font-family="Noto Serif CJK SC,Songti SC,serif" font-size="82" font-weight="700" fill="#2f746c">交易人格？</text>
    <text x="84" y="430" font-family="Noto Sans CJK SC,PingFang SC,sans-serif" font-size="25" fill="#526166">20 个真实交易情境 · 4 个连续维度 · 16 种原创人格</text>
    <rect x="84" y="484" width="332" height="54" rx="27" fill="#26343a"/>
    <text x="250" y="518" text-anchor="middle" font-family="Noto Sans CJK SC,sans-serif" font-size="19" font-weight="700" fill="#fff">完整内容永久免费 · 本地评分</text>
    <g transform="translate(755 152)"><polygon points="190,0 380,110 300,330 80,330 0,110" fill="#fffdf8" stroke="#d9d3c8" stroke-width="4"/><polygon points="190,35 285,174 190,294 92,172" fill="#725a9f" opacity=".8"/><polygon points="190,35 350,112 285,174" fill="#b96052" opacity=".82"/><polygon points="92,172 190,294 45,112" fill="#377d6d" opacity=".82"/><polygon points="285,174 190,294 335,286" fill="#b67f24" opacity=".82"/><circle cx="190" cy="174" r="31" fill="#fffdf8" stroke="#26343a" stroke-width="4"/></g>
  </svg>`)
}

await mkdir(outputDir, { recursive: true })
await sharp(siteSvg()).png({ compressionLevel: 9 }).toFile(path.join(outputDir, 'site.png'))

for (const profile of PROFILE_LIST) {
  const portrait = await sharp(path.join(portraitDir, `${profile.code}.webp`)).resize(430, 430, { fit: 'contain' }).png().toBuffer()
  await sharp(profileSvg(profile))
    .composite([{ input: portrait, left: 708, top: 122 }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, `${profile.code}.png`))
}

console.log(`Generated ${PROFILE_LIST.length + 1} Open Graph images in ${path.relative(root, outputDir)}`)
