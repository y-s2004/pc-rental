'use client';

import { useEffect, useState } from 'react';
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

    const Return = async (device) => {
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

    const SearchInput = (input) => {
        setSearchText(input);
        if (input.trim() === '') {
            setFilteredDevices(null);
        } else {
            const normalizedInput = input.toLowerCase();
            const filtered = devices.filter(device => {
                const assetNum = String(device.asset_num || '').toLowerCase();
                const maker = String(device.maker || '').toLowerCase();
                const os = String(device.os || '').toLowerCase();
                return (
                    assetNum.includes(normalizedInput) ||
                    maker.includes(normalizedInput) ||
                    os.includes(normalizedInput)
                );
            });
            setFilteredDevices(filtered);
        }
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.listWrapper}>
                    <div className={styles.headerRow}>
                        <h1>返却登録</h1>
                        <div className={styles.searchBoxWrapper}>
                            <input
                                className={styles.searchInput}
                                type="text"
                                placeholder="検索"
                                value={searchText}
                                onChange={e => SearchInput(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.listContent}>
                        <ReturnTable
                            devices={filteredDevices ?? devices}
                            styles={styles}
                            formatDate={formatDate}
                            handleReturn={Return}
                        />
                    </div>
                </div>

                <div className={styles.actionRow}>
                    <div className={styles.searchBoxWrapper2}>
                        <input
                            className={styles.searchInput2}
                            type="text"
                            placeholder="検索"
                            value={searchText}
                            onChange={e => SearchInput(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.cardList}>
                    {(filteredDevices ?? devices).map(device => (
                        <div className={styles.listWrapper2} key={device.asset_num}>
                            <div className={styles.useCard}>
                                <span className={styles.label}>資産番号：</span>
                                <span className={styles.badge}>{device.asset_num}</span>
                            </div>
                            <div className={styles.useCard}>
                                <span className={styles.label}>社員番号：</span>
                                <span className={styles.badge}>{device.user_no}</span>
                            </div>
                            <div className={styles.useCard}>
                                <span className={styles.label}>社員名：</span>
                                <span className={styles.badge}>{device.name}</span>
                            </div>
                            <div className={styles.useCard}>
                                <span className={styles.label}>貸出日：</span>
                                <span className={styles.badge}>{formatDate(device.rental_date)}</span>
                            </div>
                            <div className={styles.useCard}>
                                <span className={styles.label}>返却期限日：</span>
                                <span className={styles.badge}>{formatDate(device.return_date)}</span>
                            </div>
                            <button className={styles.detailBtn2} onClick={() => Return(device)}>返却</button>
                        </div>
                    ))}
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
