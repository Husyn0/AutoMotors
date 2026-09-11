// src/components/common/SecurityGuard.jsx
import React, { useEffect } from 'react';
const isProd = process.env.NODE_ENV ==='production' ;

const SecurityGuard = ({ children }) => {
  useEffect(() => {
    // 🟢 Development: no restrictions at all
    if (!isProd) {
      console.info(
        '%c[SecurityGuard] Development mode — all protections disabled.',
        'color:#22c55e;font-weight:bold;'
      );
      return;
    }

    // 🔴 Production: enable all protections
    console.info(
      '%c[SecurityGuard] Production mode — protections active.',
      'color:#ef4444;font-weight:bold;'
    );

    // Prevent right-click
    const preventRightClick = (e) => {
      if (e.button === 2) {
        e.preventDefault();
        return false;
      }
    };

    // Prevent keyboard shortcuts for dev tools
    const preventDevTools = (e) => {
     // F12
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      // Ctrl+Shift+I / J / C  (Windows/Linux)
      if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
        e.preventDefault();
        return false;
      }
      // Cmd+Option+I / J / C  (macOS)
      if (e.metaKey && e.altKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) {
        e.preventDefault();
        return false;
      }
      // Ctrl+U (view source)
      if (e.ctrlKey && e.key.toUpperCase() === 'U') {
        e.preventDefault();
        return false;
      }
      // Ctrl+S (save page)
      if (e.ctrlKey && e.key.toUpperCase() === 'S') {
        e.preventDefault();
        return false;
      }
      // Ctrl+P (print / save as PDF)
      if (e.ctrlKey && e.key.toUpperCase() === 'P') {
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
    
    // --- Prevent drag of images (extra protection) ---
    const preventImageDrag = (e) => {
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
    // document.addEventListener('contextmenu', preventImageContext);
    // document.addEventListener('dragstart', preventImageDrag);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', preventRightClick);
      document.removeEventListener('keydown', preventDevTools);
      document.removeEventListener('selectstart', preventSelection);
      document.removeEventListener('copy', preventCopy);
      document.removeEventListener('contextmenu', preventImageContext);
      document.removeEventListener('dragstart', preventImageDrag);
    };
  }, []);

  return <>{children}</>;
};

export default SecurityGuard;