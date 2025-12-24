/**
 * Google 스프레드시트 서비스
 * 평가 결과를 Google 스프레드시트에 저장하는 모듈
 */

/**
 * 스프레드시트에 평가 결과 저장
 * @param {Object} assessmentData - 평가 데이터
 * @return {Object} 저장 결과
 */
function saveAssessmentToSpreadsheet(assessmentData) {
  try {
    // 스프레드시트 ID 가져오기 (스크립트 속성에서)
    const spreadsheetId = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
    
    if (!spreadsheetId) {
      throw new Error('스프레드시트 ID가 설정되지 않았습니다. 스크립트 속성에 SPREADSHEET_ID를 설정해주세요.');
    }
    
    // 스프레드시트 열기
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    
    // 시트 이름 가져오기 (없으면 기본값 사용)
    const sheetName = assessmentData.sheetName || '평가 결과';
    let sheet = spreadsheet.getSheetByName(sheetName);
    
    // 시트가 없으면 생성
    if (!sheet) {
      sheet = spreadsheet.insertSheet(sheetName);
      // 헤더 추가
      const headers = [
        '날짜/시간',
        '환자 이름',
        '성별',
        '생년월일',
        '진단명',
        'Core Set',
        'ICF 코드',
        '도메인',
        '평가 항목',
        '점수',
        '메모',
        '임상 언어',
        '평가자 유형'
      ];
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
      sheet.setFrozenRows(1);
    }
    
    // 현재 시간
    const timestamp = new Date();
    const timestampString = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
    
    // 데이터 행 생성
    const rows = [];
    
    // 각 점수에 대해 행 생성
    if (assessmentData.scores && Array.isArray(assessmentData.scores)) {
      assessmentData.scores.forEach(function(score) {
        const row = [
          timestampString,
          assessmentData.patientInfo?.name || '',
          assessmentData.patientInfo?.gender === 'M' ? '남' : assessmentData.patientInfo?.gender === 'F' ? '여' : '',
          assessmentData.patientInfo?.birthDate || '',
          assessmentData.patientInfo?.diagnosisName || '',
          assessmentData.coreSet?.name || '',
          score.icfCode || score.code || '',
          score.domain || '',
          score.title || score.question || '',
          score.score !== undefined ? score.score : '',
          score.notes || '',
          assessmentData.clinicalText || '',
          assessmentData.respondentType === 'therapist' ? '치료사' : '보호자'
        ];
        rows.push(row);
      });
    }
    
    // 행이 없으면 기본 행 하나 추가
    if (rows.length === 0) {
      const row = [
        timestampString,
        assessmentData.patientInfo?.name || '',
        assessmentData.patientInfo?.gender === 'M' ? '남' : assessmentData.patientInfo?.gender === 'F' ? '여' : '',
        assessmentData.patientInfo?.birthDate || '',
        assessmentData.patientInfo?.diagnosisName || '',
        assessmentData.coreSet?.name || '',
        '',
        '',
        '',
        '',
        '',
        assessmentData.clinicalText || '',
        assessmentData.respondentType === 'therapist' ? '치료사' : '보호자'
      ];
      rows.push(row);
    }
    
    // 데이터 추가
    if (rows.length > 0) {
      const lastRow = sheet.getLastRow();
      sheet.getRange(lastRow + 1, 1, rows.length, rows[0].length).setValues(rows);
    }
    
    return {
      success: true,
      message: '평가 결과가 스프레드시트에 저장되었습니다.',
      rowCount: rows.length,
      spreadsheetUrl: spreadsheet.getUrl()
    };
    
  } catch (error) {
    Logger.log('스프레드시트 저장 오류: ' + error.toString());
    throw new Error('스프레드시트 저장 실패: ' + error.toString());
  }
}

/**
 * 스프레드시트에 평가 결과 저장 (간소화된 버전)
 * @param {Object} requestData - 요청 데이터
 * @return {Object} 저장 결과
 */
function handleSaveAssessment(requestData) {
  try {
    const result = saveAssessmentToSpreadsheet(requestData);
    return result;
  } catch (error) {
    return {
      success: false,
      error: error.toString()
    };
  }
}
