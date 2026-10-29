import api from '../api/api';
import { API_PREFIX } from '../../data/domains';
import type { CommitmentComment, PaginedResult, RecentComment } from '../types';

const commitmentUrl = (commitmentId: string) =>
  `${API_PREFIX}/commitments/${encodeURIComponent(commitmentId)}/comments`;

export const commentService = {
  async list(
    commitmentId: string,
    pageNumber: number,
    pageSize: number,
    signal?: AbortSignal,
  ): Promise<PaginedResult<CommitmentComment>> {
    const { data } = await api.get<PaginedResult<CommitmentComment>>(commitmentUrl(commitmentId), {
      params: { pageNumber, pageSize },
      signal,
    });
    return data;
  },

  /** O comentário mais recente de cada compromisso, sem respostas. */
  async listRecent(limit: number, signal?: AbortSignal): Promise<RecentComment[]> {
    const { data } = await api.get<RecentComment[]>(`${API_PREFIX}/comments/recent`, {
      params: { limit },
      signal,
    });
    return data;
  },

  /** Com `parentId`, publica uma resposta (sem o limite dos comentários raiz). */
  async add(commitmentId: string, text: string, parentId?: string): Promise<CommitmentComment> {
    const { data } = await api.post<CommitmentComment>(commitmentUrl(commitmentId), {
      text,
      parentId,
    });
    return data;
  },

  async remove(commentId: string): Promise<void> {
    await api.delete(`${API_PREFIX}/comments/${encodeURIComponent(commentId)}`);
  },

  /** Moderação: só a API aceita quem tem a claim de administrador. */
  async removeAsAdmin(commentId: string): Promise<void> {
    await api.delete(`${API_PREFIX}/admin/comments/${encodeURIComponent(commentId)}`);
  },
};
