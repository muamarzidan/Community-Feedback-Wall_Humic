import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { CursorModeProvider } from '@/contexts/CursorModeContext.jsx';
import { AuthProvider } from '@/contexts/AuthContext.jsx';
import { PrivateRoute, GuestRoute } from '@/components/server/common/ProtectRoute.jsx';

import App from '@/App.jsx';
import LoginPage from '@/pages/auth/login.jsx';
import SignUpPage from '@/pages/auth/register.jsx';
import ProfilePage from '@/pages/profile.jsx';
import AboutPage from '@/pages/about.jsx';
import NotesListPage from '@/pages/list-notes.jsx';
import MyNotesPage from '@/pages/my_notes.jsx';


function RouterContent() {
  return (
    <CursorModeProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/notes" element={<NotesListPage />} />
        <Route path="/about" element={<AboutPage />} />
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