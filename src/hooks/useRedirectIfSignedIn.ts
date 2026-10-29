import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSession } from '../contexts/SessionContext';
import { safeRedirect } from '../utils/password';

/**
 * Quem já tem conta não precisa ver login/cadastro: vai para "voltar" ou para a área do usuário.
 * Devolve uma função para marcar o envio do formulário, que cuida do próprio redirecionamento
 * (o login acaba de criar a sessão e não deve ser desviado para /conta).
 */
export function useRedirectIfSignedIn(): () => void {
  const { kind, ready } = useSession();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const submitting = useRef(false);

  useEffect(() => {
    if (!ready || kind !== 'account' || submitting.current) return;
    const back = params.get('voltar');
    navigate(back ? safeRedirect(back) : '/conta', { replace: true });
  }, [ready, kind, params, navigate]);

  return () => {
    submitting.current = true;
  };
}
