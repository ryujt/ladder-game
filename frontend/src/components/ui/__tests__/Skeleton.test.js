import React from 'react';
import { render, screen } from '@testing-library/react';
import Skeleton from '../Skeleton';

describe('Skeleton', () => {
  describe('rendering', () => {
    it('renders with status role', () => {
      render(<Skeleton />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('renders with aria-label', () => {
      render(<Skeleton />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', '로딩 중');
    });

    it('renders screen reader only text', () => {
      render(<Skeleton />);
      expect(screen.getByText('로딩 중...')).toHaveClass('sr-only');
    });
  });

  describe('variants', () => {
    it('applies text variant by default', () => {
      const { container } = render(<Skeleton />);
      expect(container.firstChild).toHaveClass('h-4');
      expect(container.firstChild).toHaveClass('w-full');
      expect(container.firstChild).toHaveClass('rounded');
    });

    it('applies circle variant', () => {
      const { container } = render(<Skeleton variant="circle" />);
      expect(container.firstChild).toHaveClass('rounded-full');
    });

    it('applies rect variant', () => {
      const { container } = render(<Skeleton variant="rect" />);
      expect(container.firstChild).toHaveClass('rounded-lg');
    });

    it('applies button variant', () => {
      const { container } = render(<Skeleton variant="button" />);
      expect(container.firstChild).toHaveClass('h-10');
      expect(container.firstChild).toHaveClass('w-24');
      expect(container.firstChild).toHaveClass('rounded-lg');
    });
  });

  describe('custom dimensions', () => {
    it('applies custom width', () => {
      const { container } = render(<Skeleton width="200px" />);
      expect(container.firstChild).toHaveStyle({ width: '200px' });
    });

    it('applies custom height', () => {
      const { container } = render(<Skeleton height="50px" />);
      expect(container.firstChild).toHaveStyle({ height: '50px' });
    });

    it('applies width as both width and height for circle variant', () => {
      const { container } = render(<Skeleton variant="circle" width="100px" />);
      expect(container.firstChild).toHaveStyle({ width: '100px', height: '100px' });
    });

    it('uses separate height for non-circle variants', () => {
      const { container } = render(<Skeleton variant="rect" width="200px" height="100px" />);
      expect(container.firstChild).toHaveStyle({ width: '200px', height: '100px' });
    });
  });

  describe('styling', () => {
    it('applies shimmer animation class', () => {
      const { container } = render(<Skeleton />);
      expect(container.firstChild).toHaveClass('skeleton-shimmer');
    });

    it('applies base rounded class', () => {
      const { container } = render(<Skeleton />);
      expect(container.firstChild).toHaveClass('rounded');
    });

    it('applies custom className', () => {
      const { container } = render(<Skeleton className="custom-skeleton" />);
      expect(container.firstChild).toHaveClass('custom-skeleton');
    });
  });

  describe('native props', () => {
    it('passes through native props', () => {
      const { container } = render(
        <Skeleton data-testid="skeleton" title="Loading placeholder" />
      );
      expect(container.firstChild).toHaveAttribute('data-testid', 'skeleton');
      expect(container.firstChild).toHaveAttribute('title', 'Loading placeholder');
    });
  });
});

describe('Skeleton.Group', () => {
  it('renders children', () => {
    render(
      <Skeleton.Group>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Skeleton.Group>
    );
    expect(screen.getAllByRole('status')).toHaveLength(3);
  });

  it('applies aria-busy attribute', () => {
    const { container } = render(
      <Skeleton.Group>
        <Skeleton />
      </Skeleton.Group>
    );
    expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
  });

  it('applies default spacing class', () => {
    const { container } = render(
      <Skeleton.Group>
        <Skeleton />
      </Skeleton.Group>
    );
    expect(container.firstChild).toHaveClass('space-y-3');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Skeleton.Group className="custom-group">
        <Skeleton />
      </Skeleton.Group>
    );
    expect(container.firstChild).toHaveClass('custom-group');
  });

  it('can be used to create loading placeholders', () => {
    render(
      <Skeleton.Group>
        <Skeleton variant="circle" width="48px" />
        <Skeleton width="80%" />
        <Skeleton width="60%" />
      </Skeleton.Group>
    );

    const skeletons = screen.getAllByRole('status');
    expect(skeletons).toHaveLength(3);
  });
});
