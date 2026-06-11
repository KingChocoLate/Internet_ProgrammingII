import { test, expect } from '@playwright/test';

test('Sauce Demo homepage loads', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Swag Labs/);
  await expect(page.getByPlaceholder('Username')).toBeVisible();
  await expect(page.getByPlaceholder('Password')).toBeVisible();
  await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
});