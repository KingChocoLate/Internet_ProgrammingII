import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from './helpers/auth';

test.describe('Checkout tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);

    await page.getByRole('button', { name: /add to cart/i }).first().click();
    await page.locator('.shopping_cart_link').click();
    await page.getByRole('button', { name: /checkout/i }).click();
  });

  test('complete checkout successfully', async ({ page }) => {
    await page.getByPlaceholder('First Name').fill('John');
    await page.getByPlaceholder('Last Name').fill('Doe');
    await page.getByPlaceholder('Zip/Postal Code').fill('12345');

    await page.getByRole('button', { name: /continue/i }).click();

    await expect(page).toHaveURL(/checkout-step-two.html/);
    await expect(page.getByText('Checkout: Overview')).toBeVisible();

    await page.getByRole('button', { name: /finish/i }).click();

    await expect(page).toHaveURL(/checkout-complete.html/);
    await expect(page.getByText('Thank you for your order!')).toBeVisible();
  });

  test('checkout fails if info missing', async ({ page }) => {
    await page.getByRole('button', { name: /continue/i }).click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('[data-test="error"]'))
      .toContainText('First Name is required');
  });
});