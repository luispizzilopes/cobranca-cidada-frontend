import { useState, type FormEvent } from 'react';
import { Search, X } from 'lucide-react';
import styled from 'styled-components';
import { Alert, Button, Loading, Pagination, Select } from '../../components/common';
import { Container } from '../../components/layout/Page/Page';
import { Countdown } from '../../components/voting/Countdown';
import { CommitmentCard } from '../../components/voting/CommitmentCard';
import { useVerifyEmail } from '../../contexts/VerifyEmailContext';
import { useSession } from '../../contexts/SessionContext';
import { useCatalog } from '../../hooks/useCatalog';
import { useCommitments } from '../../hooks/useCommitments';
import { usePageTitle } from '../../hooks/usePageTitle';
import type { CommitmentSort } from '../../services/commitment/commitmentService';
import { MostChargedPanel } from './MostChargedPanel';
import { RecentCommentsPanel } from './RecentCommentsPanel';
import { PAGE_SIZE, useCatalogFilters, type Tab } from './useCatalogFilters';
import { formatNumber } from '../../utils/numbers';

const Hero = styled.section`
  background: var(--hero-bg);
  color: var(--hero-text);
  padding: 40px 0;
  border-bottom: 6px solid var(--yellow);

  h1 {
    margin: 0 0 8px;
    font-size: 2.571rem;
  }
  p {
    max-width: 62ch;
    margin: 0 0 20px;
    font-size: 1.143rem;
  }
`;

const Layout = styled(Container)`
  display: grid;
  gap: 32px;
  padding-top: 32px;

  @media (min-width: 1000px) {
    grid-template-columns: minmax(0, 1fr) 320px;
    align-items: start;
  }

  @media (min-width: 1200px) {
    grid-template-columns: minmax(0, 1fr) 380px;
  }
`;

const Filters = styled.form`
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
  padding: 16px 20px;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);

  @media (min-width: 700px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const SearchRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-end;

  @media (min-width: 700px) {
    grid-column: 1 / -1;
  }
  & > div {
    flex: 1;
  }
`;

const SearchLabel = styled.label`
  display: block;
  margin-bottom: 4px;
  font-weight: 600;
  font-size: 0.875rem;
`;

const SearchInput = styled.input`
  width: 100%;
  min-height: 40px;
  padding: 0 12px;
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
`;

const Tabs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-bottom: 16px;
  border-bottom: 1px solid var(--border);
`;

const TabButton = styled.button<{ $on: boolean }>`
  padding: 10px 16px;
  border: 0;
  border-bottom: 4px solid ${({ $on }) => ($on ? 'var(--green)' : 'transparent')};
  background: transparent;
  color: ${({ $on }) => ($on ? 'var(--primary)' : 'var(--text)')};
  font-weight: 600;

  &:hover {
    background: var(--hover);
  }
`;

const Results = styled.div`
  display: grid;
  gap: 16px;
`;

const Summary = styled.p`
  margin: 0 0 12px;
  color: var(--muted);
`;

const Side = styled.aside`
  display: grid;
  gap: 16px;
