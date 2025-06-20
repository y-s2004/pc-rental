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