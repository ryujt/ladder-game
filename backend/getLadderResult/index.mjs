// endpoint: https://75bxl3tptvznaiiszx42wony5u0kkckg.lambda-url.ap-northeast-2.on.aws/
// nodejs22.x
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({ region: 'ap-northeast-2' });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'LadderGames';

export const handler = async (event) => {
  try {
    console.log('요청 받음 (전체):', JSON.stringify(event, null, 2));
    console.log('요청 메서드:', event.requestContext?.http?.method || 'UNKNOWN');
    
    // ladderId 추출 (여러 소스에서 시도)
    let ladderId;
    
    // 1. URL 쿼리스트링 파라미터에서 추출 시도 (GET 요청의 주요 위치)
    if (event.queryStringParameters && event.queryStringParameters.ladderId) {
      ladderId = event.queryStringParameters.ladderId;
      console.log('쿼리스트링에서 ladderId 추출:', ladderId);
    }
    
    // 2. URL 경로 파라미터에서 추출 시도
    else if (event.pathParameters && event.pathParameters.ladderId) {
      ladderId = event.pathParameters.ladderId;
      console.log('경로 파라미터에서 ladderId 추출:', ladderId);
    }
    
    // 3. 요청 본문에서 추출 시도 (POST 요청의 주요 위치)
    else if (event.body) {
      try {
        const body = JSON.parse(event.body);
        console.log('파싱된 요청 본문:', body);
        
        if (body.ladderId) {
          ladderId = body.ladderId;
          console.log('요청 본문에서 ladderId 추출:', ladderId);
        }
      } catch (parseError) {
        console.error('요청 본문 파싱 오류:', parseError);
      }
    }
    
    console.log('최종 추출된 ladderId:', ladderId);

    // ladderId 검증
    if (!ladderId) {
      console.log('사다리 ID 누락');
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: '사다리 ID가 필요합니다.', 
          received: { 
            body: event.body,
            pathParams: event.pathParameters,
            queryParams: event.queryStringParameters 
          }
        })
      };
    }

    // DynamoDB에서 사다리 정보 조회
    const params = {
      TableName: TABLE_NAME,
      Key: { id: ladderId }
    };
    console.log('DynamoDB 조회 파라미터:', params);

    const getResult = await docClient.send(new GetCommand(params));
    console.log('DynamoDB 조회 결과:', getResult);
    
    const { Item: ladder } = getResult;

    // 사다리 게임이 존재하지 않는 경우
    if (!ladder) {
      console.log('사다리 게임 없음:', ladderId);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: '해당 사다리 게임을 찾을 수 없습니다.' })
      };
    }
    
    console.log('찾은 사다리 게임:', ladder);

    // 응답 데이터 구성
    const responseData = {
      id: ladder.id,
      status: ladder.status || 'unknown',
      maxParticipants: ladder.maxParticipants,
      currentParticipants: ladder.participants ? ladder.participants.length : 0,
      participants: ladder.participants || [],
      results: ladder.results || null,
      isComplete: ladder.status === 'complete',
      success: true
    };
    console.log('응답 데이터:', responseData);

    return {
      statusCode: 200,
      body: JSON.stringify(responseData)
    };
  } catch (error) {
    console.error('사다리 결과 조회 중 오류 발생:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: '서버 오류가 발생했습니다.',
        details: error.message || '상세 내용 없음'
      })
    };
  }
};
  