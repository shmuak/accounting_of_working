import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './features/admin/AdminLayout';
import ListUsers from './features/admin/pages/users/ListUsers';
import AddUser from './features/admin/pages/users/AddUser';
import AddWorkshop from './features/admin/pages/workshops/AddWorkshop';
import Login from './features/auth/pages/Login';
import ListWorkshops from './features/admin/pages/workshops/ListWorkshops';
import MasterLayout from './features/master/masterLayout';
import ProtectedRoute from './routes/ProtectedRoute'; 
import AddRequest from './features/master/pages/AddRequest';
import AddEquipment from './features/admin/pages/equipments/AddEquipment';
import ListEquipments from './features/admin/pages/equipments/ListEquipments';
import ListRequest from './features/master/pages/ListRequest';
import DispatcherLayout from './features/dispatcher/dispatcherLayout';
import DispatcherRequests from './features/dispatcher/pages/DispatcherRequests';
import DispatcherMechanics from './features/dispatcher/pages/DispatcherMechanics';
import Reports from './features/dispatcher/pages/reports/Reports';
import MechanicLayout from './features/mechanic/MechanicLayout';
import MechanicRequests from './features/mechanic/pages/MechanicRequests';
import MechanicWarehouse from './features/mechanic/pages/MechanicWarehouse';
import MechanicOrderWarehouse from './features/mechanic/pages/MechanicOrderWarehouse';
import StokekeeperLayout from './features/storekeeper/StokekeeperLayout';
import StokekeeperInventory from './features/storekeeper/pages/StokekeeperInventory';
import StokekeeperRequests from './features/storekeeper/pages/StokekeeperRequests';
import StokekeeperReports from './features/storekeeper/pages/StokekeeperReports';
import AdjusterLayout from './features/adjuster/AdjusterLayout';
import NewRequestsPage from './features/adjuster/pages/NewRequestsPage';
import CompletedRequestsPage from './features/adjuster/pages/CompletedRequestsPage';
import ListEquipmentsMaster from './features/master/pages/ListEquipments';
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
          <Route path="equipments/add" element={
            <ProtectedRoute requiredRole='ADMIN'>
              <AddEquipment/>
            </ProtectedRoute>
            }
          />
          <Route path="equipments" element={
            <ProtectedRoute requiredRole='ADMIN'>
              <ListEquipments />
            </ProtectedRoute>
            }
          />
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
          <Route
            path="list-equipments"
            element={
              <ProtectedRoute requiredRole="MASTER">
                <ListEquipmentsMaster />
              </ProtectedRoute>
            }
          />
          <Route
            path="requests"
            element={
              <ProtectedRoute requiredRole="MASTER">
                <ListRequest />
              </ProtectedRoute>
            } 
          />  
        </Route>

        <Route  path="/dispatcher" element={<DispatcherLayout /> }>
        
          <Route path="requests"
          element ={
            <ProtectedRoute requiredRole='DISPATCHER'>
              <DispatcherRequests />
            </ProtectedRoute>
          }/>

          <Route path="mechanics"
            element ={
              <ProtectedRoute requiredRole='DISPATCHER'>
                <DispatcherMechanics />
              </ProtectedRoute>
            }/>

          <Route path="reports"
            element ={
              <ProtectedRoute requiredRole='DISPATCHER'>
                <Reports />
              </ProtectedRoute>
            }/>
        </Route>

        <Route path='/mechanic' element={<MechanicLayout />}>
            <Route  path="requests"
              element = {
                <ProtectedRoute requiredRole='MECHANIC'>
                  <MechanicRequests />
                </ProtectedRoute>
            }/>
            <Route path="Warehouse"
              element = {
                <ProtectedRoute requiredRole='MECHANIC'>
                  <MechanicWarehouse />
                </ProtectedRoute>
            }/>
           <Route path="request-warehouse"
              element = {
                <ProtectedRoute requiredRole='MECHANIC'>
                  <MechanicOrderWarehouse />
                </ProtectedRoute>
            }/>  
        </Route>
        <Route path='/stokekeeper' element={<StokekeeperLayout />}>
            <Route path="inventory"
              element = {
                <ProtectedRoute requiredRole='STOKEKEEPER'>
                  <StokekeeperInventory />
                </ProtectedRoute>
              }            
            />
            <Route path="requests"
              element={
                <ProtectedRoute requiredRole='STOKEKEEPER'>
                  <StokekeeperRequests />
                </ProtectedRoute>
              } 
            />
            <Route path="reports"
              element={
                <ProtectedRoute requiredRole='STOKEKEEPER'>
                  <StokekeeperReports/>
                </ProtectedRoute>
              } 
            />
        </Route>

        <Route path='/adjuster' element={<AdjusterLayout/>}>
              <Route path="requests"
                element = {
                  <ProtectedRoute requiredRole='ADJUSTER'>
                    <NewRequestsPage />
                  </ProtectedRoute>
              }            
            />
             <Route path="completed"
                element = {
                  <ProtectedRoute requiredRole='ADJUSTER'>
                    <CompletedRequestsPage />
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
