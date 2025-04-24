import { useSelector } from 'react-redux'
import { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { RootState } from '../app/store'

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuth = useSelector((state: RootState) => state.auth.isAuth)
  return isAuth ? children : <Navigate to="/login" />
}

export default ProtectedRoute
