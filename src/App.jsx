import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';

// Layouts
import Layout from './layouts/Layout';
import AdminLayout from './layouts/AdminLayout';

// Student Phase 1
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Profile from './pages/Profile';

// Student Phase 2
import Assessments from './pages/Assessments';
import SkillGap from './pages/SkillGap';
import Resources from './pages/Resources';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import MockInterview from './pages/MockInterview';
import Colleges from './pages/Colleges';
import Notifications from './pages/Notifications';

// Admin Phase 3
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManagePaths from './pages/admin/ManagePaths';
import ManageResources from './pages/admin/ManageResources';
import Reports from './pages/admin/Reports';

// Additional Student Pages
import ForgotPassword from './pages/ForgotPassword';
import CareerGoal from './pages/CareerGoal';
import Quiz from './pages/Quiz';
import Progress from './pages/Progress';
import Achievements from './pages/Achievements';
import Settings from './pages/Settings';
import NotificationSettings from './pages/NotificationSettings';
import PrivacySettings from './pages/PrivacySettings';
import LanguageSettings from './pages/LanguageSettings';
import Help from './pages/Help';
import About from './pages/About';
import CompleteProfile from './pages/CompleteProfile';
import TaskPage from './pages/TaskPage';
import ResourceViewer from './pages/ResourceViewer';

// Advanced Modules
import Explore from './pages/Explore';
import Chatbot from './pages/Chatbot';
import Jobs from './pages/Jobs';
import Scholarships from './pages/Scholarships';
import PeerLearning from './pages/PeerLearning';

import ManageNotifications from './pages/admin/ManageNotifications';
import Subscription from './pages/Subscription';
import NotificationDetail from './pages/NotificationDetail';
import Projects from './pages/Projects';
import Hackathons from './pages/Hackathons';

function App() {
  return (
    <ThemeProvider>
      <div className="bg-blobs">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>
      <BrowserRouter>
        <Routes>
          {/* Student & Public Portal */}
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/" element={<Splash />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />

            {/* Authenticated Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/career-goal" element={<CareerGoal />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/skill-gap" element={<SkillGap />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/resume" element={<ResumeAnalyzer />} />
            <Route path="/resume-analyzer" element={<Navigate to="/resume" replace />} />
            <Route path="/mock-interview" element={<MockInterview />} />
            <Route path="/colleges" element={<Colleges />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/settings/notifications" element={<NotificationSettings />} />
            <Route path="/settings/privacy" element={<PrivacySettings />} />
            <Route path="/settings/language" element={<LanguageSettings />} />
            <Route path="/help" element={<Help />} />
            <Route path="/about" element={<About />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/scholarships" element={<Scholarships />} />
            <Route path="/peer-learning" element={<PeerLearning />} />
            <Route path="/task/:taskId" element={<TaskPage />} />
            <Route path="/resource/:id" element={<ResourceViewer />} />
            <Route path="/notification/:id" element={<NotificationDetail />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/hackathons" element={<Hackathons />} />
          </Route>

          {/* Admin Portal (With Side Nav) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<ManageStudents />} />
            <Route path="/admin/paths" element={<ManagePaths />} />
            <Route path="/admin/resources" element={<ManageResources />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/notifications" element={<ManageNotifications />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
