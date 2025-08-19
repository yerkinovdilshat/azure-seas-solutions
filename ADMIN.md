# Admin Panel Documentation

## Overview

The admin panel at `/admin/about` provides a comprehensive content management system for the Marine Support Services "About Us" section. This interface allows authorized users to manage all content across three languages (English, Russian, Kazakh).

## Access

- **URL**: `/admin/about`
- **Authentication**: Email/password required
- **Login Page**: `/auth/login`

## Content Sections

### 1. Story
- **Purpose**: Main company story and mission statement
- **Fields**:
  - `Title`: Main heading for the about section
  - `Content`: Rich text editor supporting bold, italic, lists, and markdown formatting
  - `Hero Image`: Optional banner image (upload to images bucket)
- **Features**: Rich text editor with preview mode, image upload with progress tracking

### 2. Values
- **Purpose**: Core company values with icons
- **Fields**:
  - `Title`: Value name (e.g., "Quality Assurance")
  - `Description`: Detailed explanation of the value
  - `Icon`: Select from predefined icons (shield-check, wrench, truck, map-pin, award, users)
  - `Order`: Display order number
- **Features**: Drag-and-drop sorting, icon selection, unlimited values

### 3. Timeline
- **Purpose**: Company history and milestones
- **Fields**:
  - `Year`: Milestone year (number)
  - `Title`: Milestone name
  - `Description`: Detailed description
  - `Image`: Optional milestone image
  - `Order`: Display order
- **Features**: Year-based timeline, optional images, chronological sorting

### 4. Team
- **Purpose**: Team member profiles
- **Fields**:
  - `Name`: Full name
  - `Role`: Job title/position
  - `Bio`: Professional background and experience
  - `Photo`: Profile picture upload
  - `Order`: Display order
- **Features**: Photo upload with preview, professional profile management

### 5. Partners
- **Purpose**: Partner company logos and links
- **Fields**:
  - `Company Name`: Partner company name
  - `Logo`: Company logo image
  - `Website URL`: Optional partner website link
  - `Order`: Display order
- **Features**: Logo upload, external links, global (not localized)

### 6. Certificates
- **Purpose**: Certifications and credentials
- **Fields**:
  - `Title`: Certificate name
  - `Issuer`: Issuing organization
  - `Date`: Certificate date
  - `Image`: Certificate image/scan
  - `File`: Optional PDF download
  - `Order`: Display order
- **Features**: Dual file upload (image + PDF), lightbox preview, download links

### 7. Compliance
- **Purpose**: Compliance badges and safety certifications
- **Fields**:
  - `Title`: Compliance description
  - `Badge Icon`: Visual badge type (ISO-9001, safety-helmet, shield-check)
  - `Link URL`: Optional external verification link
  - `Order`: Display order
- **Features**: Badge icon selection, external verification links

## Localization

### Language Support
- **English (en)**: Primary language
- **Russian (ru)**: Secondary language  
- **Kazakh (kk)**: Regional language

### Locale Switcher
- Located in admin header
- Switch between languages to edit locale-specific content
- Partners section is global (not localized)

### Duplicate to Locale
- **Feature**: Copy current content to other locales
- **Usage**: Create base content in one language, then duplicate and translate
- **Scope**: Applies to current tab content only
- **Note**: Overwrites existing content in target locales

## File Management

### Storage Buckets
- **Images**: `/images/` - Photos, logos, certificates, timeline images
- **Documents**: `/docs/` - PDFs, certificates, documentation

### Upload Features
- **Progress Tracking**: Real-time upload progress bar
- **File Validation**: Type and size restrictions
- **Preview**: Immediate preview for images
- **Replace/Remove**: Easy file management
- **Folder Organization**: Automatic folder structure by content type

### File Limits
- **Images**: JPEG, PNG, WebP up to 10MB
- **Documents**: PDF up to 10MB
- **Logos**: SVG, JPEG, PNG, WebP up to 5MB

## Security

### Authentication
- **Required**: Must be logged in to access admin
- **Redirect**: Automatic redirect to login if not authenticated
- **Session**: Persistent login session with automatic token refresh

### Data Protection
- **RLS Policies**: Row-level security enabled
- **Public Read**: Content visible to website visitors
- **Admin Write**: Only authenticated users can modify content
- **File Security**: Secure upload with validation

### Rate Limiting
- **Upload Protection**: Basic rate limiting on file uploads
- **CSRF Protection**: Built-in request verification

## Content Guidelines

### Story Section
- Keep mission statement clear and professional
- Use rich text features sparingly for readability
- Hero image should be high-quality and relevant

### Values
- Limit to 4-6 core values for best display
- Choose appropriate icons that match value meaning
- Keep descriptions concise but meaningful

### Timeline
- Focus on major milestones only
- Use chronological order (earliest first)
- Include images for visual interest

### Team
- Use professional headshots
- Keep bios focused on relevant experience
- Update roles and information regularly

### Partners
- Use official partner logos
- Verify website URLs are current
- Order by importance or alphabetically

### Certificates
- Upload high-resolution scans
- Include both image and PDF when available
- Verify expiration dates regularly

### Compliance
- Focus on industry-relevant certifications
- Use official compliance descriptions
- Link to verification pages when available

## Maintenance

### Regular Updates
- Review content quarterly
- Update team information when changes occur
- Refresh certificates before expiration
- Verify partner links remain active

### Performance
- Optimize images before upload
- Monitor storage usage
- Regular cleanup of unused files

### Backup
- Content is automatically backed up in Supabase
- Export important data periodically
- Keep local copies of critical files

## Troubleshooting

### Common Issues
- **Upload Fails**: Check file size and format
- **Content Not Saving**: Verify all required fields
- **Images Not Displaying**: Check file permissions and URLs
- **Login Issues**: Contact system administrator

### Support
- Check browser console for technical errors
- Ensure stable internet connection for uploads
- Contact development team for system issues