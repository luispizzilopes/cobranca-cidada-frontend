import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { RequireAdmin } from './RequireAdmin';

let session = { ready: true, kind: 'anonymous', isAdmin: false };
vi.mock('../../../contexts/SessionContext', () => ({ useSession: () => session }));

function Where() {
  const location = useLocation();
  return <p>login: {location.pathname + location.search}</p>;
}

function renderAt(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<RequireAdmin />}>
          <Route path="/admin" element={<p>painel secreto</p>} />
        </Route>
        <Route path="/entrar" element={<Where />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('RequireAdmin', () => {
  it('espera a sessão ser restaurada antes de decidir', () => {
    session = { ready: false, kind: 'anonymous', isAdmin: false };
    renderAt('/admin');
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('painel secreto')).not.toBeInTheDocument();
  });

  it('manda quem não entrou para o login, voltando ao painel depois', () => {
    session = { ready: true, kind: 'anonymous', isAdmin: false };
    renderAt('/admin');
    expect(screen.getByText('login: /entrar?voltar=%2Fadmin')).toBeInTheDocument();
  });

  it('quem só vota com e-mail verificado não entra', () => {
    session = { ready: true, kind: 'voter', isAdmin: false };
    renderAt('/admin');
    expect(screen.queryByText('painel secreto')).not.toBeInTheDocument();
  });

  it('conta sem papel de admin vê "página não encontrada"', () => {
    session = { ready: true, kind: 'account', isAdmin: false };
    renderAt('/admin');
    expect(screen.getByRole('heading', { name: 'Página não encontrada' })).toBeInTheDocument();
    expect(screen.queryByText('painel secreto')).not.toBeInTheDocument();
  });

  it('administrador entra', () => {
    session = { ready: true, kind: 'account', isAdmin: true };
    renderAt('/admin');
    expect(screen.getByText('painel secreto')).toBeInTheDocument();
  });
});
