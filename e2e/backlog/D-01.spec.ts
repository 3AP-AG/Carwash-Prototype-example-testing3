// D-01: a customer books a wash appointment online. One test per acceptance bullet.
import { expect, test } from '@playwright/test';

const DATE = '2026-03-17';
const DISPLAYED_DATE = '17.03.2026';
const TIME = '09:30';

test('the booking page offers the wash programmes', { tag: '@D-01' }, async ({ page }) => {
  await page.goto('/bookings/new');

  const programme = page.getByLabel('Waschprogramm');
  await expect(programme).toBeVisible();
  await expect(programme.getByRole('option')).toHaveText([
    'Basiswäsche',
    'Komfortwäsche',
    'Premiumwäsche',
  ]);
});

test('a booked appointment is confirmed with programme, date and time', { tag: '@D-01' }, async ({
  page,
}) => {
  const customer = `E2E Kundin ${Date.now()}`;

  await page.goto('/bookings/new');
  await page.getByLabel('Waschprogramm').selectOption('PREMIUM');
  await page.getByLabel('Datum').fill(DATE);
  await page.getByLabel('Uhrzeit').fill(TIME);
  await page.getByLabel('Name').fill(customer);
  await page.getByLabel('Kennzeichen').fill('ZH 123456');
  await page.getByRole('button', { name: 'Termin buchen' }).click();

  await expect(page.getByRole('heading', { name: 'Ihr Termin ist gebucht' })).toBeVisible();
  await expect(page.getByText('Premiumwäsche')).toBeVisible();
  await expect(page.getByText(DISPLAYED_DATE)).toBeVisible();
  await expect(page.getByText(`${TIME} Uhr`)).toBeVisible();
  await expect(page.getByText(customer)).toBeVisible();
});

test('a missing date is rejected with a message on the field', { tag: '@D-01' }, async ({ page }) => {
  await page.goto('/bookings/new');
  await page.getByLabel('Uhrzeit').fill(TIME);
  await page.getByLabel('Name').fill('E2E Kundin ohne Datum');
  await page.getByLabel('Kennzeichen').fill('ZH 123456');
  await page.getByRole('button', { name: 'Termin buchen' }).click();

  await expect(page.getByLabel('Datum')).toHaveAttribute('aria-invalid', 'true');
  await expect(page.getByText('Bitte ausfüllen.')).toBeVisible();
  await expect(page).toHaveURL(/\/bookings\/new$/);
});
