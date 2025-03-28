import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLadderStore from '../stores/ladderStore';
import { useLoadingStore } from '../stores/loadingStore';
import LoadingSpinner from '../components/LoadingSpinner';

const LadderJoin = () => {
  const { id: ladderId } = useParams();
  const navigate = useNavigate();
  const { joinLadderGame, participants_joined, checkResult } = useLadderStore();
  const { isLoading } = useLoadingStore();
  
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [error, setError] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  
  // 초기 데이터 로딩을 위한 useEffect
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        console.log('초기 데이터 로딩 시작');
        const result = await checkResult(ladderId);
        console.log('초기 데이터 로딩 결과:', result);
        
        // 이미 완료된 게임이면 결과 페이지로 이동
        if (result.success && result.isComplete) {
          console.log('게임이 이미 완료됨, 결과 페이지로 이동');
          navigate(`/results/${ladderId}`);
        }
      } catch (err) {
        console.error('초기 데이터 로딩 오류:', err);
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
    
    if (!position || position < 0) {
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {isLoading && <LoadingSpinner />}
      
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
            />
          </div>
          
          <div>
            <label htmlFor="position" className="block text-gray-700 font-medium mb-2">
              번호 선택
            </label>
            <input
              type="number"
              id="position"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="원하는 번호를 선택하세요"
            />
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            disabled={hasJoined}
          >
            {hasJoined ? '참가 완료' : '참가하기'}
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