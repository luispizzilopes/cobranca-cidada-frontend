import { defineConfig, devices } from '@playwright/test';

/**
 * Testes ponta a ponta. Pré-requisitos (veja o README):
 *  - API rodando em VITE_API_URL (padrão http://localhost:5399), banco migrado e com o seed;
 *  - sem chave do Brevo, a API imprime os códigos de e-mail no log; aponte E2E_API_LOG para esse arquivo.
 */
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  retries: 0,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    locale: 'pt-BR',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npm run dev -- --port 5173',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
  },
});
