/**
 * API 핸들러
 * 각 엔드포인트의 요청을 처리하는 핸들러 함수들
 */

/**
 * ICF 코드 매칭 처리
 * @param {Object} requestData - 요청 데이터
 * @return {Object} 매칭 결과
 */
function handleMatch(requestData) {
  // 요청 데이터 유효성 검사
  if (!requestData || typeof requestData !== 'object') {
    throw new Error('요청 데이터가 올바르지 않습니다.');
  }
  
  const clinicalText = requestData.clinicalText;
  
  if (!clinicalText || typeof clinicalText !== 'string') {
    throw new Error('임상 언어 텍스트(clinicalText)가 필요합니다. 요청 본문에 "clinicalText" 필드를 포함해주세요.');
  }
  
  const icfCodesContext = generateICFCodesContext();
  
  const systemPrompt = '당신은 ICF(International Classification of Functioning, Disability and Health) 전문가입니다.\n' +
    '임상 언어를 분석하여 관련된 ICF 코드를 찾아주세요.\n\n' +
    '사용 가능한 ICF 코드 목록:\n' + icfCodesContext + '\n\n' +
    '응답 형식 (JSON):\n' +
    '{\n' +
    '  "matches": [\n' +
    '    {\n' +
    '      "code": "d450",\n' +
    '      "title": "걷기",\n' +
    '      "confidence": 0.9,\n' +
    '      "rationale": "입력하신 내용에서 \'걷기\', \'보행\' 관련 표현이 발견되어 d450 코드와 매칭됩니다."\n' +
    '    }\n' +
    '  ]\n' +
    '}\n\n' +
    '주의사항:\n' +
    '- confidence는 0.0 ~ 1.0 사이의 값입니다\n' +
    '- 관련성이 높은 코드만 포함하세요 (confidence > 0.5)\n' +
    '- rationale은 구체적이고 명확하게 작성하세요\n' +
    '- 가능한 한 많은 관련 코드를 찾아주세요 (최대 10개까지)\n' +
    '- 임상 언어에서 언급된 모든 기능, 활동, 참여 영역을 포괄적으로 분석하세요\n' +
    '- 하나의 문장에서 여러 ICF 코드가 관련될 수 있으므로, 모든 관련 코드를 포함하세요';
  
  const userPrompt = '다음 임상 언어를 분석하여 관련된 ICF 코드를 찾아주세요.\n' +
    '임상 언어에서 언급된 모든 기능, 활동, 참여 영역을 포괄적으로 분석하고, 관련된 모든 ICF 코드를 찾아주세요.\n' +
    '2개 이상의 코드가 관련될 수 있으므로, 가능한 한 많은 관련 코드를 포함해주세요.\n\n' +
    '임상 언어:\n"' + clinicalText + '"';
  
  const response = callOpenAI(systemPrompt, userPrompt, 3000);
  
  if (!response.matches || !Array.isArray(response.matches)) {
    throw new Error('잘못된 API 응답 형식입니다.');
  }
  
  // confidence 기준으로 정렬 및 필터링
  const matches = response.matches
    .filter(function(match) {
      return match.code && match.confidence > 0.3;
    })
    .sort(function(a, b) {
      return b.confidence - a.confidence;
    })
    .slice(0, 10);
  
  return { matches: matches };
}

/**
 * 점수 추천 처리
 * @param {Object} requestData - 요청 데이터
 * @return {Object} 점수 추천 결과
 */
