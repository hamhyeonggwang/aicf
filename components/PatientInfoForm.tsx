'use client'

import { useState } from 'react'
import type { PatientInfo, PersonalFactors } from '@/types/icf'
import './PatientInfoForm.css'

interface PatientInfoFormProps {
  patientInfo?: PatientInfo
  personalFactors?: PersonalFactors
  onSave: (patientInfo: PatientInfo, personalFactors?: PersonalFactors) => void
}

export default function PatientInfoForm({ patientInfo, personalFactors, onSave }: PatientInfoFormProps) {
  const [formData, setFormData] = useState<PatientInfo>(patientInfo || {})
  const [personalData, setPersonalData] = useState<PersonalFactors>(personalFactors || {})

  const handleChange = (field: keyof PatientInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePersonalChange = (field: keyof PersonalFactors, value: string) => {
    setPersonalData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData, personalData)
  }

  return (
    <form className="patient-info-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>환자 정보</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>이름</label>
            <input
              type="text"
              value={formData.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>성별</label>
            <select
              value={formData.gender || ''}
              onChange={(e) => handleChange('gender', e.target.value as 'M' | 'F')}
            >
              <option value="">선택</option>
              <option value="M">남</option>
              <option value="F">여</option>
            </select>
          </div>
          <div className="form-group">
            <label>생년월일</label>
            <input
              type="date"
              value={formData.birthDate || ''}
              onChange={(e) => handleChange('birthDate', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>상병코드</label>
            <input
              type="text"
              value={formData.diagnosisCode || ''}
              onChange={(e) => handleChange('diagnosisCode', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>진단명</label>
            <input
              type="text"
              value={formData.diagnosisName || ''}
              onChange={(e) => handleChange('diagnosisName', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>C.C</label>
            <input
              type="text"
              value={formData.chiefComplaint || ''}
              onChange={(e) => handleChange('chiefComplaint', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>복용 약물</label>
            <input
              type="text"
              value={formData.medications || ''}
              onChange={(e) => handleChange('medications', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>내원일</label>
            <input
              type="date"
              value={formData.visitDate || ''}
              onChange={(e) => handleChange('visitDate', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>퇴원 예정일</label>
            <input
              type="date"
              value={formData.dischargeDate || ''}
              onChange={(e) => handleChange('dischargeDate', e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>학령기 재활처방</label>
            <input
              type="text"
              placeholder="PT/OT/ST"
              value={formData.prescription || ''}
              onChange={(e) => handleChange('prescription', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>개인요인</h3>
        <div className="form-grid">
          <div className="form-group">
            <label>경험/history</label>
            <textarea
              value={personalData.experience || ''}
              onChange={(e) => handlePersonalChange('experience', e.target.value)}
              rows={2}
            />
          </div>
          <div className="form-group">
            <label>가치/신념</label>
            <textarea
              value={personalData.values || ''}
              onChange={(e) => handlePersonalChange('values', e.target.value)}
              rows={2}
            />
          </div>
          <div className="form-group">
            <label>동기</label>
            <textarea
              value={personalData.motivation || ''}
              onChange={(e) => handlePersonalChange('motivation', e.target.value)}
              rows={2}
            />
          </div>
          <div className="form-group">
            <label>습관</label>
            <textarea
              value={personalData.habits || ''}
              onChange={(e) => handlePersonalChange('habits', e.target.value)}
              rows={2}
            />
          </div>
          <div className="form-group">
            <label>인지</label>
            <textarea
              value={personalData.cognition || ''}
              onChange={(e) => handlePersonalChange('cognition', e.target.value)}
              rows={2}
            />
          </div>
          <div className="form-group">
            <label>감각/운동</label>
            <textarea
              value={personalData.sensoryMotor || ''}
              onChange={(e) => handlePersonalChange('sensoryMotor', e.target.value)}
              rows={2}
            />
          </div>
          <div className="form-group">
            <label>정서</label>
            <textarea
              value={personalData.emotion || ''}
              onChange={(e) => handlePersonalChange('emotion', e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="submit" className="save-button">
          저장
        </button>
      </div>
    </form>
  )
}


