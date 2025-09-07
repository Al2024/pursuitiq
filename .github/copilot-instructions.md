# PursuitIQ - AI Coding Guidelines

## Architecture Overview
This is a **Next.js 15** project using the **App Router** with **React 19**. The application follows Next.js conventions with the `app/` directory structure for routing and layout composition.

## Key Technologies & Patterns

### Build System
- **Turbopack**: All build commands use `--turbopack` for faster compilation
  - `npm run dev` → `next dev --turbopack`
  - `npm run build` → `next build --turbopack`
- Use `npm run start` for production server

### Styling (Tailwind CSS v4)
- Import syntax: `@import "tailwindcss";` in `app/globals.css`
- Custom theme variables defined with `@theme inline {}` block
- CSS custom properties for light/dark mode theming in `:root`
- Font variables: `--font-geist-sans`, `--font-geist-mono` (optimized via `next/font`)

### TypeScript Configuration
- Path alias: `@/*` maps to `./*` (configured in `tsconfig.json`)
- Strict TypeScript with `skipLibCheck: true` for performance
- Target: ES2017 with modern module resolution

### Code Quality
- **ESLint**: Flat config format with Next.js core web vitals rules
- Ignores: `node_modules/**`, `.next/**`, `out/**`, `build/**`, `next-env.d.ts`

## Development Workflow

### File Structure Conventions
```
app/
├── layout.tsx      # Root layout with font setup and metadata
├── page.tsx        # Home page component
└── globals.css     # Tailwind imports and custom theme variables

public/             # Static assets (SVGs, images)
```

### Component Patterns
- Use `next/font/google` for font optimization (Geist fonts)
- Image optimization with `next/image` component
- Responsive design with Tailwind's `sm:`, `md:`, `lg:` prefixes
- Dark mode support via CSS custom properties

### Import Patterns
- Prefer relative imports for components within the same directory
- Use `@/*` alias for imports from project root
- Import types explicitly: `import type { Metadata } from "next"`

## Common Tasks

### Adding New Pages
1. Create `app/[route]/page.tsx` following App Router conventions
2. Update `app/layout.tsx` metadata if needed
3. Use `next/font` for any new font requirements

### Styling Components
1. Use Tailwind utility classes in JSX
2. Define custom CSS variables in `app/globals.css` for reusable values
3. Leverage `@theme inline` for project-specific design tokens

### TypeScript Usage
- Enable strict mode for type safety
- Use path aliases (`@/*`) for cleaner imports
- Define component props with `Readonly<{children: React.ReactNode}>` pattern

## Performance Considerations
- Turbopack for fast development builds
- Next.js automatic font optimization
- Image optimization via `next/image` with `priority` prop for above-the-fold images
- ESLint rules enforce core web vitals best practices
