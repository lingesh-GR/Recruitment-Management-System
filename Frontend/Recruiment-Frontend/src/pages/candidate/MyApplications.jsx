import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, Building2, MapPin, Banknote, Calendar } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function MyApplications() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [user.token]);

  const fetchApplications = async () => {
    try {
      // 1. Fetch all applications for this candidate
      const appResponse = await axios.get('http://localhost:8080/applications', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const apps = appResponse.data;

      // 2. Since the backend only gives us jobId, we need to fetch the full job details!
      // We use Promise.all to fetch all job details at the exact same time
      const appsWithJobs = await Promise.all(
        apps.map(async (app) => {
          try {
            const jobResponse = await axios.get(`http://localhost:8080/jobs/${app.jobId}`, {
              headers: { Authorization: `Bearer ${user.token}` }
            });
            return { ...app, jobDetails: jobResponse.data };
          } catch (jobErr) {
            // If the job was deleted by the recruiter, just show a fallback
            return { ...app, jobDetails: { title: 'Job Unavailable', location: 'Unknown', minSalary: 0, maxSalary: 0 } };
          }
        })
      );

      // Sort by newest application first
      appsWithJobs.sort((a, b) => b.id - a.id);
      
      setApplications(appsWithJobs);
    } catch (err) {
      setError('Failed to load your applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to color-code the application status
  const getStatusColor = (status) => {
    switch (status) {
      case 'APPLIED': return { bg: 'rgba(9, 132, 227, 0.2)', color: 'var(--primary-light)' };
      case 'UNDER_REVIEW': return { bg: 'rgba(253, 203, 110, 0.2)', color: '#fdcb6e' };
      case 'SHORTLISTED': return { bg: 'rgba(108, 92, 231, 0.2)', color: '#6c5ce7' };
      case 'HIRED': return { bg: 'rgba(0, 184, 148, 0.2)', color: 'var(--success)' };
      case 'REJECTED': return { bg: 'rgba(214, 48, 49, 0.2)', color: 'var(--error)' };
      default: return { bg: 'rgba(255,255,255,0.1)', color: 'white' };
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container" style={{ maxWidth: '900px' }}>
        
        <div className="dashboard-header">
          <h1>My <span className="highlight">Applications</span> <ClipboardList size={28} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '8px' }} /></h1>
          <p>Track the status of jobs you have applied to.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}><span className="spinner"></span></div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : applications.length === 0 ? (
          <div className="auth-card" style={{ textAlign: 'center', padding: '40px' }}>
            <h2>You haven't applied to any jobs yet</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Start browsing and find your next big opportunity!</p>
            <Link to="/candidate/jobs" className="btn btn-primary">Browse Jobs</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {applications.map((app) => {
              const statusStyle = getStatusColor(app.applicationStatus);
              
              return (
                <div 
                  key={app.id} 
                  className="auth-card" 
                  onClick={() => navigate(`/candidate/jobs/${app.jobId}`)}
                  style={{ 
                    maxWidth: '100%', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'box-shadow 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  
                  {/* Left Side: Job Info */}
                  <div>
                    <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>{app.jobDetails.title}</h2>
                    
                    <div style={{ fontSize: '14px', color: 'var(--primary-light)', fontWeight: '600', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building2 size={16} /> {app.jobDetails.recruiter?.companyName || app.jobDetails.companyName || 'Company'}
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', color: 'var(--text-muted)', fontSize: '13px', marginBottom: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {app.jobDetails.location}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Banknote size={14} /> ₹{app.jobDetails.minSalary} - ₹{app.jobDetails.maxSalary}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> Applied on: {new Date(app.createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>

                    {/* Company LinkedIn */}
                    {app.jobDetails.recruiter?.companyLinkedinUrl && (
                      <div>
                        <a href={app.jobDetails.recruiter.companyLinkedinUrl} onClick={(e) => e.stopPropagation()} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', background: '#0077b5', color: 'white', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', textDecoration: 'none', fontWeight: 'bold' }}>
                          in Company LinkedIn
                        </a>
                      </div>
                    )}
                  </div>
                  
                  {/* Right Side: Status Badge */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '15px' }}>
                    
                    <div style={{
                      background: statusStyle.bg,
                      color: statusStyle.color,
                      padding: '8px 16px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '700',
                      letterSpacing: '1px',
                      border: `1px solid ${statusStyle.color}`
                    }}>
                      {app.applicationStatus?.replace('_', ' ')}
                    </div>
                    
                    <Link to={`/candidate/jobs/${app.jobId}`} onClick={(e) => e.stopPropagation()} style={{ color: 'var(--text-secondary)', fontSize: '13px', textDecoration: 'underline' }}>
                      View Job Details
                    </Link>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyApplications;