import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

function Attendance() {
  const { token } = useAuth();
  const [records, setRecords] = useState([]);
  const [stats, setStats] = useState({ totalDays: 0, totalHours: 0 });
  const [form, setForm] = useState({ hoursLogged: '', note: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchAttendance();
    fetchStats();
  }, []);

  const fetchAttendance = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/attendance/my', { headers });
      setRecords(res.data);
    } catch (err) {
      console.log('Failed to load attendance');
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/attendance/stats', { headers });
      setStats(res.data);
    } catch (err) {
      console.log('Failed to load stats');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/attendance/mark', form, { headers });
      setMessage('Attendance marked successfully for today! ✅');
      setIsError(false);
      setForm({ hoursLogged: '', note: '' });
      fetchAttendance();
      fetchStats();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to mark attendance');
      setIsError(true);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container dashboard">
        <h2>Attendance</h2>

        {/* Stats */}
        <div className="cards-grid" style={{ marginBottom: '24px' }}>
          <div className="card">
            <h3>{stats.totalDays}</h3>
            <p>Days Present</p>
          </div>
          <div className="card">
            <h3>{stats.totalHours}</h3>
            <p>Total Hours</p>
          </div>
        </div>

        {/* Mark Attendance */}
        <div className="card" style={{ marginBottom: '24px', textAlign: 'left' }}>
          <h3 style={{ marginBottom: '16px', color: '#e85d04' }}>Mark Today's Attendance</h3>
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
              <label>Hours Logged Today</label>
              <input
                name="hoursLogged"
                type="number"
                min="1"
                max="12"
                value={form.hoursLogged}
                placeholder="Enter hours (e.g. 4)"
                onChange={(e) => setForm({ ...form, hoursLogged: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Note (optional)</label>
              <input
                name="note"
                value={form.note}
                placeholder="What did you do today?"
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>
            <button className="btn-primary" type="submit">Mark Attendance</button>
          </form>
        </div>

        {/* Attendance History */}
        <h3 style={{ marginBottom: '16px' }}>My Attendance History</h3>
        {records.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
            <p style={{ color: '#777' }}>No attendance records yet.</p>
          </div>
        ) : (
          records.map(record => (
            <div key={record._id} className="card" style={{ marginBottom: '12px', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontWeight: '500', color: '#333' }}>
                    {new Date(record.date).toLocaleDateString('en-IN', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </p>
                  {record.note && <p style={{ color: '#777', fontSize: '14px', marginTop: '4px' }}>{record.note}</p>}
                </div>
                <span style={{
                  background: '#e85d04', color: 'white',
                  padding: '4px 14px', borderRadius: '20px', fontSize: '14px'
                }}>
                  {record.hoursLogged} hrs
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Attendance;