import UserContextProvider from './Context/UserContextProvider';
import CartContextProvider from './Context/CartContextProvider';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Products from './components/Products/Products';
import ProductDetails from './components/ProductDetails/ProductDetails';
import CategoryProducts from './components/CategoryProducts/CategoryProducts';
import Cart from './components/Cart/Cart';
import Profile from './components/Profile/Profile';
import Checkout from './components/Checkout/Checkout';
import Allorders from './components/Allorders/Allorders';
import OrderDetails from './components/OrderDetails/OrderDetails';
import NotFound from './components/NotFound/NotFound';
import Categories from './components/Categories/Categories';
import ProtectRoutes from './components/ProtectRoutes/ProtectRoutes';
import OfflineBanner from './components/Offline/Offline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectRoutes>
            <Home />
          </ProtectRoutes>
        ),
      },
      {
        path: 'productDetails/:id',
        element: (
          <ProtectRoutes>
            <ProductDetails />
          </ProtectRoutes>
        ),
      },
      {
        path: 'category/:id',
        element: (
          <ProtectRoutes>
            <CategoryProducts />
          </ProtectRoutes>
        ),
      },
      {
        path: 'categories',
        element: (
          <ProtectRoutes>
            <Categories />
          </ProtectRoutes>
        ),
      },
      {
        path: 'products',
        element: (
          <ProtectRoutes>
            <Products />
          </ProtectRoutes>
        ),
      },
      {
        path: 'cart',
        element: (
          <ProtectRoutes>
            <Cart />
          </ProtectRoutes>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectRoutes>
            <Profile />
          </ProtectRoutes>
        ),
      },
      {
        path: 'checkout',
        element: (
          <ProtectRoutes>
            <Checkout />
          </ProtectRoutes>
        ),
      },
      {
        path: 'allorders',
        element: (
          <ProtectRoutes>
            <Allorders />
          </ProtectRoutes>
        ),
      },
      {
        path: 'order/:id',
        element: (
          <ProtectRoutes>
            <OrderDetails />
          </ProtectRoutes>
        ),
      },
      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserContextProvider>
        <CartContextProvider>

          <OfflineBanner />

          <RouterProvider router={router} />
          <Toaster />
          <ReactQueryDevtools initialIsOpen={false} />

        </CartContextProvider>
      </UserContextProvider>
    </QueryClientProvider>
  );
}