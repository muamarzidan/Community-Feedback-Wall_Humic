import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Sidebar from './Sidebar';


const Layout = ({ children, showSidebar = true }) => {
  const location = useLocation();

  // Force default cursor on non-canvas pages
  useEffect(() => {
    if (location.pathname !== '/') {
      document.body.style.cursor = 'default';
    };
    
    return () => {
      if (location.pathname !== '/') {
        document.body.style.cursor = '';
      };
    };
  }, [location.pathname]);

  return (
    <div className="flex h-screen" style={{ cursor: location.pathname !== '/' ? 'default' : '' }}>
      {showSidebar && <Sidebar />}
      <div 
        className={`flex-1 ${
          showSidebar 
            ? 'ml-0 pt-16 sm:ml-[100px] sm:pt-0'
            : 'ml-0'
        }`} 
        style={{ cursor: location.pathname !== '/' ? 'default' : '' }}
      >
        {children}
      </div>
    </div>
  );
};

export default Layout;