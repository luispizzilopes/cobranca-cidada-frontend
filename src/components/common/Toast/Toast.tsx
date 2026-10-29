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
import styled from 'styled-components';

export type ToastType = 'success' | 'error' | 'info';

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

const Region = styled.div`
  position: fixed;
  z-index: 1100;
  right: 16px;
  bottom: 16px;
  left: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  pointer-events: none;
`;

const Item = styled.div<{ $type: ToastType }>`
  pointer-events: auto;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 420px;
  padding: 12px 16px;
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  border-left: 6px solid
    ${({ $type }) => ($type === 'success' ? 'var(--success)' : $type === 'error' ? 'var(--danger)' : 'var(--info)')};
  border-radius: var(--radius);
  box-shadow: var(--shadow);
`;

const Close = styled.button`
  border: 0;
  background: transparent;
  color: var(--muted);
  padding: 2px;
  margin-left: auto;
`;

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
