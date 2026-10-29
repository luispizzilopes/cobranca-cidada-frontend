import { useEffect, useState, type FormEvent } from 'react';
import { isCancel } from 'axios';
import { Link, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  Alert,
  Badge,
  Button,
  Input,
  LinkButton,
  Loading,
  Pagination,
  Select,
  StatusBadge,
} from '../../components/common';
import { Page } from '../../components/layout/Page/Page';
import { useCatalog } from '../../hooks/useCatalog';
import { usePageTitle } from '../../hooks/usePageTitle';
import { adminService, type AdminCommitmentQuery } from '../../services/admin/adminService';
import type { AdminCommitmentSummary, PaginedResult } from '../../services/types';
import { formatDate, formatDateTime } from '../../utils/dates';
import { extractApiError } from '../../utils/apiError';
import { AdminNav } from './AdminNav';
import { formatNumber } from '../../utils/numbers';

const PAGE_SIZE = 20;

const Filters = styled.form`
  display: grid;
  gap: 0 12px;
  margin-bottom: 16px;
  padding: 16px 20px 4px;
  background: var(--bg-alt);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);

  @media (min-width: 700px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .wide {
    @media (min-width: 700px) {
      grid-column: 1 / -1;
    }
  }
  select {
    margin-bottom: 16px;
  }
`;

const List = styled.ul`
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Row = styled.li`
  display: grid;
  gap: 6px;
  padding: 12px 16px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);

  h3 {
    margin: 0;
    font-size: 1rem;
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 12px;
    align-items: center;
    color: var(--muted);
    font-size: 0.857rem;
  }
`;

const publishedOptions = [
  { value: 'true', label: 'Publicados' },
  { value: 'false', label: 'Despublicados' },
];

const sortOptions = [
  { value: 'area', label: 'Área' },
  { value: 'code', label: 'Código' },
  { value: 'deadline', label: 'Prazo' },
];

export function AdminCommitmentsPage() {
  usePageTitle('Administração — compromissos');
  const { catalog } = useCatalog();
  const [params, setParams] = useSearchParams();
  const [term, setTerm] = useState(params.get('busca') ?? '');
  const [result, setResult] = useState<PaginedResult<AdminCommitmentSummary> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const page = Math.max(1, Number(params.get('pagina')) || 1);
  const published = params.get('publicado');

  useEffect(() => {
    const controller = new AbortController();
    const query: AdminCommitmentQuery = {
      busca: params.get('busca') ?? undefined,
      area: params.get('area') ?? undefined,
      origem: params.get('origem') ?? undefined,
      situacao: params.get('situacao') ?? undefined,
      publicado: published === null ? undefined : published === 'true',
      ordem: (params.get('ordem') as AdminCommitmentQuery['ordem']) ?? undefined,
      pageNumber: page,
      pageSize: PAGE_SIZE,
    };
    setLoading(true);
    setError(null);
    adminService
      .list(query, controller.signal)
      .then(setResult)
      .catch((err) => {
        if (isCancel(err)) return;
        setError(extractApiError(err));
        setResult(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [params, page, published]);

  function update(changes: Record<string, string | null>) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value);
      else next.delete(key);
    }
    if (!('pagina' in changes)) next.delete('pagina');
    setParams(next);
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    update({ busca: term.trim() || null });
  }

  const toOptions = (items: { code: string; name: string }[] | undefined) =>
    (items ?? []).map((item) => ({ value: item.code, label: item.name }));

  return (
    <Page
      crumbs={[{ label: 'Compromissos', to: '/' }, { label: 'Administração' }]}
      title="Administração"
    >
      <AdminNav />
      <p>
        <LinkButton to="/admin/compromissos/novo">Novo compromisso</LinkButton>
      </p>
      <Filters onSubmit={submit} role="search" aria-label="Filtrar compromissos">
        <div className="wide">
          <Input
            id="admin-busca"
            label="Buscar por título, descrição ou código"
            type="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </div>
        <Select
          id="admin-area"
          label="Área"
          placeholder="Todas"
          options={toOptions(catalog?.areas)}
          value={params.get('area') ?? ''}
          onChange={(e) => update({ area: e.target.value || null })}
        />
        <Select
          id="admin-origem"
          label="Origem"
          placeholder="Todas"
          options={toOptions(catalog?.origins)}
          value={params.get('origem') ?? ''}
          onChange={(e) => update({ origem: e.target.value || null })}
        />
        <Select
          id="admin-situacao"
          label="Situação"
          placeholder="Todas"
          options={(catalog?.statuses ?? []).map((s) => ({ value: s.value, label: s.label }))}
          value={params.get('situacao') ?? ''}
          onChange={(e) => update({ situacao: e.target.value || null })}
        />
        <Select
          id="admin-publicado"
          label="Publicação"
          placeholder="Todos"
          options={publishedOptions}
          value={published ?? ''}
          onChange={(e) => update({ publicado: e.target.value || null })}
        />
        <Select
          id="admin-ordem"
          label="Ordenar por"
          options={sortOptions}
          value={params.get('ordem') ?? 'area'}
          onChange={(e) => update({ ordem: e.target.value === 'area' ? null : e.target.value })}
        />
        <div style={{ alignSelf: 'end', marginBottom: 16 }}>
          <Button type="submit">Buscar</Button>
        </div>
      </Filters>

      {error && (
        <Alert tone="danger" role="alert">
          {error}
        </Alert>
      )}
      {loading && <Loading />}

      {!loading && result && (
        <>
          <p aria-live="polite">
            {result.totalCount === 0
              ? 'Nenhum compromisso encontrado.'
              : `${formatNumber(result.totalCount)} compromisso${result.totalCount === 1 ? '' : 's'}.`}
          </p>
          <List>
            {result.items.map((item) => (
              <Row key={item.id}>
                <h3>
                  <Link to={`/admin/compromissos/${encodeURIComponent(item.id)}`}>
                    {item.id} — {item.title}
                  </Link>
                </h3>
                <div className="meta">
                  <StatusBadge status={item.status} />
                  {!item.isPublished && <Badge tone="orange">Despublicado</Badge>}
                  <span>{item.area.name}</span>
                  <span>
                    {item.deadlineDate
                      ? `Prazo estruturado: ${formatDate(item.deadlineDate)}`
                      : item.deadlineText
                        ? `Prazo (texto): ${item.deadlineText}`
                        : 'Sem prazo'}
                  </span>
                  <span>Atualizado em {formatDateTime(item.updatedAtUtc)}</span>
                </div>
              </Row>
            ))}
          </List>
          <Pagination
            page={result.pageNumber}
            totalPages={result.totalPages}
            onChange={(next) => update({ pagina: next > 1 ? String(next) : null })}
          />
        </>
      )}
    </Page>
  );
}
