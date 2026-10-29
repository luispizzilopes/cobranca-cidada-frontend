import { ExternalLink, FileText, Newspaper } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Alert, Badge, LinkButton, Loading, StatusBadge } from '../../components/common';
import { Breadcrumb } from '../../components/layout/Page/Page';
import { Container, Panel, Section, SectionTitle } from '../../components/layout/Page/Page.styles';
import { CommitmentCardOriginNotice } from './OriginNotice';
import { VoteBar } from '../../components/voting/VoteBar';
import { CommentsSection } from '../../components/comments/CommentsSection';
import { ShareBanner } from '../../components/sharing/ShareBanner/ShareBanner';
import { pickBannerDescription } from '../../utils/banner';
import { SHARE_BANNER_MIN_CHARGES } from '../../data/site';
import { useCommitment } from '../../hooks/useCommitment';
import { usePageTitle } from '../../hooks/usePageTitle';
import { commitmentDescription, commitmentTitle } from '../../seo/pages';
import { formatDate, formatDateTime } from '../../utils/dates';
import { cleanDeadlineText } from '../../utils/deadlines';
import { isOutsideOfficialPlan } from '../../components/voting/CommitmentCard';
import {
  Columns,
  Description,
  Facts,
  KindLabel,
  Meta,
  Sources,
  Timeline,
  Title,
} from './CommitmentPage.styles';

