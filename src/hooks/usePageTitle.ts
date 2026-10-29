import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { applySeo, type SeoOptions } from '../seo/applySeo';

/**
 * Define o título da página e o restante do SEO da rota atual (descrição, canonical, robots, Open Graph).
 * Sem `options`, usa o que a tabela de `seo/pages.ts` diz para a rota; o compromisso informa os seus.
 */
export function usePageTitle(
  title?: string,
  options: Partial<Pick<SeoOptions, 'description' | 'noindex'>> = {},
) {
  const { pathname } = useLocation();
  const { description, noindex } = options;

  useEffect(() => {
    applySeo(pathname, { title, description, noindex });
  }, [pathname, title, description, noindex]);
}
