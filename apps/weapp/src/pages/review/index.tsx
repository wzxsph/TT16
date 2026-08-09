import { Button, Text, View } from '@tarojs/components'
import { useState } from 'react'
import { AdSlot } from '../../components/AdSlot'

const ITEMS = ['我能说清主要依据是事实证据还是市场反馈。','我写清了这次判断需要多长时间验证。','我知道什么新证据会触发复核。','我先确定可承受影响，再表达确信。','我能区分更新条件与临场合理化。','踏空或回撤时，我先执行暂停动作。','我没有用一次结果证明整套方法。','我选出下一次可观察的一项小改动。']

export default function ReviewPage() {
  const [checked, setChecked] = useState<number[]>([])
  const toggle = (index: number) => setChecked((value) => value.includes(index) ? value.filter((item) => item !== index) : [...value, index])
  return <View className="page content-page-mini"><View className="mini-intro"><Text className="kicker">LOCAL REVIEW</Text><Text className="page-title">五分钟复盘检查</Text><Text>不填写证券、金额、账户或自由文本；本页勾选不会保存。</Text></View><View className="review-count"><Text>{checked.length}</Text><Text>/ {ITEMS.length} 项已核对</Text></View><View className="review-list">{ITEMS.map((item, index) => <Button key={item} className={checked.includes(index) ? 'checked' : ''} onClick={() => toggle(index)}><Text>{checked.includes(index) ? '✓' : ''}</Text><Text>{item}</Text></Button>)}</View><Button className="text-action" onClick={() => setChecked([])}>清空本页</Button><AdSlot placement="tool_end" /><View className="boundary-card"><Text>复盘关注过程，不记录个人财务或具体交易内容。</Text></View></View>
}
