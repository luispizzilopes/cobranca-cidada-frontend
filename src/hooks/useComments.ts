import { useCallback, useEffect, useState } from 'react';
import { isCancel } from 'axios';
import { commentService } from '../services/comment/commentService';
import type { CommitmentComment } from '../services/types';
import { extractApiError } from '../utils/apiError';
import { useSession } from '../contexts/SessionContext';

const PAGE_SIZE = 10;

/** Comentários de um compromisso, do mais recente ao mais antigo, com "carregar mais". */
export function useComments(commitmentId: string | undefined) {
  const { kind } = useSession();
  const [comments, setComments] = useState<CommitmentComment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!commitmentId) return;
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    commentService
      .list(commitmentId, 1, PAGE_SIZE, controller.signal)
      .then((result) => {
        setComments(result.items);
        setTotal(result.totalCount);
        setPage(1);
      })
      .catch((err) => {
        if (isCancel(err)) return;
        setError(extractApiError(err));
        setComments([]);
        setTotal(0);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [commitmentId, kind, reloadKey]);

  const loadMore = useCallback(async () => {
    if (!commitmentId) return;
    setLoading(true);
    try {
      const result = await commentService.list(commitmentId, page + 1, PAGE_SIZE);
      setComments((current) => [
        ...current,
        ...result.items.filter((item) => !current.some((c) => c.id === item.id)),
      ]);
      setTotal(result.totalCount);
      setPage(page + 1);
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }, [commitmentId, page]);

  const reload = useCallback(() => setReloadKey((key) => key + 1), []);

  return { comments, total, loading, error, hasMore: comments.length < total, loadMore, reload };
}
