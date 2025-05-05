import { useEffect, useState } from 'react'
import { fetchEquipments, deleteEquipment, updateEquipment } from '../../api'
import { useDispatch } from 'react-redux'
import { logout } from '../../../auth/authSlice'
import { IEquipment } from '../../../../shared/types'
import styles from '../../../../shared/styles/pages/listEquipments.module.scss'

const ListEquipments = () => {
  const dispatch = useDispatch()
  const [equipments, setEquipments] = useState<(IEquipment & { _id: string })[]>([])
  const [editEquipmentId, setEditEquipmentId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<IEquipment>>({})

  const loadEquipments = () => {
    fetchEquipments()
      .then((data) => setEquipments(data as (IEquipment & { _id: string })[]))
      .catch((err) => {
        console.error("Ошибка при получении оборудования:", err.response?.data || err.message)
        dispatch(logout())
      })
  }

  useEffect(() => {
    loadEquipments()
  }, [])

  const handleDelete = async (id: string) => {
    await deleteEquipment(id)
    loadEquipments()
  }

  const handleEdit = (equipment: IEquipment & { _id: string }) => {
    setEditEquipmentId(equipment._id)
    setFormData({
      name: equipment.name,
      type: equipment.type,
      description: equipment.description,
      status: equipment.status,
      workshopId: equipment.workshopId
    })
  }

  const handleSave = async (id: string) => {
    await updateEquipment(id, formData)
    setEditEquipmentId(null)
    loadEquipments()
  }

  return (
    <div className={styles.container}>
      <h1>Список оборудования</h1>

      <div className={styles.listGrid}>
        {equipments.map((e) => (
          <div key={e._id} className={styles.item}>
            {editEquipmentId === e._id ? (
              <>
                <div className={styles.userInfo}>
                  <input
                    value={formData.name || ''}
                    onChange={(ev) => setFormData({ ...formData, name: ev.target.value })}
                    placeholder="Название"
                  />
                  <input
                    value={formData.type || ''}
                    onChange={(ev) => setFormData({ ...formData, type: ev.target.value })}
                    placeholder="Тип"
                  />
                  <input
                    value={formData.status || ''}
                    onChange={(ev) => setFormData({ ...formData, status: ev.target.value })}
                    placeholder="Статус"
                  />
                  <input
                    value={formData.description || ''}
                    onChange={(ev) => setFormData({ ...formData, description: ev.target.value })}
                    placeholder="Описание"
                  />
                  <input
                    value={typeof formData.workshopId === 'string' ? formData.workshopId : formData.workshopId?._id || ''}
                    onChange={(ev) => setFormData({ ...formData, workshopId: ev.target.value })}
                    placeholder="ID цеха"
                  />
                  
                </div>
                <div className={styles.actions}>
                  <button className={styles.saveButton} onClick={() => handleSave(e._id)}>Сохранить</button>
                  <button className={styles.cancelButton} onClick={() => setEditEquipmentId(null)}>Отмена</button>
                </div>
              </>
            ) : (
              <>
                <div className={styles.userInfo}>
                  <span className={styles.userId}><strong>ID:</strong> {e._id}</span>
                  <span className={styles.userLogin}><strong>Название:</strong> {e.name}</span>
                  <span className={styles.userRole}><strong>Тип:</strong> {e.type}</span>
                  <span className={styles.userRole}><strong>Статус:</strong> {e.status}</span>
                  <span className={styles.userRole}><strong>Описание:</strong> {e.description || 'Нет описания'}</span>

                  <span className={styles.userRole}><strong>Цех:</strong> {typeof e.workshopId === 'string' ? e.workshopId : e.workshopId?.name}</span>
                </div>
                <div className={styles.actions}>
                  <button className={styles.editButton} onClick={() => handleEdit(e)}>Редактировать</button>
                  <button className={styles.deleteButton} onClick={() => handleDelete(e._id)}>Удалить</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ListEquipments
