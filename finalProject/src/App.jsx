import { lazy, Suspense } from 'react';

import UserContextProvider from './Context/UserContextProvider';
import CartContextProvider from './Context/CartContextProvider';

import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// React Query Devtools: lazily imported ONLY in development, so the
// production build neither renders nor bundles any developer tooling.
const Devtools =
  import.meta.env.DEV
    ? lazy(() =>
        import('@tanstack/react-query-devtools').then((m) => ({
          default: m.ReactQueryDevtools,
        }))
      )
    : null;


import Layout from './components/Layout/Layout';
import ProtectRoutes from './components/ProtectRoutes/ProtectRoutes';
import OfflineBanner from './components/Offline/Offline';
import PageLoader from './components/ui/PageLoader';

// Route-level code splitting: every page is its own chunk; only the shell
// (Layout/Navbar/Footer) stays eager.
const Home = lazy(() => import('./components/Home/Home'));
const Products = lazy(() => import('./components/Products/Products'));
const ProductDetails = lazy(() =>
  import('./components/ProductDetails/ProductDetails')
);
const Categories = lazy(() => import('./components/Categories/Categories'));
const CategoryProducts = lazy(() =>
  import('./components/CategoryProducts/CategoryProducts')
);
const Login = lazy(() => import('./components/Login/Login'));
const Register = lazy(() => import('./components/Register/Register'));
const Cart = lazy(() => import('./components/Cart/Cart'));
const Checkout = lazy(() => import('./components/Checkout/Checkout'));
const Orders = lazy(() => import('./components/Orders/Orders'));
const OrderDetails = lazy(() =>
  import('./components/OrderDetails/OrderDetails')
);
const Profile = lazy(() => import('./components/Profile/Profile'));
const Wishlist = lazy(() => import('./components/Wishlist/Wishlist'));
const NotFound = lazy(() => import('./components/NotFound/NotFound'));

const page = (element) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: page(<Home />),
      },
      // PUBLIC: product browsing
      {
        path: 'products',
        element: page(<Products />),
      },
      {
        path: 'products/:id',
        element: page(<ProductDetails />),
      },
      // PUBLIC: category browsing
      {
        path: 'categories',
        element: page(<Categories />),
      },
      {
        path: 'categories/:id',
        element: page(<CategoryProducts />),
      },
      { path: 'register', element: page(<Register />) },
      { path: 'login', element: page(<Login />) },
      // LEGACY PAYMENT-REDIRECT SHIM (NOT the old Allorders page):
      // The Route checkout API builds its Stripe success_url server-side by
      // appending a fixed path to the `url` origin we send. If that path is
      // `/allorders`, a successful payment would land on NotFound. This
      // entry contains NO component/page — it permanently and silently
      // redirects to the canonical /orders route. /orders remains the only
      // order-list page; remove this shim if/when the API lets us control
      // the success URL.
      {
        path: 'allorders',
        element: <Navigate to="/orders" replace />,
      },
      // PROTECTED route group: cart, checkout, orders, order details,
      // profile, wishlist
      {
        element: <ProtectRoutes />,
        children: [
          { path: 'cart', element: page(<Cart />) },
          { path: 'checkout', element: page(<Checkout />) },
          { path: 'orders', element: page(<Orders />) },
          { path: 'orders/:id', element: page(<OrderDetails />) },
          { path: 'profile', element: page(<Profile />) },
          { path: 'wishlist', element: page(<Wishlist />) },
        ],
      },
      { path: '*', element: page(<NotFound />) },
    ],
  },
]);

export default function App() {
  return (
    <UserContextProvider>
      <CartContextProvider>

        <OfflineBanner />

        <RouterProvider router={router} />
        <Toaster />
        {Devtools && (
          <Suspense fallback={null}>
            <Devtools initialIsOpen={false} />
          </Suspense>
        )}

      </CartContextProvider>
    </UserContextProvider>
  );
}