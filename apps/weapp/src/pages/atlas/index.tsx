import { Button, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { GROUPS, PROFILE_LIST } from '@tt16/core'
import { AdSlot } from '../../components/AdSlot'

export default function AtlasPage() {
  return <View className="page content-page-mini"><View className="mini-intro"><Text className="kicker">PERSONALITY ATLAS</Text><Text className="page-title">16 型公开人格图鉴</Text><Text>每一型的完整说明与材料都免费开放，没有解锁门槛。</Text></View>{GROUPS.map((group) => <View className="atlas-group" key={group.code}><View className="atlas-group-title"><Text>{group.code}</Text><Text>{group.name}</Text><Text>{group.tagline}</Text></View>{group.codes.map((code) => { const profile = PROFILE_LIST.find((item) => item.code === code)!; return <Button key={code} onClick={() => Taro.navigateTo({ url: `/content/profile/index?code=${code}` })}><Text>{code} · {profile.name}</Text><Text>{profile.tagline}</Text><Text>{profile.keywords.join(' · ')}</Text></Button> })}</View>)}<AdSlot placement="atlas_mid" /><View className="boundary-card"><Text>类型是阅读索引，不是能力、收益或风险等级。</Text></View></View>
}
