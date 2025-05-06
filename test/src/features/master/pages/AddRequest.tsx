import { useEffect, useState } from "react";
import { IEquipment, IUser } from "../../../shared/types/index";
import { createRequest } from "../api";
import styles from "../../../shared/styles/pages/request/addRequest.module.scss";
import { fetchEquipments } from "../../admin/api";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

const AddRequest = () => {
  const [newRequest, setNewRequest] = useState<{
    title: string;
    description: string;
    status: string;
    equipmentId: string;
    masterId: string; 
  }>({
    title: '',
    description: '',
    status: 'Pending',
    equipmentId: '',
    masterId: ''  
  });

  const [equipments, setEquipments] = useState<IEquipment[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useSelector((state: RootState) => state.auth.user) as IUser | null;

  useEffect(() => {
    if (!user || !user.workshop) return;
    
    setNewRequest(prevRequest => ({
      ...prevRequest,
      masterId: user._id 
    }));

    fetchEquipments().then((allEquipments) => {
      const filtered = allEquipments.filter(
        (eq) =>
          typeof eq.workshopId === 'string'
            ? eq.workshopId === user.workshop
            : eq.workshopId._id === (typeof user.workshop === 'string' ? user.workshop : user.workshop._id)
      );
      setEquipments(filtered);
    });
  }, [user]);

  const handleCreate = async () => {
    if (!newRequest.title || !newRequest.equipmentId) {
      alert('Заполните заголовок и выберите оборудование');
      return;
    }

    setIsSubmitting(true);
    try {
      console.log(newRequest)
      await createRequest(newRequest);
      setNewRequest({ title: '', description: '', equipmentId: '', status: 'Pending', masterId: user?._id || '' });
      alert('Заявка успешно создана!');
    } catch (error) {
      console.error('Ошибка при создании заявки:', error);
      alert('Произошла ошибка при создании заявки');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formCard}>
        <h1>Создать заявку</h1>

        <div className={styles.formGroup}>
          <label htmlFor="title">Заголовок</label>
          <input
            id="title"
            type="text"
            placeholder="Введите заголовок"
            value={newRequest.title || ''}
            onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
            className={styles.formInput}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="equipment">Оборудование</label>
          <select
            id="equipment"
            value={newRequest.equipmentId || ''}
            onChange={(e) => setNewRequest({ ...newRequest, equipmentId: e.target.value })}
            className={styles.formSelect}
          >
            <option value="">Выберите оборудование</option>
            {equipments.map((eq) => (
              <option key={eq._id} value={eq._id}>
                {eq.name}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Описание</label>
          <textarea
            id="description"
            placeholder="Введите описание"
            value={newRequest.description || ''}
            onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
            className={styles.formTextarea}
          />
        </div>

        <button 
          onClick={handleCreate} 
          className={styles.submitButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Создание...' : 'Создать заявку'}
        </button>
      </div>
    </div>
  );
};

export default AddRequest;
