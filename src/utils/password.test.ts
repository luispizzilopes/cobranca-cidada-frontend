import { EMAIL_PATTERN, passwordError, passwordProblems, safeRedirect } from './password';

describe('senha (mesma política do servidor)', () => {
  it('aceita uma senha forte', () => {
    expect(passwordProblems('Senh@-Muito-Forte-123')).toEqual([]);
    expect(passwordError('Senh@-Muito-Forte-123')).toBe('');
  });

  it('lista tudo que falta', () => {
    expect(passwordProblems('fraca')).toEqual([
      'ter pelo menos 12 caracteres',
      'uma letra maiúscula',
      'um número',
      'um símbolo',
    ]);
    expect(passwordError('fraca')).toContain('A senha precisa');
  });
});

describe('safeRedirect', () => {
  it('aceita só caminhos internos', () => {
    expect(safeRedirect('/conta')).toBe('/conta');
    expect(safeRedirect('/?aba=minhas')).toBe('/?aba=minhas');
  });

  it('bloqueia redirecionamento para outros sites', () => {
    expect(safeRedirect('https://malicioso.example')).toBe('/');
    expect(safeRedirect('//malicioso.example')).toBe('/');
    expect(safeRedirect(null)).toBe('/');
  });
});

describe('EMAIL_PATTERN', () => {
  it('valida o formato básico', () => {
    expect(EMAIL_PATTERN.test('a@b.com')).toBe(true);
    expect(EMAIL_PATTERN.test('a@b')).toBe(false);
    expect(EMAIL_PATTERN.test('a b@c.com')).toBe(false);
  });
});
