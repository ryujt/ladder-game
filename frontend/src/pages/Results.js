import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLadderStore from '../stores/ladderStore';
import { useLoadingStore } from '../stores/loadingStore';
import LoadingSpinner from '../components/LoadingSpinner';

const Results = () => {
  const { id: ladderId } = useParams();
  const navigate = useNavigate();
  const { checkResult, result, error, participants_joined } = useLadderStore();
  const { isLoading } = useLoadingStore();
  const [pollingActive, setPollingActive] = useState(false);
  
  console.log('Results 페이지 렌더링:', { ladderId, result, participants: participants_joined?.length });

  // 초기 데이터 로딩
  useEffect(() => {
    const initialLoad = async () => {
      try {
        console.log('결과 페이지 초기 데이터 로딩');
        const resultData = await checkResult(ladderId);
        console.log('초기 결과 데이터:', resultData);
        
        // 참가자가 있으면 폴링 활성화
        if (resultData.participants && resultData.participants.length > 0) {
          console.log('참가자가 있어 폴링 활성화');
          setPollingActive(true);
        }
      } catch (err) {
        console.error('초기 결과 로딩 오류:', err);
      }
    };
    
    initialLoad();
  }, [ladderId, checkResult]);

  // 폴링 설정
  useEffect(() => {
    // 폴링이 비활성화되어 있으면 타이머를 설정하지 않음
    if (!pollingActive) {
      console.log('폴링이 비활성화되어 있어 타이머 미설정');
      return () => {};
    }
    
    console.log('결과 폴링 시작 - 5초 간격');
    const fetchResult = async () => {
      try {
        console.log('결과 확인 폴링 중...');
        const resultData = await checkResult(ladderId);
        console.log('폴링 결과:', { 
          isComplete: resultData.isComplete, 
          participants: resultData.participants?.length,
          hasResults: !!resultData.data
        });
        
        // 결과가 있고 complete 상태이면 폴링 중단
        if (resultData.isComplete && resultData.data) {
          console.log('게임이 완료되어 폴링 중단');
          setPollingActive(false);
        }
      } catch (err) {
        console.error('결과 확인 폴링 오류:', err);
      }
    };
    
    // 5초마다 결과 업데이트 확인
    const intervalId = setInterval(fetchResult, 5000);
    
    return () => {
      console.log('결과 폴링 중단');
      clearInterval(intervalId);
    };
  }, [ladderId, checkResult, pollingActive]);

  const handleNewGame = () => {
    console.log('새 게임 시작하기 클릭');
    navigate('/');
  };

  // 결과가 없고 에러도 없는 경우 - 대기 중 화면
  if (!result && !error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        {isLoading && <LoadingSpinner />}
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">결과 기다리는 중...</h1>
          <p className="text-gray-600 mb-6">
            모든 참가자가 참여할 때까지 기다리고 있습니다.
            {participants_joined?.length > 0 && ` (현재 ${participants_joined.length}명 참가)`}
          </p>
          <div className="animate-pulse flex justify-center">
            <div className="h-4 w-32 bg-blue-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // 에러 화면
  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-red-600 mb-4">오류 발생</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleNewGame}
            className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            새 게임 시작하기
          </button>
        </div>
      </div>
    );
  }

  // 결과 화면
  console.log('결과 표시:', result);
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {isLoading && <LoadingSpinner />}
      
      <div className="bg-white rounded-lg shadow-md p-8 max-w-3xl w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">사다리 결과</h1>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">최종 결과</h2>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {result.map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded shadow-sm flex justify-between items-center">
                  <div>
                    <span className="font-medium text-blue-600">{item.name}</span>
                    <span className="text-gray-500 mx-2">→</span>
                    <span className="font-medium">{item.endPosition}</span>
                  </div>
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                    {item.startPosition}번
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleNewGame}
            className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
          >
            새 게임 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Results; 