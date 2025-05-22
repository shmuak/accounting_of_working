import { useEffect, useState } from 'react'
import { fetchEquipments, deleteEquipment, updateEquipment } from '../../api'
import { useDispatch } from 'react-redux'
import { logout } from '../../../auth/authSlice'
import { IEquipment } from '../../../../shared/types'
import styles from '../../../../shared/styles/pages/equipment/listEquipments.module.scss'

// Добавляем константы типов оборудования
const EQUIPMENT_TYPES = [
  { label: "Все типы", value: "" },
  ...[
    "Ленточнопильный станок (металл)",
    "Дисково-отрезной станок",
    "Абразивно-отрезной станок",
    "Гильотинные ножницы",
    "Станок плазменной резки с ЧПУ",
    "Станок лазерной резки с ЧПУ",
    "Станок гидроабразивной резки с ЧПУ",
    "Координатно-пробивной пресс",
    "Токарно-винторезный станок",
    "Токарно-револьверный станок",
    "Токарно-карусельный станок",
    "Токарный автомат/полуавтомат",
    "Токарный станок с ЧПУ",
    "Токарно-фрезерный обрабатывающий центр",
    "Лоботокарный станок",
    "Вертикально-сверлильный станок",
    "Радиально-сверлильный станок",
    "Горизонтально-расточной станок",
    "Координатно-расточной станок",
    "Сверлильный станок с ЧПУ",
    "Вертикально-фрезерный станок",
    "Горизонтально-фрезерный станок",
    "Универсально-фрезерный станок",
    "Продольно-фрезерный станок",
    "Фрезерный станок с ЧПУ (3/4-осевой)",
    "Фрезерный станок с ЧПУ (5-осевой)",
    "Вертикальный обрабатывающий центр",
    "Горизонтальный обрабатывающий центр",
    "Плоскошлифовальный станок",
    "Круглошлифовальный станок (наружный/внутренний)",
    "Внутришлифовальный станок",
    "Бесцентрово-шлифовальный станок",
    "Профилешлифовальный станок",
    "Резьбошлифовальный станок",
    "Зубошлифовальный станок",
    "Заточной станок (для инструмента)",
    "Хонинговальный станок",
    "Поперечно-строгальный станок",
    "Продольно-строгальный станок",
    "Долбежный станок",
    "Протяжной станок (горизонтальный/вертикальный)",
    "Кривошипный пресс",
    "Гидравлический пресс (ковочный/штамповочный)",
    "Листогибочный пресс с ЧПУ",
    "Трубогибочный станок с ЧПУ",
    "Молот (пневматический/паровоздушный)",
    "Горизонтально-ковочная машина (ГКМ)",
    "Сварочный робот / Роботизированный комплекс",
    "Установка для автоматической сварки под флюсом",
    "Машина контактной точечной/шовной сварки",
    "Специализированный агрегатный станок",
    "Другой тип оборудования"
  ].map(type => ({ label: type, value: type }))
]

const ListEquipments = () => {
  const dispatch = useDispatch()
  const [equipments, setEquipments] = useState<(IEquipment & { _id: string })[]>([])
  const [filteredEquipments, setFilteredEquipments] = useState<(IEquipment & { _id: string })[]>([])
  const [selectedType, setSelectedType] = useState("")
  const [editEquipmentId, setEditEquipmentId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<IEquipment>>({})

  const loadEquipments = () => {
    fetchEquipments()
      .then((data) => {
        setEquipments(data as (IEquipment & { _id: string })[])
        setFilteredEquipments(data as (IEquipment & { _id: string })[])
      })
      .catch((err) => {
        console.error("Ошибка при получении оборудования:", err.response?.data || err.message)
        dispatch(logout())
      })
  }

  useEffect(() => {
    loadEquipments()
  }, [])

  // Фильтрация оборудования по выбранному типу
  useEffect(() => {
    if (selectedType === "") {
      setFilteredEquipments(equipments)
    } else {
      setFilteredEquipments(equipments.filter(e => e.type === selectedType))
    }
  }, [selectedType, equipments])

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

      {/* Добавляем фильтр по типу оборудования */}
      <div className={styles.filterContainer}>
        <label htmlFor="equipmentTypeFilter">Фильтр по типу:</label>
        <select
          id="equipmentTypeFilter"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className={styles.filterSelect}
        >
          {EQUIPMENT_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.listGrid}>
        {filteredEquipments.map((e) => (
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