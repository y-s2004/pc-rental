'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '../styles/MainMenu.module.css';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation'; 

export default function MainMenu() {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const hamburgerRef = useRef(null);
    const [cookies, setCookie, removeCookie] = useCookies(['token']); 
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event) {
          if (
            dropdownRef.current && !dropdownRef.current.contains(event.target) &&
            hamburgerRef.current && !hamburgerRef.current.contains(event.target)
          ) {
            setOpen(false);
          }
        }
        if (open) {
          document.addEventListener('mousedown', handleClickOutside);
        } else {
          document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [open]);

    const handleLogout = () => {
        removeCookie('token');

        localStorage.removeItem('authToken'); 
        sessionStorage.removeItem('authToken'); 

        console.log('ログアウトしました');
        router.push('/login'); 
    };

    return (
        <>
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

            <span className={styles.headerTitle}>PC貸出システム</span>

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

          <main className={styles.main}>
            <div className={styles.cardWrapper}>
                <h1 className={styles.menuTitle}>メインメニュー</h1>
                <div className={styles.row}>
                    <Link href="/rental" className={`${styles.btn} ${styles.red}`}>貸出</Link>
                    <Link href="/return" className={`${styles.btn} ${styles.red}`}>返却</Link>
                </div>
                <div className={styles.row}>
                    <Link href="/device" className={styles.btn}>機器リスト</Link>
                    <Link href="/user" className={styles.btn}>ユーザリスト</Link>
                    <Link href="/over" className={styles.btn}>延滞者リスト</Link>
                </div>
            </div>
          </main>
      </>
    );
}