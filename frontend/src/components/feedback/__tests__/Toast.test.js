import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Toast, { ToastContainer } from '../Toast';

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => {
      const { initial, animate, exit, transition, layout, ...rest } = props;
      return <div {...rest}>{children}</div>;
    },
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('Toast', () => {
  const defaultProps = {
    id: 1,
    type: 'info',
    message: 'Test message',
    onDismiss: jest.fn(),
    duration: 3000,
  };

  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('rendering', () => {
    it('renders message', () => {
      render(<Toast {...defaultProps} />);
      expect(screen.getByText('Test message')).toBeInTheDocument();
    });

    it('renders with alert role', () => {
      render(<Toast {...defaultProps} />);
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('renders close button', () => {
      render(<Toast {...defaultProps} />);
      expect(screen.getByRole('button', { name: '닫기' })).toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('renders success variant', () => {
      render(<Toast {...defaultProps} type="success" />);
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('bg-success-50');
      expect(toast).toHaveClass('border-success-200');
    });

    it('renders error variant', () => {
      render(<Toast {...defaultProps} type="error" />);
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('bg-error-50');
      expect(toast).toHaveClass('border-error-200');
    });

    it('renders warning variant', () => {
      render(<Toast {...defaultProps} type="warning" />);
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('bg-warning-50');
      expect(toast).toHaveClass('border-warning-200');
    });

    it('renders info variant', () => {
      render(<Toast {...defaultProps} type="info" />);
      const toast = screen.getByRole('alert');
      expect(toast).toHaveClass('bg-primary-50');
      expect(toast).toHaveClass('border-primary-200');
    });
  });

  describe('icons', () => {
    it('renders icon for each type', () => {
      const types = ['success', 'error', 'warning', 'info'];

      types.forEach((type) => {
        const { container, unmount } = render(
          <Toast {...defaultProps} type={type} />
        );
        expect(container.querySelector('svg')).toBeInTheDocument();
        unmount();
      });
    });
  });

  describe('dismiss behavior', () => {
    it('calls onDismiss when close button is clicked', () => {
      const onDismiss = jest.fn();
      render(<Toast {...defaultProps} onDismiss={onDismiss} />);

      fireEvent.click(screen.getByRole('button', { name: '닫기' }));

      expect(onDismiss).toHaveBeenCalledWith(defaultProps.id);
    });

    it('auto-dismisses after duration', () => {
      const onDismiss = jest.fn();
      render(<Toast {...defaultProps} onDismiss={onDismiss} duration={3000} />);

      expect(onDismiss).not.toHaveBeenCalled();

      jest.advanceTimersByTime(3000);

      expect(onDismiss).toHaveBeenCalledWith(defaultProps.id);
    });

    it('does not auto-dismiss when duration is 0', () => {
      const onDismiss = jest.fn();
      render(<Toast {...defaultProps} onDismiss={onDismiss} duration={0} />);

      jest.advanceTimersByTime(10000);

      expect(onDismiss).not.toHaveBeenCalled();
    });

    it('clears timer on unmount', () => {
      const onDismiss = jest.fn();
      const { unmount } = render(
        <Toast {...defaultProps} onDismiss={onDismiss} duration={3000} />
      );

      unmount();
      jest.advanceTimersByTime(3000);

      expect(onDismiss).not.toHaveBeenCalled();
    });
  });

  describe('accessibility', () => {
    it('has aria-live attribute', () => {
      render(<Toast {...defaultProps} />);
      expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite');
    });

    it('close button has aria-label', () => {
      render(<Toast {...defaultProps} />);
      expect(screen.getByRole('button')).toHaveAttribute('aria-label', '닫기');
    });
  });
});

describe('ToastContainer', () => {
  const mockOnDismiss = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty when no toasts', () => {
    const { container } = render(
      <ToastContainer toasts={[]} onDismiss={mockOnDismiss} />
    );
    expect(container.querySelector('[aria-label="알림"]')).toBeInTheDocument();
  });

  it('renders multiple toasts', () => {
    const toasts = [
      { id: 1, type: 'success', message: 'Success!' },
      { id: 2, type: 'error', message: 'Error!' },
      { id: 3, type: 'info', message: 'Info!' },
    ];

    render(<ToastContainer toasts={toasts} onDismiss={mockOnDismiss} />);

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Error!')).toBeInTheDocument();
    expect(screen.getByText('Info!')).toBeInTheDocument();
  });

  it('has proper container positioning classes', () => {
    const { container } = render(
      <ToastContainer toasts={[]} onDismiss={mockOnDismiss} />
    );

    const toastContainer = container.firstChild;
    expect(toastContainer).toHaveClass('fixed');
    expect(toastContainer).toHaveClass('top-4');
    expect(toastContainer).toHaveClass('z-50');
  });

  it('passes onDismiss to each toast', () => {
    const toasts = [{ id: 1, type: 'info', message: 'Test' }];

    render(<ToastContainer toasts={toasts} onDismiss={mockOnDismiss} />);

    fireEvent.click(screen.getByRole('button', { name: '닫기' }));

    expect(mockOnDismiss).toHaveBeenCalledWith(1);
  });

  it('has aria-label for accessibility', () => {
    const { container } = render(
      <ToastContainer toasts={[]} onDismiss={mockOnDismiss} />
    );

    expect(container.firstChild).toHaveAttribute('aria-label', '알림');
  });
});
