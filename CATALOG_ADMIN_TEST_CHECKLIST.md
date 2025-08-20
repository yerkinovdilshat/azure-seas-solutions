# Catalog Admin Implementation - Test Checklist

## Database Changes ✅
- [x] Added `type` field with CHECK constraint ('production' | 'supply') 
- [x] Added `is_ctkz` boolean field (default false)
- [x] Added `tags` text array field
- [x] Created validation trigger to enforce is_ctkz=true only when type='production'
- [x] Migrated existing rows to default values (type='supply', is_ctkz=false)

## Admin Form Fields ✅
- [x] Type selector (radio buttons): Production/Supply
- [x] CT-KZ toggle (only visible when type='production')
- [x] Tags input (comma-separated → stored as array)
- [x] Auto-uncheck CT-KZ when switching to Supply type

## Form Validation ✅
- [x] Name/title required per locale
- [x] Type field required (defaults to 'supply')
- [x] CT-KZ can only be true when type='production' (enforced by trigger)
- [x] Tags properly parsed from comma-separated input

## List View Enhancements ✅
- [x] Added Type column with color-coded badges (Purple=Production, Green=Supply)
- [x] Added CT-KZ badge with icon when applicable
- [x] Added tags count display
- [x] Maintained existing SKU and Featured status badges

## Filtering System ✅
- [x] Filter by Type dropdown (All/Production/Supply)
- [x] Filter by CT-KZ status (All/CT-KZ Only/Non CT-KZ)
- [x] Clear Filters button
- [x] Real-time filtering of product list

## Data Compatibility ✅
- [x] Existing products migrated to type='supply', is_ctkz=false
- [x] Slug remains unique per locale
- [x] All existing fields preserved

## Test Instructions

### 1. Create New Products
- [ ] Create a Supply product → verify CT-KZ toggle is hidden
- [ ] Create a Production product → verify CT-KZ toggle is visible
- [ ] Try to manually set is_ctkz=true on Supply → should be forced to false by trigger

### 2. Test Type Switching
- [ ] Start with Production type, enable CT-KZ, switch to Supply → CT-KZ should auto-uncheck

### 3. Test Tags
- [ ] Enter comma-separated tags: "marine, industrial, certified"
- [ ] Verify they save as array and display correctly in list

### 4. Test Filters
- [ ] Filter by Production type → only production items shown
- [ ] Filter by CT-KZ → only CT-KZ certified items shown
- [ ] Combine filters → Production + CT-KZ
- [ ] Clear filters → all items shown

### 5. Test Badge Display
- [ ] Production items show purple "Production" badge
- [ ] Supply items show green "Supply" badge  
- [ ] CT-KZ items show yellow "CT-KZ" badge with icon
- [ ] Tags show count: "2 tags"

### 6. Data Validation
- [ ] Database trigger prevents is_ctkz=true when type='supply'
- [ ] Required validation on name/title fields
- [ ] Tags properly stored as PostgreSQL array

## Files Modified
- Database: Added fields to `catalog_products` table + validation trigger
- Admin UI: `src/components/admin/sections/AdminCatalog.tsx`
- Dependencies: Added RadioGroup component import

## Security
- [x] Fixed function search_path security warnings
- [x] RLS policies remain unchanged (existing auth-based policies still apply)