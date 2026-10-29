import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { useCatalogFilters } from './useCatalogFilters';

function setup(initial: string) {
  const wrapper = ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[initial]}>{children}</MemoryRouter>
  );
  return renderHook(() => ({ ...useCatalogFilters(), location: useLocation() }), { wrapper });
}

describe('useCatalogFilters', () => {
  it('lê os filtros da URL e monta a consulta da API', () => {
    const { result } = setup(
      '/?busca=saude&area=SAUDE&situacao=InProgress&aba=prazo&ordem=mais-cobradas&pagina=3',
    );

    expect(result.current.filters).toMatchObject({
      busca: 'saude',
      area: 'SAUDE',
      aba: 'prazo',
      ordem: 'mais-cobradas',
      pagina: 3,
    });
    expect(result.current.query).toMatchObject({
      busca: 'saude',
      area: 'SAUDE',
      situacao: 'InProgress',
      comPrazo: true,
      minhasCobrancas: false,
      ordem: 'mais-cobradas',
      pageNumber: 3,
    });
  });

  it('ignora valores inválidos e usa os padrões', () => {
    const { result } = setup('/?ordem=aleatoria&aba=qualquer&pagina=-4');
    expect(result.current.filters).toMatchObject({ ordem: 'area', aba: 'todas', pagina: 1 });
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it('mudar um filtro volta para a página 1 e mudar a página não mexe nos filtros', () => {
    const { result } = setup('/?area=ECON&pagina=4');

    act(() => result.current.update({ situacao: 'Fulfilled' }));
    expect(result.current.location.search).toBe('?area=ECON&situacao=Fulfilled');

    act(() => result.current.update({ pagina: 2 }));
    expect(result.current.location.search).toBe('?area=ECON&situacao=Fulfilled&pagina=2');
  });

  it('valores padrão saem da URL e "limpar" zera tudo', () => {
    const { result } = setup('/?aba=minhas&ordem=code');

    act(() => result.current.update({ aba: 'todas', ordem: 'area' }));
    expect(result.current.location.search).toBe('');

    act(() => result.current.update({ busca: 'x' }));
    act(() => result.current.clear());
    expect(result.current.location.search).toBe('');
  });
});
