import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { getAccountToken, getVoterToken } from '../services/api/api';
import { VerifyEmailDialog } from '../components/voting/VerifyEmailDialog';

interface VerifyEmailContextValue {
  /**
   * Garante que a pessoa pode votar. Se já tem conta ou e-mail verificado, resolve `true` na hora.
   * Senão abre o diálogo de confirmação por código e resolve `true` ao concluir, ou `false` se desistir.
   */
  ensureCanVote: () => Promise<boolean>;
}

const VerifyEmailContext = createContext<VerifyEmailContextValue | null>(null);

export function VerifyEmailProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const resolver = useRef<((ok: boolean) => void) | null>(null);

  const finish = useCallback((ok: boolean) => {
    setOpen(false);
    resolver.current?.(ok);
    resolver.current = null;
  }, []);

  const ensureCanVote = useCallback(() => {
    if (getAccountToken() || getVoterToken()) return Promise.resolve(true);
    resolver.current?.(false);
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
      setOpen(true);
    });
  }, []);

  const value = useMemo(() => ({ ensureCanVote }), [ensureCanVote]);

  return (
    <VerifyEmailContext.Provider value={value}>
      {children}
      {open && (
        <VerifyEmailDialog onVerified={() => finish(true)} onDismiss={() => finish(false)} />
      )}
    </VerifyEmailContext.Provider>
  );
}

export function useVerifyEmail(): VerifyEmailContextValue {
  const ctx = useContext(VerifyEmailContext);
  if (!ctx) throw new Error('useVerifyEmail must be used inside VerifyEmailProvider');
  return ctx;
}
