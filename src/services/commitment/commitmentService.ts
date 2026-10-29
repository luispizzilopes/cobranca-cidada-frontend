import api from '../api/api';
import { API_PREFIX } from '../../data/domains';
import type { CommitmentDetail, CommitmentSummary, PaginedResult } from '../types';

export type CommitmentSort =
  'area' | 'code' | 'deadline' | 'mais-cobradas' | 'melhor-avaliadas' | 'pior-avaliadas';

export interface CommitmentQuery {
  busca?: string;
  area?: string;
  origem?: string;
  situacao?: string;
  comPrazo?: boolean;
  minhasCobrancas?: boolean;
  ordem?: CommitmentSort;
  pageNumber?: number;
  pageSize?: number;
}

export const commitmentService = {
  async list(
    query: CommitmentQuery,
    signal?: AbortSignal,
  ): Promise<PaginedResult<CommitmentSummary>> {
    const params = Object.fromEntries(
      Object.entries({
        search: query.busca,
        area: query.area,
        origin: query.origem,
        status: query.situacao,
        hasDeadline: query.comPrazo,
        myCharges: query.minhasCobrancas,
        sort: query.ordem,
        pageNumber: query.pageNumber,
        pageSize: query.pageSize,
      }).filter(([, value]) => value !== undefined && value !== '' && value !== false),
    );
    const { data } = await api.get<PaginedResult<CommitmentSummary>>(`${API_PREFIX}/commitments`, {
      params,
      signal,
    });
    return data;
  },

  async get(id: string, signal?: AbortSignal): Promise<CommitmentDetail> {
    const { data } = await api.get<CommitmentDetail>(
      `${API_PREFIX}/commitments/${encodeURIComponent(id)}`,
      {
        signal,
      },
    );
    return data;
  },
};
