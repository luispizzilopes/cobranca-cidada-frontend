import { expect, test } from '@playwright/test';
import {
  chooseOption,
  expectNoSeriousA11yViolations,
  makeAdmin,
  registerAccount,
  uniqueEmail,
} from './helpers';

test('administração: só quem tem a flag no banco entra e consegue revisar compromissos', async ({
  page,
}) => {
  const email = uniqueEmail('admin');
  await registerAccount(page, email, 'Admin de Teste');

  await expect(page.getByRole('link', { name: 'Administração' })).toHaveCount(0);
  await page.goto('/admin');
  await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();

  makeAdmin(email);
  await page.reload();
  await expect(page.getByRole('link', { name: 'Administração' })).toBeVisible();

  await page.getByRole('link', { name: 'Administração' }).click();
  await expect(page.getByRole('heading', { name: 'Administração', level: 1 })).toBeVisible();
  await page.getByLabel('Buscar por título, descrição ou código').fill('ECON-006');
  await page.getByRole('button', { name: 'Buscar' }).click();
  await expect(page.getByRole('link', { name: /^ECON-006 —/ })).toBeVisible();
  await expectNoSeriousA11yViolations(page);
  await page.getByRole('link', { name: /^ECON-006 —/ }).click();
  await expect(page.getByRole('heading', { name: /^ECON-006 —/, level: 1 })).toBeVisible();
  await expectNoSeriousA11yViolations(page);

  await expect(page.getByRole('button', { name: 'Salvar alterações' })).toBeDisabled();
  await page.getByLabel('Prazo estruturado').fill('2028-06-30');
  await page.getByLabel('Texto do prazo').fill('Até 30/06/2028');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.getByText('Explique o motivo da edição')).toBeVisible();

  await page.getByLabel('Motivo da edição').fill('Prazo confirmado em decreto (teste E2E)');
  await page.getByRole('button', { name: 'Salvar alterações' }).click();
  await expect(page.getByText(/Compromisso atualizado/)).toBeVisible();
  await expect(page.getByText(/Versão \d+ substituída por Admin de Teste/)).toBeVisible();

  await page.goto('/compromissos/ECON-006');
  await expect(page.getByText('Até 30/06/2028').first()).toBeVisible();

  await page.goto('/admin/compromissos/ECON-006');
  await chooseOption(page, 'Nova situação', 'Em andamento');
  await page.getByRole('button', { name: 'Registrar situação' }).click();
  await expect(page.getByText(/exige uma fonte com URL/)).toBeVisible();
  await page.getByLabel('URL da fonte').fill('https://www.gov.br/planalto/exemplo');
  await page.getByLabel('Observação (opcional)').fill('Portaria publicada (teste E2E)');
  await page.getByRole('button', { name: 'Registrar situação' }).click();
  await expect(page.getByText('Situação registrada.')).toBeVisible();
  await expect(page.getByText('Portaria publicada (teste E2E)')).toBeVisible();

  await page.getByRole('button', { name: 'Despublicar' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Despublicar' }).click();
  await expect(page.getByText('Compromisso despublicado.')).toBeVisible();
  await page.goto('/compromissos/ECON-006');
  await expect(page.getByText(/não encontrad/i).first()).toBeVisible();
  await page.goto('/admin/compromissos/ECON-006');
  await page.getByRole('button', { name: 'Publicar' }).click();
  await expect(page.getByText('Compromisso publicado.')).toBeVisible();

  const slug = `E2E-${Date.now()}`;
  await page.goto('/admin');
  await page.getByRole('link', { name: 'Novo compromisso' }).click();
  await page.getByRole('button', { name: 'Criar compromisso' }).click();
  await expect(page.getByText('O título é obrigatório.')).toBeVisible();
  await expect(page.getByText(/precisa de ao menos uma fonte|nome e de uma URL/)).toBeVisible();
  await page.getByLabel('Identificador público (opcional)').fill(slug);
  await page.getByLabel('Título', { exact: true }).fill('Compromisso criado no E2E');
  await page.getByLabel('Descrição', { exact: true }).fill('Texto do compromisso criado no teste.');
  await page.getByLabel('Prazo estruturado').fill('2029-12-31');
  await page.getByLabel('Nome', { exact: true }).fill('Diário Oficial');
  await page.getByLabel('URL', { exact: true }).fill('https://www.in.gov.br/e2e');
  await expectNoSeriousA11yViolations(page);
  await page.getByRole('button', { name: 'Criar compromisso' }).click();
  await expect(page).toHaveURL(`/admin/compromissos/${slug}`);
  await expect(
    page.getByRole('heading', { name: new RegExp(`^${slug} —`), level: 1 }),
  ).toBeVisible();
  await expect(page.getByText('Despublicado').first()).toBeVisible();
  await page.goto(`/compromissos/${slug}`);
  await expect(page.getByText(/não encontrad/i).first()).toBeVisible();
  await page.goto(`/admin/compromissos/${slug}`);
  await page.getByRole('button', { name: 'Publicar' }).click();
  await expect(page.getByText('Compromisso publicado.')).toBeVisible();
  await page.goto(`/compromissos/${slug}`);
  await expect(page.getByRole('heading', { name: 'Compromisso criado no E2E' })).toBeVisible();

  await page.goto('/admin');
  await page.getByRole('link', { name: 'Áreas e origens' }).click();
  await expect(page.getByRole('heading', { name: 'Áreas e origens', level: 1 })).toBeVisible();
  await expectNoSeriousA11yViolations(page);
});

test('administração: quem não entrou é levado ao login e volta ao painel', async ({ page }) => {
  await page.goto('/admin/catalogo');
  await expect(page).toHaveURL(/\/entrar\?voltar=%2Fadmin%2Fcatalogo/);
});
