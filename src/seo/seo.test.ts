import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { ResolvedConfig } from 'vite';
import { seoPlugin } from '../../vite-seo-plugin';
import { applySeo, resetSeoForTests } from './applySeo';
import { buildHeadTags, websiteJsonLd } from './headTags';
import {
  PAGES,
  PRERENDERED_PATHS,
  SITE_DESCRIPTION,
  commitmentDescription,
  commitmentTitle,
  fullTitle,
  normalizePath,
  seoForPath,
} from './pages';

describe('pages', () => {
  it('normaliza o caminho: sem barra final, consulta ou âncora', () => {
    expect(normalizePath('/prazos/')).toBe('/prazos');
    expect(normalizePath('/?area=ECON&busca=mei')).toBe('/');
    expect(normalizePath('/metodologia#fontes')).toBe('/metodologia');
    expect(normalizePath('')).toBe('/');
  });

  it('páginas de conta e do painel não são indexadas; as de conteúdo são', () => {
    for (const path of [
      '/entrar',
      '/cadastro',
      '/esqueci-a-senha',
      '/conta',
      '/admin',
      '/admin/catalogo',
    ]) {
      expect(seoForPath(path).noindex).toBe(true);
    }
    for (const path of ['/', '/prazos', '/metodologia', '/limitacoes', '/privacidade']) {
      expect(seoForPath(path).noindex).toBeFalsy();
    }
  });

  it('rota desconhecida usa a descrição do site', () => {
    expect(seoForPath('/compromissos/ECON-006').description).toBe(SITE_DESCRIPTION);
  });

  it('toda descrição cabe no resultado de busca e todo título de página é curto', () => {
    for (const [path, page] of Object.entries(PAGES)) {
      expect(page.description.length, path).toBeLessThanOrEqual(260);
      expect(fullTitle(page.title).length, path).toBeLessThanOrEqual(70);
    }
  });

  it('o título e a descrição do compromisso seguem a regra do servidor', () => {
    const c = {
      id: 'ECON-006',
      title: 'Pacote MEI',
      description: 'Teto de R$ 81 mil\n  para R$ 110 mil.',
      shortDescription: null,
      status: { label: 'Em andamento' },
      area: { name: 'Economia' },
    };
    expect(commitmentTitle(c)).toBe('Pacote MEI (ECON-006)');
    expect(commitmentDescription(c)).toBe(
      'Em andamento · Economia. Teto de R$ 81 mil para R$ 110 mil.',
    );
    expect(commitmentDescription({ ...c, shortDescription: 'Resumo.' })).toBe(
      'Em andamento · Economia. Resumo.',
    );
    const long = commitmentDescription({ ...c, description: 'palavra '.repeat(80) });
    expect(long.length).toBeLessThanOrEqual(160);
    expect(long.endsWith('…')).toBe(true);
  });
});

describe('buildHeadTags', () => {
  it('gera título, descrição, canonical absoluto, robots e Open Graph', () => {
    const html = buildHeadTags(
      { title: 'Prazos', description: 'Os prazos.', pathname: '/prazos/' },
      'https://cobranca.example',
    );
    expect(html).toContain('<title>Prazos — Cobrança Cidadã</title>');
    expect(html).toContain('<link rel="canonical" href="https://cobranca.example/prazos" />');
    expect(html).toContain('<meta name="robots" content="index,follow,max-image-preview:large" />');
    expect(html).toContain('property="og:image" content="https://cobranca.example/og-image.png"');
    expect(html).toContain('name="twitter:card" content="summary_large_image"');
  });

  it('marca noindex e escapa o que for texto', () => {
    const html = buildHeadTags(
      { title: 'A "B" <i>', description: 'x & y', pathname: '/entrar', noindex: true },
      'https://cobranca.example',
    );
    expect(html).toContain('content="noindex,nofollow"');
    expect(html).toContain('A &quot;B&quot; &lt;i&gt;');
    expect(html).toContain('content="x &amp; y"');
    expect(html).not.toContain('<i>');
  });

  it('os dados estruturados não conseguem fechar a tag script', () => {
    const html = buildHeadTags(
      { description: 'd', pathname: '/', jsonLd: { name: '</script><b>' } },
      'https://cobranca.example',
    );
    expect(html).not.toContain('</script><b>');
    expect(html).toContain('\\u003c/script>');
  });

  it('a página inicial descreve o site como WebSite', () => {
    expect(websiteJsonLd('https://cobranca.example', 'd')).toMatchObject({
      '@type': 'WebSite',
      url: 'https://cobranca.example/',
      inLanguage: 'pt-BR',
    });
  });
});

