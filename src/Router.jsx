import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import LoginPage from './pages/auth/login.jsx';
import SignUpPage from './pages/auth/register.jsx';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;