export function CommitmentPage() {
  const { id } = useParams();
  const { commitment, loading, error, notFound, applyVote } = useCommitment(id);
  const { hash } = useLocation();
  const loaded = commitment !== null;

  useEffect(() => {
    if (!loaded || !hash) return;
    document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [loaded, hash]);
  usePageTitle(
    commitment
      ? commitmentTitle(commitment)
      : notFound
        ? 'Compromisso não encontrado'
        : 'Compromisso',
    commitment ? { description: commitmentDescription(commitment) } : { noindex: notFound },
  );

  if (loading && !commitment) {
    return (
      <Container>
        <Loading />
      </Container>
    );
  }

  if (notFound || !commitment) {
    return (
      <Container>
        <Breadcrumb items={[{ label: 'Compromissos', to: '/' }, { label: 'Não encontrado' }]} />
        <Title>
          {notFound ? 'Compromisso não encontrado' : 'Não foi possível carregar o compromisso'}
        </Title>
        {error && (
          <Alert tone="danger" role="alert">
            {error}
          </Alert>
        )}
        <p>Confira o endereço ou volte à lista de compromissos.</p>
        <LinkButton to="/">Ver todos os compromissos</LinkButton>
      </Container>
    );
  }

  const c = commitment;
  const outside = isOutsideOfficialPlan(c.origin.code);

  return (
    <Container>
      <Breadcrumb items={[{ label: 'Compromissos', to: '/' }, { label: c.id }]} />
      <Meta>
        <Badge>{c.area.name}</Badge>
        <Badge tone={outside ? 'orange' : 'info'}>{c.origin.name}</Badge>
        <StatusBadge status={c.status} />
        {c.statusDate && <span>Situação em {formatDate(c.statusDate)}</span>}
      </Meta>
      <Title>{c.title}</Title>

      {outside && <CommitmentCardOriginNotice originName={c.origin.name} />}

      <Columns>
        <div>
          <Section aria-labelledby="sobre">
            <SectionTitle id="sobre">O que foi prometido</SectionTitle>
            <Description>{c.description}</Description>
          </Section>

          {c.howItWillBeDone && (
            <Section aria-labelledby="como">
              <SectionTitle id="como">Como o plano prevê fazer</SectionTitle>
              <Description>{c.howItWillBeDone}</Description>
            </Section>
          )}

          <Section aria-labelledby="fontes">
            <SectionTitle id="fontes">Fontes</SectionTitle>
            <Sources>
              {c.sources.map((source) => (
                <li key={source.url}>
                  <KindLabel>
                    {source.kind === 'primary' ? 'Fonte primária / oficial' : 'Imprensa'}
                  </KindLabel>
                  <a href={source.url} target="_blank" rel="noopener noreferrer">
                    {source.name}
                    <ExternalLink size={14} aria-hidden="true" />
                    <span className="sr-only"> (abre em nova aba)</span>
                  </a>
                  {source.page && <div>Página {source.page}</div>}
                </li>
              ))}
            </Sources>
          </Section>

          <Section aria-labelledby="historico">
            <SectionTitle id="historico">Histórico da situação de execução</SectionTitle>
            {c.statusHistory.length === 0 ? (
              <p>Nenhuma mudança de situação registrada.</p>
            ) : (
              <Timeline>
                {c.statusHistory.map((entry) => (
                  <li key={`${entry.referenceDate}-${entry.recordedAtUtc}`}>
                    <StatusBadge status={entry.status} />{' '}
                    <strong>{formatDate(entry.referenceDate)}</strong>
                    {entry.note && <p style={{ margin: '4px 0 0' }}>{entry.note}</p>}
                    {entry.sourceUrl && (
                      <a href={entry.sourceUrl} target="_blank" rel="noopener noreferrer">
                        Fonte do registro<span className="sr-only"> (abre em nova aba)</span>
                      </a>
                    )}
                  </li>
                ))}
              </Timeline>
            )}
          </Section>

          <CommentsSection commitmentId={c.id} />
        </div>

        <aside>
          <Panel style={{ marginBottom: 16 }}>
            <SectionTitle as="h2">Sua opinião</SectionTitle>
            <VoteBar commitmentId={c.id} myVote={c.myVote} votes={c.votes} onChange={applyVote} />
            <p style={{ margin: '12px 0 0', color: 'var(--muted)', fontSize: '0.857rem' }}>
              Opinião de pessoas com e-mail verificado. Não é pesquisa estatística e não muda a
              situação de execução.
            </p>
          </Panel>

          {c.status.value !== 'Fulfilled' &&
            !c.votes.chargesHidden &&
            (c.votes.charges ?? 0) >= SHARE_BANNER_MIN_CHARGES && (
              <ShareBanner
                charges={c.votes.charges ?? 0}
                title={c.title}
                commitmentId={c.id}
                description={pickBannerDescription(c.title, c.shortDescription, c.description)}
                plan={outside ? undefined : { page: c.planPage }}
              />
            )}

          <Panel>
            <SectionTitle as="h2">Dados do compromisso</SectionTitle>
            <Facts>
              {c.deadlineText && (
                <>
                  <dt>Prazo</dt>
                  <dd>{cleanDeadlineText(c.deadlineText)}</dd>
                </>
              )}
              {c.goalOrCondition && (
                <>
                  <dt>Meta ou condição</dt>
                  <dd>{c.goalOrCondition}</dd>
                </>
              )}
              <dt>No plano</dt>
              <dd>
                {c.planPage ? (
                  <>
                    <FileText size={14} aria-hidden="true" /> página {c.planPage}
                  </>
                ) : (
                  <>
                    <Newspaper size={14} aria-hidden="true" /> não consta do texto do plano
                  </>
                )}
              </dd>
              {c.classification.length > 0 && (
                <>
                  <dt>Tipo</dt>
                  <dd>{c.classification.join(', ')}</dd>
                </>
              )}
              {c.evidence.length > 0 && (
                <>
                  <dt>Evidência</dt>
                  <dd>{c.evidence.join(', ')}</dd>
                </>
              )}
              {c.date && (
                <>
                  <dt>{c.dateKind ? c.dateKind[0].toUpperCase() + c.dateKind.slice(1) : 'Data'}</dt>
                  <dd>{formatDate(c.date)}</dd>
                </>
              )}
              <dt>Identificador</dt>
              <dd>{c.externalId ?? c.id}</dd>
              <dt>Atualizado</dt>
              <dd>
                {formatDateTime(c.updatedAtUtc)} (versão {c.version})
              </dd>
            </Facts>
          </Panel>
          <p style={{ marginTop: 16 }}>
            <Link to="/metodologia">Como a situação de execução é definida</Link>
          </p>
        </aside>
      </Columns>
    </Container>
  );
}
