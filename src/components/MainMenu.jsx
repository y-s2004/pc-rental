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
          <Header
            open={open}
            setOpen={setOpen}
            hamburgerRef={hamburgerRef}
            dropdownRef={dropdownRef}
            styles={styles}
          />

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