'use client';

import Link from 'next/link';
import useLogout from './Logout';
import styles from '../styles/Header.module.css';
import { useState, useEffect } from 'react';

export default function RentalHeader() {
    const Logout = useLogout();
    const [loginUser, setLoginUser] = useState({ authority: '', name: '' });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('loginUser');
            if (user) {
                setLoginUser(JSON.parse(user));
            }
            setMounted(true);
        }
    }, []);

    if (!mounted) return null;
    
    return (
        <header className={styles.header}>
            <div className={styles.headerNav}>
                <Link href="/" className={styles.headerBtn}>PC貸出管理システム</Link>
                <Link href="/user" className={styles.headerBtn}>ユーザ一覧</Link>
                <Link href="/device" className={styles.headerBtn}>機器一覧</Link>
                <Link href="/over" className={styles.headerBtn}>延滞者一覧</Link>
                <Link href="/rental" className={styles.headerBtn}>貸出登録</Link>
                <Link href="/return" className={styles.headerBtn}>返却登録</Link>
                
                <span className={styles.loginInfo}>
                    権限：{loginUser.authority}  氏名：{loginUser.name}
                </span>
                <button className={styles.logoutButton} onClick={Logout}>
                    ログアウト
                </button>
            </div>
        </header>
    );
}
