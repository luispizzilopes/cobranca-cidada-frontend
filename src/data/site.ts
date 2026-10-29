/** Data prevista da posse (05/01/2027), segundo Estado de Minas/Folhapress (levantamento, seção 1). */
export const INAUGURATION_DATE = '2027-01-05';

export const SITE_NAME = 'Cobrança Cidadã';

/** Slogan exibido no header, no título da aba e no banner. */
export const SITE_TAGLINE = 'Prometeu. Cumpriu? Cobre.';

export const INDEPENDENT_NOTICE = 'Site de cidadãos, sem vínculo com o governo.';

export const PRIVACY_POLICY_VERSION = '2026-10-28';

export const navItems = [
  { to: '/', label: 'Compromissos', end: true },
  { to: '/prazos', label: 'Prazos' },
  { to: '/metodologia', label: 'Metodologia' },
  { to: '/limitacoes', label: 'Limitações' },
] as const;

/** A partir de quantas cobranças (já liberadas pela API) o compromisso ganha banners de divulgação. */
export const SHARE_BANNER_MIN_CHARGES = 10;
