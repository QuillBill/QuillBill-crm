import React, { useState } from "react";
import { FiPlus, FiEdit3, FiTrash2, FiUser, FiMail, FiShield, FiPlay, FiPause } from "react-icons/fi";

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
        <FiUsers className="inline mr-3" />User Management 
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="add-user-btn ml-4"
        >
          {showAddForm ? "Cancel" : <><FiPlus className="mr-2" />Add User</>}
        </button>
      </h1>

      {showAddForm && (
        <div className="user-list" style={{ marginBottom: '2rem' }}>
          <h2>
            <FiUser className="inline mr-2" />
            {editingUser ? "Edit User" : "Add New User"}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <button onClick={editingUser ? updateUser : addUser}>
            {editingUser ? "Update User" : <><FiPlus className="mr-2" />Add User</>}
          </button>
        </div>
      )}

      <div className="user-list">
        <h2>
          <FiUser className="inline mr-2" />
          Team Members ({users.length})
        </h2>
        {users.map(user => (
          <div key={user.id} className="user-item">
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiUser className="text-gray-500" />
                {user.name}
              </div>
              <div style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FiMail className="text-gray-400" />
                {user.email}
              </div>
              <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                <span style={{ 
                  background: user.role === 'Admin' ? 'linear-gradient(135deg, #ef4444, #fc8181)' : user.role === 'Manager' ? 'linear-gradient(135deg, #f59e0b, #fbb040)' : 'linear-gradient(135deg, #10b981, #48bb78)',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  marginRight: '0.5rem'
                }}>
                  <FiShield className="inline mr-1" />
                  {user.role}
                </span>
                <span style={{ 
                  background: user.status === 'Active' ? 'linear-gradient(135deg, #10b981, #48bb78)' : 'linear-gradient(135deg, #6b7280, #9ca3af)',
                  color: 'white',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px'
                }}>
                  <span className={`status-indicator ${user.status === 'Active' ? 'status-active' : 'status-inactive'}`}></span>
                  {user.status}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={() => editUser(user)}
                className="edit-btn"
              >
                <FiEdit3 className="mr-1" /> Edit
              </button>
              <button 
                onClick={() => toggleUserStatus(user.id)}
                style={{ 
                  background: user.status === 'Active' ? 'linear-gradient(135deg, #6b7280, #9ca3af)' : 'linear-gradient(135deg, #10b981, #48bb78)',
                  padding: '0.5rem 1rem',
                  fontSize: '0.8rem',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px'
                }}
              >
                {user.status === 'Active' ? <><FiPause className="mr-1" /> Deactivate</> : <><FiPlay className="mr-1" /> Activate</>}
              </button>
              <button 
                onClick={() => deleteUser(user.id)}
                className="delete-btn"
              >
                <FiTrash2 className="mr-1" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}