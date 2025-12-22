'use client'

import type { ViewMode } from '@/types/icf'
import './ModeSelector.css'

interface ModeSelectorProps {
  mode: ViewMode
  onModeChange: (mode: ViewMode) => void
}

export default function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="mode-selector">
      <button
        className={`mode-button ${mode === 'caregiver' ? 'active' : ''}`}
        onClick={() => onModeChange('caregiver')}
        type="button"
      >
        보호자 입력 모드
      </button>
      <button
        className={`mode-button ${mode === 'therapist' ? 'active' : ''}`}
        onClick={() => onModeChange('therapist')}
        type="button"
      >
        치료사 검토 모드
      </button>
    </div>
  )
}




