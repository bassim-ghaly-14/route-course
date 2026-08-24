import { useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import { jwtDecode } from "jwt-decode";
import { queryClient } from '../lib/queryClient';
import { setUnauthorizedHandler } from '../api/unauthorizedHandler';

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

  // Centralized decoded auth state so route/page components never need to
  // decode the JWT themselves.
  function decodeToken(token) {
    if (!token) return { userId: null, user: null };
    try {
      const decoded = jwtDecode(token);
      return { userId: extractUserId(decoded) || null, user: decoded };
    } catch {
      return { userId: null, user: null };
    }
  }

  const [{ userId, user: decodedUser }, setAuthInfo] = useState(() =>
    decodeToken(userToken)
  );

  const loading = false;

  /**
   * The ONE canonical session teardown. Used by logout() AND by the
   * centralized unexpected-401 handler so React state, localStorage and
   * the React Query cache can never drift apart.
   */
  function clearSession() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('cartId'); // legacy key cleanup
    setAuthInfo({ userId: null, user: null });
    setUserToken(null);
    // Drop cached user-scoped data (orders etc.) so it can't leak to the
    // next session or show up via back/forward navigation.
    queryClient.clear();
  }

  // login — persists the token ONLY if it is present and decodable to a
  // user id. Returns true when a valid session was established, so callers
  // (Register/Login) can react instead of assuming success.
  function saveUserToken(token) {
    const { userId: nextUserId, user: nextUser } = decodeToken(token);

    if (!token || !nextUserId) {
      console.error("saveUserToken rejected: token missing or undecodable");
      return false;
    }

    localStorage.setItem('userToken', token);
    localStorage.setItem('userId', nextUserId);
    setAuthInfo({ userId: nextUserId, user: nextUser });
    setUserToken(token);
    return true;
  }

  // logout (user-initiated; SPA navigation stays intact)
  function logout() {
    clearSession();
  }

  // Centralized expired/invalid-session handling. This provider sits above
  // the Router, so a full-page replace to /login guarantees a completely
  // clean app state (no stale caches, no back-forward-cache artifacts).
  useEffect(() => {
    let redirecting = false;

    setUnauthorizedHandler(() => {
      if (redirecting) return;
      redirecting = true;
      clearSession();
      window.location.replace('/login');
    });

    return () => setUnauthorizedHandler(null);
  }, []);

  return (
    <UserContext.Provider
      value={{
        userToken,
        userId,
        user: decodedUser,
        isAuthenticated: !!userToken,
        saveUserToken,
        logout,
        loading
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

