import { test, expect } from '@playwright/test';
import { supabase } from '../src/integrations/supabase/client';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('Submit valid contact form', async ({ page }) => {
    // Scroll to contact form
    await page.locator('form').scrollIntoViewIfNeeded();
    
    const timestamp = Date.now();
    const testData = {
      name: `Test User ${timestamp}`,
      phone: '+7 701 123 4567',
      message: `Test message from Playwright ${timestamp}`
    };
    
    // Fill form
    await page.fill('input[name="name"]', testData.name);
    await page.fill('input[name="phone"]', testData.phone);
    await page.fill('textarea[name="message"]', testData.message);
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Wait for success message
    await expect(page.locator('text=sent, text=submitted, text=success')).toBeVisible({ timeout: 10000 });
    
    // Verify data was saved in database
    if (process.env.PLAYWRIGHT_SUPABASE_URL && process.env.PLAYWRIGHT_SUPABASE_ANON_KEY) {
      const { data, error } = await supabase
        .from('contact_requests')
        .select('*')
        .eq('name', testData.name)
        .eq('phone', testData.phone)
        .single();
      
      expect(error).toBeNull();
      expect(data).toBeTruthy();
      expect(data?.message).toBe(testData.message);
    }
  });

  test('Honeypot protection works', async ({ page }) => {
    await page.locator('form').scrollIntoViewIfNeeded();
    
    // Fill visible fields
    await page.fill('input[name="name"]', 'Bot User');
    await page.fill('input[name="phone"]', '+7 701 123 4567');
    await page.fill('textarea[name="message"]', 'This is a bot message');
    
    // Fill honeypot field (should be hidden)
    await page.fill('input[name="_hp"]', 'bot-content');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Should show error or be rejected
    await expect(page.locator('text=error, text=rejected, text=invalid')).toBeVisible({ timeout: 5000 });
  });

  test('Required fields validation', async ({ page }) => {
    await page.locator('form').scrollIntoViewIfNeeded();
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors
    const nameField = page.locator('input[name="name"]');
    const phoneField = page.locator('input[name="phone"]');
    const messageField = page.locator('textarea[name="message"]');
    
    await expect(nameField).toHaveAttribute('required');
    await expect(phoneField).toHaveAttribute('required');
    await expect(messageField).toHaveAttribute('required');
  });

  test('Rate limiting works', async ({ page }) => {
    await page.locator('form').scrollIntoViewIfNeeded();
    
    // Submit multiple forms quickly
    for (let i = 0; i < 4; i++) {
      await page.fill('input[name="name"]', `Rate Test User ${i}`);
      await page.fill('input[name="phone"]', '+7 701 123 4567');
      await page.fill('textarea[name="message"]', `Rate limit test message ${i}`);
      
      await page.click('button[type="submit"]');
      
      if (i < 3) {
        // First few submissions should work
        await expect(page.locator('text=sent, text=submitted, text=success')).toBeVisible({ timeout: 5000 });
        
        // Clear form for next submission
        await page.fill('input[name="name"]', '');
        await page.fill('textarea[name="message"]', '');
      } else {
        // 4th submission should be rate limited
        await expect(page.locator('text=limit, text=too many, text=wait')).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('Form accessibility', async ({ page }) => {
    await page.locator('form').scrollIntoViewIfNeeded();
    
    // Check for proper labels
    await expect(page.locator('label[for="name"]')).toBeVisible();
    await expect(page.locator('label[for="phone"]')).toBeVisible();
    await expect(page.locator('label[for="message"]')).toBeVisible();
    
    // Check form can be navigated with keyboard
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="name"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('input[name="phone"]')).toBeFocused();
    
    await page.keyboard.press('Tab');
    await expect(page.locator('textarea[name="message"]')).toBeFocused();
  });
});