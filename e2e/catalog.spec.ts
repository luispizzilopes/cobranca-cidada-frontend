import { expect, test } from '@playwright/test';
import { chooseOption, expectNoSeriousA11yViolations } from './helpers';

test('lista, filtra por área e situação, busca e abre o detalhe', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: 'Cada promessa merece uma resposta' }),
  ).toBeVisible();
  await expect(page.getByRole('status').filter({ hasText: /de \d+ compromissos/ })).toBeVisible();
  await expect(
    page.getByText('Site de cidadãos, sem vínculo com o governo.').first(),
  ).toBeVisible();
  await expect(page.getByText(/dias? para a posse prevista/)).toBeVisible();

  await chooseOption(page, 'Área', 'Economia e responsabilidade fiscal');
  await expect(page).toHaveURL(/area=ECON/);
  await chooseOption(page, 'Situação de execução', 'Em andamento');
  await expect(page).toHaveURL(/situacao=InProgress/);
  await expect(page.getByRole('article').first()).toContainText('Em andamento');

  await page.getByRole('button', { name: 'Limpar filtros' }).click();
  await page.getByLabel('Buscar por palavra ou código').fill('ECON-006');
  await page.getByRole('main').getByRole('button', { name: 'Buscar' }).click();
  await expect(page.getByRole('article')).toHaveCount(1);

  await page.getByRole('link', { name: /Ver fontes e detalhes/ }).click();
  await expect(page).toHaveURL(/\/compromissos\/ECON-006/);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Fontes' })).toBeVisible();
  await expect(page.getByText('Origem: Campanha (fora do plano)')).toBeVisible();
});

test('aba "Com prazo", paginação e ordenação', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Com prazo' }).click();
  await expect(page).toHaveURL(/aba=prazo/);
  await expect(page.getByRole('status').filter({ hasText: /de 32 compromissos/ })).toBeVisible();

  await page.getByRole('button', { name: 'Página 2' }).click();
  await expect(page).toHaveURL(/pagina=2/);
  await expect(page.getByRole('status').filter({ hasText: /13–24 de 32/ })).toBeVisible();

  await chooseOption(page, 'Ordenar', 'Mais cobradas');
  await expect(page).toHaveURL(/ordem=mais-cobradas/);
  await expect(page).not.toHaveURL(/pagina=/);
});

test('página de prazos agrupa por ano e páginas de conteúdo carregam', async ({ page }) => {
  await page.goto('/prazos');
  await expect(page.getByRole('heading', { name: '2027', level: 2 })).toBeVisible();

  await page.goto('/metodologia');
  await expect(page.getByRole('heading', { name: 'Metodologia', level: 1 })).toBeVisible();
  await expect(page.locator('table').first()).toBeVisible();
  await page.goto('/limitacoes');
  await expect(page.getByRole('heading', { name: 'Limitações', level: 1 })).toBeVisible();
  await page.goto('/privacidade');
  await expect(
    page.getByRole('heading', { name: 'Política de privacidade', level: 1 }),
  ).toBeVisible();
});

test('rota inexistente mostra página de erro amigável', async ({ page }) => {
  await page.goto('/compromissos/NAO-EXISTE');
  await expect(page.getByRole('heading', { name: 'Compromisso não encontrado' })).toBeVisible();
  await page.goto('/nada-por-aqui');
  await expect(page.getByRole('heading', { name: 'Página não encontrada' }).first()).toBeVisible();
});

for (const [name, path] of [
  ['início', '/'],
  ['detalhe', '/compromissos/ECON-006'],
  ['prazos', '/prazos'],
  ['metodologia', '/metodologia'],
  ['entrar', '/entrar'],
  ['cadastro', '/cadastro'],
] as const) {
  test(`acessibilidade (axe, tema claro): ${name}`, async ({ page }) => {
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    await expectNoSeriousA11yViolations(page);
  });

  test(`acessibilidade (axe, tema escuro): ${name}`, async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('cobranca:theme', 'dark'));
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    await expectNoSeriousA11yViolations(page);
  });
}
