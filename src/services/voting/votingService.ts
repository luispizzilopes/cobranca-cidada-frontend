import api, { setVoterToken } from '../api/api';
import { API_PREFIX } from '../../data/domains';
import type { MyVote, MyVoteItem, VoteState } from '../types';

export const votingService = {
  async requestVoterCode(email: string): Promise<void> {
    await api.post(`${API_PREFIX}/voter/code`, { email });
  },

  async verifyVoterCode(email: string, code: string): Promise<void> {
    const { data } = await api.post<{ token: string; dateExpiration: string }>(
      `${API_PREFIX}/voter/verify`,
      {
        email,
        code,
      },
    );
    setVoterToken(data.token, data.dateExpiration);
  },

  async setVote(commitmentId: string, vote: MyVote): Promise<VoteState> {
    const { data } = await api.put<VoteState>(
      `${API_PREFIX}/commitments/${encodeURIComponent(commitmentId)}/vote`,
      vote,
    );
    return data;
  },

  async myVotes(): Promise<MyVoteItem[]> {
    const { data } = await api.get<MyVoteItem[]>(`${API_PREFIX}/votes/mine`);
    return data;
  },

  async deleteMyVotes(): Promise<number> {
    const { data } = await api.delete<{ deletedVotes: number }>(`${API_PREFIX}/votes/mine`);
    return data.deletedVotes;
  },
};
