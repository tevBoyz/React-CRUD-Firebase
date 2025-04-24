import React, {useEffect, useData, useState} from 'react'
import {db} from '../Services/firebaseconfig'
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, runTransaction, serverTimestamp } from 'firebase/firestore'
import EditTask from './EditTask';

const Task = () => {

  const [tasks, setTasks] = useState([]);

  const [createTask, setCreateTask] = useState("");

  const [checked, setChecked] = useState([]);

  const collectionRef = collection(db, "Tasks");

  useEffect(()=> {
    const q = query(collectionRef, orderBy('timeStamp'))

    const getTasks = async () => {
      await getDocs(q).then((task)=>{
       let data = task.docs.map((doc)=> ({
        ...doc.data(), id: doc.id}))
        setChecked(data)
        setTasks(data);
      }).catch((err) => console.log(err)); 
    }
    getTasks();
  },[])

  //Add Task Handler
  const submitTask = async(e) => {
    e.preventDefault();
      if(createTask == ''){
        alert('No Task created!')
        window.location.reload()
      }
      else{
        try{
          await addDoc(collectionRef, {
            Task: createTask,
            isChecked: false,
            timeStamp: serverTimestamp()
          })
          window.location.reload();
        }catch(err) {
          console.log(err);
        }
      }
  }

  const deleteTask = async(id) => {
    try{
      let res = window.confirm('Are you sure you want to delete this task?')

      if(res) {
        const docRef = doc(db, "Tasks", id)
       await deleteDoc(docRef);
       window.location.reload();
      }
      
    }catch(e){
      console.log(e)
    }

  }

  const checkBoxEventHandler = async(event)=>{
    setChecked(state => {
      const index = state.findIndex(checkbox => checkbox.id.toString() === event.target.name)

      let newState = state.slice();
      newState.splice(index,1,{
        ...state[index],
        isChecked: !state[index]?.isChecked
      })
      setTasks(newState);
      return newState;  
  })

  try{

      const docRef = doc(db, "Tasks", event.target.name);
      await runTransaction(db, async (transaction) => {
        const taskDoc = await transaction.get(docRef)
        if(!taskDoc.exists)
          throw "Document does not exist";
        const newVal = !taskDoc.data().isChecked;
        transaction.update(docRef, {isChecked: newVal});
      })
      console.log("Transaction successful")
  }catch(e){
    console.log(e)
  }
}

  console.log("Tasks", tasks)
  return (
    <>
    <div className="container">
      <h1 className='title text-color-primary'>Task Manager</h1>
      <div className="row col-md-12">
      <div className="card card-white">
          <div className="card-body">

           {/* Button trigger modal */}
           <div class="d-grid gap-2">
<button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#AddTask">
  Add Task
</button>
</div>

            {tasks.map(({Task, id, isChecked,timeStamp}) =>

            <div className="todo-list" key={id}>
              
              <div className="todo-item">
                <hr/>
                <span className={`${isChecked ? 'done' : ''}`}>
                  <div className="checker">
                    <span>
                      <input 
                      type='checkbox'
                      checked={isChecked}
                      onChange={(event) => checkBoxEventHandler(event)}
                      name={id}
                      ></input>
                    </span>
                  </div>
                  &nbsp; {Task} <br/> <i>{new Date(timeStamp.seconds * 1000).toLocaleString()}</i>
                </span>
                
                <span className='float-end mx-3'>
                  <EditTask Task={Task} id={id}/>
                </span>

                <span className='float-end mx-3'>
                <button type='button' className='btn btn-danger  float-end mx-3' onClick={()=> deleteTask(id)}>Delete</button>

                </span>
              </div>
            </div>

)}

          </div>
        </div>
      </div>
    </div>



     {/* Modal */}
<div className="modal fade" id="AddTask" tabIndex="-1" aria-labelledby="AddTaskLabel" aria-hidden="true">
  <div className="modal-dialog">
  <form 
          className='d-flex' 
          onSubmit={submitTask}>
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="AddTaskLabel">Add a Task</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">

        
            <input 
              type="text" 
              className='form-control' 
              placeholder='Add a Task'
              onChange={e => setCreateTask(e.target.value)}
              ></input>

      </div>
      <div className="modal-footer">
        <button type="submit" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        <button type="submit" className="btn btn-primary">Add Task</button>
      </div>
    </div>
    </form>

  </div>
</div>

    </>
  )
}

export default Task