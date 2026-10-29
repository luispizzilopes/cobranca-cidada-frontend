import { Megaphone, ThumbsDown, ThumbsUp } from 'lucide-react';
import styled from 'styled-components';
import type { VoteSummary } from '../../services/types';
import { formatNumber } from '../../utils/numbers';

const Row = styled.p`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 16px;
  margin: 0;
  font-size: 0.929rem;
  color: var(--muted);
`;

const Highlight = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--primary);
  font-weight: 600;

  strong {
    font-size: 1.143rem;
    font-weight: 700;
  }
`;

const Rating = styled.span<{ $tone: 'success' | 'danger' }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;

  svg {
    color: var(--${({ $tone }) => $tone});
  }
  strong {
    color: var(--text);
    font-weight: 600;
  }
`;

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
