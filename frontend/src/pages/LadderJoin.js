import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLadderStore from '../stores/ladderStore';
import { useLoadingStore } from '../stores/loadingStore';

const LadderJoin = () => {
  // id 또는 ladderId 파라미터 추출
  const params = useParams();
  const ladderId = params.ladderId || params.id;
  const navigate = useNavigate();
  const { joinLadderGame, participants_joined, checkResult } = useLadderStore();
  const { isLoading } = useLoadingStore();
  
  console.log('LadderJoin 렌더링 - 파라미터:', params, '사용할 ladderId:', ladderId);
  
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState(3); // 기본값 3으로 설정
  const [usedPositions, setUsedPositions] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // 초기 데이터 로딩을 위한 useEffect
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // 초기 로딩에는 전체 로딩 인디케이터를 표시하지 않고, 내부 상태만 사용
        console.log('초기 데이터 로딩 시작');
        const result = await checkResult(ladderId);
        console.log('초기 데이터 로딩 결과 (전체):', result);
        
        // 최대 참가자 수 설정 디버깅
        console.log('maxParticipants 값:', result.maxParticipants, typeof result.maxParticipants);
        
        if (result.maxParticipants) {
          setMaxParticipants(result.maxParticipants);
          console.log('최대 참가자 수 설정 완료:', result.maxParticipants);
        } else {
          console.warn('maxParticipants 값이 없거나 0입니다:', result.maxParticipants);
          // 백업 방법: 기본값 설정 (이미 초기화 때 3으로 설정함)
        }
        
        // 이미 사용 중인 포지션 추출
        if (result.participants && result.participants.length > 0) {
          const positions = result.participants.map(p => p.position);
          setUsedPositions(positions);
          console.log('이미 사용 중인 포지션:', positions);
        }
        
        // 이미 완료된 게임이면 결과 페이지로 이동
        if (result.success && result.isComplete) {
          console.log('게임이 이미 완료됨, 결과 페이지로 이동');
          navigate(`/results/${ladderId}`);
        }
      } catch (err) {
        console.error('초기 데이터 로딩 오류:', err);
        setError('사다리 게임 정보를 불러오는 중 오류가 발생했습니다');
      } finally {
        setIsInitialLoading(false);
      }
    };
    
    loadInitialData();
  }, [ladderId, checkResult, navigate]);
  
  // 참가 후에만 폴링 시작
  useEffect(() => {
    // 아직 참가하지 않았거나 폴링이 필요없는 경우 타이머 설정 안함
    if (!hasJoined && participants_joined.length === 0) {
      console.log('아직 참가하지 않았거나 참가자가 없어 폴링 시작 안함');
      return () => {};
    }
    
    console.log('폴링 시작 - 5초 간격으로 결과 확인');
    const checkForResults = async () => {
      try {
        console.log('결과 확인 폴링 중...');
        const result = await checkResult(ladderId);
        
        // 이미 사용 중인 포지션 업데이트
        if (result.participants && result.participants.length > 0) {
          const positions = result.participants.map(p => p.position);
          setUsedPositions(positions);
        }
        
        if (result.success && result.isComplete) {
          console.log('게임 완료, 결과 페이지로 이동');
          navigate(`/results/${ladderId}`);
        } else {
          console.log('게임 진행 중, 참가자 수:', result.participants?.length || 0);
        }
      } catch (err) {
        console.error('결과 확인 오류:', err);
      }
    };
    
    // 5초마다 결과 확인
    const intervalId = setInterval(checkForResults, 5000);
    
    return () => {
      console.log('폴링 정지');
      clearInterval(intervalId);
    };
  }, [ladderId, checkResult, navigate, hasJoined, participants_joined.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('이름을 입력해주세요');
      return;
    }
    
    if (!position) {
      setError('유효한 번호를 선택해주세요');
      return;
    }
    
    try {
      setError('');
      console.log('참가 요청 시작:', { ladderId, name, position: Number(position) });
      const result = await joinLadderGame(ladderId, name, Number(position));
      console.log('참가 요청 결과:', result);
      
      if (!result.success) {
        setError(result.error || '참가 중 오류가 발생했습니다');
        return;
      }
      
      // 참가 성공 표시
      setHasJoined(true);
      
      // 모든 참가자가 참여했다면 결과 페이지로 이동
      if (result.isComplete) {
        console.log('모든 참가자 참여 완료, 결과 페이지로 이동');
        navigate(`/results/${ladderId}`);
      } else {
        console.log('참가 성공, 다른 참가자 대기 중');
      }
    } catch (err) {
      console.error('참가 처리 오류:', err);
      setError(err.message || '참가 중 오류가 발생했습니다');
    }
  };

  // 포지션 번호가 이미 사용 중인지 확인하는 함수
  const isPositionUsed = (pos) => {
    return usedPositions.includes(pos);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">사다리 게임 참가</h1>
        
        {participants_joined.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-medium text-gray-700 mb-2">참가자 목록</h2>
            <div className="bg-gray-100 p-3 rounded-md">
              <ul className="divide-y divide-gray-200">
                {participants_joined.map((p, idx) => (
                  <li key={idx} className="py-2 flex justify-between">
                    <span>{p.name}</span>
                    <span className="font-medium">{p.position}번</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
              이름
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="이름을 입력하세요"
              disabled={hasJoined || isLoading}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              번호 선택
            </label>
            <div className="grid grid-cols-5 gap-4 py-2">
              {console.log('렌더링 시 maxParticipants:', maxParticipants)}
              {Array.from({ length: maxParticipants }).map((_, idx) => {
                // 1부터 시작하는 번호
                const positionNumber = idx + 1;
                const isUsed = isPositionUsed(positionNumber);
                
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => !isUsed && !hasJoined && !isLoading && setPosition(positionNumber)}
                    disabled={isUsed || hasJoined || isLoading}
                    className={`w-14 h-14 rounded-full flex items-center justify-center border-2 text-lg font-medium transition-all ${
                      hasJoined && position === positionNumber
                        ? 'bg-green-500 text-white border-green-600 shadow-md' // 내가 선택한 번호
                        : position === positionNumber
                          ? 'bg-blue-500 text-white border-blue-600 shadow-md transform scale-105' // 선택한 번호
                          : isUsed
                            ? 'bg-gray-300 text-gray-500 border-gray-400 cursor-not-allowed' // 이미 사용 중인 번호
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:scale-105' // 선택 가능한 번호
                    }`}
                  >
                    {positionNumber}
                  </button>
                );
              })}
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center"
            disabled={hasJoined || !name || !position || isInitialLoading || isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                처리 중...
              </>
            ) : isInitialLoading ? (
              '로딩 중...'
            ) : hasJoined ? (
              '참가 완료'
            ) : (
              '참가하기'
            )}
          </button>
          
          {hasJoined && (
            <div className="text-sm text-green-600 text-center mt-2">
              참가가 완료되었습니다. 다른 참가자를 기다리는 중...
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default LadderJoin; 