import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './features/admin/AdminLayout';
import ListUsers from './features/admin/pages/users/ListUsers';
import AddUser from './features/admin/pages/users/AddUser';
import AddWorkshop from './features/admin/pages/workshops/AddWorkshop';
import Login from './features/auth/pages/Login';
import ListWorkshops from './features/admin/pages/workshops/ListWorkshops';
import MasterLayout from './features/master/masterLayOut';
import ProtectedRoute from './routes/ProtectedRoute'; 
import AddRequest from './features/master/pages/AddRequest';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth/login" element={<Login />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route
            path="users"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <ListUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="users/add"
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <AddUser />
              </ProtectedRoute>
            }
          />
          <Route path="workshops" element={
              <ProtectedRoute requiredRole="ADMIN">
              <ListWorkshops />
            </ProtectedRoute>
            }
          />
          <Route path="workshops/add" element={
            <ProtectedRoute requiredRole='ADMIN'>
              <AddWorkshop />
              </ProtectedRoute>} />
        </Route>

        <Route path="/master" element={<MasterLayout />}>
  <Route index element={<Navigate to="create-request" />} />
  <Route
    path="create-request"
    element={
      <ProtectedRoute requiredRole="MASTER">
        <AddRequest />
      </ProtectedRoute>
    }
  />
</Route>


        

        <Route path="*" element={<Navigate to="/auth/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
