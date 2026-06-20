import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <h1>🌱 Nayepankh Foundation</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
          {user?.role === 'admin' ? (
            <Link to="/admin" style={{ color: 'white', textDecoration: 'none' }}>Admin Panel</Link>
          ) : (
            <>
              <Link to="/tasks" style={{ color: 'white', textDecoration: 'none' }}>My Tasks</Link>
              <Link to="/attendance" style={{ color: 'white', textDecoration: 'none' }}>Attendance</Link>
            </>
          )}
          <span style={{ color: 'white' }}>{user?.name}</span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;