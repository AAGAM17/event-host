import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { TeamPage } from './pages/TeamPage';
import { SubmissionPage } from './pages/SubmissionPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { SignupPage } from './pages/SignupPage';
import PlagiarismPage from './pages/PlagiarismPage';
import {LoginPage} from './pages/LoginPage';
import ManageEventsPage from './pages/ManageEventsPage';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import CommunicationPage from './pages/CommunicationPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Layout>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/events" element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/create-event" element={
              <ProtectedRoute requireOrganizer>
                <CreateEventPage />
              </ProtectedRoute>
            } />
            
            <Route path="/team" element={
              <ProtectedRoute>
                <TeamPage />
              </ProtectedRoute>
            } />
            
            <Route path="/submission" element={
              <ProtectedRoute>
                <SubmissionPage />
              </ProtectedRoute>
            } />
            
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <LeaderboardPage />
              </ProtectedRoute>
            } />
            
            <Route path="/manage-events" element={
              <ProtectedRoute requireOrganizer>
                <ManageEventsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/communication" element={
              <ProtectedRoute>
                <CommunicationPage />
              </ProtectedRoute>
            } />
            
            
            <Route path="/plagiarism" element={
              <ProtectedRoute>
                <PlagiarismPage />
              </ProtectedRoute>
            } />
            
            {/* Redirect to home for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
}

export default App;
