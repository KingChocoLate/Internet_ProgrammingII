import { expect, type Page } from '@playwright/test';

export async function login(
  page: Page,
  username = 'standard_user',
  password = 'secret_sauce'
) {
    await page.goto('/');

    await page.getByPlaceholder('Username').fill(username);
    await page.getByPlaceholder('Password').fill(password);
    await page.getByRole('button', { name: /login/i }).click();
}

export async function loginAsStandardUser(page: Page) {
  await login(page, 'standard_user', 'secret_sauce');

  await expect(page).toHaveURL(/inventory.html/);
  await expect(page.getByText('Products')).toBeVisible();
}