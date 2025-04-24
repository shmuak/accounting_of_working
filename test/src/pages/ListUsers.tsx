import { useEffect, useState } from 'react'
import { fetchUsers } from '../features/admin/api'
import { useDispatch } from 'react-redux'
import { logout } from '../features/auth/authSlice'
import { IUser } from '../shared/types'
import styles from '../shared/styles/pages/listUsers.module.scss'

const ListUsers = () => {
  const dispatch = useDispatch()
  const [users, setUsers] = useState<IUser[]>([])

  useEffect(() => {
    fetchUsers()
      .then(setUsers)
      .catch(() => dispatch(logout()))
  }, [])

  return (
    <div className={styles.container}>
      <h1>Список пользователей</h1>
      <ul>
        {users.map((u) => (
          <li key={u._id} className={styles.item}>
            <div className={styles.userInfo}>
              <span className={`${styles.userInfo__field} ${styles['userInfo__field--id']}`}>
                {u._id}
              </span>
              <span className={styles.userInfo__field}>
                {u.login}
              </span>
              <span className={`${styles.userInfo__field} ${styles['userInfo__field--role']}`}>
                {u.role}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <button 
        className={styles.logoutBtn}
        onClick={() => dispatch(logout())}
      >
        Выйти из системы
      </button>
    </div>
  )
}

export default ListUsers