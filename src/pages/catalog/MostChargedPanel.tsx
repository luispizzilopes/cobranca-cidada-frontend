import { Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Loading } from '../../components/common';
import { Panel, SectionTitle } from '../../components/layout/Page/Page';
import { VoteCounts } from '../../components/voting/VoteCounts';
import { useCommitments } from '../../hooks/useCommitments';

const List = styled.ol`
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: rank;

  > li {
    display: grid;
    grid-template-columns: 28px 1fr;
    gap: 8px;
    counter-increment: rank;
  }

  > li::before {
    content: counter(rank);
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--primary);
    color: var(--on-primary);
    font-weight: 700;
  }
`;

const Counts = styled.div`
  margin-top: 6px;
`;

const Note = styled.p`
  margin: 0;
  color: var(--muted);
`;

const QUERY = { ordem: 'mais-cobradas', pageSize: 5 } as const;

/** Lista os mais cobrados; compromissos sem nenhuma cobrança ficam de fora do ranking. */
export function MostChargedPanel() {
  const { data, loading, error } = useCommitments(QUERY);
  const ranked = data?.items.filter((item) => (item.votes.charges ?? 0) > 0) ?? [];

  return (
    <Panel as="section" aria-labelledby="mais-cobradas">
      <SectionTitle id="mais-cobradas">
        <Megaphone size={20} aria-hidden="true" style={{ verticalAlign: '-3px', marginRight: 8 }} />
        Mais cobradas agora
      </SectionTitle>
      {loading ? (
        <Loading inline />
      ) : error ? (
        <Note>Não foi possível carregar o ranking.</Note>
      ) : ranked.length === 0 ? (
        <Note>Ainda não há cobranças para exibir um ranking.</Note>
      ) : (
        <List>
          {ranked.map((item) => (
            <li key={item.id}>
              <div>
                <Link to={`/compromissos/${encodeURIComponent(item.id)}`}>{item.title}</Link>
                <Counts>
                  <VoteCounts votes={item.votes} />
                </Counts>
              </div>
            </li>
          ))}
        </List>
      )}
    </Panel>
  );
}
