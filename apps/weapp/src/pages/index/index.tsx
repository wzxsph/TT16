import { Button, Text, View } from '@tarojs/components'
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro'
import { useState } from 'react'
import { readAssessment } from '../../lib/storage'

export default function HomePage() {
  const [progress, setProgress] = useState({ count: 0, completed: false })
  useDidShow(() => {
    const stored = readAssessment()
    setProgress({ count: stored ? Object.keys(stored.answers).length : 0, completed: stored?.completed ?? false })
  })
  useShareAppMessage(() => ({ title: 'TT16｜20 道情境题，认识你的交易决策风格', path: '/pages/index/index' }))
  const start = () => Taro.navigateTo({ url: progress.completed ? '/pages/result/index' : '/pages/assessment/index' })
  return <View className="page home-page">
    <View className="mini-brand"><Text>TT16</Text><Text>交易人格十六型</Text></View>
    <View className="home-hero"><Text className="kicker">20 个真实交易情境 · 本地评分</Text><Text className="hero-title">你是哪一种{`\n`}交易人格？</Text><Text className="hero-lead">从判断依据、时间周期、风险表达与执行方式，认识自己的稳定偏好。</Text><View className="free-pill"><Text>完整内容永久免费</Text><Text>不上传逐题答案</Text></View><Button className="primary-button" onClick={start}>{progress.count > 0 ? (progress.completed ? '查看本机报告' : `继续测试 · ${progress.count}/20`) : '开始认识自己'}</Button><Text className="fine-print">约 3–5 分钟 · 无需注册 · 不构成投资建议</Text></View>
    <View className="home-grid"><Button onClick={() => Taro.navigateTo({ url: '/pages/atlas/index' })}><Text>16 型图鉴</Text><Text>公开浏览全部人格</Text></Button><Button onClick={() => Taro.navigateTo({ url: '/pages/compare/index' })}><Text>中性对照</Text><Text>看共同点与分歧维度</Text></Button><Button onClick={() => Taro.navigateTo({ url: '/pages/review/index' })}><Text>五分钟复盘</Text><Text>无自由文本的本地检查</Text></Button><Button onClick={() => Taro.navigateTo({ url: '/content/method/index' })}><Text>方法指南</Text><Text>理解模型与使用边界</Text></Button></View>
    <View className="boundary-card"><Text>TT16 描述决策偏好，不评价投资能力、收益、风险承受能力或适当性；不荐股、不排名、不诊断。</Text></View>
    <View className="mini-footer"><Button onClick={() => Taro.navigateTo({ url: '/pages/privacy/index' })}>隐私说明</Button><Text>AGPL-3.0-only · tt16-content-2.0.0</Text></View>
  </View>
}
