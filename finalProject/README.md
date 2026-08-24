# TRADO — E-Commerce Storefront

TRADO is a production-oriented single-page e-commerce storefront built with **React 19 + Vite**. It
implements the complete shopping lifecycle — browsing, search, sorting & filtering, cart, wishlist,
Stripe-hosted checkout, order history, and an account dashboard — on top of **JWT authentication**
and a **protected route model**.

All server state is owned by **TanStack Query**; the session and a few derived UI values live in
React Context. The UI is styled with **Tailwind CSS v4** design tokens and is fully responsive
(mobile → tablet → desktop), with consistent loading, error, and empty states throughout.

---

## Live Demo

Explore the application and experience the authenticated features without creating an account.

### Demo Account

| Field    | Value             |
| -------- | --------------- |
| Email    | `chatX@gmail.com` |
| Password | `X12345`          |

> **Demo account:** Use these credentials to explore the authenticated features of the application. Please do not change the account credentials or store personal information in this account.

---

## Overview

TRADO is a client-heavy e-commerce SPA that talks to the public **Route Academy e-commerce API**
(`https://ecommerce.routemisr.com/api/v1`). The frontend owns the full user journey: catalog
discovery → cart → secure (Stripe-managed) checkout → order tracking.

Because the project is intentionally **server-state heavy** (products, categories, brands, cart,
wishlist, orders), it demonstrates a clean separation between **server state** — fetched, cached,
and mutated via TanStack Query — and **client state** — the JWT session and a few derived UI values
held in React Context. This separation is the central architectural decision of the codebase.

---

## Features

Every feature below is implemented in the current source code.

### Shopping Experience

- **Home** — autoplaying hero slider (Swiper), a responsive categories slider, a “Recent Products”
  grid, and a **Recently Viewed** strip hydrated from `localStorage`.
- **Product listing** (`/products`) — server-side pagination, sorting (Newest / Price: low→high /
  Price: high→low / Top Rated), and filters for **category**, **brand**, and **price range** — all
  encoded in the URL so views are shareable and survive back/forward navigation.
- **Search** — client-side filtering over one cached full-catalog request, debounced with React’s
  `useDeferredValue` (see the **Data Layer** note for why this workaround exists).
- **Product details** (`/products/:id`) — quantity picker (capped), out-of-stock awareness, related
  products from the same category, copy-link sharing, and breadcrumbs.
- **Categories** — a categories page (`/categories`) and a per-category product page
  (`/categories/:id`).
- **Wishlist** (`/wishlist`, protected) — server-backed via `GET`/`POST`/`DELETE /wishlist`, with a
  shared toggle used from product cards, product details, and the wishlist page.
- **Cart** (`/cart`, protected) — add / increment / decrement / remove / empty, with per-row pending
  states and guards against duplicates or overlapping mutations. The server cart is the single
  source of truth and also drives the Navbar badge count.

### Guest behavior

- Browsing, search, and product details are fully public.
- Add-to-cart and wishlist actions from guests are guided to `/login?returnTo=…` instead of firing
  doomed authenticated requests.

### Authentication & session

- **Register** (`/register`) and **Login** (`/login`) with Formik + Yup validation; a successful
  signup can sign the user in immediately.
- **JWT** stored in `localStorage` (`userToken`) and decoded centrally inside `UserContext` — page
  components never decode tokens themselves.
- **Expired tokens are detected at application startup** and cleared before the UI mounts.
- **Protected routes** guard cart, checkout, orders, order details, profile, and wishlist.
  Unauthenticated visitors are redirected to `/login` with a sanitized `returnTo` so they land back
  on the page they originally requested after signing in (open redirects are blocked).
- **Centralized session expiry** — an Axios response interceptor surfaces any *unexpected* `401` to
  `UserContextProvider`, which performs one canonical teardown of React state, `localStorage`, and
  the TanStack Query cache, then reloads `/login`.
- **Logout** — confirmation dialog (portaled, Escape-to-close, backdrop click to cancel), then a
  clean redirect home.

### Orders & checkout

- **Checkout** (`/checkout`, protected) — validated shipping form (details, city, phone with an
  Egyptian phone-number rule), a read-only order summary built from the shared cart cache, and an
  empty-cart guard. Submitting creates a **Stripe-hosted checkout session** and redirects the user
  to the secure payment page.
- **Order history** (`/orders`, protected) — client-side pagination of the user’s orders, newest
  first, with **payment status** (Paid / Pending) and **delivery status** (Delivered / Processing)
  badges derived from the API’s `isPaid` / `isDelivered` flags.
- **Order details** (`/orders/:id`, protected) — resolved from the cached user-orders list (the API
  exposes no single-order endpoint), so it is safe on refresh and direct navigation, with router
  state used for the fast path.
