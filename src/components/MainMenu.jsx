'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '../styles/MainMenu.module.css';
import Header from './Header';

export default function MainMenu() {
      const [open, setOpen] = useState(false);
      const dropdownRef = useRef(null);
      const hamburgerRef = useRef(null); 

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

    return (
        <>
            <Header styles={styles} />

            <main className={styles.main}>
                <div className={styles.cardWrapper}>
                    <h1 className={styles.menuTitle}>メインメニュー</h1>
                    <div className={styles.row}>
                        <Link href="/rental" className={`${styles.btn}`}>貸出</Link>
                        <Link href="/return" className={`${styles.btn}`}>返却</Link>
                    </div>
                    <div className={styles.row}>
                        <Link href="/user" className={styles.btn}>ユーザ一覧</Link>
                        <Link href="/device" className={styles.btn}>機器一覧</Link>
                        <Link href="/over" className={styles.btn}>延滞者一覧</Link>
                    </div>
                </div>
            </main>

        </>
    );
}