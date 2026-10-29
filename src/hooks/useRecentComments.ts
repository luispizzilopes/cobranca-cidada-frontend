import { useEffect, useState } from 'react';
import { isCancel } from 'axios';
import { commentService } from '../services/comment/commentService';
import type { RecentComment } from '../services/types';
import { extractApiError } from '../utils/apiError';

/** Comentários em destaque (o mais recente de cada compromisso), para a tela inicial. */
export function useRecentComments(limit: number) {
  const [comments, setComments] = useState<RecentComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    commentService
      .listRecent(limit, controller.signal)
      .then(setComments)
      .catch((err) => {
        if (isCancel(err)) return;
        setError(extractApiError(err));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [limit]);

  return { comments, loading, error };
}