- **Profile** (`/profile`, protected) — account hero and clickable activity stat cards (wishlist /
  cart / orders counts re-derived from existing caches), plus a recent-orders list.

### UI/UX & platform

- **Responsive layout** — mobile-first Tailwind; the fixed Navbar publishes its real rendered
  height to a CSS variable (`--navbar-height`) via `ResizeObserver`, so page content is always
  correctly offset below it on every breakpoint and auth state.
- **Reusable UI primitives** — `Button`, floating-label `Input`, `Badge`, `Breadcrumb`, `ErrorState`,
  skeleton loaders, `PageLoader`, and the shared `ProductCard` presentation component.
- **Consistent states** — loading skeletons, error states with retry, and empty states across every
  page, plus a global offline banner.
- **Accessibility** — labelled controls, `aria-current` navigation, `aria-pressed` toggles,
  `aria-busy` loading announcements, `aria-invalid` / `aria-describedby` form errors, keyboard
  Escape handling, `prefers-reduced-motion` support, and touch-friendly (≥ 44px) targets.
- **Performance** — route-level code splitting (every page is its own chunk) and development-only
  React Query Devtools, so the production bundle ships none of the tooling.

---

## Tech Stack

| Technology                 | Purpose                    |
| -------------------------- | -------------------------- |
| React 19                   | UI                         |
| Vite 8                     | Build tooling              |
| React Router 7             | Client-side routing        |
| TanStack Query v5          | Server-state management    |
| Axios                      | HTTP client                |
| Tailwind CSS v4            | Styling & design tokens    |
| Formik + Yup               | Forms and validation       |
| jwt-decode                 | JWT parsing and decoding   |
| Swiper                     | Hero & categories sliders  |
| FontAwesome                | Icons                      |
| React Hot Toast            | Notifications              |

---

## Architecture

```
src/
├── api/                 # Axios instance + one module per API resource (auth, products,
│                        #   brands, categories, cart, orders, wishlist) + error helpers
│                        #   and the unauthorized-session bridge
├── Context/             # UserContextProvider (JWT session, logout, centralized 401 teardown)
│                        #   CartContextProvider (derived cart badge count)
├── hooks/               # One React Query hook per resource + shared behaviors
│                        #   (useAddToCart, useToggleWishlist, useWishlistCardProps)
├── lib/                 # QueryClient config, currency formatting, recently-viewed storage
├── components/          # Route pages + UI primitives (Button, Input, Badge, ProductCard,
│                        #   ErrorState, skeletons, Breadcrumb)
├── App.jsx              # Router tree (public + protected groups, lazy pages)
├── main.jsx             # Root render, QueryClientProvider
└── index.css            # Tailwind entry + TRADO design tokens
```

The most important separation:

- **Server state lives exclusively in TanStack Query.** Context holds only authentication session
  state and values *derived* from those query caches (e.g. the Navbar badge count). Every mutation
  invalidates its resource key, so there is no duplicated fetching or stale-dup logic.
- **Auth mutations happen only inside the auth provider.** Components never write auth keys to
  `localStorage` directly, and the Axios auth header is attached centrally in one interceptor.
- **User-scoped queries** (e.g. `['orders', userId]`) include the user id in the query key, and
  logout / session teardown clears the whole Query cache so data can never leak between accounts.

---

## Data Layer

A single shared **Axios instance** (`api/axiosInstance.js`) is the only place that knows the API
base URL. A request interceptor attaches the auth token (the Route API expects it in a custom
`token` header) to every outgoing request, so individual modules never re-build it. A response
interceptor normalizes *unexpected* `401`s into the centralized auth-teardown flow.

**API service modules** (`src/api/`) wrap HTTP calls per resource. A shared `getApiErrorMessage`
helper normalizes Axios/API errors into safe, user-facing messages used across pages and mutations.

**React Query hooks** (`src/hooks/`) map each resource to a query and its mutations. Query keys are
deliberately scoped:

- `['products', { page, sort, category, brand, price }]` — every result-affecting filter is part of
  the key, so the cache stays correct per browse state, and pagination keeps the previous page on
  screen via `placeholderData` while the next loads.
- `['cart']`, `['wishlist']` — single shared keys; mutations invalidate them so the Navbar badge,
  Cart page, Checkout summary, and Profile all read one cache.
- `['orders', userId]`, `['related-products', categoryId, productId]` — user/product-scoped so cache
  entries cannot collide.

**Cache policy** is tuned in `lib/queryClient.js` (retry once, no window-focus refetch, default
5-minute stale time), with resource-specific overrides where data churns faster (e.g. a 30-second
stale time on the cart).

