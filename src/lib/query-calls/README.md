# Query Calls

This directory contains modularized API query functions and hooks using TanStack
Query (React Query). Each file is dedicated to a specific API endpoint or
related group of endpoints.

## Overview

The query system in this project follows a consistent pattern:

- Each file exports standalone API functions for direct data fetching
- Each file also exports custom React hooks that wrap these functions with
  TanStack Query
- This separation enables both programmatic data access and React component integration

## Benefits of Modularization

- **Maintainability**: Each API endpoint has its own dedicated file with clear responsibility
- **Reusability**: Query logic can be reused across components
- **Caching**: TanStack Query provides automatic caching, deduplication, and
  automatic re-querying
- **Consistency**: Standard patterns for error handling, authentication, and
  data typing
- **Type Safety**: TypeScript interfaces ensure proper data handling

## How to Use

### Using Query Hooks in Components

```tsx
import { useProfileQuery } from "@/lib/query-calls/profile-query"

function ProfileComponent() {
  const { data, isLoading, error } = useProfileQuery()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      <h1>Welcome, {data?.name}</h1>
      {/* Render component with data */}
    </div>
  )
}
```

### Using Direct API Functions

```tsx
import { getProfileData } from "@/lib/query-calls/profile-query"

async function fetchUserProfile() {
  const profileData = await getProfileData()
  // Process data programmatically
}
```

### Using Mutation Hooks

```tsx
import { useUpdateProfileMutation } from "@/lib/query-calls/profile-query"

function ProfileEditForm() {
  const { mutate, isLoading } = useUpdateProfileMutation()

  const handleSubmit = (formData) => {
    mutate(formData, {
      onSuccess: (data) => {
        // Handle successful update
      },
      onError: (error) => {
        // Handle error
      },
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save"}
      </button>
    </form>
  )
}
```

## Creating New Query Files

When adding new API endpoints, follow this pattern:

1. Create a new file named `[resource]-query.ts`
2. Export standalone API functions (e.g., `getResourceData`, `updateResourceData`)
3. Export query hooks (e.g., `useResourceQuery`, `useUpdateResourceMutation`)
4. Add proper TypeScript interfaces and documentation

## Query Client Configuration

The global query client is configured in `@/lib/query-client.ts` with default options:

- Authentication is handled automatically
- Errors are properly processed
- Custom behaviors for 401 unauthorized responses
- Default caching strategy
