import { useEffect, useState } from "react"
import { createUser, fetchRoles, fetchWorkshops } from "../../api"
import { IUser, IRole, IWorkshop } from "../../../../shared/types"
import styles from '../../../../shared/styles/pages/addUser.module.scss'

const AddUser = () => {
  const [newUser, setNewUser] = useState<Partial<IUser>>({ login: '', role: '', password: '', workshop: '' })
  const [roles, setRoles] = useState<IRole[]>([])
  const [workshops, setWorkshops] = useState<IWorkshop[]>([])

  useEffect(() => {
    fetchRoles().then(setRoles)
    fetchWorkshops().then(setWorkshops)
  }, [])

  const handleCreate = async () => {
    if (!newUser.login || !newUser.password || !newUser.role || !newUser.workshop) {
      alert('Заполните все поля')
      return
    }
    await createUser(newUser)
    console.log(newUser)
    setNewUser({ login: '', role: '', password: '', workshop: '' })
  }

  return (
    <div className={styles.formContainer}>
      <h1>Создать нового пользователя</h1>

      <select
        value={newUser.role || ''}
        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
      >
        <option value="" disabled>Выберите роль</option>
        {roles.map(role => (
          <option key={role._id} value={role.value}>
            {role.value}
          </option>
        ))}
      </select>

      <select
        value={typeof newUser.workshop === 'object' ? newUser.workshop._id : newUser.workshop || ''}
        onChange={(e) => setNewUser({  ...newUser, workshop: e.target.value})}
      >
        <option value="" disabled>Выберите цех</option>
        {workshops.map(workshop => (
          <option key={workshop._id} value={workshop._id}>
            {workshop.name}
          </option>
        ))}
      </select>


      <input
        type="text"
        placeholder="Login"
        value={newUser.login || ''}
        onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        value={newUser.password || ''}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
      />

      <button onClick={handleCreate} className={styles.addButton}>Создать</button>
    </div>
  )
}

export default AddUser
