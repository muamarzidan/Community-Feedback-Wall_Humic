import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { CursorModeProvider } from '@/contexts/CursorModeContext.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { PrivateRoute, GuestRoute } from '@/components/server/common/ProtectRoute.jsx';

import App from '@/App.jsx';
import LoginPage from '@/pages/auth/login.jsx';
import SignUpPage from '@/pages/auth/register.jsx';
import SendEmailPage from '@/pages/auth/reset_password/send-email.jsx';
import VerificationEmailCodePage from '@/pages/auth/reset_password/verification-email-code.jsx';
import NewPasswordPage from '@/pages/auth/reset_password/new-password.jsx';
import ProfilePage from '@/pages/profile.jsx';  
import AboutPage from '@/pages/about.jsx';
import NotesListPage from '@/pages/list-notes.jsx';
import MyNotesPage from '@/pages/my_notes.jsx';
import TermsConditions from '@/pages/terms-conditions.jsx';
import PrivacyPolicy from '@/pages/privacy-policy.jsx';


function RouterContent() {
  return (
    <CursorModeProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/notes" element={<NotesListPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route 
          path="/my-notes" 
          element={
            <PrivateRoute>
              <MyNotesPage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <ProfilePage />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <GuestRoute>
              <SignUpPage />
            </GuestRoute>
          } 
        />
        <Route 
          path="/RESET-send-email" 
          element={
            <GuestRoute>
              <SendEmailPage />
            </GuestRoute>
          } 
        />
        <Route 
          path="/RESET-verification-email-code" 
          element={
            <GuestRoute>
              <VerificationEmailCodePage />
            </GuestRoute>
          } 
        />
        <Route 
          path="/RESET-new-password" 
          element={
            <GuestRoute>
              <NewPasswordPage />
            </GuestRoute>
          } 
        />
      </Routes>
    </CursorModeProvider>
  );
};

function Router() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" />
        <RouterContent />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default Router;