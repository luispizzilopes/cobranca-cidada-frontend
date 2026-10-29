import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const LOG = process.env.E2E_API_LOG ?? '/tmp/api.log';

export const uniqueEmail = (label: string) =>
  `${label}.${Date.now()}.${Math.floor(Math.random() * 1e6)}@example.com`;

function codeLines(subjectContains: string): string[] {
  return readFileSync(LOG, 'utf8')
    .split('\n')
    .filter((line) => line.includes('E-MAIL DE DESENVOLVIMENTO') && line.includes(subjectContains));
}

/** Quantos e-mails com esse assunto já foram impressos. Chame antes da ação que envia o novo e-mail. */
export const codeCount = (subjectContains: string) => codeLines(subjectContains).length;

/** Código de 6 dígitos do e-mail que chegou depois de `before` (de `codeCount`), esperando-o aparecer no log. */
export async function nextCode(
  subjectContains: string,
  before: number,
  attempts = 40,
): Promise<string> {
  for (let i = 0; i < attempts; i++) {
    const lines = codeLines(subjectContains);
    if (lines.length > before) {
      const match = /\b(\d{6})\b/.exec(lines[lines.length - 1].split('Conteúdo:')[1] ?? '');
      if (match) return match[1];
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Nenhum e-mail novo com "${subjectContains}" apareceu no log`);
}

export async function expectNoSeriousA11yViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  const serious = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );
  expect(
    serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`),
  ).toEqual([]);
}

/** Confirma o e-mail pelo diálogo de voto e deixa a pessoa pronta para votar (sem conta). */
export async function verifyEmailInDialog(page: Page, email: string) {
  const dialog = page.getByRole('dialog', { name: 'Confirme seu e-mail para votar' });
  await dialog.getByLabel('Seu e-mail').fill(email);
  const before = codeCount('Seu código para votar');
  await dialog.getByRole('button', { name: 'Enviar código' }).click();
  await dialog
    .getByLabel('Código de verificação')
    .fill(await nextCode('Seu código para votar', before));
  await dialog.getByRole('button', { name: 'Confirmar e votar' }).click();
  await expect(dialog).toBeHidden();
}

export const E2E_PASSWORD = 'Senh@-Muito-Forte-123';

/** Cadastra uma conta pela interface e deixa a sessão aberta (termina na página inicial). */
export async function registerAccount(page: Page, email: string, name = 'Pessoa de Teste') {
  await page.goto('/cadastro');
  await page.getByLabel('E-mail').fill(email);
  const before = codeCount('Seu código de cadastro');
  await page.getByRole('button', { name: 'Enviar código' }).click();
  await expect(page.getByRole('heading', { name: 'Concluir cadastro' })).toBeVisible();
  await page.getByLabel('Nome').fill(name);
  await page
    .getByLabel('Código de verificação')
    .fill(await nextCode('Seu código de cadastro', before));
  await page.getByLabel('Senha', { exact: true }).fill(E2E_PASSWORD);
  await page.getByLabel(/Li e aceito a política de privacidade/).check();
  await page.getByRole('button', { name: 'Criar conta' }).click();
  await expect(page).toHaveURL('/');
}

/**
 * Marca a conta como administradora, do único jeito possível: direto no banco (comando `set-admin` da API).
 * Por padrão roda o CLI do backend; use E2E_SET_ADMIN_CMD (com `{email}`) para outro caminho, por exemplo um
 * `psql ... UPDATE "AspNetUsers" SET "IsAdmin" = true WHERE "Email" = '{email}'`.
 * O CLI precisa enxergar o mesmo banco da API (ASPNETCORE_ENVIRONMENT e ConnectionStrings__DefaultConnection iguais).
 */
export function makeAdmin(email: string) {
  const template =
    process.env.E2E_SET_ADMIN_CMD ??
    'dotnet run --project ../cobranca-cidada-backend/Cobranca.Cidada.Presentation -- set-admin --email {email}';
  execSync(template.replaceAll('{email}', email), { stdio: 'pipe', timeout: 120_000 });
}
