'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import styles from '../styles/UserList.module.css'; 
import { useRouter } from 'next/navigation';
import { axiosInstance } from '../lib/axios';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);
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
    gender: payloadRaw.gender === '男性' ? 0 : 1,
    delete_flag: false,
  };

  console.log('送信データ:', JSON.stringify(payload, null, 2));

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
      <header className={styles.header}>
        <button
          className={styles.hamburger}
          aria-label="メニュー"
          onClick={() => setOpen(!open)}
          ref={hamburgerRef}
        >
          <span className={styles.bar} />
          <span className={styles.bar} />
          <span className={styles.bar} />
        </button>

        <span className={styles.title}>PC貸出システム</span>

        {open && (
          <nav className={styles.dropdown} ref={dropdownRef}>
            <Link href="/" onClick={() => setOpen(false)}>メインメニュー</Link>
            <Link href="/device" onClick={() => setOpen(false)}>機器リスト</Link>
            <Link href="/user" onClick={() => setOpen(false)}>ユーザリスト</Link>
            <Link href="/rental" onClick={() => setOpen(false)}>貸出</Link>
            <Link href="/return" onClick={() => setOpen(false)}>返却</Link>
            <Link href="/late" onClick={() => setOpen(false)}>延滞者リスト</Link>
          </nav>
        )}
      </header>

      <div className={styles.container}>
        <div className={styles.listWrapper}>
          <h1>ユーザリスト</h1>

          

          <table className={styles.table}>
            <thead>
              <tr>
                <th>社員番号</th>
                <th>名前</th>
                <th>部署</th>
                <th>役職</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.employee_no}>
                  <td>{user.employee_no}</td>
                  <td>{user.name}</td>
                  <td>{user.department}</td>
                  <td>{user.position}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          <div className={styles.buttonGroup}>
              <button className={styles.btn} onClick={() => setShowForm(true)}>新規登録</button>
              <button className={styles.btn} onClick={() => router.push('/home')}>戻る</button>
          </div>
            
            {showForm && (
              <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
                <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                  <h2>新規ユーザ登録</h2>
                    <form onSubmit={handleSubmit} className={styles.form}>
                      <input
                        name="employee_no"
                        placeholder="社員番号"
                        value={newUser.employee_no}
                        onChange={handleInputChange}
                        required
                      />
                      <input
                        name="name"
                        placeholder="名前"
                        value={newUser.name}
                        onChange={handleInputChange}
                        required
                      />
                      <input
                        name="name_kana"
                        placeholder="名前カナ"
                        value={newUser.name_kana}
                        onChange={handleInputChange}
                      />
                      <input
                        name="department"
                        placeholder="部署"
                        value={newUser.department}
                        onChange={handleInputChange}
                      />
                      <input
                        name="tel_no"
                        placeholder="電話番号"
                        value={newUser.tel_no}
                        onChange={handleInputChange}
                      />
                      <input
                        name="mail_address"
                        placeholder="メールアドレス"
                        value={newUser.mail_address}
                        onChange={handleInputChange}
                      />
                      <input
                        name="age"
                        type="number"
                        placeholder="年齢"
                        value={newUser.age}
                        onChange={handleInputChange}
                      />
                      <input
                        name="position"
                        placeholder="役職"
                        value={newUser.position}
                        onChange={handleInputChange}
                      />

                      <select
                        name="gender"
                        value={newUser.gender}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">性別を選択</option>
                        {genderOptions.map(g => (
                          <option key={g} value={g}>{g}</option>
                        ))}
                      </select>

                      <select
                        name="account_level"
                        value={newUser.account_level}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">アカウントレベルを選択</option>
                        {accountLevelOptions.map(level => (
                          <option key={level} value={level}>{level}</option>
                        ))}
                      </select>

                      {newUser.account_level === '管理者' && (
                        <input
                          name="password"
                          type="password"
                          placeholder="パスワード"
                          value={newUser.password}
                          onChange={handleInputChange}
                          required
                        />
                      )}

                      <button type="submit">登録</button>
                      <button type="button" onClick={() => setShowForm(false)}>キャンセル</button>
                    </form>
                  {submitMessage && <p>{submitMessage}</p>}
                </div>
              </div>
          )}
      </div>
    </>
  );
}
