import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useLadderStore from '../stores/ladderStore';
import { Button, Card } from '../components/ui';
import { ShareButton } from '../components/ladder';
import { useToast } from '../hooks/useToast';

const LadderCreated = () => {
  const { ladderId } = useParams();
  const navigate = useNavigate();
  const { participants } = useLadderStore();
  const { warning } = useToast();

  useEffect(() => {
    if (!participants) {
      warning('참여 인원 정보가 없습니다');
      navigate('/');
    }
  }, [participants, navigate, warning]);

  const joinUrl = ladderId
    ? `${window.location.origin}/join/${ladderId}`
    : '';

  const handleGoToJoin = () => {
    if (ladderId) {
      navigate(`/join/${ladderId}`);
    }
  };

  if (!ladderId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card>
          <Card.Body className="p-8">
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-success-100 mb-4"
              >
                <svg
                  className="w-8 h-8 text-success-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </motion.div>
              <h1 className="text-3xl font-bold text-primary-600">
                사다리 생성 완료!
              </h1>
            </div>

            <div className="space-y-5">
              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-2">
                  사다리 ID
                </h2>
                <div className="bg-gray-100 p-3 rounded-lg text-center font-mono text-sm break-all text-gray-700">
                  {ladderId}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-2">
                  참여 인원 수
                </h2>
                <div className="bg-gray-100 p-3 rounded-lg text-center">
                  <span className="text-2xl font-bold text-primary-600">
                    {participants}
                  </span>
                  <span className="text-gray-600 ml-1">명</span>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-2">
                  초대 링크
                </h2>
                <div className="bg-gray-100 p-3 rounded-lg text-center font-mono text-xs break-all text-gray-600">
                  {joinUrl}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <ShareButton
                  url={joinUrl}
                  title="사다리 게임 초대"
                  text={`사다리 게임에 참여하세요! (${participants}명)`}
                  fullWidth
                />

                <Button
                  variant="secondary"
                  fullWidth
                  onClick={handleGoToJoin}
                >
                  참가 페이지로 이동
                </Button>
              </div>
            </div>
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  );
};

export default LadderCreated;
