import { useEffect, useState } from 'react'
import { fetchWorkshops, deleteWorkshop, updateWorkshop } from '../../api'
import { useDispatch } from 'react-redux'
import { logout } from '../../../auth/authSlice'
import { IWorkshop } from '../../../../shared/types'
import styles from '../../../../shared/styles/pages/workshop/listWorkshop.module.scss'

const ListWorkshops = () => {
  const dispatch = useDispatch()
  const [workshops, setWorkshops] = useState<IWorkshop[]>([])
  const [editWorkshopId, setEditWorkshopId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<IWorkshop>>({})

  const loadWorkshops = () => {
    fetchWorkshops()
      .then(setWorkshops)
      .catch((err) => {
        console.error("Ошибка при получении цехов:", err.response?.data || err.message)
        dispatch(logout())
      })
  }

  useEffect(() => {
    loadWorkshops()
  }, [])

  const handleDelete = async (id: string) => {
    await deleteWorkshop(id)
    loadWorkshops()
  }

  const handleEdit = (workshop: IWorkshop) => {
    setEditWorkshopId(workshop._id)
    setFormData({ 
      name: workshop.name, 
      location: workshop.location,
      description: workshop.description
    })
  }

  const handleSave = async (id: string) => {
    await updateWorkshop(id, formData)
    setEditWorkshopId(null)
    loadWorkshops()
  }

  return (
    <div className={styles.container}>
      <h1>Список цехов</h1>

      <div className={styles.listGrid}>
        {workshops.map((w) => (
          <div key={w._id} className={styles.item}>
            {editWorkshopId === w._id ? (
              <>
                <div className={styles.userInfo}>
                  <input
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Название"
                  />
                  <input
                    value={formData.location || ''}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Местоположение"
                  />
                  <input
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Описание"
                  />
                </div>
                <div className={styles.actions}>
                  <button className={styles.saveButton} onClick={() => handleSave(w._id)}>Сохранить</button>
                  <button className={styles.cancelButton} onClick={() => setEditWorkshopId(null)}>Отмена</button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.userInfo}>
                  <span className={styles.userId}><strong>ID:</strong> {w._id}</span>
                  <span className={styles.userLogin}><strong>Название:</strong> {w.name}</span>
                  <span className={styles.userRole}><strong>Местоположение:</strong> {w.location}</span>
                  <span className={styles.userRole}><strong>Описание:</strong> {w.description || 'Нет описания'}</span>
                </div> 
                <div className={styles.actions}>
                  <button className={styles.editButton} onClick={() => handleEdit(w)}>Редактировать</button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(w._id)}>Удалить</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListWorkshops