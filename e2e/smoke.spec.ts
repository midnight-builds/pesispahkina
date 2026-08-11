import { test, expect } from '@playwright/test';

// Selain-savutesti tuotantobuildia vasten: pelaa yhden kierroksen alusta loppuun.
// Kattaa sen, mitä jsdom-testit eivät näe: oikean bundlen latautumisen,
// CSS-tason klikattavuuden ja canvas-confetin ilman mockia.
test('kierros pelataan kotinäkymästä tulosruutuun', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Valitse ikäluokka')).toBeVisible();
  await page.getByRole('button', { name: /G-juniorit/i }).click();
  await page.getByRole('button', { name: /^Pelaa$/i }).first().click();

  for (let i = 0; i < 10; i++) {
    const option = page.locator('.options .option').first();
    await expect(option).toBeVisible();
    await option.click();
    await page.getByRole('button', { name: /Jatka|Näytä tulokset/i }).click();
  }

  await expect(page.getByRole('button', { name: /Takaisin alkuun/i })).toBeVisible();
});
