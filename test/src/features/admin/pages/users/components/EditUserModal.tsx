import { useState } from 'react'
import { IUser } from '../../../../../shared/types'
import styles from '../../../../../shared/styles/components/editUserModal/editUserModal.module.scss'

interface Props {
  user: IUser
  onClose: () => void
  onSave: (updated: Partial<IUser>) => void
}

const EditUserModal = ({ user, onClose, onSave }: Props) => {
  const [formData, setFormData] = useState({
    login: user.login || '',
    role: user.role || '',
  })

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onSave(formData)
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Редактировать пользователя</h2>

        <input
          value={formData.login}
          onChange={(e) => handleChange('login', e.target.value)}
          placeholder="Логин"
        />
        <input
          value={formData.role}
          onChange={(e) => handleChange('role', e.target.value)}
          placeholder="Роль"
        />

        <div className={styles.buttons}>
          <button onClick={handleSubmit}>Сохранить</button>
          <button onClick={onClose}>Отмена</button>
        </div>
      </div>
    </div>
  )
}

export default EditUserModal
