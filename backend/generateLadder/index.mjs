// endpoint: https://7vwwrzdg6lgwbz44wuuuuvhxcu0xaejt.lambda-url.ap-northeast-2.on.aws/
// nodejs22.x
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'ap-northeast-2' });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'LadderGames';

export const handler = async (event) => {
  try {
    console.log('요청 받음:', event);
    
    // 요청 본문 파싱
    let body;
    try {
      body = JSON.parse(event.body || '{}');
    } catch (parseError) {
      console.error('요청 본문 파싱 오류:', parseError);
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: '잘못된 요청 본문 형식입니다.' 
        })
      };
    }
    
    // 파라미터 추출
    const { maxParticipants, resultItems } = body;
    console.log('요청 파라미터:', { maxParticipants, resultItems });

    // 파라미터 검증
    if (!maxParticipants || typeof maxParticipants !== 'number' || maxParticipants < 2) {
      console.log('유효하지 않은 파라미터:', { maxParticipants });
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: '참여 인원은 최소 2명 이상의 정수여야 합니다.' 
        })
      };
    }
    
    // 결과 항목 검증 및 처리
    const sanitizedResultItems = Array.isArray(resultItems) ? 
      resultItems.slice(0, maxParticipants).map(item => item || '꽝') : 
      Array(maxParticipants).fill('꽝');
    
    if (sanitizedResultItems.length < maxParticipants) {
      // 결과 항목이 부족한 경우 '꽝'으로 채움
      while (sanitizedResultItems.length < maxParticipants) {
        sanitizedResultItems.push('꽝');
      }
    }
    
    console.log('정제된 결과 항목:', sanitizedResultItems);

    // 새 사다리 ID 생성
    const ladderId = generateId();
    console.log('생성된 사다리 ID:', ladderId);

    // 새 사다리 게임 생성
    const newLadder = {
      id: ladderId,
      maxParticipants,
      status: 'waiting', // waiting, in-progress, complete
      createdAt: new Date().toISOString(),
      participants: [], // 참가자 배열
      results: null,    // 게임 결과
      resultItems: sanitizedResultItems // 결과 항목 배열
    };
    console.log('생성할 사다리 게임 데이터:', newLadder);

    // DynamoDB에 저장
    const params = {
      TableName: TABLE_NAME,
      Item: newLadder
    };
    console.log('DynamoDB 저장 파라미터:', params);
    
    await docClient.send(new PutCommand(params));
    console.log('사다리 게임이 성공적으로 생성됨');

    // 응답 데이터 구성
    const responseData = {
      id: ladderId,
      maxParticipants,
      status: 'waiting',
      participants: [],
      resultItems: sanitizedResultItems,
      success: true
    };
    console.log('응답 데이터:', responseData);

    return {
      statusCode: 200,
      body: JSON.stringify(responseData)
    };
  } catch (error) {
    console.error('사다리 생성 중 오류 발생:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: '서버 오류가 발생했습니다.',
        details: error.message || '상세 내용 없음'
      })
    };
  }
};

// 고유 ID 생성 함수
function generateId() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
  