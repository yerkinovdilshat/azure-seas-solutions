import { test, expect } from '@playwright/test';

test.describe('Public Routes', () => {
  test('Homepage loads correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Marine Support Services/);
    await expect(page.locator('h1')).toContainText('Equipment Supply');
    await expect(page.locator('text=Kazakhstan')).toBeVisible();
  });

  test('About page loads correctly', async ({ page }) => {
    await page.goto('/about');
    await expect(page).toHaveTitle(/About/);
    await expect(page.locator('h1')).toContainText('About');
  });

  test('Services page loads correctly', async ({ page }) => {
    await page.goto('/services');
    await expect(page).toHaveTitle(/Services/);
    await expect(page.locator('h1')).toContainText('Services');
  });

  test('Catalog page loads correctly', async ({ page }) => {
    await page.goto('/catalog');
    await expect(page).toHaveTitle(/Catalog/);
    await expect(page.locator('h1')).toContainText('Catalog');
  });

  test('Projects page loads correctly', async ({ page }) => {
    await page.goto('/projects');
    await expect(page).toHaveTitle(/Projects/);
    await expect(page.locator('h1')).toContainText('Projects');
  });

  test('News page loads correctly', async ({ page }) => {
    await page.goto('/news');
    await expect(page).toHaveTitle(/News/);
    await expect(page.locator('h1')).toContainText('News');
  });

  test('Contacts page loads correctly', async ({ page }) => {
    await page.goto('/contacts');
    await expect(page).toHaveTitle(/Contact/);
    await expect(page.locator('h1')).toContainText('Contact');
  });

  test('404 page for non-existent route', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.locator('text=404')).toBeVisible();
  });
});

test.describe('Detail Pages', () => {
  test('Can access service detail page', async ({ page }) => {
    // First get a service from the services page
    await page.goto('/services');
    
    // Wait for services to load and click on the first one
    const firstServiceLink = page.locator('a[href*="/services/"]').first();
    await expect(firstServiceLink).toBeVisible();
    await firstServiceLink.click();
    
    // Verify we're on a service detail page
    await expect(page.url()).toContain('/services/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Can access project detail page', async ({ page }) => {
    await page.goto('/projects');
    
    const firstProjectLink = page.locator('a[href*="/projects/"]').first();
    await expect(firstProjectLink).toBeVisible();
    await firstProjectLink.click();
    
    await expect(page.url()).toContain('/projects/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Can access news detail page', async ({ page }) => {
    await page.goto('/news');
    
    const firstNewsLink = page.locator('a[href*="/news/"]').first();
    await expect(firstNewsLink).toBeVisible();
    await firstNewsLink.click();
    
    await expect(page.url()).toContain('/news/');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Can access catalog detail page', async ({ page }) => {
    await page.goto('/catalog');
    
    const firstCatalogLink = page.locator('a[href*="/catalog/"]').first();
    await expect(firstCatalogLink).toBeVisible();
    await firstCatalogLink.click();
    
    await expect(page.url()).toContain('/catalog/');
    await expect(page.locator('h1')).toBeVisible();
  });
});