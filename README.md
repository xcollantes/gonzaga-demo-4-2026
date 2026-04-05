# QuantPlex Client Portal

A client portal interface for QuantPlex AI products, built with Next.js, Firebase Auth, and Tailwind CSS.

## Features

- User authentication with Firebase Auth (email/password and Google OAuth)
- Required onboarding flow for new users
- User profile management in Firestore
- Responsive design with mobile-friendly navigation
- Toast notification system for user feedback
- Stripe integration for subscription management
- Modern UI components with shadcn/ui and Radix primitives

## Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS v4 with CSS custom properties
- **Authentication**: Firebase Auth
- **Database**: Firestore
- **State Management**: React Query for server state, React Context for client state
- **UI Components**: shadcn/ui with Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation
- **Payment Processing**: Stripe integration

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project with Authentication and Firestore enabled

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd client-portal
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp env.example .env
```

Fill in your Firebase configuration values in `.env`:

```bash
NEXT_PUBLIC_NODE_ENV=development
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
NEXT_PUBLIC_API_BACKEND_URL=http://localhost:8000/

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCDEF1234

# External Links
NEXT_PUBLIC_PRIVACY_POLICY_URL=https://your-site.com/privacy
NEXT_PUBLIC_TERMS_OF_SERVICE_URL=https://your-site.com/terms
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com/)
2. Enable Authentication with Email/Password and Google providers
3. Create a Firestore database
4. Set up the following collections:

### Firestore Collections

**users collection:**
```
users/
  ├── [user_id]/
  │   ├── firstName: string
  │   ├── lastName: string
  │   ├── email: string
  │   ├── phoneNumber?: string
  │   ├── onboardingComplete: boolean
  │   ├── subscription_plan?: string
  │   ├── subscription_status?: string
  │   └── stripe/
  │       ├── stripe_customer_id: string
  │       ├── stripe_subscription_id: string
  │       └── payment_method: object
```

**ai_demos collection:**
```
ai_demos/
  ├── [demo_id]/
  │   ├── title: string
  │   ├── description: string
  │   ├── imageUrl: string
  │   ├── demoUrl: string
  │   ├── category: string
  │   └── isAvailable: boolean
```

## User Authentication & Onboarding

The application enforces a complete onboarding flow:

1. User signs up with email/password or Google OAuth
2. System checks if user profile exists in Firestore
3. New users are redirected to onboarding wizard
4. Onboarding collects essential profile information
5. Profile is created in Firestore upon completion
6. Users gain access to the main dashboard

Existing users with complete profiles bypass onboarding and go directly to the dashboard.

## Development

### Scripts

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Create production build
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Development Features

- Hot reloading with Turbopack
- TypeScript strict mode enabled
- ESLint configuration with Next.js rules
- Automatic code formatting
- React Query DevTools (development only)

## Deployment

Deploy to Vercel with automatic builds:

1. Connect your repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Automatic deployments on push to main branch

For detailed deployment instructions, see [documentation/vercel-deployment.md](documentation/vercel-deployment.md).

## Documentation for Developers

Comprehensive technical documentation is available in the `documentation/` directory:

- **[Vercel Deployment](documentation/vercel-deployment.md)** - Production deployment setup and configuration
- **[Color Palette Management](documentation/color-palette-management.md)** - Tailwind CSS v4 color system and theming
- **[Build Philosophy](documentation/build-philosophy.md)** - Architectural decisions and design patterns
- **[Authentication Architecture](documentation/authentication-architecture.md)** - Firebase auth integration and onboarding flow
- **[Component System](documentation/component-system.md)** - shadcn/ui component patterns and usage
- **[Data Fetching Patterns](documentation/data-fetching-patterns.md)** - React Query integration and API management

## License

This project is private and proprietary to QuantPlex.
