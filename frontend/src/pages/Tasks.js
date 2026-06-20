import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function Tasks() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
  fetchTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('https://nayepankh-vms.onrender.com/api/tasks/my', { headers });
      setTasks(res.data);
    } catch (err) {
      setMessage('Failed to load tasks');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`https://nayepankh-vms.onrender.com/api/tasks/${id}`, { status }, { headers });
      fetchTasks();
    } catch (err) {
      setMessage('Failed to update task');
    }
  };

  const getStatusColor = (status) => {
    if (status === 'completed') return '#27ae60';
    if (status === 'inprogress') return '#f39c12';
    return '#e74c3c';
  };

  return (
    <div>
      <Navbar />
      <div className="container dashboard">
        <h2>My Tasks</h2>
        {message && <div className="error-msg">{message}</div>}
        {tasks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#777' }}>No tasks assigned yet.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task._id} className="card" style={{ marginBottom: '16px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', color: '#333' }}>{task.title}</h3>
                <span style={{
                  background: getStatusColor(task.status),
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '13px'
                }}>
                  {task.status}
                </span>
              </div>
              <p style={{ color: '#777', margin: '8px 0' }}>{task.description}</p>
              {task.dueDate && (
                <p style={{ fontSize: '13px', color: '#999' }}>
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <button className="btn" style={{ background: '#f39c12', color: 'white', fontSize: '13px' }}
                  onClick={() => updateStatus(task._id, 'inprogress')}>
                  Mark In Progress
                </button>
                <button className="btn" style={{ background: '#27ae60', color: 'white', fontSize: '13px' }}
                  onClick={() => updateStatus(task._id, 'completed')}>
                  Mark Completed
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Tasks;