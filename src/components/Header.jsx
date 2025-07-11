'use client';

import Link from 'next/link';
import useLogout from './Logout.jsx';
import styles from '../styles/Header.module.css';
import { useState, useEffect } from 'react';

export default function RentalHeader() {
    const Logout = useLogout();
    const [mounted, setMounted] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [loginUser, setLoginUser] = useState({ authority: '', name: '' });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('loginUser');
            if (user) {
                setLoginUser(JSON.parse(user));
            }
            setMounted(true);
        }
    }, []);

    return (
        <header className={styles.header}>
            {/* ロゴやタイトル */}
            <Link href="/" className={styles.headerBtn}>PC貸出管理システム</Link>

            {/* PC用ナビゲーション */}
            <nav className={styles.headerNav}>
                <Link href="/user" className={styles.headerBtn}>ユーザ一覧</Link>
                <Link href="/device" className={styles.headerBtn}>機器一覧</Link>
                <Link href="/over" className={styles.headerBtn}>延滞者一覧</Link>
                <Link href="/rental" className={styles.headerBtn}>貸出登録</Link>
                <Link href="/return" className={styles.headerBtn}>返却登録</Link>
            </nav>
            <nav className={styles.headerNav2}>
                {mounted && (
                    <span className={styles.loginInfo}>
                        権限：{loginUser.authority}  / 氏名：{loginUser.name}
                    </span>
                )}
                <button className={styles.logoutButton} onClick={Logout}>ログアウト</button>
            </nav>

            {/* ハンバーガーメニュー（スマホ用） */}
            <button className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
                <div className={styles.bar}></div>
            </button>

            {/* スマホ用ドロップダウンメニュー */}
            {menuOpen && (
                <div className={styles.dropdown}>
                    <Link href="/user" onClick={() => setMenuOpen(false)}>ユーザ一覧</Link>
                    <Link href="/device" onClick={() => setMenuOpen(false)}>機器一覧</Link>
                    <Link href="/over" onClick={() => setMenuOpen(false)}>延滞者一覧</Link>
                    <Link href="/rental" onClick={() => setMenuOpen(false)}>貸出登録</Link>
                    <Link href="/return" onClick={() => setMenuOpen(false)}>返却登録</Link>
                    {mounted && (
                        <div style={{ padding: '8px 16px', color: '#fff' }}>
                            権限：{loginUser.authority}<br />
                            氏名：{loginUser.name}
                        </div>
                    )}
                    <button className={styles.logoutButton} onClick={() => { setMenuOpen(false); Logout(); }}>
                        ログアウト
                    </button>
                </div>
            )}
        </header>
    );
}