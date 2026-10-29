import { googleClientId } from '../../data/domains';

const SCRIPT_SRC = 'https://accounts.google.com/gsi/client';

let scriptPromise: Promise<void> | null = null;

/** Carrega o script do Google uma única vez, só quando uma tela de login precisa dele. */
export function loadGoogleScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      script.remove();
      reject(new Error('Não foi possível carregar o login do Google.'));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

let currentCallback: ((credential: string) => void) | null = null;
let initialized = false;

/**
 * O Google guarda um único callback global por página. Cada botão registra o seu aqui antes de
 * ser desenhado, então o último a montar é o que recebe o resultado.
 */
export function setGoogleCredentialHandler(handler: ((credential: string) => void) | null): void {
  currentCallback = handler;
  if (initialized || !window.google?.accounts?.id) return;
  window.google.accounts.id.initialize({
    client_id: googleClientId,
    callback: (response) => currentCallback?.(response.credential),
    ux_mode: 'popup',
  });
  initialized = true;
}
