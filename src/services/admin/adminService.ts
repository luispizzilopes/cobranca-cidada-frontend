import api from '../api/api';
import { API_PREFIX } from '../../data/domains';
import type {
  AdminCommitmentDetail,
  AdminCommitmentSummary,
  CreateCommitmentPayload,
  Lookup,
  PaginedResult,
  RegisterStatusPayload,
  UpdateCommitmentPayload,
} from '../types';

const base = `${API_PREFIX}/admin`;

export interface AdminCommitmentQuery {
  busca?: string;
  area?: string;
  origem?: string;
  situacao?: string;
  publicado?: boolean;
  ordem?: 'area' | 'code' | 'deadline';
  pageNumber?: number;
  pageSize?: number;
}

const commitmentUrl = (id: string) => `${base}/commitments/${encodeURIComponent(id)}`;

/** Todas as rotas exigem conta com a claim de administrador; a API recusa (403) quem não tem. */
export const adminService = {
  async list(
    query: AdminCommitmentQuery,
    signal?: AbortSignal,
  ): Promise<PaginedResult<AdminCommitmentSummary>> {
    const params = Object.fromEntries(
      Object.entries({
        search: query.busca,
        area: query.area,
        origin: query.origem,
        status: query.situacao,
        published: query.publicado,
        sort: query.ordem,
        pageNumber: query.pageNumber,
        pageSize: query.pageSize,
      }).filter(([, value]) => value !== undefined && value !== ''),
    );
    const { data } = await api.get<PaginedResult<AdminCommitmentSummary>>(`${base}/commitments`, {
      params,
      signal,
    });
    return data;
  },

  async get(id: string, signal?: AbortSignal): Promise<AdminCommitmentDetail> {
    const { data } = await api.get<AdminCommitmentDetail>(commitmentUrl(id), { signal });
    return data;
  },

  async create(payload: CreateCommitmentPayload): Promise<AdminCommitmentDetail> {
    const { data } = await api.post<AdminCommitmentDetail>(`${base}/commitments`, payload);
    return data;
  },

  async update(id: string, payload: UpdateCommitmentPayload): Promise<AdminCommitmentDetail> {
    const { data } = await api.put<AdminCommitmentDetail>(commitmentUrl(id), payload);
    return data;
  },

  async registerStatus(id: string, payload: RegisterStatusPayload): Promise<AdminCommitmentDetail> {
    const { data } = await api.post<AdminCommitmentDetail>(`${commitmentUrl(id)}/status`, payload);
    return data;
  },

  async setPublication(id: string, published: boolean): Promise<AdminCommitmentDetail> {
    const { data } = await api.put<AdminCommitmentDetail>(`${commitmentUrl(id)}/publication`, {
      published,
    });
    return data;
  },

  async renameArea(code: string, name: string): Promise<Lookup> {
    const { data } = await api.put<Lookup>(`${base}/catalog/areas/${encodeURIComponent(code)}`, {
      name,
    });
    return data;
  },

  async renameOrigin(code: string, name: string): Promise<Lookup> {
    const { data } = await api.put<Lookup>(`${base}/catalog/origins/${encodeURIComponent(code)}`, {
      name,
    });
    return data;
  },
};
