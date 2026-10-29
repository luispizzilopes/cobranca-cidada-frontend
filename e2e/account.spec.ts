import { expect, test } from '@playwright/test';
import { codeCount, expectNoSeriousA11yViolations, nextCode, uniqueEmail } from './helpers';

const PASSWORD = 'Senh@-Muito-Forte-123';
const NEW_PASSWORD = 'Outra-Senh@-Forte-456';

test('cadastro com código, login, conta, recuperação de senha e exclusão', async ({ page }) => {
  const email = uniqueEmail('conta');

  await page.goto('/cadastro');
  await page.getByLabel('E-mail').fill(email);
  const beforeRegistration = codeCount('Seu código de cadastro');
  await page.getByRole('button', { name: 'Enviar código' }).click();
  await expect(page.getByRole('heading', { name: 'Concluir cadastro' })).toBeVisible();
  await expectNoSeriousA11yViolations(page);

  await page.getByLabel('Nome').fill('Pessoa de Teste');
  await page
    .getByLabel('Código de verificação')
    .fill(await nextCode('Seu código de cadastro', beforeRegistration));
  await page.getByLabel('Senha', { exact: true }).fill('fraca');
  await page.getByRole('button', { name: 'Criar conta' }).click();
  await expect(page.getByText(/A senha precisa/)).toBeVisible();
  await expect(page.getByText('É preciso aceitar a política de privacidade')).toBeVisible();

  await page.getByLabel('Senha', { exact: true }).fill(PASSWORD);
  await page.getByLabel(/Li e aceito a política de privacidade/).check();
  await page.getByRole('button', { name: 'Criar conta' }).click();

  await expect(page).toHaveURL('/');
  await expect(page.getByRole('link', { name: 'Pessoa de Teste' })).toBeVisible();
  await page.goto('/compromissos/ECON-003');
  await page.getByRole('button', { name: 'Cobrar' }).click();
  await expect(page.getByRole('button', { name: 'Cobrar' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByRole('dialog')).toHaveCount(0);

  await page.goto('/conta');
  await expect(page.getByText(email)).toBeVisible();
  await expect(page.getByRole('link', { name: /ECON-003/ })).toBeVisible();
  await expectNoSeriousA11yViolations(page);

  await page.reload();
  await expect(page.getByText(email)).toBeVisible();

  await page.getByRole('button', { name: 'Sair' }).click();
  await expect(page).toHaveURL('/');
  await page.goto('/entrar');
  await page.getByLabel('E-mail').fill(email);
  await page.getByLabel('Senha', { exact: true }).fill('Errada-Errada-123!');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('E-mail ou senha inválidos');

  await page.getByRole('link', { name: 'Esqueci minha senha' }).click();
  await expect(page.getByRole('heading', { name: 'Recuperar senha' })).toBeVisible();
  await page.getByLabel('E-mail').fill(email);
  const beforeReset = codeCount('Recuperação de senha');
  await page.getByRole('button', { name: 'Enviar código' }).click();
  await page
    .getByLabel('Código de verificação')
    .fill(await nextCode('Recuperação de senha', beforeReset));
  await page.getByLabel('Nova senha', { exact: true }).fill(NEW_PASSWORD);
  await page.getByRole('button', { name: 'Alterar senha' }).click();
  await expect(page.getByRole('heading', { name: 'Senha alterada' })).toBeVisible();

  await page.getByRole('link', { name: 'Entrar' }).last().click();
  await expect(page.getByRole('heading', { name: 'Entrar', level: 1 })).toBeVisible();
  await page.getByLabel('E-mail').fill(email);
  await page.getByLabel('Senha', { exact: true }).fill(NEW_PASSWORD);
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL('/');

  await page.goto('/conta');
  await page.getByRole('button', { name: 'Excluir minha conta' }).click();
  await page.getByRole('dialog').getByLabel('Confirme sua senha').fill(NEW_PASSWORD);
  await page.getByRole('dialog').getByRole('button', { name: 'Excluir definitivamente' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('link', { name: 'Entrar' }).first()).toBeVisible();
});
