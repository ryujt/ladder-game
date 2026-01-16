import { cn } from '../cn';

describe('cn utility function', () => {
  describe('basic functionality', () => {
    it('returns empty string for no arguments', () => {
      expect(cn()).toBe('');
    });

    it('returns single class string', () => {
      expect(cn('foo')).toBe('foo');
    });

    it('joins multiple class strings', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('joins multiple class strings with spaces', () => {
      expect(cn('foo', 'bar', 'baz')).toBe('foo bar baz');
    });
  });

  describe('conditional classes', () => {
    it('handles boolean false', () => {
      expect(cn('foo', false)).toBe('foo');
    });

    it('handles boolean true condition', () => {
      expect(cn('foo', true && 'bar')).toBe('foo bar');
    });

    it('handles falsy values', () => {
      expect(cn('foo', null, undefined, false, '')).toBe('foo');
    });

    it('handles conditional classes with ternary', () => {
      const isActive = true;
      expect(cn('base', isActive ? 'active' : 'inactive')).toBe('base active');
    });

    it('handles conditional classes with logical AND', () => {
      const showExtra = false;
      expect(cn('base', showExtra && 'extra')).toBe('base');
    });
  });

  describe('object syntax (clsx feature)', () => {
    it('handles object with true values', () => {
      expect(cn({ foo: true, bar: true })).toBe('foo bar');
    });

    it('handles object with false values', () => {
      expect(cn({ foo: true, bar: false })).toBe('foo');
    });

    it('handles mixed object and string', () => {
      expect(cn('base', { active: true, disabled: false })).toBe('base active');
    });

    it('handles nested conditions in object', () => {
      const isActive = true;
      const isDisabled = false;
      expect(cn({ active: isActive, disabled: isDisabled })).toBe('active');
    });
  });

  describe('array syntax (clsx feature)', () => {
    it('handles arrays of classes', () => {
      expect(cn(['foo', 'bar'])).toBe('foo bar');
    });

    it('handles mixed arrays and strings', () => {
      expect(cn('base', ['foo', 'bar'])).toBe('base foo bar');
    });

    it('handles nested arrays', () => {
      expect(cn(['foo', ['bar', 'baz']])).toBe('foo bar baz');
    });
  });

  describe('tailwind-merge functionality', () => {
    it('merges conflicting padding classes', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
    });

    it('merges conflicting margin classes', () => {
      expect(cn('m-4', 'm-8')).toBe('m-8');
    });

    it('merges conflicting text color classes', () => {
      expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
    });

    it('merges conflicting background color classes', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('keeps non-conflicting classes', () => {
      expect(cn('p-4', 'm-4')).toBe('p-4 m-4');
    });

    it('merges conflicting flex classes', () => {
      expect(cn('flex-row', 'flex-col')).toBe('flex-col');
    });

    it('merges conflicting width classes', () => {
      expect(cn('w-full', 'w-4')).toBe('w-4');
    });

    it('merges conflicting height classes', () => {
      expect(cn('h-full', 'h-screen')).toBe('h-screen');
    });

    it('handles complex tailwind merging', () => {
      expect(cn(
        'px-2 py-1 bg-red-500 text-white',
        'px-4 bg-blue-500'
      )).toBe('py-1 text-white px-4 bg-blue-500');
    });
  });

  describe('real-world usage patterns', () => {
    it('handles button variant pattern', () => {
      const variant = 'primary';
      const variants = {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-200 text-gray-900',
      };
      expect(cn('btn-base', variants[variant])).toBe('btn-base bg-blue-500 text-white');
    });

    it('handles conditional button states', () => {
      const isDisabled = true;
      const isLoading = false;
      expect(cn(
        'btn',
        isDisabled && 'opacity-50 cursor-not-allowed',
        isLoading && 'loading'
      )).toBe('btn opacity-50 cursor-not-allowed');
    });

    it('handles size variants', () => {
      const size = 'lg';
      const sizes = { sm: 'h-8', md: 'h-10', lg: 'h-12' };
      expect(cn('btn', sizes[size])).toBe('btn h-12');
    });

    it('allows overriding default styles', () => {
      const defaultStyles = 'p-4 bg-white text-black';
      const customStyles = 'p-8 bg-gray-100';
      expect(cn(defaultStyles, customStyles)).toBe('text-black p-8 bg-gray-100');
    });

    it('handles component composition', () => {
      const baseStyles = 'flex items-center justify-center';
      const variantStyles = 'bg-primary-500 text-white';
      const sizeStyles = 'h-10 px-4';
      const customClassName = 'my-custom-class';

      expect(cn(baseStyles, variantStyles, sizeStyles, customClassName))
        .toBe('flex items-center justify-center bg-primary-500 text-white h-10 px-4 my-custom-class');
    });
  });

  describe('edge cases', () => {
    it('handles number 0', () => {
      expect(cn('foo', 0)).toBe('foo');
    });

    it('handles empty strings', () => {
      expect(cn('foo', '', 'bar')).toBe('foo bar');
    });

    it('handles whitespace-only strings', () => {
      expect(cn('foo', '   ', 'bar')).toBe('foo bar');
    });

    it('handles mixed types', () => {
      expect(cn('foo', null, { bar: true }, ['baz', { qux: false }]))
        .toBe('foo bar baz');
    });
  });
});
