import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CursorModeProvider } from './contexts/CursorModeContext.jsx';
import App from './App.jsx';

import LoginPage from './pages/auth/login.jsx';
import SignUpPage from './pages/auth/register.jsx';
import ProfilePage from './pages/profile/index.jsx';
import AboutPage from './pages/about/index.jsx';
import NotesListPage from './pages/notes/index.jsx';

function Router() {
  return (
    <BrowserRouter>
      <CursorModeProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/notes" element={<NotesListPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<SignUpPage />} />
        </Routes>
      </CursorModeProvider>
    </BrowserRouter>
  );
}

export default Router;