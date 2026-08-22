# TRADO — E-Commerce Storefront

A full-featured e-commerce single-page app built with React, consuming the
[Route Academy e-commerce API](https://ecommerce.routemisr.com/api/v1).

## Features

- Browse products and categories, view product details with related products
- Authentication (register/login) with protected routes
- Persistent cart (add/update/remove items, empty cart) synced with the API
- Stripe-hosted checkout session
- Order history and order detail views
- Offline detection banner
- Responsive UI built with Tailwind CSS

## Tech Stack

- **React 19** + **Vite**
- **React Router 7** for routing and protected routes
- **TanStack Query** for server-state (products, product details, related products)
- **React Context** for auth and cart state
- **Formik + Yup** for form handling and validation
- **Axios** for HTTP requests (with a shared instance that auto-attaches the auth token)
- **Tailwind CSS 4** for styling
- **Swiper** for carousels

## Getting Started

```bash
npm install
npm run dev
```

The app runs against the public Route Academy API — no environment variables
or backend setup are required to run it locally.

### Available Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint

## Project Structure

```
src/
├── api/            # Shared axios instance (base URL + auth interceptor)
├── Context/         # Auth (UserContext) and Cart (CartContext) providers
├── components/      # Route-level and reusable UI components
├── hooks/            # React Query hooks for products data
├── lib/              # React Query client configuration
└── App.jsx           # Router setup
```
