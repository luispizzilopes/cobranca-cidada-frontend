/** Parte da API do Google Identity Services usada aqui (https://developers.google.com/identity/gsi/web/reference/js-reference). */
interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleIdConfiguration {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
  ux_mode?: 'popup' | 'redirect';
  use_fedcm_for_prompt?: boolean;
}

interface GoogleButtonConfiguration {
  type?: 'standard' | 'icon';
  theme?: 'outline' | 'filled_blue' | 'filled_black';
  size?: 'large' | 'medium' | 'small';
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
  shape?: 'rectangular' | 'pill';
  logo_alignment?: 'left' | 'center';
  width?: number;
  locale?: string;
}

interface Window {
  google?: {
    accounts: {
      id: {
        initialize: (config: GoogleIdConfiguration) => void;
        renderButton: (parent: HTMLElement, options: GoogleButtonConfiguration) => void;
      };
    };
  };
}
