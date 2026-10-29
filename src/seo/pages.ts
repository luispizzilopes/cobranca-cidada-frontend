import { SITE_NAME, SITE_TAGLINE } from '../data/site.ts';

/**
 * Fonte única do SEO das páginas que não dependem de dados da API. É usada em dois lugares:
 *  - no navegador, por `usePageTitle`/`applySeo`, a cada navegação;
 *  - no build, pelo plugin do Vite, que gera um HTML por rota (`dist/prazos/index.html`, ...) para que o título,
 *    a descrição e o `noindex` já venham no HTML inicial, antes de qualquer JavaScript.
 * O detalhe de um compromisso (`/compromissos/:id`) é dinâmico: seu HTML inicial vem da API (veja o nginx).
 */
export interface PageSeo {
  /** Título da página (sem o nome do site). Vazio na página inicial. */
  title?: string;
  description: string;
  /** Páginas de conta e do painel: o buscador não deve indexá-las. */
  noindex?: boolean;
}

export const SITE_DESCRIPTION =
  'Prometeu. Cumpriu? Conferimos, uma a uma, as promessas do presidente Lula para o mandato 2027–2030 e mostramos, com fonte e página do plano, o que já foi feito. Veja, cobre e diga o que acha da proposta.';

export const OG_IMAGE_PATH = '/og-image.png';
export const OG_IMAGE_ALT = 'Cobrança Cidadã — Prometeu. Cumpriu? Cobre.';

export const PAGES: Record<string, PageSeo> = {
  '/': { description: SITE_DESCRIPTION },
  '/prazos': {
    title: 'Prazos',
    description:
      'Linha do tempo dos prazos das promessas de campanha: o que vence em cada ano do mandato, com a fonte de cada compromisso.',
  },
  '/metodologia': {
    title: 'Metodologia',
    description:
      'Como levantamos as promessas, de onde vêm as fontes, como definimos a situação de cada compromisso e o que o voto dos cidadãos significa (e não significa).',
  },
  '/limitacoes': {
    title: 'Limitações',
    description:
      'O que este levantamento ainda não cobre: divergências entre fontes, itens sem prazo e os limites da opinião dos cidadãos como indicador.',
  },
  '/privacidade': {
    title: 'Política de privacidade',
    description:
      'Quais dados o Cobrança Cidadã coleta, por que opinião política é dado sensível e como ver, exportar ou apagar tudo quando quiser.',
  },
  '/entrar': {
    title: 'Entrar',
    description: 'Entre na sua conta do Cobrança Cidadã.',
    noindex: true,
  },
  '/cadastro': {
    title: 'Criar conta',
    description: 'Crie sua conta no Cobrança Cidadã.',
    noindex: true,
  },
  '/esqueci-a-senha': {
    title: 'Esqueci minha senha',
    description: 'Recupere o acesso à sua conta do Cobrança Cidadã.',
    noindex: true,
  },
  '/conta': {
    title: 'Meus dados e votos',
    description: 'Seus votos e os dados da sua conta no Cobrança Cidadã.',
    noindex: true,
  },
};

/** Páginas com HTML próprio gerado no build (todas as de `PAGES`; a inicial é o próprio `index.html`). */
export const PRERENDERED_PATHS = Object.keys(PAGES).filter((path) => path !== '/');

export function normalizePath(pathname: string): string {
  const path = pathname.split(/[?#]/)[0] || '/';
  return path.length > 1 ? path.replace(/\/+$/, '') : '/';
}

export function seoForPath(pathname: string): PageSeo {
  const path = normalizePath(pathname);
  return PAGES[path] ?? { description: SITE_DESCRIPTION, noindex: path.startsWith('/admin') };
}

export function fullTitle(title?: string): string {
  return title ? `${title} — ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`;
}

/** Mesma regra do servidor (`SeoPageRenderer.Description`): "Situação · Área. Resumo", até 160 caracteres. */
export function commitmentDescription(c: {
  status: { label: string };
  area: { name: string };
  shortDescription: string | null;
  description: string;
}): string {
  const text = (c.shortDescription?.trim() ? c.shortDescription : c.description)
    .split(/\s+/)
    .filter(Boolean)
    .join(' ');
  const full = `${c.status.label} · ${c.area.name}. ${text}`;
  return full.length <= 160 ? full : `${full.slice(0, 159).trimEnd()}…`;
}

/** Título de um compromisso: igual ao do servidor (sem o nome do site, que `fullTitle` acrescenta). */
export function commitmentTitle(c: { id: string; title: string }): string {
  return `${c.title} (${c.id})`;
}
