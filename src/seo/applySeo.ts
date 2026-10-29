import { SITE_NAME } from '../data/site';
import { canonicalUrl, robotsContent, type HeadMeta } from './headTags';
import { OG_IMAGE_ALT, OG_IMAGE_PATH, fullTitle, normalizePath, seoForPath } from './pages';

/** Endereço público do site. Em build é `VITE_SITE_URL`; sem ele, a origem em que o site está rodando. */
export function siteUrl(): string {
  const configured = ((import.meta.env.VITE_SITE_URL as string | undefined) ?? '').trim();
  return (configured || window.location.origin).replace(/\/+$/, '');
}

function upsert<T extends HTMLElement>(selector: string, create: () => T): T {
  let element = document.head.querySelector<T>(selector);
  if (!element) {
    element = create();
    document.head.appendChild(element);
  }
  return element;
}

function setMeta(attribute: 'name' | 'property', key: string, content: string): void {
  const element = upsert<HTMLMetaElement>(`meta[${attribute}="${key}"]`, () => {
    const meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    return meta;
  });
  element.setAttribute('content', content);
}

function setCanonical(href: string): void {
  const element = upsert<HTMLLinkElement>('link[rel="canonical"]', () => {
    const link = document.createElement('link');
    link.rel = 'canonical';
    return link;
  });
  element.href = href;
}

/**
 * O HTML inicial já traz os dados estruturados da página que foi carregada (inclusive os gerados pelo servidor para
 * os compromissos). Ao navegar para outra rota eles passam a descrever a página errada e são retirados.
 */
let initialPath: string | null = null;

export type SeoOptions = Pick<HeadMeta, 'title' | 'description' | 'noindex'>;

/** Atualiza título, descrição, canonical, robots e Open Graph/Twitter para a rota atual. */
export function applySeo(pathname: string, options: Partial<SeoOptions> = {}): void {
  const path = normalizePath(pathname);
  initialPath ??= path;
  if (path !== initialPath) document.getElementById('seo-jsonld')?.remove();

  const defaults = seoForPath(path);
  const description = options.description ?? defaults.description;
  const noindex = options.noindex ?? defaults.noindex;
  const title = fullTitle(options.title ?? defaults.title);
  const site = siteUrl();
  const url = canonicalUrl(site, path);
  const image = `${site}${OG_IMAGE_PATH}`;

  document.title = title;
  setMeta('name', 'description', description);
  setMeta('name', 'robots', robotsContent(noindex));
  setCanonical(url);

  setMeta('property', 'og:site_name', SITE_NAME);
  setMeta('property', 'og:locale', 'pt_BR');
  setMeta('property', 'og:type', 'website');
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:image', image);
  setMeta('property', 'og:image:alt', OG_IMAGE_ALT);
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', image);
}

/** Só para testes: volta ao estado de "primeira página carregada". */
export function resetSeoForTests(): void {
  initialPath = null;
}
