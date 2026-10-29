import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import type { Plugin } from 'vite';
import { buildHeadTags, websiteJsonLd } from './src/seo/headTags.ts';
import { PAGES, PRERENDERED_PATHS } from './src/seo/pages.ts';

const START = '<!--seo-head-start-->';
const END = '<!--seo-head-end-->';

function headFor(pathname: string, siteUrl: string): string {
  const page = PAGES[pathname];
  const tags = buildHeadTags(
    {
      title: page.title,
      description: page.description,
      pathname,
      noindex: page.noindex,
      jsonLd: pathname === '/' ? websiteJsonLd(siteUrl, page.description) : undefined,
    },
    siteUrl,
  );
  return `${START}\n    ${tags}\n    ${END}`;
}

/**
 * SEO no HTML inicial, sem servidor Node:
 *  - `index.html` ganha as etiquetas da página inicial (título, descrição, canonical, Open Graph, dados estruturados);
 *  - no build, cada página estática ganha o seu próprio `dist/<rota>/index.html`, igual ao `index.html` mas com as
 *    etiquetas da rota. O nginx já serve `/prazos` a partir de `prazos/index.html`;
 *  - `/compromissos/:id` é dinâmico: o nginx pede as etiquetas à API (veja `nginx.conf.template`).
 * `siteUrl` (VITE_SITE_URL) é a base das URLs absolutas, exigidas por Open Graph e canonical.
 */
export function seoPlugin(siteUrl: string): Plugin {
  const site = siteUrl.replace(/\/+$/, '');
  let outDir = 'dist';

  return {
    name: 'cobranca-seo',
    configResolved(config) {
      outDir = join(config.root, config.build.outDir);
      if (config.command === 'build' && !site)
        config.logger.warn(
          '[seo] VITE_SITE_URL não definido: canonical e Open Graph sairão com URLs relativas (redes sociais exigem absolutas).',
        );
    },
    transformIndexHtml: {
      order: 'post',
      handler: (html) => html.replace(`${START}${END}`, headFor('/', site)),
    },
    closeBundle() {
      const index = readFileSync(join(outDir, 'index.html'), 'utf8');
      const marked = new RegExp(`${START}[\\s\\S]*?${END}`);
      if (!marked.test(index))
        throw new Error('index.html sem os marcadores de SEO (seo-head-start/end).');

      for (const pathname of PRERENDERED_PATHS) {
        const file = join(outDir, pathname.slice(1), 'index.html');
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(
          file,
          index.replace(marked, () => headFor(pathname, site)),
        );
      }
    },
  };
}
