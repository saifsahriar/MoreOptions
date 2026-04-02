'use client';
import { useState, useEffect } from 'react';

export default function MobileNavMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('mobile-nav-open');
    } else {
      document.body.classList.remove('mobile-nav-open');
    }
  }, [isOpen]);

  return (
    <button 
      className={`hamburger-icon ${isOpen ? 'active' : ''}`}
      onClick={() => setIsOpen(!isOpen)}
      aria-label="Toggle menu"
    >
      <span></span><span></span><span></span>
    </button>
  );
}
