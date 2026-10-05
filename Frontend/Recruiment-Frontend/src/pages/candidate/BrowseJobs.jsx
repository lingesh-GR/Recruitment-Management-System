import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, MapPin, Briefcase, Building2, Star, Banknote, Heart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function BrowseJobs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  useEffect(() => {
    fetchJobs();
  }, [user.token]);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('http://localhost:8080/jobs', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      const openJobs = response.data.filter(job => job.jobStatus === 'OPEN');
      setJobs(openJobs);
    } catch (err) {
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Use useMemo to filter jobs for better performance!
  const filteredJobs = useMemo(() => {
    let result = jobs;

    // Filter by search term (title or skills)
    if (searchTerm) {
      result = result.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.skillRequired || job.skillsRequired || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.recruiter?.companyName || job.companyName || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by location
    if (locationFilter) {
      result = result.filter(job =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Filter by employment type
    if (typeFilter) {
      result = result.filter(job => job.employmentType === typeFilter);
    }

    return result;
  }, [searchTerm, locationFilter, typeFilter, jobs]);

  // Get unique locations for the filter dropdown
  const uniqueLocations = useMemo(() => {
      return [...new Set(jobs.map(job => job.location))];
  }, [jobs]);


  // Helper for Indian Currency
  const formatCurrency = (amount) => {
    if (!amount) return 'Not Disclosed';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="dashboard-page" style={{ background: 'var(--bg-body, #f8f9fa)', minHeight: '100vh', paddingTop: '30px' }}>
      <div className="dashboard-container" style={{ maxWidth: '1200px', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '24px', alignItems: 'start' }}>
        
        {/* Left Sidebar (Filters) */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '20px', color: 'var(--text-primary)' }}>All Filters</h2>
          
          <div style={{ marginBottom: '20px' }}>
             <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: 'var(--text-secondary)' }}>Search</h3>
             <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Search size={16} /></span>
                <input
                  type="text"
                  placeholder="Title, skills, company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '10px 10px 10px 32px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', outline: 'none', color: 'var(--text-primary)' }}
                />
             </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: 'var(--text-secondary)' }}>Location</h3>
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', color: 'var(--text-primary)' }}
            >
              <option value="">All Locations</option>
              {uniqueLocations.map((loc, i) => <option key={i} value={loc}>{loc}</option>)}
            </select>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '10px', color: 'var(--text-secondary)' }}>Employment Type</h3>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ width: '100%', padding: '10px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '13px', color: 'var(--text-primary)' }}
            >
              <option value="">All Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="CONTRACT">Contract</option>
            </select>
          </div>

          {(searchTerm || locationFilter || typeFilter) && (
            <button onClick={() => { setSearchTerm(''); setLocationFilter(''); setTypeFilter(''); }} style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid var(--primary)', color: 'var(--primary)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
              Clear All Filters
            </button>
          )}
        </div>

        {/* Right Column (Job List) */}
        <div>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)' }}>
              {filteredJobs.length} {filteredJobs.length === 1 ? 'Job' : 'Jobs'} Found
            </h1>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '50px' }}><span className="spinner"></span></div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : filteredJobs.length === 0 ? (
            <div className="auth-card" style={{ textAlign: 'center', padding: '60px 40px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>No jobs found</h2>
              <p style={{ color: 'var(--text-muted)' }}>Try adjusting your search or filters to find more opportunities.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredJobs.map((job) => (
                <div key={job.id} onClick={() => navigate(`/candidate/jobs/${job.id}`)} style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '20px',
                  position: 'relative',
                  cursor: 'pointer',
                  transition: 'box-shadow 0.2s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '4px', color: 'var(--text-primary)' }}>{job.title}</h2>
                      <div style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '500', marginBottom: '12px' }}>
                        {job.recruiter?.companyName || job.companyName || 'Company'}
                        <span style={{ color: '#f59e0b', fontSize: '12px', marginLeft: '10px' }}>★ 4.2</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '12px', marginLeft: '4px' }}>(1.2K Reviews)</span>
                      </div>
                    </div>
                    {/* Logo Top Right */}
                    {job.recruiter?.logoUrl ? (
                       <img src={job.recruiter.logoUrl} alt="Logo" style={{ width: '48px', height: '48px', objectFit: 'contain', border: '1px solid var(--border)', borderRadius: '8px', padding: '4px', background: 'white' }} />
                    ) : (
                       <div style={{ width: '48px', height: '48px', border: '1px solid var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}><Building2 size={24}/></div>
                    )}
                  </div>

                  {/* Meta Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase size={14} color="var(--text-muted)"/> {job.experienceRequired} Yrs</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Banknote size={14} color="var(--text-muted)"/> {formatCurrency(job.minSalary)} - {formatCurrency(job.maxSalary)}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="var(--text-muted)"/> {job.location}</span>
                  </div>

                  {/* Description Snippet */}
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>Job Description: </span>
                    {job.description}
                  </div>

                  {/* Skills Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                    {(job.skillRequired || job.skillsRequired || '').split(',').slice(0, 5).map((skill, i) => (
                      <span key={i} style={{ padding: '4px 8px', borderRadius: '4px', fontSize: '12px', color: 'var(--text-secondary)', background: 'var(--bg-input)' }}>
                        {skill.trim()}
                      </span>
                    ))}
                    {(job.skillRequired || job.skillsRequired || '').split(',').length > 5 && <span style={{ padding: '4px 8px', fontSize: '12px', color: 'var(--text-muted)' }}>+ more</span>}
                  </div>

                  <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>Posted recently</span>
                    {job.applicationDeadline && (
                      <span style={{ color: new Date() > new Date(job.applicationDeadline) ? '#c5221f' : '#757575', background: new Date() > new Date(job.applicationDeadline) ? '#fce8e6' : 'transparent', padding: '2px 6px', borderRadius: '4px' }}>
                        Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}
                      </span>
                    )}
                    <button onClick={(e) => { e.stopPropagation(); e.currentTarget.style.color = e.currentTarget.style.color === 'var(--error)' ? 'var(--text-muted)' : 'var(--error)'; }} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)' }}>
                      <Heart size={16} /> Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BrowseJobs;