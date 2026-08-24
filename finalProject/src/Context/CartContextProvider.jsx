import { useContext } from 'react';
import { CartContext } from './CartContext';
import { UserContext } from './UserContext';
import { useCart } from '../hooks/useCart';

/**
 * Session-level cart coordination only. Server state lives in the
 * React Query `['cart']` cache (see useCart); this context exposes the
 * derived badge count so the Navbar/Profile never refetch the cart
 * themselves.
 */
export default function CartContextProvider({ children }) {
  const { userToken } = useContext(UserContext);
  const { data } = useCart();

  // Derived so a logged-out session can never show a stale count.
  const cartItemsCount = userToken ? data?.numOfCartItems ?? 0 : 0;

  return (
    <CartContext.Provider value={{ cartItemsCount }}>
      {children}
    </CartContext.Provider>
  );
}
