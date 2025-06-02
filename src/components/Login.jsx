'use client'

import { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { axiosInstance } from '../lib/axios';
import { useRouter } from 'next/navigation';
import styles from '../styles/Login.css';

export default function Login() {
    const [employee, setEmployee] = useState("");
    const [password, setPass] = useState("");
    const [message, setMessage] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'pastPage']);
    const router = useRouter();

    function handleClick() {
        let data = {
            employee_no: employee,
            password: password
        };

        axiosInstance.post("/login", data)
        .then(res => {
            if (res.status === 200) {
                setMessage("ログイン完了");
                let page = cookies.pastPage || "/home";
                setCookie("token", res.data);
                removeCookie("pastPage");
            } else {
                setMessage("社員番号またはパスワードが違います");
                setEmployee("");
                setPass("");
            }
        })
        .catch(() => {
            setMessage("社員番号またはパスワードが違います");
        });
    }

    useEffect(() => {
        if (cookies.token) {
            router.push("/");
        }
    }, [cookies.token]);

    return (
        <main>
            <div className='Card-Wrapper'>
                <p>ログイン</p>
                <p>{message}</p>
                <input
                    type='text'
                    onChange={event => setEmployee(event.target.value)}
                    className='TextBox-Warpper'
                    placeholder='社員番号'
                    value={employee}
                />
                <input
                    type='password'
                    onChange={event => setPass(event.target.value)}
                    className='TextBox-Warpper'
                    placeholder='パスワード'
                    value={password}
                />
                <button className="Login-Wrapper" onClick={handleClick}>ログイン</button>
            </div>
        </main>
    );
}
