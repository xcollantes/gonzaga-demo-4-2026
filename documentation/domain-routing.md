# Domain-Based Routing Architecture

This document explains how we use Vercel's rewrite rules to serve different
content based on the domain, separating our marketing landing page from our
authenticated dashboard application.

## Overview

We use a dual-domain architecture to provide clear separation between:

- **Marketing Site** (`quantplex.ai`) - Landing page and public content
- **Application** (`app.quantplex.ai`) - Dashboard, profile, and authenticated
  features

This approach provides several benefits:

- Clear user experience distinction
- Better SEO for marketing content
- Simplified authentication boundaries
- Easier deployment and caching strategies

## Domain Structure

```
quantplex.ai/
├── /                    → index.tsx (Landing page)
├── /about              → about.tsx (if exists)
└── /contact            → contact.tsx (if exists)

app.quantplex.ai/
├── /                   → dashboard.tsx (Default dashboard)
├── /profile            → profile.tsx
├── /chatbot            → chatbot.tsx
├── /account            → account.tsx
└── /settings           → settings.tsx (if exists)
```

## Vercel Configuration

### Current `vercel.json` Setup

```json
{
  "rewrites": [
    {
      "source": "/",
      "destination": "/dashboard",
      "has": [
        {
          "host": "app.quantplex.ai"
        }
      ]
    },
    {
      "source": "/((?!api|_next|_static|favicon.ico).*)",
      "destination": "/$1",
      "has": [
        {
          "host": "app.quantplex.ai"
        }
      ]
    }
  ]
}
```

### How the Rules Work

#### Rule 1: Root Redirect for App Domain

```json
{
  "source": "/",
  "destination": "/dashboard",
  "has": [{ "host": "app.quantplex.ai" }]
}
```

- **Purpose**: Redirects the root of `app.quantplex.ai` to the dashboard
- **Effect**: `app.quantplex.ai/` → serves `dashboard.tsx`
- **Why**: Provides a logical entry point for authenticated users

#### Rule 2: Pass-through for App Pages

```json
{
  "source": "/((?!api|_next|_static|favicon.ico).*)",
  "destination": "/$1",
  "has": [{ "host": "app.quantplex.ai" }]
}
```

- **Purpose**: Allows normal routing for all other app pages
- **Effect**: `app.quantplex.ai/profile` → serves `profile.tsx`
- **Exclusions**:
  - `api/*` - API routes
  - `_next/*` - Next.js internal files
  - `_static/*` - Static assets
  - `favicon.ico` - Site icon

#### Main Domain (No Rules)

- **Effect**: `quantplex.ai/` → serves `index.tsx` normally
- **Why**: No rewrite rules apply, so standard Next.js routing works

## Domain Setup in Vercel

### 1. Configure Domains in Vercel Dashboard

1. Go to your project in Vercel Dashboard
2. Navigate to **Settings** → **Domains**
3. Add both domains:
   - `quantplex.ai` (primary domain)
   - `app.quantplex.ai` (subdomain)

### 2. DNS Configuration

#### For Main Domain (`quantplex.ai`)

```
Type: A
Name: @
Value: 76.76.19.61 (Vercel's IP)

Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### For Subdomain (`app.quantplex.ai`)

```
Type: CNAME
Name: app
Value: cname.vercel-dns.com
```

### 3. SSL Certificates

Vercel automatically provisions SSL certificates for both domains. Ensure both
show "Valid" status in the domains section.

## Authentication Boundaries

### Marketing Site (`quantplex.ai`)

- **Public pages**: No authentication required
- **Components**: Landing page, pricing, contact forms
- **Navigation**: Simple public navigation
- **Theme**: Marketing-focused design

### Application (`app.quantplex.ai`)

- **Protected pages**: Requires authentication via `ProtectedRoute`
- **Components**: Dashboard, profile, settings, protected features
- **Navigation**: `DashboardLayout` with sidebar/top nav
- **Theme**: Application-focused design

## Development and Testing

### Local Development

During development, you can test domain routing using:

1. **hosts file** (for testing different domains locally):

   ```
   127.0.0.1 quantplex.local
   127.0.0.1 app.quantplex.local
   ```

2. **Environment variables** to simulate domain behavior:
   ```javascript
   // In your components
   const isAppDomain = process.env.NEXT_PUBLIC_APP_DOMAIN === "app.quantplex.ai"
   ```

### Testing in Production

1. **Marketing site**: Visit `https://quantplex.ai/`

   - Should show landing page (`index.tsx`)
   - Should not redirect to dashboard

2. **App site**: Visit `https://app.quantplex.ai/`

   - Should redirect to dashboard
   - Should show authentication if not logged in

3. **Direct app pages**: Visit `https://app.quantplex.ai/profile`
   - Should serve profile page directly
   - Should respect authentication requirements

## Troubleshooting

### Common Issues

#### 1. Infinite Redirects

**Symptom**: Browser shows "too many redirects" error **Cause**: Conflicting
rewrite rules **Solution**: Check that destination paths don't trigger
additional rewrites

#### 2. 404 on App Domain

**Symptom**: `app.quantplex.ai` shows 404 **Cause**: Domain not properly
configured in Vercel **Solution**: Verify domain is added and DNS is correctly
configured

#### 3. Wrong Page Served

**Symptom**: Landing page shows on app domain **Cause**: Rewrite rules not
matching correctly **Solution**: Check host condition syntax and domain
configuration

### Debugging Steps

1. **Check Vercel Function Logs**:

   - Go to Vercel Dashboard → Functions
   - Look for rewrite rule executions

2. **Verify DNS**:

   ```bash
   nslookup quantplex.ai
   nslookup app.quantplex.ai
   ```

3. **Test Headers**:
   ```bash
   curl -I https://quantplex.ai/
   curl -I https://app.quantplex.ai/
   ```

## Future Considerations

### Potential Enhancements

1. **API Subdomain**: Consider `api.quantplex.ai` for backend services
2. **CDN Subdomain**: Use `cdn.quantplex.ai` for static assets
3. **Regional Subdomains**: Implement `eu.quantplex.ai`, `us.quantplex.ai` for
   geographic routing

### Migration Notes

If changing this configuration:

1. Update documentation
2. Test thoroughly in preview deployments
3. Consider redirect rules for existing bookmarks
4. Update any hardcoded URLs in the application

## Related Documentation

- [Authentication Architecture](./authentication-architecture.md) - How auth
  works across domains
- [Landing Page Architecture](./landing-page-architecture.md) - Marketing site
  structure
- [Vercel Deployment](./vercel-deployment.md) - General deployment configuration
