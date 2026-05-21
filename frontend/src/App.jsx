import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/api/todos`);
      setTodos(res.data);
    } catch (err) {
      setError('Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/todos`, { text: newTodo });
      setTodos([...todos, res.data]);
      setNewTodo('');
    } catch (err) {
      setError('Could not add todo');
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = async (id, completed) => {
    setLoading(true);
    try {
      const res = await axios.put(`${API_URL}/api/todos/${id}`, { completed: !completed });
      setTodos(todos.map(t => (t._id === id ? res.data : t)));
    } catch (err) {
      setError('Could not update todo');
    } finally {
      setLoading(false);
    }
  };

  const deleteTodo = async (id) => {
    setLoading(true);
    try {
      await axios.delete(`${API_URL}/api/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
    } catch (err) {
      setError('Could not delete todo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Todo App</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={addTodo} className="todo-form">
        <input
          type="text"
          placeholder="Add new todo"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>Add</button>
      </form>
      {loading && <p>Loading...</p>}
      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo._id} className={todo.completed ? 'completed' : ''}>
            <span onClick={() => toggleTodo(todo._id, todo.completed)}>{todo.text}</span>
            <button onClick={() => deleteTodo(todo._id)} className="delete">✕</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;