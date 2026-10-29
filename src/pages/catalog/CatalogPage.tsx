import { useState, type FormEvent } from 'react';
import { Search, X } from 'lucide-react';
import { Alert, Button, Loading, Pagination, Select } from '../../components/common';
import { Container } from '../../components/layout/Page/Page.styles';
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
import {
  Filters,
  Hero,
  Layout,
  Results,
  SearchInput,
  SearchLabel,
  SearchRow,
  Side,
  Summary,
  TabButton,
  Tabs,
} from './CatalogPage.styles';

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
              onChange={(v) => update({ area: v })}
              options={(catalog?.areas ?? []).map((a) => ({ value: a.code, label: a.name }))}
            />
            <Select
              id="filtro-origem"
              label="Origem"
              placeholder="Todas as origens"
              value={filters.origem}
              onChange={(v) => update({ origem: v })}
              options={(catalog?.origins ?? []).map((o) => ({ value: o.code, label: o.name }))}
            />
            <Select
              id="filtro-situacao"
              label="Situação de execução"
              placeholder="Todas as situações"
              value={filters.situacao}
              onChange={(v) => update({ situacao: v })}
              options={(catalog?.statuses ?? []).map((s) => ({ value: s.value, label: s.label }))}
            />
            <Select
              id="filtro-ordem"
              label="Ordenar"
              value={filters.ordem}
              onChange={(v) => update({ ordem: v as CommitmentSort })}
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
