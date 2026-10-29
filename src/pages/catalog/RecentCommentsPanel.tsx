import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LinkButton, Loading } from '../../components/common';
import { Panel, SectionTitle } from '../../components/layout/Page/Page.styles';
import { useRecentComments } from '../../hooks/useRecentComments';
import { formatDateTime } from '../../utils/dates';
import { List, Meta, Note, Quote } from './RecentCommentsPanel.styles';

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
