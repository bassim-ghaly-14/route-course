import { useState, useEffect } from 'react';
import { UserContext } from './UserContext';
import { jwtDecode } from "jwt-decode";

export default function UserContextProvider({ children }) {

  const [userToken, setUserToken] = useState(() => {
    return localStorage.getItem('userToken');
  });

  const loading = false;

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);

        const userId =
          decoded._id ||
          decoded.id ||
          decoded.userId ||
          decoded.sub ||
          decoded?.user?._id;

        if (userId) {
          localStorage.setItem("userId", userId);
        }

      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  // login
  function saveUserToken(token) {
    localStorage.setItem("userToken", token);

    const decoded = jwtDecode(token);
    console.log("DECODED TOKEN:", decoded);

    const userId =
      decoded._id ||
      decoded.id ||
      decoded.userId ||
      decoded.sub ||
      decoded?.user?._id;

    if (!userId) {
      console.error("USER ID NOT FOUND IN TOKEN");
    } else {
      localStorage.setItem("userId", userId);
    }

    setUserToken(token);
  }

  // logout
  function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
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