/**
 * OpenAI API 서비스
 * OpenAI API 호출을 처리하는 모듈
 */

/**
 * OpenAI API 호출
 * @param {string} systemPrompt - 시스템 프롬프트
 * @param {string} userPrompt - 사용자 프롬프트
 * @param {number} maxTokens - 최대 토큰 수
 * @param {number} temperature - 온도 (기본값: 0.3)
 * @return {Object} 파싱된 JSON 응답
 */
function callOpenAI(systemPrompt, userPrompt, maxTokens, temperature) {
  temperature = temperature || 0.3;
  
  const apiKey = PropertiesService.getScriptProperties().getProperty('OPENAI_API_KEY');
  if (!apiKey) {
    throw new Error('OpenAI API 키가 설정되지 않았습니다.');
  }
  
  const url = 'https://api.openai.com/v1/chat/completions';
  
  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    response_format: { type: 'json_object' },
    temperature: temperature,
    max_tokens: maxTokens || 2000
  };
  
  const options = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + apiKey,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload)
  };
  
  try {
    const response = UrlFetchApp.fetch(url, options);
    const responseCode = response.getResponseCode();
    
    if (responseCode !== 200) {
      const errorText = response.getContentText();
      throw new Error('OpenAI API 오류: ' + responseCode + ' - ' + errorText);
    }
    
    const responseData = JSON.parse(response.getContentText());
    const content = responseData.choices[0].message.content;
    
    if (!content) {
      throw new Error('API 응답이 비어있습니다.');
    }
    
    return JSON.parse(content);
    
  } catch (error) {
    throw new Error('OpenAI API 호출 실패: ' + error.toString());
  }
}

