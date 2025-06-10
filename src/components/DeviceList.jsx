'use client';

import { useEffect, useState, useRef } from 'react';
import Header from './Header';
import DeviceTable from './DeviceTable';
import DeviceDetail from './DeviceDetail';
import DeviceForm from './DeviceForm';
import styles from '../styles/DeviceList.module.css';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '../lib/axios';
import { useCookies } from 'react-cookie';

export default function DeviceList() {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMounted, setHasMounted] = useState(false);
    const [detailDevice, setDetailDevice] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [filteredDevices, setFilteredDevices] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editDevice, setEditDevice] = useState({});
    const [editError, setEditError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const handleDetail = (device) => {
        setDetailDevice(device);
    };

    const router = useRouter();
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const hamburgerRef = useRef(null);

    const [newDevice, setNewDevice] = useState({
        asset_num: '',
        maker: '',
        os: '',
        memory: '',
        disc_capacity: '',
        graphic_board: '',
        place: '',
        rental_start: '',
        rental_deadline: '',
        inventory_date: '',
        remarks: '',
    });

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
        function handleClickOutside(event) {
            if (dropdownRef.current &&
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

    useEffect(() => {
        if (detailDevice) {
            setEditDevice({ ...detailDevice });
            setEditMode(false);
            setEditError('');
        }
    }, [detailDevice]);

    const handleSearch = () => {
        if (searchText.trim() === '') {
            setFilteredDevices(null);
        } else {
            const filtered = devices.filter(device =>
                Object.values(device).some(value =>
                String(value).toLowerCase().includes(searchText.toLowerCase())
                )
            );
            setFilteredDevices(filtered);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setNewDevice({
            asset_num: '',
            maker: '',
            os: '',
            memory: '',
            graphic_board: '',
            place: '',
            rental_start: '',
            rental_deadline: '',
            inventory_date: '',
            disc_capacity: '',
            remarks: '',
        });
    };

    const handleDelete = async () => {
        try {
            await axiosInstance.delete(`/device/${detailDevice.asset_num}`);
            setDevices(devices.filter(d => d.asset_num !== detailDevice.asset_num));
            setDetailDevice(null);
        } catch (err) {
            setEditError('削除に失敗しました');
        }
    };

    const handleUpdate = async () => {
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDevice(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
            e.preventDefault();
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
                setNewDevice({
                    asset_num: '',
                    maker: '',
                    os: '',
                    memory: '',
                    disc_capacity: '',
                    graphic_board: '',
                    place: '',
                    rental_start: '',
                    rental_deadline: '',
                    inventory_date: '',
                    remarks: '',
                });
                setShowForm(false);
            } catch (err) {
                setSubmitMessage('機器登録に失敗しました。');
            }
        };

    if (!hasMounted) return null;
    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <>
            <Header
                open={open}
                setOpen={setOpen}
                hamburgerRef={hamburgerRef}
                dropdownRef={dropdownRef}
                styles={styles}
            />

            <div className={styles.container}>
                <div className={styles.listWrapper}>
                    <div className={styles.headerRow}>
                        <h1>デバイスリスト</h1>
                        <div className={styles.searchBoxWrapper}>
                            <input
                                className={styles.searchInput}
                                type="text"
                                placeholder="検索"
                                value={searchText}
                                onChange={e => {
                                    setSearchText(e.target.value);
                                    if (e.target.value.trim() === '') setFilteredDevices(null);
                                }}
                            />
                            <button className={styles.searchBtn} onClick={handleSearch}>検索</button>
                        </div>
                    </div>
                <div className={styles.listContent}>
                    <DeviceTable
                    devices={devices}
                    styles={styles}
                    showRental={false}
                    showDetail={true}
                    onDetail={handleDetail}
                    />
                </div>
                </div>
                <div className={styles.buttonGroup}>
                    <button className={styles.btn} onClick={() => setShowForm(true)}>
                        新規登録
                    </button>
                    <button className={`${styles.btn} ${styles.secondary}`} onClick={() => router.push('/home')}>
                        戻る
                    </button>
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
                        handleDelete={handleDelete}
                        handleUpdate={handleUpdate}
                        editError={editError}
                        styles={styles}
                    />
                )}

                {showForm && (
                    <DeviceForm
                        show={showForm}
                        newDevice={newDevice}
                        handleInputChange={handleInputChange}
                        setNewDevice={setNewDevice}
                        handleSubmit={handleSubmit}
                        handleCloseForm={handleCloseForm}
                        styles={styles}
                    />
                )}
            </div>
        </>
    );
}