import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user || location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname.includes('/reset-password')) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const goBack = () => {
    navigate(-1);
  };

  const isDashboard = location.pathname === '/candidate/dashboard' || location.pathname === '/recruiter/dashboard';

  // Smart Links based on Role!
  const candidateLinks = [
    { name: 'Dashboard', path: '/candidate/dashboard' },
    { name: 'Browse Jobs', path: '/candidate/jobs' },
    { name: 'My Applications', path: '/candidate/applications' },
    { name: 'Profile', path: '/candidate/profile' }
  ];

  const recruiterLinks = [
    { name: 'Dashboard', path: '/recruiter/dashboard' },
    { name: 'My Jobs', path: '/recruiter/jobs' },
    { name: 'Post Job', path: '/recruiter/jobs/create' },
    { name: 'Profile', path: '/recruiter/profile' }
  ];

  const links = user.role === 'CANDIDATE' ? candidateLinks : recruiterLinks;

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 90px 15px 30px', /* Increased right padding to 90px for theme toggle */
      background: '#ffffff', /* White background matching dashboard */
      borderBottom: '1px solid #eaeaea',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <h2 onClick={() => navigate(`/${user.role.toLowerCase()}/dashboard`)} style={{ margin: 0, fontSize: '22px', color: '#2563eb', cursor: 'pointer' }}>
          Job<span style={{ color: '#1a1a1a' }}>Portal</span>
        </h2>

        {/* Central Navigation Links */}
        <div style={{ display: 'flex', gap: '35px', paddingLeft: '20px' }}>
          {links.map((link) => (
             <Link 
               key={link.name} 
               to={link.path}
               style={{
                 color: location.pathname === link.path ? '#2563eb' : '#4a4a4a',
                 textDecoration: 'none',
                 fontSize: '15px',
                 fontWeight: location.pathname === link.path ? '600' : '500',
                 transition: 'all 0.3s ease',
                 padding: '8px 0',
                 borderBottom: location.pathname === link.path ? '2px solid #2563eb' : '2px solid transparent',
               }}
               onMouseEnter={(e) => {
                 if(location.pathname !== link.path) {
                   e.target.style.color = '#1a1a1a';
                 }
               }}
               onMouseLeave={(e) => {
                 if(location.pathname !== link.path) {
                   e.target.style.color = '#4a4a4a';
                 }
               }}
             >
               {link.name}
             </Link>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {!isDashboard && (
          <button onClick={goBack} style={{ 
            background: '#f3f4f6', border: '1px solid #eaeaea', color: '#1a1a1a', 
            cursor: 'pointer', fontSize: '13px', padding: '6px 12px', borderRadius: 'var(--radius-sm)', transition: 'background 0.2s'
          }}>
            ← Back
          </button>
        )}
        <span style={{ color: '#757575', fontSize: '15px' }}>
          Hello, <strong style={{ color: '#1a1a1a' }}>{user.name}</strong>
        </span>
        <button onClick={handleLogout} style={{ 
          background: 'transparent', color: 'var(--error)', border: '1px solid var(--error)', 
          padding: '6px 14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: '600', fontSize: '13px', transition: 'all 0.2s'
        }}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;