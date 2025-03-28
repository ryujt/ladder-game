const fs = require('fs');
const path = require('path');

// 현재 타임스탬프를 버전으로 사용
const version = new Date().getTime();

// build/index.html 파일 읽기
const indexPath = path.resolve(__dirname, 'build', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// JS와 CSS 파일에 버전 쿼리 파라미터 추가
indexHtml = indexHtml.replace(/(?<=src="|href=")([^"]+\.(?:js|css))(?=")/g, '$1?v=' + version);

// 수정된 내용 저장
fs.writeFileSync(indexPath, indexHtml);

console.log('Build version updated:', version); 