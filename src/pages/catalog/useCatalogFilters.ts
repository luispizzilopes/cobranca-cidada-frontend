import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { CommitmentQuery, CommitmentSort } from '../../services/commitment/commitmentService';

export type Tab = 'todas' | 'minhas' | 'prazo';

export const PAGE_SIZE = 12;

const SORTS: CommitmentSort[] = [
  'area',
  'code',
  'deadline',
  'mais-cobradas',
  'melhor-avaliadas',
  'pior-avaliadas',
];

export interface CatalogFilters {
  busca: string;
  area: string;
  origem: string;
  situacao: string;
  ordem: CommitmentSort;
  aba: Tab;
  pagina: number;
}

/** Filtros na URL: a busca pode ser compartilhada e o botão "voltar" do navegador funciona. */
export function useCatalogFilters() {
  const [params, setParams] = useSearchParams();

  const filters = useMemo<CatalogFilters>(() => {
    const ordem = params.get('ordem') as CommitmentSort | null;
    const aba = params.get('aba');
    return {
      busca: params.get('busca') ?? '',
      area: params.get('area') ?? '',
      origem: params.get('origem') ?? '',
      situacao: params.get('situacao') ?? '',
      ordem: ordem && SORTS.includes(ordem) ? ordem : 'area',
      aba: aba === 'minhas' || aba === 'prazo' ? aba : 'todas',
      pagina: Math.max(1, Number(params.get('pagina')) || 1),
    };
  }, [params]);

  const update = useCallback(
    (changes: Partial<CatalogFilters>) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current);
          const resetsPage = Object.keys(changes).some((key) => key !== 'pagina');
          for (const [key, value] of Object.entries(changes)) {
            const empty =
              value === '' ||
              value === undefined ||
              (key === 'aba' && value === 'todas') ||
              (key === 'ordem' && value === 'area') ||
              (key === 'pagina' && value === 1);
            if (empty) next.delete(key);
            else next.set(key, String(value));
          }
          if (resetsPage && !('pagina' in changes)) next.delete('pagina');
          return next;
        },
        { replace: false },
      );
    },
    [setParams],
  );

  const clear = useCallback(() => setParams(new URLSearchParams()), [setParams]);

  const query = useMemo<CommitmentQuery>(
    () => ({
      busca: filters.busca || undefined,
      area: filters.area || undefined,
      origem: filters.origem || undefined,
      situacao: filters.situacao || undefined,
      comPrazo: filters.aba === 'prazo',
      minhasCobrancas: filters.aba === 'minhas',
      ordem: filters.ordem,
      pageNumber: filters.pagina,
      pageSize: PAGE_SIZE,
    }),
    [filters],
  );

  const hasActiveFilters = Boolean(
    filters.busca || filters.area || filters.origem || filters.situacao || filters.aba !== 'todas',
  );

  return { filters, update, clear, query, hasActiveFilters };
}
