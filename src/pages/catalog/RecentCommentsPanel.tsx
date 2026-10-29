import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { LinkButton, Loading } from '../../components/common';
import { Panel, SectionTitle } from '../../components/layout/Page/Page';
import { useRecentComments } from '../../hooks/useRecentComments';
import { formatDateTime } from '../../utils/dates';

const List = styled.ul`
  display: grid;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;

  > li {
    display: grid;
    gap: 6px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--border);
  }

  > li:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
`;

const Quote = styled.blockquote`
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin: 0;
  padding-left: 12px;
  border-left: 3px solid var(--border-strong);
  overflow-wrap: anywhere;
`;

const Meta = styled.p`
  margin: 0;
  color: var(--muted);
  font-size: 0.857rem;
`;

const Note = styled.p`
  margin: 0;
  color: var(--muted);
`;

const LIMIT = 3;

/** Opinião em texto de pessoas; não é prova de nada sobre a execução do compromisso. */
export function RecentCommentsPanel() {
  const { comments, loading, error } = useRecentComments(LIMIT);

  return (
    <Panel as="section" aria-labelledby="comentarios-recentes">
      <SectionTitle id="comentarios-recentes">
        <MessageCircle
          size={20}
          aria-hidden="true"
          style={{ verticalAlign: '-3px', marginRight: 8 }}
        />
        Veja o que as pessoas estão comentando
      </SectionTitle>
      {loading ? (
        <Loading inline />
      ) : error ? (
        <Note>Não foi possível carregar os comentários.</Note>
      ) : comments.length === 0 ? (
        <Note>
          Ainda não há comentários. Abra um compromisso e seja a primeira pessoa a opinar.
        </Note>
      ) : (
        <List>
          {comments.map((comment) => {
            const path = `/compromissos/${encodeURIComponent(comment.commitmentId)}`;
            return (
              <li key={comment.id}>
                <Link to={path}>{comment.commitmentTitle}</Link>
                <Quote>{comment.text}</Quote>
                <Meta>{formatDateTime(comment.createdAtUtc)}</Meta>
                <div>
                  <LinkButton
                    to={{ pathname: path, hash: 'comentarios' }}
                    variant="secondary"
                    size="sm"
                  >
                    Ver mais
                    <span className="sr-only"> comentários sobre {comment.commitmentTitle}</span>
                  </LinkButton>
                </div>
              </li>
            );
          })}
        </List>
      )}
    </Panel>
  );
}
