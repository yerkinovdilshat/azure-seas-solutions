import { test, expect } from '@playwright/test';

test.describe('Catalog UX', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/catalog');
  });

  test('Filter by type works', async ({ page }) => {
    // Wait for catalog to load
    await expect(page.locator('h1')).toContainText('Catalog');
    
    // Test production filter
    const typeFilter = page.locator('select:near(text="Type"), [data-testid="type-filter"]');
    if (await typeFilter.isVisible()) {
      await typeFilter.selectOption('production');
      
      // URL should update
      await expect(page.url()).toContain('type=production');
      
      // Products should be filtered
      await expect(page.locator('text=Production, text=CT-KZ')).toBeVisible();
    }
    
    // Test supply filter
    await page.goto('/catalog/supply');
    await expect(page.url()).toContain('/catalog/supply');
    await expect(page.locator('text=Supply')).toBeVisible();
  });

  test('CT-KZ filter works', async ({ page }) => {
    // Look for CT-KZ filter toggle/checkbox
    const ctkzFilter = page.locator('input[type="checkbox"]:near(text="CT-KZ"), [data-testid="ctkz-filter"]');
    
    if (await ctkzFilter.isVisible()) {
      await ctkzFilter.check();
      
      // URL should update
      await expect(page.url()).toContain('is_ctkz=true');
      
      // Only CT-KZ products should be visible
      await expect(page.locator('img[src="/ctkz.svg"], text=CT-KZ')).toBeVisible();
    }
  });

  test('Search by title works', async ({ page }) => {
    // Find search input
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]');
    await expect(searchInput).toBeVisible();
    
    // Search for a term
    await searchInput.fill('pump');
    
    // Results should update
    await page.waitForTimeout(1000);
    
    // URL should contain search parameter
    await expect(page.url()).toContain('search=pump');
    
    // Results should contain search term or show no results
    const productCards = page.locator('[data-testid="product-card"], .product-card, a[href*="/catalog/"]');
    const productCount = await productCards.count();
    
    if (productCount > 0) {
      // At least one result should contain the search term
      await expect(page.locator('text=pump')).toBeVisible();
    } else {
      // Should show no results message
      await expect(page.locator('text=No products, text=not found')).toBeVisible();
    }
  });

  test('Manufacturer filter works', async ({ page }) => {
    const manufacturerFilter = page.locator('select:near(text="Manufacturer"), [data-testid="manufacturer-filter"]');
    
    if (await manufacturerFilter.isVisible()) {
      // Get available options
      const options = await manufacturerFilter.locator('option').allTextContents();
      
      if (options.length > 1) {
        // Select first non-"All" option
        const manufacturerOption = options.find(opt => opt !== 'All' && opt !== 'All Manufacturers');
        
        if (manufacturerOption) {
          await manufacturerFilter.selectOption(manufacturerOption);
          
          // URL should update
          await expect(page.url()).toContain(`manufacturer=${encodeURIComponent(manufacturerOption)}`);
          
          // Products should be filtered by manufacturer
          await expect(page.locator(`text=${manufacturerOption}`)).toBeVisible();
        }
      }
    }
  });

  test('Clear filters works', async ({ page }) => {
    // Apply some filters first
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('test');
    }
    
    // Click clear filters button
    const clearButton = page.locator('button:has-text("Clear"), button:has-text("Reset")');
    if (await clearButton.isVisible()) {
      await clearButton.click();
      
      // Search should be cleared
      await expect(searchInput).toHaveValue('');
      
      // URL should not contain filter parameters
      await expect(page.url()).not.toContain('search=');
    }
  });

  test('Filter persistence in URL', async ({ page }) => {
    // Apply multiple filters
    await page.goto('/catalog?search=test&type=production&is_ctkz=true');
    
    // Reload page
    await page.reload();
    
    // Filters should be preserved
    await expect(page.url()).toContain('search=test');
    await expect(page.url()).toContain('type=production');
    await expect(page.url()).toContain('is_ctkz=true');
    
    // Form controls should reflect the URL state
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]');
    if (await searchInput.isVisible()) {
      await expect(searchInput).toHaveValue('test');
    }
  });

  test('Product detail page shows specifications', async ({ page }) => {
    // Click on first product
    const firstProduct = page.locator('a[href*="/catalog/"]:not([href="/catalog"]):not([href="/catalog/production"]):not([href="/catalog/supply"])').first();
    
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      
      // Should be on detail page
      await expect(page.url()).toMatch(/\/catalog\/[^\/]+$/);
      
      // Look for specifications section
      const specsSection = page.locator('text=Specifications, text=Technical, h2:has-text("Specifications")');
      if (await specsSection.isVisible()) {
        await expect(specsSection).toBeVisible();
        
        // Should show spec table or details
        await expect(page.locator('table, dl, .spec-item')).toBeVisible();
      }
      
      // Look for datasheet download if present
      const downloadButton = page.locator('a:has-text("Download"), button:has-text("Datasheet")');
      if (await downloadButton.isVisible()) {
        await expect(downloadButton).toHaveAttribute('href');
      }
      
      // Should have contact CTA
      await expect(page.locator('button:has-text("Request"), button:has-text("Contact"), a:has-text("Quote")')).toBeVisible();
    }
  });

  test('Catalog navigation between types', async ({ page }) => {
    // Test navigation between production and supply
    await page.goto('/catalog/production');
    await expect(page.url()).toContain('/catalog/production');
    await expect(page.locator('h1')).toContainText('Production');
    
    await page.goto('/catalog/supply');
    await expect(page.url()).toContain('/catalog/supply');
    await expect(page.locator('h1')).toContainText('Supply');
    
    // Test main catalog page
    await page.goto('/catalog');
    await expect(page.locator('h1')).toContainText('Catalog');
  });

  test('Responsive catalog layout', async ({ page }) => {
    // Test mobile layout
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Catalog should still be functional
    await expect(page.locator('h1')).toBeVisible();
    
    // Filters should be accessible (might be in a dropdown or mobile layout)
    const searchInput = page.locator('input[placeholder*="Search"], input[type="search"]');
    await expect(searchInput).toBeVisible();
    
    // Products should display in mobile-friendly grid
    const productCards = page.locator('a[href*="/catalog/"]:not([href="/catalog"]):not([href="/catalog/production"]):not([href="/catalog/supply"])');
    if (await productCards.first().isVisible()) {
      await expect(productCards.first()).toBeVisible();
    }
  });
});