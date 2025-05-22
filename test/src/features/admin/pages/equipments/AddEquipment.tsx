import { useEffect, useState } from "react";
import { IEquipment, IWorkshop } from "../../../../shared/types";
import { fetchWorkshops, createEquipment } from "../../api";

import styles from "../../../../shared/styles/pages/equipment/addEquipment.module.scss";

// ... (EQUIPMENT_TYPES_STRUCTURED и EQUIPMENT_STATUSES остаются такими же) ...
 export const EQUIPMENT_TYPES_STRUCTURED = [
  {
    label: "Заготовительное оборудование",
    options: [
      "Ленточнопильный станок (металл)",
      "Дисково-отрезной станок",
      "Абразивно-отрезной станок",
      "Гильотинные ножницы",
      "Станок плазменной резки с ЧПУ",
      "Станок лазерной резки с ЧПУ",
      "Станок гидроабразивной резки с ЧПУ",
      "Координатно-пробивной пресс",
    ],
  },
  {
    label: "Токарная группа",
    options: [
      "Токарно-винторезный станок",
      "Токарно-револьверный станок",
      "Токарно-карусельный станок",
      "Токарный автомат/полуавтомат",
      "Токарный станок с ЧПУ",
      "Токарно-фрезерный обрабатывающий центр",
      "Лоботокарный станок",
    ],
  },
  {
    label: "Сверлильно-расточная группа",
    options: [
      "Вертикально-сверлильный станок",
      "Радиально-сверлильный станок",
      "Горизонтально-расточной станок",
      "Координатно-расточной станок",
      "Сверлильный станок с ЧПУ",
    ],
  },
  {
    label: "Фрезерная группа",
    options: [
      "Вертикально-фрезерный станок",
      "Горизонтально-фрезерный станок",
      "Универсально-фрезерный станок",
      "Продольно-фрезерный станок",
      "Фрезерный станок с ЧПУ (3/4-осевой)",
      "Фрезерный станок с ЧПУ (5-осевой)",
      "Вертикальный обрабатывающий центр",
      "Горизонтальный обрабатывающий центр",
    ],
  },
  {
    label: "Шлифовальная группа",
    options: [
      "Плоскошлифовальный станок",
      "Круглошлифовальный станок (наружный/внутренний)",
      "Внутришлифовальный станок",
      "Бесцентрово-шлифовальный станок",
      "Профилешлифовальный станок",
      "Резьбошлифовальный станок",
      "Зубошлифовальный станок",
      "Заточной станок (для инструмента)",
      "Хонинговальный станок",
    ],
  },
  {
    label: "Строгальная, долбежная, протяжная группа",
    options: [
      "Поперечно-строгальный станок",
      "Продольно-строгальный станок",
      "Долбежный станок",
      "Протяжной станок (горизонтальный/вертикальный)",
    ],
  },
  {
    label: "Кузнечно-прессовое оборудование",
    options: [
      "Кривошипный пресс",
      "Гидравлический пресс (ковочный/штамповочный)",
      "Листогибочный пресс с ЧПУ",
      "Трубогибочный станок с ЧПУ",
      "Молот (пневматический/паровоздушный)",
      "Горизонтально-ковочная машина (ГКМ)",
    ],
  },
  {
    label: "Сварочное оборудование (стационарное)",
    options: [
        "Сварочный робот / Роботизированный комплекс",
        "Установка для автоматической сварки под флюсом",
        "Машина контактной точечной/шовной сварки",
    ]
  },
  // Отдельные опции для "Другое" можно добавить так, или как отдельный элемент без label
  { label: "Другое", options: ["Специализированный агрегатный станок", "Другой тип оборудования"] }
];

const EQUIPMENT_STATUSES = [
    { value: 'working', label: 'В работе' },
    { value: 'maintenance', label: 'На обслуживании' },
    { value: 'repair', label: 'В ремонте' },
    { value: 'idle', label: 'Простаивает' },
    { value: 'decommissioned', label: 'Списано' },
];


