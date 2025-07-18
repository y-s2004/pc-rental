'use client';

import { useEffect, useState, useRef } from 'react';
import DeviceTable from './DeviceTable';
import DeviceDetail from './DeviceDetail';
import DeviceForm from './DeviceForm';
import styles from '../styles/DeviceList.module.css';
import emptyDevice from './Constants';
import { axiosInstance } from '../lib/axios';
import BackButton from './BackButton';

export default function DeviceList() {
    const [devices, setDevices] = useState([]);
    const [filteredDevices, setFilteredDevices] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMounted, setHasMounted] = useState(false);
    const [detailDevice, setDetailDevice] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [editDevice, setEditDevice] = useState({});
    const [editError, setEditError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState('');
    const Detail = (device) => {
        setDetailDevice(device);
    };
    const [newDevice, setNewDevice] = useState({ ...emptyDevice });
    const [submitMessage, setSubmitMessage] = useState('');

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        axiosInstance.get('/device')
        .then(res => {
            setDevices(res.data);
            setLoading(false);
        })
        .catch(err => {
            setError('データ取得失敗');
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (detailDevice) {
            setEditDevice({ ...detailDevice });
            setEditMode(false);
            setEditError('');
        }
    }, [detailDevice]);

    const CloseForm = () => {
        setShowForm(false);
        setNewDevice({ ...emptyDevice })
    };

    const Delete = async () => {
        try {
            await axiosInstance.delete(`/device/${detailDevice.asset_num}`);
            setDevices(devices.filter(d => d.asset_num !== detailDevice.asset_num));
            setDetailDevice(null);
        } catch (err) {
            setEditError('削除に失敗しました');
        }
    };

    const Update = async () => {
        try {
            const now = new Date();
            const timeString = now.toTimeString().split(' ')[0];
            const dateString = now.toISOString().split('T')[0]; 

            const payload = {
                ...editDevice,
                disc_capacity: editDevice.disc_capacity,
                inventory_date: editDevice.inventory_date
                    ? `${editDevice.inventory_date}`
                    : null,
                update_date: `${dateString}T${timeString}`,
            };

            console.log('送信データ:', payload);
            const res = await axiosInstance.put(`/device/${detailDevice.asset_num}`, payload);
            setDevices(devices.map(d => d.asset_num === detailDevice.asset_num ? { ...d, ...res.data } : d));
            setDetailDevice({ ...detailDevice, ...res.data });
            setEditMode(false);
            setEditError('');
        } catch (err) {
            console.error('更新エラー:', err.response?.data || err.message);
            setEditError('更新に失敗しました');
        }
    };

    const InputChange = (e) => {
        const { name, value } = e.target;
        setNewDevice(prev => ({ ...prev, [name]: value }));
    };

    const Submit = async (e) => {
            e.preventDefault();

             if (devices.some(d => d.asset_num === newDevice.asset_num)) {
                setErrorModalMessage('同じ資産番号の機器が既に存在します。');
                setShowErrorModal(true);
                return;
            }

            try {
                const now = new Date();
                const timeString = now.toTimeString().split(' ')[0]; 
                const dateString = now.toISOString().split('T')[0];

                const formatDateTime = (date) => {
                    if (!date) return null;
                    return date.includes('T') ? date : `${date}T00:00:00`;
                };

                const payload = {
                    ...newDevice,
                    breakdown: false, 
                    rental_start: formatDateTime(newDevice.rental_start),
                    rental_deadline: formatDateTime(newDevice.rental_deadline),
                    inventory_date: formatDateTime(newDevice.inventory_date),
                    update_date: `${dateString}T${timeString}`, 
                };

                const res = await axiosInstance.post('/device', payload);
                setSubmitMessage('機器登録に成功しました！');
                setDevices(prev => [...prev, res.data]);
                setNewDevice({ ...emptyDevice });
                setShowForm(false);
            } catch (err) {
                setSubmitMessage('機器登録に失敗しました。');
            }
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
    
    if (!hasMounted) return null;
    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <>
            <div className={styles.container}>
                <div className={styles.listWrapper}>
                    <div className={styles.headerRow}>
                        <h1 className={styles.title}>機器一覧</h1>
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
                            devices={filteredDevices ?? devices}
                            styles={styles}
                            showRental={false}
                            showDetail={true}
                            onDetail={Detail}
                        />
                    </div>
                </div>
            
                <div className={styles.buttonWrapper}>
                    <div className={styles.buttonRow}>
                        <button className={styles.createBtn} onClick={() => setShowForm(true)}>新規登録</button>
                        <BackButton className={styles.backBtn} to="/home">戻る</BackButton>
                    </div>
                </div>
    
                <div className={styles.actionRow}>
                    <div className={styles.createBtnWrapper}>
                        <button className={styles.createBtn2} onClick={() => setShowForm(true)}>
                            新規登録
                        </button>
                    </div>  
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
                                <span className={styles.label}>OS：</span>
                                <span className={styles.badge}>{device.os}</span>
                            </div>
                            <div className={styles.useCard}>
                                <span className={styles.label}>メモリ：</span>
                                <span className={styles.badge}>{device.memory}</span>
                            </div>
                            <div className={styles.useCard}>
                                <span className={styles.label}>容量：</span>
                                <span className={styles.badge}>{device.disc_capacity}</span>
                            </div>
                            <button className={styles.detailBtn2} onClick={() => setDetailDevice(device)}>詳細</button>
                        </div>
                    ))}
                </div>

                {detailDevice && (
                    <DeviceDetail
                        show={!!detailDevice}
                        detailDevice={detailDevice}
                        editMode={editMode}
                        editDevice={editDevice}
                        setEditDevice={setEditDevice}
                        setEditMode={setEditMode}
                        setDetailDevice={setDetailDevice}
                        handleDelete={Delete}
                        handleUpdate={Update}
                        editError={editError}
                        styles={styles}
                    />
                )}

                {showForm && (
                    <DeviceForm
                        show={showForm}
                        newDevice={newDevice}
                        handleInputChange={InputChange}
                        setNewDevice={setNewDevice}
                        handleSubmit={Submit}
                        handleCloseForm={CloseForm}
                        styles={styles}
                    />
                )}
                
                <div className={styles.backButtonWrapper}>
                    <BackButton className={styles.backButton} to="/home">
                        戻る
                    </BackButton>
                </div>
            </div>

            {submitMessage && (
                <div className={styles.modalOverlay} onClick={() => setSubmitMessage('')}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <p>{submitMessage}</p>
                        <button onClick={() => setSubmitMessage('')} className={styles.formButton}>閉じる</button>
                    </div>
                </div>
            )}
            {showErrorModal && (
                <div className={styles.modalOverlay} onClick={() => setShowErrorModal(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <p style={{ color: 'red' }}>{errorModalMessage}</p>
                        <button onClick={() => setShowErrorModal(false)} className={styles.formButton}>閉じる</button>
                    </div>
                </div>
            )}
        </>
    );
}