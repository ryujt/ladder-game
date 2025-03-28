import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLadderStore from '../stores/ladderStore';
import { useLoadingStore } from '../stores/loadingStore';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const navigate = useNavigate();
  const { createLadder } = useLadderStore();
  const { isLoading } = useLoadingStore();
  const [maxParticipants, setMaxParticipants] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!maxParticipants || maxParticipants <= 1) {
      setError('참여 인원은 2명 이상이어야 합니다');
      return;
    }

    try {
      setError('');
      console.log('사다리 생성 요청:', { maxParticipants: Number(maxParticipants) });
      
      const result = await createLadder(Number(maxParticipants));
      console.log('사다리 생성 응답 (Home):', result);
      
      if (!result || !result.ladderId) {
        console.error('올바른 응답 형식이 아님:', result);
        setError('응답 형식이 올바르지 않습니다.');
        return;
      }
      
      console.log('사다리 생성 성공:', result.ladderId);
      navigate(`/created/${result.ladderId}`);
    } catch (err) {
      console.error('사다리 생성 에러 (Home):', err);
      setError(err.message || '사다리 생성 중 오류가 발생했습니다');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {isLoading && <LoadingSpinner />}
      
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">사다리 게임</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="maxParticipants" className="block text-gray-700 font-medium mb-2">
              참여 인원 수
            </label>
            <input
              type="number"
              id="maxParticipants"
              value={maxParticipants}
              onChange={(e) => setMaxParticipants(e.target.value)}
              min="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="참여할 인원 수를 입력하세요"
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
          >
            사다리 생성하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home; 