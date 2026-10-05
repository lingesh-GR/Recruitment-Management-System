import './index.css'
import { Routes, Route } from 'react-router-dom' // Removed BrowserRouter since it's in main.jsx
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import ProtectedRoute from './components/ProtectedRoute'
import CandidateDashboard from './pages/candidate/CandidateDashboard'
import CandidateProfile from './pages/candidate/CandidateProfile'
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard'
import RecruiterProfile from './pages/recruiter/RecruiterProfile'
import CreateJob from './pages/recruiter/CreateJob'
import RecruiterJobs from './pages/recruiter/RecruiterJobs'
import BrowseJobs from './pages/candidate/BrowseJobs'
import JobDetails from './pages/candidate/JobDetails'
import Navbar from './components/Navbar';
import MyApplications from './pages/candidate/MyApplications';
import ViewApplications from './pages/recruiter/ViewApplications';
import CandidateProfileView from './pages/recruiter/CandidateProfileView';

import { useState } from 'react';

function App() {
  const [theme, setTheme] = useState('dark');

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <>
      <button className="theme-toggle" onClick={toggleTheme} style={{ zIndex: 1000 }}>
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
      <Navbar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/' element={<Login />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/candidate/dashboard' element={
          <ProtectedRoute allowRoles={['CANDIDATE']}>
            <CandidateDashboard />
          </ProtectedRoute>
        } />
        <Route path='/candidate/profile' element={
          <ProtectedRoute allowRoles={['CANDIDATE']}>
            <CandidateProfile />
          </ProtectedRoute>
        } />
        <Route path="/recruiter/dashboard" element={
          <ProtectedRoute allowRoles={['RECRUITER']}>
            <RecruiterDashboard />
          </ProtectedRoute>
        } />
        <Route path="/recruiter/profile" element={
          <ProtectedRoute allowRoles={['RECRUITER']}>
            <RecruiterProfile />
          </ProtectedRoute>
        } />
        <Route path="/recruiter/jobs/create" element={
          <ProtectedRoute allowRoles={['RECRUITER']}>
            <CreateJob />
          </ProtectedRoute>
        } />
        <Route path="/recruiter/jobs" element={
          <ProtectedRoute allowRoles={['RECRUITER']}>
            <RecruiterJobs />
          </ProtectedRoute>
        } />
        <Route path="/recruiter/jobs/edit/:id" element={
          <ProtectedRoute allowRoles={['RECRUITER']}>
            <CreateJob />
          </ProtectedRoute>
        } />
        <Route path="/candidate/jobs" element={
          <ProtectedRoute allowRoles={['CANDIDATE']}>
            <BrowseJobs />
          </ProtectedRoute>
        } />
        <Route path="/candidate/jobs/:id" element={
          <ProtectedRoute allowRoles={['CANDIDATE']}>
            <JobDetails />
          </ProtectedRoute>
        } />
        <Route path="/candidate/applications" element={
          <ProtectedRoute allowRoles={['CANDIDATE']}>
            <MyApplications />
          </ProtectedRoute>
        } />
        <Route path="/recruiter/jobs/:id/applications" element={
          <ProtectedRoute allowRoles={['RECRUITER']}>
            <ViewApplications />
          </ProtectedRoute>
        } />
        <Route path="/recruiter/candidate/:id" element={
          <ProtectedRoute allowRoles={['RECRUITER']}>
            <CandidateProfileView />
          </ProtectedRoute>
        } />
        <Route path="/recruiter/jobs/view/:id" element={
          <ProtectedRoute allowRoles={['RECRUITER']}>
            <JobDetails />
          </ProtectedRoute>
        } />
        <Route path="*" element={<h1>Page is Not found 401</h1>} />
      </Routes>
    </>
  )
}

export default App