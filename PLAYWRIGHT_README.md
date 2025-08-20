# Playwright E2E Tests

This project includes comprehensive end-to-end tests using Playwright to catch regressions and ensure the application works correctly across different browsers and scenarios.

## Test Suites

1. **Public Routes** - Tests all main pages load correctly and show expected content
2. **Internationalization** - Tests language switching and fallback behavior  
3. **Admin Flow** - Tests admin login and content publishing workflow
4. **Contact Form** - Tests form submission, validation, and security features
5. **Catalog UX** - Tests product filtering, search, and detail pages

## Setup

### Install Dependencies

```bash
npm install
npx playwright install
```

### Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Base URL for tests (optional, defaults to http://localhost:5173)
PLAYWRIGHT_BASE_URL=http://localhost:5173

# Admin credentials for testing admin flows
PLAYWRIGHT_ADMIN_EMAIL=admin@yourdomain.com
PLAYWRIGHT_ADMIN_PASSWORD=your-admin-password

# Supabase credentials for database verification (optional)
PLAYWRIGHT_SUPABASE_URL=https://your-project.supabase.co
PLAYWRIGHT_SUPABASE_ANON_KEY=your-anon-key
```

**Note**: The admin credentials should be for a test admin account. For security, use different credentials than your production admin account.

## Running Tests

### Run All Tests

```bash
# Run all tests in headless mode
npx playwright test

# Run tests with UI (headed mode)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug
```

### Run Specific Test Suites

```bash
# Run only public routes tests
npx playwright test public-routes

# Run only i18n tests
npx playwright test i18n

# Run only contact form tests
npx playwright test contact-form

# Run only catalog UX tests
npx playwright test catalog-ux

# Run only admin flow tests (requires admin credentials)
npx playwright test admin-flow
```

### Run Tests in Specific Browsers

```bash
# Run in Chrome only
npx playwright test --project=chromium

# Run in Firefox only
npx playwright test --project=firefox

# Run in Safari only
npx playwright test --project=webkit

# Run on mobile Chrome
npx playwright test --project="Mobile Chrome"
```

## Test Reports

After running tests, view the HTML report:

```bash
npx playwright show-report
```

## Development Server

Tests expect the development server to be running. Start it with:

```bash
npm run dev
```

The tests will automatically start the dev server if it's not already running.

## Test Structure

### Public Routes (`e2e/public-routes.spec.ts`)
- Tests all main pages return 200 OK
- Verifies key content is visible on each page
- Tests 404 handling for non-existent routes
- Tests detail pages for services, projects, news, and catalog

### Internationalization (`e2e/i18n.spec.ts`)
- Tests language switching to Russian and Kazakh
- Verifies `hreflang` attributes are present
- Tests fallback behavior when translations are missing
- Verifies "Translation coming soon" indicators appear appropriately

### Admin Flow (`e2e/admin-flow.spec.ts`)
- Tests admin login functionality
- Tests creating and publishing news articles
- Verifies published content appears on public pages
- Tests preview mode for admins vs. public visibility

### Contact Form (`e2e/contact-form.spec.ts`)
- Tests valid form submission and database storage
- Tests honeypot protection against bots
- Tests rate limiting (max 3 submissions per 15 minutes)
- Tests form validation and accessibility

### Catalog UX (`e2e/catalog-ux.spec.ts`)
- Tests product filtering by type, manufacturer, CT-KZ status
- Tests search functionality
- Tests filter persistence in URL parameters
- Tests product detail pages show specifications and datasheet links
- Tests responsive layout on mobile devices

## Configuration

The Playwright configuration is in `playwright.config.ts`. Key settings:

- **Base URL**: `http://localhost:5173` (configurable via `PLAYWRIGHT_BASE_URL`)
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Retries**: 2 retries on CI, 0 locally
- **Parallel**: Tests run in parallel for speed
- **Traces**: Captured on first retry for debugging

## Debugging Tests

### Visual Debugging

```bash
# Run with browser UI visible
npx playwright test --headed

# Run in debug mode with step-by-step execution
npx playwright test --debug
```

### Test Recording

```bash
# Record a new test
npx playwright codegen http://localhost:5173
```

### Screenshots and Videos

Failed tests automatically capture screenshots. To capture for all tests:

```bash
npx playwright test --screenshot=on
```

## CI/CD Integration

For continuous integration, tests should run in headless mode:

```bash
# CI command
npx playwright test --reporter=html
```

Set environment variables in your CI system:
- `PLAYWRIGHT_ADMIN_EMAIL`
- `PLAYWRIGHT_ADMIN_PASSWORD`
- `PLAYWRIGHT_SUPABASE_URL` (optional)
- `PLAYWRIGHT_SUPABASE_ANON_KEY` (optional)

## Troubleshooting

### Common Issues

1. **Tests fail with "page not found"**
   - Ensure dev server is running: `npm run dev`
   - Check `PLAYWRIGHT_BASE_URL` environment variable

2. **Admin tests skip**
   - Set `PLAYWRIGHT_ADMIN_EMAIL` and `PLAYWRIGHT_ADMIN_PASSWORD`
   - Ensure admin account exists and has proper permissions

3. **Database verification fails**
   - Set `PLAYWRIGHT_SUPABASE_URL` and `PLAYWRIGHT_SUPABASE_ANON_KEY`
   - Ensure Supabase RLS policies allow reading test data

4. **Flaky tests**
   - Increase timeouts in test configuration
   - Add explicit waits for dynamic content
   - Use `page.waitForLoadState('networkidle')` for heavy pages

### Getting Help

- Check the [Playwright documentation](https://playwright.dev/docs/intro)
- View test reports: `npx playwright show-report`
- Run tests in debug mode: `npx playwright test --debug`