import { useEffect, useState, type FormEvent } from 'react';
import { Button, FormError, Textarea, useToast } from '../../components/common';
import { Panel, SectionTitle } from '../../components/layout/Page/Page.styles';
import { adminService } from '../../services/admin/adminService';
import type { AdminCommitmentDetail, Catalog } from '../../services/types';
import { extractApiError } from '../../utils/apiError';
import { CommitmentFields } from './CommitmentFields';
import {
  isDirty,
  toFormState,
  toPayload,
  validateForm,
  type CommitmentFormState,
  type FormErrors,
} from './commitmentForm';

interface Props {
  detail: AdminCommitmentDetail;
  catalog: Catalog;
  onSaved: (detail: AdminCommitmentDetail) => void;
}

export function CommitmentEditForm({ detail, catalog, onSaved }: Props) {
  const toast = useToast();
  const [form, setForm] = useState<CommitmentFormState>(() => toFormState(detail));
  const [reason, setReason] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm(toFormState(detail));
    setReason('');
    setErrors({});
  }, [detail]);

  const dirty = isDirty(form, detail);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const found = validateForm(form, reason);
    setErrors(found);
    setError(null);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      const updated = await adminService.update(detail.id, toPayload(form, detail.version, reason));
      onSaved(updated);
      toast.success('Compromisso atualizado. A versão anterior ficou guardada nas revisões.');
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Panel as="section" aria-labelledby="secao-conteudo">
      <SectionTitle id="secao-conteudo">Conteúdo</SectionTitle>
      <form onSubmit={submit} noValidate>
        <FormError message={error} />

        <CommitmentFields form={form} setForm={setForm} catalog={catalog} errors={errors} />

        <Textarea
          id="ed-motivo"
          label="Motivo da edição"
          hint="Obrigatório. Fica no histórico de revisões, junto com a versão anterior."
          rows={2}
          maxLength={500}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          error={errors.reason}
        />
        <Button type="submit" loading={loading} disabled={!dirty}>
          Salvar alterações
        </Button>
        {!dirty && <small style={{ marginLeft: 12 }}>Nada alterado.</small>}
      </form>
    </Panel>
  );
}
