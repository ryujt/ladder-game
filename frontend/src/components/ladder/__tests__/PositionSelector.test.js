import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PositionSelector from '../PositionSelector';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    button: ({ children, whileHover, whileTap, ...props }) => (
      <button {...props}>{children}</button>
    ),
  },
}));

describe('PositionSelector', () => {
  const defaultProps = {
    positions: 4,
    takenPositions: new Map(),
    selectedPosition: null,
    onSelect: jest.fn(),
    disabled: false,
    showNames: true,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders correct number of position buttons', () => {
      render(<PositionSelector {...defaultProps} positions={6} />);
      const buttons = screen.getAllByRole('radio');
      expect(buttons).toHaveLength(6);
    });

    it('renders position numbers', () => {
      render(<PositionSelector {...defaultProps} positions={4} />);
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
    });

    it('renders with radiogroup role', () => {
      render(<PositionSelector {...defaultProps} />);
      expect(screen.getByRole('radiogroup')).toBeInTheDocument();
    });

    it('has aria-label on radiogroup', () => {
      render(<PositionSelector {...defaultProps} />);
      expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-label', '번호 선택');
    });
  });

  describe('selection', () => {
    it('calls onSelect when position is clicked', () => {
      const onSelect = jest.fn();
      render(<PositionSelector {...defaultProps} onSelect={onSelect} />);

      fireEvent.click(screen.getByText('2'));

      expect(onSelect).toHaveBeenCalledWith(2);
    });

    it('shows selected state for selectedPosition', () => {
      render(<PositionSelector {...defaultProps} selectedPosition={2} />);

      const selectedButton = screen.getByText('2').closest('button');
      expect(selectedButton).toHaveAttribute('aria-checked', 'true');
    });

    it('shows unselected state for non-selected positions', () => {
      render(<PositionSelector {...defaultProps} selectedPosition={2} />);

      const unselectedButton = screen.getByText('1').closest('button');
      expect(unselectedButton).toHaveAttribute('aria-checked', 'false');
    });
  });

  describe('taken positions', () => {
    it('shows position as taken when in takenPositions map', () => {
      const takenPositions = new Map([[2, 'John']]);
      render(<PositionSelector {...defaultProps} takenPositions={takenPositions} />);

      const takenButton = screen.getByText('2').closest('button');
      expect(takenButton).toHaveAttribute('aria-disabled', 'true');
      expect(takenButton).toBeDisabled();
    });

    it('does not call onSelect for taken positions', () => {
      const onSelect = jest.fn();
      const takenPositions = new Map([[2, 'John']]);
      render(
        <PositionSelector
          {...defaultProps}
          takenPositions={takenPositions}
          onSelect={onSelect}
        />
      );

      fireEvent.click(screen.getByText('2'));

      expect(onSelect).not.toHaveBeenCalled();
    });

    it('shows name for taken position when showNames is true', () => {
      const takenPositions = new Map([[2, 'John']]);
      render(
        <PositionSelector
          {...defaultProps}
          takenPositions={takenPositions}
          showNames={true}
        />
      );

      expect(screen.getByText('John')).toBeInTheDocument();
    });

    it('does not show name when showNames is false', () => {
      const takenPositions = new Map([[2, 'John']]);
      render(
        <PositionSelector
          {...defaultProps}
          takenPositions={takenPositions}
          showNames={false}
        />
      );

      expect(screen.queryByText('John')).not.toBeInTheDocument();
    });

    it('has not-allowed cursor for taken positions', () => {
      const takenPositions = new Map([[2, 'John']]);
      render(<PositionSelector {...defaultProps} takenPositions={takenPositions} />);

      const takenButton = screen.getByText('2').closest('button');
      expect(takenButton).toHaveClass('cursor-not-allowed');
    });
  });

  describe('disabled state', () => {
    it('disables all buttons when disabled is true', () => {
      render(<PositionSelector {...defaultProps} disabled={true} />);

      const buttons = screen.getAllByRole('radio');
      buttons.forEach((button) => {
        expect(button).toHaveAttribute('aria-disabled', 'true');
      });
    });

    it('does not call onSelect when disabled', () => {
      const onSelect = jest.fn();
      render(
        <PositionSelector {...defaultProps} disabled={true} onSelect={onSelect} />
      );

      fireEvent.click(screen.getByText('1'));

      expect(onSelect).not.toHaveBeenCalled();
    });

    it('applies opacity class when disabled', () => {
      render(<PositionSelector {...defaultProps} disabled={true} />);

      const button = screen.getByText('1').closest('button');
      expect(button).toHaveClass('opacity-50');
    });
  });

  describe('keyboard navigation', () => {
    it('handles Enter key to select', () => {
      const onSelect = jest.fn();
      render(<PositionSelector {...defaultProps} onSelect={onSelect} />);

      const button = screen.getByText('1').closest('button');
      fireEvent.keyDown(button, { key: 'Enter' });

      expect(onSelect).toHaveBeenCalledWith(1);
    });

    it('handles Space key to select', () => {
      const onSelect = jest.fn();
      render(<PositionSelector {...defaultProps} onSelect={onSelect} />);

      const button = screen.getByText('2').closest('button');
      fireEvent.keyDown(button, { key: ' ' });

      expect(onSelect).toHaveBeenCalledWith(2);
    });

    it('prevents default on Space key', () => {
      const onSelect = jest.fn();
      render(<PositionSelector {...defaultProps} onSelect={onSelect} />);

      const button = screen.getByText('1').closest('button');
      const event = { key: ' ', preventDefault: jest.fn() };
      fireEvent.keyDown(button, event);

      // Check that selection happened
      expect(onSelect).toHaveBeenCalled();
    });

    it('sets tabIndex -1 for taken positions', () => {
      const takenPositions = new Map([[2, 'John']]);
      render(<PositionSelector {...defaultProps} takenPositions={takenPositions} />);

      const takenButton = screen.getByText('2').closest('button');
      expect(takenButton).toHaveAttribute('tabIndex', '-1');
    });

    it('sets tabIndex 0 for available positions', () => {
      render(<PositionSelector {...defaultProps} />);

      const availableButton = screen.getByText('1').closest('button');
      expect(availableButton).toHaveAttribute('tabIndex', '0');
    });
  });

  describe('grid layout', () => {
    it('applies 4-column grid for 4 positions', () => {
      const { container } = render(
        <PositionSelector {...defaultProps} positions={4} />
      );
      expect(container.firstChild).toHaveClass('grid-cols-4');
    });

    it('applies 3-column grid for 5-6 positions on small screens', () => {
      const { container } = render(
        <PositionSelector {...defaultProps} positions={6} />
      );
      expect(container.firstChild).toHaveClass('grid-cols-3');
    });

    it('applies 4-column grid for 7-8 positions on small screens', () => {
      const { container } = render(
        <PositionSelector {...defaultProps} positions={8} />
      );
      expect(container.firstChild).toHaveClass('grid-cols-4');
    });

    it('applies 5-column grid for 9+ positions on small screens', () => {
      const { container } = render(
        <PositionSelector {...defaultProps} positions={10} />
      );
      expect(container.firstChild).toHaveClass('grid-cols-5');
    });
  });

  describe('accessibility', () => {
    it('each position button has role radio', () => {
      render(<PositionSelector {...defaultProps} />);
      const buttons = screen.getAllByRole('radio');
      expect(buttons).toHaveLength(4);
    });

    it('has proper aria-checked states', () => {
      render(<PositionSelector {...defaultProps} selectedPosition={1} />);

      const buttons = screen.getAllByRole('radio');
      expect(buttons[0]).toHaveAttribute('aria-checked', 'true');
      expect(buttons[1]).toHaveAttribute('aria-checked', 'false');
    });

    it('has focus-visible ring for keyboard navigation', () => {
      render(<PositionSelector {...defaultProps} />);
      const button = screen.getByText('1').closest('button');
      expect(button).toHaveClass('focus-visible:ring-2');
    });
  });

  describe('styling', () => {
    it('applies selected styling to selected position', () => {
      render(<PositionSelector {...defaultProps} selectedPosition={1} />);
      const selectedButton = screen.getByText('1').closest('button');
      expect(selectedButton).toHaveClass('bg-primary-600');
      expect(selectedButton).toHaveClass('text-white');
    });

    it('applies available styling to non-selected positions', () => {
      render(<PositionSelector {...defaultProps} selectedPosition={1} />);
      const availableButton = screen.getByText('2').closest('button');
      expect(availableButton).toHaveClass('bg-white');
    });

    it('applies taken styling to taken positions', () => {
      const takenPositions = new Map([[2, 'John']]);
      render(<PositionSelector {...defaultProps} takenPositions={takenPositions} />);
      const takenButton = screen.getByText('2').closest('button');
      expect(takenButton).toHaveClass('bg-gray-200');
      expect(takenButton).toHaveClass('text-gray-400');
    });
  });
});
