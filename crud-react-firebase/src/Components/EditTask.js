import React, {useState} from 'react'
import {db} from '../Services/firebaseconfig'
import { doc, updateDoc } from 'firebase/firestore'

const EditTask = ({Task, id}) => {

  const [updatedTask, setUpdatedTask] = useState([Task])

  const updateTask = async (e) => {
    e.preventDefault();
    
    try{
      const taskDoc = doc(db,"Tasks",id);
        await updateDoc(taskDoc, {
          Task: updatedTask,
          isChecked: false
        });
        window.location.reload();
    }catch(err)
    {
      console.log(err)
    }

  }

  return (
    <>

<button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target={`#id${id}`}>
  Update Task
</button>

      {/* Modal */}
<div className="modal fade" id={`id${id}`} tabIndex="-1" aria-labelledby="AddTaskLabel" aria-hidden="true">
  <div className="modal-dialog">
  <form className='d-flex'>
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="AddTaskLabel">Edit Task</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        <input 
          type="text" 
          className='form-control'               
          defaultValue={updatedTask}
          onChange={e => setUpdatedTask(e.target.value)}
        ></input>
      </div>
      <div className="modal-footer">
        <button type="submit" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="submit" className="btn btn-primary" onClick={(e) => updateTask(e)}>Update Task</button>
      </div>
    </div>
    </form>

  </div>
</div>
    </>
  )
}

export default EditTask 