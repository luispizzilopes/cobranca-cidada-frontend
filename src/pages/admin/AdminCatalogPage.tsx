import { useEffect, useState, type FormEvent } from 'react';
import { Alert, Button, FormError, Input, Loading, useToast } from '../../components/common';
import { Page } from '../../components/layout/Page/Page';
import { Panel, SectionTitle } from '../../components/layout/Page/Page.styles';
import { invalidateCatalog } from '../../hooks/useCatalog';
import { usePageTitle } from '../../hooks/usePageTitle';
import { adminService } from '../../services/admin/adminService';
import { catalogService } from '../../services/catalog/catalogService';
import type { Catalog, Lookup } from '../../services/types';
import { extractApiError } from '../../utils/apiError';
import { AdminNav } from './AdminNav';
import { Form, Grid } from './AdminCatalogPage.styles';

interface RowProps {
  item: Lookup;
  kind: 'area' | 'origem';
  onRenamed: (item: Lookup) => void;
}
function RenameRow({ item, kind, onRenamed }: RowProps) {
  const toast = useToast();
  const [name, setName] = useState(item.name);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      setError('O nome é obrigatório.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const renamed =
        kind === 'area'
          ? await adminService.renameArea(item.code, name.trim())
          : await adminService.renameOrigin(item.code, name.trim());
      invalidateCatalog();
      setName(renamed.name);
      onRenamed(renamed);
      toast.success('Nome atualizado.');
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form onSubmit={submit} noValidate>
      <Input
        id={`${kind}-${item.code}`}
        label={`Código: ${item.code}`}
        maxLength={200}
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={error ?? undefined}
      />
      <Button type="submit" size="sm" loading={loading} disabled={name.trim() === item.name}>
        Salvar
      </Button>
    </Form>
  );
}
export function AdminCatalogPage() {
  usePageTitle('Administração — áreas e origens');
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    catalogService.get().then(setCatalog, (err) => setError(extractApiError(err)));
  }, []);

  function replace(kind: 'areas' | 'origins', renamed: Lookup) {
    setCatalog((current) =>
      current
        ? {
            ...current,
            [kind]: current[kind].map((item) => (item.code === renamed.code ? renamed : item)),
          }
        : current,
    );
  }

  return (
    <Page
      crumbs={[
        { label: 'Compromissos', to: '/' },
        { label: 'Administração', to: '/admin' },
        { label: 'Áreas e origens' },
      ]}
      title="Áreas e origens"
    >
      <AdminNav />
      <FormError message={error} />
      {!catalog && !error && <Loading />}
      {catalog && (
        <Grid>
          <Alert tone="info">
            <p>
              O código identifica a área ou a origem e não muda; só o nome exibido pode ser
              corrigido. A alteração vale para todos os compromissos ligados a ela.
            </p>
          </Alert>
          <Panel as="section" aria-labelledby="catalogo-areas">
            <SectionTitle id="catalogo-areas">Áreas</SectionTitle>
            {catalog.areas.map((area) => (
              <RenameRow
                key={area.code}
                item={area}
                kind="area"
                onRenamed={(r) => replace('areas', r)}
              />
            ))}
          </Panel>
          <Panel as="section" aria-labelledby="catalogo-origens">
            <SectionTitle id="catalogo-origens">Origens</SectionTitle>
            {catalog.origins.map((origin) => (
              <RenameRow
                key={origin.code}
                item={origin}
                kind="origem"
                onRenamed={(r) => replace('origins', r)}
              />
            ))}
          </Panel>
        </Grid>
      )}
    </Page>
  );
}
