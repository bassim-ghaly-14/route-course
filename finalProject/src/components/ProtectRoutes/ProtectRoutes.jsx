import { useContext } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext'

export default function ProtectRoutes() {
  const { userToken } = useContext(UserContext)
  const location = useLocation()

  if (!userToken) {
    // Preserve the originally requested location so Login can send the
    // user back after a successful sign-in. Only ever an internal path,
    // since it comes from the router itself.
    const returnTo = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />
  }

  return <Outlet />
}