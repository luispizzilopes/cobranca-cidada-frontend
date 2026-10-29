import { useState } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, Button, Loading, Modal, useToast } from '../../components/common';
import { Panel, SectionTitle } from '../../components/layout/Page/Page.styles';
import { useSession } from '../../contexts/SessionContext';
import { votingService } from '../../services/voting/votingService';
import type { MyVoteItem } from '../../services/types';
import { extractApiError } from '../../utils/apiError';
import { formatDateTime } from '../../utils/dates';
import { downloadJson } from '../../utils/download';
import { formatNumber } from '../../utils/numbers';
import { Actions, List, Toolbar } from './MyVotesSection.styles';

interface Props {
  votes: MyVoteItem[];
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  voterOnly: boolean;
}
function describe(vote: MyVoteItem): string {
  const parts: string[] = [];
  if (vote.charge) parts.push('cobrou');
  if (vote.rating === 'boa') parts.push('avaliou como boa proposta');
  if (vote.rating === 'ma') parts.push('avaliou como má proposta');
  return parts.join(' · ');
}
export function MyVotesSection({ votes, loading, error, reload, voterOnly }: Props) {
  const toast = useToast();
  const { forgetVoter } = useSession();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function deleteAll() {
    setDeleting(true);
    try {
      const count = await votingService.deleteMyVotes();
      toast.success(count === 1 ? '1 voto apagado.' : `${formatNumber(count)} votos apagados.`);
      setConfirming(false);
      if (voterOnly) forgetVoter();
      else await reload();
    } catch (err) {
      toast.error(extractApiError(err));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Panel as="section" aria-labelledby="meus-votos">
      <SectionTitle id="meus-votos">Meus votos</SectionTitle>
      {loading ? (
        <Loading inline />
      ) : error ? (
        <Alert tone="danger" role="alert">
          {error}
        </Alert>
      ) : votes.length === 0 ? (
        <p>Você ainda não votou em nenhum compromisso.</p>
      ) : (
        <List>
          {votes.map((vote) => (
            <li key={vote.commitmentId}>
              <Link to={`/compromissos/${encodeURIComponent(vote.commitmentId)}`}>
                {vote.commitmentId} — {vote.title}
              </Link>
              <small>
                {describe(vote)} · em {formatDateTime(vote.updatedAtUtc)}
              </small>
            </li>
          ))}
        </List>
      )}
      <Toolbar>
        <Button
          variant="secondary"
          size="sm"
          disabled={votes.length === 0}
          onClick={() => downloadJson('meus-votos.json', votes)}
        >
          <Download size={16} aria-hidden="true" />
          Exportar (JSON)
        </Button>
        <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>
          <Trash2 size={16} aria-hidden="true" />
          Apagar meus votos
        </Button>
      </Toolbar>

      {confirming && (
        <Modal title="Apagar todos os votos?" onClose={() => setConfirming(false)}>
          <p>
            Todos os seus votos serão apagados e as contagens públicas serão atualizadas.
            {voterOnly &&
              ' Como você não tem conta, a confirmação do seu e-mail neste navegador também será encerrada.'}{' '}
            Essa ação não pode ser desfeita.
          </p>
          <Actions>
            <Button variant="danger" loading={deleting} onClick={() => void deleteAll()}>
              Apagar tudo
            </Button>
            <Button variant="ghost" onClick={() => setConfirming(false)}>
              Cancelar
            </Button>
          </Actions>
        </Modal>
      )}
    </Panel>
  );
}
