import { Button, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'
import { QUESTIONS, type Answers } from '@tt16/core'
import { readAssessment, writeAssessment } from '../../lib/storage'

const OPTIONS = [
  { value: -2, label: '非常像 A' },
  { value: -1, label: '有点像 A' },
  { value: 0, label: '看情况' },
  { value: 1, label: '有点像 B' },
  { value: 2, label: '非常像 B' },
] as const

export default function AssessmentPage() {
  const [answers, setAnswers] = useState<Answers>({})
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const stored = readAssessment()
    if (stored) { setAnswers(stored.answers); setIndex(stored.currentIndex) }
  }, [])
  const question = QUESTIONS[index]
  const choose = (value: number | null) => {
    const next = { ...answers, [question.id]: value }
    setAnswers(next)
    if (index === QUESTIONS.length - 1) {
      writeAssessment({ version: 'assessment-2', answers: next, currentIndex: index, completed: true })
      Taro.redirectTo({ url: '/pages/result/index' })
      return
    }
    const nextIndex = index + 1
    setIndex(nextIndex)
    writeAssessment({ version: 'assessment-2', answers: next, currentIndex: nextIndex, completed: false })
  }
  return <View className="page assessment-page"><View className="assessment-top"><Text>{String(index + 1).padStart(2, '0')} / {QUESTIONS.length}</Text><Text>进度只保存在本机</Text></View><View className="progress-track"><View style={{ width: `${(index + 1) / QUESTIONS.length * 100}%` }} /></View><View className="question-panel"><Text className="kicker">{question.tag} · 回想过去 12 个月</Text><Text className="question-title">{question.prompt}</Text><View className="answer-poles"><View><Text>A</Text><Text>{question.leftText}</Text></View><View><Text>B</Text><Text>{question.rightText}</Text></View></View><View className="answer-options">{OPTIONS.map((option) => <Button key={option.value} className={answers[question.id] === option.value ? 'selected' : ''} onClick={() => choose(option.value)}><Text>{option.label}</Text></Button>)}</View>{question.allowNA && <Button className={question.id in answers && answers[question.id] === null ? 'na-option selected' : 'na-option'} onClick={() => choose(null)}>未经历过 / 不适用</Button>}</View><View className="assessment-actions"><Button disabled={index === 0} onClick={() => setIndex((value) => Math.max(0, value - 1))}>上一题</Button><Button onClick={() => Taro.navigateBack()}>保存并退出</Button></View></View>
}
