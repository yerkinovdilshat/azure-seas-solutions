# Catalog Frontend Test Checklist

## Routes ✅
- [x] `/catalog` → Combined view (all published products)
- [x] `/catalog/production` → Filter type='production' 
- [x] `/catalog/supply` → Filter type='supply'
- [x] `/catalog/[slug]` → Product detail page

## List UI Features ✅

### Product Cards
- [x] Title, description, thumbnail display
- [x] CT-KZ badge (using /public/ctkz.svg) when is_ctkz=true
- [x] Type badge (Production/Supply)
- [x] Featured badge when is_featured=true
- [x] Manufacturer display
- [x] "View Details" link to product page

### Filters (with URL persistence)
- [x] Search by title
- [x] Type filter (production/supply/all)
- [x] Manufacturer dropdown
- [x] CT-KZ toggle switch
- [x] Clear filters button

### Data & Performance
- [x] Locale-aware content
- [x] Only status='published' (unless ?preview=1)
- [x] Default sorting by published_at desc
- [x] Lazy loading images
- [x] Skeleton loaders during fetch
- [x] Empty state message

## Detail UI Features ✅

### Hero Section
- [x] Image gallery with thumbnails
- [x] Selected image preview
- [x] Product title, manufacturer, SKU
- [x] CT-KZ badge display
- [x] Product description
- [x] Request Quote CTA
- [x] PDF datasheet download (if available)

### Content Sections
- [x] Specifications table (from JSON)
- [x] Rich content display
- [x] Contact CTA section with email/phone buttons
- [x] Breadcrumb navigation
- [x] Back button

### Accessibility & Performance
- [x] Picture element for images
- [x] Lazy loading
- [x] Alt text for images
- [x] Loading states

## Components Created ✅
- [x] `CatalogCard` - Reusable product card component
- [x] `CatalogFilters` - Filter controls component
- [x] Updated `Catalog.tsx` - Main listing page
- [x] Updated `CatalogDetail.tsx` - Product detail page

## Assets ✅
- [x] `/public/ctkz.svg` - CT-KZ badge SVG

## Manual Test Steps

### 1. Catalog Listing
1. Visit `/catalog` - should show all products
2. Visit `/catalog/production` - should show only production items
3. Visit `/catalog/supply` - should show only supply items
4. Test search functionality
5. Test manufacturer filter
6. Test CT-KZ filter
7. Test clear filters
8. Verify URL parameters update with filters

### 2. Product Detail
1. Click on any product card
2. Verify product details display correctly
3. Test image gallery (if multiple images)
4. Test PDF download (if available)
5. Test contact CTAs
6. Test breadcrumb navigation
7. Test back button

### 3. Responsive Design
1. Test on mobile devices
2. Verify card layouts adapt properly
3. Check filter controls on smaller screens

### 4. Performance
1. Verify images load lazily
2. Check skeleton loaders appear during data fetch
3. Test with slow network connection

### 5. Localization
1. Switch languages
2. Verify content updates
3. Check fallback to English if content missing