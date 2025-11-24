import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';


const CursorModeContext = createContext();

export const useCursorMode = () => {
  const context = useContext(CursorModeContext);
  if (!context) {
    throw new Error('useCursorMode must be used within a CursorModeProvider');
  };
  return context;
};

export const CursorModeProvider = ({ children }) => {
  const getInitialMode = () => {
    const savedMode = localStorage.getItem('cursorMode');
    return savedMode || 'drag';
  };

  const [cursorMode, setCursorModeState] = useState(getInitialMode);
  const location = useLocation();

  // Custom setCursorMode that also saves to localStorage
  const setCursorMode = useCallback((mode) => {
    setCursorModeState(mode);
    localStorage.setItem('cursorMode', mode);
  }, []);

  // Reset cursor mode based on page navigation
  useEffect(() => {
    if (location.pathname === '/') {
      // Home page - use saved mode or default to drag
      const savedMode = localStorage.getItem('cursorMode');
      setCursorModeState(savedMode || 'drag');
      // Remove body cursor style when on canvas
      document.body.style.cursor = '';
    } else {
      // Other pages - always set to default and update localStorage
      setCursorModeState('default');
      // Force default cursor on body for non-canvas pages
      document.body.style.cursor = 'default';
    }
    
    // Cleanup
    return () => {
      document.body.style.cursor = '';
    };
  }, [location.pathname]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    cursorMode,
    setCursorMode
  }), [cursorMode, setCursorMode]);

  return (
    <CursorModeContext.Provider value={contextValue}>
      {children}
    </CursorModeContext.Provider>
  );
};