'use client';
import { useState, useEffect } from 'react';

export default function CareerActions({ careerId, careerName }: { careerId: string, careerName: string }) {
  const [isSaved, setIsSaved] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [shareText, setShareText] = useState('Share →');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHasMounted(true);
    const saved = JSON.parse(localStorage.getItem('saved_careers') || '[]');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSaved(saved.includes(careerId));
  }, [careerId]);

  const handleSave = () => {
    const saved: string[] = JSON.parse(localStorage.getItem('saved_careers') || '[]');
    if (saved.includes(careerId)) {
      const updated = saved.filter(id => id !== careerId);
      localStorage.setItem('saved_careers', JSON.stringify(updated));
      setIsSaved(false);
    } else {
      saved.push(careerId);
      localStorage.setItem('saved_careers', JSON.stringify(saved));
      setIsSaved(true);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `${careerName} Career Guide`,
      text: `Check out this career path for ${careerName} on MoreOptions!`,
      url: window.location.href
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareText('Copied!');
        setTimeout(() => setShareText('Share →'), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  if (!hasMounted) {
    // SSR placeholder to prevent hydration mismatch
    return (
      <div className="career-actions">
        <button className="btn btn-primary" style={{ opacity: 0.7 }}>Save this career</button>
        <button className="btn btn-ghost">Share →</button>
      </div>
    );
  }

  return (
    <div className="career-actions">
      <button 
        className={`btn ${isSaved ? 'btn-ghost' : 'btn-primary'}`} 
        onClick={handleSave}
        style={isSaved ? { border: '1px solid var(--accent)', color: 'var(--accent)' } : {}}
      >
        {isSaved ? '♥ Saved' : 'Save this career'}
      </button>
      <button className="btn btn-ghost" onClick={handleShare}>
        {shareText}
      </button>
    </div>
  );
}
