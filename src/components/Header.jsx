import Link from 'next/link';
import useLogout from './Logout';
import styles from '../styles/Header.module.css';
import { useState, useEffect } from 'react';

export default function RentalHeader() {
    const Logout = useLogout();

    const [loginUser, setLoginUser] = useState({ authority: '', name: '' });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('loginUser');
            if (user) {
                setLoginUser(JSON.parse(user));
            }
        }
    }, []);

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
                <span className={styles.loginInfo}>
                    権限：{loginUser.authority} 氏名：{loginUser.name}
                </span>
                <button className={styles.logoutButton} onClick={Logout}>
                    ログアウト
                </button>
            </div>
        </header>
    );
}