import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  describe('rendering', () => {
    it('renders spinner with status role', () => {
      render(<LoadingSpinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders with default aria-label', () => {
      render(<LoadingSpinner />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', '로딩 중...');
    });

    it('renders with custom aria-label', () => {
      render(<LoadingSpinner label="데이터 불러오는 중" />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', '데이터 불러오는 중');
    });

    it('renders SVG with aria-hidden', () => {
      const { container } = render(<LoadingSpinner />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });

    it('renders screen reader only text', () => {
      render(<LoadingSpinner />);
      expect(screen.getByText('로딩 중...')).toHaveClass('sr-only');
    });
  });

  describe('sizes', () => {
    it('applies medium size by default', () => {
      const { container } = render(<LoadingSpinner />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-6');
      expect(svg).toHaveClass('w-6');
    });

    it('applies small size', () => {
      const { container } = render(<LoadingSpinner size="sm" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-4');
      expect(svg).toHaveClass('w-4');
    });

    it('applies large size', () => {
      const { container } = render(<LoadingSpinner size="lg" />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('h-10');
      expect(svg).toHaveClass('w-10');
    });
  });

  describe('label visibility', () => {
    it('does not show label by default', () => {
      render(<LoadingSpinner label="Loading" />);
      const visibleLabel = screen.queryByText('Loading', { selector: 'p' });
      expect(visibleLabel).not.toBeInTheDocument();
    });

    it('shows label when showLabel is true', () => {
      render(<LoadingSpinner showLabel label="Loading..." />);
      const visibleLabel = screen.getByText('Loading...', { selector: 'p' });
      expect(visibleLabel).toBeInTheDocument();
      expect(visibleLabel).toHaveClass('text-sm');
    });
  });

  describe('fullScreen mode', () => {
    it('renders without fullScreen wrapper by default', () => {
      const { container } = render(<LoadingSpinner />);
      expect(container.querySelector('.fixed')).not.toBeInTheDocument();
    });

    it('renders fullScreen wrapper when fullScreen is true', () => {
      const { container } = render(<LoadingSpinner fullScreen />);
      const wrapper = container.querySelector('.fixed');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper).toHaveClass('inset-0');
      expect(wrapper).toHaveClass('z-50');
    });

    it('renders backdrop in fullScreen mode', () => {
      const { container } = render(<LoadingSpinner fullScreen />);
      const backdrop = container.querySelector('.fixed');
      expect(backdrop).toHaveClass('bg-black/50');
      expect(backdrop).toHaveClass('backdrop-blur-sm');
    });

    it('renders card container in fullScreen mode', () => {
      const { container } = render(<LoadingSpinner fullScreen />);
      const card = container.querySelector('.bg-white.rounded-xl');
      expect(card).toBeInTheDocument();
    });
  });

  describe('animation', () => {
    it('applies animate-spin class to SVG', () => {
      const { container } = render(<LoadingSpinner />);
      const svg = container.querySelector('svg');
      expect(svg).toHaveClass('animate-spin');
    });
  });

  describe('className', () => {
    it('applies custom className', () => {
      render(<LoadingSpinner className="custom-spinner" />);
      expect(screen.getByRole('status')).toHaveClass('custom-spinner');
    });
  });

  describe('accessibility', () => {
    it('has correct ARIA attributes for screen readers', () => {
      render(<LoadingSpinner />);
      const status = screen.getByRole('status');
      expect(status).toHaveAttribute('aria-label');
    });

    it('provides screen reader text', () => {
      render(<LoadingSpinner label="Custom loading" />);
      const srText = screen.getByText('Custom loading', { selector: '.sr-only' });
      expect(srText).toBeInTheDocument();
    });
  });
});
