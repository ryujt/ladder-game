import React from 'react';
import { ToastContainer } from './Toast';
import { useToast } from '../../hooks/useToast';

const ToastProvider = ({ children }) => {
  const { toasts, dismiss } = useToast();

  return (
    <>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </>
  );
};

export default ToastProvider;
