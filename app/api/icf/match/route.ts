import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { getAllCodes } from '@/data/icf-codes'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// ICF 코드 목록을 프롬프트에 포함하기 위한 문자열 생성
function generateICFCodesContext(): string {
  const codes = getAllCodes()
  return codes.map(code => {
    return `- ${code.code} (${code.title}): ${code.description}
  키워드: ${code.keywords.join(', ')}
  예시: ${code.examples.join(', ')}`
  }).join('\n')
}

export async function POST(request: Request) {
  try {
    // API 키 확인
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API 키가 설정되지 않았습니다. .env.local 파일을 확인하세요.' },
        { status: 500 }
      )
    }

    const { clinicalText } = await request.json()

    if (!clinicalText || typeof clinicalText !== 'string') {
      return NextResponse.json(
        { error: '임상 언어 텍스트가 필요합니다.' },
        { status: 400 }
      )
    }

    // ICF 코드 컨텍스트 생성
    const icfCodesContext = generateICFCodesContext()

    // 시스템 프롬프트
    const systemPrompt = `당신은 ICF(International Classification of Functioning, Disability and Health) 전문가입니다.
임상 언어를 분석하여 관련된 ICF 코드를 찾아주세요.

사용 가능한 ICF 코드 목록:
${icfCodesContext}

응답 형식 (JSON):
{
  "matches": [
    {
      "code": "d450",
      "title": "걷기",
      "confidence": 0.9,
      "rationale": "입력하신 내용에서 '걷기', '보행' 관련 표현이 발견되어 d450 코드와 매칭됩니다."
    }
  ]
}

주의사항:
- confidence는 0.0 ~ 1.0 사이의 값입니다
- 관련성이 높은 코드만 포함하세요 (confidence > 0.5)
- rationale은 구체적이고 명확하게 작성하세요
- 가능한 한 많은 관련 코드를 찾아주세요 (최대 10개까지)
- 임상 언어에서 언급된 모든 기능, 활동, 참여 영역을 포괄적으로 분석하세요
- 하나의 문장에서 여러 ICF 코드가 관련될 수 있으므로, 모든 관련 코드를 포함하세요`

    // 사용자 프롬프트
    const userPrompt = `다음 임상 언어를 분석하여 관련된 ICF 코드를 찾아주세요.
임상 언어에서 언급된 모든 기능, 활동, 참여 영역을 포괄적으로 분석하고, 관련된 모든 ICF 코드를 찾아주세요.
2개 이상의 코드가 관련될 수 있으므로, 가능한 한 많은 관련 코드를 포함해주세요.

임상 언어:
"${clinicalText}"`

    // OpenAI API 호출
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3, // 일관성 있는 결과를 위해 낮은 temperature
      max_tokens: 3000 // 더 많은 코드를 반환하기 위해 토큰 수 증가
    })

    const responseContent = completion.choices[0]?.message?.content
    
    if (!responseContent) {
      throw new Error('API 응답이 비어있습니다.')
    }

    // JSON 파싱
    let result
    try {
      result = JSON.parse(responseContent)
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError)
      throw new Error('API 응답 파싱 실패')
    }

    // 응답 검증 및 정규화
    if (!result.matches || !Array.isArray(result.matches)) {
      return NextResponse.json(
        { error: '잘못된 API 응답 형식입니다.' },
        { status: 500 }
      )
    }

    // confidence 기준으로 정렬 및 필터링
    const matches = result.matches
      .filter((match: any) => match.code && match.confidence > 0.3)
      .sort((a: any, b: any) => b.confidence - a.confidence)
      .slice(0, 10) // 최대 10개

    return NextResponse.json({ matches })

  } catch (error: any) {
    console.error('ICF 매칭 API 오류:', error)
    
    // OpenAI API 오류 처리
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { 
          error: `OpenAI API 오류: ${error.message}`,
          code: error.code 
        },
        { status: error.status || 500 }
      )
    }

    return NextResponse.json(
      { error: error.message || '서버 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}




