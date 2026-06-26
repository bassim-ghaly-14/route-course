import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../../Context/UserContext'

export default function ProtectRoutes({ children }) {
  const { userToken } = useContext(UserContext)
  // ProtectRoutes
  if (!userToken) {
    return <Navigate to="/login" replace />
  }
  // Children of ProtectRoutes
  return children
}