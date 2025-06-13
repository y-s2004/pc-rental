'use client';

import { useEffect, useState, useRef } from 'react';
import Header from './Header';
import ReturnTable from './ReturnTable';
import styles from '../styles/Return.module.css';
import { axiosInstance } from '../lib/axios';
import BackButton from './BackButton';

export default function ReturnDeviceList() {
    const [devices, setDevices] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredDevices, setFilteredDevices] = useState(null);
    const [returnMessage, setReturnMessage] = useState('');
    const [showModal, setShowModal] = useState(false); 
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const hamburgerRef = useRef(null);

    useEffect(() => {
        const fetchDevices = async () => {
            try {
                const res = await axiosInstance.get('/rental/rented');
                console.log('APIレスポンス:', res.data);
                if (Array.isArray(res.data)) {
                    setDevices(res.data);
                } else {
                    console.error('APIから配列以外のデータが返されました:', res.data);
                    setDevices([]);
                }
            } catch (err) {
                console.error('デバイス取得エラー:', err);
            }
        };
        fetchDevices();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                hamburgerRef.current &&
                !hamburgerRef.current.contains(event.target)
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

    const handleSearch = () => {
        if (searchText.trim() === '') {
            setFilteredDevices(null);
        } else {
            setFilteredDevices(
                devices.filter(device =>
                    device.asset_num.includes(searchText) ||
                    device.user_no.includes(searchText) ||
                    device.name.includes(searchText)
                )
            );
        }
    };

    const handleReturn = async (device) => {
        try {
            const payload = {
                user_no: device.user_no,
                rental_date: device.rental_date,
                return_date: device.return_date, 
            };

            const res = await axiosInstance.post(`/rental/${device.asset_num}/return`, payload);

            
            setDevices(devices.filter(d => d.asset_num !== device.asset_num));

            setReturnMessage(`資産番号 ${device.asset_num} の返却が完了しました！`);
            setShowModal(true); 

        } catch (err) {
            console.error('返却エラー:', err);
            setReturnMessage(`資産番号 ${device.asset_num} の返却に失敗しました。`);
            setShowModal(true);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}`;
    };
    
    return (
        <>
            <Header styles={styles} />

            <div className={styles.container}>
                <div className={styles.listWrapper}>
                    <div className={styles.headerRow}>
                        <h1>貸出中のデバイス</h1>
                        <div className={styles.searchBoxWrapper}>
                            <input
                                className={styles.searchInput}
                                type="text"
                                placeholder="検索"
                                value={searchText}
                                onChange={e => setSearchText(e.target.value)}
                            />
                            <button className={styles.searchBtn} onClick={handleSearch}>検索</button>
                        </div>
                    </div>
                    <div className={styles.listContent}>
                        <ReturnTable
                            devices={filteredDevices ?? devices}
                            styles={styles}
                            formatDate={formatDate}
                            handleReturn={handleReturn}
                        />
                    </div>
                </div>
    
                {showModal && (
                    <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
                        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <h2>返却結果</h2>
                            <p>{returnMessage}</p>
                            <button
                                className={`${styles.formButton} ${styles.orangeButton}`}
                                onClick={() => setShowModal(false)}
                            >
                                閉じる
                            </button>
                        </div>
                    </div>
                )}

                <div className={styles.backButtonWrapper}>
                    <BackButton className={styles.backButton} to="/home">
                        戻る
                    </BackButton>
                </div>

            </div>
        </>
    );
}
