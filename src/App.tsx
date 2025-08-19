import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { CreateEventPage } from './pages/CreateEventPage';
import { TeamPage } from './pages/TeamPage';
import { SubmissionPage } from './pages/SubmissionPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import PlagiarismPage from './pages/PlagiarismPage';

// Mock user data - in a real app, this would come from authentication context
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'organizer' as const,
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face'
};
import LoginPage from './pages/LoginPage';
import ManageEventsPage from './pages/ManageEventsPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route path="/submission" element={<SubmissionPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/plagiarism" element={<PlagiarismPage />} />
          <Route path="/manage-events" element={<ManageEventsPage />} />
          {/* Add more routes as needed */}
          <Route path="*" element={
            <div className="container mx-auto px-4 py-16 text-center">
              <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
              <p className="text-gray-600">The page you're looking for doesn't exist.</p>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
