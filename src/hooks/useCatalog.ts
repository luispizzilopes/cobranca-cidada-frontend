import { useEffect, useState } from 'react';
import { catalogService } from '../services/catalog/catalogService';
import type { Catalog } from '../services/types';

let cached: Promise<Catalog> | null = null;

/** Descarta o cache depois que o painel renomeia uma área ou origem. */
export function invalidateCatalog(): void {
  cached = null;
}

/** Áreas, origens e situações mudam raramente: uma consulta por carregamento da página. */
export function useCatalog() {
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let active = true;
    cached ??= catalogService.get().catch((err) => {
      cached = null;
      throw err;
    });
    cached.then(
      (value) => active && setCatalog(value),
      () => active && setError(true),
    );
    return () => {
      active = false;
    };
  }, []);

  return { catalog, error };
}
