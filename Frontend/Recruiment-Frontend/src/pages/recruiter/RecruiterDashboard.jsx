import { useAuth } from '../../context/AuthContext'
import { Briefcase, ClipboardList, Building2, PlusCircle, Megaphone, Inbox, Star, Handshake } from 'lucide-react'
import { useState, useEffect } from 'react'
import axios from 'axios'

function RecruiterDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    activeJobs: 0,
    totalApplications: 0,
    shortlisted: 0,
    hired: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        
        // Fetch jobs and applications concurrently using Promise.allSettled to handle potential 404s cleanly
        const [jobsRes, appsRes] = await Promise.allSettled([
          axios.get('http://localhost:8080/jobs', config),
          axios.get('http://localhost:8080/applications', config)
        ]);
        
        let activeJobs = 0;
        let totalApps = 0;
        let shortlisted = 0;
        let hired = 0;

        if (jobsRes.status === 'fulfilled' && jobsRes.value.data) {
          activeJobs = jobsRes.value.data.filter(job => job.jobStatus === 'OPEN').length;
        }

        if (appsRes.status === 'fulfilled' && appsRes.value.data) {
          const apps = appsRes.value.data;
          totalApps = apps.length;
          shortlisted = apps.filter(app => app.applicationStatus === 'SHORTLISTED').length;
          hired = apps.filter(app => app.applicationStatus === 'HIRED').length;
        }

        setStats({
          activeJobs,
          totalApplications: totalApps,
          shortlisted,
          hired
        });

      } catch (error) {
        console.error("Failed to fetch recruiter stats", error);
      }
    };
    fetchDashboardData();
  }, [user.token]);

  return (
    <div className="dashboard-page">

      {/* Dashboard Content */}
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, <span className="highlight">{user?.name}</span> <Briefcase size={32} style={{ display: 'inline', verticalAlign: 'middle' }} /></h1>
          <p>Manage your job postings and review candidates.</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><Megaphone size={28} /></div>
            <div className="stat-info">
              <h3>{stats.activeJobs}</h3>
              <p>Active Jobs</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><Inbox size={28} /></div>
            <div className="stat-info">
              <h3>{stats.totalApplications}</h3>
              <p>Total Applications</p>
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
            <div className="stat-icon"><Handshake size={28} /></div>
            <div className="stat-info">
              <h3>{stats.hired}</h3>
              <p>Candidates Hired</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Recruitment Actions</h2>
          <div className="actions-grid">
            <a href="/recruiter/jobs/create" className="action-card">
              <span className="action-icon"><PlusCircle size={32} /></span>
              <h3>Post New Job</h3>
              <p>Create a new job listing</p>
            </a>
            <a href="/recruiter/jobs" className="action-card">
              <span className="action-icon"><ClipboardList size={32} /></span>
              <h3>Manage Jobs</h3>
              <p>View applications and edit jobs</p>
            </a>
            <a href="/recruiter/profile" className="action-card">
              <span className="action-icon"><Building2 size={32} /></span>
              <h3>Company Profile</h3>
              <p>Update your recruiter details</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecruiterDashboard