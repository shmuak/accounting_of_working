import { Outlet, NavLink } from 'react-router-dom'
import { FaUsers, FaUserPlus } from 'react-icons/fa'
import { BiBuilding, BiBuildings  } from "react-icons/bi";
import { IoMdExit } from "react-icons/io";
import styles from '../../shared/styles/pages/Layout/adminLayout.module.scss'

const AdminLayout = () => {
  return (
    <div className={styles.container}>
      <aside className={styles.toolbar}>
        <nav>
          <ul>
            <li>
              <NavLink to="/admin/users">
                <FaUsers />
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users/add">
                <FaUserPlus />
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/workshops">
                <BiBuilding />
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/workshops/add">
                <BiBuildings />
              </NavLink>
            </li>
            <li>
              <NavLink to="/auth/login">
                <IoMdExit />
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
