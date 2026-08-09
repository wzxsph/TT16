import Taro from '@tarojs/taro'
import type { ShareCardModel } from '@tt16/core'

export async function saveSharePoster(canvasId: string, model: ShareCardModel): Promise<void> {
  let portraitReady = false
  try {
    await new Promise<void>((resolve, reject) => {
      wx.loadSubpackage({ name: 'content', success: resolve, fail: reject })
    })
    portraitReady = true
  } catch {
    // The poster remains complete with a geometric fallback if the subpackage cannot load.
  }
  const context = Taro.createCanvasContext(canvasId)
  context.setFillStyle('#f7f3e9')
  context.fillRect(0, 0, 600, 900)
  context.setFillStyle('#e3f2ec')
  context.beginPath()
  context.arc(520, 90, 190, 0, Math.PI * 2)
  context.fill()
  context.setFillStyle('#26343a')
  context.setFontSize(28)
  context.fillText('TT16 · 交易人格十六型', 44, 62)
  context.setFillStyle('#2f746c')
  context.setFontSize(58)
  context.fillText(model.code, 44, 156)
  context.setFillStyle('#26343a')
  context.setFontSize(48)
  context.fillText(model.name, 44, 224)
  context.setFontSize(23)
  context.setFillStyle('#58686c')
  context.fillText(model.tagline.slice(0, 20), 44, 274)
  context.setFillStyle('#eee9f7')
  context.fillRect(350, 88, 202, 202)
  if (portraitReady) {
    context.drawImage(`/content/assets/personalities-v2/${model.code}.webp`, 356, 94, 190, 190)
  } else {
    context.setFillStyle('#725a9f')
    context.beginPath()
    context.moveTo(451, 120)
    context.lineTo(526, 208)
    context.lineTo(476, 268)
    context.lineTo(382, 224)
    context.closePath()
    context.fill()
    context.setFillStyle('#377d6d')
    context.beginPath()
    context.moveTo(382, 224)
    context.lineTo(451, 120)
    context.lineTo(451, 258)
    context.closePath()
    context.fill()
  }
  context.setFillStyle('#fffdf8')
  context.fillRect(34, 335, 532, 350)
  model.dimensions.forEach((dimension, index) => {
    const y = 410 + index * 72
    context.setFillStyle('#2f746c')
    context.setFontSize(28)
    context.fillText(dimension.letter, 62, y)
    context.setFillStyle('#526166')
    context.setFontSize(19)
    context.fillText(dimension.label, 108, y)
    context.setFillStyle('#e3e0d8')
    context.fillRect(265, y - 20, 220, 14)
    context.setFillStyle('#2f746c')
    context.fillRect(265, y - 20, 220 * dimension.percent / 100, 14)
    context.setFillStyle('#26343a')
    context.fillText(`${dimension.percent}%`, 500, y)
  })
  context.setFillStyle('#66757a')
  context.setFontSize(18)
  context.fillText('本地生成 · 不含逐题答案或用户标识', 44, 780)
  context.fillText('描述偏好 · 不荐股 · 不排名 · 不诊断', 44, 820)
  context.draw(false, () => {
    Taro.canvasToTempFilePath({ canvasId, width: 600, height: 900, destWidth: 1200, destHeight: 1800 })
      .then(({ tempFilePath }) => Taro.saveImageToPhotosAlbum({ filePath: tempFilePath }))
      .then(() => Taro.showToast({ title: '已保存到相册', icon: 'success' }))
      .catch(() => Taro.showModal({ title: '保存未完成', content: '请在微信设置中允许保存到相册，或使用右上角分享。', showCancel: false }))
  })
}
