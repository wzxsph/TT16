import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = process.cwd()
const MASTER_DIR = path.join(ROOT, 'design/personality-masters')
const WEB_DIR = path.join(ROOT, 'public/images/personalities')
const CONTACT_SHEET = path.join(ROOT, 'design/personality-contact-sheet.jpg')

const PERSONALITIES = [
  ['RHDP', '复利园丁'],
  ['RHDF', '价值守望者'],
  ['RHAP', '高确信舵手'],
  ['RHAF', '信仰船长'],
  ['RTDP', '财报工程师'],
  ['RTDF', '事件雷达'],
  ['RTAP', '预期差狙击手'],
  ['RTAF', '错杀猎手'],
  ['SHDP', '趋势配置师'],
  ['SHDF', '轮动领航员'],
  ['SHAP', '赛道骑士'],
  ['SHAF', '主题追光者'],
  ['STDP', '系统波段手'],
  ['STDF', '盘面游侠'],
  ['STAP', '突破狙击手'],
  ['STAF', '火箭驾驶员'],
]

const TILE = 360
const LABEL_HEIGHT = 56
const COLUMNS = 4
const ROWS = 4

await mkdir(WEB_DIR, { recursive: true })

const tiles = await Promise.all(
  PERSONALITIES.map(async ([code, name]) => {
    const input = path.join(MASTER_DIR, `${code}.png`)
    const output = path.join(WEB_DIR, `${code}.webp`)

    await sharp(input)
      .resize(900, 900, { fit: 'cover', position: 'centre' })
      .webp({ quality: 86, effort: 6, smartSubsample: true })
      .toFile(output)

    const portrait = await sharp(input)
      .resize(TILE, TILE, { fit: 'cover', position: 'centre' })
      .jpeg({ quality: 88, chromaSubsampling: '4:4:4' })
      .toBuffer()

    const label = Buffer.from(`
      <svg width="${TILE}" height="${LABEL_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#fffdf8"/>
        <text x="18" y="35" fill="#26343a" font-size="20" font-weight="700"
          font-family="Noto Sans CJK SC, PingFang SC, Microsoft YaHei, sans-serif">${code} · ${name}</text>
      </svg>
    `)

    return sharp({
      create: {
        width: TILE,
        height: TILE + LABEL_HEIGHT,
        channels: 3,
        background: '#fffdf8',
      },
    })
      .composite([
        { input: portrait, top: 0, left: 0 },
        { input: label, top: TILE, left: 0 },
      ])
      .jpeg({ quality: 90, chromaSubsampling: '4:4:4' })
      .toBuffer()
  }),
)

await sharp({
  create: {
    width: TILE * COLUMNS,
    height: (TILE + LABEL_HEIGHT) * ROWS,
    channels: 3,
    background: '#e7e0d3',
  },
})
  .composite(
    tiles.map((input, index) => ({
      input,
      left: (index % COLUMNS) * TILE,
      top: Math.floor(index / COLUMNS) * (TILE + LABEL_HEIGHT),
    })),
  )
  .jpeg({ quality: 88, chromaSubsampling: '4:4:4' })
  .toFile(CONTACT_SHEET)

console.log(`Prepared ${PERSONALITIES.length} WebP assets and ${CONTACT_SHEET}`)
