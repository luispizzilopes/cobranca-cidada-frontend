import { CalendarClock, FileText, Newspaper, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge, StatusBadge } from '../common';
import { VoteBar } from './VoteBar';
import type { CommitmentSummary, VoteState } from '../../services/types';
import { cleanDeadlineText } from '../../utils/deadlines';
import {
  Card,
  Code,
  Description,
  DetailLink,
  Facts,
  Footer,
  Meta,
  Title,
} from './CommitmentCard.styles';

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
    <Card aria-labelledby={`titulo-${c.id}`} data-tour="cartao">
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
        <DetailLink data-tour="detalhes" to={`/compromissos/${encodeURIComponent(c.id)}`}>
          Ver fontes e detalhes<span className="sr-only"> de {c.title}</span>
        </DetailLink>
      </Footer>
    </Card>
  );
}
