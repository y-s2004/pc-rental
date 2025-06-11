import Link from 'next/link';
import useLogout from './Logout';

export default function RentalHeader({ styles }) {
    const handleLogout = useLogout();

    return (
        <header className={styles.header}>
            <span className={styles.title}>PC貸出システム</span>
            <div className={styles.headerNav}>
                <Link href="/" className={styles.headerBtn}>メインメニュー</Link>
                <Link href="/device" className={styles.headerBtn}>機器リスト</Link>
                <Link href="/user" className={styles.headerBtn}>ユーザリスト</Link>
                <Link href="/rental" className={styles.headerBtn}>貸出</Link>
                <Link href="/return" className={styles.headerBtn}>返却</Link>
                <Link href="/over" className={styles.headerBtn}>延滞者リスト</Link>
                <button className={styles.logoutButton} onClick={handleLogout}>
                    ログアウト
                </button>
            </div>
        </header>
    );
}