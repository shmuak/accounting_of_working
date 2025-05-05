import { useEffect, useState } from "react";
import { IRequest } from "../../../shared/types";
import {fetchRequests, deleteRequest} from "../api";
import { useDispatch } from 'react-redux'
import { logout } from "../../auth/authSlice";
import styles from '../../../shared/styles/pages/listUsers.module.scss'
const ListRequest = () => {
    const dispatch = useDispatch()
    const [requests, setRequests] = useState<IRequest[]>([]);
    
    const loadRequests = () => {
        fetchRequests()
        .then(setRequests)
        .catch((err) => {
         console.error("Ошибка при получении заявок:", err.response?.data || err.message)
         dispatch(logout())
       })
    }
    useEffect(() => {
        loadRequests();
    }, [])

    const handleDelete = async (id:string) => {
        await deleteRequest(id);
        loadRequests();
    }

    return (
        <div className={styles.container}>
        <h1>Список заявок</h1>
        
        <ul>
          {requests.map((req) => (
            <li key={req._id} className={styles.item}>
                  <div className={styles.userInfo}>
                    <span className={styles.userId}>{req._id}</span>
                    <span className={styles.userLogin}>{req.title}</span>
                    <span className={styles.userRole}>{req.status}</span>
                    <span className={styles.userRole}>{req.description || 'Нет описания'}</span>
                  </div>
                  <div className={styles.actions}>
                    <button className={styles.deleteButton} onClick={() => handleDelete(req._id)}>Удалить</button>
                  </div>
            </li>
          ))}
        </ul>
  
      </div>
)}

export default ListRequest;