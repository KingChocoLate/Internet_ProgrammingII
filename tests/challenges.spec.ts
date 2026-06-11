import { test, expect } from '@playwright/test';
import { loginAsStandardUser } from './helpers/auth';

test.describe('Challenge tests', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsStandardUser(page);
  });

  test('sort products by price low to high', async ({ page }) => {
    await page.getByRole('combobox').selectOption('lohi');

    const priceTexts = await page.locator('.inventory_item_price').allTextContents();

    const prices = priceTexts.map((priceText) =>
      Number(priceText.replace('$', ''))
    );

    const sortedPrices = [...prices].sort((a, b) => a - b);

    expect(prices).toEqual(sortedPrices);
    expect(prices[0]).toBe(Math.min(...prices));
  });

  test('logout successfully', async ({ page }) => {
    await page.getByRole('button', { name: /open menu/i }).click();
    await page.getByRole('link', { name: /logout/i }).click();

    await expect(page).toHaveURL('/');
    await expect(page.getByPlaceholder('Username')).toBeVisible();
    await expect(page.getByPlaceholder('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });
});