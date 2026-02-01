# Structure Steering

## Directory Organization

### App Router Structure
```
app/
  ├── page.tsx              # Root page
  ├── layout.tsx            # Root layout with Navigation
  ├── globals.css           # Global styles
  ├── components/           # Shared components
  │   └── Navigation.tsx
  ├── [feature]/            # Feature routes
  │   └── page.tsx
  └── api/                  # API routes
      └── [service]/
          └── [resource]/
              └── route.ts
```

### Pattern: Feature-First Routing
- Each feature gets its own directory under `app/`
- Route files named `page.tsx` for pages, `route.ts` for API endpoints
- Shared components in `app/components/`

### Pattern: API Route Organization
- API routes follow RESTful structure: `app/api/[service]/[resource]/route.ts`
- Example: `app/api/github/commits/route.ts`
- Route handlers export HTTP method functions (`GET`, `POST`, etc.)

## Naming Conventions

### Files
- **Pages**: `page.tsx` (lowercase)
- **API Routes**: `route.ts` (lowercase)
- **Components**: PascalCase (e.g., `Navigation.tsx`)
- **Types**: PascalCase (e.g., `type Choice = ...`)

### Components
- Default export for page components
- Named exports for reusable components
- Component names match file names

### Variables & Functions
- camelCase for variables and functions
- PascalCase for types and interfaces
- Descriptive names in Japanese comments where helpful

## Import Patterns

### Next.js Imports
```typescript
import Link from "next/link";
import { NextResponse } from "next/server";
import type { Metadata } from "next";
```

### React Imports
```typescript
import { useState, useEffect, useCallback } from "react";
```

### Local Imports
- Relative imports for same-level or nested files
- Absolute imports via `@/*` alias when appropriate
- Component imports: `import Navigation from "./components/Navigation";`

### Type Imports
- Use `import type` for type-only imports
- Inline types for simple, local types

## Component Patterns

### Client Components
- Mark with `"use client"` directive at top
- Use hooks (`useState`, `useEffect`, `useCallback`, `useRef`)
- Handle interactivity and browser APIs

### Server Components
- Default for pages and layouts
- No client-side JavaScript unless needed
- Can fetch data directly

### Layout Pattern
- Root layout wraps all pages
- Navigation component included in root layout
- Metadata exported from layout or page

## API Route Patterns

### Route Handler Structure
```typescript
export async function GET(request: Request) {
  // Parse query params
  // Fetch data
  // Return NextResponse.json()
}
```

### Error Handling
- Try-catch blocks for async operations
- Structured error responses with status codes
- Console logging for debugging

## State Management

- **Local State**: `useState` for component-level state
- **No Global State**: No Redux/Zustand (simple app doesn't require it)
- **Server State**: Fetch in components or route handlers

## File Organization Principles

- **Co-location**: Related files stay together (e.g., feature directory)
- **Separation**: API routes separate from pages
- **Shared Code**: Common components in `app/components/`
