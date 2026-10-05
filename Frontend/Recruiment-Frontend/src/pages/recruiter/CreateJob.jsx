import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function CreateJob() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    employmentType: '',
    experienceRequired: '',
    minSalary: '',
    maxSalary: '',
    skillRequired: '',
    eligibilityCriteria: '',
    aboutCompany: '',
    companyLinkedinUrl: '',
    applicationDeadline: '',
    jobStatus: 'OPEN'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (id) {
      const fetchJob = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/jobs/${id}`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          setFormData({
            title: response.data.title || '',
            description: response.data.description || '',
            location: response.data.location || '',
            employmentType: response.data.employmentType || '',
            experienceRequired: response.data.experienceRequired || '',
            minSalary: response.data.minSalary || '',
            maxSalary: response.data.maxSalary || '',
            skillRequired: response.data.skillRequired || '',
            eligibilityCriteria: response.data.eligibilityCriteria || '',
            aboutCompany: response.data.aboutCompany || '',
            companyLinkedinUrl: response.data.companyLinkedinUrl || '',
            applicationDeadline: response.data.applicationDeadline ? response.data.applicationDeadline.substring(0,16) : '',
            jobStatus: response.data.jobStatus || 'OPEN'
          });
        } catch (err) {
          setError('Failed to load job details.');
        }
      };
      fetchJob();
    }
  }, [id, user.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (Number(formData.minSalary) > Number(formData.maxSalary)) {
      setError("Minimum salary cannot be greater than maximum salary.");
      setLoading(false);
      return;
    }

    try {
       if (id) {
        await axios.put(`http://localhost:8080/jobs/${id}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setMessage('Job updated successfully! Redirecting...');
      } else {
        await axios.post('http://localhost:8080/jobs', formData, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setMessage('Job posted successfully! Redirecting...');
      }
      
      setTimeout(() => {
        navigate('/recruiter/jobs');
      }, 1500);

    } catch (err) {
      if (typeof err.response?.data === 'object') {
        const errorString = Object.entries(err.response.data)
                                  .map(([key, val]) => `${key}: ${val}`)
                                  .join(', ');
        setError(errorString);
      } else {
        setError(err.response?.data || 'Failed to post job. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container" style={{ maxWidth: '800px' }}>
        
        <div className="dashboard-header">
         <h1>{id ? 'Edit' : 'Post a'} <span className="highlight">{id ? 'Job' : 'New Job'}</span> 📢</h1>
         <p>{id ? 'Update the details of your job posting below.' : 'Fill out the details below to find the perfect candidate.'}</p>
        </div>

        <div className="auth-card" style={{ maxWidth: '100%' }}>
          {error && <div className="error-message">{error}</div>}
          {message && (
            <div style={{ background: 'rgba(0, 184, 148, 0.1)', color: 'var(--success)', border: '1px solid var(--success)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Job Title <span style={{color: 'var(--error)'}}>*</span></label>
              <input type="text" name="title" placeholder="e.g. Senior Frontend Developer" value={formData.title} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Job Description <span style={{color: 'var(--error)'}}>*</span></label>
              <textarea 
                name="description" 
                rows="5" 
                placeholder="Describe the role, responsibilities, etc..." 
                value={formData.description} 
                onChange={handleChange} 
                required
                style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Location <span style={{color: 'var(--error)'}}>*</span></label>
                <input type="text" name="location" placeholder="e.g. Remote, or New York" value={formData.location} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Employment Type <span style={{color: 'var(--error)'}}>*</span></label>
                <select name="employmentType" value={formData.employmentType} onChange={handleChange} required>
                  <option value="">Select Type</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="CONTRACT">Contract</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Minimum Salary ($) <span style={{color: 'var(--error)'}}>*</span></label>
                <input type="number" name="minSalary" placeholder="e.g. 60000" value={formData.minSalary} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Maximum Salary ($) <span style={{color: 'var(--error)'}}>*</span></label>
                <input type="number" name="maxSalary" placeholder="e.g. 90000" value={formData.maxSalary} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Experience Required (Years) <span style={{color: 'var(--error)'}}>*</span></label>
                <input type="text" name="experienceRequired" placeholder="e.g. 2-4 years" value={formData.experienceRequired} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Skills Required <span style={{color: 'var(--error)'}}>*</span></label>
                <input type="text" name="skillRequired" placeholder="e.g. React, Java, Spring Boot" value={formData.skillRequired} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Eligibility Criteria <span style={{color: 'var(--error)'}}>*</span></label>
              <textarea 
                name="eligibilityCriteria" 
                rows="3" 
                placeholder="e.g. Must have a Master's degree, must be willing to relocate, etc..." 
                value={formData.eligibilityCriteria} 
                onChange={handleChange} 
                required
                style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
              />
            </div>

            <div className="form-group">
              <label>About Company <span style={{color: 'var(--error)'}}>*</span></label>
              <textarea 
                name="aboutCompany" 
                rows="3" 
                placeholder="Describe your company..." 
                value={formData.aboutCompany} 
                onChange={handleChange} 
                required
                style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
              />
            </div>

            <div className="form-group">
              <label>Company LinkedIn URL (Optional)</label>
              <input 
                type="url" 
                name="companyLinkedinUrl" 
                placeholder="https://linkedin.com/company/..." 
                value={formData.companyLinkedinUrl} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
              />
            </div>

            <div className="form-group">
              <label>Registration Deadline (Optional)</label>
              <input 
                type="datetime-local" 
                name="applicationDeadline" 
                value={formData.applicationDeadline} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }} disabled={loading}>
              {loading ? <span className="spinner"></span> : (id ? 'Update Job' : 'Post Job')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateJob;