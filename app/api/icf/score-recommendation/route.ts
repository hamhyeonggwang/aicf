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

    const { clinicalText, icfCode, icfTitle } = await request.json()

    if (!clinicalText || !icfCode) {
      return NextResponse.json(
        { error: '임상 언어 텍스트와 ICF 코드가 필요합니다.' },
        { status: 400 }
      )
    }

    const systemPrompt = `당신은 ICF(International Classification of Functioning, Disability and Health) 평가 전문가입니다.
임상 언어를 분석하여 ICF 코드에 대한 수행력(Performance)과 능력(Capacity) 점수를 추천해주세요.

ICF Qualifier 체계:
- 0점: 문제 없음 (No problem) - 0-4% 정도의 문제
- 1점: 경미한 문제 (Mild problem) - 5-24% 정도의 문제
- 2점: 중간 정도 문제 (Moderate problem) - 25-49% 정도의 문제
- 3점: 심각한 문제 (Severe problem) - 50-95% 정도의 문제
- 4점: 완전한 문제 (Complete problem) - 96-100% 정도의 문제

중요한 구분:
1. 능력(Capacity): 표준 환경에서의 최대 수행 능력
   - 이상적인 환경에서 개인이 할 수 있는 최대 능력
   - 환경적 제약이 없는 상태에서의 기능적 능력
   - 예: 치료실에서 보조 없이 걷기, 안전한 환경에서 옷 입기

2. 수행력(Performance): 실제 환경에서의 수행 수준
   - 일상생활의 실제 환경에서 보이는 수행 수준
   - 환경적 제약, 사회적 요인 등을 고려한 실제 수행
   - 예: 집에서 보조기구 없이 걷기, 복잡한 환경에서 옷 입기

분석 시 고려사항:
- 능력 점수는 개인의 기능적 능력 자체를 평가
- 수행력 점수는 환경적 요인을 포함한 실제 수행을 평가
- 수행력이 능력보다 낮으면 환경적 제약이 있음을 의미
- 수행력이 능력과 같거나 높으면 환경이 촉진적이거나 능력이 실제로 높음을 의미

응답 형식 (JSON):
{
  "performanceScore": 2,
  "capacityScore": 1,
  "rationale": "임상 언어에서 발견된 구체적 근거를 간결하게 설명. 능력과 수행력의 차이와 그 이유를 명확히 설명"
}`

    const userPrompt = `다음 임상 언어를 분석하여 ICF 코드 "${icfCode} (${icfTitle})"에 대한 점수를 추천해주세요:

임상 언어: "${clinicalText}"

분석 지침:
1. 능력(Capacity) 점수: 표준 환경(이상적 환경, 보조 없음)에서의 최대 수행 능력을 평가
   - 임상 언어에서 개인의 기능적 능력 자체를 찾아 평가
   - 예: "독립적으로 걷기 가능" → 능력 점수 낮음 (0-1점)
   - 예: "보조기구 없이 불가능" → 능력 점수 높음 (3-4점)

2. 수행력(Performance) 점수: 실제 환경(일상생활 환경)에서의 수행 수준을 평가
   - 실제 환경의 제약, 복잡성, 사회적 요인을 고려
   - 예: "평지에서는 가능하나 계단은 어려움" → 수행력 중간 (2점)
   - 예: "집에서는 가능하나 밖에서는 불가능" → 수행력이 능력보다 낮을 수 있음

3. 능력과 수행력의 차이 분석:
   - 수행력 < 능력: 환경적 제약이 있음 (예: 보조기구 필요, 환경 복잡함)
   - 수행력 = 능력: 환경이 중립적이거나 능력이 실제 수행과 일치
   - 수행력 > 능력: 환경이 촉진적이거나 실제 환경에서 더 잘 수행

각 점수를 0-4점 척도로 추천하고, 능력과 수행력의 차이와 그 이유를 명확히 설명해주세요.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2, // 더 일관성 있는 결과를 위해 낮춤
      max_tokens: 800 // rationale을 더 자세히 작성하기 위해 증가
    })

    const responseContent = completion.choices[0]?.message?.content
    
    if (!responseContent) {
      throw new Error('API 응답이 비어있습니다.')
    }

    const result = JSON.parse(responseContent)

    // 점수 검증
    if (typeof result.performanceScore !== 'number' || result.performanceScore < 0 || result.performanceScore > 4) {
      result.performanceScore = 2 // 기본값
    }
    if (typeof result.capacityScore !== 'number' || result.capacityScore < 0 || result.capacityScore > 4) {
      result.capacityScore = 2 // 기본값
    }

    return NextResponse.json(result)

  } catch (error: any) {
    console.error('점수 추천 API 오류:', error)
    
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


