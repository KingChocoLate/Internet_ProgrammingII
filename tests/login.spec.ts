import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Login tests', () => {
  test('login with valid credentials', async ({ page }) => {
    await login(page, 'standard_user', 'secret_sauce');

    await expect(page).toHaveURL(/inventory.html/);
    await expect(page.getByText('Products')).toBeVisible();
  });

  test('login fails with wrong password', async ({ page }) => {
    await login(page, 'standard_user', 'wrong_password');

    await expect(page.locator('[data-test="error"]'))
      .toContainText('Username and password do not match');
  });

  test('login fails with locked out user', async ({ page }) => {
    await login(page, 'locked_out_user', 'secret_sauce');

    await expect(page.locator('[data-test="error"]'))
      .toContainText('Sorry, this user has been locked out');
  });
})