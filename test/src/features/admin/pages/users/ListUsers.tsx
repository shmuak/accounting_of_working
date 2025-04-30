import { useEffect, useState } from 'react'
import { fetchUsers, deleteUser, updateUser } from '../../api'
import { useDispatch } from 'react-redux'
import { logout } from '../../../auth/authSlice'
import { IUser } from '../../../../shared/types'
import styles from '../../../../shared/styles/pages/listUsers.module.scss'
import UserSearch from '../../components/userSearch/userSeacch'

const ListUsers = () => {
  const dispatch = useDispatch()
  const [users, setUsers] = useState<IUser[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editUserId, setEditUserId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<IUser>>({})

  const loadUsers = () => { 
    fetchUsers()
      .then(setUsers)
      .catch(() => dispatch(logout()))
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = users.filter(user =>
    user.login?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (id: string) => {
    await deleteUser(id)
    loadUsers()
  }

  const handleEdit = (user: IUser) => {
    setEditUserId(user._id)
    setFormData({ login: user.login, role: user.role })
  }

  const handleSave = async (id: string) => {
    await updateUser(id, formData)
    setEditUserId(null)
    loadUsers()
  }


  return (
    <div className={styles.container}>
      <h1>Список пользователей</h1>
      <UserSearch 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
      />
      
      <ul>
        {filteredUsers.map((u) => (
          <li key={u._id} className={styles.item}>
            {editUserId === u._id ? (
              <>
                <div className={styles.userInfo}>
                  <input
                    value={formData.login || ''}
                    onChange={(e) => setFormData({ ...formData, login: e.target.value })}
                  />
                  <input
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>
                <div className={styles.actions}>
                  <button className={styles.saveButton} onClick={() => handleSave(u._id)}>Сохранить</button>
                  <button className={styles.cancelButton} onClick={() => setEditUserId(null)}>Отмена</button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.userInfo}>
                  <span className={styles.userId}>{u._id}</span>
                  <span className={styles.userLogin}>{u.login}</span>
                  <span className={styles.userRole}>{u.role || 'Нет роли'}</span>
                  <span className={styles.userRole}>
                    {typeof u.workshop === 'object' && 'name' in u.workshop
                      ? u.workshop.name
                      : 'Не указан'}
                  </span>

                </div>
                <div className={styles.actions}>
                  <button className={styles.editButton} onClick={() => handleEdit(u)}>Редактировать</button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(u._id)}>Удалить</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

    </div>
  )
}

export default ListUsers
