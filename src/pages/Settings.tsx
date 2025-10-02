import React, { useState } from "react";

export default function Settings() {
  const [settings, setSettings] = useState({
    companyName: "SaaS CRM Inc.",
    email: "admin@saascrm.com",
    notifications: true,
    darkMode: false,
    autoSave: true,
    language: "English",
    timezone: "UTC-5",
    currency: "USD"
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
  };

  const saveSettings = () => {
    // Simulate saving
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1>Settings</h1>
      
      <div className="user-list">
        <h2>Company Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Company Name
            </label>
            <input
              type="text"
              value={settings.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                border: '1px solid #ccc' 
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Admin Email
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                border: '1px solid #ccc' 
              }}
            />
          </div>
        </div>

        <h2>Preferences</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={(e) => handleChange('notifications', e.target.checked)}
                />
                <span>Enable Notifications</span>
              </label>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input
                  type="checkbox"
                  checked={settings.autoSave}
                  onChange={(e) => handleChange('autoSave', e.target.checked)}
                />
                <span>Auto-save Changes</span>
              </label>
            </div>
          </div>
          
          <div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Language
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '1px solid #ccc' 
                }}
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Timezone
              </label>
              <select
                value={settings.timezone}
                onChange={(e) => handleChange('timezone', e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '1px solid #ccc' 
                }}
              >
                <option value="UTC-8">Pacific Time (UTC-8)</option>
                <option value="UTC-5">Eastern Time (UTC-5)</option>
                <option value="UTC+0">GMT (UTC+0)</option>
                <option value="UTC+1">Central European Time (UTC+1)</option>
              </select>
            </div>
          </div>
        </div>

        <h2>System</h2>
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Default Currency
            </label>
            <select
              value={settings.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              style={{ 
                width: '200px', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                border: '1px solid #ccc' 
              }}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="JPY">JPY (¥)</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={saveSettings} style={{ background: saved ? '#10b981' : '#4f46e5' }}>
            {saved ? '✅ Saved!' : '💾 Save Settings'}
          </button>
          <button 
            onClick={() => setSettings({
              companyName: "SaaS CRM Inc.",
              email: "admin@saascrm.com",
              notifications: true,
              darkMode: false,
              autoSave: true,
              language: "English",
              timezone: "UTC-5",
              currency: "USD"
            })}
            style={{ background: '#6b7280' }}
          >
            🔄 Reset to Defaults
          </button>
        </div>
      </div>

      <div className="user-list" style={{ marginTop: '2rem' }}>
        <h2>System Information</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <strong>Version:</strong> v2.1.0
          </div>
          <div>
            <strong>Last Updated:</strong> {new Date().toLocaleDateString()}
          </div>
          <div>
            <strong>Database:</strong> Connected
          </div>
          <div>
            <strong>API Status:</strong> ✅ Online
          </div>
        </div>
      </div>
    </div>
  );
}