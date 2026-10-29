import api from '../api/api';
import { API_PREFIX } from '../../data/domains';
import type { Catalog } from '../types';

export const catalogService = {
  async get(): Promise<Catalog> {
    const { data } = await api.get<Catalog>(`${API_PREFIX}/catalog`);
    return data;
  },
};
