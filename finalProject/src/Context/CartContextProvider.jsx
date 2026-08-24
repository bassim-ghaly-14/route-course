import { CartContext } from './CartContext';
import { axiosInstance } from '../api/axiosInstance';
import { UserContext } from './UserContext';
import { useContext, useEffect, useState } from 'react';

export default function CartContextProvider({ children }) {
  const { userToken } = useContext(UserContext);

  const [cartItemsCount, setCartItemsCount] = useState(0);

  // Every function below intentionally lets errors propagate (instead of
  // swallowing them) so callers can react with proper loading/error UI
  // and so a failed request is never mistaken for a successful one.

  async function getLoggedCart() {
    try {
      const response = await axiosInstance.get('/cart');
      return response;
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  async function addProduct(prodId) {
    try {
      const response = await axiosInstance.post('/cart', { productId: prodId });
      setCartItemsCount(response.data.numOfCartItems);
      return response;
    } catch (error) {
      console.error('Error adding product to cart:', error);
      throw error;
    }
  }

  async function updateProduct(prodId, count) {
    try {
      const response = await axiosInstance.put(`/cart/${prodId}`, { count });
      setCartItemsCount(response.data.numOfCartItems);
      return response;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  }

  async function deleteProduct(prodId) {
    try {
      const response = await axiosInstance.delete(`/cart/${prodId}`);
      setCartItemsCount(response.data.numOfCartItems);
      return response;
    } catch (error) {
      console.error('Error deleting cart item:', error);
      throw error;
    }
  }

  async function emptyCart() {
    try {
      const response = await axiosInstance.delete('/cart');
      setCartItemsCount(0);
      return response;
    } catch (error) {
      console.error('Error emptying cart:', error);
      throw error;
    }
  }

  async function checkOutNow(cartId, url, formValue) {
    try {
      const response = await axiosInstance.post(
        `/orders/checkout-session/${cartId}?url=${url}`,
        { shippingAddress: formValue }
      );
      return response;
    } catch (error) {
      console.error('Error during checkout:', error);
      throw error;
    }
  }

  // Keep the Navbar cart badge in sync with the auth state:
  // fetch on login. On logout the badge is reset by the Navbar's
  // logout handler (setCartItemsCount(0)), so no setState is needed here.
  useEffect(() => {
    async function getCartCount() {
      try {
        const response = await getLoggedCart();
        setCartItemsCount(response?.data?.numOfCartItems || 0);
      } catch (error) {
        console.error('Error initializing cart count:', error);
      }
    }

    if (userToken) {
      getCartCount();
    }
  }, [userToken]);

  return (
    <CartContext.Provider
      value={{
        getLoggedCart,
        addProduct,
        updateProduct,
        deleteProduct,
        emptyCart,
        checkOutNow,
        cartItemsCount,
        setCartItemsCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