describe('applySeo', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    resetSeoForTests();
  });

  it('atualiza título, descrição, canonical, robots e Open Graph', () => {
    applySeo('/prazos', {});

    expect(document.title).toBe('Prazos — Cobrança Cidadã');
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      PAGES['/prazos'].description,
    );
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${window.location.origin}/prazos`,
    );
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'index,follow,max-image-preview:large',
    );
    expect(document.head.querySelector('meta[property="og:title"]')?.getAttribute('content')).toBe(
      'Prazos — Cobrança Cidadã',
    );
  });

  it('reaproveita as etiquetas existentes em vez de duplicá-las', () => {
    applySeo('/prazos', {});
    applySeo('/metodologia', {});

    expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    expect(document.head.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.title).toBe('Metodologia — Cobrança Cidadã');
  });

  it('a página informa seu próprio título, descrição e noindex', () => {
    applySeo('/compromissos/ECON-006', { title: 'Pacote MEI (ECON-006)', description: 'Resumo.' });
    expect(document.title).toBe('Pacote MEI (ECON-006) — Cobrança Cidadã');
    expect(document.head.querySelector('meta[name="description"]')?.getAttribute('content')).toBe(
      'Resumo.',
    );

    applySeo('/compromissos/XXX', { title: 'Não encontrado', noindex: true });
    expect(document.head.querySelector('meta[name="robots"]')?.getAttribute('content')).toBe(
      'noindex,nofollow',
    );
  });

  it('o canonical ignora filtros e barra final', () => {
    applySeo('/', {});
    expect(document.head.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${window.location.origin}/`,
    );
  });

  it('retira os dados estruturados do HTML inicial ao navegar para outra rota', () => {
    document.head.innerHTML = '<script type="application/ld+json" id="seo-jsonld">{}</script>';

    applySeo('/compromissos/ECON-006', {});
    expect(document.getElementById('seo-jsonld')).not.toBeNull();

    applySeo('/prazos', {});
    expect(document.getElementById('seo-jsonld')).toBeNull();
  });
});

describe('plugin do Vite', () => {
  let dir: string;

  beforeEach(() => {
    dir = mkdtempSync(join(tmpdir(), 'seo-'));
  });
  afterEach(() => rmSync(dir, { recursive: true, force: true }));

  const index = `<html><head>\n    <!--seo-head-start--><!--seo-head-end-->\n    <!--# include virtual="/_seo/head?path=$seo_path" -->\n</head><body><div id="root"></div></body></html>`;

  function build(html: string) {
    mkdirSync(join(dir, 'dist'), { recursive: true });
    writeFileSync(join(dir, 'dist', 'index.html'), html);
    const plugin = seoPlugin('https://cobranca.example/');
    (plugin.configResolved as (c: ResolvedConfig) => void)({
      root: dir,
      build: { outDir: 'dist' },
    } as ResolvedConfig);
    return plugin;
  }

  it('gera uma cópia do HTML por página, cada uma com as suas etiquetas', () => {
    const plugin = build(
      `<html><head>${'<!--seo-head-start-->\n<title>Início</title>\n<!--seo-head-end-->'}</head></html>`,
    );
    (plugin.closeBundle as () => void)();

    for (const path of PRERENDERED_PATHS) {
      const html = readFileSync(join(dir, 'dist', path.slice(1), 'index.html'), 'utf8');
      expect(html, path).toContain(
        `<link rel="canonical" href="https://cobranca.example${path}" />`,
      );
      expect(html, path).not.toContain('Início');
    }
    const entrar = readFileSync(join(dir, 'dist', 'entrar', 'index.html'), 'utf8');
    expect(entrar).toContain('noindex,nofollow');
    expect(readFileSync(join(dir, 'dist', 'index.html'), 'utf8')).toContain('Início');
  });

  it('o index.html da página inicial ganha as etiquetas e os dados estruturados do site', () => {
    const plugin = build(index);
    const transform = plugin.transformIndexHtml as unknown as { handler: (html: string) => string };

    const html = transform.handler(index);

    expect(html).toContain('<link rel="canonical" href="https://cobranca.example/" />');
    expect(html).toContain('"@type":"WebSite"');
    expect(html).toContain('<!--# include virtual="/_seo/head?path=$seo_path" -->');
  });

  it('falha o build se os marcadores sumirem do index.html', () => {
    const plugin = build('<html><head></head></html>');
    expect(() => (plugin.closeBundle as () => void)()).toThrow(/marcadores de SEO/);
  });
});
