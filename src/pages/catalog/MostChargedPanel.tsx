import { Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Loading } from '../../components/common';
import { Panel, SectionTitle } from '../../components/layout/Page/Page.styles';
import { VoteCounts } from '../../components/voting/VoteCounts';
import { useCommitments } from '../../hooks/useCommitments';
import { Counts, List, Note } from './MostChargedPanel.styles';

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
