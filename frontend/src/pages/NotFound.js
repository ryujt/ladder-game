import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">페이지를 찾을 수 없습니다</h2>
        <p className="text-gray-600 mb-6">요청하신 페이지가 존재하지 않거나 삭제되었습니다.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 text-white font-medium py-2 px-6 rounded-md hover:bg-blue-700 transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default NotFound; 