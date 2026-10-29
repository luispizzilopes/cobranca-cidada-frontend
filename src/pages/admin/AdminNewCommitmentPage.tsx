import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Button,
  Checkbox,
  FormError,
  Input,
  Loading,
  useToast,
} from '../../components/common';
import { Page, Panel, SectionTitle } from '../../components/layout/Page/Page';
import { useCatalog } from '../../hooks/useCatalog';
import { usePageTitle } from '../../hooks/usePageTitle';
import { adminService } from '../../services/admin/adminService';
import { extractApiError } from '../../utils/apiError';
import { AdminNav } from './AdminNav';
import { CommitmentFields } from './CommitmentFields';
import {
  emptyFormState,
  toCreatePayload,
  validateForm,
  type CommitmentFormState,
  type FormErrors,
} from './commitmentForm';

export function AdminNewCommitmentPage() {
  usePageTitle('Administração — novo compromisso');
  const { catalog, error: catalogError } = useCatalog();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState<CommitmentFormState | null>(null);
  const [slug, setSlug] = useState('');
  const [publish, setPublish] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const current =
    form ??
    (catalog ? emptyFormState(catalog.areas[0]?.code ?? '', catalog.origins[0]?.code ?? '') : null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!current) return;
    const found = validateForm(current, null);
    setErrors(found);
    setError(null);
    if (Object.keys(found).length > 0) return;

    setLoading(true);
    try {
      const created = await adminService.create(toCreatePayload(current, slug, publish));
      toast.success(
        publish
          ? `Compromisso ${created.id} criado e publicado.`
          : `Compromisso ${created.id} criado. Ele só aparece no site depois de publicado.`,
      );
      navigate(`/admin/compromissos/${encodeURIComponent(created.id)}`);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Page
      crumbs={[
        { label: 'Compromissos', to: '/' },
        { label: 'Administração', to: '/admin' },
        { label: 'Novo compromisso' },
      ]}
      title="Novo compromisso"
    >
      <AdminNav />
      <FormError message={catalogError ? 'Não foi possível carregar áreas e origens.' : null} />
      {!current && !catalogError && <Loading />}
      {current && catalog && (
        <Panel
          as="section"
          aria-labelledby="secao-novo"
          style={{ maxWidth: 920, marginBottom: 48 }}
        >
          <SectionTitle id="secao-novo">Conteúdo</SectionTitle>
          <Alert tone="info">
            <p>
              Toda afirmação sobre promessa precisa de fonte com URL. A situação nasce como “Não
              avaliado”; registre a situação depois, na tela do compromisso.
            </p>
          </Alert>
          <form onSubmit={submit} noValidate>
            <FormError message={error} />
            <Input
              id="novo-id"
              label="Identificador público (opcional)"
              hint="Ex.: ECON-050. Só letras, números e hífens. Vazio gera o próximo da área escolhida."
              maxLength={120}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <CommitmentFields
              form={current}
              setForm={(update) => setForm(update(current))}
              catalog={catalog}
              errors={errors}
            />
            <Checkbox
              id="novo-publicar"
              label="Publicar agora"
              hint="Desmarcado, o compromisso fica só no painel até você publicar."
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
            />
            <Button type="submit" loading={loading}>
              Criar compromisso
            </Button>
          </form>
        </Panel>
      )}
    </Page>
  );
}
