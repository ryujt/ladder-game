import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useLadderStore from '../stores/ladderStore';
import { useLoadingStore } from '../stores/loadingStore';
import { Button, Card, Input, Badge, LoadingSpinner } from '../components/ui';
import { PositionSelector, ParticipantList } from '../components/ladder';
import { useToast } from '../hooks/useToast';

const LadderJoin = () => {
  const params = useParams();
  const ladderId = params.ladderId || params.id;
  const navigate = useNavigate();
  const { joinLadderGame, participants_joined, checkResult } = useLadderStore();
  const { isLoading } = useLoadingStore();
  const { error: showError, success: showSuccess } = useToast();

  const [name, setName] = useState('');
  const [position, setPosition] = useState(null);
  const [error, setError] = useState('');
  const [hasJoined, setHasJoined] = useState(false);
  const [maxParticipants, setMaxParticipants] = useState(3);
  const [usedPositions, setUsedPositions] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const result = await checkResult(ladderId);

        if (result.maxParticipants && result.maxParticipants > 0) {
          setMaxParticipants(result.maxParticipants);
        }

        if (result.participants && result.participants.length > 0) {
          const positions = result.participants.map((p) => p.position);
          setUsedPositions(positions);
        }

        if (result.success && result.isComplete) {
          navigate(`/results/${ladderId}`);
        }
      } catch (err) {
        showError('사다리 게임 정보를 불러오는 중 오류가 발생했습니다');
      } finally {
        setIsInitialLoading(false);
      }
    };

    loadInitialData();
  }, [ladderId, checkResult, navigate, showError]);

  useEffect(() => {
    if (!hasJoined && participants_joined.length === 0) {
      return;
    }

    const checkForResults = async () => {
      try {
        const result = await checkResult(ladderId);

        if (result.participants && result.participants.length > 0) {
          const positions = result.participants.map((p) => p.position);
          setUsedPositions(positions);
        }

        if (result.success && result.isComplete) {
          navigate(`/results/${ladderId}`);
        }
      } catch (err) {
        // Silent fail for polling
      }
    };

    const intervalId = setInterval(checkForResults, 5000);
    return () => clearInterval(intervalId);
  }, [ladderId, checkResult, navigate, hasJoined, participants_joined.length]);

  const takenPositionsMap = useMemo(() => {
    const map = new Map();
    participants_joined.forEach((p) => {
      map.set(p.position, p.name);
    });
    usedPositions.forEach((pos) => {
      if (!map.has(pos)) {
        map.set(pos, '참여자');
      }
    });
    return map;
  }, [participants_joined, usedPositions]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('이름을 입력해주세요');
      return;
    }

    if (!position) {
      setError('번호를 선택해주세요');
      return;
    }

    try {
      setError('');
      const result = await joinLadderGame(ladderId, name, position);

      if (!result.success) {
        setError(result.error || '참가 중 오류가 발생했습니다');
        return;
      }

      setHasJoined(true);
      showSuccess('참가가 완료되었습니다!');

      if (result.isComplete) {
        navigate(`/results/${ladderId}`);
      }
    } catch (err) {
      setError(err.message || '참가 중 오류가 발생했습니다');
    }
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner size="lg" showLabel label="게임 정보 불러오는 중..." />
      </div>
    );
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
            <h1 className="text-3xl font-bold text-center text-primary-600 mb-8">
              사다리 게임 참가
            </h1>

            {participants_joined.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-medium text-gray-700">
                    참가자 목록
                  </h2>
                  <Badge variant="info">
                    {participants_joined.length}/{maxParticipants}명
                  </Badge>
                </div>
                <ParticipantList
                  participants={participants_joined}
                  maxParticipants={maxParticipants}
                />
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                disabled={hasJoined || isLoading}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  번호 선택
                </label>
                <PositionSelector
                  positions={maxParticipants}
                  takenPositions={takenPositionsMap}
                  selectedPosition={position}
                  onSelect={setPosition}
                  disabled={hasJoined || isLoading}
                  showNames={false}
                />
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-error-600 text-sm bg-error-50 px-4 py-3 rounded-lg"
                  role="alert"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                disabled={hasJoined || !name || !position}
                variant={hasJoined ? 'success' : 'primary'}
                size="lg"
              >
                {hasJoined ? '참가 완료' : '참가하기'}
              </Button>

              {hasJoined && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <p className="text-sm text-success-600 mb-2">
                    참가가 완료되었습니다!
                  </p>
                  <p className="text-xs text-gray-500">
                    다른 참가자를 기다리는 중...
                  </p>
                  <div className="mt-3 flex justify-center">
                    <LoadingSpinner size="sm" />
                  </div>
                </motion.div>
              )}
            </form>
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  );
};

export default LadderJoin;
