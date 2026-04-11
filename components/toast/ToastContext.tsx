import { createContext, useContext } from "react";
import { ToastType } from "./types";

interface ToastContextProps {
  show: (type: ToastType, message: string) => void;
  close: (id: string) => void;
  clearAll: () => void;
}

export const ToastContext = createContext<ToastContextProps | null>(null);

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};