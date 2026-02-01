# Technical Steering

## Core Stack

- **Framework**: Next.js 16.1.1 (App Router)
- **UI Library**: React 19.2.3
- **Language**: TypeScript 5 (strict mode)
- **Styling**: Tailwind CSS 4
- **Code Quality**: Biome (formatter + linter), ESLint

## Key Technical Decisions

### Next.js App Router
- File-based routing using `app/` directory structure
- Server Components by default, Client Components with `"use client"` directive
- Route handlers in `app/api/` for API endpoints

### TypeScript Configuration
- Strict mode enabled
- Path aliases: `@/*` maps to project root
- ES2017 target with modern module resolution

### Styling Approach
- Tailwind CSS utility-first approach
- Gradient backgrounds and modern UI patterns
- Responsive design with mobile-first approach

### Code Formatting
- Biome for formatting and linting
- 2-space indentation, 100 character line width
- Double quotes, semicolons, ES5 trailing commas

## API Patterns

### GitHub API Integration
- Route handlers in `app/api/github/*/route.ts`
- Environment variable for authentication (`GITHUB_TOKEN`)
- Error handling with structured error responses
- Query parameters for owner/repo configuration

### Client-Side Data Fetching
- `useState` and `useEffect` for data management
- `useCallback` for memoized fetch functions
- Loading and error states handled in components

## Audio & Animation

- Web Audio API (`AudioContext`) for sound generation
- CSS animations and transitions for UI feedback
- Client-side state management for game interactions

## Development Tools

- Biome: Formatting and linting
- ESLint: Additional linting rules (Next.js config)
- TypeScript: Type safety and IntelliSense
