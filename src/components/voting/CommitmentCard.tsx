import { CalendarClock, FileText, Newspaper, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Badge, StatusBadge } from '../common';
import { VoteBar } from './VoteBar';
import type { CommitmentSummary, VoteState } from '../../services/types';
import { cleanDeadlineText } from '../../utils/deadlines';

const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
`;

const Meta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
`;

const Code = styled.span`
  color: var(--muted);
  font-size: 0.857rem;
  font-weight: 600;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.286rem;

  a {
    color: var(--text);
    text-decoration: none;
  }
  a:hover {
    color: var(--primary);
    text-decoration: underline;
  }
`;

const Description = styled.p`
  margin: 0;
  color: var(--text);
`;

const Facts = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin: 0;
  padding: 0;
  list-style: none;
  color: var(--muted);
  font-size: 0.929rem;

  li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
`;

const Footer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px 24px;
  padding-top: 16px;
  border-top: 1px solid var(--border);
`;

const DetailLink = styled(Link)`
  font-weight: 600;
`;

/** Origem fora do plano oficial (campanha ou imprensa) é sinalizada, para não se misturar com o texto do plano. */
export function isOutsideOfficialPlan(originCode: string): boolean {
  return originCode !== 'plano-de-governo';
}

interface Props {
  commitment: CommitmentSummary;
  onVoteChange: (state: VoteState) => void;
}

export function CommitmentCard({ commitment, onVoteChange }: Props) {
  const c = commitment;
  return (
    <Card aria-labelledby={`titulo-${c.id}`}>
      <Meta>
        <Code>{c.id}</Code>
        <Badge>{c.area.name}</Badge>
        <Badge tone={isOutsideOfficialPlan(c.origin.code) ? 'orange' : 'info'}>
          {c.origin.name}
        </Badge>
        <StatusBadge status={c.status} />
      </Meta>
      <Title id={`titulo-${c.id}`}>
        <Link to={`/compromissos/${encodeURIComponent(c.id)}`}>{c.title}</Link>
      </Title>
      {c.shortDescription && <Description>{c.shortDescription}</Description>}
      <Facts>
        {c.deadlineText && (
          <li>
            <CalendarClock size={16} aria-hidden="true" />
            <span>
              <span className="sr-only">Prazo: </span>
              {cleanDeadlineText(c.deadlineText)}
            </span>
          </li>
        )}
        {c.goalOrCondition && (
          <li>
            <Target size={16} aria-hidden="true" />
            <span>
              <span className="sr-only">Meta ou condição: </span>
              {c.goalOrCondition}
            </span>
          </li>
        )}
        <li>
          {c.planPage ? (
            <FileText size={16} aria-hidden="true" />
          ) : (
            <Newspaper size={16} aria-hidden="true" />
          )}
          <span>
            {c.planPage ? `Plano de governo, p. ${c.planPage}` : 'Não consta do texto do plano'}
          </span>
        </li>
      </Facts>
      <Footer>
        <VoteBar commitmentId={c.id} myVote={c.myVote} votes={c.votes} onChange={onVoteChange} />
        <DetailLink to={`/compromissos/${encodeURIComponent(c.id)}`}>
          Ver fontes e detalhes<span className="sr-only"> de {c.title}</span>
        </DetailLink>
      </Footer>
    </Card>
  );
}
