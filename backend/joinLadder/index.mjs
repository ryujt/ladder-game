// endpoint: https://622jankfwxhpe3ow3xhzkc2y4i0eunzq.lambda-url.ap-northeast-2.on.aws/
// nodejs22.x
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

// DynamoDB 클라이언트 설정
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
    
    const { ladderId, name, position } = body;
    
    console.log('요청 파라미터:', { ladderId, name, position });

    // 필수 파라미터 검증
    if (!ladderId || !name || position === undefined) {
      console.log('필수 파라미터 누락:', { ladderId, name, position });
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          error: '필수 정보가 누락되었습니다. ladderId, name, position이 필요합니다.' 
        })
      };
    }

    // 사다리 게임 정보 가져오기
    const getLadderParams = {
      TableName: TABLE_NAME,
      Key: { id: ladderId }
    };
    console.log('DynamoDB 조회 파라미터:', getLadderParams);

    const getResult = await docClient.send(new GetCommand(getLadderParams));
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

    // 참가자 정보 초기화
    if (!ladder.participants) {
      ladder.participants = [];
    }

    // 이름 중복 검사
    if (ladder.participants.some(p => p.name === name)) {
      console.log('이름 중복:', name);
      return {
        statusCode: 409,
        body: JSON.stringify({ error: '이미 같은 이름으로 참가한 사용자가 있습니다.' })
      };
    }

    // 위치 중복 검사
    if (ladder.participants.some(p => p.position === position)) {
      console.log('위치 중복:', position);
      return {
        statusCode: 409,
        body: JSON.stringify({ error: '이미 선택된 위치입니다.' })
      };
    }

    // 인원 초과 검사
    if (ladder.participants.length >= ladder.maxParticipants) {
      console.log('인원 초과:', { 현재: ladder.participants.length, 최대: ladder.maxParticipants });
      return {
        statusCode: 409,
        body: JSON.stringify({ error: '참가 인원이 초과되었습니다.' })
      };
    }

    // 새 참가자 추가
    const newParticipant = { name, position };
    ladder.participants.push(newParticipant);
    console.log('참가자 추가 후:', ladder.participants);

    // 모든 참가자가 다 찼는지 확인
    const isComplete = ladder.participants.length === ladder.maxParticipants;
    console.log('참가 완료 여부:', isComplete);
    
    // 완료되었다면 사다리 결과 생성
    if (isComplete && !ladder.results) {
      ladder.results = generateLadderResults(ladder.participants, ladder.maxParticipants);
      ladder.status = 'complete';
      console.log('생성된 결과:', ladder.results);
    }

    // DynamoDB 업데이트
    // status는 예약어이므로 ExpressionAttributeNames 사용
    const updateParams = {
      TableName: TABLE_NAME,
      Key: { id: ladderId },
      UpdateExpression: 'SET participants = :participants, #s = :statusValue, results = :results',
      ExpressionAttributeNames: {
        '#s': 'status'
      },
      ExpressionAttributeValues: {
        ':participants': ladder.participants,
        ':statusValue': isComplete ? 'complete' : 'in-progress',
        ':results': ladder.results || null
      },
      ReturnValues: 'ALL_NEW'
    };
    console.log('DynamoDB 업데이트 파라미터:', updateParams);

    const updateResult = await docClient.send(new UpdateCommand(updateParams));
    console.log('DynamoDB 업데이트 결과:', updateResult);
    
    const { Attributes: updatedLadder } = updateResult;
    
    const responseData = {
      success: true,
      message: '참가 성공',
      isComplete,
      participant: newParticipant,
      participants: ladder.participants
    };
    console.log('응답 데이터:', responseData);

    return {
      statusCode: 200,
      body: JSON.stringify(responseData)
    };
  } catch (error) {
    console.error('참가 처리 중 오류 발생:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: '서버 오류가 발생했습니다.',
        details: error.message || '상세 내용 없음'
      })
    };
  }
};

// 사다리 결과 생성 함수
function generateLadderResults(participants, maxParticipants) {
  console.log('결과 생성 시작:', { participants, maxParticipants });
  
  // 참가자 수에 맞는 결과 배열 생성 (1부터 시작)
  const positions = Array.from({ length: maxParticipants }, (_, i) => i + 1);
  const shuffledPositions = shuffleArray([...positions]);
  console.log('섞인 위치:', shuffledPositions);
  
  // 각 참가자에게 랜덤 결과 할당
  const results = participants.map(participant => ({
    name: participant.name,
    startPosition: participant.position,
    endPosition: shuffledPositions[participant.position - 1]
  }));
  
  console.log('생성된 결과:', results);
  return results;
}

// 배열을 섞는 함수 (Fisher-Yates 알고리즘)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
  