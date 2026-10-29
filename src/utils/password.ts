/** Mesma política do servidor: 12+ caracteres com maiúscula, minúscula, número e símbolo. */
export function passwordProblems(password: string): string[] {
  const problems: string[] = [];
  if (password.length < 12) problems.push('ter pelo menos 12 caracteres');
  if (!/[A-Z]/.test(password)) problems.push('uma letra maiúscula');
  if (!/[a-z]/.test(password)) problems.push('uma letra minúscula');
  if (!/[0-9]/.test(password)) problems.push('um número');
  if (!/[^a-zA-Z0-9]/.test(password)) problems.push('um símbolo');
  return problems;
}

export const PASSWORD_HINT =
  'Pelo menos 12 caracteres, com letra maiúscula, minúscula, número e símbolo.';

export function passwordError(password: string): string {
  const problems = passwordProblems(password);
  return problems.length === 0 ? '' : `A senha precisa ${problems.join(', ')}.`;
}

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Só aceita caminhos internos como destino após o login (evita redirecionamento aberto). */
export function safeRedirect(target: string | null | undefined): string {
  return target && target.startsWith('/') && !target.startsWith('//') ? target : '/';
}
