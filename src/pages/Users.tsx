import React, { useState } from "react";

interface User {
  id: number;
  name: string;
  role: string;
  email: string;
  status: string;
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([
    { id: 1, name: "John Doe", role: "Admin", email: "john@company.com", status: "Active" },
    { id: 2, name: "Jane Smith", role: "Sales Rep", email: "jane@company.com", status: "Active" },
    { id: 3, name: "Mike Johnson", role: "Manager", email: "mike@company.com", status: "Inactive" },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    email: "",
    status: "Active"
  });

  const addUser = () => {
    if (formData.name && formData.role && formData.email) {
      const newUser: User = {
        id: Date.now(),
        name: formData.name,
        role: formData.role,
        email: formData.email,
        status: formData.status
      };
      setUsers([newUser, ...users]);
      setFormData({ name: "", role: "", email: "", status: "Active" });
      setShowAddForm(false);
    }
  };

  const editUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      role: user.role,
      email: user.email,
      status: user.status
    });
    setShowAddForm(true);
  };

  const updateUser = () => {
    if (editingUser && formData.name && formData.role && formData.email) {
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, name: formData.name, role: formData.role, email: formData.email, status: formData.status }
          : u
      ));
      setEditingUser(null);
      setFormData({ name: "", role: "", email: "", status: "Active" });
      setShowAddForm(false);
    }
  };

  const deleteUser = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const toggleUserStatus = (id: number) => {
    setUsers(users.map(u => 
      u.id === id 
        ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
        : u
    ));
  };

  return (
    <div>
      <h1>
        User Management 
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ marginLeft: '1rem', fontSize: '1rem' }}
        >
          {showAddForm ? "❌ Cancel" : "➕ Add User"}
        </button>
      </h1>

      {showAddForm && (
        <div className="user-list" style={{ marginBottom: '2rem' }}>
          <h2>{editingUser ? "Edit User" : "Add New User"}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
            >
              <option value="">Select Role</option>
              <option value="Admin">Admin</option>
              <option value="Manager">Manager</option>
              <option value="Sales Rep">Sales Rep</option>
              <option value="Support">Support</option>
            </select>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #ccc' }}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button onClick={editingUser ? updateUser : addUser}>
            {editingUser ? "💾 Update User" : "➕ Add User"}
          </button>
        </div>
      )}

      <div className="user-list">
        <h2>Team Members ({users.length})</h2>
        {users.map(user => (
          <div key={user.id} className="user-item">
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user.name}</div>
              <div style={{ color: '#64748b', fontSize: '0.9rem' }}>{user.email}</div>
              <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                <span style={{ 
                  background: user.role === 'Admin' ? '#ef4444' : user.role === 'Manager' ? '#f59e0b' : '#10b981',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  marginRight: '0.5rem'
                }}>
                  {user.role}
                </span>
                <span style={{ 
                  background: user.status === 'Active' ? '#10b981' : '#6b7280',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px'
                }}>
                  {user.status}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => editUser(user)}
                style={{ 
                  background: '#f59e0b',
                  padding: '0.5rem 1rem',
                  fontSize: '0.8rem'
                }}
              >
                ✏️ Edit
              </button>
              <button 
                onClick={() => toggleUserStatus(user.id)}
                style={{ 
                  background: user.status === 'Active' ? '#6b7280' : '#10b981',
                  padding: '0.5rem 1rem',
                  fontSize: '0.8rem'
                }}
              >
                {user.status === 'Active' ? '⏸️ Deactivate' : '▶️ Activate'}
              </button>
              <button 
                onClick={() => deleteUser(user.id)}
                className="delete-btn"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}