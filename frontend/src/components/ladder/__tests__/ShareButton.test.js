import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import ShareButton from '../ShareButton';
import { useToastStore } from '../../../hooks/useToast';

// Mock useToast hook
jest.mock('../../../hooks/useToast', () => ({
  useToast: () => ({
    success: jest.fn(),
    error: jest.fn(),
  }),
  useToastStore: {
    getState: () => ({
      addToast: jest.fn(),
      removeToast: jest.fn(),
      toasts: [],
    }),
    setState: jest.fn(),
  },
}));

describe('ShareButton', () => {
  const defaultProps = {
    url: 'https://example.com/ladder/123',
    title: '사다리 게임',
    text: '사다리 게임에 참여하세요!',
  };

  let originalNavigator;
  let originalClipboard;

  beforeEach(() => {
    jest.useFakeTimers();
    originalNavigator = { ...navigator };
    originalClipboard = navigator.clipboard;

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: jest.fn().mockResolvedValue(),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
      configurable: true,
    });
  });

  describe('rendering', () => {
    it('renders button', () => {
      // Remove share capability
      delete navigator.share;

      render(<ShareButton {...defaultProps} />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('shows "링크 복사" when navigator.share is not available', () => {
      delete navigator.share;

      render(<ShareButton {...defaultProps} />);

      expect(screen.getByRole('button')).toHaveTextContent('링크 복사');
    });

    it('shows "공유하기" when navigator.share is available', () => {
      Object.defineProperty(navigator, 'share', {
        value: jest.fn().mockResolvedValue(),
        writable: true,
        configurable: true,
      });

      render(<ShareButton {...defaultProps} />);

      expect(screen.getByRole('button')).toHaveTextContent('공유하기');
    });
  });

  describe('copy functionality', () => {
    beforeEach(() => {
      delete navigator.share;
    });

    it('copies URL to clipboard when clicked', async () => {
      render(<ShareButton {...defaultProps} />);

      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'https://example.com/ladder/123'
      );
    });

    it('shows "복사 완료!" after successful copy', async () => {
      render(<ShareButton {...defaultProps} />);

      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });

      expect(screen.getByRole('button')).toHaveTextContent('복사 완료!');
    });

    it('resets to "링크 복사" after 2 seconds', async () => {
      render(<ShareButton {...defaultProps} />);

      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });

      expect(screen.getByRole('button')).toHaveTextContent('복사 완료!');

      await act(async () => {
        jest.advanceTimersByTime(2000);
      });

      expect(screen.getByRole('button')).toHaveTextContent('링크 복사');
    });

    it('calls onCopy callback on successful copy', async () => {
      const onCopy = jest.fn();

      render(<ShareButton {...defaultProps} onCopy={onCopy} />);

      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });

      expect(onCopy).toHaveBeenCalled();
    });

    it('changes variant to success after copy', async () => {
      render(<ShareButton {...defaultProps} />);

      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-success-600');
    });
  });

  describe('share functionality', () => {
    it('calls navigator.share when available', async () => {
      const shareMock = jest.fn().mockResolvedValue();
      Object.defineProperty(navigator, 'share', {
        value: shareMock,
        writable: true,
        configurable: true,
      });

      render(<ShareButton {...defaultProps} />);

      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });

      expect(shareMock).toHaveBeenCalledWith({
        title: '사다리 게임',
        text: '사다리 게임에 참여하세요!',
        url: 'https://example.com/ladder/123',
      });
    });

    it('calls onShare callback on successful share', async () => {
      const onShare = jest.fn();
      Object.defineProperty(navigator, 'share', {
        value: jest.fn().mockResolvedValue(),
        writable: true,
        configurable: true,
      });

      render(<ShareButton {...defaultProps} onShare={onShare} />);

      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });

      expect(onShare).toHaveBeenCalled();
    });

    it('falls back to copy when share fails', async () => {
      Object.defineProperty(navigator, 'share', {
        value: jest.fn().mockRejectedValue(new Error('Share failed')),
        writable: true,
        configurable: true,
      });

      render(<ShareButton {...defaultProps} />);

      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });

      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        'https://example.com/ladder/123'
      );
    });

    it('does not copy when share is aborted by user', async () => {
      const abortError = new Error('User cancelled');
      abortError.name = 'AbortError';

      Object.defineProperty(navigator, 'share', {
        value: jest.fn().mockRejectedValue(abortError),
        writable: true,
        configurable: true,
      });

      render(<ShareButton {...defaultProps} />);

      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });

      expect(navigator.clipboard.writeText).not.toHaveBeenCalled();
    });
  });

  describe('props', () => {
    beforeEach(() => {
      delete navigator.share;
    });

    it('applies custom variant', () => {
      render(<ShareButton {...defaultProps} variant="secondary" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-gray-100');
    });

    it('applies custom size', () => {
      render(<ShareButton {...defaultProps} size="lg" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('h-12');
    });

    it('applies fullWidth', () => {
      render(<ShareButton {...defaultProps} fullWidth />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('w-full');
    });

    it('applies custom className', () => {
      render(<ShareButton {...defaultProps} className="custom-class" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-class');
    });
  });

  describe('error handling', () => {
    beforeEach(() => {
      delete navigator.share;
    });

    it('handles clipboard write failure', async () => {
      navigator.clipboard.writeText.mockRejectedValueOnce(new Error('Clipboard error'));

      render(<ShareButton {...defaultProps} />);

      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });

      // Should not show "복사 완료!" on error
      expect(screen.getByRole('button')).toHaveTextContent('링크 복사');
    });
  });

  describe('icons', () => {
    it('shows copy icon when share is not available', () => {
      delete navigator.share;

      const { container } = render(<ShareButton {...defaultProps} />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('shows share icon when share is available', () => {
      Object.defineProperty(navigator, 'share', {
        value: jest.fn().mockResolvedValue(),
        writable: true,
        configurable: true,
      });

      const { container } = render(<ShareButton {...defaultProps} />);

      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('shows check icon after successful copy', async () => {
      delete navigator.share;

      render(<ShareButton {...defaultProps} />);

      await act(async () => {
        fireEvent.click(screen.getByRole('button'));
      });

      // After copy, the button should show check icon and "복사 완료!"
      expect(screen.getByRole('button')).toHaveTextContent('복사 완료!');
    });
  });
});
