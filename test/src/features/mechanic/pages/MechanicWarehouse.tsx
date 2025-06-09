import { useEffect, useState } from 'react';
import { fetchInventory, createConsumableOrder, createManualConsumableRequest } from '../api';
import { IConsumable, CreateOrderParams, IUser, CreateManualRequestParams, Category } from '../../../shared/types';
import styles from '../../../shared/styles/pages/mechanic/warehousePage.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import CreateManualRequestModal from '../components/CreateManualRequestModal'; 

interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
  };
}
const WarehousePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [consumables, setConsumables] = useState<IConsumable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedConsumable, setSelectedConsumable] = useState<IConsumable | null>(null);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  const [isManualRequestModalOpen, setIsManualRequestModalOpen] = useState(false);
  const [manualRequestLoading, setManualRequestLoading] = useState(false);
  const [manualRequestError, setManualRequestError] = useState<string | null>(null);
  const [manualRequestSuccessMessage, setManualRequestSuccessMessage] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.auth.user) as IUser | null;

  useEffect(() => {
    const loadInventory = async () => {
      try {
        setLoading(true);
        setError(null); 
        const data = await fetchInventory();
        setConsumables(data);
      } catch (err) {
        console.error('Ошибка при загрузке данных:', err);
        setError('Не удалось загрузить данные со склада');
      } finally {
        setLoading(false);
      }
    };

    loadInventory();
  }, []); 

  const handleOrderClick = (consumable: IConsumable) => {
    setSelectedConsumable(consumable);
    setOrderQuantity(1);
    setIsOrderModalOpen(true);
    setOrderSuccess(false); // Сброс успеха при открытии
    setOrderError(null); // Сброс ошибки при открытии
    setOrderLoading(false); // Сброс загрузки
  };

  const handleOrderSubmit = async () => {
    if (!selectedConsumable || !user || orderLoading) return; 

    try {
      setOrderLoading(true);
      setOrderError(null);

      const orderData: CreateOrderParams = {
        name: selectedConsumable.name,
        quantity: orderQuantity.toString(),
        category: selectedConsumable.category,
        unit: selectedConsumable.unit,
        masterId: user._id,
        consumableId: selectedConsumable._id
      };

      await createConsumableOrder(orderData);
      setOrderSuccess(true);


      setTimeout(() => {
        setIsOrderModalOpen(false);
      }, 2000);
    } catch (err) {
      console.error('Ошибка при оформлении заказа:', err);
      const errorMessage = (err as ApiError).response?.data?.message || 'Не удалось оформить заказ';
      setOrderError(errorMessage);
    }
    finally {
      setOrderLoading(false);
    }
  };

  const handleOpenManualRequestModal = () => {
      if (!user?._id) {
          alert('Ошибка: Не удалось определить пользователя для создания заявки.');
          return;
      }
      setIsManualRequestModalOpen(true);
      setManualRequestSuccessMessage(null); 
      setManualRequestError(null); 
      setManualRequestLoading(false); 
  };

  const handleCloseManualRequestModal = () => {
      setIsManualRequestModalOpen(false);

  };

  const handleManualRequestSubmit = async (formData: { name: string; quantity: string; unit: string; category: string }) => {
      if (!user?._id || manualRequestLoading) return;

      try {
          setManualRequestLoading(true);
          setManualRequestError(null); 

          const requestData: CreateManualRequestParams = {
              name: formData.name,
              quantity: formData.quantity,
              unit: formData.unit,
              category: formData.category as Category, 
              masterId: user._id,
          };

          const newRequest = await createManualConsumableRequest(requestData);

          console.log('Manual request created:', newRequest);
          setManualRequestSuccessMessage(`Заявка "${newRequest.name}" успешно создана!`);

           setTimeout(() => {
               handleCloseManualRequestModal(); 
               setManualRequestSuccessMessage(null);
           }, 1000); 

          } catch (err) {
        console.error('Ошибка при создании заявки вручную:', err);
        const errorMessage = (err as ApiError).response?.data?.message || 'Не удалось создать заявку';
        setManualRequestError(errorMessage);
      } finally {
          setManualRequestLoading(false);
      }
  };


  const filteredConsumables = consumables.filter(consumable => {
    const query = searchQuery.toLowerCase();
    const nameMatch = consumable.name.toLowerCase().includes(query);
    const categoryMatch = consumable.category.toLowerCase().includes(query);
    return nameMatch || categoryMatch;
  });

  const getQuantityStatus = (quantity: string) => {
    const qty = parseInt(quantity);
    if (qty > 10) return 'high';
    if (qty > 0) return 'low';
    return 'out';
  };

  if (loading) {
    return <div className={styles.container}>Загрузка данных склада...</div>;
  }

  if (error) {
    return <div className={styles.container}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Склад</h1>
        <div className={styles.headerActions}>
          <div className={styles.search}>
            <input
              type="text"
              placeholder="Поиск по названию или категории..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <i className="fas fa-search"></i>
          </div>
          <button
            className={styles.createRequestButton}
            onClick={handleOpenManualRequestModal}
            disabled={!user}
          >
            <i className="fas fa-plus"></i> Создать заявку 
          </button>
        </div>
      </div>

      <div className={styles.grid}>
        {filteredConsumables.length > 0 ? (
          filteredConsumables.map((consumable) => (
            <div key={consumable._id} className={styles.consumableCard}>
              <div className={styles.cardHeader}>
                <h3>{consumable.name}</h3>
                <span className={
                  getQuantityStatus(consumable.quantity) === 'high' ? styles.inStockHigh :
                  getQuantityStatus(consumable.quantity) === 'low' ? styles.inStockLow :
                  styles.outOfStock
                }>
                  В наличии: {consumable.quantity} {consumable.unit}
                </span>
              </div>
              <div className={styles.cardMeta}>
                <span className={styles.category}>{consumable.category}</span>
                {consumable.quantity === "0" && (
                  <span className={styles.warning}>Требуется заказ!</span>
                )}
              </div>
              <div className={styles.cardFooter}>
                {/* Кнопка "Заказать" для существующего товара */}
                <button
                  className={styles.orderButton}
                  onClick={() => handleOrderClick(consumable)}
                  disabled={!user} // Отключаем, если пользователь не залогинен
                >
                  {consumable.quantity === "0" ? 'Срочный заказ' : 'Заказать'}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noResults}>
            {searchQuery ? 'Ничего не найдено' : 'Нет данных о расходниках'}
          </div>
        )}
      </div>

      {/* Модальное окно заказа существующего товара */}
      {isOrderModalOpen && selectedConsumable && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            {orderSuccess ? (
              <div className={styles.successMessage}>
                <h3>Заказ оформлен успешно!</h3>
                <p>
                  Заказано {orderQuantity} {selectedConsumable.unit} {selectedConsumable.name}
                </p>
              </div>
            ) : (
              <>
                <h2>Оформление заказа</h2>
                <p>Товар: <strong>{selectedConsumable.name}</strong></p>
                <p>Категория: <strong>{selectedConsumable.category}</strong></p>

                <div className={styles.formGroup}>
                  <label htmlFor="order-quantity">Количество:</label>
                  <input
                    id="order-quantity"
                    type="number"
                    min="1"
                    // max="100" // Уберите max, если нет ограничений
                    value={orderQuantity}
                    onChange={(e) => setOrderQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    disabled={orderLoading} // Отключаем ввод во время загрузки
                  />
                  <span>{selectedConsumable.unit}</span>
                </div>

                {orderError && <div className={styles.errorMessage}>{orderError}</div>} {/* Отображение ошибки */}


                <div className={styles.modalButtons}>
                  <button
                    className={styles.cancelButton}
                    onClick={() => setIsOrderModalOpen(false)}
                    disabled={orderLoading} 
                  >
                    Отмена
                  </button>
                  <button
                    className={styles.submitButton}
                    onClick={handleOrderSubmit}
                    disabled={orderLoading} 
                  >
                     {orderLoading ? 'Отправка...' : 'Подтвердить заказ'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <CreateManualRequestModal
          isOpen={isManualRequestModalOpen}
          onClose={handleCloseManualRequestModal}
          onSubmit={handleManualRequestSubmit}
          isLoading={manualRequestLoading}
          error={manualRequestError}
      />

        {manualRequestSuccessMessage && (
            <div className={`${styles.successMessage} ${styles.floatingMessage}`}>
                {manualRequestSuccessMessage}
            </div>
        )}

    </div>
  );
};

export default WarehousePage;