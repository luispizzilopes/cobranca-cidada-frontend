import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { AxiosError, type AxiosResponse } from 'axios';
import { GoogleAuthSection } from './GoogleAuthSection';

const loginWithGoogle = vi.fn();
const navigate = vi.fn();

vi.mock('../../data/domains', () => ({
  googleClientId: 'cliente-de-teste',
  domains: { api: '' },
  API_PREFIX: '',
}));
vi.mock('../../services/auth/authService', () => ({
  authService: { loginWithGoogle: (...args: unknown[]) => loginWithGoogle(...args) },
}));
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
}));
vi.mock('./GoogleSignInButton', () => ({
  GoogleSignInButton: ({ onCredential }: { onCredential: (credential: string) => void }) => (
    <button onClick={() => onCredential('credencial-123')}>Botão do Google</button>
  ),
}));

function apiError(status: number, code: string, description: string) {
  return new AxiosError('falhou', 'ERR_BAD_REQUEST', undefined, undefined, {
    status,
    data: { code, description },
  } as AxiosResponse);
}

function renderSection(url = '/entrar') {
  const markSubmitting = vi.fn();
  render(
    <MemoryRouter initialEntries={[url]}>
      <GoogleAuthSection text="signin_with" markSubmitting={markSubmitting} />
    </MemoryRouter>,
  );
  return { markSubmitting };
}

beforeEach(() => {
  loginWithGoogle.mockReset();
  navigate.mockReset();
});

describe('GoogleAuthSection', () => {
  it('entra direto quando a conta já existe e volta para o destino pedido', async () => {
    loginWithGoogle.mockResolvedValue(undefined);
    const { markSubmitting } = renderSection('/entrar?voltar=/prazos');

    await userEvent.click(screen.getByRole('button', { name: 'Botão do Google' }));

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/prazos', { replace: true }));
    expect(loginWithGoogle).toHaveBeenCalledWith('credencial-123', false);
    expect(markSubmitting).toHaveBeenCalled();
  });

  it('pede o aceite da política para quem ainda não tem conta e só então cria', async () => {
    loginWithGoogle.mockRejectedValueOnce(
      apiError(400, 'Auth.ConsentRequired', 'Aceite a política.'),
    );
    loginWithGoogle.mockResolvedValueOnce(undefined);
    renderSection();

    await userEvent.click(screen.getByRole('button', { name: 'Botão do Google' }));
    await screen.findByText(/Ainda não existe uma conta/);
    expect(navigate).not.toHaveBeenCalled();

    await userEvent.click(screen.getByRole('button', { name: 'Criar conta com o Google' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('É preciso aceitar a política');
    expect(loginWithGoogle).toHaveBeenCalledTimes(1);

    await userEvent.click(screen.getByLabelText(/Li e aceito/));
    await userEvent.click(screen.getByRole('button', { name: 'Criar conta com o Google' }));

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/', { replace: true }));
    expect(loginWithGoogle).toHaveBeenLastCalledWith('credencial-123', true);
  });

  it('mostra o erro e volta ao botão quando o Google é recusado', async () => {
    loginWithGoogle.mockRejectedValue(
      apiError(401, 'Auth.GoogleEmailNotVerified', 'O Google não confirmou o e-mail desta conta.'),
    );
    renderSection();

    await userEvent.click(screen.getByRole('button', { name: 'Botão do Google' }));

    expect(
      await screen.findByText('O Google não confirmou o e-mail desta conta.'),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Botão do Google' })).toBeInTheDocument();
    expect(navigate).not.toHaveBeenCalled();
  });
});
