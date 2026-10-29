import { SITE_NAME } from '../data/site.ts';
import { OG_IMAGE_ALT, OG_IMAGE_PATH, fullTitle, normalizePath } from './pages.ts';

export interface HeadMeta {
  title?: string;
  description: string;
  pathname: string;
  noindex?: boolean;
  /** Dados estruturados (JSON-LD) já montados. Só a página inicial os usa nesta geração estática. */
  jsonLd?: object;
}

function escape(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function robotsContent(noindex: boolean | undefined): string {
  return noindex ? 'noindex,nofollow' : 'index,follow,max-image-preview:large';
}

export function canonicalUrl(siteUrl: string, pathname: string): string {
  const path = normalizePath(pathname);
  return `${siteUrl}${path}`;
}

/** Etiquetas do `<head>` de uma página, como texto (build). No navegador, `applySeo` faz o equivalente no DOM. */
export function buildHeadTags(meta: HeadMeta, siteUrl: string): string {
  const title = fullTitle(meta.title);
  const url = canonicalUrl(siteUrl, meta.pathname);
  const image = `${siteUrl}${OG_IMAGE_PATH}`;
  const lines = [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    `<meta name="robots" content="${robotsContent(meta.noindex)}" />`,
    `<link rel="canonical" href="${escape(url)}" />`,
    `<meta property="og:site_name" content="${escape(SITE_NAME)}" />`,
    `<meta property="og:locale" content="pt_BR" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta property="og:url" content="${escape(url)}" />`,
    `<meta property="og:image" content="${escape(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escape(OG_IMAGE_ALT)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(title)}" />`,
    `<meta name="twitter:description" content="${escape(meta.description)}" />`,
    `<meta name="twitter:image" content="${escape(image)}" />`,
  ];
  if (meta.jsonLd) {
    const json = JSON.stringify(meta.jsonLd).replaceAll('<', '\\u003c');
    lines.push(`<script type="application/ld+json" id="seo-jsonld">${json}</script>`);
  }
  return lines.join('\n    ');
}

export function websiteJsonLd(siteUrl: string, description: string): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: `${siteUrl}/`,
    description,
    inLanguage: 'pt-BR',
  };
}
