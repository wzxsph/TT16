import { Button, Image, Text, View } from '@tarojs/components'
import Taro, { useLoad, useShareAppMessage } from '@tarojs/taro'
import { useState } from 'react'
import { PROFILES, isTypeCode, type ProfileV2 } from '@tt16/core'
import { AdSlot } from '../../components/AdSlot'

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileV2 | null>(null)
  useLoad((params) => {
    const code = String(params.code || '').toUpperCase()
    if (isTypeCode(code)) { setProfile(PROFILES[code]); Taro.setNavigationBarTitle({ title: `${code} ${PROFILES[code].name}` }) }
  })
  useShareAppMessage(() => ({ title: profile ? `${profile.code} · ${profile.name}｜${profile.tagline}` : 'TT16 人格图鉴', path: profile ? `/content/profile/index?code=${profile.code}` : '/pages/atlas/index' }))
  if (!profile) return <View className="page empty-page"><Text>没有找到这个人格类型。</Text><Button onClick={() => Taro.navigateBack()}>返回</Button></View>
  return <View className="page profile-mini"><View className="profile-mini-hero"><Image src={`/content/assets/personalities-v2/${profile.code}.webp`} mode="aspectFit" /><Text>{profile.code}</Text><Text>{profile.name}</Text><Text>{profile.tagline}</Text><View className="keyword-row-mini">{profile.keywords.map((item) => <Text key={item}>{item}</Text>)}</View></View><View className="content-card"><Text className="section-title">类型说明</Text><Text>{profile.description}</Text></View><View className="content-card"><Text className="section-title">决策循环</Text>{Object.values(profile.decisionLoop).map((item, index) => <View className="numbered-row" key={item}><Text>{index + 1}</Text><Text>{item}</Text></View>)}</View><View className="content-card"><Text className="section-title">优势与过度使用</Text>{profile.traitPairs.map((item) => <View className="trait-row" key={item.strength}><Text>{item.strength}</Text><Text>{item.overuse}</Text></View>)}</View><View className="dark-card"><Text className="section-title">压力模式与重置</Text><Text>{profile.pressurePattern.pattern}</Text>{profile.pressurePattern.resetSteps.map((item, index) => <View className="numbered-row" key={item}><Text>{index + 1}</Text><Text>{item}</Text></View>)}</View><View className="content-card"><Text className="section-title">五条守则</Text>{profile.rules.map((item, index) => <View className="numbered-row" key={item}><Text>{index + 1}</Text><Text>{item}</Text></View>)}</View><View className="content-card"><Text className="section-title">三个复盘问题</Text>{profile.reflectionPrompts.map((item) => <Text className="prompt-mini" key={item}>{item}</Text>)}</View><View className="content-card"><Text className="section-title">协作提醒</Text><Text>贡献：{profile.collaboration.offers.join('；')}</Text><Text>需要：{profile.collaboration.needs.join('；')}</Text><Text>摩擦：{profile.collaboration.friction.join('；')}</Text></View><AdSlot placement="type_detail_end" /><View className="boundary-card"><Text>这是决策偏好说明，不是投资能力、收益、风险等级或心理诊断。</Text></View></View>
}
