'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import MobileNavMenu from '@/app/MobileNavMenu';

interface NavigationProps {
  onCtaClick?: () => void;
}

export default function Navigation({ onCtaClick }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <nav>
      <Link href="/" className="nav-logo">MoreOptions</Link>
      <ul className="nav-links">
        <li>
          <Link 
            href="/careers" 
            className={pathname?.startsWith('/career') ? 'active' : ''}
            onClick={(e) => {
              if (pathname === '/careers') {
                e.preventDefault();
                window.location.href = '/careers';
              }
            }}
          >
            Explore Careers
          </Link>
        </li>
        <li>
          <Link href="/blog" className={pathname?.startsWith('/blog') ? 'active' : ''}>
            Insights
          </Link>
        </li>
        <li>
          <Link href="/saved" className={pathname === '/saved' ? 'active' : ''}>
            Saved
          </Link>
        </li>
      </ul>
      <div className="nav-actions">
        {onCtaClick ? (
          <button className="nav-cta" onClick={onCtaClick}>Discover yours →</button>
        ) : (
          <Link href="/">
            <button className="nav-cta">Discover yours →</button>
          </Link>
        )}
        <MobileNavMenu />
      </div>
    </nav>
  );
}
