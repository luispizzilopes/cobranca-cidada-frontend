import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_PREFIX, domains } from '../../data/domains';

/**
 * Dois tipos de credencial, ambos aceitos pela API para votar:
 *  - conta: token de acesso curto, só em memória; renovado por cookie HttpOnly (refresh rotativo);
 *  - votante: e-mail verificado sem conta. Token de 30 dias que só permite votar e gerir os próprios votos.
 *    Fica no localStorage (sem refresh); o escopo limitado do token é o que reduz o risco.
 */
const USER_KEY = 'cobranca:user';
const VOTER_TOKEN_KEY = 'cobranca:voter-token';
const VOTER_EXPIRES_KEY = 'cobranca:voter-expires';
const ACCOUNT_HINT_KEY = 'cobranca:account-session';

export const SESSION_CHANGED_EVENT = 'cobranca:session-changed';

export interface StoredUser {
  userId: string;
  name: string;
  email: string | null;
  roles: string[];
}

export interface LoginResponse {
  userId: string;
  email: string | null;
  name: string;
  roles: string[];
  token: string;
  dateExpiration: string;
}

let accountToken: string | null = null;
let refreshPromise: Promise<boolean> | null = null;

function notify(): void {
  window.dispatchEvent(new CustomEvent(SESSION_CHANGED_EVENT));
}

function read(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
  }
}

export const getAccountToken = () => accountToken;

export function getUser(): StoredUser | null {
  try {
    const raw = read(USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function getVoterToken(): { token: string; expiresAt: string | null } | null {
  const token = read(VOTER_TOKEN_KEY);
  if (!token) return null;
  const expiresAt = read(VOTER_EXPIRES_KEY);
  if (expiresAt && new Date(expiresAt).getTime() <= Date.now()) {
    clearVoterToken();
    return null;
  }
  return { token, expiresAt };
}

export function setVoterToken(token: string, expiresAt: string): void {
  write(VOTER_TOKEN_KEY, token);
  write(VOTER_EXPIRES_KEY, expiresAt);
  notify();
}

export function clearVoterToken(): void {
  write(VOTER_TOKEN_KEY, null);
  write(VOTER_EXPIRES_KEY, null);
  notify();
}

/** Aplica o resultado de login/cadastro/refresh. A conta passa a valer no lugar do token de votante. */
export function applyLogin(data: LoginResponse): void {
  accountToken = data.token;
  write(
    USER_KEY,
    JSON.stringify({ userId: data.userId, name: data.name, email: data.email, roles: data.roles }),
  );
  write(ACCOUNT_HINT_KEY, '1');
  write(VOTER_TOKEN_KEY, null);
  write(VOTER_EXPIRES_KEY, null);
  notify();
}

export function clearAccountSession(): void {
  accountToken = null;
  write(USER_KEY, null);
  write(ACCOUNT_HINT_KEY, null);
  notify();
}

const api = axios.create({
  baseURL: domains.api,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

const sessionApi = axios.create({
  baseURL: domains.api,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

async function requestRefresh(): Promise<boolean> {
  try {
    const { data } = await sessionApi.post<LoginResponse>(`${API_PREFIX}/authentication/refresh`);
    applyLogin(data);
    return true;
  } catch {
    clearAccountSession();
    return false;
  }
}

/** Tenta reabrir a sessão de conta pelo cookie HttpOnly. Só tenta se já houve login neste navegador. */
export function restoreSession(): Promise<boolean> {
  if (accountToken) return Promise.resolve(true);
  if (read(ACCOUNT_HINT_KEY) === null) return Promise.resolve(false);
  if (refreshPromise) return refreshPromise;

  const run = () => requestRefresh();
  refreshPromise = (
    'locks' in navigator ? navigator.locks.request('cobranca-session-refresh', run) : run()
  ).finally(() => {
    refreshPromise = null;
  });
  return refreshPromise;
}

type TokenKind = 'account' | 'voter';

interface TrackedRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _tokenKind?: TokenKind;
}

api.interceptors.request.use((config: TrackedRequest) => {
  const account = getAccountToken();
  const voter = account ? null : getVoterToken();
  const token = account ?? voter?.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config._tokenKind = account ? 'account' : 'voter';
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as TrackedRequest | undefined;
    const url = config?.url ?? '';
    const isCredentialRequest = url.includes('/authentication/') || url.includes('/voter/');

    if (error.response?.status === 401 && config && !config._retry && !isCredentialRequest) {
      config._retry = true;

      if (config._tokenKind === 'account') {
        accountToken = null;
        if (await restoreSession()) {
          config.headers.Authorization = `Bearer ${getAccountToken()}`;
          return api(config);
        }
      } else if (config._tokenKind === 'voter') {
        clearVoterToken();
      }
    }

    return Promise.reject(error);
  },
);

export default api;
