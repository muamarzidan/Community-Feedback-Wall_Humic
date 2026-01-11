import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import Router from '@/Router.jsx';
import ErrorBoundary from '@/components/server/common/ErrorBoundary.jsx';
import './index.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <Router />
    </ErrorBoundary>
  </StrictMode>,
);