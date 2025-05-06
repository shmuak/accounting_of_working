import { useEffect, useState } from "react";
import { IEquipment, IUser } from "../../../shared/types";
import { createRequest } from "../api";
import { fetchEquipments } from "../../admin/api";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import styles from '../../../shared/styles/pages/request/addRequest.module.scss';

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
    <div className={styles.createRequestSection}>
      <h2 className={styles.sectionTitle}>Создать новую заявку</h2>
      <form 
        className={styles.requestForm}
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
      >
        <div className={styles.formGroup}>
          <label htmlFor="title" className={styles.label}>
            Заголовок заявки*
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className={styles.input}
            placeholder="Кратко опишите проблему"
            value={newRequest.title}
            onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
          />
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="equipment" className={styles.label}>
              Оборудование*
            </label>
            <select
              id="equipment"
              name="equipment"
              required
              className={styles.select}
              value={newRequest.equipmentId}
              onChange={(e) => setNewRequest({...newRequest, equipmentId: e.target.value})}
            >
              <option value="" disabled>Выберите оборудование</option>
              {equipments.map((eq) => (
                <option key={eq._id} value={eq._id}>
                  {eq.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="description" className={styles.label}>
            Подробное описание проблемы*
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className={styles.textarea}
            placeholder="Опишите проблему максимально подробно"
            value={newRequest.description}
            onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
          />
        </div>
        
        <div className={styles.formActions}>
          <button
            type="reset"
            className={styles.secondaryButton}
            onClick={() => setNewRequest({
              title: '',
              description: '',
              status: 'Pending',
              equipmentId: '',
              masterId: user?._id || ''
            })}
          >
            <i className="fas fa-eraser"></i> Очистить
          </button>
          <button
            type="submit"
            className={styles.primaryButton}
            disabled={isSubmitting}
          >
            <i className="fas fa-paper-plane"></i> 
            {isSubmitting ? 'Создание...' : 'Создать заявку'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddRequest;