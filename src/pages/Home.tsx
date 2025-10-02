import React, { useState, useEffect } from "react";

interface Task {
  id: number;
  text: string;
  done: boolean;
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: "Follow up with lead #101", done: false },
    { id: 2, text: "Review monthly sales report", done: false },
    { id: 3, text: "Prepare client presentation", done: true }
  ]);
  
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([
    "Contact high-value lead #202",
    "Prepare proposal for client X"
  ]);
  
  const [notifications, setNotifications] = useState<string[]>([
    "New lead assigned to you",
    "Meeting scheduled for 3 PM"
  ]);

  const [newTaskText, setNewTaskText] = useState("");

  useEffect(() => {
    const suggestions = [
      "Contact high-value lead #202",
      "Prepare proposal for client X",
      "Follow up on overdue invoices",
      "Schedule team meeting",
      "Update CRM database",
      "Send quarterly report",
      "Review customer feedback",
      "Plan marketing campaign"
    ];

    const notificationTemplates = [
      "New lead assigned",
      "Meeting reminder",
      "Task completed",
      "Revenue milestone reached",
      "Customer feedback received",
      "System update available"
    ];

    const interval = setInterval(() => {
      const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
      const randomNotification = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)];
      
      setAiSuggestions(prev => [randomSuggestion, ...prev.slice(0, 4)]);
      setNotifications(prev => [`${randomNotification} - ${new Date().toLocaleTimeString()}`, ...prev.slice(0, 4)]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const addTask = () => {
    if (newTaskText.trim()) {
      setTasks([{ id: Date.now(), text: newTaskText, done: false }, ...tasks]);
      setNewTaskText("");
    }
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const editTask = (id: number) => {
    const newText = prompt("Edit task:", tasks.find(t => t.id === id)?.text);
    if (newText) {
      setTasks(tasks.map(t => t.id === id ? { ...t, text: newText } : t));
    }
  };

  return (
    <div>
      <h1>Dashboard Overview</h1>
      
      <div className="dashboard-panels">
        <div>
          <div className="cards">
            <div className="card">
              <h2>New Leads</h2>
              <p>{Math.floor(Math.random() * 50) + 10}</p>
            </div>
            <div className="card">
              <h2>Revenue</h2>
              <p>${(Math.floor(Math.random() * 20000) + 5000).toLocaleString()}</p>
            </div>
            <div className="card">
              <h2>Tasks Pending</h2>
              <p>{tasks.filter(t => !t.done).length}</p>
            </div>
            <div className="card">
              <h2>Conversion Rate</h2>
              <p>{(Math.random() * 20 + 15).toFixed(1)}%</p>
            </div>
          </div>

          <div className="notifications">
            <h2>
              Task Management 
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <input 
                  type="text" 
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="New task..."
                  style={{ 
                    padding: '0.5rem', 
                    borderRadius: '4px', 
                    border: '1px solid #ccc',
                    fontSize: '0.8rem'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                />
                <button onClick={addTask} style={{ padding: '0.5rem', fontSize: '0.8rem' }}>
                  ➕ Add
                </button>
              </div>
            </h2>
            <ul>
              {tasks.map(task => (
                <li key={task.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  textDecoration: task.done ? 'line-through' : 'none',
                  opacity: task.done ? 0.6 : 1
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                      type="checkbox" 
                      checked={task.done} 
                      onChange={() => toggleTask(task.id)}
                    />
                    <span>{task.text}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button 
                      onClick={() => editTask(task.id)}
                      style={{ 
                        padding: '0.25rem 0.5rem', 
                        fontSize: '0.7rem',
                        background: '#f59e0b'
                      }}
                    >
                      ✏️
                    </button>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      style={{ 
                        padding: '0.25rem 0.5rem', 
                        fontSize: '0.7rem',
                        background: '#ef4444'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="notifications">
          <h2>🤖 AI Suggestions</h2>
          <ul>
            {aiSuggestions.map((s, i) => (
              <li key={i}>💡 {s}</li>
            ))}
          </ul>

          <h2>🔔 Live Notifications</h2>
          <ul>
            {notifications.map((n, i) => (
              <li key={i}>🔔 {n}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}