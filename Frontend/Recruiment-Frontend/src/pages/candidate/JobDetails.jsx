import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Building2, MapPin, Briefcase, Banknote, Star, Heart } from 'lucide-react';

function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applying, setApplying] = useState(false);
  const [applyMessage, setApplyMessage] = useState('');

  // 1. Fetch the full job details when the page loads
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/jobs/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setJob(response.data);
      } catch (err) {
        setError('Failed to load job details. The job may have been removed.');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, user.token]);

  // 2. Handle Applying for the Job
  const handleApply = async () => {
    setApplying(true);
    setApplyMessage('');
    try {
      // Backend expects a POST request to /applications with { jobId: id } in the body
      await axios.post(`http://localhost:8080/applications`, { jobId: id }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setApplyMessage('✅ Successfully applied for this job!');
    } catch (err) {
      setApplyMessage('❌ Failed to apply. You may have already applied for this job.');
    } finally {
      setApplying(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      try {
        await axios.delete(`http://localhost:8080/jobs/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        navigate('/recruiter/jobs');
      } catch (err) {
        alert('Failed to delete job.');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><span className="spinner"></span></div>;
  if (error) return <div className="dashboard-page"><div className="error-message">{error}</div></div>;
  if (!job) return null;

  // Helper for Indian Currency
  const formatCurrency = (amount) => {
    if (!amount) return 'Not Disclosed';
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  };

  const isPastDeadline = job?.applicationDeadline && new Date() > new Date(job.applicationDeadline);

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: '30px 20px', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Top Navigation */}
        <div style={{ marginBottom: '16px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: '500' }}>
            ← Back to Job Search
          </button>
        </div>

        {/* Top Header Card */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px 32px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>{job.title}</h1>
            <div style={{ fontSize: '15px', color: '#4a4a4a', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {job.recruiter?.companyName || job.companyName || 'Company Name Not Provided'}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontSize: '13px', background: '#fef3c7', padding: '2px 6px', borderRadius: '4px' }}>
                <Star size={12} fill="currentColor" /> 4.2
              </span>
              <span style={{ color: '#0077b5', fontSize: '13px', cursor: 'pointer' }}>1.2K Reviews</span>
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', color: '#5f6368', fontSize: '14px', marginBottom: '20px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Briefcase size={16} color="#757575"/> {job.experienceRequired} years</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Banknote size={16} color="#757575"/> {formatCurrency(job.minSalary)} - {formatCurrency(job.maxSalary)}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} color="#757575"/> {job.location}</span>
            </div>

            <div style={{ borderTop: '1px solid #eaeaea', paddingTop: '16px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '20px', fontSize: '13px', color: '#757575' }}>
              <span>Posted: <strong>Recently</strong></span>
              <span>Openings: <strong>1</strong></span>
              <span>Applicants: <strong>100+</strong></span>
              {job.applicationDeadline && (
                <span style={{ color: isPastDeadline ? '#c5221f' : '#757575', background: isPastDeadline ? '#fce8e6' : 'transparent', padding: isPastDeadline ? '4px 8px' : '0', borderRadius: '4px' }}>
                  Deadline: <strong>{new Date(job.applicationDeadline).toLocaleString()}</strong>
                </span>
              )}
            </div>
          </div>
          
          {/* Top Right Action & Logo */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '20px' }}>
            {job.recruiter?.logoUrl ? (
              <img src={job.recruiter.logoUrl} alt="Company Logo" style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'contain', border: '1px solid #eaeaea', padding: '4px' }} />
            ) : (
              <div style={{ width: '60px', height: '60px', borderRadius: '8px', background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', border: '1px solid #eaeaea' }}>
                <Building2 size={28} />
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '12px' }}>
              {user?.role === 'RECRUITER' ? (
                <>
                  <button onClick={() => navigate(`/recruiter/jobs/edit/${job.id}`)} style={{ padding: '10px 32px', borderRadius: '20px', border: 'none', color: 'white', background: '#2563eb', fontWeight: '600', cursor: 'pointer' }}>
                    Edit Job
                  </button>
                  <button onClick={handleDelete} style={{ padding: '10px 32px', borderRadius: '20px', border: '1px solid #ef4444', color: '#ef4444', background: 'white', fontWeight: '600', cursor: 'pointer' }}>
                    Delete Job
                  </button>
                </>
              ) : isPastDeadline ? (
                <div style={{ padding: '10px 20px', borderRadius: '8px', background: '#fce8e6', color: '#c5221f', fontWeight: '600', fontSize: '14px', border: '1px solid #fad2cf' }}>
                  Registration cannot open due to time limit
                </div>
              ) : (
                <>
                  <button style={{ padding: '10px 20px', borderRadius: '20px', border: '1px solid #0077b5', color: '#0077b5', background: 'white', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                    <Heart size={16} /> Save
                  </button>
                  {applyMessage ? (
                    <div style={{ padding: '10px 20px', borderRadius: '20px', background: applyMessage.includes('✅') ? '#e6f4ea' : '#fce8e6', color: applyMessage.includes('✅') ? '#137333' : '#c5221f', fontWeight: '600' }}>
                      {applyMessage}
                    </div>
                  ) : (
                    <button onClick={handleApply} disabled={applying} style={{ padding: '10px 32px', borderRadius: '20px', border: 'none', color: 'white', background: '#2563eb', fontWeight: '600', cursor: 'pointer' }}>
                      {applying ? 'Applying...' : 'Apply'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* 2-Column Grid for Main Content & Sidebar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '20px', alignItems: 'start' }}>
          
          {/* Left Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Job Description Card */}
            <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #eaeaea' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '20px' }}>Job description</h2>
              <div style={{ color: '#4a4a4a', lineHeight: '1.7', fontSize: '15px', whiteSpace: 'pre-wrap', marginBottom: '32px' }}>
                {job.description}
              </div>

              {/* Info Table */}
              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px', fontSize: '14px', marginBottom: '32px' }}>
                <div style={{ color: '#757575', fontWeight: '500' }}>Role:</div>
                <div style={{ color: '#1a1a1a' }}>{job.title}</div>
                
                <div style={{ color: '#757575', fontWeight: '500' }}>Industry Type:</div>
                <div style={{ color: '#1a1a1a' }}>{job.recruiter?.industry || 'IT Services & Consulting'}</div>
                
                <div style={{ color: '#757575', fontWeight: '500' }}>Employment Type:</div>
                <div style={{ color: '#1a1a1a' }}>{job.employmentType?.replace('_', ' ') || 'Full Time'}</div>
                
                <div style={{ color: '#757575', fontWeight: '500' }}>Experience:</div>
                <div style={{ color: '#1a1a1a' }}>{job.experienceRequired}</div>
              </div>

              {/* Key Skills */}
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>Key Skills</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {(job.skillRequired || job.skillsRequired || '').split(',').map((skill, i) => (
                  <span key={i} style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #d1d5db', color: '#4b5563', fontSize: '13px', background: 'white' }}>
                    {skill.trim()}
                  </span>
                ))}
              </div>
            </div>

            {/* About Company Card */}
            {(job.recruiter?.aboutCompany || job.recruiter?.companyName) && (
              <div style={{ background: 'white', borderRadius: '12px', padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #eaeaea' }}>
                <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>About company</h2>
                <div style={{ color: '#4a4a4a', lineHeight: '1.7', fontSize: '15px', whiteSpace: 'pre-wrap', marginBottom: '20px' }}>
                  {job.recruiter?.aboutCompany || 'Company description not provided.'}
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '12px', fontSize: '14px', marginBottom: '24px' }}>
                   {job.recruiter?.companySize && (
                     <>
                        <div style={{ color: '#757575', fontWeight: '500' }}>Company Size:</div>
                        <div style={{ color: '#1a1a1a' }}>{job.recruiter.companySize}</div>
                     </>
                   )}
                   {job.recruiter?.location && (
                     <>
                        <div style={{ color: '#757575', fontWeight: '500' }}>Headquarters:</div>
                        <div style={{ color: '#1a1a1a' }}>{job.recruiter.location}</div>
                     </>
                   )}
                </div>

                <div style={{ display: 'flex', gap: '16px' }}>
                   {job.recruiter?.websiteUrl && (
                      <a href={job.recruiter.websiteUrl} target="_blank" rel="noreferrer" style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #d1d5db', color: '#4b5563', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>
                        Company Website
                      </a>
                   )}
                   {job.recruiter?.companyLinkedinUrl && (
                      <a href={job.recruiter.companyLinkedinUrl} target="_blank" rel="noreferrer" style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #0077b5', color: '#0077b5', fontSize: '14px', textDecoration: 'none', fontWeight: '500' }}>
                        View on LinkedIn
                      </a>
                   )}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
             
             {/* Salary Insights */}
             <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #eaeaea' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>Salary insights</h3>
                <p style={{ fontSize: '13px', color: '#4a4a4a', lineHeight: '1.5', marginBottom: '16px' }}>
                  Candidates in this role at {job.recruiter?.companyName || job.companyName} typically earn between:
                </p>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#1a1a1a', marginBottom: '16px' }}>
                  {formatCurrency(job.minSalary)} - {formatCurrency(job.maxSalary)} <span style={{ fontSize: '14px', fontWeight: '400', color: '#757575' }}>/yr</span>
                </div>
                <a href="#" style={{ fontSize: '14px', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>See detailed salary breakup ↗</a>
             </div>

             {/* Reviews Mockup */}
             <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #eaeaea' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                   <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a' }}>Reviews</h3>
                   <a href="#" style={{ fontSize: '14px', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>View all</a>
                </div>
                <div style={{ fontSize: '13px', color: '#757575', marginBottom: '16px' }}>1.2K employee reviews</div>
                
                <div style={{ background: '#f8f9fa', padding: '16px', borderRadius: '8px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                     <Star size={16} fill="#f59e0b" color="#f59e0b"/>
                     <span style={{ fontWeight: '700', color: '#1a1a1a' }}>4.0</span>
                   </div>
                   <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>Likes</div>
                   <p style={{ fontSize: '13px', color: '#4a4a4a', lineHeight: '1.5', marginBottom: '12px' }}>Good work life balance, flexible timings. Management is relatively open in sharing...</p>
                   
                   <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a1a', marginBottom: '4px' }}>Dislikes</div>
                   <p style={{ fontSize: '13px', color: '#4a4a4a', lineHeight: '1.5', marginBottom: '16px' }}>Hikes are relatively not that much even if projects are doing well...</p>
                   
                   <a href="#" style={{ fontSize: '13px', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>Read full review</a>
                </div>
             </div>

             {/* Benefits Mockup */}
             <div style={{ background: 'white', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #eaeaea' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px' }}>Benefits & Perks</h3>
                <div style={{ fontSize: '13px', color: '#757575', marginBottom: '20px' }}>1.1K employees reported these</div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
                     <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Heart size={20} color="#4b5563" />
                     </div>
                     <span style={{ fontSize: '12px', color: '#4b5563', fontWeight: '500' }}>Health<br/>Insurance</span>
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '8px' }}>
                     <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Banknote size={20} color="#4b5563" />
                     </div>
                     <span style={{ fontSize: '12px', color: '#4b5563', fontWeight: '500' }}>Performance<br/>Bonus</span>
                   </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default JobDetails;