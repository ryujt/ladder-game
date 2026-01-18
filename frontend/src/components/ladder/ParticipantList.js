import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '../ui/Badge';
import { cn } from '../../utils/cn';

const ParticipantList = ({
  participants = [],
  maxParticipants,
  className,
}) => {
  const emptySlots = maxParticipants
    ? maxParticipants - participants.length
    : 0;

  return (
    <div className={cn('space-y-2', className)}>
      <AnimatePresence mode="popLayout">
        {participants.map((participant, idx) => (
          <motion.div
            key={participant.position || idx}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-100 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-semibold text-sm">
                {participant.position}
              </span>
              <span className="font-medium text-gray-900">
                {participant.name}
              </span>
            </div>
            <Badge variant="success" dot>
              참여완료
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>

      {emptySlots > 0 &&
        Array.from({ length: emptySlots }).map((_, idx) => (
          <motion.div
            key={`empty-${idx}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border border-dashed border-gray-200"
          >
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-400 font-semibold text-sm">
                ?
              </span>
              <span className="text-gray-400">대기 중...</span>
            </div>
            <Badge variant="default" dot>
              대기중
            </Badge>
          </motion.div>
        ))}
    </div>
  );
};

export default ParticipantList;
