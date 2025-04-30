import { useState } from "react"
import { IWorkshop } from "../../../../shared/types"
import { createWorkshop } from "../../api"
import styles from "../../../../shared/styles/pages/addWorkshop.module.scss"

const AddWorkshop = () => {
      const [newWorkshop, setNewWorkshop] = useState<Partial<IWorkshop>>({ name: '', location: '', description: '' })
    
      const handleCreate = async () => {
        await createWorkshop(newWorkshop)
        setNewWorkshop({ name: '', location: '', description: '' })
      }
    
    return (
        <div className={styles.formContainer}>
        <h1>Создать новый цех</h1>
        <input
          type="text"
          placeholder="Name"
          value={newWorkshop.name || ''}
          onChange={(e) => setNewWorkshop({ ...newWorkshop, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Location"
          value={newWorkshop.location || ''}
          onChange={(e) => setNewWorkshop({ ...newWorkshop, location: e.target.value })}
        />
        <input
          type="text"
          placeholder="Description"
          value={newWorkshop.description || ''}
          onChange={(e) => setNewWorkshop({ ...newWorkshop, description: e.target.value })}
        />
        <button onClick={handleCreate} className={styles.addButton}>Создать</button>
      </div>
    )
}

export default AddWorkshop;