    export interface IRole {
      _id: string;
      value: string;
    }

    export interface IUser {
      _id: string;
      login: string;
      role: string;
      workshop: IWorkshop | string;
    }

    export interface IWorkshop {
      _id: string;
      name: string;
      location: string;
      description: string;
    }

    export interface ITokenPayload {
      _id: string;
      role: string;
      exp: number;
    }

    export interface IRequest {
      _id: string;
      title: string;
      description?: string;
      status: string;
      equipmentId: IEquipment | string;
      masterId?: string | null;
    }


    export interface IRequestMechanic {
      _id: string;
      title: string;
      description?: string;
      status: 'Pending' | 'InProgress' | 'Completed' | 'Cancelled';
      completedAt?: string;
      equipmentId: IEquipment | string;
      masterId: string | { _id: string; login: string };
      masterScheduleId?: string;
      createdAt?: string;
      updatedAt?: string;
    }

    export interface IEquipment {
      _id?: string;
      name: string;
      type: string;
      description: string;
      status: string;
      workshopId: IWorkshop | string;
    }

    export interface IConsumable {
      _id: string;
      name: string;
      unit: string;
      quantity: string;
      category: Category; 

    }

    export const Categories = {
      Запчасти: 'Запчасти',
      Инструменты: 'Инструменты',
      Расходники: 'Расходники',
      Электроника: 'Электроника',
      Прочее: 'Прочее'
    } as const;
    export type Category = 'Запчасти' | 'Инструменты' | 'Расходники' | 'Электроника' | 'Прочее';
    export const ALL_CATEGORIES = ['Все категории', ...Object.values(Categories)] as const;

    // Тип для статусов заявок на расходники
    export type ConsumableRequestStatus = 'В обработке' | 'Принято' | 'Прибыло' | 'Отменено'; // НОВЫЙ ТИП

    // Интерфейс для создания заявки из списка склада (уже есть)
    export interface CreateOrderParams {
      name: string; // Хотя на бекенде берется из consumable, фронтенд может ее отправлять
      quantity: string;
      category: Category; // Используем типизированную категорию
      unit: string;
      masterId: string;
      consumableId: string; // Здесь consumableId обязателен
    }

    // НОВЫЙ Интерфейс для создания заявки вручную
    export interface CreateManualRequestParams {
      name: string;
      quantity: string;
      unit: string;
      category: Category; // Используем типизированную категорию
      masterId: string;
      // consumableId здесь отсутствует
    }

    // Обновленный интерфейс заявки на расходник
    export interface IConsumableRequest {
      _id: string;
      name: string;
      quantity: string;
      unit: string;
      category: Category; // Используем типизированную категорию
      // masterId может быть популяризирован или просто string (ID)
      masterId: string | { _id: string; login: string };
      // consumableId может быть null для заявок, созданных вручную
      consumableId: string | IConsumable | null; // Обновлено: добавлено | null
      createdAt: string;
      updatedAt?: string;
      status: ConsumableRequestStatus; // НОВОЕ ПОЛЕ
    }

    export interface FetchConsumableRequestsParams {
      masterId: string;
      // Теперь можно фильтровать и по статусу
      status?: ConsumableRequestStatus | 'all'; 
    }

export interface UsedConsumable {
  id: string;
  quantity: number;
}

export interface CreateAjasterRequestParams {
  title: string;
  description: string;
  equipmentId: string;
  masterId: string;
  usedConsumables: {
    consumableId: string;
    quantity: number;
  }[];
}
export interface CompleteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (workDescription: string, usedConsumables: string[]) => Promise<void>;
  consumables: IConsumable[];
}