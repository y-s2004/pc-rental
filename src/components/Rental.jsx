'use client';

import { useEffect, useState, useRef } from 'react';
import Header from './Header';
import DeviceTable from './DeviceTable';
import RentalModal from './RentalModal';
import styles from '../styles/Rental.module.css';
import { axiosInstance } from '../lib/axios';
import BackButton from './BackButton';

export default function DeviceList() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMounted, setHasMounted] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredDevices, setFilteredDevices] = useState(null);
    const [showRentalForm, setShowRentalForm] = useState(false);
    const [rentalDevice, setRentalDevice] = useState(null);
    const [rentalMessage, setRentalMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState('');

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        axiosInstance.get('/device')
        .then(res => {
            setDevices(res.data);
            setLoading(false);
        })
        .catch(() => {
            setError('貸出可能な機器の取得に失敗しました');
            setLoading(false);
        });
    }, []);

    const availableDevices = devices.filter(device => !device.rental_status);

    const Rental = (device) => {
        const today = new Date();
        const returnDate = new Date(today);
        returnDate.setDate(today.getDate() + 90);

        setRentalDevice({
            ...device,
            rental_date: today.toISOString(),
            return_date: returnDate.toISOString(),
        });
        setShowRentalForm(true);
        setRentalMessage('');
    };

    const RentalSubmit = async (e) => {
        e.preventDefault();
        setRentalMessage('');
        try {
            const userRes = await axiosInstance.get(`/user/${rentalDevice.user_no}`);
            if (!userRes.data || !userRes.data.employee_no) {
                setErrorModalMessage('入力された社員番号のユーザが存在しません。');
                setShowErrorModal(true);
                return;
            }

            const payload = {
                asset_num: rentalDevice.asset_num,
                user_no: rentalDevice.user_no,
                rental_date: new Date().toISOString(),
                return_date: new Date(rentalDevice.return_date).toISOString(),
                name: rentalDevice.name,
                place: rentalDevice.place || '',
                rental_status: true, 
                remarks: rentalDevice.remarks || ''
            };

            const res = await axiosInstance.post('/rental', payload);

            setDevices(devices.map(device =>
                device.asset_num === rentalDevice.asset_num
                ? { ...device, rental_status: true }
                : device
            ));

            setRentalMessage('貸出登録が完了しました！');
            setShowRentalForm(false);
        } catch (err) {
            setRentalMessage('貸出登録に失敗しました。');
        }
    };

    const SearchInput = (input) => {
            setSearchText(input);
            if (input.trim() === '') {
                setFilteredDevices(null);
            } else {
                const normalizedInput = input.toLowerCase();
                const filtered = availableDevices.filter(device => {
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

    if (!hasMounted) return null;
    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    const displayDevices = filteredDevices ?? availableDevices;

    return (
        <>
            <Header />

            <div className={styles.container}>
                <div className={styles.listWrapper}>
                    <div className={styles.headerRow}>
                        <h1>貸出登録</h1>
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
                        <DeviceTable
                            devices={displayDevices}
                            styles={styles}
                            showRental={true}
                            showDetail={false}
                            onRental={Rental}
                        />
                    </div>
                </div>

                {showRentalForm && (
                    <RentalModal
                        show={showRentalForm}
                        rentalDevice={rentalDevice}
                        setRentalDevice={setRentalDevice}
                        onSubmit={RentalSubmit}
                        onClose={() => setShowRentalForm(false)}
                        rentalMessage={rentalMessage}
                        styles={styles}
                    />
                )}
                
                <div className={styles.backButtonWrapper}>
                    <BackButton className={styles.backButton} to="/home">
                        戻る
                    </BackButton>
                </div>
            </div>
            {showErrorModal && (
                <div className={styles.modalOverlay} onClick={() => setShowErrorModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <p style={{ color: 'red' }}>{errorModalMessage}</p>
                        <button onClick={() => setShowErrorModal(false)} className={styles.closeBtn}>閉じる</button>
                    </div>
                </div>
            )}
        </>
    );
}