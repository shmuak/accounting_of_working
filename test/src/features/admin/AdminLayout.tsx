import { Outlet, NavLink } from 'react-router-dom'
import { FaUsers, FaUserPlus } from 'react-icons/fa'
import { BiBuilding, BiBuildings } from "react-icons/bi";
import { IoMdExit } from "react-icons/io";
import styles from '../../shared/styles/pages/Layout/adminLayout.module.scss'

const AdminLayout = () => {
  return (
    <div className={styles.container}>
      <aside className={styles.toolbar}>
        <nav>
          <ul>
            <li>
              <NavLink to="/admin/users" title="Пользователи">
                <FaUsers />
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/users/add" title="Добавить пользователя">
                <FaUserPlus />
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/workshops" title="Цеха">
                <BiBuilding />
              </NavLink>
            </li>
            <li>
              <NavLink to="/admin/workshops/add" title="Добавить цех">
                <BiBuildings />
              </NavLink>
            </li>
            <li>
              <NavLink to="/auth/login" title="Выход">
                <IoMdExit />
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout