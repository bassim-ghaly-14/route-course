import { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import { jwtDecode } from "jwt-decode";

function isTokenExpired(token) {
  try {
    const decoded = jwtDecode(token);
    if (!decoded?.exp) return false; // no expiry claim, treat as valid
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

function extractUserId(decoded) {
  return (
    decoded._id ||
    decoded.id ||
    decoded.userId ||
    decoded.sub ||
    decoded?.user?._id
  );
}

export default function UserContextProvider({ children }) {

  const [userToken, setUserToken] = useState(() => {
    const token = localStorage.getItem('userToken');
    if (token && isTokenExpired(token)) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('userId');
      return null;
    }
    return token;
  });

  const loading = false;

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (token && !isTokenExpired(token)) {
      try {
        const decoded = jwtDecode(token);
        const userId = extractUserId(decoded);

        if (userId) {
          localStorage.setItem("userId", userId);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  // login
  function saveUserToken(token) {
    localStorage.setItem("userToken", token);

    try {
      const decoded = jwtDecode(token);
      const userId = extractUserId(decoded);

      if (!userId) {
        console.error("USER ID NOT FOUND IN TOKEN");
      } else {
        localStorage.setItem("userId", userId);
      }
    } catch (error) {
      console.error("Failed to decode token:", error);
    }

    setUserToken(token);
  }

  // logout
  function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('cartId');
    setUserToken(null);
  }

  return (
    <UserContext.Provider
      value={{
        userToken,
        saveUserToken,
        logout,
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
