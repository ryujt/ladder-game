import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useLadderStore from '../stores/ladderStore';

const Home = () => {
  const navigate = useNavigate();
  const { createLadder } = useLadderStore();
  const [formData, setFormData] = useState({
    maxParticipants: 2
  });
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = name === 'maxParticipants' ? parseInt(value, 10) : value;
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('사다리 생성 요청:', formData);
    
    try {
      setIsLoading(true);
      const ladderId = await createLadder(formData.maxParticipants);
      console.log('생성된 사다리 ID:', ladderId);
      
      if (ladderId) {
        navigate(`/created/${ladderId}`);
      } else {
        console.error('사다리 ID가 생성되지 않았습니다.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('사다리 생성 오류:', error);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">사다리 게임 만들기</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="maxParticipants" className="block text-sm font-medium text-gray-700 mb-1">
              참가자 수
            </label>
            <select
              id="maxParticipants"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="w-full border-gray-300 border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>{num}명</option>
              ))}
            </select>
            <p className="mt-1 text-sm text-gray-500">참가할 인원 수를 선택하세요</p>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  생성 중...
                </>
              ) : (
                '게임 생성하기'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Home; 