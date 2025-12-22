/**
 * ICF 기반 임상언어분석 API
 * Google Apps Script 버전 - 메인 진입점
 * 
 * 파일 구조:
 * - Code.gs (이 파일): HTTP 요청 처리 및 라우팅
 * - ICFCodes.gs: ICF 코드 데이터베이스
 * - OpenAIService.gs: OpenAI API 호출 로직
 * - Handlers.gs: 각 엔드포인트 핸들러
 * 
 * 배포 방법:
 * 1. Google Apps Script 편집기에서 새 프로젝트 생성
 * 2. 모든 .gs 파일을 업로드하거나 복사
 * 3. 배포 > 새 배포 > 웹 앱으로 배포
 * 4. 실행 권한: "나"로 설정
 * 5. 액세스 권한: "모든 사용자"로 설정
 * 6. 배포 URL을 복사하여 프론트엔드에서 사용
 */

/**
 * OPTIONS 요청 처리 (CORS preflight)
 * Google Apps Script 웹 앱은 자동으로 CORS를 처리하므로 헤더 설정 불필요
 * @return {TextOutput} 빈 응답
 */
function doOptions() {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

/**
 * POST 요청 처리 - 메인 라우터
 * @param {Object} e - 이벤트 객체
 * @return {TextOutput} JSON 응답
 */
function doPost(e) {
  try {
    const requestData = JSON.parse(e.postData.contents);
    const endpoint = requestData.endpoint || 'match';
    
    let result;
    switch(endpoint) {
      case 'match':
        result = handleMatch(requestData);
        break;
      case 'score-recommendation':
        result = handleScoreRecommendation(requestData);
        break;
      case 'intervention-recommendation':
        result = handleInterventionRecommendation(requestData);
        break;
      default:
        throw new Error('알 수 없는 엔드포인트: ' + endpoint);
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString()
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * GET 요청 처리 (테스트용)
 * @param {Object} e - 이벤트 객체 (선택사항)
 * @return {TextOutput} JSON 응답
 */
function doGet(e) {
  try {
    return ContentService.createTextOutput(JSON.stringify({
      message: 'ICF API 서버가 실행 중입니다.',
      endpoints: ['match', 'score-recommendation', 'intervention-recommendation'],
      version: '1.0.0',
      usage: '이 API는 POST 요청을 사용합니다. endpoint 필드를 포함하여 요청하세요.'
    }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString(),
      message: '서버 오류가 발생했습니다.'
    }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

