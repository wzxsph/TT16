import { Text, View } from '@tarojs/components'

export default function PrivacyPage() {
  return <View className="page content-page-mini"><View className="mini-intro"><Text className="kicker">PRIVACY</Text><Text className="page-title">隐私最小化</Text><Text>默认只在当前微信小程序环境保存与评分。</Text></View><View className="prose-mini"><Text>答题与报告</Text><Text>进度使用 tt16:assessment:v2 保存在小程序本地。逐题答案不上传；清除小程序数据即可删除。</Text><Text>我们不收集</Text><Text>不要求姓名、手机号、身份证、券商凭证、持仓、收入、债务、资金规模或风险承受能力信息。</Text><Text>分享海报</Text><Text>Canvas 在本地生成，只包含公开人格名称、公开插画与四维倾向，不含逐题答案或用户标识。</Text><Text>广告</Text><Text>广告组件默认关闭。未来仅允许在图鉴、详情、对照与工具页底部出现；不会形成看广告解锁内容的门槛。</Text></View></View>
}
