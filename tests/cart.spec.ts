import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from './helpers/auth';

test.describe('Cart tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('add product to cart', async ({ page }) => {
    await page.getByRole('button', { name: /add to cart/i }).first().click();

    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('view cart page', async ({ page }) => {
    await page.getByRole('button', { name: /add to cart/i }).first().click();
    await page.locator('.shopping_cart_link').click();

    await expect(page).toHaveURL(/cart.html/);
    await expect(page.getByText('Your Cart')).toBeVisible();
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  test('remove item from cart', async ({ page }) => {
    await page.getByRole('button', { name: /add to cart/i }).first().click();
    await page.locator('.shopping_cart_link').click();

    await page.getByRole('button', { name: /remove/i }).click();

    await expect(page.locator('.shopping_cart_badge')).toHaveCount(0);
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });
});