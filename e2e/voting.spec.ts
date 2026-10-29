import { expect, test } from '@playwright/test';
import { expectNoSeriousA11yViolations, uniqueEmail, verifyEmailInDialog } from './helpers';

test('vota só com e-mail verificado, sem criar conta: votar, recarregar, "minhas cobranças", desfazer e apagar', async ({
  page,
}) => {
  const email = uniqueEmail('votante');
  await page.goto('/compromissos/ECON-001');

  await page.getByRole('button', { name: 'Cobrar' }).click();
  await expect(page.getByRole('dialog', { name: 'Confirme seu e-mail para votar' })).toBeVisible();
  await expectNoSeriousA11yViolations(page);
  await verifyEmailInDialog(page, email);

  await expect(page.getByRole('button', { name: 'Cobrar' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: 'Boa proposta' }).click();
  await expect(page.getByRole('button', { name: 'Boa proposta' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );

  await page.reload();
  await expect(page.getByRole('button', { name: 'Cobrar' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.goto('/?aba=minhas');
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('article')).toContainText('ECON-001');

  await expect(page.getByText(/Contagens públicas: \d+ cobranças/)).toBeAttached();

  await page.getByRole('button', { name: 'Má proposta' }).click();
  await expect(page.getByRole('button', { name: 'Má proposta' })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await expect(page.getByRole('button', { name: 'Boa proposta' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await page.getByRole('button', { name: 'Cobrar' }).click();
  await expect(page.getByRole('button', { name: 'Cobrar' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await page.getByRole('button', { name: 'Má proposta' }).click();
  await expect(page.getByRole('button', { name: 'Má proposta' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );

  await page.reload();
  await expect(page.getByRole('status').filter({ hasText: /Você ainda não cobrou/ })).toBeVisible();

  await page.goto('/conta');
  await expect(page.getByText('Você está votando só com e-mail verificado')).toBeVisible();
  await expectNoSeriousA11yViolations(page);
  await page.getByRole('button', { name: 'Apagar meus votos' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Apagar tudo' }).click();
  await expect(page.getByText('Você ainda não votou neste navegador')).toBeVisible();
});

test('"Minhas cobranças" sem e-mail verificado pede a confirmação', async ({ page }) => {
  await page.goto('/?aba=minhas');
  await expect(page.getByText('Suas cobranças ficam ligadas ao seu e-mail')).toBeVisible();
  await page.getByRole('button', { name: 'Confirmar e-mail' }).click();
  await expect(page.getByRole('dialog', { name: 'Confirme seu e-mail para votar' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toBeHidden();
});

test('código errado é recusado no diálogo de verificação', async ({ page }) => {
  await page.goto('/compromissos/ECON-002');
  await page.getByRole('button', { name: 'Cobrar' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Seu e-mail').fill(uniqueEmail('errado'));
  await dialog.getByRole('button', { name: 'Enviar código' }).click();
  await dialog.getByLabel('Código de verificação').fill('000000');
  await dialog.getByRole('button', { name: 'Confirmar e votar' }).click();
  await expect(dialog.getByRole('alert')).toContainText(/inválido|expirado/i);
});
