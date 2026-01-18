import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultCard from '../ResultCard';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      const { initial, animate, exit, transition, layout, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
    span: ({ children, ...props }) => {
      const { initial, animate, exit, transition, layout, type, ...rest } = props;
      return <span {...rest}>{children}</span>;
    },
  },
}));

describe('ResultCard', () => {
  const defaultProps = {
    name: 'John',
    position: 1,
    result: '당첨',
    isHighlighted: false,
    delay: 0,
    className: '',
  };

  describe('rendering', () => {
    it('renders participant name', () => {
      render(<ResultCard {...defaultProps} />);
      expect(screen.getByText('John')).toBeInTheDocument();
    });

    it('renders position number with 번 suffix', () => {
      render(<ResultCard {...defaultProps} position={3} />);
      expect(screen.getByText('3번')).toBeInTheDocument();
    });

    it('renders result', () => {
      render(<ResultCard {...defaultProps} result="꽝" />);
      expect(screen.getByText('꽝')).toBeInTheDocument();
    });

    it('renders "참가자" label', () => {
      render(<ResultCard {...defaultProps} />);
      expect(screen.getByText('참가자')).toBeInTheDocument();
    });

    it('renders arrow between name and result', () => {
      render(<ResultCard {...defaultProps} />);
      expect(screen.getByText('→')).toBeInTheDocument();
    });
  });

  describe('highlighted state', () => {
    it('applies highlighted styles when isHighlighted is true', () => {
      const { container } = render(<ResultCard {...defaultProps} isHighlighted />);

      const card = container.firstChild;
      expect(card).toHaveClass('border-primary-400');
      expect(card).toHaveClass('bg-primary-50');
    });

    it('applies non-highlighted styles when isHighlighted is false', () => {
      const { container } = render(<ResultCard {...defaultProps} isHighlighted={false} />);

      const card = container.firstChild;
      expect(card).toHaveClass('border-transparent');
    });

    it('applies highlighted styling to position badge', () => {
      render(<ResultCard {...defaultProps} isHighlighted />);

      const positionBadge = screen.getByText('1번');
      expect(positionBadge).toHaveClass('bg-primary-600');
      expect(positionBadge).toHaveClass('text-white');
    });

    it('applies non-highlighted styling to position badge', () => {
      render(<ResultCard {...defaultProps} isHighlighted={false} />);

      const positionBadge = screen.getByText('1번');
      expect(positionBadge).toHaveClass('bg-primary-100');
      expect(positionBadge).toHaveClass('text-primary-700');
    });

    it('applies highlighted styling to name', () => {
      render(<ResultCard {...defaultProps} isHighlighted />);

      const name = screen.getByText('John');
      expect(name).toHaveClass('text-primary-900');
    });

    it('applies non-highlighted styling to name', () => {
      render(<ResultCard {...defaultProps} isHighlighted={false} />);

      const name = screen.getByText('John');
      expect(name).toHaveClass('text-gray-900');
    });

    it('applies highlighted styling to result', () => {
      render(<ResultCard {...defaultProps} isHighlighted />);

      const result = screen.getByText('당첨');
      expect(result).toHaveClass('bg-primary-600');
      expect(result).toHaveClass('text-white');
    });

    it('applies non-highlighted styling to result', () => {
      render(<ResultCard {...defaultProps} isHighlighted={false} />);

      const result = screen.getByText('당첨');
      expect(result).toHaveClass('bg-success-100');
      expect(result).toHaveClass('text-success-700');
    });
  });

  describe('base styling', () => {
    it('applies card base styles', () => {
      const { container } = render(<ResultCard {...defaultProps} />);

      const card = container.firstChild;
      expect(card).toHaveClass('bg-white');
      expect(card).toHaveClass('p-4');
      expect(card).toHaveClass('rounded-xl');
      expect(card).toHaveClass('shadow-card');
    });

    it('applies flex layout', () => {
      const { container } = render(<ResultCard {...defaultProps} />);

      const card = container.firstChild;
      expect(card).toHaveClass('flex');
      expect(card).toHaveClass('items-center');
      expect(card).toHaveClass('justify-between');
    });

    it('applies border styling', () => {
      const { container } = render(<ResultCard {...defaultProps} />);

      const card = container.firstChild;
      expect(card).toHaveClass('border-2');
    });
  });

  describe('result badge styling', () => {
    it('applies base result badge styling', () => {
      render(<ResultCard {...defaultProps} />);

      const result = screen.getByText('당첨');
      expect(result).toHaveClass('px-3');
      expect(result).toHaveClass('py-1.5');
      expect(result).toHaveClass('rounded-lg');
      expect(result).toHaveClass('font-semibold');
    });
  });

  describe('position badge styling', () => {
    it('applies position badge base styling', () => {
      render(<ResultCard {...defaultProps} />);

      const positionBadge = screen.getByText('1번');
      expect(positionBadge).toHaveClass('w-10');
      expect(positionBadge).toHaveClass('h-10');
      expect(positionBadge).toHaveClass('rounded-full');
      expect(positionBadge).toHaveClass('font-bold');
    });
  });

  describe('className', () => {
    it('applies custom className', () => {
      const { container } = render(<ResultCard {...defaultProps} className="custom-class" />);

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('content layout', () => {
    it('renders position, name, and result in correct order', () => {
      const { container } = render(<ResultCard {...defaultProps} />);

      const textContent = container.textContent;
      const positionIndex = textContent.indexOf('1번');
      const nameIndex = textContent.indexOf('John');
      const arrowIndex = textContent.indexOf('→');
      const resultIndex = textContent.indexOf('당첨');

      expect(positionIndex).toBeLessThan(nameIndex);
      expect(nameIndex).toBeLessThan(arrowIndex);
      expect(arrowIndex).toBeLessThan(resultIndex);
    });
  });

  describe('edge cases', () => {
    it('handles long names', () => {
      render(<ResultCard {...defaultProps} name="A Very Long Participant Name" />);
      expect(screen.getByText('A Very Long Participant Name')).toBeInTheDocument();
    });

    it('handles long results', () => {
      render(<ResultCard {...defaultProps} result="Special Prize Winner" />);
      expect(screen.getByText('Special Prize Winner')).toBeInTheDocument();
    });

    it('handles position 0', () => {
      render(<ResultCard {...defaultProps} position={0} />);
      expect(screen.getByText('0번')).toBeInTheDocument();
    });

    it('handles large position numbers', () => {
      render(<ResultCard {...defaultProps} position={99} />);
      expect(screen.getByText('99번')).toBeInTheDocument();
    });

    it('handles special characters in name', () => {
      render(<ResultCard {...defaultProps} name="김철수" />);
      expect(screen.getByText('김철수')).toBeInTheDocument();
    });

    it('handles emoji in result', () => {
      render(<ResultCard {...defaultProps} result="🎉 당첨!" />);
      expect(screen.getByText('🎉 당첨!')).toBeInTheDocument();
    });
  });
});
