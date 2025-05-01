import { useState } from "react"
import { IWorkshop } from "../../../../shared/types"
import { createWorkshop } from "../../api"
import styles from "../../../../shared/styles/pages/addWorkshop.module.scss"

const AddWorkshop = () => {
  const [newWorkshop, setNewWorkshop] = useState<Partial<IWorkshop>>({ 
    name: '', 
    location: '', 
    description: '' 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!newWorkshop.name) {
      alert('Название цеха обязательно для заполнения');
      return;
    }

    setIsSubmitting(true);
    try {
      await createWorkshop(newWorkshop);
      setNewWorkshop({ name: '', location: '', description: '' });
      alert('Цех успешно создан!');
    } catch (error) {
      console.error('Ошибка при создании цеха:', error);
      alert('Произошла ошибка при создании цеха');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formCard}>
        <h1>Создать новый цех</h1>
        
        <div className={styles.formGroup}>
          <label htmlFor="name">Название цеха</label>
          <input
            id="name"
            type="text"
            placeholder="Введите название цеха"
            value={newWorkshop.name || ''}
            onChange={(e) => setNewWorkshop({ ...newWorkshop, name: e.target.value })}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="location">Местоположение</label>
          <input
            id="location"
            type="text"
            placeholder="Введите местоположение"
            value={newWorkshop.location || ''}
            onChange={(e) => setNewWorkshop({ ...newWorkshop, location: e.target.value })}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            placeholder="Введите описание цеха"
            value={newWorkshop.description || ''}
            onChange={(e) => setNewWorkshop({ ...newWorkshop, description: e.target.value })}
            className={styles.formTextarea}
            rows={3}
          />
        </div>

        <button 
          onClick={handleCreate} 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Создание...' : 'Создать цех'}
        </button>
      </div>
    </div>
  )
}

export default AddWorkshop;