**Search workaround** — the upstream API’s `keyword` param is documented as non-functional, so
search runs client-side over **one cached full-catalog request**, debounced with `useDeferredValue`.
This is a deliberate, documented arrangement — not a fabricated server contract.

---

## Routing

Routes are declared in `src/App.jsx` with React Router `createBrowserRouter`. Public routes live
under a shared `Layout` (Navbar + Footer + outlet); cart, checkout, orders, order details, profile,
and wishlist are nested under a single `ProtectRoutes` guard.

| Route             | Access    | Purpose                                   |
| ----------------- | --------- | ----------------------------------------- |
| `/`               | Public    | Home                                      |
| `/products`       | Public    | Product listing + search / sort / filters |
| `/products/:id`   | Public    | Product details                            |
| `/categories`     | Public    | Categories                                |
| `/categories/:id` | Public    | Category product grid                      |
| `/login`          | Public    | Sign in (redirects home if signed in)      |
| `/register`       | Public    | Create account (redirects home if signed in) |
| `/allorders`      | Public    | Permanent redirect to `/orders` (see note) |
| `/cart`           | Protected | Shopping cart                              |
| `/checkout`       | Protected | Checkout + shipping form + Stripe redirect |
| `/orders`         | Protected | Order history                              |
| `/orders/:id`     | Protected | Order detail                               |
| `/profile`        | Protected | Account dashboard                          |
| `/wishlist`       | Protected | Wishlist                                   |
| `*`               | Public    | 404 NotFound page                          |

> **`/allorders` note** — the checkout API builds its Stripe `success_url` server-side by appending
> a fixed path to the site origin. This route has no page; it permanently redirects to the canonical
> `/orders` history page so post-payment users stay in the app. `/orders` remains the only
> order-list route.

---

## Authentication & Protected Routes

1. **Register / Login** — Formik + Yup validate client-side; on success the returned JWT is passed
   to `saveUserToken` in `UserContextProvider`, which decodes it, persists it to `localStorage`, and
   establishes the in-memory session. Login enforces no client-side password pattern, so valid
   credentials are never rejected before reaching the server.
2. **Token validation** — decoded once in the provider; expired or unparseable tokens are rejected at
   startup. `/login` and `/register` redirect to `/` when a session already exists.
3. **Protected routes** — `ProtectRoutes` reads `userToken` and, when missing, redirects to
   `/login?returnTo=<current>`. `Login` sanitizes `returnTo` (internal path only) so open redirects
   are impossible.
4. **Centralized session expiry** — an unexpected `401` from any request triggers one teardown that
   clears React state, `localStorage`, and the TanStack Query cache, with a full-page replacement to
   `/login` for a completely clean reload.

---

## Cart & Wishlist

- **Cart** is fully server-synced. Add-to-cart increments via one `POST /cart` per unit, so a
  requested quantity never races under one shared pending state. Quantity updates and deletes are
  guarded so two mutations can’t overlap on the same row, and “Empty Cart” is protected by a
  confirmation dialog. The Navbar badge and Checkout summary both derive from the single `['cart']`
  cache.
- **Wishlist** is server-backed. Toggling is centralized in one shared hook used by product cards,
  the product detail page, and the wishlist page, with identical guest-handling and loading UX
  everywhere. Guests are sent to `/login?returnTo=…`.
- **Guest behavior** — browsing, search, and product details are fully public; add-to-cart and
  wishlist actions guide guests to login instead of firing doomed authenticated requests.

---

## Checkout Flow

Protected pages rely on the shared cart cache, so refresh and direct navigation are always safe. On
`/cart` the user edits quantities or empties the cart, then proceeds to **Checkout**, which validates
a shipping address (details, city, phone) and posts a `createCheckoutSession` request against the
user’s cart id. On success the browser is redirected to the **Stripe-hosted payment page** (Stripe
is not embedded client-side). The payment and delivery states shown across `/orders` come directly
from the API’s `isPaid` / `isDelivered` flags.

> Checkout blocks empty carts — an empty-cart guard shows a message and redirects back to the catalog.

---

## Design System

The UI is built on **Tailwind CSS v4** with a small, curated set of design tokens defined in
`src/index.css` (`@theme`).

- **Brand color** — a single green scale (`primary-*`), plus semantic `success` / `warning` /
  `error` tokens and a `background` / `surface` / `line` / `strong` / `muted` neutral set.
- **Radius** — a fixed hierarchy (`rounded-md` → `xl` → `2xl` → `3xl` → `full`); elevation is a
  constrained `shadow-sm` → `shadow-xl` range, with colored focus rings (`ring-4` +
  `ring-primary-200`) on interactive controls.
