import { useState, type FormEvent } from 'react';
import {
  Alert,
  Button,
  Checkbox,
  FormError,
  Input,
  Select,
  StatusBadge,
  Textarea,
  useToast,
} from '../../components/common';
import { Panel, SectionTitle } from '../../components/layout/Page/Page';
import { adminService } from '../../services/admin/adminService';
import type { AdminCommitmentDetail, StatusInfo } from '../../services/types';
import { extractApiError } from '../../utils/apiError';
import { formatDate, formatDateTime } from '../../utils/dates';

const today = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
};

interface Props {
  detail: AdminCommitmentDetail;
  statuses: StatusInfo[];
  onChange: (detail: AdminCommitmentDetail) => void;
}

/** Situação de execução é editorial: cada mudança vira um registro imutável no histórico, com fonte. */
export function StatusSection({ detail, statuses, onChange }: Props) {
  const toast = useToast();
  const [status, setStatus] = useState(detail.status.value);
  const [referenceDate, setReferenceDate] = useState(today);
  const [sourceUrl, setSourceUrl] = useState('');
  const [note, setNote] = useState('');
  const [isFormalAct, setIsFormalAct] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const unfulfilled = status === 'Unfulfilled';

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (status !== 'NotEvaluated' && !/^https?:\/\/\S+$/i.test(sourceUrl.trim())) {
      setError('Toda mudança de situação exige uma fonte com URL http ou https válida.');
      return;
    }
    setLoading(true);
    try {
      const updated = await adminService.registerStatus(detail.id, {
        status,
        referenceDate,
        sourceUrl: sourceUrl.trim() || null,
        note: note.trim() || null,
        isFormalAct,
      });
      onChange(updated);
      setSourceUrl('');
      setNote('');
      setIsFormalAct(false);
      toast.success('Situação registrada.');
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel as="section" aria-labelledby="secao-situacao">
      <SectionTitle id="secao-situacao">Situação de execução</SectionTitle>
      <p>
        Situação atual: <StatusBadge status={detail.status} />
        {detail.statusDate && <> desde {formatDate(detail.statusDate)}</>}
      </p>

      <form onSubmit={submit} noValidate>
        <FormError message={error} />
        <Select
          id="nova-situacao"
          label="Nova situação"
          options={statuses.map((s) => ({ value: s.value, label: s.label }))}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
        {unfulfilled && (
          <Alert tone="warning">
            <p>
              Nunca “Descumprido” antes do prazo. Sem prazo estruturado, só com ato formal em
              sentido contrário, com fonte. A API recusa o registro que violar a regra.
            </p>
          </Alert>
        )}
        <Input
          id="situacao-data"
          label="Data de referência"
          type="date"
          max={today()}
          value={referenceDate}
          onChange={(e) => setReferenceDate(e.target.value)}
        />
        <Input
          id="situacao-fonte"
          label="URL da fonte"
          type="url"
          hint="Obrigatória para qualquer situação diferente de “Não avaliado”."
          value={sourceUrl}
          onChange={(e) => setSourceUrl(e.target.value)}
        />
        <Textarea
          id="situacao-nota"
          label="Observação (opcional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={2000}
        />
        <Checkbox
          id="situacao-ato"
          label="É um ato formal"
          hint="Marque quando a fonte é um ato formal (decreto, portaria, veto, etc.) em sentido contrário ao compromisso."
          checked={isFormalAct}
          onChange={(e) => setIsFormalAct(e.target.checked)}
        />
        <Button type="submit" loading={loading}>
          Registrar situação
        </Button>
      </form>

      <h3 style={{ marginTop: 24 }}>Histórico de situação</h3>
      {detail.statusHistory.length === 0 ? (
        <p>Nenhum registro ainda.</p>
      ) : (
        <ol style={{ paddingLeft: 20 }}>
          {detail.statusHistory.map((entry) => (
            <li key={`${entry.recordedAtUtc}-${entry.status.value}`} style={{ marginBottom: 12 }}>
              <StatusBadge status={entry.status} /> em {formatDate(entry.referenceDate)}
              {entry.isFormalAct && ' (ato formal)'}
              <br />
              <small>
                Registrado por {entry.author} em {formatDateTime(entry.recordedAtUtc)}
                {entry.sourceUrl && (
                  <>
                    {' · '}
                    <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">
                      fonte
                    </a>
                  </>
                )}
              </small>
              {entry.note && <p style={{ margin: '4px 0 0' }}>{entry.note}</p>}
            </li>
          ))}
        </ol>
      )}
    </Panel>
  );
}
