import { Link } from 'react-router-dom';

const ProjectCard = ({ project, onDelete }) => {
  return (
    <div style={styles.card}>
      <h3 style={styles.title}>{project.title}</h3>
      <p style={styles.description}>{project.description || 'No description'}</p>
      <p style={styles.date}>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
      <div style={styles.actions}>
        <Link to={`/projects/${project._id}/tasks`} style={styles.viewBtn}>View Tasks</Link>
        <button onClick={() => onDelete(project._id)} style={styles.deleteBtn}>Delete</button>
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    border: '1px solid #e0e0e0'
  },
  title: {
    margin: '0 0 0.5rem 0',
    color: '#2c3e50',
    fontSize: '1.25rem'
  },
  description: {
    color: '#7f8c8d',
    margin: '0.5rem 0',
    fontSize: '0.9rem'
  },
  date: {
    color: '#95a5a6',
    fontSize: '0.85rem',
    margin: '0.5rem 0'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem'
  },
  viewBtn: {
    backgroundColor: '#3498db',
    color: '#fff',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: '0.9rem'
  },
  deleteBtn: {
    backgroundColor: '#e74c3c',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem'
  }
};

export default ProjectCard;
