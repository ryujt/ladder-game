import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useLadderStore from '../stores/ladderStore';
import { useLoadingStore } from '../stores/loadingStore';
import { Button, Card, LoadingSpinner } from '../components/ui';
import { LadderCanvas, ResultCard } from '../components/ladder';

const Results = () => {
  const { id: ladderId } = useParams();
  const navigate = useNavigate();
  const { checkResult, result, error, participants_joined } = useLadderStore();
  const { isLoading } = useLoadingStore();
  const [pollingActive, setPollingActive] = useState(false);

  useEffect(() => {
    const initialLoad = async () => {
      try {
        const resultData = await checkResult(ladderId);

        if (resultData.participants && resultData.participants.length > 0) {
          setPollingActive(true);
        }
      } catch (err) {
        // Error handled by store
      }
    };

    initialLoad();
  }, [ladderId, checkResult]);

  useEffect(() => {
    if (!pollingActive) {
      return;
    }

    const fetchResult = async () => {
      try {
        const resultData = await checkResult(ladderId);

        if (resultData.isComplete && resultData.data) {
          setPollingActive(false);
        }
      } catch (err) {
        // Silent fail for polling
      }
    };

    const intervalId = setInterval(fetchResult, 5000);
    return () => clearInterval(intervalId);
  }, [ladderId, checkResult, pollingActive]);

  const handleNewGame = () => {
    navigate('/');
  };

  if (!result && !error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card>
            <Card.Body className="p-8 text-center">
              <h1 className="text-2xl font-bold text-primary-600 mb-4">
                결과 기다리는 중...
              </h1>
              <p className="text-gray-600 mb-6">
                모든 참가자가 참여할 때까지 기다리고 있습니다.
                {participants_joined?.length > 0 &&
                  ` (현재 ${participants_joined.length}명 참가)`}
              </p>
              <div className="flex justify-center">
                <LoadingSpinner size="lg" />
              </div>
              {isLoading && (
                <p className="mt-4 text-sm text-primary-500">
                  데이터 업데이트 중...
                </p>
              )}
            </Card.Body>
          </Card>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Card>
            <Card.Body className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-100 mb-4">
                <svg
                  className="w-8 h-8 text-error-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-error-600 mb-4">
                오류 발생
              </h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={handleNewGame}>새 게임 시작하기</Button>
            </Card.Body>
          </Card>
        </motion.div>
      </div>
    );
  }

  const participantPositions = result
    .map((item) => ({
      name: item.name,
      startPosition: item.startPosition,
      endPosition: item.endPosition,
      resultItem: item.resultItem || `${item.endPosition}번`,
    }))
    .sort((a, b) => a.startPosition - b.startPosition);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto"
      >
        <Card className="mb-8">
          <Card.Body className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-center text-primary-600 mb-8">
              사다리 결과
            </h1>

            <div className="mb-8">
              <LadderCanvas participants={participantPositions} height={380} />
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                최종 결과
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {result.map((item, idx) => (
                  <ResultCard
                    key={idx}
                    name={item.name}
                    position={item.startPosition}
                    result={item.resultItem || `${item.endPosition}번`}
                    delay={idx * 0.1}
                  />
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleNewGame} size="lg">
                새 게임 시작하기
              </Button>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  );
};

export default Results;
