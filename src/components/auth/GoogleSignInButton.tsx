import { useEffect, useRef, useState } from 'react';
import { googleClientId } from '../../data/domains';
import { loadGoogleScript, setGoogleCredentialHandler } from './googleIdentity';
import { Holder, Unavailable } from './GoogleSignInButton.styles';

interface GoogleSignInButtonProps {
  /** Texto do botão: entrar, cadastrar ou apenas continuar/confirmar. */
  text?: 'signin_with' | 'signup_with' | 'continue_with';
  onCredential: (credential: string) => void;
}
/** Botão oficial "Entrar com o Google". Não aparece se o site não tiver `VITE_GOOGLE_CLIENT_ID`. */
export function GoogleSignInButton({
  text = 'signin_with',
  onCredential,
}: GoogleSignInButtonProps) {
  const holder = useRef<HTMLDivElement>(null);
  const handler = useRef(onCredential);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    handler.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!googleClientId) return;
    let active = true;
    loadGoogleScript()
      .then(() => {
        if (!active || !holder.current || !window.google) return;
        setGoogleCredentialHandler((credential) => handler.current(credential));
        holder.current.replaceChildren();
        window.google.accounts.id.renderButton(holder.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text,
          shape: 'rectangular',
          logo_alignment: 'left',
          locale: 'pt-BR',
          width: Math.min(holder.current.clientWidth || 320, 400),
        });
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
      setGoogleCredentialHandler(null);
    };
  }, [text]);

  if (!googleClientId) return null;
  if (failed) {
    return (
      <Unavailable role="status">O login com o Google não pôde ser carregado agora.</Unavailable>
    );
  }
  return <Holder ref={holder} data-testid="google-signin" />;
}
