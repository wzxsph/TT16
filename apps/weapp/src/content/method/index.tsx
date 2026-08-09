import { Text, View } from '@tarojs/components'
import { GUIDES } from '@tt16/core'

export default function MethodPage() {
  return <View className="page content-page-mini"><View className="mini-intro"><Text className="kicker">METHOD & GUIDES</Text><Text className="page-title">模型方法与六篇指南</Text><Text>题库 tt16-q20-1.0.0 · 计分 tt16-score20-1.0.0 · 内容 tt16-content-2.0.0</Text></View><View className="prose-mini"><Text>怎样计分</Text><Text>16 道维度题在本地按固定方向与权重累计，转换为四组连续百分比；两道压力题不参与人格代码，两道平行情境用于提示是否复核。</Text><Text>边界结果</Text><Text>接近 50/50 不代表测错，而是代码对这一部分的概括力较弱，应同时阅读两端。</Text><Text>明确限制</Text><Text>TT16 不测知识、收益、风险承受能力、财务状况或投资适当性，也不据此推荐证券与仓位。</Text></View><View className="guide-list-mini">{GUIDES.map((guide, index) => <View key={guide.slug}><Text>{String(index + 1).padStart(2, '0')} · {guide.title}</Text><Text>{guide.summary}</Text>{guide.sections.map((section) => <View key={section.title}><Text>{section.title}</Text>{section.paragraphs.map((item) => <Text key={item}>{item}</Text>)}</View>)}</View>)}</View></View>
}
