import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ClipboardList, MapPin, Briefcase, Banknote } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function RecruiterJobs() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchJobs();
    }, [user.token]);

    const fetchJobs = async () => {
        try {
            // The backend will automatically return only THIS recruiter's jobs because of the token
            const response = await axios.get('http://localhost:8080/jobs', {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setJobs(response.data);
        } catch (err) {
            setError('Failed to load your jobs. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await axios.delete(`http://localhost:8080/jobs/${jobId}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                // Remove the deleted job from the screen without refreshing
                setJobs(jobs.filter(job => job.id !== jobId));
            } catch (err) {
                alert('Failed to delete job.');
            }
        }
    };

    return (
        <div className="dashboard-page">
            <div className="dashboard-container">

                <div className="dashboard-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>My <span className="highlight">Job Postings</span> <ClipboardList size={28} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '8px' }} /></h1>
                        <p>Manage the jobs you have posted.</p>
                    </div>
                    <Link to="/recruiter/jobs/create" className="btn btn-primary">
                        + Post New Job
                    </Link>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}><span className="spinner"></span></div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : jobs.length === 0 ? (
                    <div className="auth-card" style={{ textAlign: 'center', padding: '40px' }}>
                        <h2>No jobs posted yet</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>You haven't created any job listings.</p>
                        <Link to="/recruiter/jobs/create" className="btn btn-primary">Post Your First Job</Link>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {jobs.map((job) => (
                            <div key={job.id} className="auth-card" 
                                 style={{ maxWidth: '100%', cursor: 'pointer', transition: 'box-shadow 0.2s ease' }}
                                 onClick={() => navigate(`/recruiter/jobs/view/${job.id}`)}
                                 onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)'}
                                 onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                                
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>{job.title}</h2>
                                        <div style={{ display: 'flex', gap: '15px', color: 'var(--text-muted)', fontSize: '14px' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {job.location}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Briefcase size={14} /> {job.employmentType?.replace('_', ' ')}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Banknote size={14} /> ₹{job.minSalary} - ₹{job.maxSalary}</span>
                                        </div>
                                        <div style={{ marginTop: '10px' }}>
                                            <span style={{ background: job.jobStatus === 'OPEN' ? 'rgba(0, 184, 148, 0.2)' : 'rgba(214, 48, 49, 0.2)', color: job.jobStatus === 'OPEN' ? 'var(--success)' : 'var(--error)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold' }}>
                                                {job.jobStatus || 'OPEN'}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons (e.stopPropagation prevents card from collapsing when clicking buttons) */}
                                    <div style={{ display: 'flex', gap: '10px' }} onClick={(e) => e.stopPropagation()}>
                                        <Link
                                            to={`/recruiter/jobs/edit/${job.id}`}
                                            className="btn"
                                            style={{ background: 'var(--primary)', color: 'white', textDecoration: 'none' }}
                                        >
                                            Edit
                                        </Link>
                                        <Link 
                                            to={`/recruiter/jobs/${job.id}/applications`} 
                                            className="btn" 
                                            style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', textDecoration: 'none', display: 'flex', alignItems: 'center' }}
                                        >
                                            View Applications
                                        </Link>
                                        <button onClick={() => handleDelete(job.id)} className="btn" style={{ background: 'transparent', border: '1px solid var(--error)', color: 'var(--error)' }}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default RecruiterJobs;