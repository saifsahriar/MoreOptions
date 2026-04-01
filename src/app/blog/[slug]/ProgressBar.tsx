'use client';
import { useState, useEffect } from 'react';

export default function ProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const max = el.scrollHeight - el.clientHeight;
      if (max > 0) {
        setProgress((scrolled / max) * 100);
      } else {
        setProgress(0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="reading-progress">
      <div className="reading-progress-fill" style={{ width: `${progress}%` }}></div>
    </div>
  );
}
