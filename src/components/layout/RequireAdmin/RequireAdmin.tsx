import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Loading } from '../../common';
import { useSession } from '../../../contexts/SessionContext';
import { NotFoundPage } from '../../../pages/notFound/NotFoundPage';

/**
 * Porta das telas de administração. É só conveniência de navegação: a segurança está na API,
 * que recusa (401/403) qualquer chamada sem a claim de administrador. Quem não é admin vê
 * "página não encontrada", sem confirmar que o painel existe.
 */
export function RequireAdmin() {
  const { ready, kind, isAdmin } = useSession();
  const location = useLocation();

  if (!ready) return <Loading />;

  if (kind !== 'account') {
    const back = encodeURIComponent(`${location.pathname}${location.search}`);
    return <Navigate to={`/entrar?voltar=${back}`} replace />;
  }

  if (!isAdmin) return <NotFoundPage />;

  return <Outlet />;
}
