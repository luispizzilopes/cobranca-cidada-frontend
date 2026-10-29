import api, { applyLogin, clearAccountSession, type LoginResponse } from '../api/api';
import { API_PREFIX } from '../../data/domains';
import type { Profile } from '../types';

const base = `${API_PREFIX}/authentication`;

/** Prova de identidade em ações sensíveis (excluir a conta): a senha ou, para conta sem senha, um ID token recente do Google. */
export type IdentityProof = { password: string } | { googleCredential: string };

export const authService = {
  async requestRegistrationCode(email: string): Promise<void> {
    await api.post(`${base}/request-registration-code`, { email });
  },

  async register(payload: {
    name: string;
    email: string;
    password: string;
    code: string;
    acceptedPrivacyPolicy: boolean;
  }): Promise<void> {
    const { data } = await api.post<LoginResponse>(`${base}/register`, payload);
    applyLogin(data);
  },

  async login(email: string, password: string): Promise<void> {
    const { data } = await api.post<LoginResponse>(`${base}/login`, { email, password });
    applyLogin(data);
  },

  /**
   * Entra com o ID token do "Entrar com o Google". Se a conta não existe, a API pede o aceite da política de
   * privacidade (código Auth.ConsentRequired); se já existe com o mesmo e-mail, vincula e entra no mesmo usuário.
   */
  async loginWithGoogle(credential: string, acceptedPrivacyPolicy: boolean): Promise<void> {
    const { data } = await api.post<LoginResponse>(`${base}/google`, {
      credential,
      acceptedPrivacyPolicy,
    });
    applyLogin(data);
  },

  async logout(): Promise<void> {
    try {
      await api.post(`${base}/logout`);
    } finally {
      clearAccountSession();
    }
  },

  async getProfile(): Promise<Profile> {
    const { data } = await api.get<Profile>(`${base}/me`);
    return data;
  },

  async requestPasswordReset(email: string): Promise<void> {
    await api.post(`${base}/request-password-reset`, { email });
  },

  async confirmPasswordReset(payload: {
    email: string;
    code: string;
    newPassword: string;
  }): Promise<void> {
    await api.post(`${base}/confirm-password-reset`, payload);
    clearAccountSession();
  },

  /** Todas as sessões são encerradas: a pessoa precisa entrar de novo. */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post(`${base}/change-password`, { currentPassword, newPassword });
    clearAccountSession();
  },

  async deleteAccount(proof: IdentityProof): Promise<void> {
    await api.delete(`${base}/me`, { data: proof });
    clearAccountSession();
  },
};
