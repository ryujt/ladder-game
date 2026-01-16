import { useCallback } from 'react';
import { create } from 'zustand';

const useToastStore = create((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [
        ...state.toasts.slice(-2),
        { id: Date.now(), duration: 3000, ...toast },
      ],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),
}));

export const useToast = () => {
  const { toasts, addToast, removeToast } = useToastStore();

  const toast = useCallback(
    ({ type = 'info', message, duration }) => {
      addToast({ type, message, duration });
    },
    [addToast]
  );

  const success = useCallback(
    (message, duration) => toast({ type: 'success', message, duration }),
    [toast]
  );

  const error = useCallback(
    (message, duration) => toast({ type: 'error', message, duration }),
    [toast]
  );

  const warning = useCallback(
    (message, duration) => toast({ type: 'warning', message, duration }),
    [toast]
  );

  const info = useCallback(
    (message, duration) => toast({ type: 'info', message, duration }),
    [toast]
  );

  return {
    toasts,
    toast,
    success,
    error,
    warning,
    info,
    dismiss: removeToast,
  };
};

export { useToastStore };
