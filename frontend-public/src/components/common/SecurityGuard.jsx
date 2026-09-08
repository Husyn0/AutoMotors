// src/components/common/SecurityGuard.jsx
import React, { useEffect } from 'react';

const SecurityGuard = ({ children }) => {
  useEffect(() => {
    // Prevent right-click
    const preventRightClick = (e) => {
      if (e.button === 2) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent keyboard shortcuts for dev tools
    const preventDevTools = (e) => {
      // F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent text selection
    const preventSelection = (e) => {
      if (e.target.closest('.no-select')) {
        e.preventDefault();
      }
    };

    // Prevent copy
    const preventCopy = (e) => {
      if (e.target.closest('.no-copy')) {
        e.preventDefault();
        return false;
      }
    };

    // Disable context menu for images
    const preventImageContext = (e) => {
      if (e.target.tagName === 'IMG') {
        e.preventDefault();
        return false;
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', preventRightClick);
    document.addEventListener('keydown', preventDevTools);
    document.addEventListener('selectstart', preventSelection);
    document.addEventListener('copy', preventCopy);
    document.addEventListener('contextmenu', preventImageContext);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', preventRightClick);
      document.removeEventListener('keydown', preventDevTools);
      document.removeEventListener('selectstart', preventSelection);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('contextmenu', preventImageContext);
    };
  }, []);

  return <>{children}</>;
};

export default SecurityGuard;