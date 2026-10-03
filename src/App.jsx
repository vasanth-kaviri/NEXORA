import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import './index.css';

// Layouts
import Layout from './layouts/Layout';
import AdminLayout from './layouts/AdminLayout';

// Auth & Onboarding
import Splash from './pages/auth/Splash';
import Onboarding from './pages/auth/Onboarding';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyAccount from './pages/auth/VerifyAccount';
import CompleteProfile from './pages/auth/CompleteProfile';

// Dashboard & Student Workspace
import Dashboard from './pages/dashboard/Dashboard';
import Explore from './pages/dashboard/Explore';
import Profile from './pages/dashboard/Profile';
import Progress from './pages/dashboard/Progress';
import Achievements from './pages/dashboard/Achievements';
import CareerGoal from './pages/dashboard/CareerGoal';

// Learning & Skill Lab
import Roadmap from './pages/learning/Roadmap';
import MockInterview from './pages/learning/MockInterview';
import Assessments from './pages/learning/Assessments';
import SkillGap from './pages/learning/SkillGap';
import Quiz from './pages/learning/Quiz';
import TaskPage from './pages/learning/TaskPage';
import PeerLearning from './pages/learning/PeerLearning';
import Resources from './pages/learning/Resources';
import ResourceViewer from './pages/learning/ResourceViewer';

// Career & Opportunities
import Jobs from './pages/career/Jobs';
import Scholarships from './pages/career/Scholarships';
import Hackathons from './pages/career/Hackathons';
import Colleges from './pages/career/Colleges';
import Projects from './pages/career/Projects';

// Resume & ATS Lab
import ResumeAnalyzer from './pages/resume/ResumeAnalyzer';

// Settings & Preferences
import Settings from './pages/settings/Settings';
import NotificationSettings from './pages/settings/NotificationSettings';
import PrivacySettings from './pages/settings/PrivacySettings';
import LanguageSettings from './pages/settings/LanguageSettings';

// Notifications
import Notifications from './pages/notifications/Notifications';
import NotificationDetail from './pages/notifications/NotificationDetail';

// AI Intelligence
import Chatbot from './pages/ai/Chatbot';

// Informational & Legal
import About from './pages/info/About';
import Help from './pages/info/Help';
import Terms from './pages/info/Terms';
import Subscription from './pages/info/Subscription';

// Admin Operations Portal
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManagePaths from './pages/admin/ManagePaths';
import ManageResources from './pages/admin/ManageResources';
import Reports from './pages/admin/Reports';
import ManageNotifications from './pages/admin/ManageNotifications';

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <div className="bg-blobs">
              <div className="blob blob-1"></div>
              <div className="blob blob-2"></div>
              <div className="blob blob-3"></div>
            </div>
            <BrowserRouter>
              <Routes>
                {/* Student & Public Portal */}
                <Route element={<Layout />}>
                  {/* ── Public Auth & Entry Routes ── */}
                  <Route path="/" element={<Splash />} />
                  <Route path="/onboarding" element={<Onboarding />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-account" element={<VerifyAccount />} />
                  <Route path="/complete-profile" element={<CompleteProfile />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/pricing" element={<Subscription />} />

                  {/* ── Protected Student Workspace Routes (RBAC & Verification Guard) ── */}
                  <Route element={<ProtectedRoute />}>
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
                    <Route path="/privacy" element={<Navigate to="/settings/privacy" replace />} />
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
                </Route>

                {/* ── Admin Management Portal (Strict RBAC Guard) ── */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route element={<AdminRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/students" element={<ManageStudents />} />
                    <Route path="/admin/paths" element={<ManagePaths />} />
                    <Route path="/admin/resources" element={<ManageResources />} />
                    <Route path="/admin/reports" element={<Reports />} />
                    <Route path="/admin/notifications" element={<ManageNotifications />} />
                  </Route>
                </Route>
                
                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
