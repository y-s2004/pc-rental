'use client';

import { useEffect, useState, useRef } from 'react';
import UserFormModal from './UserFormModal';
import UserDetailModal from './UserDetailModal';
import UserTable from './UserTable';
import styles from '../styles/UserList.module.css';
import { axiosInstance } from '../lib/axios';
import BackButton from './BackButton';
import { gender, accountLevel, emptyUser } from './Constants';

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
    const [submitMessage, setSubmitMessage] = useState('');
    const [editError, setEditError] = useState('');
    const [formError, setFormError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [errorModalMessage, setErrorModalMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const handleCloseForm = () => {
        setShowForm(false);
        setNewUser({...emptyUser});
        setConfirmPassword('');
        setFormError('');
        setConfirmError('');
    };
    const [showForm , setShowForm] = useState(false);
    const [newUser, setNewUser] = useState({ ...emptyUser });

    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        axiosInstance.get('/user')
        .then(res => {
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

             if (!payload.password) {
                delete payload.password;
            }

            delete payload.register_date;
            delete payload.update_date;

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

        if (users.some(u => u.employee_no === newUser.employee_no)) {
            setErrorModalMessage('同じ社員番号のユーザが既に存在します。');
            setShowErrorModal(true);
            return;
        }

        if (newUser.password !== confirmPassword) {
            setErrorModalMessage('パスワードが一致しません。');
            setShowErrorModal(true);
            return;
        }

        const payload = {
            ...newUser,
            delete_flag: false,
        };

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
            setNewUser({ ...emptyUser });
            setShowForm(false);
        } catch (err) {
            console.error(err);
            setSubmitMessage('ユーザ登録に失敗しました。');
        }
    };

    if (!hasMounted) return null;
    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    const handleSearchInput = (input) => {
        setSerchText(input);
        if (input.trim() === '') {
            setFilteredUsers(null);
        } else {
            const normalizedInput = input.toLowerCase();
            const hiraganaInput = toHiragana(normalizedInput);

            const filtered = users.filter(user =>
                Object.entries(user)
                    .filter(([key]) => key !== 'password')
                    .some(([key, value]) => {
                        const strValue = String(value).toLowerCase();
                        if (key === 'name' || key === 'name_kana') {
                            return toHiragana(strValue).includes(hiraganaInput);
                        }
                        return strValue.includes(normalizedInput);
                    })
            );
            setFilteredUsers(filtered);
        }
    };


    function toHiragana(str) {
        return str.replace(/[\u30a1-\u30f6]/g, ch =>
            String.fromCharCode(ch.charCodeAt(0) - 0x60)
        );
    }

    return (
        <>
            <div className={styles.container}>
                <div className={styles.listWrapper}>
                    <div className={styles.headerRow}>
                        <h1 className={styles.title}>ユーザ一覧</h1>
                        <div className={styles.searchBoxWrapper}>
                            <input
                                className={styles.searchInput}
                                type="text"
                                placeholder="検索"
                                value={serchText}
                                onChange={e => handleSearchInput(e.target.value)}
                            />
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
                            value={serchText}
                            onChange={e => handleSearchInput(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.cardList}>
                    {(filteredUsers ?? users).map(user => (
                        <div className={styles.listWrapper2} key={user.employee_no}>
                            <div className={styles.useCard}>
                                <span className={styles.label}>社員番号：</span>
                                <span className={styles.badge}>{user.employee_no}</span>
                            </div>
                            <div className={styles.useCard}>
                                <span className={styles.label}>名前：</span>
                                <span className={styles.badge}>{user.name}</span>
                            </div>
                            <div className={styles.useCard}>
                                <span className={styles.label}>部署：</span>
                                <span className={styles.badge}>{user.department}</span>
                            </div>
                            <div className={styles.useCard}>
                                <span className={styles.label}>役職：</span>
                                <span className={styles.badge}>{user.position}</span>
                            </div>
                            <button className={styles.detailBtn2} onClick={() => setDetailUser(user)}>詳 細</button>
                        </div>
                    ))}
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
                        genderOptions={gender}
                        accountLevelOptions={accountLevel}
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
                        genderOptions={gender}
                        accountLevelOptions={accountLevel}
                        styles={styles}
                        formError={formError}
                        confirmPassword={confirmPassword}
                        setConfirmPassword={setConfirmPassword}
                        confirmError={confirmError}
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