- **Typography** — the Inter typeface; relaxed leading and tight tracking on display headings.
- **Glass** — a `.glass` utility (translucent white + `backdrop-blur`) reserved for the Navbar, the
  hero overlay card, and floating/profile accents.
- **Focus states** — a global `:focus-visible` outline in brand green plus `focus-visible:ring-4` on
  buttons and inputs.
- **Reusable components** — `Button` (primary / outline / ghost / danger / dangerOutline, with a
  loading spinner), floating-label `Input` (with accessible error association), `Badge`, `Breadcrumb`,
  `ErrorState` (alert + optional retry), skeleton loaders, `PageLoader`, and one shared `ProductCard`.

---

## Responsive Design

The layout is **mobile-first**.

- **Mobile** — a hamburger opens a slide-out menu sheet with body scroll lock, Escape-to-close, and
  ≥ 44px touch targets; product grids become 2 columns; the Navbar publishes its real height to
  `--navbar-height` so `main` is always offset correctly regardless of breakpoint or auth state.
- **Tablet** — grids expand (`md:` and `lg:` breakpoints) and the filter panel becomes a card stack.
- **Desktop** — full multi-column product grids, a complete Navbar with icons and labels, and inline
  filter and pagination controls.
- Confirmation dialogs, toasts, and the offline banner are viewport-appropriate at every size.

---

## Project Structure

See the tree in **Architecture**. Highlights: `src/api/` holds every backend call; `src/hooks/`
holds every TanStack Query hook; `src/Context/` holds auth + derived client state; and
`src/components/` holds one folder per route/area (`Navbar`, `Products`, `Cart`, `Checkout`,
`Orders`, `Profile`, `Wishlist`, …) plus a shared `ui/` folder for reusable primitives.

### Environment Variables

**No environment variables are required.** The public API base URL is defined inline in
`src/api/axiosInstance.js`, and the app runs against that endpoint out of the box. The build
references no `.env` file.

---

## Getting Started

```bash
git clone https://github.com/bassim-ghaly-14/route-course.git
cd finalProject
npm install
npm run dev
```

The app runs against the public Route Academy API — no backend or keys are required.

### Available Scripts

| Script            | Description                                      |
| ----------------- | ------------------------------------------------ |
| `npm run dev`     | Start the Vite dev server with hot module reload |
| `npm run build`   | Create a production build (per-route code-split chunks) |
| `npm run preview` | Preview the production build locally             |
| `npm run lint`    | Run ESLint over `.js` / `.jsx` files             |

---

## Validation

- **ESLint** — `npm run lint` passes with no errors or warnings.
- **Production build** — `npm run build` completes successfully; the output confirms route-level
  code splitting (one chunk per page).
- **Automated tests** — **none.** There is no test runner or test suite configured for this project
  yet.

---

## Technical Highlights

- **Centralized API layer** — one shared Axios instance that centrally attaches auth headers and
  routes unexpected `401`s straight into the session teardown, keeping page and mutation code thin
  and consistent.
- **TanStack Query server-state architecture** — query-key-scoped caching, mutation-driven
  invalidation, `placeholderData` for seamless pagination, and a single cache shared by many
  consumers (Navbar badge, Cart, Checkout summary, Profile).
- **Protected routing & session safety** — sanitized `returnTo`, expired-token detection at startup,
  one canonical teardown clearing React state + `localStorage` + the Query cache, and user-scoped
  query keys that prevent cross-account data leakage.
- **Auth encapsulated** — only `UserContextProvider` persists/clears auth; every component is an
  honest consumer of context rather than a writer to `localStorage`.
- **Reusable UI primitives** — consistent `Button` / `Input` / `Badge` / error / skeleton / empty
  states across every page for a coherent, accessible surface.
- **Documented search workaround** — a single cached catalog request debounced with
  `useDeferredValue`, applied because the upstream `keyword` param is non-functional.
- **Performance** — route-level code splitting and dev-only Devtools keep the production bundle lean;
  the navbar top offset is driven by real rendered height, not hardcoded guesses.
- **Responsive + accessible** — mobile-first, keyboard- and screen-reader-friendly, and
  reduced-motion aware.

---

## Future Improvements

There is no automated test suite yet — a Vitest/Jest unit + integration layer (e.g. React Testing
Library) would harden the current feature set. Beyond that, realistic follow-ups include a
backend-driven currency / price configuration (prices are currently `EGP`-formatted in one utility)
and an in-app (non-redirect) payment flow once the upstream API supports it.

---

*Documentation reflects the current repository — see the Architecture Overview for the canonical
layout and the Data Layer section for how the app stays consistent across many routes.*