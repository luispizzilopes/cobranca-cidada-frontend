import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button, FormError } from '../common';
import { googleClientId } from '../../data/domains';
import { authService } from '../../services/auth/authService';
import { apiErrorCode, extractApiError } from '../../utils/apiError';
import { safeRedirect } from '../../utils/password';
import { GoogleSignInButton } from './GoogleSignInButton';
import { Consent, Divider, ErrorLine } from './GoogleAuthSection.styles';

interface GoogleAuthSectionProps {
  text: 'signin_with' | 'signup_with';
  /** Marca que a tela vai cuidar do redirecionamento depois de entrar (evita o desvio para /conta). */
  markSubmitting: () => void;
}
/**
 * "Entrar com o Google" nas telas de login e cadastro. Quem já tem conta com o mesmo e-mail entra direto
 * (a API vincula as contas). Quem é novo precisa antes aceitar a política de privacidade.
 */
export function GoogleAuthSection({ text, markSubmitting }: GoogleAuthSectionProps) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [pending, setPending] = useState<string | null>(null);
  const [consent, setConsent] = useState(false);
  const [consentError, setConsentError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!googleClientId) return null;

  async function enter(credential: string, accepted: boolean) {
    setError(null);
    setLoading(true);
    try {
      markSubmitting();
      await authService.loginWithGoogle(credential, accepted);
      navigate(safeRedirect(params.get('voltar')), { replace: true });
    } catch (err) {
      if (apiErrorCode(err) === 'Auth.ConsentRequired') {
        setPending(credential);
        return;
      }
      setPending(null);
      setError(
        extractApiError(err, { on401: 'Não foi possível entrar com o Google. Tente de novo.' }),
      );
    } finally {
      setLoading(false);
    }
  }

  function confirmConsent() {
    if (!consent) {
      setConsentError(true);
      return;
    }
    setConsentError(false);
    if (pending) void enter(pending, true);
  }

  return (
    <>
      <Divider aria-hidden="true">ou</Divider>
      <FormError message={error} />
      {pending ? (
        <Consent>
          <p style={{ margin: 0 }}>
            Ainda não existe uma conta para o seu e-mail do Google. Para criá-la, aceite a política
            de privacidade.
          </p>
          <label htmlFor="consentimento-google">
            <input
              id="consentimento-google"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-describedby={consentError ? 'consentimento-google-erro' : undefined}
            />
            <span>
              Li e aceito a{' '}
              <Link to="/privacidade" target="_blank">
                política de privacidade
              </Link>
              . Sei que minhas opiniões são dados sensíveis e que posso exportar ou apagar tudo
              quando quiser.
            </span>
          </label>
          {consentError && (
            <ErrorLine id="consentimento-google-erro" role="alert">
              É preciso aceitar a política de privacidade para criar a conta.
            </ErrorLine>
          )}
          <Button fullWidth loading={loading} onClick={confirmConsent}>
            Criar conta com o Google
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setPending(null)}>
            Cancelar
          </Button>
        </Consent>
      ) : (
        <GoogleSignInButton
          text={text}
          onCredential={(credential) => void enter(credential, false)}
        />
      )}
    </>
  );
}
