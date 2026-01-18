import React from 'react';
import { render, screen } from '@testing-library/react';
import ParticipantList from '../ParticipantList';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      const { initial, animate, exit, transition, layout, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('ParticipantList', () => {
  const defaultProps = {
    participants: [],
    maxParticipants: 4,
    className: '',
  };

  describe('rendering', () => {
    it('renders empty slots when no participants', () => {
      render(<ParticipantList {...defaultProps} />);

      expect(screen.getAllByText('대기 중...')).toHaveLength(4);
    });

    it('renders participants when provided', () => {
      const participants = [
        { name: 'John', position: 1 },
        { name: 'Jane', position: 2 },
      ];

      render(<ParticipantList {...defaultProps} participants={participants} />);

      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });

    it('renders position numbers for participants', () => {
      const participants = [
        { name: 'John', position: 1 },
        { name: 'Jane', position: 2 },
      ];

      render(<ParticipantList {...defaultProps} participants={participants} />);

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  describe('participant items', () => {
    it('shows 참여완료 badge for participants', () => {
      const participants = [{ name: 'John', position: 1 }];

      render(<ParticipantList {...defaultProps} participants={participants} />);

      expect(screen.getByText('참여완료')).toBeInTheDocument();
    });

    it('applies correct styling to participant row', () => {
      const participants = [{ name: 'John', position: 1 }];

      const { container } = render(<ParticipantList {...defaultProps} participants={participants} />);

      // Find the row with bg-white class
      const row = container.querySelector('.bg-white');
      expect(row).toBeInTheDocument();
      expect(row).toHaveClass('rounded-lg');
    });

    it('renders position with correct styling', () => {
      const participants = [{ name: 'John', position: 1 }];

      render(<ParticipantList {...defaultProps} participants={participants} />);

      const positionBadge = screen.getByText('1');
      expect(positionBadge).toHaveClass('rounded-full');
      expect(positionBadge).toHaveClass('bg-primary-100');
    });
  });

  describe('empty slots', () => {
    it('calculates correct number of empty slots', () => {
      const participants = [{ name: 'John', position: 1 }];

      render(
        <ParticipantList
          {...defaultProps}
          participants={participants}
          maxParticipants={4}
        />
      );

      expect(screen.getAllByText('대기 중...')).toHaveLength(3);
    });

    it('shows 대기중 badge for empty slots', () => {
      render(<ParticipantList {...defaultProps} maxParticipants={2} />);

      expect(screen.getAllByText('대기중')).toHaveLength(2);
    });

    it('shows question mark for empty slot position', () => {
      render(<ParticipantList {...defaultProps} maxParticipants={1} />);

      expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('applies dashed border to empty slots', () => {
      const { container } = render(<ParticipantList {...defaultProps} maxParticipants={1} />);

      // Find the empty slot with bg-gray-50 class
      const emptySlot = container.querySelector('.bg-gray-50');
      expect(emptySlot).toBeInTheDocument();
      expect(emptySlot).toHaveClass('border-dashed');
    });

    it('does not render empty slots when maxParticipants is not set', () => {
      render(
        <ParticipantList
          participants={[{ name: 'John', position: 1 }]}
          maxParticipants={undefined}
        />
      );

      expect(screen.queryByText('대기 중...')).not.toBeInTheDocument();
    });
  });

  describe('mixed state', () => {
    it('renders both participants and empty slots', () => {
      const participants = [
        { name: 'John', position: 1 },
        { name: 'Jane', position: 2 },
      ];

      render(
        <ParticipantList
          participants={participants}
          maxParticipants={4}
        />
      );

      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getAllByText('대기 중...')).toHaveLength(2);
    });

    it('renders participants and empty slots correctly', () => {
      const participants = [{ name: 'John', position: 1 }];

      const { container } = render(
        <ParticipantList
          participants={participants}
          maxParticipants={2}
        />
      );

      // Check both participant row (bg-white) and empty slot (bg-gray-50) exist
      const participantRow = container.querySelector('.bg-white');
      const emptySlot = container.querySelector('.bg-gray-50');
      expect(participantRow).toHaveTextContent('John');
      expect(emptySlot).toHaveTextContent('대기 중...');
    });
  });

  describe('className', () => {
    it('applies custom className to container', () => {
      const { container } = render(
        <ParticipantList {...defaultProps} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass('custom-class');
    });

    it('applies default spacing class', () => {
      const { container } = render(<ParticipantList {...defaultProps} />);

      expect(container.firstChild).toHaveClass('space-y-2');
    });
  });

  describe('edge cases', () => {
    it('handles empty participants array', () => {
      render(<ParticipantList participants={[]} maxParticipants={3} />);

      expect(screen.getAllByText('대기 중...')).toHaveLength(3);
    });

    it('handles full participants list', () => {
      const participants = [
        { name: 'John', position: 1 },
        { name: 'Jane', position: 2 },
        { name: 'Bob', position: 3 },
      ];

      render(
        <ParticipantList
          participants={participants}
          maxParticipants={3}
        />
      );

      expect(screen.queryByText('대기 중...')).not.toBeInTheDocument();
      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('handles participants without position using index as key', () => {
      const participants = [
        { name: 'John' },
        { name: 'Jane' },
      ];

      render(
        <ParticipantList
          participants={participants}
          maxParticipants={4}
        />
      );

      expect(screen.getByText('John')).toBeInTheDocument();
      expect(screen.getByText('Jane')).toBeInTheDocument();
    });
  });
});
