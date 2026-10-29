import { useEffect, useState } from 'react';
import { isAxiosError, isCancel } from 'axios';
import { ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import {
  Alert,
  Badge,
  Button,
  FormError,
  Loading,
  Modal,
  StatusBadge,
  useToast,
} from '../../components/common';
import { Container, Breadcrumb, Panel, SectionTitle } from '../../components/layout/Page/Page';
import { useCatalog } from '../../hooks/useCatalog';
import { usePageTitle } from '../../hooks/usePageTitle';
import { adminService } from '../../services/admin/adminService';
import type { AdminCommitmentDetail } from '../../services/types';
import { extractApiError } from '../../utils/apiError';
import { formatDateTime } from '../../utils/dates';
import { AdminNav } from './AdminNav';
import { CommitmentEditForm } from './CommitmentEditForm';
import { StatusSection } from './StatusSection';

const Title = styled.h1`
  margin: 8px 0 12px;
  font-size: 1.857rem;
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  align-items: center;
  margin-bottom: 20px;
`;

const Stack = styled.div`
  display: grid;
  gap: 24px;
  max-width: 920px;
  padding-bottom: 48px;
`;

export function AdminCommitmentPage() {
  const { id } = useParams();
  const toast = useToast();
  const { catalog } = useCatalog();
  const [detail, setDetail] = useState<AdminCommitmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmUnpublish, setConfirmUnpublish] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  usePageTitle(detail ? `Administração — ${detail.id}` : 'Administração');

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setNotFound(false);
    adminService
      .get(id, controller.signal)
      .then(setDetail)
      .catch((err) => {
        if (isCancel(err)) return;
        if (isAxiosError(err) && err.response?.status === 404) setNotFound(true);
        else setError(extractApiError(err));
        setDetail(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id]);

  async function setPublication(published: boolean) {
    if (!detail) return;
    setPublishing(true);
    setPublishError(null);
    try {
      setDetail(await adminService.setPublication(detail.id, published));
      setConfirmUnpublish(false);
      toast.success(published ? 'Compromisso publicado.' : 'Compromisso despublicado.');
    } catch (err) {
      setPublishError(extractApiError(err));
    } finally {
      setPublishing(false);
    }
  }

  const crumbs = [
    { label: 'Compromissos', to: '/' },
    { label: 'Administração', to: '/admin' },
    { label: detail?.id ?? id ?? '' },
  ];

  return (
    <Container>
      <Breadcrumb items={crumbs} />
      <AdminNav />
      {loading && <Loading />}
      {notFound && (
        <Alert tone="warning" title="Compromisso não encontrado">
          <p>
            <Link to="/admin">Voltar à lista</Link>
          </p>
        </Alert>
      )}
      {error && (
        <Alert tone="danger" role="alert">
          {error}
        </Alert>
      )}

      {detail && catalog && (
        <>
          <Title>
            {detail.id} — {detail.title}
          </Title>
          <Meta>
            <StatusBadge status={detail.status} />
            {detail.isPublished ? (
              <Badge tone="info">Publicado</Badge>
            ) : (
              <Badge tone="orange">Despublicado</Badge>
            )}
            <span>Versão {detail.version}</span>
            <span>Atualizado em {formatDateTime(detail.updatedAtUtc)}</span>
            {detail.isPublished && (
              <Link to={`/compromissos/${encodeURIComponent(detail.id)}`}>
                Ver no site <ExternalLink size={14} aria-hidden="true" />
              </Link>
            )}
          </Meta>

          <Stack>
            <CommitmentEditForm detail={detail} catalog={catalog} onSaved={setDetail} />

            <StatusSection detail={detail} statuses={catalog.statuses} onChange={setDetail} />

            <Panel as="section" aria-labelledby="secao-publicacao">
              <SectionTitle id="secao-publicacao">Publicação</SectionTitle>
              <FormError message={publishError} />
              {detail.isPublished ? (
                <>
                  <p>
                    Publicado
                    {detail.publishedAtUtc && <> em {formatDateTime(detail.publishedAtUtc)}</>}. Ao
                    despublicar, o compromisso some do site e da API pública, mas os votos e o
                    histórico continuam guardados.
                  </p>
                  <Button variant="danger" onClick={() => setConfirmUnpublish(true)}>
                    Despublicar
                  </Button>
                </>
              ) : (
                <>
                  <p>Este compromisso não aparece para o público.</p>
                  <Button loading={publishing} onClick={() => void setPublication(true)}>
                    Publicar
                  </Button>
                </>
              )}
            </Panel>

            <Panel as="section" aria-labelledby="secao-revisoes">
              <SectionTitle id="secao-revisoes">Revisões do conteúdo</SectionTitle>
              {detail.revisions.length === 0 ? (
                <p>O conteúdo ainda não foi editado depois da carga inicial.</p>
              ) : (
                <ol style={{ paddingLeft: 20 }}>
                  {detail.revisions.map((revision) => (
                    <li key={revision.version} style={{ marginBottom: 8 }}>
                      <strong>Versão {revision.version}</strong> substituída por {revision.author}{' '}
                      em {formatDateTime(revision.createdAtUtc)}
                      <br />
                      <small>Motivo: {revision.reason}</small>
                    </li>
                  ))}
                </ol>
              )}
            </Panel>
          </Stack>

          {confirmUnpublish && (
            <Modal title="Despublicar compromisso" onClose={() => setConfirmUnpublish(false)}>
              <Alert tone="warning">
                <p>O compromisso deixa de aparecer no site até ser publicado de novo.</p>
              </Alert>
              <FormError message={publishError} />
              <Button
                variant="danger"
                loading={publishing}
                onClick={() => void setPublication(false)}
              >
                Despublicar
              </Button>{' '}
              <Button variant="ghost" onClick={() => setConfirmUnpublish(false)}>
                Cancelar
              </Button>
            </Modal>
          )}
        </>
      )}
    </Container>
  );
}
