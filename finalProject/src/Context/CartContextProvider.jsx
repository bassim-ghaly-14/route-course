import { CartContext } from './CartContext';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function CartContextProvider({ children }) {

  const [cartItemsCount, setCartItemsCount] = useState(0);

function getHeaders() {
  return {
    token: localStorage.getItem('userToken')
  };
}

  async function getLoggedCart() {
    return axios.get(
      'https://ecommerce.routemisr.com/api/v1/cart',
      {
        headers: getHeaders()
      }
    )
      .then((response) => {
        console.log("Fetched cart:", response.data);
        return response;
      })
      .catch((error) => {
        console.error("Error fetching cart:", error);
        return error;
      });
  }

  async function addProduct(prodId) {
    return axios.post(
      'https://ecommerce.routemisr.com/api/v1/cart',
      {
        productId: prodId
      },
      {
        headers: getHeaders()
      }
    )
      .then((response) => {
        setCartItemsCount(response.data.numOfCartItems);
        return response;
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
        return error;
      });
  }

  async function updateProduct(prodId, count) {
    return axios.put(
      `https://ecommerce.routemisr.com/api/v1/cart/${prodId}`,
      {
        count
      },
      {
        headers: getHeaders()
      }
    )
      .then((response) => {
        setCartItemsCount(response.data.numOfCartItems);
        return response;
      })
      .catch((error) => {
        console.error("Error updating cart item:", error);
        return error;
      });
  }

  async function deleteProduct(prodId) {
    return axios.delete(
      `https://ecommerce.routemisr.com/api/v1/cart/${prodId}`,
      {
        headers: getHeaders()
      }
    )
      .then((response) => {
        setCartItemsCount(response.data.numOfCartItems);
        return response;
      })
      .catch((error) => {
        console.error("Error deleting cart item:", error);
        return error;
      });
  }

  async function emptyCart() {
    return axios.delete(
      'https://ecommerce.routemisr.com/api/v1/cart',
      {
        headers: getHeaders()
      }
    )
      .then((response) => {
        setCartItemsCount(0);
        return response;
      })
      .catch((error) => {
        console.error("Error emptying cart:", error);
        return error;
      });
  }

  async function checkOutNow(cartId, url, formValue) {
    return axios.post(
      `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${url}`,
      {
        shippingAddress: formValue
      },
      {
        headers: getHeaders()
      }
    )
      .then((response) => {
        console.log("Checkout response:", response.data);
        return response;
      })
      .catch((error) => {
        console.error("Error during checkout:", error);
        return error;
      });
  }

  useEffect(() => {
    async function getCartCount() {
      const response = await getLoggedCart();

      if (response?.data?.numOfCartItems) {
        setCartItemsCount(response.data.numOfCartItems);
      }
    }

    if (localStorage.getItem('userToken')) {
      getCartCount();
    }
  }, []);

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