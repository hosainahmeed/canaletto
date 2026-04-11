import React, { useCallback, useState } from "react";
import { ToastContext } from "./ToastContext";
import ToastView from "./ToastView";
import { ToastItem, ToastType } from "./types";

export const ToastProvider = ({ children }: any) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString();

    const newToast = { id, type, message };

    setToasts((prev) => [newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const close = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ show, close, clearAll }}>
      {children}
      <ToastView toasts={toasts} />
    </ToastContext.Provider>
  );
};