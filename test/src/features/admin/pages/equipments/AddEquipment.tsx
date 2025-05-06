import { useEffect, useState } from "react";
import { IEquipment, IWorkshop } from "../../../../shared/types";
import { fetchWorkshops,createEquipment } from "../../api"; 

import styles from "../../../../shared/styles/pages/equipment/addEquipment.module.scss"; 
const AddEquipment = () => {
  const [newEquipment, setNewEquipment] = useState<IEquipment>({
    name: '',
    type: '',
    description: '',
    status: 'working',
    workshopId: ''
  });

  const [workshops, setWorkshops] = useState<IWorkshop[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchWorkshops().then(setWorkshops);
  }, []);

  const handleCreate = async () => {
    if (!newEquipment.name || !newEquipment.type || !newEquipment.workshopId) {
      alert('Заполните все обязательные поля');
      return;
    }
  
    // Если workshopId может быть объектом, преобразуем его в строку
    const workshopId = typeof newEquipment.workshopId === 'string' 
      ? newEquipment.workshopId 
      : newEquipment.workshopId?._id;
  
    setIsSubmitting(true);
    try {
      await createEquipment({
        ...newEquipment,
        workshopId // гарантируем, что отправим строку
      });
      console.log(newEquipment)
      setNewEquipment({
        name: '',
        type: '',
        description: '',
        status: 'Work',
        workshopId: ''
      });
      alert('Оборудование успешно создано!');
    } catch (error) {
      console.error('Ошибка при создании оборудования:', error);
      alert('Произошла ошибка при создании оборудования');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formCard}>
        <h1>Создать новое оборудование</h1>

        <div className={styles.formGroup}>
          <label htmlFor="name">Название оборудования</label>
          <input
            id="name"
            type="text"
            placeholder="Введите название оборудования"
            value={newEquipment.name}
            onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="type">Тип оборудования</label>
          <input
            id="type"
            type="text"
            placeholder="Введите тип оборудования"
            value={newEquipment.type}
            onChange={(e) => setNewEquipment({ ...newEquipment, type: e.target.value })}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="workshop">Цех</label>
          <select
            id="workshop"
            value={typeof newEquipment.workshopId === 'string' ? newEquipment.workshopId : newEquipment.workshopId?._id}
            onChange={(e) => setNewEquipment({ ...newEquipment, workshopId: e.target.value })}
            className={styles.formSelect}
          >
            <option value="" disabled>Выберите цех</option>
            {workshops.map(workshop => (
              <option key={workshop._id} value={workshop._id}>
                {workshop.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            placeholder="Введите описание оборудования"
            value={newEquipment.description}
            onChange={(e) => setNewEquipment({ ...newEquipment, description: e.target.value })}
            className={styles.formTextarea}
            rows={3}
          />
        </div>

        <button
          onClick={handleCreate}
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Создание...' : 'Создать оборудование'}
        </button>
      </div>
    </div>
  );
};

export default AddEquipment;