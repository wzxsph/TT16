import { Button, Canvas, Text, View } from '@tarojs/components'
import Taro, { useDidShow, useShareAppMessage } from '@tarojs/taro'
import { useState } from 'react'
import { buildShareCardModel, scoreAssessment, type AssessmentResult } from '@tt16/core'
import { clearAssessment, readAssessment } from '../../lib/storage'
import { saveSharePoster } from '../../lib/poster'

const LABELS = { RS: '判断依据', HT: '时间周期', DA: '风险表达', PF: '执行方式' } as const

export default function ResultPage() {
  const [result, setResult] = useState<AssessmentResult | null>(null)
  useDidShow(() => {
    const stored = readAssessment()
    if (stored?.completed) setResult(scoreAssessment(stored.answers))
  })
  useShareAppMessage(() => ({ title: result ? `我的 TT16 是 ${result.typeCode} · ${result.profile.name}` : 'TT16 交易人格十六型', path: '/pages/index/index' }))
  if (!result) return <View className="page empty-page"><Text>本机暂无完整报告</Text><Button className="primary-button" onClick={() => Taro.redirectTo({ url: '/pages/assessment/index' })}>开始 20 题测试</Button></View>
  const model = buildShareCardModel(result)
  const restart = () => { clearAssessment(); Taro.redirectTo({ url: '/pages/assessment/index' }) }
  return <View className="page result-mini"><View className="result-identity"><Text>{result.typeCode}</Text><Text>{result.profile.name}</Text><Text>{result.profile.tagline}</Text><View className="keyword-row-mini">{result.profile.keywords.map((item) => <Text key={item}>{item}</Text>)}</View></View><View className="dimension-list">{result.dimensions.map((dimension) => <View key={dimension.key}><View><Text>{dimension.chosenLetter} · {LABELS[dimension.key]}</Text><Text>{dimension.chosenLetter === dimension.leftLetter ? dimension.leftPercent : dimension.rightPercent}%</Text></View><View className="mini-meter"><View style={{ width: `${dimension.chosenLetter === dimension.leftLetter ? dimension.leftPercent : dimension.rightPercent}%` }} /></View>{dimension.isBoundary && <Text>这一维接近边界，请同时阅读两端。</Text>}</View>)}</View><View className="content-card"><Text className="section-title">决策循环</Text>{Object.entries(result.profile.decisionLoop).map(([key, value], index) => <View className="numbered-row" key={key}><Text>{index + 1}</Text><Text>{value}</Text></View>)}</View><View className="content-card"><Text className="section-title">优势与过度使用</Text>{result.profile.traitPairs.map((pair) => <View className="trait-row" key={pair.strength}><Text>{pair.strength}</Text><Text>{pair.overuse}</Text></View>)}</View><View className="content-card"><Text className="section-title">两项压力反应</Text>{result.pressure.map((item) => <View className="pressure-row" key={item.key}><Text>{item.name} · {item.label}</Text><Text>{item.advice}</Text></View>)}</View><View className="dark-card"><Text className="section-title">三个压力重置动作</Text><Text>{result.profile.pressurePattern.pattern}</Text>{result.profile.pressurePattern.resetSteps.map((item, index) => <View className="numbered-row" key={item}><Text>{index + 1}</Text><Text>{item}</Text></View>)}</View><View className="content-card"><Text className="section-title">五条守则</Text>{result.profile.rules.map((item, index) => <View className="numbered-row" key={item}><Text>{index + 1}</Text><Text>{item}</Text></View>)}</View><View className="share-actions"><Button className="primary-button" onClick={() => saveSharePoster('share-poster', model)}>保存本地海报</Button><Button openType="share">微信分享</Button><Button onClick={() => Taro.navigateTo({ url: `/content/profile/index?code=${result.typeCode}` })}>查看公开类型页</Button></View><Canvas className="poster-canvas" canvasId="share-poster" /><View className="boundary-card"><Text>报告仅供自我观察与娱乐，不构成投资建议、收益承诺、风险承受能力评估、适当性评价或心理诊断。</Text></View><Button className="text-action" onClick={restart}>清除本机答案并重新测试</Button></View>
}
