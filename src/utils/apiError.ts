import { isAxiosError } from 'axios';

interface ApiErrorOptions {
  on401?: string;
}

export function extractApiError(err: unknown, options?: ApiErrorOptions): string {
  if (isAxiosError(err)) {
    const data = err.response?.data;
    if (typeof data === 'string' && data.length > 0) return data;
    if (data?.message) return data.message;
    if (data?.description) return data.description;
    if (data?.errors) {
      const msgs = Object.values(data.errors as Record<string, string[]>).flat();
      if (msgs.length > 0) return msgs.join(' ');
    }
    if (err.response?.status === 401) return options?.on401 ?? 'Sessão expirada. Entre novamente.';
    if (err.response?.status === 404) return 'Recurso não encontrado.';
    if (err.response?.status === 429) return 'Muitas tentativas. Aguarde e tente novamente.';
    if (!err.response) return 'Não foi possível falar com o servidor. Verifique sua conexão.';
  }
  return 'Ocorreu um erro inesperado. Tente novamente.';
}

/** Código de negócio devolvido pela API (ex.: "Auth.ConsentRequired"), quando houver. */
export function apiErrorCode(err: unknown): string | null {
  if (!isAxiosError(err)) return null;
  const code = err.response?.data?.code;
  return typeof code === 'string' ? code : null;
}

/** Segundos de espera sugeridos pela API (cabeçalho Retry-After), quando houver. */
export function retryAfterSeconds(err: unknown): number | null {
  if (!isAxiosError(err)) return null;
  const value = Number(err.response?.headers?.['retry-after']);
  return Number.isFinite(value) && value > 0 ? value : null;
}
