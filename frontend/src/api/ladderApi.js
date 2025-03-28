import api from './index';

// API 엔드포인트 URL
export const API_ENDPOINTS = {
  GENERATE_LADDER: 'https://7vwwrzdg6lgwbz44wuuuuvhxcu0xaejt.lambda-url.ap-northeast-2.on.aws/',
  JOIN_LADDER: 'https://622jankfwxhpe3ow3xhzkc2y4i0eunzq.lambda-url.ap-northeast-2.on.aws/',
  GET_LADDER_RESULT: 'https://75bxl3tptvznaiiszx42wony5u0kkckg.lambda-url.ap-northeast-2.on.aws/'
};

// 사다리 생성 API
export const generateLadder = async (maxParticipants) => {
    try {
        console.log('사다리 생성 요청:', { maxParticipants });
        const response = await api.post(API_ENDPOINTS.GENERATE_LADDER, { maxParticipants });
        console.log('사다리 생성 응답 전체:', response);
        console.log('사다리 생성 응답 데이터:', response.data);
        
        // 응답 데이터가 문자열인 경우 JSON으로 파싱
        let parsedData;
        if (typeof response.data === 'string') {
          try {
            parsedData = JSON.parse(response.data);
            console.log('파싱된 응답 데이터:', parsedData);
          } catch (parseError) {
            console.error('응답 데이터 파싱 오류:', parseError);
            parsedData = { error: '응답 데이터 파싱 오류' };
          }
        } else {
          parsedData = response.data;
        }
        
        console.log('최종 반환 데이터:', parsedData);
        return parsedData;
    } catch (error) {
        console.error('사다리 생성 에러:', error);
        console.error('에러 상세 정보:', error.response?.data || error.message);
        throw error;
    }
};

// 사다리 참가 API
export const joinLadder = async (ladderId, name, position) => {
    try {
        console.log('사다리 참가 요청:', { ladderId, name, position });
        
        // Lambda에서 ladderId를 본문 데이터로 가져오는지 확인
        const response = await api.post(API_ENDPOINTS.JOIN_LADDER, { 
            ladderId,
            name, 
            position 
        });
        console.log('사다리 참가 응답 전체:', response);
        console.log('사다리 참가 응답 데이터:', response.data);
        
        // 응답 데이터가 문자열인 경우 JSON으로 파싱
        let parsedData;
        if (typeof response.data === 'string') {
          try {
            parsedData = JSON.parse(response.data);
            console.log('파싱된 응답 데이터:', parsedData);
          } catch (parseError) {
            console.error('응답 데이터 파싱 오류:', parseError);
            parsedData = { error: '응답 데이터 파싱 오류' };
          }
        } else {
          parsedData = response.data;
        }
        
        console.log('최종 반환 데이터:', parsedData);
        return parsedData;
    } catch (error) {
        console.error('사다리 참가 에러:', error);
        console.error('에러 상세 정보:', error.response?.data || error.message);
        throw error;
    }
};

// 사다리 결과 확인 API
export const getLadderResult = async (ladderId) => {
    try {
        console.log('사다리 결과 확인 요청:', { ladderId });
        
        // URL에 ladderId를 쿼리스트링으로 포함 (POST 대신 GET 사용)
        const url = `${API_ENDPOINTS.GET_LADDER_RESULT}?ladderId=${ladderId}`;
        console.log('요청 URL:', url);
        
        const response = await api.get(url);
        console.log('사다리 결과 확인 응답 전체:', response);
        console.log('사다리 결과 확인 응답 데이터:', response.data);
        
        // 응답 데이터가 문자열인 경우 JSON으로 파싱
        let parsedData;
        if (typeof response.data === 'string') {
          try {
            parsedData = JSON.parse(response.data);
            console.log('파싱된 응답 데이터:', parsedData);
          } catch (parseError) {
            console.error('응답 데이터 파싱 오류:', parseError);
            parsedData = { error: '응답 데이터 파싱 오류' };
          }
        } else {
          parsedData = response.data;
        }
        
        console.log('최종 반환 데이터:', parsedData);
        return parsedData;
    } catch (error) {
        console.error('사다리 결과 확인 에러:', error);
        console.error('에러 상세 정보:', error.response?.data || error.message);
        throw error;
    }
}; 