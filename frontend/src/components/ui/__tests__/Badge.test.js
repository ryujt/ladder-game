import React from 'react';
import { render, screen } from '@testing-library/react';
import Badge from '../Badge';

describe('Badge', () => {
  describe('rendering', () => {
    it('renders children correctly', () => {
      render(<Badge>Status</Badge>);
      expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('renders as a span element', () => {
      const { container } = render(<Badge>Badge</Badge>);
      expect(container.firstChild.tagName).toBe('SPAN');
    });
  });

  describe('variants', () => {
    it('applies default variant by default', () => {
      const { container } = render(<Badge>Default</Badge>);
      expect(container.firstChild).toHaveClass('bg-gray-100');
      expect(container.firstChild).toHaveClass('text-gray-700');
    });

    it('applies success variant', () => {
      const { container } = render(<Badge variant="success">Success</Badge>);
      expect(container.firstChild).toHaveClass('bg-success-100');
      expect(container.firstChild).toHaveClass('text-success-700');
    });

    it('applies warning variant', () => {
      const { container } = render(<Badge variant="warning">Warning</Badge>);
      expect(container.firstChild).toHaveClass('bg-warning-100');
      expect(container.firstChild).toHaveClass('text-warning-700');
    });

    it('applies error variant', () => {
      const { container } = render(<Badge variant="error">Error</Badge>);
      expect(container.firstChild).toHaveClass('bg-error-100');
      expect(container.firstChild).toHaveClass('text-error-700');
    });

    it('applies info variant', () => {
      const { container } = render(<Badge variant="info">Info</Badge>);
      expect(container.firstChild).toHaveClass('bg-primary-100');
      expect(container.firstChild).toHaveClass('text-primary-700');
    });
  });

  describe('dot indicator', () => {
    it('does not render dot by default', () => {
      const { container } = render(<Badge>No Dot</Badge>);
      const dots = container.querySelectorAll('.rounded-full.w-1\\.5');
      expect(dots).toHaveLength(0);
    });

    it('renders dot when dot prop is true', () => {
      const { container } = render(<Badge dot>With Dot</Badge>);
      const dot = container.querySelector('[aria-hidden="true"]');
      expect(dot).toBeInTheDocument();
      expect(dot).toHaveClass('rounded-full');
    });

    it('renders correct dot color for default variant', () => {
      const { container } = render(<Badge dot variant="default">Default</Badge>);
      const dot = container.querySelector('[aria-hidden="true"]');
      expect(dot).toHaveClass('bg-gray-500');
    });

    it('renders correct dot color for success variant', () => {
      const { container } = render(<Badge dot variant="success">Success</Badge>);
      const dot = container.querySelector('[aria-hidden="true"]');
      expect(dot).toHaveClass('bg-success-500');
    });

    it('renders correct dot color for warning variant', () => {
      const { container } = render(<Badge dot variant="warning">Warning</Badge>);
      const dot = container.querySelector('[aria-hidden="true"]');
      expect(dot).toHaveClass('bg-warning-500');
    });

    it('renders correct dot color for error variant', () => {
      const { container } = render(<Badge dot variant="error">Error</Badge>);
      const dot = container.querySelector('[aria-hidden="true"]');
      expect(dot).toHaveClass('bg-error-500');
    });

    it('renders correct dot color for info variant', () => {
      const { container } = render(<Badge dot variant="info">Info</Badge>);
      const dot = container.querySelector('[aria-hidden="true"]');
      expect(dot).toHaveClass('bg-primary-500');
    });
  });

  describe('icon', () => {
    it('renders icon when provided', () => {
      const icon = <span data-testid="badge-icon">*</span>;
      render(<Badge icon={icon}>With Icon</Badge>);
      expect(screen.getByTestId('badge-icon')).toBeInTheDocument();
    });

    it('renders icon inside badge', () => {
      render(<Badge icon={<span data-testid="icon">!</span>}>Text</Badge>);
      // Both icon and text should be present
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Text')).toBeInTheDocument();
    });
  });

  describe('styling', () => {
    it('applies base styling', () => {
      const { container } = render(<Badge>Base</Badge>);
      expect(container.firstChild).toHaveClass('inline-flex');
      expect(container.firstChild).toHaveClass('items-center');
      expect(container.firstChild).toHaveClass('rounded-full');
      expect(container.firstChild).toHaveClass('text-xs');
      expect(container.firstChild).toHaveClass('font-medium');
    });

    it('applies custom className', () => {
      const { container } = render(<Badge className="custom-class">Custom</Badge>);
      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('native props', () => {
    it('passes through native props', () => {
      const { container } = render(
        <Badge data-testid="badge" title="Badge title">Badge</Badge>
      );
      expect(container.firstChild).toHaveAttribute('data-testid', 'badge');
      expect(container.firstChild).toHaveAttribute('title', 'Badge title');
    });
  });

  describe('combined features', () => {
    it('renders with dot and icon together', () => {
      const { container } = render(
        <Badge dot icon={<span data-testid="icon">*</span>}>
          Complete
        </Badge>
      );
      expect(container.querySelector('[aria-hidden="true"]')).toBeInTheDocument();
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(screen.getByText('Complete')).toBeInTheDocument();
    });
  });
});