`;

const TABS: { id: Tab; label: string }[] = [
  { id: 'todas', label: 'Todas' },
  { id: 'minhas', label: 'Minhas cobranças' },
  { id: 'prazo', label: 'Com prazo' },
];

const SORT_OPTIONS: { value: CommitmentSort; label: string }[] = [
  { value: 'area', label: 'Por área' },
  { value: 'code', label: 'Por código' },
  { value: 'deadline', label: 'Por prazo' },
  { value: 'mais-cobradas', label: 'Mais cobradas' },
  { value: 'melhor-avaliadas', label: 'Melhor avaliadas' },
  { value: 'pior-avaliadas', label: 'Pior avaliadas' },
];

export function CatalogPage() {
  usePageTitle();
  const { filters, update, clear, query, hasActiveFilters } = useCatalogFilters();
  const { catalog } = useCatalog();
  const { canVote } = useSession();
  const { ensureCanVote } = useVerifyEmail();
  const [search, setSearch] = useState(filters.busca);
  const [syncedSearch, setSyncedSearch] = useState(filters.busca);

  if (syncedSearch !== filters.busca) {
    setSyncedSearch(filters.busca);
    setSearch(filters.busca);
  }

  const needsVoter = filters.aba === 'minhas' && !canVote;
  const { data, loading, error, applyVote, reload } = useCommitments(query, !needsVoter);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    update({ busca: search.trim() });
  }

  const total = data?.totalCount ?? 0;
  const first = total === 0 ? 0 : (filters.pagina - 1) * PAGE_SIZE + 1;
  const last = Math.min(filters.pagina * PAGE_SIZE, total);

  return (
    <>
      <Hero aria-labelledby="titulo-site">
        <Container>
          <h1 id="titulo-site">Cada promessa merece uma resposta</h1>
          <p>
            Conferimos, uma a uma, as promessas do presidente Lula para o mandato 2027–2030 e
            mostramos, com fonte e página do plano, o que já foi feito. Veja, cobre e diga o que
            acha da proposta.
          </p>
          <Countdown />
        </Container>
      </Hero>

      <Layout>
        <div>
          <Filters onSubmit={submitSearch} aria-label="Filtros">
            <SearchRow>
              <div>
                <SearchLabel htmlFor="filtro-busca">Buscar por palavra ou código</SearchLabel>
                <SearchInput
                  id="filtro-busca"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Ex.: saúde, ECON-006, aposentadoria"
                />
              </div>
              <Button type="submit">
                <Search size={16} aria-hidden="true" />
                Buscar
              </Button>
            </SearchRow>
            <Select
              id="filtro-area"
              label="Área"
              placeholder="Todas as áreas"
              value={filters.area}
              onChange={(event) => update({ area: event.target.value })}
              options={(catalog?.areas ?? []).map((a) => ({ value: a.code, label: a.name }))}
            />
            <Select
              id="filtro-origem"
              label="Origem"
              placeholder="Todas as origens"
              value={filters.origem}
              onChange={(event) => update({ origem: event.target.value })}
              options={(catalog?.origins ?? []).map((o) => ({ value: o.code, label: o.name }))}
            />
            <Select
              id="filtro-situacao"
              label="Situação de execução"
              placeholder="Todas as situações"
              value={filters.situacao}
              onChange={(event) => update({ situacao: event.target.value })}
              options={(catalog?.statuses ?? []).map((s) => ({ value: s.value, label: s.label }))}
            />
            <Select
              id="filtro-ordem"
              label="Ordenar"
              value={filters.ordem}
              onChange={(event) => update({ ordem: event.target.value as CommitmentSort })}
              options={SORT_OPTIONS}
            />
            {hasActiveFilters && (
              <div>
                <Button variant="ghost" size="sm" onClick={clear}>
                  <X size={14} aria-hidden="true" />
                  Limpar filtros
                </Button>
              </div>
            )}
          </Filters>

          <Tabs role="group" aria-label="Visualização">
            {TABS.map((tab) => (
              <TabButton
                key={tab.id}
                type="button"
                $on={filters.aba === tab.id}
                aria-pressed={filters.aba === tab.id}
                onClick={() => update({ aba: tab.id })}
              >
                {tab.label}
              </TabButton>
            ))}
          </Tabs>

          {needsVoter ? (
            <Alert tone="info" title="Suas cobranças ficam ligadas ao seu e-mail">
              <p>
                Confirme seu e-mail (sem criar conta) ou entre para ver os compromissos que você
                cobrou.
              </p>
              <Button size="sm" onClick={() => void ensureCanVote()}>
                Confirmar e-mail
              </Button>
            </Alert>
          ) : loading && !data ? (
            <Loading />
          ) : error ? (
            <Alert tone="danger" role="alert" title="Não foi possível carregar os compromissos">
              <p>{error}</p>
              <Button size="sm" onClick={reload}>
                Tentar de novo
              </Button>
            </Alert>
          ) : (
            <div aria-busy={loading}>
              <Summary role="status">
                {total === 0
                  ? filters.aba === 'minhas'
                    ? 'Você ainda não cobrou nenhum compromisso.'
                    : 'Nenhum compromisso encontrado com esses filtros.'
                  : `Mostrando ${formatNumber(first)}–${formatNumber(last)} de ${formatNumber(total)} compromissos`}
              </Summary>
              <Results>
                {data?.items.map((item) => (
                  <CommitmentCard key={item.id} commitment={item} onVoteChange={applyVote} />
                ))}
              </Results>
              <Pagination
                page={filters.pagina}
                totalPages={data?.totalPages ?? 0}
                onChange={(pagina) => {
                  update({ pagina });
                  window.scrollTo({ top: 0 });
                }}
              />
            </div>
          )}
        </div>

        <Side>
          <MostChargedPanel />
          <RecentCommentsPanel />
          {catalog && <Alert tone="info">{catalog.voting.disclaimer}</Alert>}
        </Side>
      </Layout>
    </>
  );
}
