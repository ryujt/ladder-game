import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const PositionSelector = ({
  positions,
  takenPositions = new Map(),
  selectedPosition,
  onSelect,
  disabled = false,
  showNames = true,
}) => {
  const handleSelect = (position) => {
    if (!disabled && !takenPositions.has(position)) {
      onSelect(position);
    }
  };

  const handleKeyDown = (e, position) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSelect(position);
    }
  };

  const getGridCols = () => {
    if (positions <= 4) return 'grid-cols-4';
    if (positions <= 6) return 'grid-cols-3 sm:grid-cols-6';
    if (positions <= 8) return 'grid-cols-4 sm:grid-cols-8';
    return 'grid-cols-5 sm:grid-cols-10';
  };

  return (
    <div
      role="radiogroup"
      aria-label="번호 선택"
      className={cn('grid gap-3', getGridCols())}
    >
      {Array.from({ length: positions }, (_, idx) => {
        const positionNumber = idx + 1;
        const isTaken = takenPositions.has(positionNumber);
        const isSelected = selectedPosition === positionNumber;
        const takenBy = takenPositions.get(positionNumber);

        return (
          <motion.button
            key={positionNumber}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isTaken || disabled}
            tabIndex={isTaken || disabled ? -1 : 0}
            onClick={() => handleSelect(positionNumber)}
            onKeyDown={(e) => handleKeyDown(e, positionNumber)}
            disabled={isTaken || disabled}
            whileHover={!isTaken && !disabled ? { scale: 1.05 } : {}}
            whileTap={!isTaken && !disabled ? { scale: 0.95 } : {}}
            className={cn(
              'relative flex flex-col items-center justify-center',
              'w-14 h-14 sm:w-16 sm:h-16 rounded-full',
              'text-lg font-semibold transition-all duration-200',
              'touch-target focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              {
                'bg-primary-600 text-white shadow-lg ring-2 ring-primary-600 ring-offset-2': isSelected && !isTaken,
                'bg-success-500 text-white shadow-lg': isTaken && isSelected,
                'bg-gray-200 text-gray-400 cursor-not-allowed': isTaken && !isSelected,
                'bg-white text-gray-700 border-2 border-gray-200 hover:border-primary-300 hover:bg-primary-50': !isSelected && !isTaken && !disabled,
                'opacity-50 cursor-not-allowed': disabled && !isTaken,
              }
            )}
          >
            <span>{positionNumber}</span>
            {isTaken && showNames && takenBy && (
              <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap truncate max-w-[60px]">
                {takenBy}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default PositionSelector;
