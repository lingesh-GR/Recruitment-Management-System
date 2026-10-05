import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Building2 } from 'lucide-react';
import axios from 'axios';

function RecruiterProfile() {
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    designation: '',
    companyName: '',
    websiteUrl: '',
    industry: '',
    companySize: '',
    location: '',
    logoUrl: '',
    aboutCompany: '',
    companyLinkedinUrl: ''
  });

  const [isExistingProfile, setIsExistingProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // 1. Fetch existing profile on load
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8080/recruiter', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        
        if (response.data) {
          setFormData({
            designation: response.data.designation || '',
            companyName: response.data.companyName || '',
            websiteUrl: response.data.websiteUrl || '',
            industry: response.data.industry || '',
            companySize: response.data.companySize || '',
            location: response.data.location || '',
            logoUrl: response.data.logoUrl || '',
            aboutCompany: response.data.aboutCompany || '',
            companyLinkedinUrl: response.data.companyLinkedinUrl || ''
          });
          setIsExistingProfile(true);
        }
      } catch (err) {
        console.log("No profile found. Create a new one.");
      }
    };
    fetchProfile();
  }, [user.token]);

  // 2. Handle Typing
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setMessage('');
  };

  // 3. Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const config = {
        headers: { Authorization: `Bearer ${user.token}` }
      };

      if (isExistingProfile) {
        await axios.put('http://localhost:8080/recruiter', formData, config);
        setMessage('Company profile updated successfully!');
      } else {
        await axios.post('http://localhost:8080/recruiter', formData, config);
        setMessage('Company profile created successfully!');
        setIsExistingProfile(true);
      }
    } catch (err) {
      if (typeof err.response?.data === 'object') {
        const errorString = Object.entries(err.response.data)
                                  .map(([key, val]) => `${key}: ${val}`)
                                  .join(', ');
        setError(errorString);
      } else {
        setError(err.response?.data || 'Failed to save profile. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-container" style={{ maxWidth: '800px' }}>
        
        <div className="dashboard-header">
          <h1>Company <span className="highlight">Profile</span> 🏢</h1>
          <p>Tell candidates about your company and your role to attract the best talent.</p>
        </div>

        <div className="auth-card" style={{ maxWidth: '100%' }}>
          {error && <div className="error-message">{error}</div>}
          {message && (
            <div style={{ background: 'rgba(0, 184, 148, 0.1)', color: 'var(--success)', border: '1px solid var(--success)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Company Name <span style={{color: 'var(--error)'}}>*</span></label>
                <input type="text" name="companyName" placeholder="e.g. Google, TechCorp" value={formData.companyName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Your Designation / Title <span style={{color: 'var(--error)'}}>*</span></label>
                <input type="text" name="designation" placeholder="e.g. Senior HR Manager" value={formData.designation} onChange={handleChange} required />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Industry</label>
                <select name="industry" value={formData.industry} onChange={handleChange}>
                  <option value="">Select Industry</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Finance">Finance</option>
                  <option value="Education">Education</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Company Size</label>
                <select name="companySize" value={formData.companySize} onChange={handleChange}>
                  <option value="">Select Size</option>
                  <option value="1-10 Employees">1-10 Employees</option>
                  <option value="11-50 Employees">11-50 Employees</option>
                  <option value="51-200 Employees">51-200 Employees</option>
                  <option value="201-500 Employees">201-500 Employees</option>
                  <option value="500+ Employees">500+ Employees</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Headquarters Location</label>
                <input type="text" name="location" placeholder="e.g. San Francisco, CA" value={formData.location} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Company Website</label>
                <input type="url" name="websiteUrl" placeholder="https://yourcompany.com" value={formData.websiteUrl} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
               <div className="form-group">
                <label>Company LinkedIn Profile</label>
                <input type="url" name="companyLinkedinUrl" placeholder="https://linkedin.com/company/..." value={formData.companyLinkedinUrl} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Company Logo URL</label>
                <input type="url" name="logoUrl" placeholder="https://imgur.com/... (Optional image link)" value={formData.logoUrl} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>About the Company</label>
              <textarea 
                name="aboutCompany" 
                rows="5" 
                placeholder="Tell candidates about your company's mission, culture, and what you do..." 
                value={formData.aboutCompany} 
                onChange={handleChange} 
                style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }} disabled={loading}>
              {loading ? <span className="spinner"></span> : (isExistingProfile ? 'Update Company Profile' : 'Create Company Profile')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RecruiterProfile;