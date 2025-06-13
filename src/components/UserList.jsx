'use client';

import { useEffect, useState, useRef } from 'react';
import Header from './Header';
import UserFormModal from './UserFormModal';
import UserDetailModal from './UserDetailModal';
import UserTable from './UserTable';
import styles from '../styles/UserList.module.css';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '../lib/axios';
import BackButton from './BackButton';

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasMounted, setHasMounted] = useState(false);
    const [detailUser, setDetailUser] = useState(null);
    const [serchText, setSerchText] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [editUser, setEditUser] = useState({});
    const [editError, setEditError] = useState('');

    const handleSearch = () => {
        if (serchText.trim() === '') {
            setFilteredUsers(null);
        } else {
            const filtered = users.filter(user =>
                Object.values(user).some(value =>
                String(value).toLowerCase().includes(serchText.toLowerCase())
                )
            );
            setFilteredUsers(filtered);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setNewUser({
            employee_no: '',
            name: '',
            name_kana: '',
            department: '',
            tel_no: '',
            mail_address: '',
            age: '',
            gender: '',
            position: '',
            account_level: '',
            password: '',
        });
    };

    const router = useRouter();

    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const hamburgerRef = useRef(null);

    const genderOptions = ['男性', '女性', 'その他'];
    const accountLevelOptions = ['利用者', '管理者'];
    const [showForm , setShowForm] = useState(false);

    const [newUser, setNewUser] = useState({
        employee_no: '',
        name: '',
        name_kana: '',
        department: '',
        tel_no: '',
        mail_address: '',
        age: '',
        gender: '',
        position: '',
        account_level: '',
        password: '',
    });

    const [submitMessage, setSubmitMessage] = useState('');

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        axiosInstance.get('/user')
        .then(res => {
            console.log('ユーザデータ:', res.data);
            setUsers(res.data);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setError('データ取得失敗');
            setLoading(false);
        });
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

    

    useEffect(() => {
        if (detailUser) {
        setEditUser({
            ...detailUser,
            gender: typeof detailUser.gender === 'number'
            ? (detailUser.gender === 0 ? '男性' : detailUser.gender === 1 ? '女性' : 'その他')
            : detailUser.gender
        });
            setEditMode(false);
            setEditError('');
        }
    }, [detailUser]);

    const handleDelete = async () => {
        try {
        await axiosInstance.delete(`/user/${detailUser.employee_no}`);
            setUsers(users.filter(u => u.employee_no !== detailUser.employee_no));
            setDetailUser(null);
        } catch (err) {
            setEditError('削除に失敗しました');
        }
    };

    const handleUpdate = async () => {
        try {
            const payload = {
                ...editUser,
                age: parseInt(editUser.age, 10),
                gender: editUser.gender === '男性' ? 0 : editUser.gender === '女性' ? 1 : 2,
            };

            delete payload.register_date;
            delete payload.update_date;

            console.log(payload); 
            const res = await axiosInstance.put(`/user/${detailUser.employee_no}`, payload);

            setUsers(users.map(u => u.employee_no === detailUser.employee_no ? { ...u, ...res.data } : u));
            setDetailUser({ ...detailUser, ...res.data });
            setEditMode(false);
            setEditError('');
        } catch (err) {
            setEditError('更新に失敗しました');
        }
    };
    
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...newUser,
            delete_flag: false,
        };
        
        if (newUser.account_level !== '管理者') {
            payload.password = 'dummy'; 
        }

        console.log(payload)

        try {
        const {
            register_date,
            update_date,
            ...payloadRaw
        } = newUser;

        const payload = {
            ...payloadRaw,
            age: parseInt(payloadRaw.age, 10),
            gender: payloadRaw.gender === '男性' ? 0 : payloadRaw.gender === '女性' ? 1 : 2,
            delete_flag: false,
        };

        const res = await axiosInstance.post('/user', payload);
        setSubmitMessage('ユーザ登録に成功しました！');
        setUsers(prev => [...prev, res.data]);
        setNewUser({
            employee_no: '',
            name: '',
            name_kana: '',
            department: '',
            tel_no: '',
            mail_address: '',
            age: '',
            gender: '',
            position: '',
            account_level: '',
            password: '',
        });
        } catch (err) {
            console.error(err);
            setSubmitMessage('ユーザ登録に失敗しました。');
        }
    };


    if (!hasMounted) return null;
    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    return (
        <>
            <Header styles={styles} />

            <div className={styles.container}>
                <div className={styles.listWrapper}>
                    <div className={styles.headerRow}>
                        <h1>ユーザリスト</h1>
                        <div className={styles.searchBoxWrapper}>
                            <input
                                className={styles.searchInput}
                                type="text"
                                placeholder="検索"
                                value={serchText}
                                onChange={(e) => {
                                setSerchText(e.target.value);
                                    if (e.target.value.trim() === '') {
                                        setFilteredUsers(null); 
                                    }
                                }}
                            />
                            <button className={styles.searchBtn} onClick={handleSearch}>検索</button>
                        </div>
                    </div>
                
                    <div className={styles.listContent}>
                        <UserTable
                            users={filteredUsers ?? users}
                            onDetail={setDetailUser}
                            styles={styles}
                        />
                    </div>
                </div>
                <div className={styles.buttonGroup}>
                    <button className={styles.btn} onClick={() => setShowForm(true)}>
                        新規登録
                    </button>
                    <BackButton className={`${styles.btn} ${styles.secondary}`} to="/home">
                        戻る
                    </BackButton>
                </div>

                {detailUser && (
                    <UserDetailModal
                        show={!!detailUser}
                        detailUser={detailUser}
                        editMode={editMode}
                        editUser={editUser}
                        setEditUser={setEditUser}
                        setEditMode={setEditMode}
                        setDetailUser={setDetailUser}
                        handleDelete={handleDelete}
                        handleUpdate={handleUpdate}
                        handleClose={() => { setDetailUser(null); setEditMode(false); }}
                        genderOptions={genderOptions}
                        accountLevelOptions={accountLevelOptions}
                        editError={editError}
                        styles={styles}
                    />
                )}

                {showForm && (
                    <UserFormModal
                        show={showForm}
                        newUser={newUser}
                        handleInputChange={handleInputChange}
                        handleSubmit={handleSubmit}
                        handleCloseForm={handleCloseForm}
                        genderOptions={genderOptions}
                        accountLevelOptions={accountLevelOptions}
                        styles={styles}
                    />
                )}
            </div>
        </>
    );
}
