import { Megaphone, ThumbsDown, ThumbsUp } from 'lucide-react';
import type { VoteSummary } from '../../services/types';
import { formatNumber } from '../../utils/numbers';
import { Highlight, Rating, Row } from './VoteCounts.styles';

/** Resumo compacto para listas: cobranças em destaque e avaliações discretas. Números vêm da API. */
export function VoteCounts({ votes }: { votes: VoteSummary }) {
  const charges = votes.charges ?? 0;
  const good = votes.good ?? 0;
  const bad = votes.bad ?? 0;
  return (
    <Row>
      <Highlight>
        <Megaphone size={16} aria-hidden="true" />
        <span>
          <strong>{formatNumber(charges)}</strong> {charges === 1 ? 'cobrança' : 'cobranças'}
        </span>
      </Highlight>
      <Rating $tone="success">
        <ThumbsUp size={14} aria-hidden="true" />
        <span>
          <strong>{formatNumber(good)}</strong> {good === 1 ? 'boa' : 'boas'}
        </span>
      </Rating>
      <Rating $tone="danger">
        <ThumbsDown size={14} aria-hidden="true" />
        <span>
          <strong>{formatNumber(bad)}</strong> {bad === 1 ? 'má' : 'más'}
        </span>
      </Rating>
    </Row>
  );
}
