import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import * as api from '../services/api';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, password: '' });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = { name: formData.name, email: formData.email };
      if (formData.password) {
        updateData.password = formData.password;
      }
      const response = await api.updateProfile(updateData);
      localStorage.setItem('user', JSON.stringify(response.data));
      setMessage('Profile updated successfully!');
      setFormData({ ...formData, password: '' });
    } catch (error) {
      setMessage('Error updating profile');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Profile</h2>
        {message && <div style={styles.message}>{message}</div>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>New Password (leave blank to keep current)</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={styles.input}
              minLength="6"
            />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>Role</label>
            <input
              type="text"
              value={user?.role || ''}
              style={styles.input}
              disabled
            />
          </div>
          <button type="submit" style={styles.button}>Update Profile</button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '2rem',
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  card: {
    background: 'rgba(255,255,255,0.95)',
    padding: '3rem',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    backdropFilter: 'blur(10px)'
  },
  title: {
    color: '#2c3e50',
    marginBottom: '2rem',
    fontSize: '2rem',
    fontWeight: '700',
    textAlign: 'center'
  },
  message: {
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    color: '#fff',
    padding: '1rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    textAlign: 'center',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(17,153,142,0.3)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },
  field: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    color: '#2c3e50',
    marginBottom: '0.6rem',
    fontWeight: '600',
    fontSize: '0.95rem'
  },
  input: {
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    fontSize: '1rem',
    transition: 'border 0.3s',
    background: '#fff'
  },
  button: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    padding: '1rem',
    border: 'none',
    borderRadius: '25px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: '700',
    marginTop: '1rem',
    boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
    transition: 'transform 0.2s'
  }
};

export default Profile;
