const TaskCard = ({ task, onDelete, onStatusChange }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#e74c3c';
      case 'Medium': return '#f39c12';
      case 'Low': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Done': return '#27ae60';
      case 'In Progress': return '#3498db';
      case 'Todo': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{task.title}</h3>
        <span style={{...styles.priority, backgroundColor: getPriorityColor(task.priority)}}>
          {task.priority}
        </span>
      </div>
      <p style={styles.description}>{task.description || 'No description'}</p>
      <div style={styles.info}>
        <span style={{...styles.status, backgroundColor: getStatusColor(task.status)}}>
          {task.status}
        </span>
        {task.dueDate && (
          <span style={styles.date}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        )}
      </div>
      {task.assignedTo && (
        <p style={styles.assigned}>Assigned to: {task.assignedTo.name}</p>
      )}
      <div style={styles.actions}>
        <button 
          onClick={() => onStatusChange(task._id, 'Todo')}
          style={{...styles.statusBtn, backgroundColor: task.status === 'Todo' ? '#95a5a6' : '#ecf0f1', color: task.status === 'Todo' ? '#fff' : '#7f8c8d'}}
          disabled={task.status === 'Todo'}
        >
          Todo
        </button>
        <button 
          onClick={() => onStatusChange(task._id, 'In Progress')}
          style={{...styles.statusBtn, backgroundColor: task.status === 'In Progress' ? '#3498db' : '#ecf0f1', color: task.status === 'In Progress' ? '#fff' : '#7f8c8d'}}
          disabled={task.status === 'In Progress'}
        >
          In Progress
        </button>
        <button 
          onClick={() => onStatusChange(task._id, 'Done')}
          style={{...styles.statusBtn, backgroundColor: task.status === 'Done' ? '#27ae60' : '#ecf0f1', color: task.status === 'Done' ? '#fff' : '#7f8c8d'}}
          disabled={task.status === 'Done'}
        >
          Done
        </button>
        <button onClick={() => onDelete(task._id)} style={styles.deleteBtn}>Delete</button>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem'
  },
  title: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '1.1rem'
  },
  priority: {
    color: '#fff',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  description: {
    color: '#7f8c8d',
    margin: '0.5rem 0',
    fontSize: '0.9rem'
  },
  info: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    margin: '0.75rem 0'
  },
  status: {
    color: '#fff',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 'bold'
  },
  date: {
    color: '#95a5a6',
    fontSize: '0.85rem'
  },
  assigned: {
    color: '#34495e',
    fontSize: '0.85rem',
    margin: '0.5rem 0'
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    marginTop: '1rem',
    flexWrap: 'wrap'
  },
  statusBtn: {
    border: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '500',
    flex: 1,
    minWidth: '70px'
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

export default TaskCard;
