'use client';

import { useState, useEffect, useRef } from "react";
import Link from 'next/link';
import styles from '../styles/DeviceList.module.css';
import { axiosInstance } from '../lib/axios';

export default function DeviceList(){
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const hamburgerRef = useRef(null);

    useEffect(()=> {
        axiosInstance.get('/device')
            .then(res => {
                setDevices(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('データ取得失敗');
                setLoading(false);
            });
    } ,[]);


    useEffect(() => {
        function handleClickOutside(event){
            if(
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                hamburgerRef.current &&
                !hamburgerRef.current.contains(event.target)
            ){
                setOpen(false);
            }
        }

        if(open){
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [open]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{ error }</p>

    return (
        <>
            <header className={ styles.header }>
                <button
                    className = { styles.hamburger }
                    aria-label = "メニュー"
                    onClick = {() => setOpen(!open)}
                    ref = {hamburgerRef}
                >
                    <span className = { styles.bar } />
                    <span className = { styles.bar } />
                    <span className = { styles.bar } />
                </button>

                <span className = { styles.title}>PC貸出システム</span>

                {open && (
                    <nav className = {styles.dropdown} ref = {dropdownRef} >
                        <Link href = "/" onClick = {() => setOpen(false)}>メインメニュー</Link>
                        <Link href = "/device" onClick = {() => setOpen(false)}>機器リスト</Link>
                        <Link href = "/user" onClick = {() => setOpen(false)}>ユーザリスト</Link>
                        <Link href = "/rental" onClick = {() => setOpen(false)}>貸出</Link>
                        <Link href = "/return" onClick = {() => setOpen(false)}>返却</Link>
                        <Link href = "/over" onClick = {() => setOpen(false)}>延滞者リスト</Link>
                    </nav>
                )}
            </header>
            <div className = {styles.container}>
                <h1>機器リスト</h1>
                <table className = {styles.table}>
                    <thead>
                        <tr>
                            <th>資産番号</th>
                            <th>メーカー</th>
                            <th>OS</th>
                            <th>メモリ</th>
                            <th>容量</th>
                            <th>備考</th>
                        </tr>
                    </thead>
                    <tbody>
                        {devices.map(device => (
                            <tr key = {device.asset_num}>
                                <td>{device.asset_num}</td>
                                <td>{device.maker}</td>
                                <td>{device.os}</td>
                                <td>{device.memory}</td>
                                <td>{device.disc_capacity}</td>
                                <td>{device.remarks}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

}
