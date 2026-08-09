import { Text, View } from '@tarojs/components'
import { ADS_ENABLED, type AdPlacement } from '../lib/featureFlags'

export function AdSlot({ placement }: { placement: AdPlacement }) {
  if (!ADS_ENABLED) return null
  return <View className="ad-slot" data-placement={placement}><Text>广告位待平台资格与隐私审查后配置</Text></View>
}
