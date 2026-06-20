import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function AdminPanel() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', assignedTo: '', dueDate: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchTasks();
    fetchVolunteers();
    fetchAttendance();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/tasks', { headers });
      setTasks(res.data);
    } catch (err) {
      console.log('Failed to load tasks');
    }
  };

  const fetchVolunteers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/volunteers', { headers });
      setVolunteers(res.data);
    } catch (err) {
      console.log('Failed to load volunteers');
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/attendance/all', { headers });
      setAttendance(res.data);
    } catch (err) {
      console.log('Failed to load attendance');
    }
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', form, { headers });
      setMessage('Task created successfully! ✅');
      setIsError(false);
      setForm({ title: '', description: '', assignedTo: '', dueDate: '' });
      fetchTasks();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create task');
      setIsError(true);
    }
  };

  const tabStyle = (tab) => ({
    padding: '10px 24px',
    border: 'none',
    borderBottom: activeTab === tab ? '3px solid #e85d04' : '3px solid transparent',
    background: 'none',
    color: activeTab === tab ? '#e85d04' : '#777',
    fontWeight: activeTab === tab ? '600' : '400',
    cursor: 'pointer',
    fontSize: '15px'
  });

  return (
    <div>
      <Navbar />
      <div className="container dashboard">
        <h2>Admin Panel</h2>

        {/* Stats Row */}
        <div className="cards-grid" style={{ marginBottom: '24px' }}>
          <div className="card">
            <h3>{volunteers.length}</h3>
            <p>Total Volunteers</p>
          </div>
          <div className="card">
            <h3>{tasks.length}</h3>
            <p>Total Tasks</p>
          </div>
          <div className="card">
            <h3>{tasks.filter(t => t.status === 'completed').length}</h3>
            <p>Completed Tasks</p>
          </div>
          <div className="card">
            <h3>{attendance.length}</h3>
            <p>Attendance Records</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderBottom: '1px solid #eee', marginBottom: '24px', display: 'flex', gap: '8px' }}>
          <button style={tabStyle('tasks')} onClick={() => setActiveTab('tasks')}>Tasks</button>
          <button style={tabStyle('volunteers')} onClick={() => setActiveTab('volunteers')}>Volunteers</button>
          <button style={tabStyle('attendance')} onClick={() => setActiveTab('attendance')}>Attendance</button>
        </div>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div>
            {/* Create Task Form */}
            <div className="card" style={{ marginBottom: '24px', textAlign: 'left' }}>
              <h3 style={{ marginBottom: '16px', color: '#e85d04' }}>Create New Task</h3>
              {message && (
                <div style={{
                  background: isError ? '#ffe0e0' : '#e0ffe0',
                  color: isError ? '#c0392b' : '#27ae60',
                  padding: '10px', borderRadius: '6px', marginBottom: '16px'
                }}>
                  {message}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Task Title</label>
                  <input name="title" value={form.title} placeholder="Enter task title" onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <input name="description" value={form.description} placeholder="Enter description" onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Assign To</label>
                  <select name="assignedTo" value={form.assignedTo} onChange={handleChange}>
                    <option value="">-- Select Volunteer --</option>
                    {volunteers.map(v => (
                      <option key={v._id} value={v._id}>{v.name} ({v.city})</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Due Date</label>
                  <input name="dueDate" type="date" value={form.dueDate} onChange={handleChange} />
                </div>
                <button className="btn-primary" type="submit">Create Task</button>
              </form>
            </div>

            {/* Tasks List */}
            <h3 style={{ marginBottom: '16px' }}>All Tasks ({tasks.length})</h3>
            {tasks.map(task => (
              <div key={task._id} className="card" style={{ marginBottom: '12px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ color: '#333' }}>{task.title}</h4>
                  <span style={{
                    background: task.status === 'completed' ? '#27ae60' : task.status === 'inprogress' ? '#f39c12' : '#e74c3c',
                    color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '12px'
                  }}>{task.status}</span>
                </div>
                <p style={{ color: '#777', fontSize: '14px', margin: '6px 0' }}>{task.description}</p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#999' }}>
                  <span>👤 {task.assignedTo?.name || 'Unassigned'}</span>
                  {task.dueDate && <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Volunteers Tab */}
        {activeTab === 'volunteers' && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>All Volunteers ({volunteers.length})</h3>
            {volunteers.map(v => (
              <div key={v._id} className="card" style={{ marginBottom: '12px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: '#333', marginBottom: '4px' }}>{v.name}</h4>
                    <p style={{ color: '#777', fontSize: '14px' }}>{v.email}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {v.city && <p style={{ fontSize: '13px', color: '#999' }}>📍 {v.city}</p>}
                    {v.phone && <p style={{ fontSize: '13px', color: '#999' }}>📞 {v.phone}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Attendance Tab */}
        {activeTab === 'attendance' && (
          <div>
            <h3 style={{ marginBottom: '16px' }}>All Attendance Records ({attendance.length})</h3>
            {attendance.map(record => (
              <div key={record._id} className="card" style={{ marginBottom: '12px', textAlign: 'left' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ color: '#333', marginBottom: '4px' }}>{record.volunteer?.name}</h4>
                    <p style={{ color: '#777', fontSize: '13px' }}>{record.volunteer?.email}</p>
                    {record.note && <p style={{ color: '#999', fontSize: '13px', marginTop: '4px' }}>📝 {record.note}</p>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{
                      background: '#e85d04', color: 'white',
                      padding: '4px 14px', borderRadius: '20px', fontSize: '14px', display: 'block', marginBottom: '6px'
                    }}>
                      {record.hoursLogged} hrs
                    </span>
                    <p style={{ fontSize: '12px', color: '#999' }}>
                      {new Date(record.date).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;