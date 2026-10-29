import { useCallback, useEffect, useRef, useState } from 'react';
import { isCancel } from 'axios';
import { commitmentService, type CommitmentQuery } from '../services/commitment/commitmentService';
import type { CommitmentSummary, PaginedResult, VoteState } from '../services/types';
import { extractApiError } from '../utils/apiError';
import { useSession } from '../contexts/SessionContext';

export function useCommitments(query: CommitmentQuery, enabled = true) {
  const { kind } = useSession();
  const [data, setData] = useState<PaginedResult<CommitmentSummary> | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);
  const queryKey = JSON.stringify(query);
  const queryRef = useRef(query);
  queryRef.current = query;

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    commitmentService
      .list(queryRef.current, controller.signal)
      .then(setData)
      .catch((err) => {
        if (isCancel(err)) return;
        setError(extractApiError(err));
        setData(null);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [queryKey, enabled, kind, reloadToken]);

  /** Aplica o resultado de um voto ao item da lista, sem refazer a consulta. */
  const applyVote = useCallback((state: VoteState) => {
    setData((current) =>
      current
        ? {
            ...current,
            items: current.items.map((item) =>
              item.id === state.commitmentId
                ? { ...item, myVote: state.myVote, votes: state.votes }
                : item,
            ),
          }
        : current,
    );
  }, []);

  return { data, loading, error, applyVote, reload: () => setReloadToken((n) => n + 1) };
}
