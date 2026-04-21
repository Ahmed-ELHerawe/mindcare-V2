import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/store';
import Layout from './components/shared/Layout';
import { EmergencyButton } from './components/shared/CrisisDetection';
import Login from './pages/Login';

// Patient
import PatientHome from './pages/patient/PatientHome';
import PatientChat from './pages/patient/PatientChat';
import AIAdvice from './pages/patient/AIAdvice';
import PatientAppointments from './pages/patient/PatientAppointments';
import BrowseDoctors from './pages/patient/BrowseDoctors';
import CBTExercises from './pages/patient/CBTExercises';
import Questionnaires from './pages/patient/Questionnaires';
import { Medications, SleepTracker, TherapeuticJournal } from './pages/patient/MedicalFeatures';
import { Achievements, AppSettings } from './pages/patient/AchievementsSettings';
import { PatientMood } from './pages/doctor/DoctorReports';

// Doctor
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorPatients from './pages/doctor/DoctorPatients';
import DoctorChat from './pages/doctor/DoctorChat';
import { DoctorReports, DoctorAppointments } from './pages/doctor/DoctorReports';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import { AdminAnalytics, AuditLog, WaitingList } from './pages/admin/AdminFeatures';

const THEME_STYLES = {
  dark:     { '--bg': '#0a0f1e', '--bg2': '#0d1428', '--text': '#e2e8f0' },
  light:    { '--bg': '#f0f4ff', '--bg2': '#ffffff',  '--text': '#1a1a2e' },
  contrast: { '--bg': '#000000', '--bg2': '#111111',  '--text': '#ffffff' },
  mint:     { '--bg': '#0a1f1a', '--bg2': '#0d2b24',  '--text': '#d1fae5' },
  rose:     { '--bg': '#1f0a14', '--bg2': '#2b0d1c',  '--text': '#fce7f3' },
};

function Protected({ children, role }) {
  const { currentUser } = useStore();
  if (!currentUser) return <Navigate to="/" replace />;
  if (role && currentUser.role !== role) return <Navigate to={`/${currentUser.role}`} replace />;
  return (
    <Layout>
      {children}
      {currentUser.role === 'patient' && <EmergencyButton />}
    </Layout>
  );
}

export default function App() {
  const { currentUser, theme } = useStore();
  const themeVars = THEME_STYLES[theme] || THEME_STYLES.dark;

  return (
    <div style={{ background: themeVars['--bg'], minHeight: '100vh', color: themeVars['--text'], transition: 'all 0.5s ease' }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={currentUser ? <Navigate to={`/${currentUser.role}`} replace /> : <Login />} />

          {/* Patient Routes */}
          <Route path="/patient"              element={<Protected role="patient"><PatientHome /></Protected>} />
          <Route path="/patient/mood"         element={<Protected role="patient"><PatientMood /></Protected>} />
          <Route path="/patient/chat"         element={<Protected role="patient"><PatientChat /></Protected>} />
          <Route path="/patient/appointments" element={<Protected role="patient"><PatientAppointments /></Protected>} />
          <Route path="/patient/advice"       element={<Protected role="patient"><AIAdvice /></Protected>} />
          <Route path="/patient/doctors"      element={<Protected role="patient"><BrowseDoctors /></Protected>} />
          <Route path="/patient/cbt"          element={<Protected role="patient"><CBTExercises /></Protected>} />
          <Route path="/patient/questionnaire"element={<Protected role="patient"><Questionnaires /></Protected>} />
          <Route path="/patient/medications"  element={<Protected role="patient"><Medications /></Protected>} />
          <Route path="/patient/sleep"        element={<Protected role="patient"><SleepTracker /></Protected>} />
          <Route path="/patient/journal"      element={<Protected role="patient"><TherapeuticJournal /></Protected>} />
          <Route path="/patient/achievements" element={<Protected role="patient"><Achievements /></Protected>} />
          <Route path="/patient/settings"     element={<Protected role="patient"><AppSettings /></Protected>} />
          <Route path="/patient/waiting"      element={<Protected role="patient"><WaitingList /></Protected>} />

          {/* Doctor Routes */}
          <Route path="/doctor"              element={<Protected role="doctor"><DoctorDashboard /></Protected>} />
          <Route path="/doctor/patients"     element={<Protected role="doctor"><DoctorPatients /></Protected>} />
          <Route path="/doctor/chat"         element={<Protected role="doctor"><DoctorChat /></Protected>} />
          <Route path="/doctor/appointments" element={<Protected role="doctor"><DoctorAppointments /></Protected>} />
          <Route path="/doctor/reports"      element={<Protected role="doctor"><DoctorReports /></Protected>} />
          <Route path="/doctor/settings"     element={<Protected role="doctor"><AppSettings /></Protected>} />

          {/* Admin Routes */}
          <Route path="/admin"              element={<Protected role="admin"><AdminDashboard /></Protected>} />
          <Route path="/admin/users"        element={<Protected role="admin"><AdminUsers /></Protected>} />
          <Route path="/admin/doctors"      element={<Protected role="admin"><AdminUsers /></Protected>} />
          <Route path="/admin/appointments" element={<Protected role="admin"><AdminDashboard /></Protected>} />
          <Route path="/admin/analytics"    element={<Protected role="admin"><AdminAnalytics /></Protected>} />
          <Route path="/admin/audit"        element={<Protected role="admin"><AuditLog /></Protected>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
