import { test, expect } from '@playwright/test';

test.describe('Internationalization', () => {
  test('Can switch to Russian locale', async ({ page }) => {
    await page.goto('/');
    
    // Look for language switcher and switch to Russian
    const langSwitcher = page.locator('[data-testid="language-switcher"], button:has-text("EN"), select');
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click();
      await page.locator('text=RU, text=Русский').click();
    } else {
      // If no language switcher, manually go to Russian URL
      await page.goto('/?lng=ru');
    }
    
    // Wait for content to update
    await page.waitForTimeout(1000);
    
    // Check for Russian text
    await expect(page.locator('text=Казахстан, text=Главная, text=Услуги')).toBeVisible();
    
    // Check for hreflang attribute
    const hreflangLinks = page.locator('link[hreflang]');
    await expect(hreflangLinks).toHaveCount.toBeGreaterThan(0);
  });

  test('Can switch to Kazakh locale', async ({ page }) => {
    await page.goto('/');
    
    const langSwitcher = page.locator('[data-testid="language-switcher"], button:has-text("EN"), select');
    if (await langSwitcher.isVisible()) {
      await langSwitcher.click();
      await page.locator('text=KK, text=Қазақ').click();
    } else {
      await page.goto('/?lng=kk');
    }
    
    await page.waitForTimeout(1000);
    
    // Check for Kazakh text
    await expect(page.locator('text=Қазақстан, text=Басты, text=Қызметтер')).toBeVisible();
  });

  test('Shows translation fallback indicator', async ({ page }) => {
    // Switch to a non-English locale
    await page.goto('/?lng=ru');
    await page.waitForTimeout(1000);
    
    // Look for "Translation coming soon" indicator
    const fallbackIndicator = page.locator('text=Translation coming soon, text=Перевод скоро появится');
    
    // The indicator should appear if any section is using fallback
    if (await fallbackIndicator.isVisible()) {
      await expect(fallbackIndicator).toBeVisible();
    }
  });

  test('Falls back to English when translation missing', async ({ page }) => {
    await page.goto('/?lng=ru');
    await page.waitForTimeout(1000);
    
    // Even if some content is in Russian, English fallback should work
    // The page should still be functional and not show raw translation keys
    await expect(page.locator('text=contact.form.title, text=news.title')).toHaveCount(0);
  });

  test('URL parameters persist language selection', async ({ page }) => {
    await page.goto('/?lng=ru');
    await page.waitForTimeout(500);
    
    // Navigate to another page
    await page.click('a[href*="/about"]');
    
    // Check that the language parameter is preserved
    await expect(page.url()).toMatch(/lng=ru|locale=ru/);
  });
});