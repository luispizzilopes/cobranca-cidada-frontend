import { Megaphone, ThumbsDown, ThumbsUp } from 'lucide-react';
import styled from 'styled-components';
import { useVote } from '../../hooks/useVote';
import type { MyVote, VoteState, VoteSummary } from '../../services/types';
import { formatNumber } from '../../utils/numbers';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
`;

const Group = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Toggle = styled.button<{ $on: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 40px;
  padding: 0 8px 0 16px;
  border: 1px solid var(--primary);
  border-radius: 100em;
  background: ${({ $on }) => ($on ? 'var(--primary)' : 'transparent')};
  color: ${({ $on }) => ($on ? 'var(--on-primary)' : 'var(--primary)')};
  font-weight: 600;

  &:hover:not(:disabled) {
    background: ${({ $on }) => ($on ? 'var(--primary-hover)' : 'var(--hover)')};
  }
  &:disabled {
    opacity: 0.6;
    cursor: progress;
  }
`;

/** Contagem pública dentro do botão: o número fica junto da ação a que se refere. */
const Count = styled.span<{ $on: boolean }>`
  display: inline-grid;
  place-items: center;
  min-width: 26px;
  height: 26px;
  padding: 0 8px;
  border-radius: 100em;
  background: ${({ $on }) => ($on ? 'rgb(255 255 255 / 0.22)' : 'var(--hover)')};
  font-size: 0.857rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

interface VoteBarProps {
  commitmentId: string;
  myVote: MyVote | null;
  votes: VoteSummary;
  onChange: (state: VoteState) => void;
}

/** "Cobrar" e "Boa/Má proposta": opiniões. Não alteram a situação de execução. */
export function VoteBar({ commitmentId, myVote, votes, onChange }: VoteBarProps) {
  const { pending, toggleCharge, toggleRating } = useVote(commitmentId, myVote, onChange);
  const charges = votes.charges ?? 0;
  const good = votes.good ?? 0;
  const bad = votes.bad ?? 0;

  return (
    <Wrapper>
      <Group role="group" aria-label="Sua opinião sobre este compromisso" aria-busy={pending}>
        <Toggle
          type="button"
          $on={!!myVote?.charge}
          aria-pressed={!!myVote?.charge}
          disabled={pending}
          onClick={() => void toggleCharge()}
        >
          <Megaphone size={16} aria-hidden="true" />
          Cobrar
          <Count $on={!!myVote?.charge} aria-hidden="true">
            {formatNumber(charges)}
          </Count>
        </Toggle>
        <Toggle
          type="button"
          $on={myVote?.rating === 'boa'}
          aria-pressed={myVote?.rating === 'boa'}
          disabled={pending}
          onClick={() => void toggleRating('boa')}
        >
          <ThumbsUp size={16} aria-hidden="true" />
          Boa proposta
          <Count $on={myVote?.rating === 'boa'} aria-hidden="true">
            {formatNumber(good)}
          </Count>
        </Toggle>
        <Toggle
          type="button"
          $on={myVote?.rating === 'ma'}
          aria-pressed={myVote?.rating === 'ma'}
          disabled={pending}
          onClick={() => void toggleRating('ma')}
        >
          <ThumbsDown size={16} aria-hidden="true" />
          Má proposta
          <Count $on={myVote?.rating === 'ma'} aria-hidden="true">
            {formatNumber(bad)}
          </Count>
        </Toggle>
      </Group>
      <p className="sr-only">
        Contagens públicas: {formatNumber(charges)} cobranças, {formatNumber(good)} avaliações boas,{' '}
        {formatNumber(bad)} avaliações más.
      </p>
    </Wrapper>
  );
}
