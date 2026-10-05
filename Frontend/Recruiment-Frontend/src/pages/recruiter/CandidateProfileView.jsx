import { useAuth } from '../../context/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Briefcase } from 'lucide-react';
import axios from 'axios';

function CandidateProfileView() {
  const { id } = useParams(); // Candidate's User ID
  const { user } = useAuth();
  const navigate = useNavigate();

  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCandidate = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/candidate/user/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        setCandidate(response.data);
      } catch (err) {
        setError('Failed to load candidate profile. They may not have completed it yet.');
      } finally {
        setLoading(false);
      }
    };
    fetchCandidate();
  }, [id, user.token]);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px' }}><span className="spinner"></span></div>;
  if (error) return <div className="dashboard-page"><div className="error-message">{error}</div><button onClick={() => navigate(-1)} className="btn">Go Back</button></div>;
  if (!candidate) return null;

  return (
    <div className="dashboard-page">
      <div className="dashboard-container" style={{ maxWidth: '800px' }}>
        
        <button onClick={() => navigate(-1)} className="btn" style={{ marginBottom: '20px', background: 'var(--bg-input)' }}>
          ← Back to Applications
        </button>

        <div className="auth-card" style={{ maxWidth: '100%', padding: '40px' }}>
          
          {/* Header Section */}
          <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '25px', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '28px', marginBottom: '8px', color: 'var(--primary-light)' }}>{candidate.name}</h1>
              <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)', fontSize: '15px', marginBottom: '15px' }}>
                <span>📧 {candidate.email}</span>
                <span>📞 {candidate.phone || 'N/A'}</span>
                <span>📍 {candidate.location || 'Location not provided'}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                 {candidate.linkedinUrl && (
                   <a href={candidate.linkedinUrl} target="_blank" rel="noreferrer" style={{ background: '#0077b5', color: 'white', padding: '5px 12px', borderRadius: '15px', fontSize: '12px', textDecoration: 'none' }}>LinkedIn</a>
                 )}
                 {candidate.githubUrl && (
                   <a href={candidate.githubUrl} target="_blank" rel="noreferrer" style={{ background: '#333', color: 'white', padding: '5px 12px', borderRadius: '15px', fontSize: '12px', textDecoration: 'none' }}>GitHub</a>
                 )}
                 {candidate.portfolioUrl && (
                   <a href={candidate.portfolioUrl} target="_blank" rel="noreferrer" style={{ background: 'var(--primary)', color: 'white', padding: '5px 12px', borderRadius: '15px', fontSize: '12px', textDecoration: 'none' }}>Portfolio</a>
                 )}
                 {candidate.resumeUrl && (
                   <a href={candidate.resumeUrl} target="_blank" rel="noreferrer" style={{ background: 'var(--success)', color: 'white', padding: '5px 12px', borderRadius: '15px', fontSize: '12px', textDecoration: 'none' }}>📄 Resume</a>
                 )}
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Experience</div>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{candidate.experienceYears ? `${candidate.experienceYears} Years` : 'Fresher'}</div>
            </div>
          </div>

          {/* About / Bio */}
          {candidate.bio && (
            <div style={{ marginBottom: '30px' }}>
              <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '10px' }}>About</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>{candidate.bio}</p>
            </div>
          )}

          {/* Education & Experience Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
            <div style={{ background: 'var(--bg-input)', padding: '20px', borderRadius: 'var(--radius-sm)' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '15px' }}>🎓 Education</h3>
              <div style={{ marginBottom: '10px' }}>
                <strong style={{ color: 'var(--primary-light)' }}>{candidate.university || 'University not provided'}</strong>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Degree: {candidate.highestQualification || 'N/A'} <br/>
                Graduation: {candidate.graduationYear || 'N/A'}
              </div>
            </div>

            <div style={{ background: 'var(--bg-input)', padding: '20px', borderRadius: 'var(--radius-sm)' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '15px' }}>💼 Current Role</h3>
              {candidate.currentCompany ? (
                <>
                  <div style={{ marginBottom: '10px' }}>
                    <strong style={{ color: 'var(--primary-light)' }}>{candidate.currentCompany}</strong>
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                    Experience: {candidate.experienceYears} years
                  </div>
                </>
              ) : (
                <div style={{ color: 'var(--text-muted)' }}>Not currently employed</div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div>
            <h3 style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '15px' }}>Technical Skills</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {candidate.skills ? candidate.skills.split(',').map((skill, i) => (
                <span key={i} style={{ background: 'rgba(108, 92, 231, 0.1)', color: 'var(--primary-light)', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', fontWeight: '500' }}>
                  {skill.trim()}
                </span>
              )) : <span style={{ color: 'var(--text-muted)' }}>No skills listed</span>}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CandidateProfileView;
