import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  SESSION_CHANGED_EVENT,
  clearVoterToken,
  getAccountToken,
  getUser,
  getVoterToken,
  restoreSession,
  type StoredUser,
} from '../services/api/api';
import { authService } from '../services/auth/authService';

export type SessionKind = 'account' | 'voter' | 'anonymous';

interface SessionContextValue {
  kind: SessionKind;
  user: StoredUser | null;
  /** Falso enquanto tenta reabrir uma sessão de conta pelo cookie. */
  ready: boolean;
  /** Pode votar: tem conta ou e-mail verificado. */
  canVote: boolean;
  /**
   * Conta com o papel de administrador. Só decide o que mostrar: quem manda é a API,
   * que confere a flag no banco a cada requisição ao painel.
   */
  isAdmin: boolean;
  logout: () => Promise<void>;
  forgetVoter: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

function currentKind(): SessionKind {
  if (getAccountToken()) return 'account';
  if (getVoterToken()) return 'voter';
  return 'anonymous';
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [kind, setKind] = useState<SessionKind>(currentKind);
  const [user, setUser] = useState<StoredUser | null>(() => (getAccountToken() ? getUser() : null));
  const [ready, setReady] = useState(false);

  const sync = useCallback(() => {
    const next = currentKind();
    setKind(next);
    setUser(next === 'account' ? getUser() : null);
  }, []);

  useEffect(() => {
    window.addEventListener(SESSION_CHANGED_EVENT, sync);
    return () => window.removeEventListener(SESSION_CHANGED_EVENT, sync);
  }, [sync]);

  useEffect(() => {
    let active = true;
    void restoreSession().finally(() => {
      if (!active) return;
      sync();
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, [sync]);

  const value = useMemo<SessionContextValue>(
    () => ({
      kind,
      user,
      ready,
      canVote: kind !== 'anonymous',
      isAdmin: kind === 'account' && (user?.roles.includes('Admin') ?? false),
      logout: () => authService.logout(),
      forgetVoter: () => clearVoterToken(),
    }),
    [kind, user, ready],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside SessionProvider');
  return ctx;
}
