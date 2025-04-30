import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AdminLayout from './features/admin/AdminLayout'
import ListUsers from './features/admin/pages/users/ListUsers'
import AddUser from './features/admin/pages/users/AddUser'
import AddWorkshop from './features/admin/pages/workshops/AddWorkshop'
import Login from './features/auth/pages/Login'
import ListWorkshops from './features/admin/pages/workshops/ListWorkshops'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="users" element={<ListUsers />} />
          <Route path="users/add" element={<AddUser />} />
          <Route path="workshops" element={<ListWorkshops />}/>
          <Route path="workshops/add" element={<AddWorkshop/>} /> 
        </Route>
        
        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </Router>
  )
}

export default App
