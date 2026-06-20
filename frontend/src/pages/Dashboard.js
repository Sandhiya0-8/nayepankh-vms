import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Navbar from '../components/Navbar';

function Dashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ totalDays: 0, totalHours: 0 });
  const [taskCount, setTaskCount] = useState(0);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('https://nayepankh-vms.onrender.com/api/attendance/stats', { headers });
        setStats(res.data);
        const taskRes = await axios.get('https://nayepankh-vms.onrender.com/api/tasks/my', { headers });
        setTaskCount(taskRes.data.length);
      } catch (err) {
        console.log('Failed to load stats');
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="container dashboard">
        <h2>Welcome, {user?.name}! 👋</h2>
        <p style={{ color: '#777', marginBottom: '24px' }}>
          You are logged in as <strong>{user?.role}</strong>
        </p>
        <div className="cards-grid">
          <div className="card">
            <h3>{taskCount}</h3>
            <p>Tasks Assigned</p>
          </div>
          <div className="card">
            <h3>{stats.totalHours}</h3>
            <p>Hours Logged</p>
          </div>
          <div className="card">
            <h3>{stats.totalDays}</h3>
            <p>Days Present</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;