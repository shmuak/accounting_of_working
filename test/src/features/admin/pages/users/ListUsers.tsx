import { useEffect, useState } from 'react'
import { fetchUsers, deleteUser, updateUser } from '../../api'
import { useDispatch } from 'react-redux'
import { logout } from '../../../auth/authSlice'
import { IUser } from '../../../../shared/types'
import styles from '../../../../shared/styles/pages/user/listUsers.module.scss'
import UserSearch from '../../components/userSearch/userSeacch'
import UserItem from './components/UserItem'
import EditUserModal from './components/EditUserModal'

const ListUsers = () => {
  const dispatch = useDispatch()
  const [users, setUsers] = useState<IUser[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [editingUser, setEditingUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(false)

  const loadUsers = () => {
    fetchUsers()
      .then(setUsers)
      .catch(() => dispatch(logout()))
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const filteredUsers = (users || []).filter(user =>
    user.login?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Удалить пользователя?')
    if (!confirmed) return
    setLoading(true)
    await deleteUser(id)
    setLoading(false)
    loadUsers()
  }

  const handleEditSave = async (updated: Partial<IUser>) => {
    if (editingUser) {
      setLoading(true)
      await updateUser(editingUser._id, updated)
      setLoading(false)
      setEditingUser(null)
      loadUsers()
    }
  }

  return (
    <div className={styles.container}>
      <h1>Список пользователей</h1>
      <UserSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <ul className=''>
        {filteredUsers.map(user => (
          <UserItem
            key={user._id}
            user={user}
            onEdit={() => setEditingUser(user)}
            onDelete={() => handleDelete(user._id)}
          />
        ))}
      </ul>

      {editingUser && (
        <EditUserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleEditSave}
        />
      )}

      {loading && <div>Загрузка...</div>}
    </div>
  )
}

export default ListUsers
