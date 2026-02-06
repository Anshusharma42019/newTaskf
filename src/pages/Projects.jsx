import { useState, useEffect } from 'react';
import * as api from '../services/api';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.getProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.createProject(formData);
      setFormData({ title: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project and all its tasks?')) {
      try {
        await api.deleteProject(id);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Projects</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.addBtn}>
          {showForm ? 'Cancel' : '+ New Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Project Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            style={styles.input}
            required
          />
          <textarea
            placeholder="Project Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            style={styles.textarea}
            rows="3"
          />
          <button type="submit" style={styles.submitBtn}>Create Project</button>
        </form>
      )}

      <div style={styles.grid}>
        {projects.map(project => (
          <ProjectCard key={project._id} project={project} onDelete={handleDelete} />
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2.5rem',
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.95)',
    borderRadius: '15px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
  },
  title: {
    color: '#2c3e50',
    margin: 0,
    fontSize: '2rem',
    fontWeight: '700'
  },
  addBtn: {
    background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    color: '#fff',
    border: 'none',
    padding: '0.8rem 1.8rem',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '700',
    boxShadow: '0 4px 15px rgba(17,153,142,0.4)',
    transition: 'transform 0.2s'
  },
  form: {
    background: 'rgba(255,255,255,0.95)',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
    backdropFilter: 'blur(10px)'
  },
  input: {
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    fontSize: '1rem',
    marginBottom: '1rem',
    boxSizing: 'border-box',
    transition: 'border 0.3s'
  },
  textarea: {
    width: '100%',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid #e0e0e0',
    fontSize: '1rem',
    marginBottom: '1rem',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border 0.3s'
  },
  submitBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    padding: '0.9rem 2rem',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '700',
    boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
    transition: 'transform 0.2s'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '2rem'
  }
};

export default Projects;