function handleScoreRecommendation(requestData) {
  // 요청 데이터 유효성 검사
  if (!requestData || typeof requestData !== 'object') {
    throw new Error('요청 데이터가 올바르지 않습니다.');
  }
  
  const clinicalText = requestData.clinicalText;
  const icfCode = requestData.icfCode;
  const icfTitle = requestData.icfTitle || '';
  
  if (!clinicalText || !icfCode) {
    throw new Error('임상 언어 텍스트(clinicalText)와 ICF 코드(icfCode)가 필요합니다.');
  }
  
  const systemPrompt = '당신은 ICF(International Classification of Functioning, Disability and Health) 평가 전문가입니다.\n' +
    '임상 언어를 분석하여 ICF 코드에 대한 수행력(Performance)과 능력(Capacity) 점수를 추천해주세요.\n\n' +
    'ICF Qualifier 체계:\n' +
    '- 0점: 문제 없음 (No problem) - 0-4% 정도의 문제\n' +
    '- 1점: 경미한 문제 (Mild problem) - 5-24% 정도의 문제\n' +
    '- 2점: 중간 정도 문제 (Moderate problem) - 25-49% 정도의 문제\n' +
    '- 3점: 심각한 문제 (Severe problem) - 50-95% 정도의 문제\n' +
    '- 4점: 완전한 문제 (Complete problem) - 96-100% 정도의 문제\n\n' +
    '중요한 구분:\n' +
    '1. 능력(Capacity): 표준 환경에서의 최대 수행 능력\n' +
    '2. 수행력(Performance): 실제 환경에서의 수행 수준\n\n' +
    '응답 형식 (JSON):\n' +
    '{\n' +
    '  "performanceScore": 2,\n' +
    '  "capacityScore": 1,\n' +
    '  "rationale": "임상 언어에서 발견된 구체적 근거를 간결하게 설명"\n' +
    '}';
  
  const userPrompt = '다음 임상 언어를 분석하여 ICF 코드 "' + icfCode + ' (' + icfTitle + ')"에 대한 점수를 추천해주세요:\n\n' +
    '임상 언어: "' + clinicalText + '"';
  
  const result = callOpenAI(systemPrompt, userPrompt, 800, 0.2);
  
  // 점수 검증
  if (typeof result.performanceScore !== 'number' || result.performanceScore < 0 || result.performanceScore > 4) {
    result.performanceScore = 2;
  }
  if (typeof result.capacityScore !== 'number' || result.capacityScore < 0 || result.capacityScore > 4) {
    result.capacityScore = 2;
  }
  
  return result;
}

/**
 * 중재 추천 처리
 * @param {Object} requestData - 요청 데이터
 * @return {Object} 중재 추천 결과
 */
function handleInterventionRecommendation(requestData) {
  // 요청 데이터 유효성 검사
  if (!requestData || typeof requestData !== 'object') {
    throw new Error('요청 데이터가 올바르지 않습니다.');
  }
  
  const clinicalText = requestData.clinicalText;
  const icfCode = requestData.icfCode;
  const icfTitle = requestData.icfTitle || '';
  const performanceScore = requestData.performanceScore;
  const capacityScore = requestData.capacityScore;
  
  if (!clinicalText || !icfCode) {
    throw new Error('임상 언어 텍스트(clinicalText)와 ICF 코드(icfCode)가 필요합니다.');
  }
  
  const systemPrompt = '당신은 작업치료 및 재활 전문가입니다.\n' +
    '임상 언어와 평가 점수를 분석하여 ICF 코드에 대한 환경/과제/개인 요인 기반 중재 예시를 제시해주세요.\n\n' +
    'ICF 중재 분류:\n' +
    '1. 환경 요인 중재: 물리적 환경(보조기구, 환경 수정), 사회적 환경(지원, 격려), 제도적 환경(접근성, 정보)\n' +
    '2. 과제 요인 중재: 과제 난이도 조절, 실제 환경에서의 구체적 과제, 목적 지향적 과제\n' +
    '3. 개인 요인 중재: 능력 향상, 동기 부여, 습관 형성, 인지 향상\n\n' +
    '응답 형식 (JSON):\n' +
    '{\n' +
    '  "environmental": ["환경 요인 중재 예시 1", "환경 요인 중재 예시 2", ...],\n' +
    '  "task": ["과제 요인 중재 예시 1", "과제 요인 중재 예시 2", ...],\n' +
    '  "personal": ["개인 요인 중재 예시 1", "개인 요인 중재 예시 2", ...]\n' +
    '}\n\n' +
    '각 카테고리당 4-6개의 구체적이고 실용적인 예시를 제시하세요.';
  
  const userPrompt = '다음 정보를 바탕으로 ICF 코드 "' + icfCode + ' (' + icfTitle + ')"에 대한 중재 예시를 제시해주세요:\n\n' +
    '임상 언어: "' + clinicalText + '"\n' +
    '수행력 점수: ' + (performanceScore !== undefined ? performanceScore : '미입력') + '점\n' +
    '능력 점수: ' + (capacityScore !== undefined ? capacityScore : '미입력') + '점';
  
  const result = callOpenAI(systemPrompt, userPrompt, 1000, 0.5);
  
  // 응답 검증
  if (!result.environmental || !Array.isArray(result.environmental)) {
    result.environmental = [];
  }
  if (!result.task || !Array.isArray(result.task)) {
    result.task = [];
  }
  if (!result.personal || !Array.isArray(result.personal)) {
    result.personal = [];
  }
  
  return result;
}

