'use client';

import Link from 'next/link';
import styles from '../styles/MainMenu.module.css';
import Header from './Header';

export default function MainMenu() {

    return (
        <>
            <Header />
            <main className={styles.main}>
                <div className={styles.cardWrapper}>
                    <h1 className={styles.menuTitle}>メインメニュー</h1>
                    <div className={styles.row}>
                        <Link href="/rental" className={`${styles.btn} ${styles.red}`}>貸出登録</Link>
                        <Link href="/return" className={`${styles.btn} ${styles.red}`}>返却登録</Link>
                    </div>
                    <div className={styles.row}>
                        <Link href="/user" className={styles.btn2}>ユーザ一覧</Link>
                        <Link href="/device" className={styles.btn2}>機器一覧</Link>
                        <Link href="/over" className={styles.btn2}>延滞者一覧</Link>
                    </div>
                </div>
            </main>
        </>
    );
}