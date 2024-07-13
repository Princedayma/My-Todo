import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import { FaEdit } from "react-icons/fa";
import { FaTrashCan } from "react-icons/fa6";
import { v4 as uuidv4 } from 'uuid';
import { TbMoodEmptyFilled } from "react-icons/tb";

function App() { 
  const [todo, setTodo] = useState("")
  const [description, setDescription] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setShowFinished] = useState(true)

  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if (todoString) {
      let todos = JSON.parse(todoString)
      setTodos(todos)
    }
  }, [])

  const saveToLS = () => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }

  const toggleFinished = () => {
    setShowFinished(!showFinished)
  }

  const handleEdit = (e, id) => { 
    let t = todos.filter(i => i.id === id) 
    setTodo(t[0].todo)
    setDescription(t[0].description)
    let newTodos = todos.filter(item => item.id !== id)
    setTodos(newTodos) 
    saveToLS()
  }

  const handleDelete = (e, id) => {  
    let newTodos = todos.filter(item => item.id !== id)
    setTodos(newTodos) 
    saveToLS()
  }

  const handleAdd = () => {
    const now = new Date()
    setTodos([...todos, { id: uuidv4(), todo, description, isCompleted: false, addedAt: now.toLocaleString() }])
    setTodo("") 
    setDescription("")
    saveToLS()
  }

  const handleChange = (e) => { 
    setTodo(e.target.value)
  }

  const handleDescriptionChange = (e) => { 
    setDescription(e.target.value)
  }

  const handleCheckbox = (e) => { 
    let id = e.target.name
    let index = todos.findIndex(item => item.id === id)
    let newTodos = [...todos]
    newTodos[index].isCompleted = !newTodos[index].isCompleted
    if (newTodos[index].isCompleted) {
      newTodos[index].completedAt = new Date().toLocaleString()
    }
    setTodos(newTodos)
    saveToLS()
  }

  return (
    <>
      
      <div className="mx-3 md:container md:mx-auto my-5 border-8 #5b21b6 rounded-xl p-5 bg-blue-200 min-h-[80vh] md:w-1/2">
        <h1 className='font-bold text-center text-xl'>My Todo - Manage your Task</h1>
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className='text-lg font-bold text-center'>Add a Task</h2>
          <input onChange={handleChange} value={todo} type="text" placeholder="Task Title" className='w-full rounded-full px-5 py-1' />
          <textarea onChange={handleDescriptionChange} value={description} placeholder="Task Description" className='w-full rounded-md px-5 py-1' />
          <button onClick={handleAdd} disabled={todo.length <= 3} className='w-full bg-cyan-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-cyan-700 transition duration-200'>Save</button>
        </div>
        <input className='my-4 ' onChange={toggleFinished} type="checkbox" checked={showFinished} /> Show Finished
        <h2 className='text-lg font-bold'>Pending Tasks</h2>
        <div className="todos">
          {todos.length === 0 && <div className='m-5'><TbMoodEmptyFilled />No Todos</div>}
          {todos.map(item => (
            !item.isCompleted && 
            <div key={item.id} className="todo flex md:w-2/3 my-9 justify-between">
              <div className='flex gap-5'>
                <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} />
                <div>
                  <div className="font-bold">{item.todo}</div>
                  <div>{item.description}</div>
                  <div className='text-sm text-gray-500'>Added: {item.addedAt}</div>
                </div>
              </div>
              <div className="buttons flex h-full">
                <button onClick={(e) => handleEdit(e, item.id)} className='bg-violet-800 hover:bg-yellow-500 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><FaEdit /></button>
                <button onClick={(e) => handleDelete(e, item.id)} className='bg-violet-800 hover:bg-red-500 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><FaTrashCan /></button>
              </div>
            </div>
          ))}
        </div>

        {showFinished && (
          <>
            <h2 className='text-lg font-bold'>Completed Tasks</h2>
            <div className="todos">
              {todos.filter(item => item.isCompleted).length === 0 && <div className='m-5'><TbMoodEmptyFilled />No Completed Tasks</div>}
              {todos.map(item => (
                item.isCompleted && 
                <div key={item.id} className="todo flex md:w-3/4 my-3 justify-between">
                  <div className='flex gap-5'>
                    <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted} />
                    <div>
                      <div className="font-bold line-through">{item.todo}</div>
                      <div className="line-through my-3">{item.description}</div>
                      <div className='text-sm  text-green-500 font-bold my-3'>Added: {item.addedAt}</div>
                      <div className='text-sm text-green-500 font-bold my-3'>Completed: {item.completedAt}</div>
                    </div>
                  </div>
                  <div className="buttons flex h-full">
                    <button onClick={(e) => handleEdit(e, item.id)} className='bg-violet-800 hover:bg-yellow-500 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><FaEdit /></button>
                    <button onClick={(e) => handleDelete(e, item.id)} className='bg-violet-800 hover:bg-red-500 p-2 py-1 text-sm font-bold text-white rounded-md mx-1'><FaTrashCan /></button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default App
