export const domains = {
  api: (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5399',
};

/**
 * ID do cliente OAuth do "Entrar com o Google" (público por natureza). Sem ele, o botão não aparece
 * e o site funciona só com e-mail e senha.
 */
export const googleClientId = (
  (import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined) ?? ''
).trim();

export const API_PREFIX = '/api/v1';
