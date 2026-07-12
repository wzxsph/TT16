import { useEffect } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronLeft, Cloud, GitBranch, X } from 'lucide-react'
import type { CommercialQuestionView } from '../lib/api'
import { SOURCE_REPOSITORY_URL } from '../lib/project'
import { BrandMark } from './Illustrations'

type QuizPageProps = {
  question: CommercialQuestionView
  index: number
  total: number
  selected: number | null | undefined
  isAnswered: boolean
  answeredCount: number
  onSelect: (value: number | null) => void
  onBack: () => void
  onNext: () => void
  onExit: () => void
}

const scaleOptions = [
  { value: -2, short: '非常像 A', label: '更接近 A' },
  { value: -1, short: '有点像 A', label: '略接近 A' },
  { value: 0, short: '看情况', label: '视情况' },
  { value: 1, short: '有点像 B', label: '略接近 B' },
  { value: 2, short: '非常像 B', label: '更接近 B' },
]

export function QuizPage({
  question,
  index,
  total,
  selected,
  isAnswered,
  answeredCount,
  onSelect,
  onBack,
  onNext,
  onExit,
}: QuizPageProps) {
  const progress = ((index + 1) / total) * 100
  const milestone = index > 0 && index % 8 === 0

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return
      const number = Number(event.key)
      if (number >= 1 && number <= 5) onSelect(scaleOptions[number - 1].value)
      if ((event.key === '0' || event.key.toLowerCase() === 'n') && question.allowNA) onSelect(null)
      if (event.key === 'ArrowLeft') onBack()
      if (event.key === 'ArrowRight' && isAnswered) onNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isAnswered, onBack, onNext, onSelect, question.allowNA])

  return (
    <main className="quiz-screen">
      <header className="quiz-header">
        <button className="quiz-brand" onClick={onExit} aria-label="保存并返回首页">
          <BrandMark size={34} />
          <span>TT16</span>
        </button>
        <div className="quiz-save-state"><Cloud size={15} /><span>进度已安全同步</span></div>
        <div className="quiz-header__actions">
          <a className="source-link" href={SOURCE_REPOSITORY_URL} target="_blank" rel="noreferrer"><GitBranch size={15} /><span>源码</span></a>
          <button className="icon-button" onClick={onExit} aria-label="关闭测试"><X size={20} /></button>
        </div>
      </header>

      <div className="quiz-progress" aria-label={`第 ${index + 1} 题，共 ${total} 题`}>
        <span style={{ width: `${progress}%` }} />
      </div>

      <section className="quiz-stage">
        <div className="quiz-meta">
          <button className="back-button" onClick={onBack}><ChevronLeft size={18} />上一题</button>
          <div className="quiz-count"><strong>{String(index + 1).padStart(2, '0')}</strong><span>/ {total}</span></div>
          <span className="quiz-tag">{question.tag}</span>
        </div>

        {milestone && (
          <div className="milestone-note">
            <Check size={16} />
            已完成一组情境。没有标准答案，继续按第一反应选择就好。
          </div>
        )}

        <div className="question-card" key={question.id}>
          <div className="question-kicker">回想你过去 12 个月更常见的做法</div>
          <h1>{question.prompt}</h1>

          <div className="answer-poles">
            <article className="answer-pole answer-pole--a">
              <span>A</span>
              <p>{question.leftText}</p>
            </article>
            <div className="answer-or"><span>或</span></div>
            <article className="answer-pole answer-pole--b">
              <span>B</span>
              <p>{question.rightText}</p>
            </article>
          </div>

          <fieldset className="answer-scale">
            <legend>选择更接近你的程度</legend>
            <div className="answer-scale__labels" aria-hidden="true"><span>接近 A</span><span>接近 B</span></div>
            <div className="answer-scale__options">
              {scaleOptions.map((option, optionIndex) => {
                const active = isAnswered && selected === option.value
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={`${option.label}，快捷键 ${optionIndex + 1}`}
                    className={active ? 'is-selected' : ''}
                    onClick={() => onSelect(option.value)}
                    key={option.value}
                  >
                    <span className="scale-dot"><i /></span>
                    <strong>{option.short}</strong>
                    <kbd>{optionIndex + 1}</kbd>
                  </button>
                )
              })}
            </div>
          </fieldset>

          {question.allowNA && (
            <button
              className={`na-button ${isAnswered && selected === null ? 'is-selected' : ''}`}
              onClick={() => onSelect(null)}
            >
              {isAnswered && selected === null && <Check size={15} />}
              未经历过 / 不适用
              <kbd>0</kbd>
            </button>
          )}
        </div>

        <div className="quiz-footer">
          <span>{answeredCount} 个答案已保存</span>
          <div>
            <button className="button button--ghost button--compact" onClick={onBack}><ArrowLeft size={17} />返回</button>
            <button className="button button--dark button--compact" onClick={onNext} disabled={!isAnswered || index >= total - 1}>
              下一题<ArrowRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </main>
  )
}
