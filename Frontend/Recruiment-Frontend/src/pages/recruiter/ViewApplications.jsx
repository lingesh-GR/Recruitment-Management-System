import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function ViewApplications() {
  const { user } = useAuth();
  const { id } = useParams(); // This is the Job ID
  
  const [applications, setApplications] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, [user.token, id]);

  const fetchData = async () => {
    try {
      // 1. Fetch the Job Details so we know what job we are looking at
      const jobRes = await axios.get(`http://localhost:8080/jobs/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setJobDetails(jobRes.data);

      // 2. Fetch all applications for this specific job
      const appRes = await axios.get(`http://localhost:8080/applications/job/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const apps = appRes.data;

      // 3. For each application, fetch the Candidate's profile details
      const appsWithCandidates = await Promise.all(
        apps.map(async (app) => {
          try {
            const candRes = await axios.get(`http://localhost:8080/candidate/user/${app.candidateId}`, {
              headers: { Authorization: `Bearer ${user.token}` }
            });
            return { ...app, candidateDetails: candRes.data };
          } catch (candErr) {
            return { ...app, candidateDetails: { name: 'Unknown', skills: 'N/A', experience: 'N/A' } };
          }
        })
      );

      setApplications(appsWithCandidates);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setApplications([]); // No applications yet
      } else {
        setError('Failed to load applications.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await axios.put(`http://localhost:8080/applications/${applicationId}/status`, 
        { applicationStatus: newStatus },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      
      // Instantly update the UI without refreshing the page!
      setApplications(apps => apps.map(app => 
        app.id === applicationId ? { ...app, applicationStatus: newStatus } : app
      ));
      
    } catch (err) {
      alert('Failed to update status. Remember the backend rules: You must follow the flow (APPLIED -> UNDER_REVIEW -> SHORTLISTED -> HIRED/REJECTED)');
    }
  };

  // Filter the applications!
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.candidateDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          app.candidateDetails.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || app.applicationStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="dashboard-page">
      <div className="dashboard-container" style={{ maxWidth: '1000px' }}>
        
        <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Review</h1>
            <h1 className="highlight" style={{ fontSize: '32px', marginBottom: '16px' }}>Applications 👥</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '16px' }}>Candidates for: <strong>{jobDetails?.title || 'Loading...'}</strong></p>
          </div>
          <Link to="/recruiter/jobs" className="btn" style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: 'var(--text-primary)', padding: '12px 24px', borderRadius: '30px', fontWeight: 'bold', width: 'auto', textDecoration: 'none' }}>
            ← Back to Jobs
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap' }}>
          <input 
            type="text" 
            placeholder="🔍 Search candidates by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              flex: 1, minWidth: '250px', padding: '12px 20px', 
              background: 'var(--bg-input)', border: '1px solid var(--border)', 
              borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', outline: 'none' 
            }}
          />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ 
              padding: '12px 20px', background: 'var(--bg-input)', 
              border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', 
              color: 'var(--text-primary)', outline: 'none', cursor: 'pointer', minWidth: '180px' 
            }}
          >
            <option value="">All Statuses</option>
            <option value="APPLIED">Applied</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="HIRED">Hired</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}><span className="spinner"></span></div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : applications.length === 0 ? (
          <div className="auth-card" style={{ textAlign: 'center', padding: '40px' }}>
            <h2>No Applications Yet</h2>
            <p style={{ color: 'var(--text-muted)' }}>Nobody has applied to this job posting yet.</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="auth-card" style={{ textAlign: 'center', padding: '40px' }}>
             <h2>No candidates match your filter</h2>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {filteredApplications.map((app) => (
              <div key={app.id} className="auth-card" style={{ maxWidth: '100%', display: 'flex', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
                
                {/* Candidate Info */}
                <div style={{ flex: 1, minWidth: '300px' }}>
                  <Link to={`/recruiter/candidate/${app.candidateId}`} style={{ textDecoration: 'none' }}>
                    <h2 style={{ fontSize: '22px', marginBottom: '8px', color: 'var(--primary-light)', transition: 'color 0.2s' }} 
                        onMouseEnter={(e) => e.target.style.color = 'var(--text-primary)'}
                        onMouseLeave={(e) => e.target.style.color = 'var(--primary-light)'}>
                      {app.candidateDetails.name} <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>(View Full Profile ↗)</span>
                    </h2>
                  </Link>
                  <div style={{ display: 'flex', gap: '20px', color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    <span>📧 {app.candidateDetails.email}</span>
                    <span>📞 {app.candidateDetails.phone || 'No Phone'}</span>
                    <span>⭐ {app.candidateDetails.experienceYears ? `${app.candidateDetails.experienceYears} Years` : 'Fresher'}</span>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Skills:</strong>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                      {(app.candidateDetails.skills || 'Not specified').split(',').map((skill, i) => (
                        <span key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '4px', fontSize: '13px' }}>
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {app.candidateDetails.resumeUrl && (
                    <div style={{ marginTop: '15px' }}>
                      <a href={app.candidateDetails.resumeUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary-light)', textDecoration: 'underline', fontSize: '14px' }}>
                        📄 View Resume / Portfolio
                      </a>
                    </div>
                  )}
                </div>

                {/* Status Update Actions */}
                <div style={{ minWidth: '220px', display: 'flex', flexDirection: 'column', gap: '15px', borderLeft: '1px solid var(--border)', paddingLeft: '20px' }}>
                  
                  <div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '5px' }}>Current Status:</div>
                    <div style={{ 
                      background: 'rgba(108, 92, 231, 0.1)', color: '#6c5ce7', 
                      padding: '10px', borderRadius: 'var(--radius-sm)', textAlign: 'center', fontWeight: 'bold', fontSize: '14px', border: '1px solid #6c5ce7' 
                    }}>
                      {app.applicationStatus}
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '-5px' }}>Update Status:</div>
                  <select 
                    value={app.applicationStatus}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    style={{ 
                      padding: '12px 15px', background: 'var(--bg-input)', 
                      border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', 
                      color: 'var(--text-primary)', outline: 'none', cursor: 'pointer',
                      fontSize: '14px', width: '100%'
                    }}
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="HIRED">Hired</option>
                    <option value="REJECTED">Rejected</option>
                  </select>

                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewApplications;