import { useState, type FormEvent } from 'react';
import { CornerDownRight, Trash2 } from 'lucide-react';
import styled from 'styled-components';
import { Alert, Button, Loading, Textarea, useToast } from '../common';
import { Section, SectionTitle } from '../layout/Page/Page';
import { useSession } from '../../contexts/SessionContext';
import { useVerifyEmail } from '../../contexts/VerifyEmailContext';
import { useComments } from '../../hooks/useComments';
import { commentService } from '../../services/comment/commentService';
import { extractApiError, retryAfterSeconds } from '../../utils/apiError';
import { formatDateTime } from '../../utils/dates';
import { formatNumber } from '../../utils/numbers';
import type { CommitmentComment } from '../../services/types';

const MAX_LENGTH = 1000;
const MIN_LENGTH = 3;

const Form = styled.form`
  display: grid;
  gap: 12px;
  margin-bottom: 24px;
`;

const FormFooter = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
`;

const Counter = styled.span`
  color: var(--muted);
  font-size: 0.857rem;
`;

const List = styled.ul`
  display: grid;
  gap: 12px;
  margin: 0 0 16px;
  padding: 0;
  list-style: none;

  li {
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
  }
  p {
    margin: 4px 0 0;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }
`;

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  color: var(--muted);
  font-size: 0.857rem;
`;

const Replies = styled.ul`
  display: grid;
  gap: 8px;
  margin: 12px 0 0 !important;
  padding: 0 0 0 16px !important;
  list-style: none;
  border-left: 3px solid var(--border);

  li {
    background: transparent !important;
    border: 0 !important;
    padding: 4px 0 !important;
  }
`;

const ReplyForm = styled.form`
  display: grid;
  gap: 8px;
  margin-top: 12px;
`;

interface Props {
  commitmentId: string;
}