const AddEquipment = () => {
  const [newEquipment, setNewEquipment] = useState<IEquipment>({
    name: '',
    type: '',
    description: '',
    status: EQUIPMENT_STATUSES[0].value,
    workshopId: ''
  });

  const [workshops, setWorkshops] = useState<IWorkshop[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // successMessage стейт больше не нужен
  // const [successMessage, setSuccessMessage] = useState<string | null>(null); 


  useEffect(() => {
    fetchWorkshops()
      .then(setWorkshops)
      .catch(err => {
        console.error("Ошибка загрузки цехов:", err);
        setError("Не удалось загрузить список цехов.");
      });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEquipment(prev => ({ ...prev, [name]: value }));
  };

  const handleCreate = async () => {
    setError(null); // Сбрасываем ошибку перед новой попыткой
    if (!newEquipment.name || !newEquipment.type || !newEquipment.workshopId || !newEquipment.status) {
      setError('Заполните все обязательные поля: Название, Тип, Цех и Статус.');
      return;
    }
  
    const workshopIdToSend = typeof newEquipment.workshopId === 'string' 
      ? newEquipment.workshopId 
      : newEquipment.workshopId?._id;

    if (!workshopIdToSend) {
        setError('Некорректный ID цеха.');
        return;
    }
  
    setIsSubmitting(true);

    try {
      const equipmentToCreate: Omit<IEquipment, '_id' | 'workshopId'> & { workshopId: string } = {
        name: newEquipment.name,
        type: newEquipment.type,
        description: newEquipment.description,
        status: newEquipment.status,
        workshopId: workshopIdToSend,
      };
      
      await createEquipment(equipmentToCreate);
      
      alert('Оборудование успешно создано!'); // <--- ИЗМЕНЕНИЕ ЗДЕСЬ
      
      setNewEquipment({ // Сброс формы
        name: '',
        type: '',
        description: '',
        status: EQUIPMENT_STATUSES[0].value,
        workshopId: ''
      });
    } catch (err) {
      console.error('Ошибка при создании оборудования:', err);

    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.formCard}>
        <h1>Создать новое оборудование</h1>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {/* Блок для successMessage удален */}
        {/* {successMessage && <div className={styles.successMessage}>{successMessage}</div>} */}

        {/* ... остальной JSX формы остается таким же ... */}
        <div className={styles.formGroup}>
          <label htmlFor="name">Название/Инв. номер оборудования</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Например, Станок токарный 16К20 №123"
            value={newEquipment.name}
            onChange={handleInputChange}
            className={styles.formInput}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="type">Тип оборудования</label>
          <select
            id="type"
            name="type"
            value={newEquipment.type}
            onChange={handleInputChange}
            className={styles.formSelect}
            required
          >
            <option value="" disabled>Выберите тип</option>
            {EQUIPMENT_TYPES_STRUCTURED.map(group => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map(typeOption => (
                  <option key={typeOption} value={typeOption}>
                    {typeOption}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="workshopId">Цех</label>
          <select
            id="workshopId"
            name="workshopId"
            value={typeof newEquipment.workshopId === 'string' ? newEquipment.workshopId : newEquipment.workshopId?._id || ''}
            onChange={handleInputChange}
            className={styles.formSelect}
            required
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
          <label htmlFor="status">Статус оборудования</label>
          <select
            id="status"
            name="status"
            value={newEquipment.status}
            onChange={handleInputChange}
            className={styles.formSelect}
            required
          >
            {EQUIPMENT_STATUSES.map(statusOption => (
              <option key={statusOption.value} value={statusOption.value}>
                {statusOption.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Описание (модель, год выпуска, особенности)</label>
          <textarea
            id="description"
            name="description"
            placeholder="Например, Модель XYZ, 2015 г.в., после капремонта"
            value={newEquipment.description}
            onChange={handleInputChange}
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