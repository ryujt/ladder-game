import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import useLadderStore from '../stores/ladderStore';
import { Button, Card, Input, Select } from '../components/ui';
import { useToast } from '../hooks/useToast';

const Home = () => {
  const navigate = useNavigate();
  const { createLadder } = useLadderStore();
  const { error: showError } = useToast();
  const [formData, setFormData] = useState({
    maxParticipants: 2,
    resultItems: Array(2).fill('꽝'),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const currentCount = formData.resultItems.length;
    const targetCount = formData.maxParticipants;

    if (currentCount !== targetCount) {
      setFormData((prev) => ({
        ...prev,
        resultItems:
          currentCount < targetCount
            ? [...prev.resultItems, ...Array(targetCount - currentCount).fill('꽝')]
            : prev.resultItems.slice(0, targetCount),
      }));
    }
  }, [formData.maxParticipants, formData.resultItems.length]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'maxParticipants') {
      const parsedValue = parseInt(value, 10);
      setFormData((prev) => ({ ...prev, [name]: parsedValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleResultItemChange = (index, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.resultItems];
      updatedItems[index] = value || '꽝';
      return { ...prev, resultItems: updatedItems };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    try {
      setIsLoading(true);
      const result = await createLadder(
        formData.maxParticipants,
        formData.resultItems
      );

      let ladderId;
      if (typeof result === 'object' && result !== null) {
        ladderId = result.ladderId;
      } else {
        ladderId = result;
      }

      if (ladderId) {
        navigate(`/created/${ladderId}`);
      } else {
        showError('사다리 ID가 생성되지 않았습니다');
        setIsLoading(false);
      }
    } catch (err) {
      showError(err.message || '사다리 생성 중 오류가 발생했습니다');
      setIsLoading(false);
    }
  };

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
              사다리 게임 만들기
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Select
                label="참가자 수"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                helperText="참가할 인원 수를 선택하세요"
                error={errors.maxParticipants}
                required
              >
                {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}명
                  </option>
                ))}
              </Select>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  결과 항목 설정
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {formData.resultItems.map((item, index) => (
                    <Input
                      key={index}
                      label={`${index + 1}번 결과`}
                      value={item}
                      onChange={(e) =>
                        handleResultItemChange(index, e.target.value)
                      }
                      placeholder="꽝"
                      size="sm"
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-500">
                  각 위치에 표시될 결과를 입력하세요. 미입력시 '꽝'으로 표시됩니다.
                </p>
              </div>

              <Button
                type="submit"
                fullWidth
                loading={isLoading}
                size="lg"
              >
                게임 생성하기
              </Button>
            </form>
          </Card.Body>
        </Card>
      </motion.div>
    </div>
  );
};

export default Home;
