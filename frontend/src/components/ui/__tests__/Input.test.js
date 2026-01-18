import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../Input';

describe('Input', () => {
  describe('rendering', () => {
    it('renders input element', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('renders label when provided', () => {
      render(<Input label="Email" />);
      expect(screen.getByText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
    });

    it('connects label to input via id', () => {
      render(<Input label="Username" id="username-input" />);
      const label = screen.getByText('Username');
      const input = screen.getByRole('textbox');
      expect(label).toHaveAttribute('for', 'username-input');
      expect(input).toHaveAttribute('id', 'username-input');
    });

    it('generates unique id when not provided', () => {
      render(<Input label="Test" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('id');
    });
  });

  describe('sizes', () => {
    it('applies medium size by default', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).toHaveClass('h-10');
    });

    it('applies small size', () => {
      render(<Input size="sm" />);
      expect(screen.getByRole('textbox')).toHaveClass('h-8');
    });

    it('applies large size', () => {
      render(<Input size="lg" />);
      expect(screen.getByRole('textbox')).toHaveClass('h-12');
    });
  });

  describe('error state', () => {
    it('renders error message when error prop is provided', () => {
      render(<Input error="This field is required" />);
      expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
    });

    it('sets aria-invalid to true when error exists', () => {
      render(<Input error="Invalid input" />);
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-describedby to error id', () => {
      render(<Input id="test" error="Error message" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'test-error');
    });

    it('applies error styling', () => {
      render(<Input error="Error" />);
      expect(screen.getByRole('textbox')).toHaveClass('border-error-500');
    });

    it('does not have aria-invalid when no error', () => {
      render(<Input />);
      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
    });
  });

  describe('helper text', () => {
    it('renders helper text when provided', () => {
      render(<Input helperText="Enter your email address" />);
      expect(screen.getByText('Enter your email address')).toBeInTheDocument();
    });

    it('sets aria-describedby to helper id', () => {
      render(<Input id="email" helperText="Helper text" />);
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-describedby', 'email-helper');
    });

    it('error takes precedence over helper text', () => {
      render(<Input error="Error message" helperText="Helper text" />);
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  describe('addons', () => {
    it('renders left addon', () => {
      render(<Input leftAddon={<span data-testid="left-addon">$</span>} />);
      expect(screen.getByTestId('left-addon')).toBeInTheDocument();
    });

    it('renders right addon', () => {
      render(<Input rightAddon={<span data-testid="right-addon">@</span>} />);
      expect(screen.getByTestId('right-addon')).toBeInTheDocument();
    });

    it('applies left padding when left addon exists', () => {
      render(<Input leftAddon={<span>$</span>} />);
      expect(screen.getByRole('textbox')).toHaveClass('pl-10');
    });

    it('applies right padding when right addon exists', () => {
      render(<Input rightAddon={<span>@</span>} />);
      expect(screen.getByRole('textbox')).toHaveClass('pr-10');
    });
  });

  describe('events', () => {
    it('calls onChange when value changes', () => {
      const handleChange = jest.fn();
      render(<Input onChange={handleChange} />);
      fireEvent.change(screen.getByRole('textbox'), { target: { value: 'test' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus when focused', () => {
      const handleFocus = jest.fn();
      render(<Input onFocus={handleFocus} />);
      fireEvent.focus(screen.getByRole('textbox'));
      expect(handleFocus).toHaveBeenCalled();
    });

    it('calls onBlur when blurred', () => {
      const handleBlur = jest.fn();
      render(<Input onBlur={handleBlur} />);
      fireEvent.blur(screen.getByRole('textbox'));
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('className', () => {
    it('applies custom className to input', () => {
      render(<Input className="custom-input" />);
      expect(screen.getByRole('textbox')).toHaveClass('custom-input');
    });

    it('applies wrapperClassName to wrapper', () => {
      const { container } = render(<Input wrapperClassName="custom-wrapper" />);
      expect(container.firstChild).toHaveClass('custom-wrapper');
    });
  });

  describe('forwarded ref', () => {
    it('forwards ref to input element', () => {
      const ref = React.createRef();
      render(<Input ref={ref} />);
      expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });
  });

  describe('native props', () => {
    it('passes through native input props', () => {
      render(
        <Input
          placeholder="Enter text"
          maxLength={100}
          disabled
          readOnly
        />
      );
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('placeholder', 'Enter text');
      expect(input).toHaveAttribute('maxLength', '100');
      expect(input).toBeDisabled();
      expect(input).toHaveAttribute('readOnly');
    });
  });
});
