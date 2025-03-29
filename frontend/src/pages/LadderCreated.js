import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useLadderStore from '../stores/ladderStore';

const LadderCreated = () => {
  const { ladderId } = useParams();
  const navigate = useNavigate();
  const { participants } = useLadderStore();
  const [copied, setCopied] = useState(false);
  const [copyLoading, setCopyLoading] = useState(false);
  
  console.log('LadderCreated 렌더링:', { ladderId, participants });

  useEffect(() => {
    // 참여 인원 수가 없으면 홈으로 리다이렉트
    if (!participants) {
      console.log('참여 인원 수 없음, 홈으로 리다이렉트');
      navigate('/');
    }
    
    // 사다리 ID 검사
    if (!ladderId) {
      console.error('사다리 ID가 없음:', ladderId);
    }
  }, [participants, navigate, ladderId]);

  // URL 생성 (사다리 ID가 있는 경우에만)
  const joinUrl = ladderId ? `${window.location.origin}/join/${ladderId}` : '생성된 URL이 없습니다';
  console.log('생성된 joinUrl:', joinUrl);

  const copyToClipboard = () => {
    if (!ladderId) {
      console.error('복사할 ID가 없음');
      return;
    }
    
    setCopyLoading(true);
    
    navigator.clipboard.writeText(joinUrl).then(() => {
      console.log('클립보드에 URL 복사:', joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      console.error('클립보드 복사 오류:', err);
    }).finally(() => {
      setCopyLoading(false);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">사다리 생성 완료!</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">사다리 ID</h2>
            <div className="bg-gray-100 p-3 rounded-md text-center font-mono break-all">
              {ladderId || '생성된 ID가 없습니다'}
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">참여 인원 수</h2>
            <div className="bg-gray-100 p-3 rounded-md text-center">
              {participants}명
            </div>
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-gray-700 mb-2">초대 링크</h2>
            <div className="bg-gray-100 p-3 rounded-md text-center font-mono break-all">
              {joinUrl}
            </div>
          </div>
          
          <button
            onClick={copyToClipboard}
            disabled={!ladderId || copyLoading}
            className={`w-full py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center ${
              !ladderId 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : copied 
                  ? 'bg-green-500 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {copyLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                복사 중...
              </>
            ) : (
              copied ? '복사 완료!' : '링크 복사하기'
            )}
          </button>
          
          <button
            onClick={() => navigate(`/join/${ladderId}`)}
            disabled={!ladderId}
            className={`w-full font-medium py-2 px-4 rounded-md transition-colors ${
              !ladderId
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gray-700 text-white hover:bg-gray-800'
            }`}
          >
            참가 페이지로 이동
          </button>
        </div>
      </div>
    </div>
  );
};

export default LadderCreated; 