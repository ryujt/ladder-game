import React, { useMemo } from 'react';
import { cn } from '../../utils/cn';

const generateLadderPaths = (totalParticipants, seed = 0) => {
  const horizontalLinesCount = 7 + Math.floor(((seed + 1) * 7) % 4);

  const positions = Array.from({ length: horizontalLinesCount }, (_, i) => ({
    position: 10 + Math.floor((i + 1) * (80 / (horizontalLinesCount + 1))),
    connections: [],
  }));

  let pseudoRandom = seed;
  const nextRandom = () => {
    pseudoRandom = (pseudoRandom * 1103515245 + 12345) % 2147483648;
    return pseudoRandom / 2147483648;
  };

  positions.forEach((pos) => {
    const availableCols = Array.from(
      { length: totalParticipants - 1 },
      (_, i) => i
    );
    const linesToAdd = 1 + Math.floor(nextRandom() * Math.min(2, availableCols.length));

    for (let i = 0; i < linesToAdd; i++) {
      if (availableCols.length === 0) break;

      const randomIdx = Math.floor(nextRandom() * availableCols.length);
      const col = availableCols[randomIdx];

      availableCols.splice(randomIdx, 1);
      const leftIdx = availableCols.indexOf(col - 1);
      if (leftIdx !== -1) availableCols.splice(leftIdx, 1);
      const rightIdx = availableCols.indexOf(col + 1);
      if (rightIdx !== -1) availableCols.splice(rightIdx, 1);

      pos.connections.push(col);
    }
  });

  return positions;
};

const LadderCanvas = ({
  participants,
  className,
  height = 380,
}) => {
  const ladderPaths = useMemo(
    () => generateLadderPaths(participants.length, participants.length * 42),
    [participants.length]
  );

  const sortedParticipants = useMemo(
    () =>
      [...participants].sort((a, b) => a.startPosition - b.startPosition),
    [participants]
  );

  return (
    <div
      className={cn(
        'relative w-full bg-gray-50 rounded-xl p-3 border border-gray-200',
        className
      )}
    >
      <div className="relative w-full" style={{ height }}>
        <div className="absolute top-0 left-0 right-0 h-12 flex">
          {sortedParticipants.map((item, idx) => (
            <div
              key={`start-${idx}`}
              className="flex-1 text-center font-bold flex flex-col"
            >
              <div className="h-8 flex items-center justify-center bg-primary-200 rounded-t-lg mx-1 overflow-hidden">
                <span className="text-sm truncate px-1 text-primary-900">
                  {item.name}
                </span>
              </div>
              <div className="text-xs font-medium text-primary-700">
                {item.startPosition}번
              </div>
            </div>
          ))}
        </div>

        <div className="absolute top-12 left-0 right-0 bottom-12">
          {sortedParticipants.map((_, idx) => {
            const colPosition =
              (100 / sortedParticipants.length) * (idx + 0.5);
            return (
              <div
                key={`col-${idx}`}
                style={{ left: `${colPosition}%` }}
                className="absolute top-0 bottom-0 w-0.5 bg-primary-400"
              />
            );
          })}

          {ladderPaths.map((pathRow, rowIdx) =>
            pathRow.connections.map((colIdx, idx) => {
              const leftCol =
                (100 / sortedParticipants.length) * (colIdx + 0.5);
              const rightCol =
                (100 / sortedParticipants.length) * (colIdx + 1.5);
              return (
                <div
                  key={`row-${rowIdx}-${idx}`}
                  style={{
                    left: `${leftCol}%`,
                    top: `${pathRow.position}%`,
                    width: `${rightCol - leftCol}%`,
                  }}
                  className="absolute h-0.5 bg-primary-500"
                />
              );
            })
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-12 flex">
          {sortedParticipants.map((item, idx) => (
            <div
              key={`end-${idx}`}
              className="flex-1 text-center flex flex-col"
            >
              <div className="text-xs font-medium text-success-700">결과</div>
              <div className="h-8 flex items-center justify-center bg-success-200 rounded-b-lg mx-1 overflow-hidden">
                <span className="font-medium text-sm truncate px-1 text-success-900">
                  {item.resultItem || `${item.endPosition}번`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LadderCanvas;
