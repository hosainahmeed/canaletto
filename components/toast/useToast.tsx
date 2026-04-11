import { useToastContext } from "./ToastContext";

export const useToast = () => {
  const toast = useToastContext();

  return {
    show: toast.show,
    close: toast.close,
    clearAll: toast.clearAll,
    success: (msg: string) => toast.show("success", msg),
    error: (msg: string) => toast.show("error", msg),
    info: (msg: string) => toast.show("info", msg),
    warning: (msg: string) => toast.show("warning", msg),
  };
};