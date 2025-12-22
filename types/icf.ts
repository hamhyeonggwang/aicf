// ICF Schema Types
export type ICFDomain = 'b' | 's' | 'd' | 'e';

export interface ICFCode {
  code: string; // e.g., "d450", "d455"
  title: string; // e.g., "걷기", "이동하기"
  description: string; // 임상 언어 설명
  qualifier: {
    min: number;
    max: number;
    default?: number;
  };
  mappingRationale?: string; // 문장-ICF 코드 매핑 근거
}

export interface ICFDomainSection {
  domain: ICFDomain;
  title: string;
  description: string;
  codes: ICFCode[];
}

export interface AssessmentItem {
  id: string;
  icfCode: string;
  domain: ICFDomain;
  question: string; // 평가 문항
  clinicalDescription: string; // 임상 언어 설명
  mappingRationale: string; // 문장-ICF 코드 매핑 근거
  options: {
    value: number;
    label: string;
    description?: string;
  }[];
}

export interface AssessmentTool {
  id: string;
  title: string;
  version: string;
  description: string;
  domains: {
    b?: ICFDomainSection;
    s?: ICFDomainSection;
    d: ICFDomainSection; // participation is required
    e?: ICFDomainSection;
  };
  items: AssessmentItem[];
}

export interface AssessmentScore {
  itemId: string;
  score: number;
  notes?: string;
  // ICF qualifier 형식 (도메인별로 다름)
  qualifier?: string; // e.g., ".0", ".1", "+2", ".8", ".9"
}

// ICF 평가치 체계
export type ICFQualifierValue = 0 | 1 | 2 | 3 | 4 | 8 | 9;
export type ICFQualifierType = 'general' | 'body' | 'activity' | 'environment';

export interface ICFQualifier {
  value: ICFQualifierValue;
  label: string;
  description: string;
}

// 도메인별 평가치 레이블
export const ICF_QUALIFIER_LABELS: Record<ICFQualifierType, Record<ICFQualifierValue, string>> = {
  general: {
    0: '이상 없음',
    1: '경도 이상',
    2: '중도 이상',
    3: '고도 이상',
    4: '완전 이상',
    8: '분류되어 있지 않음',
    9: '적용불가',
  },
  body: {
    0: '손상없음',
    1: '경도손상',
    2: '중도손상',
    3: '고도손상',
    4: '완전손상',
    8: '분류되어 있지 않음',
    9: '적용불가',
  },
  activity: {
    0: '어려움 없음',
    1: '경도어려움',
    2: '중도어려움',
    3: '고도어려움',
    4: '완전어려움',
    8: '분류되어 있지 않음',
    9: '적용불가',
  },
  environment: {
    0: '저해요인 없음',
    1: '경도 저해요인',
    2: '중도 저해요인',
    3: '고도 저해요인',
    4: '완전 저해요인',
    8: '분류되어 있지 않은 저해요인',
    9: '적용불가',
  },
};

// 환경요인 촉진요인 레이블
export const ICF_ENVIRONMENT_FACILITATOR_LABELS: Record<ICFQualifierValue, string> = {
  0: '촉진요인 없음',
  1: '경도 촉진요인',
  2: '중도 촉진요인',
  3: '고도 촉진요인',
  4: '완전 촉진요인',
  8: '분류되어 있지 않은 촉진요인',
  9: '적용불가',
};

// 환자 정보 (Case conference 양식용)
export interface PatientInfo {
  name?: string;
  gender?: 'M' | 'F';
  birthDate?: string;
  diagnosisCode?: string;
  diagnosisName?: string;
  visitDate?: string;
  dischargeDate?: string;
  medications?: string;
  chiefComplaint?: string;
  prescription?: string; // PT/OT/ST
}

// 개인요인 정보
export interface PersonalFactors {
  experience?: string;
  values?: string;
  motivation?: string;
  habits?: string;
  cognition?: string;
  sensoryMotor?: string;
  emotion?: string;
}

// 치료 목표
export interface TreatmentGoals {
  pt?: string;
  ot?: string;
  st?: string;
}

// Case conference 보고서 데이터
export interface CaseConferenceReport {
  patientInfo: PatientInfo;
  personalFactors?: PersonalFactors;
  bodyFunctionScores: Array<{
    code: string;
    twoLevelCode?: string;
    content: string;
    qualifier: string;
    isStrength?: boolean; // 강점인지 제한점인지
  }>;
  activityScores: Array<{
    code: string;
    twoLevelCode?: string;
    content: string;
    performance?: string; // P
    capacity?: string; // C
  }>;
  environmentFactors: Array<{
    code: string;
    category?: string;
    content: string;
    type: 'facilitator' | 'barrier';
    qualifier: string;
  }>;
  treatmentGoals?: TreatmentGoals;
  comments?: string;
}

export interface AssessmentResponse {
  toolId: string;
  patientId?: string;
  respondentType: 'therapist' | 'caregiver';
  scores: AssessmentScore[];
  createdAt: string;
  updatedAt: string;
}

export type ViewMode = 'therapist' | 'caregiver';




