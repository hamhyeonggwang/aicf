'use client'

import type { ICFDomainSection, AssessmentItem, AssessmentScore, ViewMode } from '@/types/icf'
import AssessmentItemComponent from './AssessmentItem'
import './DomainSection.css'

interface DomainSectionProps {
  domain: ICFDomainSection
  items: AssessmentItem[]
  scores: Record<string, AssessmentScore>
  onScoreChange: (itemId: string, score: number, notes?: string) => void
  viewMode: ViewMode
  priority?: boolean
}

export default function DomainSection({
  domain,
  items,
  scores,
  onScoreChange,
  viewMode,
  priority = false,
}: DomainSectionProps) {
  if (items.length === 0) return null

  return (
    <section className={`domain-section domain-${domain.domain} ${priority ? 'priority' : ''}`}>
      <div className="domain-header">
        <h2 className="domain-title">
          {domain.title}
          {priority && <span className="priority-badge">우선</span>}
        </h2>
        <p className="domain-description">{domain.description}</p>
      </div>

      <div className="domain-items">
        {items.map(item => (
          <AssessmentItemComponent
            key={item.id}
            item={item}
            icfCode={domain.codes.find(code => code.code === item.icfCode)}
            score={scores[item.id]?.score}
            notes={scores[item.id]?.notes}
            onScoreChange={(score, notes) => onScoreChange(item.id, score, notes)}
            viewMode={viewMode}
          />
        ))}
      </div>
    </section>
  )
}




