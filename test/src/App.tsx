import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ListUsers from './pages/ListUsers'
import Login from './pages/Login'

const App = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="auth/login" element={<Login />} />
        <Route path="/admin/users" element={<ListUsers />} />
      </Routes>
    </Router>
  )
}

export default App
