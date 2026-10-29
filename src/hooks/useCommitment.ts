import { useCallback, useEffect, useState } from 'react';
import { isAxiosError, isCancel } from 'axios';
import { commitmentService } from '../services/commitment/commitmentService';
import type { CommitmentDetail, VoteState } from '../services/types';
import { extractApiError } from '../utils/apiError';
import { useSession } from '../contexts/SessionContext';

export function useCommitment(id: string | undefined) {
  const { kind } = useSession();
  const [commitment, setCommitment] = useState<CommitmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    setNotFound(false);
    commitmentService
      .get(id, controller.signal)
      .then(setCommitment)
      .catch((err) => {
        if (isCancel(err)) return;
        if (isAxiosError(err) && err.response?.status === 404) setNotFound(true);
        else setError(extractApiError(err));
        setCommitment(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [id, kind]);

  const applyVote = useCallback((state: VoteState) => {
    setCommitment((current) =>
      current ? { ...current, myVote: state.myVote, votes: state.votes } : current,
    );
  }, []);

  return { commitment, loading, error, notFound, applyVote };
}
