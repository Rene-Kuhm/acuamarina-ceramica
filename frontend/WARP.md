# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is the frontend for Aguamarina Mosaicos, an e-commerce platform for ceramic tiles and mosaics. Built with Next.js 15 using the App Router, React 19, TypeScript, and Tailwind CSS. The project features a modern, responsive design with support for themes and state management.

## Development Commands

### Core Commands
```powershell
# Install dependencies
npm install

# Start development server with Turbopack
npm run dev

# Build for production with Turbopack
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```

### Development Server
- Development runs on `http://localhost:3000`
- Uses Next.js Turbopack for faster development builds
- Hot reload enabled for all code changes

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with TypeScript
- **Styling**: Tailwind CSS v4 with custom design system
- **Component Library**: Radix UI primitives with custom shadcn/ui components
- **State Management**: 
  - Zustand for client-side state (cart, etc.)
  - TanStack Query for server state management
- **HTTP Client**: Axios with interceptors for authentication
- **Icons**: Lucide React
- **Theme**: next-themes for dark/light mode support

### Directory Structure
```
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage
│   ├── productos/         # Products pages
│   └── globals.css        # Global styles with theme variables
├── components/            # React components
│   ├── ui/               # Base UI components (shadcn/ui)
│   ├── layout/           # Layout components (Header, Footer)
│   ├── productos/        # Product-related components
│   └── providers/        # Context providers
├── lib/                  # Utilities and business logic
│   ├── api/             # API client and endpoints
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Zustand stores
│   └── utils/           # Utility functions
```

### Design System
- **Primary Colors**: Cyan/Aquamarina theme (`#0891b2`, `#06b6d4`)
- **Typography**: Geist font family (sans and mono variants)
- **Components**: Custom shadcn/ui components with Aguamarina branding
- **Responsive**: Mobile-first design with Tailwind breakpoints
- **Dark Mode**: Supported via next-themes with custom color variables

### State Management Patterns
- **Server State**: TanStack Query with custom hooks (`useProducts`, `useAuth`, etc.)
- **Client State**: Zustand stores for cart, user preferences
- **Form State**: React Hook Form for complex forms
- **URL State**: Next.js routing and search params for filters/pagination

### API Integration
- **Base URL**: Configurable via `NEXT_PUBLIC_API_URL` environment variable
- **Authentication**: JWT tokens with automatic refresh via Axios interceptors
- **Error Handling**: Global error boundaries and API error interceptors
- **Types**: Full TypeScript interfaces for all API responses

### Component Architecture
- **UI Components**: Located in `components/ui/` - reusable, unstyled base components
- **Feature Components**: Organized by domain (productos/, layout/)
- **Composition**: Heavy use of compound components and render props
- **Accessibility**: Built on Radix UI primitives with ARIA support

## Key Development Patterns

### Custom Hooks Convention
- API hooks: `useProducts()`, `useCategorias()` - server state with TanStack Query
- Store hooks: `useCart()`, `useAuth()` - client state with Zustand  
- Filter hooks: `useProductFilters()` - URL state management
- All hooks export consistent interfaces and loading states

### Component File Structure
- Index files re-export components for cleaner imports
- Components co-located with related utilities
- TypeScript interfaces defined inline or in dedicated types files

### API Layer
- Centralized API client with interceptors
- Typed request/response interfaces
- Consistent error handling across all endpoints
- RESTful endpoints following `/products`, `/categories` pattern

### Styling Approach
- Tailwind utility classes with custom design tokens
- CSS custom properties for theming
- Component variants using `class-variance-authority`
- Global styles in `app/globals.css` with theme-aware variables

## Environment Configuration

### Required Environment Variables
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/v1  # Backend API URL
```

### TypeScript Configuration
- Path mapping: `@/*` points to project root
- Strict mode enabled with incremental compilation
- Next.js plugin for optimal type checking

## Testing Approach
Currently no test setup - when adding tests, recommend:
- **Unit Tests**: Jest + React Testing Library for components
- **Integration Tests**: MSW for API mocking
- **E2E Tests**: Playwright for critical user journeys

## Performance Considerations
- Next.js Turbopack for faster development builds
- Image optimization with `next/image`
- Font optimization with `next/font`
- TanStack Query for efficient data fetching and caching
- Component lazy loading for large feature sets

## Backend Integration
- Expects REST API at configured base URL
- JWT-based authentication with refresh token flow
- Standard CRUD operations for products, categories, cart, orders
- File uploads for product images (implementation pending)