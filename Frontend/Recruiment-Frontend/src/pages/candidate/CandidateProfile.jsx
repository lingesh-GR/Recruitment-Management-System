import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User } from 'lucide-react';
import axios from 'axios';

function CandidateProfile() {
  const { user } = useAuth(); // Get the logged-in user's token

  // All the fields the backend expects for a Candidate
  const [formData, setFormData] = useState({
    dateOfBirth: '',
    gender: '',
    location: '',
    highestQualification: '',
    university: '',
    graduationYear: '',
    skills: '',
    experienceYears: '',
    currentCompany: '',
    resumeUrl: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    bio: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // Success messages
  const [error, setError] = useState('');     // Error messages
    // Track if they are updating an old profile, or creating a new one
  const [isExistingProfile, setIsExistingProfile] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [resumeError, setResumeError] = useState('');

  // 1. Fetch existing profile when page loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8080/candidate-profile', {
          headers: { Authorization: `Bearer ${user.token}` } // 👈 We must send the token!
        });
        
        // If backend returns data, fill our form with it!
        if (response.data) {
          setFormData(response.data);
          setIsExistingProfile(true); // Now we know to use PUT instead of POST
        }
      } catch (err) {
        console.log("No existing profile found. User needs to create one.");
      }
    };
    
    fetchProfile();
  }, [user.token]); // Run once when component loads


  // 2. Handle typing in the form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    setMessage('');
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setResumeError('Please upload a PDF file.');
      return;
    }

    setUploadingResume(true);
    setResumeError('');

    const uploadData = new FormData();
    uploadData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8080/upload/resume', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${user.token}`
        }
      });
      
      setFormData(prev => ({ ...prev, resumeUrl: response.data }));
      setMessage('Resume uploaded successfully! Please save your profile.');
    } catch (err) {
      setResumeError('Failed to upload resume. Please try again.');
    } finally {
      setUploadingResume(false);
    }
  };


  // 3. Save profile to backend
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
        // Update existing profile (Backend uses /candidates for PUT)
        await axios.put('http://localhost:8080/candidates', formData, config);
        setMessage('Profile updated successfully!');
      } else {
        // Create new profile (Backend uses /candidate-profile for POST)
        await axios.post('http://localhost:8080/candidate-profile', formData, config);
        setMessage('Profile created successfully!');
        setIsExistingProfile(true); // Switch to update mode for future saves
      }
    } catch (err) {
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
    return (
    <div className="dashboard-page">
      <div className="dashboard-container" style={{ maxWidth: '800px' }}>
        
        <div className="dashboard-header">
          <h1>My <span className="highlight">Profile</span> 👤</h1>
          <p>Keep your profile updated to stand out to recruiters.</p>
        </div>

        <div className="auth-card" style={{ maxWidth: '100%' }}>
          
          {error && <div className="error-message">{error}</div>}
          {message && (
            <div style={{ background: 'rgba(0, 184, 148, 0.1)', color: 'var(--success)', border: '1px solid var(--success)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            
            {/* --- PERSONAL INFO --- */}
            <h3 style={{ marginBottom: '15px', color: 'var(--primary-light)' }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Date of Birth <span style={{color: 'var(--error)'}}>*</span></label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Gender <span style={{color: 'var(--error)'}}>*</span></label>
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Location (City) <span style={{color: 'var(--error)'}}>*</span></label>
                <input type="text" name="location" placeholder="e.g. New York" value={formData.location} onChange={handleChange} required />
              </div>
            </div>

            {/* --- EDUCATION --- */}
            <h3 style={{ margin: '20px 0 15px', color: 'var(--primary-light)' }}>Education</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Highest Qualification <span style={{color: 'var(--error)'}}>*</span></label>
                <input type="text" name="highestQualification" placeholder="e.g. B.Tech Computer Science" value={formData.highestQualification} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>University / College <span style={{color: 'var(--error)'}}>*</span></label>
                <input type="text" name="university" placeholder="Enter university name" value={formData.university} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Graduation Year <span style={{color: 'var(--error)'}}>*</span></label>
                <input type="number" name="graduationYear" placeholder="e.g. 2024" value={formData.graduationYear} onChange={handleChange} required />
              </div>
            </div>

            {/* --- EXPERIENCE & SKILLS --- */}
            <h3 style={{ margin: '20px 0 15px', color: 'var(--primary-light)' }}>Experience & Skills</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group">
                <label>Years of Experience <span style={{color: 'var(--error)'}}>*</span></label>
                <input type="number" name="experienceYears" placeholder="e.g. 2" value={formData.experienceYears} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Current Company (if any)</label>
                <input type="text" name="currentCompany" placeholder="e.g. Google" value={formData.currentCompany} onChange={handleChange} />
              </div>
            </div>
            <div className="form-group">
              <label>Top Skills (comma separated) <span style={{color: 'var(--error)'}}>*</span></label>
              <input type="text" name="skills" placeholder="e.g. Java, React, SQL" value={formData.skills} onChange={handleChange} required />
            </div>

            {/* --- LINKS --- */}
            <h3 style={{ margin: '20px 0 15px', color: 'var(--primary-light)' }}>Links & Portfolio</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div className="form-group" style={{ display: 'flex', flexDirection: 'column' }}>
                <label>Resume (PDF) <span style={{color: 'var(--error)'}}>*</span></label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={handleFileUpload}
                    style={{ padding: '8px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', flex: 1 }}
                  />
                  {uploadingResume && <span className="spinner" style={{ width: '20px', height: '20px' }}></span>}
                </div>
                {resumeError && <div style={{ color: 'var(--error)', fontSize: '12px', marginTop: '4px' }}>{resumeError}</div>}
                {formData.resumeUrl && (
                  <div style={{ marginTop: '8px', fontSize: '13px' }}>
                    <a href={formData.resumeUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '500' }}>
                      📄 View Uploaded Resume
                    </a>
                  </div>
                )}
              </div>
              <div className="form-group">
                <label>LinkedIn URL <span style={{color: 'var(--error)'}}>*</span></label>
                <input type="url" name="linkedinUrl" placeholder="https://linkedin.com/in/..." value={formData.linkedinUrl} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>GitHub URL <span style={{color: 'var(--error)'}}>*</span></label>
                <input type="url" name="githubUrl" placeholder="https://github.com/..." value={formData.githubUrl} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Portfolio Website</label>
                <input type="url" name="portfolioUrl" placeholder="https://..." value={formData.portfolioUrl} onChange={handleChange} />
              </div>
            </div>

            <div className="form-group">
              <label>Bio (Tell recruiters about yourself) <span style={{color: 'var(--error)'}}>*</span></label>
              <textarea 
                name="bio" 
                rows="4" 
                placeholder="I am a passionate software engineer..." 
                value={formData.bio} 
                onChange={handleChange}
                required
                style={{ width: '100%', padding: '12px', background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontFamily: 'inherit' }}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }} disabled={loading}>
              {loading ? <span className="spinner"></span> : (isExistingProfile ? 'Update Profile' : 'Create Profile')}
            </button>
            
          </form>
        </div>
      </div>
    </div>
  );
}

export default CandidateProfile;