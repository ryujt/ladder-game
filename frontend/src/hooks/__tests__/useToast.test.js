import { renderHook, act } from '@testing-library/react';
import { useToast, useToastStore } from '../useToast';

describe('useToastStore', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  describe('addToast', () => {
    it('adds a toast to the store', () => {
      const { addToast } = useToastStore.getState();

      act(() => {
        addToast({ type: 'success', message: 'Test message' });
      });

      const { toasts } = useToastStore.getState();
      expect(toasts).toHaveLength(1);
      expect(toasts[0].message).toBe('Test message');
      expect(toasts[0].type).toBe('success');
    });

    it('assigns id to each toast', () => {
      const { addToast } = useToastStore.getState();

      act(() => {
        addToast({ message: 'First' });
      });

      const { toasts } = useToastStore.getState();
      expect(typeof toasts[0].id).toBe('number');
      expect(toasts[0].id).toBeGreaterThan(0);
    });

    it('applies default duration of 3000ms', () => {
      const { addToast } = useToastStore.getState();

      act(() => {
        addToast({ message: 'Test' });
      });

      const { toasts } = useToastStore.getState();
      expect(toasts[0].duration).toBe(3000);
    });

    it('allows custom duration', () => {
      const { addToast } = useToastStore.getState();

      act(() => {
        addToast({ message: 'Test', duration: 5000 });
      });

      const { toasts } = useToastStore.getState();
      expect(toasts[0].duration).toBe(5000);
    });

    it('limits toasts to last 3 (keeps 2 existing + 1 new)', () => {
      const { addToast } = useToastStore.getState();

      act(() => {
        addToast({ message: 'First' });
        addToast({ message: 'Second' });
        addToast({ message: 'Third' });
        addToast({ message: 'Fourth' });
      });

      const { toasts } = useToastStore.getState();
      expect(toasts).toHaveLength(3);
      expect(toasts.map(t => t.message)).toEqual(['Second', 'Third', 'Fourth']);
    });
  });

  describe('removeToast', () => {
    it('removes a toast by id', () => {
      const { addToast, removeToast } = useToastStore.getState();

      act(() => {
        addToast({ message: 'Test' });
      });

      const { toasts: beforeToasts } = useToastStore.getState();
      const toastId = beforeToasts[0].id;

      act(() => {
        removeToast(toastId);
      });

      const { toasts: afterToasts } = useToastStore.getState();
      expect(afterToasts).toHaveLength(0);
    });

    it('does nothing when toast id not found', () => {
      const { addToast, removeToast } = useToastStore.getState();

      act(() => {
        addToast({ message: 'Test' });
      });

      act(() => {
        removeToast('non-existent-id');
      });

      const { toasts } = useToastStore.getState();
      expect(toasts).toHaveLength(1);
    });
  });
});

describe('useToast hook', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
  });

  it('returns toasts from store', () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.toasts).toEqual([]);
  });

  describe('toast method', () => {
    it('adds toast with type and message', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ type: 'info', message: 'Info message' });
      });

      expect(result.current.toasts).toHaveLength(1);
      expect(result.current.toasts[0].type).toBe('info');
      expect(result.current.toasts[0].message).toBe('Info message');
    });

    it('defaults to info type', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.toast({ message: 'Default type' });
      });

      expect(result.current.toasts[0].type).toBe('info');
    });
  });

  describe('success method', () => {
    it('adds success toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.success('Success message');
      });

      expect(result.current.toasts[0].type).toBe('success');
      expect(result.current.toasts[0].message).toBe('Success message');
    });

    it('accepts custom duration', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.success('Success', 5000);
      });

      expect(result.current.toasts[0].duration).toBe(5000);
    });
  });

  describe('error method', () => {
    it('adds error toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.error('Error message');
      });

      expect(result.current.toasts[0].type).toBe('error');
      expect(result.current.toasts[0].message).toBe('Error message');
    });
  });

  describe('warning method', () => {
    it('adds warning toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.warning('Warning message');
      });

      expect(result.current.toasts[0].type).toBe('warning');
      expect(result.current.toasts[0].message).toBe('Warning message');
    });
  });

  describe('info method', () => {
    it('adds info toast', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.info('Info message');
      });

      expect(result.current.toasts[0].type).toBe('info');
      expect(result.current.toasts[0].message).toBe('Info message');
    });
  });

  describe('dismiss method', () => {
    it('removes toast by id', () => {
      const { result } = renderHook(() => useToast());

      act(() => {
        result.current.success('Test');
      });

      const toastId = result.current.toasts[0].id;

      act(() => {
        result.current.dismiss(toastId);
      });

      expect(result.current.toasts).toHaveLength(0);
    });
  });

  describe('hook stability', () => {
    it('returns stable function references', () => {
      const { result, rerender } = renderHook(() => useToast());

      const { toast, success, error, warning, info, dismiss } = result.current;

      rerender();

      expect(result.current.toast).toBe(toast);
      expect(result.current.success).toBe(success);
      expect(result.current.error).toBe(error);
      expect(result.current.warning).toBe(warning);
      expect(result.current.info).toBe(info);
      expect(result.current.dismiss).toBe(dismiss);
    });
  });
});
