import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '../Card';

describe('Card', () => {
  describe('Card component', () => {
    it('renders children correctly', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    describe('variants', () => {
      it('applies elevated variant by default', () => {
        const { container } = render(<Card>Content</Card>);
        expect(container.firstChild).toHaveClass('shadow-card');
      });

      it('applies outlined variant', () => {
        const { container } = render(<Card variant="outlined">Content</Card>);
        expect(container.firstChild).toHaveClass('border');
        expect(container.firstChild).toHaveClass('border-gray-200');
        expect(container.firstChild).toHaveClass('shadow-none');
      });

      it('applies filled variant', () => {
        const { container } = render(<Card variant="filled">Content</Card>);
        expect(container.firstChild).toHaveClass('bg-gray-50');
        expect(container.firstChild).toHaveClass('shadow-none');
      });
    });

    describe('interactive state', () => {
      it('applies interactive styles when interactive is true', () => {
        const { container } = render(<Card interactive>Content</Card>);
        expect(container.firstChild).toHaveClass('cursor-pointer');
      });

      it('does not apply interactive styles by default', () => {
        const { container } = render(<Card>Content</Card>);
        expect(container.firstChild).not.toHaveClass('cursor-pointer');
      });
    });

    describe('className', () => {
      it('applies custom className', () => {
        const { container } = render(<Card className="custom-class">Content</Card>);
        expect(container.firstChild).toHaveClass('custom-class');
      });
    });

    describe('native props', () => {
      it('passes through native props', () => {
        const { container } = render(
          <Card data-testid="card" role="article">Content</Card>
        );
        expect(container.firstChild).toHaveAttribute('data-testid', 'card');
        expect(container.firstChild).toHaveAttribute('role', 'article');
      });
    });
  });

  describe('Card.Header', () => {
    it('renders header content', () => {
      render(
        <Card>
          <Card.Header>Header Content</Card.Header>
        </Card>
      );
      expect(screen.getByText('Header Content')).toBeInTheDocument();
    });

    it('applies header styling', () => {
      render(
        <Card>
          <Card.Header data-testid="header">Header</Card.Header>
        </Card>
      );
      const header = screen.getByTestId('header');
      expect(header).toHaveClass('px-6');
      expect(header).toHaveClass('py-4');
      expect(header).toHaveClass('border-b');
    });

    it('applies custom className', () => {
      render(
        <Card>
          <Card.Header className="custom-header" data-testid="header">
            Header
          </Card.Header>
        </Card>
      );
      expect(screen.getByTestId('header')).toHaveClass('custom-header');
    });
  });

  describe('Card.Body', () => {
    it('renders body content', () => {
      render(
        <Card>
          <Card.Body>Body Content</Card.Body>
        </Card>
      );
      expect(screen.getByText('Body Content')).toBeInTheDocument();
    });

    it('applies body styling', () => {
      render(
        <Card>
          <Card.Body data-testid="body">Body</Card.Body>
        </Card>
      );
      const body = screen.getByTestId('body');
      expect(body).toHaveClass('px-6');
      expect(body).toHaveClass('py-5');
    });

    it('applies custom className', () => {
      render(
        <Card>
          <Card.Body className="custom-body" data-testid="body">
            Body
          </Card.Body>
        </Card>
      );
      expect(screen.getByTestId('body')).toHaveClass('custom-body');
    });
  });

  describe('Card.Footer', () => {
    it('renders footer content', () => {
      render(
        <Card>
          <Card.Footer>Footer Content</Card.Footer>
        </Card>
      );
      expect(screen.getByText('Footer Content')).toBeInTheDocument();
    });

    it('applies footer styling', () => {
      render(
        <Card>
          <Card.Footer data-testid="footer">Footer</Card.Footer>
        </Card>
      );
      const footer = screen.getByTestId('footer');
      expect(footer).toHaveClass('px-6');
      expect(footer).toHaveClass('py-4');
      expect(footer).toHaveClass('border-t');
      expect(footer).toHaveClass('rounded-b-xl');
    });

    it('applies custom className', () => {
      render(
        <Card>
          <Card.Footer className="custom-footer" data-testid="footer">
            Footer
          </Card.Footer>
        </Card>
      );
      expect(screen.getByTestId('footer')).toHaveClass('custom-footer');
    });
  });

  describe('compound component usage', () => {
    it('renders complete card with all slots', () => {
      render(
        <Card>
          <Card.Header>Title</Card.Header>
          <Card.Body>Main content</Card.Body>
          <Card.Footer>Actions</Card.Footer>
        </Card>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
      expect(screen.getByText('Main content')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });
});
