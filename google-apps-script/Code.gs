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
    // 디버깅: 요청 정보 로깅
    Logger.log('doPost 호출됨');
    Logger.log('e: ' + JSON.stringify(e));
    Logger.log('e.postData: ' + JSON.stringify(e.postData));
    
    // 요청 본문 확인
    if (!e) {
      return ContentService.createTextOutput(JSON.stringify({
        error: '요청 객체가 없습니다.'
      }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (!e.postData) {
      return ContentService.createTextOutput(JSON.stringify({
        error: '요청 본문(postData)이 없습니다. POST 요청의 본문에 JSON 데이터를 포함해주세요.',
        debug: 'e.keys: ' + Object.keys(e).join(', ')
      }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (!e.postData.contents) {
      return ContentService.createTextOutput(JSON.stringify({
        error: '요청 본문 내용(contents)이 비어있습니다.',
        debug: 'postData.keys: ' + (e.postData ? Object.keys(e.postData).join(', ') : 'null')
      }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    Logger.log('요청 본문 내용: ' + e.postData.contents);
    
    let requestData;
    try {
      requestData = JSON.parse(e.postData.contents);
      Logger.log('파싱된 요청 데이터: ' + JSON.stringify(requestData));
    } catch (parseError) {
      Logger.log('JSON 파싱 오류: ' + parseError.toString());
      return ContentService.createTextOutput(JSON.stringify({
        error: 'JSON 파싱 오류: ' + parseError.toString() + '. 요청 본문이 유효한 JSON 형식인지 확인해주세요.',
        debug: '원본 내용: ' + e.postData.contents.substring(0, 200)
      }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    if (!requestData || typeof requestData !== 'object') {
      return ContentService.createTextOutput(JSON.stringify({
        error: '요청 데이터가 올바르지 않습니다. JSON 객체를 전송해주세요.'
      }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
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
      case 'save-assessment':
        result = handleSaveAssessment(requestData);
        break;
      default:
        throw new Error('알 수 없는 엔드포인트: ' + endpoint + '. 지원되는 엔드포인트: match, score-recommendation, intervention-recommendation, save-assessment');
    }
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      error: error.toString(),
      message: '서버 오류가 발생했습니다.'
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
      endpoints: ['match', 'score-recommendation', 'intervention-recommendation', 'save-assessment'],
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

