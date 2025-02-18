import { useReducer, useState } from "react";
import "./App.css";

function TodoApp() {
  const reducer = (state, action) => {
    switch (action.type) {
      case "ADD":
        return [{ id: Date.now(), text: action.payload, done: false, edit: false }, ...state];
      case "UPDATE":
        return state.map(task => 
          task.id === action.payload.id ? { ...task, text: action.payload.text, edit: false } : task
        );
      case "REMOVE":
        return state.filter(task => task.id !== action.payload);
      case "TOGGLE":
        return state.map(task => 
          task.id === action.payload ? { ...task, done: !task.done } : task
        );
      case "EDIT":
        return state.map(task => ({ ...task, edit: task.id === action.payload }));
      case "CANCEL":
        return state.map(task => (task.id === action.payload ? { ...task, edit: false } : task));
      default:
        throw new Error("Unknown action: " + action.type);
    }
  };

  const [tasks, dispatch] = useReducer(reducer, []);
  const [newTask, setNewTask] = useState("");
  const [editValue, setEditValue] = useState("");

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    dispatch({ type: "ADD", payload: newTask.trim() });
    setNewTask("");
  };

  return (
    <div className="todo-app">
      <h1>Task List</h1>
      <form onSubmit={addTask}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a task"
        />
        <button type="submit">Add</button>
      </form>

      <ul>
        {tasks.map(task => (
          <li key={task.id} className={task.done ? "completed" : ""}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => dispatch({ type: "TOGGLE", payload: task.id })}
            />
            {task.edit ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                />
                <button onClick={() => dispatch({ type: "UPDATE", payload: { id: task.id, text: editValue } })}>Save</button>
                <button onClick={() => dispatch({ type: "CANCEL", payload: task.id })}>Cancel</button>
              </>
            ) : (
              <>
                <span>{task.text}</span>
                <button onClick={() => { setEditValue(task.text); dispatch({ type: "EDIT", payload: task.id }); }}>Edit</button>
                <button disabled={!task.done} onClick={() => dispatch({ type: "REMOVE", payload: task.id })}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoApp;