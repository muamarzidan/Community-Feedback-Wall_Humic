import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { CursorModeProvider } from './contexts/CursorModeContext.jsx';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import App from './App.jsx';
import LoginPage from './pages/auth/login.jsx';
import SignUpPage from './pages/auth/register.jsx';
import ProfilePage from './pages/profile/index.jsx';
import AboutPage from './pages/about.jsx';
import NotesListPage from './pages/notes/index.jsx';
import MyNotesPage from './pages/my-notes/index.jsx';


const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  };
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  };
  
  return !isAuthenticated ? children : <Navigate to="/" />;
};

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