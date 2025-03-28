# React 개발 가이드

## 프로젝트 생성 및 설정

### 프로젝트 생성

```bash
npx create-react-app 프로젝트명 --use-npm
```

### 필수 패키지 설치

```bash
npm install axios@1.7.7 react-router-dom@6.27.0 tailwindcss@3.4.14 postcss@8.4.47 autoprefixer@10.4.20 zustand@5.0.1
```

### package.json의 예시

```json
{
  "name": "myapp",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "autoprefixer": "^10.4.20",
    "axios": "^1.7.7",
    "postcss": "^8.4.47",
    "react": "^18.3.1",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.27.0",
    "react-scripts": "5.0.1",
    "tailwindcss": "^3.4.14",
    "web-vitals": "^2.1.4",
    "zustand": "^5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "GENERATE_SOURCEMAP=false react-scripts build && node ./update-build-version.js",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
```

#### update-build-version.js

```javascript
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
```

### Tailwind CSS 설정

```bash
# Tailwind 설정 파일 생성
npx tailwindcss init -p
```

#### tailwind.config.js 수정

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### postcss.config.js
기본적으로 `npx tailwindcss init -p` 명령어를 실행하면 자동으로 생성됩니다.

#### src/index.css 수정

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 기본 폰트 설정 등 추가 스타일 */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

#### 기타 설정 사항

- App.css 파일은 삭제하고 App.js에서 import 구문 제거
- logo.svg 등 불필요한 파일 삭제
- 스타일링은 Tailwind CSS 클래스를 사용

## 기본 폴더 구조

```
react-app
├── src
│   ├── api
│   │   ├── index.js
│   │   └── featureApi.js
│   ├── components
│   │   └── LoadingSpinner.js
│   ├── config
│   ├── pages
│   │   ├── Home.js
│   │   └── Feature.js
│   ├── services
│   ├── stores
│   │   ├── loadingStore.js
│   │   └── featureStore.js
│   ├── styles
│   └── utils
├── update-build-version.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

### 폴더 구조 설명

- **api**: API 통신 관련 코드
- **components**: 재사용 가능한 컴포넌트
- **config**: 환경 설정 파일
- **pages**: 라우트별 페이지 컴포넌트
- **services**: 전역 서비스 로직
- **stores**: 상태 관리 (Zustand 등)
- **styles**: 전역 스타일 및 테마
- **utils**: 유틸리티 함수

## 라우터 설정 예시 (App.js)

```javascript
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useLoadingStore } from './stores/loadingStore';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Feature from './pages/Feature';
import NotFound from './pages/NotFound';

function App() {
  const { isLoading } = useLoadingStore();

  return (
    <BrowserRouter>
      {isLoading && <LoadingSpinner />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feature/:id" element={<Feature />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## API 코드 작성 가이드

* api 호출 결과가 다수의 페이지에 영향을 준다면,
  * store --> api 호출 형태로 구현
  * 결과를 store에 저장하여 사용
  * store의 메소드도 api 결과를 반환하여 직접 사용이 가능하도록 구현
* 결과를 다수의 페이지에서 공유해야하는 상황이 아니면
  * 컴포넌트 내에서 api를 직접 호출하여 사용

### /src/api/index.js

* axios wrapper를 작성하여 사용
* 로딩 상태 관리 등 공통으로 사용되는 동작들을 구현

```javascript
import axios from 'axios';
import { useLoadingStore } from '../stores/loadingStore';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
    useLoadingStore.getState().setIsLoading(true);
    return config;
});

api.interceptors.response.use(
    (response) => {
        useLoadingStore.getState().setIsLoading(false);
        return response;
    },
    (error) => {
        useLoadingStore.getState().setIsLoading(false);
        return Promise.reject(error);
    }
);

export default api;
```

### 기능별 API 파일 예시 (src/api/featureApi.js)

```javascript
import api from './index';

// API 함수 구현
export const getFeature = async (id) => {
    try {
        const response = await api.get(`/feature/${id}`);
        return response.data;
    } catch (error) {
        console.error('API 호출 에러:', error);
        throw error;
    }
};

export const createFeature = async (data) => {
    try {
        const response = await api.post('/feature', data);
        return response.data;
    } catch (error) {
        console.error('API 호출 에러:', error);
        throw error;
    }
};
```

## 상태 관리 (Zustand)

### 로딩 상태 관리 (src/stores/loadingStore.js)

```javascript
import { create } from 'zustand';

export const useLoadingStore = create((set) => ({
    isLoading: false,
    setIsLoading: (isLoading) => set({ isLoading }),
}));
```

### 기능별 상태 관리 (src/stores/featureStore.js)

```javascript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getFeature, createFeature } from '../api/featureApi';

const useFeatureStore = create(
    ...
);

export default useFeatureStore;
```

