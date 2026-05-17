import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="footer-logo">MoreOptions</div>
      <div className="footer-links">
        <Link href="#">About</Link>
        <Link href="#">For Schools</Link>
        <Link href="#">Privacy</Link>
        <Link href="#">Contact</Link>
      </div>
      <div className="footer-copy">© {new Date().getFullYear()} MoreOptions</div>
    </footer>
  );
}
