import { useCallback, useEffect, useState } from 'react';
import { votingService } from '../services/voting/votingService';
import type { MyVoteItem } from '../services/types';
import { extractApiError } from '../utils/apiError';

export function useMyVotes(enabled: boolean) {
  const [votes, setVotes] = useState<MyVoteItem[]>([]);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setVotes(await votingService.myVotes());
    } catch (err) {
      setError(extractApiError(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (enabled) void load();
  }, [enabled, load]);

  return { votes, loading, error, reload: load };
}
