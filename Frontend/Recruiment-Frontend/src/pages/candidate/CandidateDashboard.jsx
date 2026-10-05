import { useAuth } from '../../context/AuthContext'
import { Search, User, ClipboardList, FileText, Eye, Star, CheckCircle, Hand } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from 'axios'

function CandidateDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    sent: 0,
    underReview: 0,
    shortlisted: 0,
    hired: 0
  });

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://localhost:8080/applications', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const apps = response.data;
        setStats({
          sent: apps.length,
          underReview: apps.filter(app => app.applicationStatus === 'UNDER_REVIEW').length,
          shortlisted: apps.filter(app => app.applicationStatus === 'SHORTLISTED').length,
          hired: apps.filter(app => app.applicationStatus === 'HIRED').length
        });
      } catch (error) {
        console.error("Failed to fetch application stats", error);
      }
    };
    fetchApplications();
  }, [user.token]);

  return (
    <div className="dashboard-page">

      {/* Dashboard Content */}
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome back, <span className="highlight">{user?.name}</span> <Hand size={32} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '8px' }} /></h1>
          <p>Here's an overview of your job search progress</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><FileText size={28} /></div>
            <div className="stat-info">
              <h3>{stats.sent}</h3>
              <p>Applications Sent</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Eye size={28} /></div>
            <div className="stat-info">
              <h3>{stats.underReview}</h3>
              <p>Under Review</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Star size={28} /></div>
            <div className="stat-info">
              <h3>{stats.shortlisted}</h3>
              <p>Shortlisted</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><CheckCircle size={28} /></div>
            <div className="stat-info">
              <h3>{stats.hired}</h3>
              <p>Hired</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <a href="/candidate/jobs" className="action-card">
              <span className="action-icon"><Search size={32} /></span>
              <h3>Browse Jobs</h3>
              <p>Find your dream job</p>
            </a>
            <a href="/candidate/profile" className="action-card">
              <span className="action-icon"><User size={32} /></span>
              <h3>Complete Profile</h3>
              <p>Stand out to recruiters</p>
            </a>
            <a href="/candidate/applications" className="action-card">
              <span className="action-icon"><ClipboardList size={32} /></span>
              <h3>My Applications</h3>
              <p>Track your progress</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CandidateDashboard