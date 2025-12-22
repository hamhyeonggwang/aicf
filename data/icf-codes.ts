// ICF 코드 데이터베이스
// sLLM 프롬프트에 컨텍스트로 제공

export interface ICFCodeInfo {
  code: string
  title: string
  description: string
  keywords: string[]
  examples: string[]
  domain: 'b' | 's' | 'd' | 'e'
}

export const ICF_CODES: Record<string, ICFCodeInfo> = {
  // Activities and Participation (d)
  d450: {
    code: 'd450',
    title: '걷기',
    description: '다양한 지면에서의 보행 능력',
    keywords: ['걷기', '보행', '걸음', '도보', 'walking', 'gait', 'ambulation'],
    examples: [
      '평지에서 독립적으로 걷기 가능',
      '계단 오르기 시 어려움',
      '보행 보조기구 필요',
      '독립 보행 불가능'
    ],
    domain: 'd'
  },
  d455: {
    code: 'd455',
    title: '이동하기',
    description: '다양한 이동 수단을 이용한 이동 능력',
    keywords: ['이동', '움직임', 'mobility', 'movement', 'locomotion'],
    examples: [
      '독립적으로 이동 가능',
      '보조기구를 이용한 이동',
      '이동에 도움 필요'
    ],
    domain: 'd'
  },
  d460: {
    code: 'd460',
    title: '다양한 장소로 이동하기',
    description: '집 밖으로 나가 다양한 장소로 이동하는 능력',
    keywords: ['외출', '나가기', '장소 이동', 'going out', 'community mobility'],
    examples: [
      '독립적으로 외출 가능',
      '대중교통 이용 가능',
      '외출 시 도움 필요'
    ],
    domain: 'd'
  },
  d510: {
    code: 'd510',
    title: '씻기',
    description: '신체 청결을 위한 목욕 및 세면 능력',
    keywords: ['씻기', '목욕', '샤워', '세면', 'washing', 'bathing', 'showering'],
    examples: [
      '독립적으로 목욕 가능',
      '샤워 시 도움 필요',
      '전적인 도움 필요'
    ],
    domain: 'd'
  },
  d520: {
    code: 'd520',
    title: '옷 입기',
    description: '의복 착용 및 탈의 능력',
    keywords: ['옷 입기', '착의', '의복', 'dressing', 'clothing', 'undressing'],
    examples: [
      '독립적으로 옷 입기 가능',
      '단추, 지퍼 조작 어려움',
      '전적인 도움 필요'
    ],
    domain: 'd'
  },
  d550: {
    code: 'd550',
    title: '먹기',
    description: '음식 섭취 및 식사 능력',
    keywords: ['먹기', '식사', '섭취', 'eating', 'feeding', 'swallowing'],
    examples: [
      '독립적으로 식사 가능',
      '식사 도구 사용 어려움',
      '경관 영양 필요'
    ],
    domain: 'd'
  },
  d710: {
    code: 'd710',
    title: '기본적 대인관계',
    description: '가족 및 친밀한 관계에서의 상호작용',
    keywords: ['대인관계', '관계', '인간관계', 'interpersonal', 'social interaction'],
    examples: [
      '가족과의 관계 양호',
      '친구와의 상호작용 가능',
      '대인관계 형성 어려움'
    ],
    domain: 'd'
  },
  d720: {
    code: 'd720',
    title: '복잡한 대인관계',
    description: '다양한 사회적 맥락에서의 관계 형성 및 유지',
    keywords: ['사회적 관계', '복잡한 관계', 'social relationship', 'complex interaction'],
    examples: [
      '직장에서의 관계 양호',
      '사회적 상호작용 어려움'
    ],
    domain: 'd'
  },
  // Body Functions (b)
  b130: {
    code: 'b130',
    title: '에너지 및 동기',
    description: '에너지 수준 및 동기 부여 능력',
    keywords: ['에너지', '동기', '피로', 'energy', 'motivation', 'fatigue'],
    examples: [
      '에너지 수준 양호',
      '피로감 자주 호소',
      '동기 부여 어려움'
    ],
    domain: 'b'
  },
  // Body Structures (s)
  s730: {
    code: 's730',
    title: '상지 구조',
    description: '팔, 손 등의 상지 구조',
    keywords: ['팔', '손', '상지', 'upper limb', 'arm', 'hand'],
    examples: [
      '상지 구조 정상',
      '팔 움직임 제한',
      '손 기능 장애'
    ],
    domain: 's'
  },
  // Environmental Factors (e)
  e110: {
    code: 'e110',
    title: '제품 및 기술',
    description: '일상생활 보조 제품 및 기술',
    keywords: ['보조기구', '도구', '제품', 'assistive device', 'equipment'],
    examples: [
      '보조기구 사용 중',
      '휠체어 필요',
      '보조 도구 없이 생활 가능'
    ],
    domain: 'e'
  }
}

// 도메인별 코드 목록
export const getCodesByDomain = (domain: 'b' | 's' | 'd' | 'e'): ICFCodeInfo[] => {
  return Object.values(ICF_CODES).filter(code => code.domain === domain)
}

// 모든 코드 목록
export const getAllCodes = (): ICFCodeInfo[] => {
  return Object.values(ICF_CODES)
}

// 코드로 정보 찾기
export const getCodeInfo = (code: string): ICFCodeInfo | undefined => {
  return ICF_CODES[code]
}




