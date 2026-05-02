# Mastering GitHub Copilot Across the SDLC

This repository is a hands-on lab focused on learning GitHub Copilot workflows across the software development lifecycle (SDLC).  
The practice application is **The Daily Harvest**, a React + TypeScript ecommerce sample used throughout the exercises.

## What This Project Is For

The lab is designed to help developers:

- onboard faster in unfamiliar codebases using Copilot Chat Ask mode
- use Edit mode and Agent mode for implementation and refactoring tasks
- improve test coverage and code quality with AI assistance
- explore agentic workflows, MCP integration, and Copilot customization

Primary learning flow is under `Instructions/Labs/`, especially:

- `Lab-1-Getting-Started.md`
- `Lab-2-Understanding-Project.md`
- `Lab-3` through `Lab-7` for deeper workflows

## Repository Organization

```text
copilot-lab-ms-gft/
+-- README.md
+-- masterdoc.json
+-- Instructions/
|   `-- Labs/
|       +-- Lab-1-Getting-Started.md
|       +-- Lab-2-Understanding-Project.md
|       +-- Lab-3-Code-Editing.md
|       +-- Lab-4-Agent-Mode.md
|       +-- Lab-5-Agentic-Coding.md
|       +-- Lab-6-MCP.md
|       `-- Lab-7-Customizing-Copilot.md
+-- AdditionalLearning/
|   `-- Admin-Metrics.md
+-- media/                   # Lab screenshots and guide assets
`-- eCommApp/                # The Daily Harvest sample web app
```

## Application Overview (`eCommApp`)

The sample app is a client-side ecommerce storefront with:

- home, products, cart, login, and admin pages
- static product catalog from JSON files in `public/products/`
- cart state managed via React Context
- simple checkout confirmation modal
- review modal with client-side review list updates

### App Structure

```text
eCommApp/
+-- public/
|   `-- products/
|       +-- apple.json
|       +-- grapes.json
|       +-- orange.json
|       +-- pear.json
|       `-- productImages/
`-- src/
    +-- App.tsx
    +-- main.tsx
    +-- components/
    +-- context/
    +-- types/
    +-- utils/
    `-- test/
```

## Lab 2-Oriented Onboarding Checklist (Ask Mode)

Use `Lab-2-Understanding-Project.md` as the step-by-step guide. Core Ask mode questions:

1. Purpose:
   - `What is the main purpose of this application?`
2. Structure:
   - `How is this project structured?`
3. Tech stack:
   - `What frameworks and libraries does this project depend on?`
4. Build/run:
   - `How do I build and run this project locally?`
5. Testing:
   - `How is this project tested and where are coverage gaps?`

For model comparison (from Lab 2):

1. `What is [technology] and how does it work?`
2. `Explain [technology] and its role in this project`
3. `Analyze the architectural benefits of using [technology] in this context`

## Technologies and Frameworks

### React

- What it is/how it works:
  component-based UI library with state-driven rendering.
- Role in this project:
  all pages and UI behavior are React components.
- Architectural benefits here:
  reusable UI, simple page composition, straightforward state flow.

### TypeScript

- What it is/how it works:
  static type layer over JavaScript with compile-time checks.
- Role in this project:
  typed models for products, reviews, users, and cart interactions.
- Architectural benefits here:
  safer refactors, clearer contracts, better Copilot code generation context.

### Vite

- What it is/how it works:
  dev server + build tool optimized for modern frontend workflows.
- Role in this project:
  local dev server (`3000`), production build, test integration.
- Architectural benefits here:
  fast feedback loop and low configuration overhead for labs.

### React Router

- What it is/how it works:
  client-side route mapping for single-page applications.
- Role in this project:
  routes `/`, `/products`, `/cart`, `/login`, `/admin`.
- Architectural benefits here:
  clean navigation boundaries between feature pages.

### Vitest + Testing Library + jsdom

- What they are/how they work:
  test runner, UI-focused assertions, browser-like test environment.
- Role in this project:
  component/unit testing and coverage reporting.
- Architectural benefits here:
  fast, maintainable tests aligned with user-visible behavior.

### ESLint

- What it is/how it works:
  static analysis for code quality and consistency.
- Role in this project:
  lint script enforces TS/TSX standards.
- Architectural benefits here:
  catches issues early and improves generated code quality review.

## Quick Start

Prerequisites:

- Node.js 18+ (18 or 20 recommended)
- npm

From repository root:

```bash
cd eCommApp
npm install
npm run dev
```

Open: `http://localhost:3000`

### Build and Preview

```bash
npm run build
npm run preview
```

## Testing

Available scripts:

```bash
npm run test
npm run test:run
npm run test:ui
npm run test:coverage
```

Test config is in `eCommApp/vite.config.ts` under the `test` block.

## Current Coverage Snapshot

Most recent measured result in this workspace:

- Statements: `10.49%`
- Branches: `33.33%`
- Functions: `29.41%`
- Lines: `10.49%`

Current test files:

- `src/components/CartPage.test.tsx` (only test file)

Low or missing coverage areas:

- `src/components/ProductsPage.tsx`
- `src/components/LoginPage.tsx`
- `src/components/AdminPage.tsx`
- `src/components/ReviewModal.tsx`
- `src/components/CheckoutModal.tsx`
- `src/context/CartContext.tsx`
- `src/utils/helpers.ts`
- `src/App.tsx`, `src/main.tsx`, and basic layout components

## Best Next Test Candidates

Recommended order for fastest coverage improvement:

1. `ProductsPage`:
   loading, fetch success/error, add-to-cart enabled/disabled, review submission.
2. `CartContext`:
   add new item, increment existing item, clear cart.
3. `CartPage`:
   empty cart, checkout modal cancel/confirm, order processed branch.
4. `LoginPage`:
   valid vs invalid credentials path.
5. `AdminPage`:
   number parsing, invalid input branch, reset/end sale behavior.
6. `helpers.ts`:
   direct unit tests for `formatPrice`, `calculateTotal`, `validateEmail`.

## Troubleshooting

### PowerShell blocks `npm` script execution

If you hit execution policy errors on Windows PowerShell, run commands with:

```powershell
npm.cmd run test:coverage
```

Same workaround applies to other npm scripts (`npm.cmd run dev`, etc.) if needed.

### Copilot plan/feature availability

If Copilot features do not appear as expected in the web UI, verify current account and plan status in official GitHub Copilot docs and changelog, since eligibility and sign-up availability can change over time.

## Key Files for New Developers

- `eCommApp/src/main.tsx` - React bootstrap and router wrapper
- `eCommApp/src/App.tsx` - route definitions
- `eCommApp/src/context/CartContext.tsx` - shared cart state
- `eCommApp/src/components/ProductsPage.tsx` - product loading and cart actions
- `eCommApp/src/components/CartPage.tsx` - checkout and processed order states
- `eCommApp/vite.config.ts` - dev server, build, test config
- `eCommApp/package.json` - scripts and dependency list

## Suggested Workflow for New Team Members

1. Complete `Lab-1` and `Lab-2`.
2. Run app locally and explore user flows.
3. Run tests and coverage.
4. Add tests to one high-priority uncovered area.
5. Use Ask/Edit/Agent modes intentionally based on task type.
