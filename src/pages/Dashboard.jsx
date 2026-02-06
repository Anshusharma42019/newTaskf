import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import * as api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const statsRes = await api.getTaskStats();
      const projectsRes = user?.role === 'admin' 
        ? await api.getAllProjects() 
        : await api.getProjects();
      const tasksRes = await api.getTasks();
      setStats(statsRes.data);
      setProjects(projectsRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.updateTask(taskId, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.welcomeSection}>
        <h1 style={styles.title}>Dashboard</h1>
        <div style={styles.roleTag}>
          <span style={styles.roleLabel}>Role:</span>
          <span style={styles.roleValue}>{user?.role?.toUpperCase() || 'USER'}</span>
        </div>
      </div>
      
      <div style={styles.statsGrid}>
        <div style={{...styles.statCard, backgroundColor: '#3498db'}}>
          <h3 style={styles.statNumber}>{stats.total}</h3>
          <p style={styles.statLabel}>Total Tasks</p>
        </div>
        <div style={{...styles.statCard, backgroundColor: '#27ae60'}}>
          <h3 style={styles.statNumber}>{stats.completed}</h3>
          <p style={styles.statLabel}>Completed</p>
        </div>
        <div style={{...styles.statCard, backgroundColor: '#f39c12'}}>
          <h3 style={styles.statNumber}>{stats.pending}</h3>
          <p style={styles.statLabel}>Pending</p>
        </div>
        <div style={{...styles.statCard, backgroundColor: '#9b59b6'}}>
          <h3 style={styles.statNumber}>{projects.length}</h3>
          <p style={styles.statLabel}>Projects</p>
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>
            {user?.role === 'admin' ? 'All Users Projects' : 'Recent Projects'}
          </h2>
          <Link to="/projects" style={styles.viewAllBtn}>View All Projects</Link>
        </div>
        <div style={styles.projectList}>
          {projects.slice(0, 5).map(project => (
            <div key={project._id} style={styles.projectItem}>
              <div>
                <h3 style={styles.projectTitle}>{project.title}</h3>
                <p style={styles.projectDesc}>{project.description || 'No description'}</p>
                {user?.role === 'admin' && project.owner && (
                  <p style={styles.ownerInfo}>
                    Owner: {project.owner.name} ({project.owner.email})
                  </p>
                )}
              </div>
              <Link to={`/projects/${project._id}/tasks`} style={styles.viewBtn}>View Tasks</Link>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>My Tasks</h2>
        </div>
        <div style={styles.taskGrid}>
          {tasks.slice(0, 6).map(task => (
            <div key={task._id} style={styles.taskCard}>
              <div style={styles.taskCardHeader}>
                <h4 style={styles.taskTitle}>{task.title}</h4>
                <span style={{...styles.badge, backgroundColor: getPriorityColor(task.priority)}}>
                  {task.priority}
                </span>
              </div>
              <p style={styles.taskDesc}>{task.description || 'No description'}</p>
              <div style={styles.taskMeta}>
                <span style={{...styles.badge, backgroundColor: getStatusColor(task.status)}}>
                  {task.status}
                </span>
                {task.project && (
                  <span style={styles.projectBadge}>📁 {task.project.title}</span>
                )}
              </div>
              {task.dueDate && (
                <p style={styles.dueDate}>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</p>
              )}
              <div style={styles.taskActions}>
                <button 
                  onClick={() => handleStatusChange(task._id, 'Todo')}
                  style={{...styles.statusBtn, backgroundColor: task.status === 'Todo' ? '#95a5a6' : '#ecf0f1', color: task.status === 'Todo' ? '#fff' : '#7f8c8d'}}
                  disabled={task.status === 'Todo'}
                >
                  Todo
                </button>
                <button 
                  onClick={() => handleStatusChange(task._id, 'In Progress')}
                  style={{...styles.statusBtn, backgroundColor: task.status === 'In Progress' ? '#3498db' : '#ecf0f1', color: task.status === 'In Progress' ? '#fff' : '#7f8c8d'}}
                  disabled={task.status === 'In Progress'}
                >
                  In Progress
                </button>
                <button 
                  onClick={() => handleStatusChange(task._id, 'Done')}
                  style={{...styles.statusBtn, backgroundColor: task.status === 'Done' ? '#27ae60' : '#ecf0f1', color: task.status === 'Done' ? '#fff' : '#7f8c8d'}}
                  disabled={task.status === 'Done'}
                >
                  Done
                </button>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <p style={styles.noTasks}>No tasks assigned yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

const getPriorityColor = (priority) => {
  switch(priority) {
    case 'High': return '#e74c3c';
    case 'Medium': return '#f39c12';
    case 'Low': return '#95a5a6';
    default: return '#95a5a6';
  }
};

const getStatusColor = (status) => {
  switch(status) {
    case 'Done': return '#27ae60';
    case 'In Progress': return '#3498db';
    case 'Todo': return '#95a5a6';
    default: return '#95a5a6';
  }
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    minHeight: '100vh'
  },
  welcomeSection: {
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
  roleTag: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '0.6rem 1.2rem',
    borderRadius: '25px',
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
  },
  roleLabel: {
    color: '#fff',
    fontSize: '0.9rem'
  },
  roleValue: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '1rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '3rem'
  },
  statCard: {
    padding: '2rem',
    borderRadius: '20px',
    color: '#fff',
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
    transform: 'translateY(0)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  },
  statNumber: {
    fontSize: '3rem',
    margin: '0 0 0.5rem 0',
    fontWeight: '800',
    textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
  },
  statLabel: {
    fontSize: '1.1rem',
    margin: 0,
    opacity: 0.95,
    fontWeight: '500',
    letterSpacing: '0.5px'
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: '2rem',
    borderRadius: '20px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    marginBottom: '2rem',
    backdropFilter: 'blur(10px)'
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  sectionTitle: {
    color: '#2c3e50',
    margin: 0,
    fontSize: '1.5rem',
    fontWeight: '700'
  },
  viewAllBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    padding: '0.6rem 1.2rem',
    borderRadius: '25px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
    transition: 'transform 0.2s'
  },
  projectList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  projectItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.2rem',
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    borderRadius: '12px',
    border: 'none',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    transition: 'transform 0.2s, box-shadow 0.2s'
  },
  projectTitle: {
    margin: '0 0 0.25rem 0',
    color: '#2c3e50',
    fontSize: '1.1rem'
  },
  projectDesc: {
    margin: 0,
    color: '#7f8c8d',
    fontSize: '0.9rem'
  },
  ownerInfo: {
    margin: '0.5rem 0 0 0',
    color: '#3498db',
    fontSize: '0.85rem',
    fontWeight: '500'
  },
  viewBtn: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    padding: '0.6rem 1.2rem',
    borderRadius: '25px',
    textDecoration: 'none',
    fontSize: '0.9rem',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(102,126,234,0.3)'
  },
  taskList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem'
  },
  taskGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '1.5rem'
  },
  taskCard: {
    padding: '1.5rem',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
    borderRadius: '15px',
    border: '2px solid transparent',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },
  taskCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: '0.5rem'
  },
  taskItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '4px',
    border: '1px solid #e0e0e0'
  },
  taskContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  taskTitle: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '1.1rem',
    fontWeight: '600',
    flex: 1
  },
  taskDesc: {
    margin: 0,
    color: '#7f8c8d',
    fontSize: '0.9rem',
    lineHeight: '1.5'
  },
  taskMeta: {
    display: 'flex',
    gap: '0.5rem',
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  badge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    color: '#fff',
    fontWeight: '500'
  },
  projectBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    backgroundColor: '#ecf0f1',
    color: '#2c3e50'
  },
  dueDateBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    backgroundColor: '#ecf0f1',
    color: '#2c3e50'
  },
  dueDate: {
    margin: 0,
    fontSize: '0.85rem',
    color: '#7f8c8d'
  },
  noTasks: {
    textAlign: 'center',
    color: '#7f8c8d',
    padding: '2rem',
    fontSize: '1rem'
  },
  taskActions: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    marginTop: 'auto',
    flexWrap: 'wrap'
  },
  statusBtn: {
    border: 'none',
    padding: '0.6rem 0.9rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    fontWeight: '600',
    flex: 1,
    minWidth: '80px',
    transition: 'all 0.3s',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },

};

export default Dashboard;
