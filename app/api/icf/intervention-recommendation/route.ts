import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다.' },
        { status: 500 }
      )
    }

    const { clinicalText, icfCode, icfTitle, performanceScore, capacityScore } = await request.json()

    if (!clinicalText || !icfCode) {
      return NextResponse.json(
        { error: '임상 언어 텍스트와 ICF 코드가 필요합니다.' },
        { status: 400 }
      )
    }

    const systemPrompt = `당신은 작업치료 및 재활 전문가입니다.
임상 언어와 평가 점수를 분석하여 ICF 코드에 대한 환경/과제/개인 요인 기반 중재 예시를 제시해주세요.

ICF 중재 분류:
1. 환경 요인 중재: 물리적 환경(보조기구, 환경 수정), 사회적 환경(지원, 격려), 제도적 환경(접근성, 정보)
2. 과제 요인 중재: 과제 난이도 조절, 실제 환경에서의 구체적 과제, 목적 지향적 과제
3. 개인 요인 중재: 능력 향상, 동기 부여, 습관 형성, 인지 향상

응답 형식 (JSON):
{
  "environmental": ["환경 요인 중재 예시 1", "환경 요인 중재 예시 2", ...],
  "task": ["과제 요인 중재 예시 1", "과제 요인 중재 예시 2", ...],
  "personal": ["개인 요인 중재 예시 1", "개인 요인 중재 예시 2", ...]
}

각 카테고리당 4-6개의 구체적이고 실용적인 예시를 제시하세요.`

    const userPrompt = `다음 정보를 바탕으로 ICF 코드 "${icfCode} (${icfTitle})"에 대한 중재 예시를 제시해주세요:

임상 언어: "${clinicalText}"
수행력 점수: ${performanceScore !== undefined ? performanceScore : '미입력'}점
능력 점수: ${capacityScore !== undefined ? capacityScore : '미입력'}점

임상 언어의 맥락과 점수를 고려하여 실제로 적용 가능한 구체적인 중재 예시를 제시해주세요.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.5,
      max_tokens: 1000
    })

    const responseContent = completion.choices[0]?.message?.content
    
    if (!responseContent) {
      throw new Error('API 응답이 비어있습니다.')
    }

    const result = JSON.parse(responseContent)

    // 응답 검증
    if (!result.environmental || !Array.isArray(result.environmental)) {
      result.environmental = []
    }
    if (!result.task || !Array.isArray(result.task)) {
      result.task = []
    }
    if (!result.personal || !Array.isArray(result.personal)) {
      result.personal = []
    }

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('중재 추천 API 오류:', error)
    
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API 오류: ${error.message}` },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}


