import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Select from '../Select';

describe('Select', () => {
  const renderWithOptions = (props = {}) => {
    return render(
      <Select {...props}>
        <option value="">Select an option</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>
    );
  };

  describe('rendering', () => {
    it('renders select element', () => {
      renderWithOptions();
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders all options', () => {
      renderWithOptions();
      expect(screen.getAllByRole('option')).toHaveLength(4);
    });

    it('renders label when provided', () => {
      renderWithOptions({ label: 'Category' });
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByLabelText('Category')).toBeInTheDocument();
    });

    it('connects label to select via id', () => {
      renderWithOptions({ label: 'Category', id: 'category-select' });
      const label = screen.getByText('Category');
      const select = screen.getByRole('combobox');
      expect(label).toHaveAttribute('for', 'category-select');
      expect(select).toHaveAttribute('id', 'category-select');
    });

    it('generates unique id when not provided', () => {
      renderWithOptions({ label: 'Test' });
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('id');
    });

    it('renders dropdown icon', () => {
      const { container } = renderWithOptions();
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('sizes', () => {
    it('applies medium size by default', () => {
      renderWithOptions();
      expect(screen.getByRole('combobox')).toHaveClass('h-10');
    });

    it('applies small size', () => {
      renderWithOptions({ size: 'sm' });
      expect(screen.getByRole('combobox')).toHaveClass('h-8');
    });

    it('applies large size', () => {
      renderWithOptions({ size: 'lg' });
      expect(screen.getByRole('combobox')).toHaveClass('h-12');
    });
  });

  describe('error state', () => {
    it('renders error message when error prop is provided', () => {
      renderWithOptions({ error: 'Please select an option' });
      expect(screen.getByRole('alert')).toHaveTextContent('Please select an option');
    });

    it('sets aria-invalid to true when error exists', () => {
      renderWithOptions({ error: 'Invalid selection' });
      expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('sets aria-describedby to error id', () => {
      renderWithOptions({ id: 'test', error: 'Error message' });
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-describedby', 'test-error');
    });

    it('applies error styling', () => {
      renderWithOptions({ error: 'Error' });
      expect(screen.getByRole('combobox')).toHaveClass('border-error-500');
    });

    it('does not have aria-invalid when no error', () => {
      renderWithOptions();
      expect(screen.getByRole('combobox')).not.toHaveAttribute('aria-invalid');
    });
  });

  describe('helper text', () => {
    it('renders helper text when provided', () => {
      renderWithOptions({ helperText: 'Choose the best option' });
      expect(screen.getByText('Choose the best option')).toBeInTheDocument();
    });

    it('sets aria-describedby to helper id', () => {
      renderWithOptions({ id: 'cat', helperText: 'Helper text' });
      const select = screen.getByRole('combobox');
      expect(select).toHaveAttribute('aria-describedby', 'cat-helper');
    });

    it('error takes precedence over helper text', () => {
      renderWithOptions({ error: 'Error message', helperText: 'Helper text' });
      expect(screen.getByText('Error message')).toBeInTheDocument();
      expect(screen.queryByText('Helper text')).not.toBeInTheDocument();
    });
  });

  describe('events', () => {
    it('calls onChange when selection changes', () => {
      const handleChange = jest.fn();
      renderWithOptions({ onChange: handleChange });
      fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });
      expect(handleChange).toHaveBeenCalled();
    });

    it('calls onFocus when focused', () => {
      const handleFocus = jest.fn();
      renderWithOptions({ onFocus: handleFocus });
      fireEvent.focus(screen.getByRole('combobox'));
      expect(handleFocus).toHaveBeenCalled();
    });

    it('calls onBlur when blurred', () => {
      const handleBlur = jest.fn();
      renderWithOptions({ onBlur: handleBlur });
      fireEvent.blur(screen.getByRole('combobox'));
      expect(handleBlur).toHaveBeenCalled();
    });
  });

  describe('className', () => {
    it('applies custom className to select', () => {
      renderWithOptions({ className: 'custom-select' });
      expect(screen.getByRole('combobox')).toHaveClass('custom-select');
    });

    it('applies wrapperClassName to wrapper', () => {
      const { container } = renderWithOptions({ wrapperClassName: 'custom-wrapper' });
      expect(container.firstChild).toHaveClass('custom-wrapper');
    });
  });

  describe('forwarded ref', () => {
    it('forwards ref to select element', () => {
      const ref = React.createRef();
      render(
        <Select ref={ref}>
          <option value="1">Option 1</option>
        </Select>
      );
      expect(ref.current).toBeInstanceOf(HTMLSelectElement);
    });
  });

  describe('native props', () => {
    it('passes through native select props', () => {
      renderWithOptions({
        disabled: true,
        required: true,
        name: 'category',
      });
      const select = screen.getByRole('combobox');
      expect(select).toBeDisabled();
      expect(select).toBeRequired();
      expect(select).toHaveAttribute('name', 'category');
    });
  });

  describe('accessibility', () => {
    it('has appearance-none for custom styling', () => {
      renderWithOptions();
      expect(screen.getByRole('combobox')).toHaveClass('appearance-none');
    });

    it('has cursor-pointer style', () => {
      renderWithOptions();
      expect(screen.getByRole('combobox')).toHaveClass('cursor-pointer');
    });
  });
});
