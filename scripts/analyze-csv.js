const fs = require('fs');
const path = require('path');

// CSV 파일 읽기
const csvPath = '/Users/ham1234/Desktop/통합 문서1.csv';
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// CSV 파싱
const lines = csvContent.split('\n').filter(line => line.trim());
const headers = lines[0].split(',');

const data = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  // CSV 파싱 (쉼표로 분리, 따옴표 처리)
  const parts = [];
  let current = '';
  let inQuotes = false;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current.trim());
  
  if (parts.length >= 3) {
    data.push({
      clinicalText: parts[0],
      domain: parts[1],
      icfCode: parts[2],
      description: parts[3] || ''
    });
  }
}

// ICF 코드별로 그룹화
const codeGroups = {};
data.forEach(item => {
  if (!codeGroups[item.icfCode]) {
    codeGroups[item.icfCode] = {
      code: item.icfCode,
      domain: item.domain,
      description: item.description,
      examples: []
    };
  }
  codeGroups[item.icfCode].examples.push(item.clinicalText);
});

// 통계 출력
console.log('=== CSV 분석 결과 ===\n');
console.log(`총 데이터 수: ${data.length}개\n`);
console.log(`고유 ICF 코드 수: ${Object.keys(codeGroups).length}개\n`);

// 도메인별 통계
const domainStats = {};
data.forEach(item => {
  domainStats[item.domain] = (domainStats[item.domain] || 0) + 1;
});

console.log('도메인별 분포:');
Object.entries(domainStats).forEach(([domain, count]) => {
  console.log(`  ${domain}: ${count}개`);
});

console.log('\n=== ICF 코드별 예시 (상위 20개) ===\n');
const sortedCodes = Object.values(codeGroups)
  .sort((a, b) => b.examples.length - a.examples.length)
  .slice(0, 20);

sortedCodes.forEach(({ code, domain, description, examples }) => {
  console.log(`${code} (${domain}) - ${description}`);
  console.log(`  예시 수: ${examples.length}개`);
  console.log(`  샘플: ${examples[0]}`);
  console.log('');
});

// JSON으로 저장
const output = {
  totalCount: data.length,
  uniqueCodes: Object.keys(codeGroups).length,
  domainStats,
  codes: Object.values(codeGroups).map(({ code, domain, description, examples }) => ({
    code,
    domain,
    description,
    exampleCount: examples.length,
    sampleExamples: examples.slice(0, 3)
  }))
};

fs.writeFileSync(
  path.join(__dirname, '../data/csv-analysis.json'),
  JSON.stringify(output, null, 2),
  'utf-8'
);

console.log('분석 결과가 data/csv-analysis.json에 저장되었습니다.');




