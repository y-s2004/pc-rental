'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '../styles/MainMenu.module.css';

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
          <header className = {styles.header}>
            <button
              className = {styles.hamburger}
              aria-label = "メニュー"
              onClick={() => setOpen(!open)}
              ref={hamburgerRef}
            >
              <span className = {styles.bar} />
              <span className = {styles.bar} />
              <span className = {styles.bar} />
            </button>

            <span className = {styles.title}>PC貸出システム</span>

            {open && (
              <nav className = {styles.dropdown} ref={dropdownRef}>
                <Link href="/" onClick = {() => setOpen(false)}>メインメニュー</Link>
                <Link href="/device" onClick = {() => setOpen(false)}>機器リスト</Link>
                <Link href="/user" onClick = {() => setOpen(false)}>ユーザリスト</Link>
                <Link href="/rental" onClick = {() => setOpen(false)}>貸出</Link>
                <Link href="/return" onClick = {() => setOpen(false)}>返却</Link>
                <Link href="/over" onClick = {() => setOpen(false)}>延滞者リスト</Link>
              </nav>
            )}
          </header>

          <main className = {styles.center}>
            <h1 className = {styles.mainTitle}>メインメニュー</h1>
            <div className = {styles.buttons}>
                <Link href = "/device" className = {styles.btn}>機器リスト</Link>
                <Link href = "/user" className = {styles.btn}>ユーザリスト</Link>
                <Link href = "/rental" className = {styles.btn}>貸出</Link>
                <Link href = "/return" className = {styles.btn}>返却</Link>
                <Link href = "/over" className = {styles.btn}>延滞者リスト</Link>
            </div>
          </main>
        </>
      );
}
