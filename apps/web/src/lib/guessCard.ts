import type { GuessCardModel } from '@tt16/core/guess'

const palette = {
  RH: { accent: '#725a9f', pale: '#eee9f7', second: '#cbbde0' },
  RT: { accent: '#b96052', pale: '#fae9e4', second: '#edb4a6' },
  SH: { accent: '#377d6d', pale: '#e3f2ec', second: '#a6d2c3' },
  ST: { accent: '#b67f24', pale: '#faefcf', second: '#e8c97f' },
} as const

function rounded(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath()
  context.roundRect(x, y, width, height, radius)
}

function wrap(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
  lineHeight: number,
  maximumLines: number,
) {
  const characters = Array.from(text)
  const lines: string[] = []
  let current = ''
  for (const character of characters) {
    if (current && context.measureText(`${current}${character}`).width > width) {
      lines.push(current)
      current = character
      if (lines.length >= maximumLines) break
    } else {
      current += character
    }
  }
  if (current && lines.length < maximumLines) lines.push(current)
  lines.forEach((line, index) => context.fillText(line, x, y + index * lineHeight))
}

async function loadPortrait(url: string): Promise<HTMLImageElement> {
  const image = new Image()
  image.decoding = 'async'
  image.src = url
  await image.decode()
  return image
}

export async function renderGuessCard(model: GuessCardModel, portraitUrl: string): Promise<HTMLCanvasElement | null> {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1080
  const context = canvas.getContext('2d')
  if (!context) return null
  const colors = palette[model.code.slice(0, 2) as keyof typeof palette]

  context.fillStyle = '#f7f3e9'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = colors.pale
  context.beginPath()
  context.arc(950, 145, 330, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = colors.second
  context.globalAlpha = 0.35
  context.beginPath()
  context.arc(75, 980, 230, 0, Math.PI * 2)
  context.fill()
  context.globalAlpha = 1

  context.fillStyle = '#26343a'
  context.font = '800 39px "Avenir Next", Arial, sans-serif'
  context.fillText('TT16', 76, 88)
  context.fillStyle = colors.accent
  context.font = '700 25px "Noto Sans SC", sans-serif'
  context.fillText(model.label, 204, 87)

  context.fillStyle = colors.accent
  context.font = '800 68px "Avenir Next", Arial, sans-serif'
  context.fillText(model.code, 76, 202)
  context.fillStyle = '#26343a'
  context.font = '700 88px "Noto Serif SC", "Songti SC", serif'
  context.fillText(model.name, 72, 304)
  context.fillStyle = '#5f6c70'
  context.font = '500 30px "Noto Sans SC", sans-serif'
  wrap(context, model.tagline, 76, 364, 455, 43, 2)

  try {
    const portrait = await loadPortrait(portraitUrl)
    rounded(context, 585, 128, 420, 420, 34)
    context.fillStyle = colors.pale
    context.fill()
    context.save()
    rounded(context, 585, 128, 420, 420, 34)
    context.clip()
    context.drawImage(portrait, 600, 143, 390, 390)
    context.restore()
  } catch {
    rounded(context, 585, 128, 420, 420, 34)
    context.fillStyle = colors.pale
    context.fill()
    context.fillStyle = colors.accent
    context.font = '800 110px "Avenir Next", Arial, sans-serif'
    context.textAlign = 'center'
    context.fillText(model.code, 795, 370)
    context.textAlign = 'left'
  }

  rounded(context, 64, 590, 952, 328, 34)
  context.fillStyle = '#fffdf8'
  context.fill()
  context.fillStyle = '#7c8789'
  context.font = '700 21px "Noto Sans SC", sans-serif'
  context.fillText('为什么这样猜', 102, 650)
  model.reasons.forEach((reason, index) => {
    context.fillStyle = colors.accent
    context.beginPath()
    context.arc(118, 723 + index * 88, 20, 0, Math.PI * 2)
    context.fill()
    context.fillStyle = '#fff'
    context.font = '800 19px Arial, sans-serif'
    context.textAlign = 'center'
    context.fillText(String(index + 1), 118, 730 + index * 88)
    context.textAlign = 'left'
    context.fillStyle = '#26343a'
    context.font = '600 29px "Noto Sans SC", sans-serif'
    context.fillText(reason, 162, 732 + index * 88)
  })

  context.fillStyle = '#778184'
  context.font = '500 19px "Noto Sans SC", sans-serif'
  context.fillText('纯本地娱乐猜测 · 正式报告请完成标准 20 题', 76, 991)
  context.textAlign = 'right'
  context.fillText('tt16', 1004, 991)
  context.textAlign = 'left'
  return canvas
}

export async function downloadGuessCard(model: GuessCardModel, portraitUrl: string): Promise<void> {
  const canvas = await renderGuessCard(model, portraitUrl)
  if (!canvas) return
  const anchor = document.createElement('a')
  anchor.download = `TT16-快速猜型-${model.code}.png`
  anchor.href = canvas.toDataURL('image/png', 1)
  anchor.click()
}
