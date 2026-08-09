import { Button, Picker, Text, View } from '@tarojs/components'
import { useMemo, useState } from 'react'
import { PROFILE_LIST, compareProfiles, type TypeCode } from '@tt16/core'
import { AdSlot } from '../../components/AdSlot'

const LABELS = PROFILE_LIST.map((item) => `${item.code} · ${item.name}`)

export default function ComparePage() {
  const [first, setFirst] = useState(0)
  const [second, setSecond] = useState(15)
  const firstCode = PROFILE_LIST[first].code as TypeCode
  const secondCode = PROFILE_LIST[second].code as TypeCode
  const comparison = useMemo(() => compareProfiles(firstCode, secondCode), [firstCode, secondCode])
  return <View className="page content-page-mini"><View className="mini-intro"><Text className="kicker">NEUTRAL COMPARISON</Text><Text className="page-title">双类型中性对照</Text><Text>只看共同倾向、分歧维度与沟通提醒；不生成匹配分或能力排名。</Text></View><View className="picker-pair"><Picker mode="selector" range={LABELS} value={first} onChange={(event) => setFirst(Number(event.detail.value))}><Button>{LABELS[first]}</Button></Picker><Text>×</Text><Picker mode="selector" range={LABELS} value={second} onChange={(event) => setSecond(Number(event.detail.value))}><Button>{LABELS[second]}</Button></Picker></View><View className="compare-summary-mini"><Text>{comparison.summary}</Text></View><View className="content-card"><Text className="section-title">共同倾向</Text>{comparison.sharedDimensions.length ? comparison.sharedDimensions.map((item) => <View key={item.key}><Text>{item.letter} · {item.title}</Text><Text>{item.description}</Text></View>) : <Text>四个维度均不同，请先约定共同验证的事实与边界。</Text>}</View><View className="content-card"><Text className="section-title">分歧与沟通提醒</Text>{comparison.differentDimensions.length ? comparison.differentDimensions.map((item) => <View className="difference-row" key={item.key}><Text>{item.title} · {item.first.letter} ↔ {item.second.letter}</Text><Text>{item.first.description}</Text><Text>{item.second.description}</Text><Text>{item.communicationTip}</Text></View>) : <Text>同一类型仍可能有不同百分比、经历与现实约束。</Text>}</View><AdSlot placement="compare_end" /></View>
}
