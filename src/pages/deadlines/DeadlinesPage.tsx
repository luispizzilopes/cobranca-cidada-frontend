import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Loading } from '../../components/common';
import { Page } from '../../components/layout/Page/Page';
import { Section, SectionTitle } from '../../components/layout/Page/Page.styles';
import { Countdown } from '../../components/voting/Countdown';
import { usePageTitle } from '../../hooks/usePageTitle';
import { commitmentService } from '../../services/commitment/commitmentService';
import type { CommitmentSummary } from '../../services/types';
import { extractApiError } from '../../utils/apiError';
import { cleanDeadlineText, yearsInDeadline } from '../../utils/deadlines';
import { Banner, Year } from './DeadlinesPage.styles';

const OTHER = 0;
/** Agrupa pelo primeiro ano citado no texto do prazo. É leitura do que a fonte diz; nada é presumido. */
export function groupByDeadlineYear(items: CommitmentSummary[]): [number, CommitmentSummary[]][] {
  const groups = new Map<number, CommitmentSummary[]>();
  for (const item of items) {
    const year = yearsInDeadline(item.deadlineText)[0] ?? OTHER;
    groups.set(year, [...(groups.get(year) ?? []), item]);
  }
  return [...groups.entries()].sort(([a], [b]) => (a === OTHER ? 1 : b === OTHER ? -1 : a - b));
}
async function loadAll(): Promise<CommitmentSummary[]> {
  const items: CommitmentSummary[] = [];
  let page = 1;
  let totalPages = 1;
  do {
    const result = await commitmentService.list({
      comPrazo: true,
      ordem: 'deadline',
      pageNumber: page,
      pageSize: 100,
    });
    items.push(...result.items);
    totalPages = result.totalPages;
    page++;
  } while (page <= totalPages);
  return items;
}
export function DeadlinesPage() {
  usePageTitle('Prazos');
  const [items, setItems] = useState<CommitmentSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    loadAll().then(
      (result) => active && setItems(result),
      (err) => active && setError(extractApiError(err)),
    );
    return () => {
      active = false;
    };
  }, []);

  const groups = useMemo(() => groupByDeadlineYear(items ?? []), [items]);

  return (
    <Page
      crumbs={[{ label: 'Compromissos', to: '/' }, { label: 'Prazos' }]}
      title="Linha do tempo de prazos"
    >
      <Banner>
        <Countdown />
      </Banner>
      <p>
        Compromissos que têm prazo informado, agrupados pelo primeiro ano citado no texto da fonte.
        O plano de governo não traz cronograma; a maior parte dos prazos vem de declarações e da
        imprensa. Nada é presumido: o que não informa ano fica em &quot;Sem ano no texto&quot;.
      </p>
      {error ? (
        <Alert tone="danger" role="alert">
          {error}
        </Alert>
      ) : !items ? (
        <Loading />
      ) : groups.length === 0 ? (
        <p>Nenhum compromisso com prazo informado.</p>
      ) : (
        groups.map(([year, list]) => (
          <Section key={year} aria-labelledby={`ano-${year}`}>
            <SectionTitle id={`ano-${year}`}>
              {year === OTHER ? 'Sem ano no texto' : year}
            </SectionTitle>
            <Year>
              {list.map((item) => (
                <li key={item.id}>
                  <Link to={`/compromissos/${encodeURIComponent(item.id)}`}>{item.title}</Link>
                  <small>
                    {item.id} · prazo: {cleanDeadlineText(item.deadlineText ?? '')}
                  </small>
                </li>
              ))}
            </Year>
          </Section>
        ))
      )}
    </Page>
  );
}
