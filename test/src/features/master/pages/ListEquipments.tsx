import { useEffect, useState } from 'react';
import { IEquipment } from '../../../shared/types';
import { fetchEquipments } from "../../admin/api";
import './ListEquipments.scss';

const ListEquipments = () => {
  const [equipments, setEquipments] = useState<IEquipment[]>([]);
  
  useEffect(() => {
    fetchEquipments()
      .then((eq) => {
        setEquipments(eq);
      })
      .catch((error) => {
        console.error('Error fetching equipments:', error);
      });
  }, []);

  return (
    <div className="equipments-list">
      {equipments.map((eq) => (
        <div key={eq._id} className="equipment-item">
          <span className="equipment-name">{eq.name}</span>
          <span className={`equipment-status ${eq.status?.toLowerCase()}`}>
            {eq.status}
          </span>
        </div>
      ))}
    </div>
  );
};

export default ListEquipments;