import { useRef, useState } from 'react';
import { useToast } from '../components/common';
import { useVerifyEmail } from '../contexts/VerifyEmailContext';
import { votingService } from '../services/voting/votingService';
import type { MyVote, Rating, VoteState } from '../services/types';
import { extractApiError, retryAfterSeconds } from '../utils/apiError';

/** Votar, trocar e desfazer. Antes de gravar, garante que a pessoa tem conta ou e-mail verificado. */
export function useVote(
  commitmentId: string,
  myVote: MyVote | null,
  onChange: (state: VoteState) => void,
) {
  const toast = useToast();
  const { ensureCanVote } = useVerifyEmail();
  const [pending, setPending] = useState(false);
  const latest = useRef(myVote);
  latest.current = myVote;

  async function apply(update: (current: MyVote) => MyVote) {
    if (pending) return;
    if (!(await ensureCanVote())) return;

    setPending(true);
    try {
      const next = update(latest.current ?? { rating: null, charge: false });
      onChange(await votingService.setVote(commitmentId, next));
    } catch (err) {
      const wait = retryAfterSeconds(err);
      toast.error(
        wait ? `${extractApiError(err)} Tente de novo em ${wait} s.` : extractApiError(err),
      );
    } finally {
      setPending(false);
    }
  }

  return {
    pending,
    toggleCharge: () => apply((current) => ({ ...current, charge: !current.charge })),
    /** Clicar na avaliação já marcada a remove. */
    toggleRating: (rating: Exclude<Rating, null>) =>
      apply((current) => ({ ...current, rating: current.rating === rating ? null : rating })),
  };
}
