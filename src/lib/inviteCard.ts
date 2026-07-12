function roundRect(
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

export function downloadInviteCard(): void {
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1080
  const context = canvas.getContext('2d')
  if (!context) return

  const gradient = context.createLinearGradient(0, 0, 1080, 1080)
  gradient.addColorStop(0, '#f7f3e9')
  gradient.addColorStop(1, '#e6eee7')
  context.fillStyle = gradient
  context.fillRect(0, 0, 1080, 1080)

  context.fillStyle = '#eee9f7'
  context.beginPath()
  context.arc(930, 145, 300, 0, Math.PI * 2)
  context.fill()
  context.fillStyle = '#d9e9e1'
  context.beginPath()
  context.arc(120, 985, 250, 0, Math.PI * 2)
  context.fill()

  context.fillStyle = '#26343a'
  context.font = '800 44px "Avenir Next", Arial, sans-serif'
  context.fillText('TT16', 82, 105)
  context.fillStyle = '#68777a'
  context.font = '500 26px "Noto Sans SC", sans-serif'
  context.fillText('交易人格十六型', 208, 105)

  context.fillStyle = '#2f746c'
  context.font = '800 24px "Avenir Next", Arial, sans-serif'
  context.fillText('MY REPORT IS READY', 82, 270)

  context.fillStyle = '#26343a'
  context.font = '700 88px "Noto Serif SC", "Songti SC", serif'
  context.fillText('我的 TT16', 78, 390)
  context.fillText('报告已生成', 78, 500)

  context.fillStyle = '#59686c'
  context.font = '500 34px "Noto Sans SC", sans-serif'
  context.fillText('20 道真实交易情境', 82, 590)
  context.fillText('看看你会是哪一种交易人格？', 82, 642)

  context.fillStyle = '#fffdf8'
  roundRect(context, 76, 738, 928, 214, 40)
  context.fill()
  context.fillStyle = '#725a9f'
  context.font = '800 46px "Avenir Next", Arial, sans-serif'
  context.fillText('••••', 124, 820)
  context.fillStyle = '#26343a'
  context.font = '700 30px "Noto Sans SC", sans-serif'
  context.fillText('结果保持私密 · 邀请卡不含人格信息', 124, 878)
  context.fillStyle = '#778387'
  context.font = '500 22px "Noto Sans SC", sans-serif'
  context.fillText('娱乐自评 · 非投资建议 · 一次购买不自动续费', 124, 920)

  const anchor = document.createElement('a')
  anchor.download = 'TT16-invite-card.png'
  anchor.href = canvas.toDataURL('image/png', 1)
  anchor.click()
}
