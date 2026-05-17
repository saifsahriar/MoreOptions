'use client';

import { useState, useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase-browser';
import { useRouter } from 'next/navigation';
import HCaptcha from '@hcaptcha/react-hcaptcha';

export default function LoginForm() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState<number | null>(null);

  useEffect(() => {
    // Check if currently locked out
    const lockout = localStorage.getItem('adminLockoutUntil');
    if (lockout) {
      const time = parseInt(lockout, 10);
      if (time > Date.now()) {
        setLockoutUntil(time);
      } else {
        localStorage.removeItem('adminLockoutUntil');
        localStorage.removeItem('adminFailedAttempts');
      }
    }
    
    const attempts = localStorage.getItem('adminFailedAttempts');
    if (attempts) {
      setFailedAttempts(parseInt(attempts, 10));
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (lockoutUntil && lockoutUntil > Date.now()) {
      setAuthError(`Account temporarily locked. Try again in ${Math.ceil((lockoutUntil - Date.now()) / 60000)} minutes.`);
      return;
    }

    if (!captchaToken) {
      setAuthError('Please complete the CAPTCHA');
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem('adminFailedAttempts', newAttempts.toString());
      
      if (newAttempts >= 5) {
        // Lockout for 15 minutes
        const lockoutTime = Date.now() + 15 * 60 * 1000;
        setLockoutUntil(lockoutTime);
        localStorage.setItem('adminLockoutUntil', lockoutTime.toString());
        setAuthError('Too many failed attempts. Account locked for 15 minutes.');
      } else {
        setAuthError(`${error.message} (${5 - newAttempts} attempts remaining)`);
      }
    } else {
      // Success, clear lockout state
      localStorage.removeItem('adminLockoutUntil');
      localStorage.removeItem('adminFailedAttempts');
      router.refresh();
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-box">
        <div className="login-logo">MoreOptions</div>
        <div className="login-sub">Admin dashboard — restricted access</div>
        <form onSubmit={handleLogin}>
          <label className="login-label">Email</label>
          <input className="login-input" type="email" placeholder="admin@moreoptions.in" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" disabled={!!lockoutUntil && lockoutUntil > Date.now()} />
          <label className="login-label">Password</label>
          <input className="login-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={!!lockoutUntil && lockoutUntil > Date.now()} />
          
          <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
            <HCaptcha
              sitekey={process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || '10000000-ffff-ffff-ffff-000000000001'}
              onVerify={(token) => setCaptchaToken(token)}
            />
          </div>

          <button className="login-btn" type="submit" disabled={!!lockoutUntil && lockoutUntil > Date.now()}>Sign in →</button>
        </form>
        {authError && <div style={{ color: 'var(--red)', marginTop: '12px', fontSize: '14px', textAlign: 'center' }}>{authError}</div>}
      </div>
    </div>
  );
}
