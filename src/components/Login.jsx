'use client'

import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { axiosInstance } from '../lib/axios';
import { useRouter } from 'next/navigation';
import styles from '../styles/Login.module.css';

export default function Login() {
    const [employee, setEmployee] = useState("");
    const [password, setPass] = useState("");
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'pastPage']);
    const router = useRouter();

    function Click() {
        let data = {
            employee_no: employee,
            password: password
        };

        axiosInstance.post("/login", data)
        .then(res => {
            if (res.status === 200) {
                console.log("ログイン成功", res);
                const user = res.data.user;
                    localStorage.setItem('loginUser', JSON.stringify({
                    authority: user.authority,
                    name: user.name
                }));

                setMessage("ログイン完了");
                let page = cookies.pastPage || "/home";
                setCookie("token", res.data);
                removeCookie("pastPage");
                setShowModal(true); 

                setTimeout(() => {
                    setShowModal(false);
                    router.push(page);
                }, 1000);
            } else {
                setMessage("社員番号またはパスワードが違います");
                setEmployee("");
                setPass("");
                setShowModal(true);
            }
        })
        .catch(() => {
            setMessage("社員番号またはパスワードが違います");
            setShowModal(true); 
        });
    }

    function KeyDown(e) {
        if (e.key === 'Enter') {
            Click();
        }
    }

    return (
        <main className={styles.main}>
            <div className={styles.cardWrapper}>
                <h1 className={styles.title}>ログイン</h1>
                <input
                    type='text'
                    onChange={event => setEmployee(event.target.value)}
                    className={styles.textBox}
                    placeholder='社員番号'
                    value={employee}
                    onKeyDown={KeyDown}
                />
                <input
                    type='password'
                    onChange={event => setPass(event.target.value)}
                    className={styles.textBox}
                    placeholder='パスワード'
                    value={password}
                    onKeyDown={KeyDown}
                />
                <button className={styles.loginButton} onClick={Click}>ログイン</button>
            </div>

            {showModal && (
                <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <p>{message}</p>
                        <button
                            className={styles.closeButton}
                            onClick={() => setShowModal(false)}
                        >
                            閉じる
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}