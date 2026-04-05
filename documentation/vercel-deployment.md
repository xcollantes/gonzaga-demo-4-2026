# Vercel Deployment Guide

## Automatic Deployment Setup

### Repository Connection

Connect your repository to Vercel through the dashboard:

```bash
# Install Vercel CLI globally
npm i -g vercel

# Login to Vercel
vercel login

# Link project in your repository root
vercel link
```

### Environment Configuration

Configure environment variables in Vercel dashboard under Project Settings → Environment Variables:

```bash
# Node environment
NEXT_PUBLIC_NODE_ENV=production

# Frontend URL (your Vercel domain)
NEXT_PUBLIC_FRONTEND_URL=https://your-app.vercel.app

# Backend API URL
NEXT_PUBLIC_API_BACKEND_URL=https://your-backend-api.com/

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234

# External Links
NEXT_PUBLIC_PRIVACY_POLICY_URL=https://your-site.com/privacy
NEXT_PUBLIC_TERMS_OF_SERVICE_URL=https://your-site.com/terms
```

## Build Configuration

### Next.js Configuration

The application uses minimal Next.js configuration optimized for production:

```typescript
// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
};

export default nextConfig;
```

### Build Scripts

Production build process uses these package.json scripts:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### Build Optimizations

Vercel automatically handles:
- Static generation for optimal performance
- Edge function deployment for API routes
- Image optimization through Next.js Image component
- Automatic code splitting and tree shaking

## Domain Configuration

### Custom Domain Setup

1. Navigate to Project Settings → Domains
2. Add your custom domain
3. Configure DNS records as provided by Vercel
4. Update `NEXT_PUBLIC_FRONTEND_URL` environment variable

### SSL Certificates

Vercel automatically provisions SSL certificates for:
- .vercel.app subdomains
- Custom domains after DNS verification

## Firebase Production Setup

### Firestore Security Rules

Deploy production-ready security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // AI demos are read-only for authenticated users
    match /ai_demos/{demoId} {
      allow read: if request.auth != null;
    }
  }
}
```

### Firebase Hosting Integration (Optional)

If using Firebase Hosting alongside Vercel:

```json
// firebase.json
{
  "hosting": {
    "public": "out",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## Performance Monitoring

### Vercel Analytics

Enable Vercel Analytics for production insights:

```bash
npm install @vercel/analytics
```

```typescript
// src/pages/_app.tsx
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* existing providers */}
      </QueryClientProvider>
      <Analytics />
    </>
  );
}
```

### Build Performance

Monitor build times and optimization:
- Build duration should remain under 2 minutes
- Static generation leverages `getStaticProps` where possible
- API routes use Edge Runtime for faster cold starts

## Troubleshooting Common Issues

### Environment Variable Access

Ensure all `NEXT_PUBLIC_` prefixed variables are accessible in browser:

```typescript
// Verify in browser console
console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
```

### Build Failures

Common build failure resolutions:

```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check TypeScript compilation
npm run build
```

### Firebase Connection Issues

Verify Firebase configuration in production:

```typescript
// Add to _app.tsx for debugging
console.log('Firebase config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
});
```

## Deployment Verification Checklist

- [ ] All environment variables configured
- [ ] Custom domain DNS configured (if applicable)
- [ ] Firebase security rules deployed
- [ ] Authentication flow tested end-to-end
- [ ] API endpoints responding correctly
- [ ] Static assets loading properly
- [ ] Performance metrics within acceptable ranges