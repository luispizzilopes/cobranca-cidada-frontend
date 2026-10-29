import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { Close, Item, Region, type ToastType } from './Toast.styles';

interface ToastEntry {
  id: number;
  message: string;
  type: ToastType;
}
export interface ToastActions {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}
const ToastContext = createContext<ToastActions>({
  success: () => {},
  error: () => {},
  info: () => {},
});
const icons = { success: CheckCircle2, error: XCircle, info: Info };
const DURATION = 6000;
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback(
    (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)),
    [],
  );

  const push = useCallback(
    (type: ToastType) => (message: string) => {
      const id = ++counter.current;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => dismiss(id), DURATION);
    },
    [dismiss],
  );

  const actions = useMemo<ToastActions>(
    () => ({ success: push('success'), error: push('error'), info: push('info') }),
    [push],
  );

  return (
    <ToastContext.Provider value={actions}>
      {children}
      {createPortal(
        <Region role="status" aria-live="polite">
          {toasts.map((toast) => {
            const Icon = icons[toast.type];
            return (
              <Item key={toast.id} $type={toast.type}>
                <Icon size={18} aria-hidden="true" />
                <span>{toast.message}</span>
                <Close type="button" onClick={() => dismiss(toast.id)} aria-label="Fechar aviso">
                  <X size={16} aria-hidden="true" />
                </Close>
              </Item>
            );
          })}
        </Region>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
export function useToast(): ToastActions {
  return useContext(ToastContext);
}
