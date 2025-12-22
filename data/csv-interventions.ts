// CSV 데이터에서 추출한 ICF 코드별 실제 치료 활동 예시
// 통합 문서1.csv 기반

export interface CSVIntervention {
  code: string
  examples: string[]
}

// CSV 데이터에서 추출한 실제 치료 활동 예시
export const CSV_INTERVENTIONS: Record<string, string[]> = {
  b110: [
    '의식기능 평가 및 모니터링',
    'seizure 증상 관찰 및 대응'
  ],
  b126: [
    '자기효능감 향상 목표 설정',
    '성공 경험 제공을 통한 긍정적 반응 유도',
    '자기표현 격려'
  ],
  b130: [
    '과제 흥미를 높이는 활동 제공',
    '자발적 참여를 유도하는 과제',
    '치료사 지시에 따른 수행 의지 향상',
    '자기효능감 향상 목표(스스로 과제 완수)',
    '실패 후 재도전 기회 제공',
    '단계별 안내 시 수행 향상',
    '부분적 성공 경험 제공'
  ],
  b140: [
    'sustain attention 향상을 위한 과제',
    '놀이 중 주의 집중 시간 연장',
    '집중·문제해결 연계 과제',
    '지속 주의력 향상 활동',
    '의식/주의/시지각 기능 통합 목표'
  ],
  b152: [
    '신체적 guide를 통한 감정 반응 관찰',
    '영상/어플을 활용한 긍정적 반응 유도',
    '감정 안정 유지 활동',
    '감정 조절 전략 제공',
    '도전행동 대응 전략'
  ],
  b156: [
    '발뒤꿈치로 휴지 밟아 body schema 증가',
    'sensory kit로 상지 감각 자극',
    '과각성 시 감각조절(sensory modulation) 적용',
    '시각·언어 cue 제공',
    '감각자극으로 자발적 동작 유도'
  ],
  b164: [
    '고차 인지기능(계획, 문제해결 등) 훈련',
    '자기결정·자기조절 언어적 피드백',
    '대처전략 교육',
    '새로운 것 시도 기회 제공',
    '자신의 한계 알기 등 정체성 개발',
    '행동문제에 대한 직접 피드백·긍정 강화'
  ],
  b167: [
    '놀이 상황에서 자발적 언어 사용 유도',
    '색 이름 명명 정확성 향상',
    '자기표현 어려움 시 열린 질문으로 유도'
  ],
  b172: [
    '수 개념 및 금액 이해 향상',
    '계산 기능 강화 활동'
  ],
  b235: [
    '시각 및 전정계 자극 제공',
    '안뜰기능 향상 활동'
  ],
  b260: [
    '수동적 관절 운동으로 고유수용감각 촉진',
    '각성 촉진 활동'
  ],
  b280: [
    'impingement control',
    '통증 관리 전략',
    '워커 사용 시 관절 통증 관리'
  ],
  b440: [
    'breathing exercise',
    'rib cage mobilization',
    'RAB breathing with scoliosis',
    '호흡기능 향상 활동'
  ],
  b710: [
    'pelvic mobilization',
    'U/E & L/E mobilization',
    'thoracic stretching',
    'spine mobilization',
    'pelvic 3D movement guide',
    'hip joint resistive movement guide',
    'shoulder joint mobilization',
    '관절의 운동성기능 향상'
  ],
  b730: [
    'Q-muscle & hamstring eccentric, concentric repeat',
    'core muscle strengthening',
    'Lt. U/E gentle manual exercise & strengthening',
    'scapular stability',
    'proximal muscle activation increase',
    'hip extensor·quadriceps strengthening',
    'core strengthening·pelvic neutral guide',
    '근력기능 향상 활동'
  ],
  b735: [
    '근지구력 향상',
    'proximal tone build up',
    'u/e tone build up (biceps, triceps)',
    'postural tone increase',
    '근긴장도기능 향상'
  ],
  b740: [
    '근지구력 강화를 위해 운동 난이도를 조절하여 제공',
    '근지구력 향상 활동'
  ],
  b755: [
    'trunk stability increase',
    'trunk-pelvic upright',
    '허리를 펴라고 지시하면 upright 시도',
    'increase trunk balance control',
    'dynamic stability 증가',
    '측와위에서 우측 체간 elongation',
    'dynamic balance control guide',
    '불수의적 움직임반응기능 향상'
  ],
  b760: [
    '하지의 지면 반발력 이용, push off 하여 하지 신전근 기능적 협응 촉진',
    '근긴장 향상',
    '간헐적 자발 움직임 관찰',
    '시운동협응 제한 시 색 구분선 제공으로 훈련 참여',
    'eye–hand coordination activity',
    'Rt. side awareness 증진',
    'Rt side body scheme increase',
    'midline orientation (head in midline)',
    'right alignment experience',
    'head midline control',
    'bridge 자세를 통한 core muscle activation',
    'trunk stability increase',
    'scapular stabilization',
    '수의적 움직임기능 향상'
  ],
  b780: [
    '3초 이상 position sustain 시 left l/e 떨림 관찰',
    'toe intrinsic m activation',
    'pelvic muscle massage',
    'pec m. release',
    '근육기능 및 움직임기능에 관련된 감각 향상'
  ],
  d110: [
    '아이패드 시각자극 프로그램 활용',
    '보기 기능 향상 활동'
  ],
  d131: [
    '원인과 결과의 논리적 연결성 경험',
    '인지 기능 향상'
  ],
  d155: [
    '환경 적응 참여 증진',
    '장난감을 만지며 아동의 사회성, 인지, 감각·운동 발달',
    '기술습득하기 향상'
  ],
  d160: [
    '좋아하는 영상 및 노래를 들으며 환경 적응',
    '소리 매칭, 지시에 맞게 선택하기',
    '시지각 활동지를 이용한 시지각 증진',
    'Lt. side midline 접근',
    'Visual perception(spatial relationship) increase',
    '물체 위치 시각 탐색',
    '주의집중하기 향상'
  ],
  d166: [
    '읽기(문자 정보 이해)',
    '읽기 기능 향상'
  ],
  d170: [
    '색칠 시 범위 확대',
    '쓰기 전 훈련과제',
    '숫자 쓰기',
    '숫자의 공간 위치관계 이해에 도움 요구',
    '점 위치에 맞게 도형 그리기',
    '글씨쓰기·색칠·그리기 수행',
    '칸 안에 두 글자 이상 단어 쓰기',
    '글씨쓰기 및 받아쓰기',
    '쓰기 기능 향상'
  ],
  d172: [
    '숫자와 기수/서수 개념 일반화',
    '자릿수 넘어가는 덧셈 연습',
    '뺄셈 어려움 대응',
    '계산하기 향상'
  ],
  d175: [
    'problem solving 보드게임',
    'calibrates, problem solving',
    '다중 과제수행하기 향상'
  ],
  d220: [
    '제공된 과제를 이해하고 적극적으로 참여',
    '과제 시행 방법에 대해 이해가 어려웠으며 치료사에 의해 수동적으로 참여',
    '과제를 시작 위해 추가적인 설명이 필요',
    '과제 지속을 위해 간헐적으로 언어적 강화가 필요',
    'process skills training (restores, inquires)',
    '과제 수행 능력 향상'
  ],
  d230: [
    '독립적인 일상생활에 참여하기',
    '독립적 활동 완성 유도',
    '일상 문제 리스트 업 후 도움 제공',
    '동작 속도 느리지만 패턴 적절',
    '일상생활 수행하기 향상'
  ],
  d330: [
    '"아파" 언어 표현',
    '말하기 기능 향상'
  ],
  d350: [
    '자신이 하고자 하는 의사표현이 있음',
    '대화 기능 향상'
  ],
  d360: [
    '일정·방법·준비전략 중재, 자료를 PPT로 유형화 계획',
    'iPad 화면에서 목표 외 영역 터치(정확도 미흡)',
    '키오스크 앱 사용 연습',
    '의사소통장치 및 기술 사용하기 향상'
  ],
  d410: [
    'resistive creeping',
    '체중이동 훈련(자세 전환)',
    'kneeling→half‑kneeling 전환',
    'quadruped weight shift(AP·LAT·diagonal)',
    '4‑point→kneeling 전환',
    '사다리 잡고 일어나며 체중이동 경험 유도',
    'side-lying rolling 연습',
    '신체부위 가리키기 연습',
    'gym ball supine hip&knee movement guide',
    'crunch on gymball',
    'half kneeling to stand',
    'standing with back support',
    '관절 변형 예방 훈련',
    '관절 안정 움직임 교육',
    'sit to stand repeat',
    'sit to stand',
    'kneeling',
    'rolling',
    'lt. weight transfer guide',
    'quadrupedal position',
    'weight transfer in half kneeling',
    'standing with support + 청각 자극 U/E 촉진',
    'support standing',
    'both foot weight bearing',
    '균형 필요한 일상활동 참여',
    '기본자세 바꾸기 향상'
  ],
  d415: [
    'prone on elbow position sustain for shoulder stability',
    '뚜껑 열기 위한 적절 자세 지도',
    'Rt trunk elongation, kneeling→half‑kneeling sustain',
    'one leg standing',
    'sustain sitting without left collapse',
    'upright sitting posture',
    'dynamic standing balance increase',
    'sitting',
    'sitting weight shift',
    '장애물 건너며 균형잡기',
    'trunk upright sitting',
    '자세 유지하기 향상'
  ],
  d430: [
    '냉장고 문 열기, 키보드 치기, 물건 들어올리기 등 수행',
    '물건 들어올리기와 나르기 향상'
  ],
  d440: [
    '쥐고 놓기 어려움/손끝 긁는 패턴',
    'raking grasp에서 palmar grasp로 유도',
    'raking grasp pattern 관찰',
    '색·모양에 맞게 peg 위치시키기',
    '가위질 후 풀로 붙이기',
    'finger로 작은 물건 잡기 목표',
    'dissociated finger movement 훈련',
    '관심 있는 물건 만져보기',
    'Rt. hand로 고정, Lt. hand로 object 꺼내기',
    '집게로 구슬 잡아 올리기',
    '집게 사용 시 4th finger 사용',
    '다양한 도구 조작을 하며 양손 사용 연습',
    '물건 잡거나 조작 → 수의적 움직임 조절',
    '운동학습 기반 기능적 과제 수행',
    'putty로 bimanual activity',
    '골대에 공 넣기(midline bimanual)',
    '아이패드 놀이 → hand function 향상',
    '물을 양손 모아 받기 어려움',
    'voluntary grasp/release',
    'sound book 왼손으로 누르기',
    'Bilateral U/E skill increase',
    'Lt. fine motor skill 향상',
    '곡선 자르기 가위 사용',
    '컬러 팝보드 도안 맞추기',
    'fine motor & coordination & dissociation movement → 작은 페그보드 사용',
    '라파엘 스마트 페그보드 활동',
    '양손 사용해 목적있는 움직임 수행',
    'shoulder~finger handling',
    '손의 섬세한 사용 향상'
  ],
  d445: [
    '게임컨텐츠를 활용하여 상체의 움직임 과제에 참여함',
    '리처, 키보드 클리커 등 다양한 보조도구 사용하여 일상생활 참여 경험하기',
    'task 이용하여 rt.side u/e 사용 유도',
    '앉은 상태에서 right side hand만 사용하여 ring task 유도',
    'bilateral hand coordination increase',
    'sitting position에서의 U/E Ex. 진행',
    '상지 기능 회복을 위한 mirror therapy',
    '최대 도움으로 장난감 조작 위한 팔 움직임 가능',
    '눈‑손 협응·도구 조작 과제 설정',
    '3-jaw grasp 유지하여 글쓰기',
    'pegboard 페그 빼기',
    'quadruped on gym ball, 한손 지지·풍선치기',
    'putty 속 구슬 찾기',
    '체간-상지 협응 향상',
    'Lt. U/E exercise',
    'sitting U/E exercise',
    'pushing arm 유도',
    'antigravity 팔 들기 유지',
    '손과 팔의 사용 향상'
  ],
  d450: [
    'support gait',
    'mustang walker gait (신발 착용 후 gait 시행, 평소보다 l/e 떨림 빈번)',
    'resistive sideward walking',
    'kneeling walk',
    'gait with support',
    'treadmill gait in gut axis',
    'heel contact',
    'creeping',
    'gait training',
    '전방워커로 L/E grading mov\'t guide',
    '걷기 향상'
  ],
  d455: [
    '링피트 뛰기 활동',
    'aerobic exercise',
    '계단 오르내리기(한손잡고)',
    'treadmill running 유도',
    'jumping repeat',
    '이동하기 향상'
  ],
  d460: [
    '다양한 장소에서 이동하기 위한 환경 수정 및 조정',
    '장소 이동하기',
    '다양한 장소로 이동하기 향상'
  ],
  d510: [
    '액체 비누로 신체 일부 씻기 훈련',
    '손씻기 활동',
    'self-care(세수하기)',
    '안전바 잡고 양치·세수',
    '씻기 향상'
  ],
  d520: [
    'ADL training: 손톱정리하기',
    '보조도구 사용하여 Rt side 손톱정리 연습',
    '손톱정리 시 사선 정리에 연습 필요',
    '머리 묶기',
    '양치 활동 순서카드 따라하기',
    '신체일부 관리하기 향상'
  ],
  d540: [
    '병원복 단추 채우기 연습',
    '작은 단추 잡아 반대쪽에서 빼기 기술 향상',
    '양말신기(앞/뒤, 위치 학습)',
    '옷 입고 벗기',
    '옷 입고 벗기 향상'
  ],
  d550: [
    '젓가락으로 다양한 물체 옮기기',
    '먹기 향상'
  ],
  d620: [
    '마트 방문하여 물건 구매',
    '상품과 서비스획득 향상'
  ],
  d630: [
    '간단한 식사 준비 목표 설정',
    '반찬 뚜껑 열고 닫기',
    'bimanual therapy(밥그릇+수저)',
    '식사준비하기 향상'
  ],
  d640: [
    '조리도구 안전 사용 훈련',
    '안경 닦기',
    '집안일하기 향상'
  ],
  d710: [
    '색칠하기 과제와 사회적 상호작용 놀이 통합',
    '사회적 상호작용 촉진 위해 모델링 활용',
    '놀이 지속성 향상을 위한 언어적/신체적 촉진 전략',
    '다인 소통 회피 경향 대응',
    '의도적 타인과의 소통 경험 기회 제공',
    '자기 관리 주의사항 교육 및 도움 요청 방법 훈련',
    'joint attention, 1 step obey 간헐적 반응',
    '1 step obey, 호명 반응 어려움 대응',
    '기본적인 대인상호작용 향상'
  ],
  d820: [
    '학교 교육 참여',
    '학교교육 향상'
  ]
}

// ICF 코드에 맞는 CSV 기반 중재 예시 가져오기
export function getCSVInterventions(code: string): string[] {
  return CSV_INTERVENTIONS[code] || []
}


