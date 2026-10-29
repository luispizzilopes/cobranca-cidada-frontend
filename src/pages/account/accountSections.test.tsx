import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { ChangePasswordSection } from './ChangePasswordSection';
import { DeleteAccountSection } from './DeleteAccountSection';

const deleteAccount = vi.fn();
const navigate = vi.fn();

vi.mock('../../data/domains', () => ({
  googleClientId: 'cliente-de-teste',
  domains: { api: '' },
  API_PREFIX: '',
}));
vi.mock('../../services/auth/authService', () => ({
  authService: {
    deleteAccount: (...args: unknown[]) => deleteAccount(...args),
    changePassword: vi.fn(),
  },
}));
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<typeof import('react-router-dom')>()),
  useNavigate: () => navigate,
}));
vi.mock('../../components/auth/GoogleSignInButton', () => ({
  GoogleSignInButton: ({ onCredential }: { onCredential: (credential: string) => void }) => (
    <button type="button" onClick={() => onCredential('credencial-google')}>
      Confirmar com o Google
    </button>
  ),
}));

const wrap = (ui: React.ReactElement) => render(<MemoryRouter>{ui}</MemoryRouter>);

beforeEach(() => {
  deleteAccount.mockReset().mockResolvedValue(undefined);
  navigate.mockReset();
});

describe('DeleteAccountSection', () => {
  it('com senha: pede a senha e a envia', async () => {
    wrap(<DeleteAccountSection hasPassword />);
    await userEvent.click(screen.getByRole('button', { name: 'Excluir minha conta' }));

    await userEvent.click(screen.getByRole('button', { name: 'Excluir definitivamente' }));
    expect(await screen.findByText('Informe sua senha para confirmar.')).toBeInTheDocument();
    expect(deleteAccount).not.toHaveBeenCalled();

    await userEvent.type(screen.getByLabelText('Confirme sua senha'), 'Senh@-Forte-123');
    await userEvent.click(screen.getByRole('button', { name: 'Excluir definitivamente' }));

    await waitFor(() =>
      expect(deleteAccount).toHaveBeenCalledWith({ password: 'Senh@-Forte-123' }),
    );
    expect(navigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('conta Google, sem senha: confirma pelo Google, sem campo de senha', async () => {
    wrap(<DeleteAccountSection hasPassword={false} />);
    await userEvent.click(screen.getByRole('button', { name: 'Excluir minha conta' }));

    expect(screen.queryByLabelText('Confirme sua senha')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Confirmar com o Google' }));

    await waitFor(() =>
      expect(deleteAccount).toHaveBeenCalledWith({ googleCredential: 'credencial-google' }),
    );
    expect(navigate).toHaveBeenCalledWith('/', { replace: true });
  });
});

describe('ChangePasswordSection', () => {
  it('com senha: mostra o formulário', () => {
    wrap(<ChangePasswordSection hasPassword />);
    expect(screen.getByLabelText('Senha atual')).toBeInTheDocument();
  });

  it('conta Google, sem senha: explica como criar uma, sem formulário', () => {
    wrap(<ChangePasswordSection hasPassword={false} />);

    expect(screen.queryByLabelText('Senha atual')).not.toBeInTheDocument();
    expect(screen.getByText(/não tem senha/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Esqueci minha senha' })).toHaveAttribute(
      'href',
      '/esqueci-a-senha',
    );
  });
});
