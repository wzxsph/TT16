export type ShareDimension = {
  letter: string
  label: string
  percent: number
}

type ShareCardInput = {
  code: string
  name: string
  tagline: string
  group: 'RH' | 'RT' | 'SH' | 'ST'
  dimensions: ShareDimension[]
  format: 'square' | 'story'
  imageUrl?: string
}

const palette = {
  RH: { accent: '#725a9f', pale: '#eee9f7', second: '#b9a7d4' },
  RT: { accent: '#b96052', pale: '#fae9e4', second: '#e6a493' },
  SH: { accent: '#377d6d', pale: '#e3f2ec', second: '#8fc4b2' },
  ST: { accent: '#b67f24', pale: '#faefcf', second: '#e1b966' },
} as const

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath()
  ctx.roundRect(x, y, width, height, radius)
}

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  startSize: number,
  minSize: number,
) {
  let size = startSize
  while (size > minSize) {
    ctx.font = `700 ${size}px "Noto Serif SC", "Songti SC", serif`
    if (ctx.measureText(text).width <= maxWidth) break
    size -= 2
  }
  return size
}

function drawCharacter(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  accent: string,
  second: string,
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(scale, scale)

  ctx.fillStyle = '#d8c8a8'
  ctx.beginPath()
  ctx.ellipse(0, 164, 168, 26, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = second
  ctx.beginPath()
  ctx.moveTo(-166, 132)
  ctx.quadraticCurveTo(0, 230, 176, 112)
  ctx.lineTo(120, 188)
  ctx.lineTo(-118, 188)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = '#26343a'
  ctx.lineWidth = 9
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(0, -68)
  ctx.lineTo(0, 116)
  ctx.stroke()
  ctx.fillStyle = '#fffdf8'
  ctx.beginPath()
  ctx.moveTo(8, -60)
  ctx.lineTo(118, 20)
  ctx.lineTo(8, 52)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#deb08c'
  ctx.beginPath()
  ctx.arc(-28, 8, 34, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#293b42'
  ctx.beginPath()
  ctx.arc(-33, -2, 35, Math.PI, 0)
  ctx.fill()
  ctx.fillStyle = accent
  roundRect(ctx, -72, 44, 92, 104, 26)
  ctx.fill()

  ctx.strokeStyle = '#293b42'
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.moveTo(-28, 70)
  ctx.lineTo(34, 42)
  ctx.lineTo(84, -6)
  ctx.stroke()
  ctx.strokeStyle = accent
  ctx.lineWidth = 15
  ctx.beginPath()
  ctx.arc(84, -8, 28, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

async function loadImage(url: string) {
  const image = new Image()
  image.decoding = 'async'
  image.src = url
  await image.decode()
  return image
}

function drawPortrait(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  size: number,
) {
  ctx.save()
  roundRect(ctx, x, y, size, size, size * 0.16)
  ctx.clip()
  ctx.drawImage(image, x, y, size, size)
  ctx.restore()
}

export async function downloadShareCard(input: ShareCardInput) {
  const story = input.format === 'story'
  const width = 1080
  const height = story ? 1920 : 1080
  const colors = palette[input.group]
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.fillStyle = '#f7f3e9'
  ctx.fillRect(0, 0, width, height)

  ctx.fillStyle = colors.pale
  ctx.beginPath()
  ctx.arc(920, story ? 240 : 130, story ? 370 : 270, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 0.5
  ctx.fillStyle = colors.second
  ctx.beginPath()
  ctx.arc(74, story ? 1590 : 922, story ? 260 : 180, 0, Math.PI * 2)
  ctx.fill()
  ctx.globalAlpha = 1

  ctx.fillStyle = '#26343a'
  ctx.font = '800 38px "Avenir Next", Arial, sans-serif'
  ctx.fillText('TT16', 88, 110)
  ctx.fillStyle = '#6f7a7d'
  ctx.font = '500 26px "Noto Sans SC", sans-serif'
  ctx.fillText('交易人格十六型', 202, 110)

  const top = story ? 242 : 186
  ctx.fillStyle = colors.accent
  ctx.font = '800 64px "Avenir Next", Arial, sans-serif'
  ctx.fillText(input.code, 88, top)

  ctx.fillStyle = '#26343a'
  const titleSize = fitText(ctx, input.name, 760, story ? 116 : 96, 68)
  ctx.font = `700 ${titleSize}px "Noto Serif SC", "Songti SC", serif`
  ctx.fillText(input.name, 84, top + (story ? 126 : 106))

  ctx.fillStyle = '#56666b'
  ctx.font = `500 ${story ? 38 : 32}px "Noto Sans SC", sans-serif`
  const taglineY = top + (story ? 205 : 170)
  ctx.fillText(input.tagline.slice(0, 24), 88, taglineY)

  if (input.imageUrl) {
    try {
      const portrait = await loadImage(input.imageUrl)
      drawPortrait(ctx, portrait, story ? 230 : 650, story ? 510 : 244, story ? 620 : 330)
    } catch {
      drawCharacter(ctx, story ? 540 : 785, story ? 830 : 450, story ? 1.65 : 1.08, colors.accent, colors.second)
    }
  } else {
    drawCharacter(ctx, story ? 540 : 785, story ? 830 : 450, story ? 1.65 : 1.08, colors.accent, colors.second)
  }

  const panelX = 70
  const panelY = story ? 1190 : 650
  const panelW = 940
  const panelH = story ? 480 : 326
  ctx.fillStyle = '#fffdf8'
  roundRect(ctx, panelX, panelY, panelW, panelH, 42)
  ctx.fill()

  input.dimensions.forEach((dimension, index) => {
    const y = panelY + 88 + index * (story ? 88 : 58)
    ctx.fillStyle = colors.accent
    ctx.font = `800 ${story ? 34 : 26}px "Avenir Next", sans-serif`
    ctx.fillText(dimension.letter, panelX + 54, y)
    ctx.fillStyle = '#526166'
    ctx.font = `500 ${story ? 28 : 22}px "Noto Sans SC", sans-serif`
    ctx.fillText(dimension.label, panelX + 112, y)

    const barX = panelX + (story ? 360 : 310)
    const barY = y - (story ? 25 : 18)
    const barW = story ? 470 : 520
    const barH = story ? 24 : 18
    ctx.fillStyle = '#e9e5dc'
    roundRect(ctx, barX, barY, barW, barH, barH / 2)
    ctx.fill()
    ctx.fillStyle = colors.accent
    roundRect(ctx, barX, barY, barW * (dimension.percent / 100), barH, barH / 2)
    ctx.fill()
    ctx.fillStyle = '#26343a'
    ctx.font = `700 ${story ? 28 : 22}px "Avenir Next", sans-serif`
    ctx.textAlign = 'right'
    ctx.fillText(`${dimension.percent}%`, panelX + panelW - 54, y)
    ctx.textAlign = 'left'
  })

  if (story) {
    ctx.fillStyle = '#26343a'
    ctx.font = '700 31px "Noto Sans SC", sans-serif'
    ctx.fillText('你的交易风格，也有自己的使用说明书。', 88, 1772)
    ctx.fillStyle = '#6f7a7d'
    ctx.font = '500 25px "Noto Sans SC", sans-serif'
    ctx.fillText('tt16 · 32 个真实交易情境 · 匿名测试', 88, 1824)
  } else {
    ctx.fillStyle = '#6f7a7d'
    ctx.font = '500 22px "Noto Sans SC", sans-serif'
    ctx.fillText('32 个真实交易情境 · 匿名测试', 704, 1032)
  }

  const dataUrl = canvas.toDataURL('image/png', 1)
  const anchor = document.createElement('a')
  anchor.download = `TT16-${input.code}-${input.format}.png`
  anchor.href = dataUrl
  anchor.click()
}
