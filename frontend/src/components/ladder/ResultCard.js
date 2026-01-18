import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const ResultCard = ({
  name,
  position,
  result,
  isHighlighted = false,
  delay = 0,
  className,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={cn(
        'bg-white p-4 rounded-xl shadow-card flex items-center justify-between',
        'border-2 transition-colors duration-200',
        isHighlighted
          ? 'border-primary-400 bg-primary-50 shadow-card-hover'
          : 'border-transparent hover:border-gray-100',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: delay + 0.2, type: 'spring' }}
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm',
            isHighlighted
              ? 'bg-primary-600 text-white'
              : 'bg-primary-100 text-primary-700'
          )}
        >
          {position}번
        </motion.span>
        <div className="flex flex-col">
          <span
            className={cn(
              'font-semibold',
              isHighlighted ? 'text-primary-900' : 'text-gray-900'
            )}
          >
            {name}
          </span>
          <span className="text-sm text-gray-500">참가자</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: delay + 0.3 }}
        className="flex items-center gap-2"
      >
        <span className="text-gray-400">→</span>
        <span
          className={cn(
            'px-3 py-1.5 rounded-lg font-semibold',
            isHighlighted
              ? 'bg-primary-600 text-white'
              : 'bg-success-100 text-success-700'
          )}
        >
          {result}
        </span>
      </motion.div>
    </motion.div>
  );
};

export default ResultCard;
