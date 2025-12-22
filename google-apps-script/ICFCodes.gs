/**
 * ICF 코드 데이터베이스
 * ICF 코드 정보를 관리하는 모듈
 */

// ICF 코드 데이터베이스
const ICF_CODES = {
  d450: { 
    code: 'd450', 
    title: '걷기', 
    description: '다양한 지면에서의 보행 능력',
    keywords: ['걷기', '보행', '걸음', '도보', 'walking', 'gait', 'ambulation'],
    domain: 'd' 
  },
  d455: { 
    code: 'd455', 
    title: '이동하기', 
    description: '다양한 이동 수단을 이용한 이동 능력',
    keywords: ['이동', '움직임', 'mobility', 'movement', 'locomotion'],
    domain: 'd' 
  },
  d460: { 
    code: 'd460', 
    title: '다양한 장소로 이동하기', 
    description: '집 밖으로 나가 다양한 장소로 이동하는 능력',
    keywords: ['외출', '나가기', '장소 이동', 'going out', 'community mobility'],
    domain: 'd' 
  },
  d510: { 
    code: 'd510', 
    title: '씻기', 
    description: '신체 청결을 위한 목욕 및 세면 능력',
    keywords: ['씻기', '목욕', '샤워', '세면', 'washing', 'bathing', 'showering'],
    domain: 'd' 
  },
  d520: { 
    code: 'd520', 
    title: '옷 입기', 
    description: '의복 착용 및 탈의 능력',
    keywords: ['옷 입기', '착의', '의복', 'dressing', 'clothing', 'undressing'],
    domain: 'd' 
  },
  d550: { 
    code: 'd550', 
    title: '먹기', 
    description: '음식 섭취 및 식사 능력',
    keywords: ['먹기', '식사', '섭취', 'eating', 'feeding', 'swallowing'],
    domain: 'd' 
  },
  d710: { 
    code: 'd710', 
    title: '기본적 대인관계', 
    description: '가족 및 친밀한 관계에서의 상호작용',
    keywords: ['대인관계', '관계', '인간관계', 'interpersonal', 'social interaction'],
    domain: 'd' 
  },
  d720: { 
    code: 'd720', 
    title: '복잡한 대인관계', 
    description: '다양한 사회적 맥락에서의 관계 형성 및 유지',
    keywords: ['사회적 관계', '복잡한 관계', 'social relationship', 'complex interaction'],
    domain: 'd' 
  },
  b130: { 
    code: 'b130', 
    title: '에너지 및 동기', 
    description: '에너지 수준 및 동기 부여 능력',
    keywords: ['에너지', '동기', '피로', 'energy', 'motivation', 'fatigue'],
    domain: 'b' 
  },
  s730: { 
    code: 's730', 
    title: '상지 구조', 
    description: '팔, 손 등의 상지 구조',
    keywords: ['팔', '손', '상지', 'upper limb', 'arm', 'hand'],
    domain: 's' 
  },
  e110: { 
    code: 'e110', 
    title: '제품 및 기술', 
    description: '일상생활 보조 제품 및 기술',
    keywords: ['보조기구', '도구', '제품', 'assistive device', 'equipment'],
    domain: 'e' 
  }
};

/**
 * 모든 ICF 코드 목록 반환
 * @return {Array} ICF 코드 배열
 */
function getAllCodes() {
  return Object.values(ICF_CODES);
}

/**
 * 도메인별 코드 목록 반환
 * @param {string} domain - 도메인 ('b', 's', 'd', 'e')
 * @return {Array} 해당 도메인의 코드 배열
 */
function getCodesByDomain(domain) {
  return Object.values(ICF_CODES).filter(function(code) {
    return code.domain === domain;
  });
}

/**
 * 코드로 정보 찾기
 * @param {string} code - ICF 코드 (예: 'd450')
 * @return {Object|undefined} 코드 정보 또는 undefined
 */
function getCodeInfo(code) {
  return ICF_CODES[code];
}

/**
 * ICF 코드 목록을 프롬프트에 포함하기 위한 문자열 생성
 * @return {string} ICF 코드 컨텍스트 문자열
 */
function generateICFCodesContext() {
  const codes = getAllCodes();
  return codes.map(function(code) {
    var keywords = code.keywords ? code.keywords.join(', ') : '';
    return '- ' + code.code + ' (' + code.title + '): ' + code.description +
           (keywords ? '\n  키워드: ' + keywords : '');
  }).join('\n');
}

