'use client';

import React, { useEffect, useState } from 'react';
import Header from '@/components/navbar/header';

interface NavbarProps {
  children: React.ReactNode;
  isNavbarMargin?: boolean; // Add this prop to control margin
}

const Navbar: React.FC<NavbarProps> = ({ children, isNavbarMargin = true }) => {
  const [navbarHeight, setNavbarHeight] = useState<number | null>(null);

  useEffect(() => {
    const updateNavbarHeight = () => {
      const header = document.getElementById('header');
      
      let totalHeight = 0;
      if (header) {
        totalHeight += header.getBoundingClientRect().height;
      }
      
      if (totalHeight > 0) {
        setNavbarHeight(totalHeight);
      }
    };

    // Immediate measurement
    updateNavbarHeight();

    // Backup measurement after a short delay
    const timeoutId = setTimeout(updateNavbarHeight, 100);

    // Set up resize observer for responsive adjustments
    const resizeObserver = new ResizeObserver(updateNavbarHeight);
    resizeObserver.observe(document.body);

    // Add window resize listener as fallback
    const handleResize = () => {
      updateNavbarHeight();
    };
    
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      <Header />
      <main
        className={`transition-[padding] duration-200 ${
          isNavbarMargin ? '' : 'pt-0'
        }`}
        style={{
          paddingTop: isNavbarMargin && navbarHeight 
            ? `${navbarHeight}px` 
            : isNavbarMargin 
              ? 'var(--navbar-height-fallback, 48px)' // Further reduced fallback for mobile
              : '0px',
        }}
      >
        {children}
      </main>
    </>
  );
};

export default Navbar;