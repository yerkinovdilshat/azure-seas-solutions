import { test, expect } from '@playwright/test';

test.describe('Admin to Public Flow', () => {
  test.use({ 
    storageState: undefined // Don't use any stored auth state
  });

  test('Admin login and publish news flow', async ({ page }) => {
    // Skip if no test credentials provided
    if (!process.env.PLAYWRIGHT_ADMIN_EMAIL || !process.env.PLAYWRIGHT_ADMIN_PASSWORD) {
      test.skip(true, 'Admin credentials not provided');
    }

    // Step 1: Login to admin
    await page.goto('/auth/login');
    
    await page.fill('input[type="email"]', process.env.PLAYWRIGHT_ADMIN_EMAIL!);
    await page.fill('input[type="password"]', process.env.PLAYWRIGHT_ADMIN_PASSWORD!);
    await page.click('button[type="submit"]');
    
    // Wait for redirect to admin dashboard
    await expect(page.url()).toContain('/admin');
    
    // Step 2: Navigate to news admin
    await page.goto('/admin/news');
    await expect(page.locator('h1')).toContainText('News');
    
    // Step 3: Create a draft news article
    await page.click('button:has-text("Add News")');
    
    const testTitle = `Test News Article ${Date.now()}`;
    await page.fill('input[placeholder*="title"]', testTitle);
    await page.fill('input[placeholder*="slug"]', `test-news-${Date.now()}`);
    await page.fill('textarea[placeholder*="excerpt"]', 'This is a test news article excerpt');
    
    // Save as draft first
    await page.click('button:has-text("Save")');
    await expect(page.locator('text=saved, text=created')).toBeVisible();
    
    // Step 4: Publish the article
    // Find the article in the list and publish it
    const articleRow = page.locator(`tr:has-text("${testTitle}")`);
    await expect(articleRow).toBeVisible();
    
    // Click publish button (could be a toggle or button)
    const publishButton = articleRow.locator('button:has-text("Publish"), input[type="checkbox"]');
    await publishButton.click();
    
    // Wait for success message
    await expect(page.locator('text=published, text=updated')).toBeVisible();
    
    // Step 5: Verify article appears on public news page
    await page.goto('/news');
    await expect(page.locator(`text=${testTitle}`)).toBeVisible();
    
    // Step 6: Verify article appears on homepage
    await page.goto('/');
    
    // Look for the article in the news section
    const newsSection = page.locator('section:has-text("News"), section:has-text("Latest News")');
    if (await newsSection.isVisible()) {
      await expect(newsSection.locator(`text=${testTitle}`)).toBeVisible();
    }
  });

  test('Admin can manage content visibility', async ({ page }) => {
    if (!process.env.PLAYWRIGHT_ADMIN_EMAIL || !process.env.PLAYWRIGHT_ADMIN_PASSWORD) {
      test.skip(true, 'Admin credentials not provided');
    }

    await page.goto('/auth/login');
    await page.fill('input[type="email"]', process.env.PLAYWRIGHT_ADMIN_EMAIL!);
    await page.fill('input[type="password"]', process.env.PLAYWRIGHT_ADMIN_PASSWORD!);
    await page.click('button[type="submit"]');
    
    await expect(page.url()).toContain('/admin');
    
    // Test that admin can see preview content
    await page.goto('/news?preview=1');
    
    // Should see both published and draft content
    await expect(page.locator('text=Draft, text=Published')).toBeVisible();
    
    // Test that public can't see draft content
    await page.goto('/news');
    
    // Should only see published content
    const draftContent = page.locator('text=Draft');
    await expect(draftContent).toHaveCount(0);
  });
});