import Link from 'next/link';
import useLogout from './Logout';

export default function RentalHeader({ open, setOpen, hamburgerRef, dropdownRef, styles }) {
  const handleLogout = useLogout();

  return (
    <header className={styles.header}>
      <button
        className={styles.hamburger}
        aria-label="メニュー"
        onClick={() => setOpen(!open)}
        ref={hamburgerRef}
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>
      <span className={styles.title}>PC貸出システム</span>
      {open && (
        <nav className={styles.dropdown} ref={dropdownRef}>
          <Link href="/" onClick={() => setOpen(false)}>メインメニュー</Link>
          <Link href="/device" onClick={() => setOpen(false)}>機器リスト</Link>
          <Link href="/user" onClick={() => setOpen(false)}>ユーザリスト</Link>
          <Link href="/rental" onClick={() => setOpen(false)}>貸出</Link>
          <Link href="/return" onClick={() => setOpen(false)}>返却</Link>
          <Link href="/over" onClick={() => setOpen(false)}>延滞者リスト</Link>
        </nav>
      )}
      <button className={styles.logoutButton} onClick={handleLogout}>
        ログアウト
      </button>
    </header>
  );
}