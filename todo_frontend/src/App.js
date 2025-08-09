import React, { useState, useEffect, useRef } from "react";
import "./App.css";

/**
 * Minimalistic Todo App - React implementation
 * Features: Add, Edit, Delete, Mark as Completed, View list of todos
 * Light theme, primary (#1976d2), accent (#ff9800), secondary (#424242)
 */

// PUBLIC_INTERFACE
function App() {
  // State for todo items
  const [todos, setTodos] = useState([]);
  // Current input values
  const [input, setInput] = useState("");
  const [desc, setDesc] = useState("");
  // Determines if editing; when null, create mode, else edit mode
  const [editingId, setEditingId] = useState(null);
  // Filter mode: "all" or "completed"
  const [filter, setFilter] = useState("all");

  const inputRef = useRef();

  // Focus on input after render
  useEffect(() => {
    inputRef.current?.focus();
  }, [editingId]);

  // PUBLIC_INTERFACE
  function handleAddTodo(e) {
    e.preventDefault();
    if (!input.trim()) return;
    if (editingId !== null) {
      // Edit existing
      setTodos((t) =>
        t.map((todo) =>
          todo.id === editingId
            ? { ...todo, title: input, desc: desc }
            : todo
        )
      );
      setEditingId(null);
    } else {
      // Add new
      setTodos([
        ...todos,
        {
          id: Date.now(),
          title: input,
          desc: desc,
          completed: false
        }
      ]);
    }
    setInput("");
    setDesc("");
  }

  // PUBLIC_INTERFACE
  function handleEditTodo(todo) {
    setInput(todo.title);
    setDesc(todo.desc);
    setEditingId(todo.id);
    inputRef.current?.focus();
  }

  // PUBLIC_INTERFACE
  function handleDeleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
    if (editingId === id) {
      setInput("");
      setDesc("");
      setEditingId(null);
    }
  }

  // PUBLIC_INTERFACE
  function handleToggleCompleted(id) {
    setTodos((t) =>
      t.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function handleCancelEdit() {
    setEditingId(null);
    setInput("");
    setDesc("");
  }

  function handleFilterChange(mode) {
    setFilter(mode);
  }

  // Filter for display
  let filteredTodos =
    filter === "all" ? todos : todos.filter((todo) => todo.completed);

  return (
    <div className="todo-root">
      {/* Header bar */}
      <header className="todo-header">
        <div className="todo-header-content">
          <span className="todo-app-title">TODO APP</span>
        </div>
        <nav className="todo-header-nav">
          <button
            className={`nav-btn${filter === "all" ? " active" : ""}`}
            tabIndex={0}
            style={{ "--nav-color": "var(--primary-color)" }}
            onClick={() => handleFilterChange("all")}
          >
            All
          </button>
          <button
            className={`nav-btn${filter === "completed" ? " active" : ""}`}
            tabIndex={0}
            style={{ "--nav-color": "var(--accent-color)" }}
            onClick={() => handleFilterChange("completed")}
          >
            Completed
          </button>
        </nav>
      </header>

      {/* Add/Edit form */}
      <form className="add-form" onSubmit={handleAddTodo} autoComplete="off">
        <div className="form-fields">
          <input
            ref={inputRef}
            type="text"
            maxLength={50}
            placeholder="Todo title"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="input-title"
            aria-label="Todo title"
            required
          />
          <input
            type="text"
            maxLength={120}
            placeholder="Description (optional)"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="input-desc"
            aria-label="Todo description"
          />
        </div>
        <div className="form-buttons">
          <button
            type="submit"
            className="submit-btn"
            style={{
              background: "var(--primary-color)",
              color: "#fff"
            }}
            aria-label={editingId !== null ? "Update todo" : "Add todo"}
          >
            {editingId !== null ? "Update" : "Add"}
          </button>
          {editingId !== null && (
            <button
              type="button"
              className="cancel-btn"
              style={{
                background: "var(--secondary-color)",
                color: "#fff"
              }}
              onClick={handleCancelEdit}
              aria-label="Cancel"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Todo list */}
      <main className="todo-list-container">
        <ul className="todo-list" aria-label="Todo list">
          {filteredTodos.length === 0 && (
            <li className="empty-message">No todos found.</li>
          )}
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-item${todo.completed ? " completed" : ""}`}
              aria-label={todo.completed ? "Completed todo" : "Todo"}
            >
              <div className="todo-main">
                <span
                  className="todo-title"
                  aria-label={`Title: ${todo.title}`}
                  title={todo.title}
                >
                  {todo.title}
                </span>
                {todo.desc && (
                  <span
                    className="todo-desc"
                    title={todo.desc}
                  >
                    {todo.desc}
                  </span>
                )}
              </div>
              <div className="todo-actions">
                <button
                  title={
                    todo.completed
                      ? "Mark as incomplete"
                      : "Mark as completed"
                  }
                  aria-label={
                    todo.completed
                      ? "Mark as incomplete"
                      : "Mark as completed"
                  }
                  className={`action-btn complete-btn${
                    todo.completed ? " marked" : ""
                  }`}
                  style={{ color: "var(--primary-color)" }}
                  onClick={() => handleToggleCompleted(todo.id)}
                >
                  {todo.completed ? (
                    <CheckIcon />
                  ) : (
                    <CircleIcon />
                  )}
                </button>
                <button
                  title="Edit"
                  aria-label="Edit"
                  className="action-btn edit-btn"
                  style={{ color: "var(--accent-color)" }}
                  onClick={() => handleEditTodo(todo)}
                  disabled={editingId === todo.id}
                >
                  <EditIcon />
                </button>
                <button
                  title="Delete"
                  aria-label="Delete"
                  className="action-btn delete-btn"
                  style={{ color: "var(--secondary-color)" }}
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  <DeleteIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>

      {/* Floating Add Button on Mobile */}
      {editingId === null && (
        <button
          className="fab-add"
          aria-label="Quick Add"
          title="Add todo"
          onClick={() => inputRef.current?.focus()}
        >
          <PlusIcon />
        </button>
      )}
    </div>
  );
}

/******** ICONS ********/
function PlusIcon() {
  // PUBLIC_INTERFACE
  return (
    <svg height="30" width="30" viewBox="0 0 30 30" fill="none">
      <circle cx="15" cy="15" r="14" fill="var(--primary-color)" />
      <rect x="8" y="14" width="14" height="2" rx="1" fill="#fff" />
      <rect x="14" y="8" width="2" height="14" rx="1" fill="#fff" />
    </svg>
  );
}

function EditIcon() {
  // PUBLIC_INTERFACE
  return (
    <svg viewBox="0 0 20 20" height="20" width="20" fill="none">
      <rect
        x="3"
        y="15.25"
        width="14"
        height="1.5"
        rx="0.75"
        fill="var(--secondary-color)"
      />
      <path
        d="M13.68 5.02l1.31 1.31c.21.21.21.54 0 .75l-7.21 7.21c-.08.08-.18.13-.29.15l-1.98.33c-.4.06-.73-.27-.67-.67l.33-1.98c.02-.11.07-.21.15-.29l7.21-7.21c.21-.21.54-.21.75 0zm-8.25 8.96l-.33 1.98 1.98-.33 7.2-7.2-1.65-1.65-7.2 7.2z"
        fill="var(--accent-color)"
      />
    </svg>
  );
}
function DeleteIcon() {
  // PUBLIC_INTERFACE
  return (
    <svg height="20" width="20" viewBox="0 0 20 20" fill="none">
      <rect x="5" y="7" width="10" height="10" rx="2" fill="var(--secondary-color)" />
      <rect
        x="9"
        y="10"
        width="2"
        height="5"
        rx="1"
        fill="#fff"
      />
      <rect
        x="9"
        y="7"
        width="2"
        height="2"
        rx="1"
        fill="#fff"
      />
    </svg>
  );
}
function CircleIcon() {
  // PUBLIC_INTERFACE
  return (
    <svg height="22" width="22" viewBox="0 0 22 22" fill="none">
      <circle
        cx="11"
        cy="11"
        r="9"
        stroke="var(--primary-color)"
        strokeWidth="2"
        fill="none"
      />
    </svg>
  );
}
function CheckIcon() {
  // PUBLIC_INTERFACE
  return (
    <svg height="22" width="22" viewBox="0 0 22 22" fill="none">
      <circle
        cx="11"
        cy="11"
        r="9"
        stroke="var(--primary-color)"
        strokeWidth="2"
        fill="none"
      />
      <path
        d="M7 11.5l3 3 5-5"
        stroke="var(--primary-color)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default App;