/** Opiniões em texto. Como o voto, são só opinião: não mudam a situação de execução. */
export function CommentsSection({ commitmentId }: Props) {
  const toast = useToast();
  const { isAdmin } = useSession();
  const { ensureCanVote } = useVerifyEmail();
  const { comments, total, loading, error, hasMore, loadMore, reload } = useComments(commitmentId);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replySending, setReplySending] = useState(false);

  const trimmedLength = text.trim().length;
  const canSend = trimmedLength >= MIN_LENGTH && trimmedLength <= MAX_LENGTH;

  const replyLength = replyText.trim().length;
  const canReply = replyLength >= MIN_LENGTH && replyLength <= MAX_LENGTH;

  async function publish(
    body: string,
    parentId: string | undefined,
    setBusy: (busy: boolean) => void,
    onDone: () => void,
  ) {
    if (!(await ensureCanVote())) return;

    setBusy(true);
    try {
      await commentService.add(commitmentId, body.trim(), parentId);
      onDone();
      toast.success(parentId ? 'Resposta publicada.' : 'Comentário publicado.');
      reload();
    } catch (err) {
      const wait = retryAfterSeconds(err);
      toast.error(
        wait ? `${extractApiError(err)} Tente de novo em ${wait} s.` : extractApiError(err),
      );
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent) {
    event.preventDefault();
    if (!canSend || sending) return;
    void publish(text, undefined, setSending, () => setText(''));
  }

  function submitReply(event: FormEvent, parentId: string) {
    event.preventDefault();
    if (!canReply || replySending) return;
    void publish(replyText, parentId, setReplySending, () => {
      setReplyText('');
      setReplyingTo(null);
    });
  }

  async function remove(commentId: string, asAdmin: boolean) {
    setRemovingId(commentId);
    try {
      if (asAdmin) await commentService.removeAsAdmin(commentId);
      else await commentService.remove(commentId);
      toast.success('Comentário apagado.');
      reload();
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setRemovingId(null);
    }
  }

  function renderComment(comment: CommitmentComment, canReplyTo: boolean) {
    return (
      <>
        <Header>
          <span>
            {comment.isMine ? 'Você' : 'Pessoa com e-mail verificado'} ·{' '}
            {formatDateTime(comment.createdAtUtc)}
          </span>
          <span style={{ display: 'flex', gap: 4 }}>
            {canReplyTo && replyingTo !== comment.id && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setReplyingTo(comment.id);
                  setReplyText('');
                }}
              >
                <CornerDownRight size={14} aria-hidden="true" />
                Responder
              </Button>
            )}
            {(comment.isMine || isAdmin) && (
              <Button
                variant="ghost"
                size="sm"
                loading={removingId === comment.id}
                onClick={() => void remove(comment.id, !comment.isMine)}
              >
                <Trash2 size={14} aria-hidden="true" />
                {comment.isMine ? 'Apagar' : 'Remover (moderação)'}
              </Button>
            )}
          </span>
        </Header>
        <p>{comment.text}</p>
      </>
    );
  }

  return (
    <Section aria-labelledby="comentarios">
      <SectionTitle id="comentarios">
        Comentários{total > 0 && ` (${formatNumber(total)})`}
      </SectionTitle>

      <Form onSubmit={submit}>
        <Textarea
          id="novo-comentario"
          label="Deixe sua opinião sobre este compromisso"
          hint="Comentários são públicos e aparecem sem nome. Para comentar ou responder, é preciso ter conta ou e-mail verificado."
          value={text}
          maxLength={MAX_LENGTH}
          onChange={(event) => setText(event.target.value)}
        />
        <FormFooter>
          <Counter aria-live="polite">
            {formatNumber(trimmedLength)} / {formatNumber(MAX_LENGTH)}
          </Counter>
          <Button type="submit" loading={sending} disabled={!canSend}>
            Comentar
          </Button>
        </FormFooter>
      </Form>

      {error && (
        <Alert tone="danger" role="alert">
          {error}
        </Alert>
      )}

      {!error && !loading && comments.length === 0 && (
        <p>Ainda não há comentários. Seja a primeira pessoa a opinar.</p>
      )}

      {comments.length > 0 && (
        <List aria-live="polite">
          {comments.map((comment) => (
            <li key={comment.id}>
              {renderComment(comment, true)}
              {comment.replies.length > 0 && (
                <Replies aria-label={`Respostas (${comment.replies.length})`}>
                  {comment.replies.map((reply) => (
                    <li key={reply.id}>{renderComment(reply, false)}</li>
                  ))}
                </Replies>
              )}
              {replyingTo === comment.id && (
                <ReplyForm onSubmit={(event) => submitReply(event, comment.id)}>
                  <Textarea
                    id={`resposta-${comment.id}`}
                    label="Sua resposta"
                    value={replyText}
                    maxLength={MAX_LENGTH}
                    autoFocus
                    onChange={(event) => setReplyText(event.target.value)}
                  />
                  <FormFooter>
                    <Counter aria-live="polite">
                      {formatNumber(replyLength)} / {formatNumber(MAX_LENGTH)}
                    </Counter>
                    <span style={{ display: 'flex', gap: 8 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReplyingTo(null);
                          setReplyText('');
                        }}
                      >
                        Cancelar
                      </Button>
                      <Button type="submit" size="sm" loading={replySending} disabled={!canReply}>
                        Responder
                      </Button>
                    </span>
                  </FormFooter>
                </ReplyForm>
              )}
            </li>
          ))}
        </List>
      )}

      {loading && <Loading inline />}
      {hasMore && !loading && (
        <Button variant="secondary" onClick={() => void loadMore()}>
          Ver mais comentários
        </Button>
      )}
      <p style={{ margin: '12px 0 0', color: 'var(--muted)', fontSize: '0.857rem' }}>
        Opinião de pessoas com e-mail verificado. Não é pesquisa estatística e não muda a situação
        de execução.
      </p>
    </Section>
  );
}
