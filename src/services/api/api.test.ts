import {
  applyLogin,
  clearAccountSession,
  clearVoterToken,
  getAccountToken,
  getUser,
  getVoterToken,
  setVoterToken,
} from './api';

const login = {
  userId: 'u1',
  email: 'a@b.com',
  name: 'Ana',
  roles: ['Citizen'],
  token: 'jwt-conta',
  dateExpiration: '',
};

afterEach(() => {
  clearAccountSession();
  clearVoterToken();
});

describe('credenciais', () => {
  it('guarda o token de votante e o devolve', () => {
    setVoterToken('jwt-votante', new Date(Date.now() + 86_400_000).toISOString());
    expect(getVoterToken()?.token).toBe('jwt-votante');
  });

  it('descarta token de votante expirado', () => {
    setVoterToken('jwt-velho', new Date(Date.now() - 1000).toISOString());
    expect(getVoterToken()).toBeNull();
  });

  it('o login de conta vale no lugar do token de votante e guarda só o essencial', () => {
    setVoterToken('jwt-votante', new Date(Date.now() + 86_400_000).toISOString());

    applyLogin(login);

    expect(getAccountToken()).toBe('jwt-conta');
    expect(getVoterToken()).toBeNull();
    expect(getUser()).toEqual({ userId: 'u1', name: 'Ana', email: 'a@b.com', roles: ['Citizen'] });
    expect(localStorage.getItem('cobranca:user')).not.toContain('jwt-conta');
  });

  it('sair da conta limpa o token em memória e o usuário guardado', () => {
    applyLogin(login);
    clearAccountSession();
    expect(getAccountToken()).toBeNull();
    expect(getUser()).toBeNull();
  });
});
