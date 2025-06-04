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
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>社員番号</th>
                  <th>名前</th>
                  <th>部署</th>
                  <th>役職</th>
                  <th>詳細</th>
                </tr>
              </thead>
              <tbody>
                {(filteredUsers ?? users).map(user => (
                  <tr key={user.employee_no}>
                    <td>{user.employee_no}</td>
                    <td>{user.name}</td>
                    <td>{user.department}</td>
                    <td>{user.position}</td>
                    <td>
                      <button 
                        className={styles.detailBtn}
                        onClick={() => setDetailUser(user)}
                      >
                        詳細
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className={styles.buttonGroup}>
          <button className={styles.btn} onClick={() => setShowForm(true)}>新規登録</button>
          <button className={`${styles.btn} ${styles.secondary}`} onClick={() => router.push('/home')}>戻る</button>
        </div>

        {detailUser && (
          <div className={styles.modalOverlay} onClick={() => setDetailUser(null)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h2 className={styles.detailTitle}>ユーザ詳細</h2>
              <div className={styles.detailGrid}>
                <div className={styles.detailLabel}>社員番号</div>
                <div className={styles.detailValue}>: {editMode
                  ? <input value={editUser.employee_no} disabled />
                  : detailUser.employee_no}</div>
                <div className={styles.detailLabel}>名前</div>
                <div className={styles.detailValue}>: {editMode
                  ? <input value={editUser.name} onChange={e => setEditUser(u => ({...u, name: e.target.value}))} />
                  : detailUser.name}</div>
                <div className={styles.detailLabel}>名前カナ</div>
                <div className={styles.detailValue}>: {editMode
                  ? <input value={editUser.name_kana} onChange={e => setEditUser(u => ({...u, name_kana: e.target.value}))} />
                  : detailUser.name_kana}</div>
                <div className={styles.detailLabel}>部署</div>
                <div className={styles.detailValue}>: {editMode
                  ? <input value={editUser.department} onChange={e => setEditUser(u => ({...u, department: e.target.value}))} />
                  : detailUser.department}</div>
                <div className={styles.detailLabel}>電話番号</div>
                <div className={styles.detailValue}>: {editMode
                  ? <input value={editUser.tel_no} onChange={e => setEditUser(u => ({...u, tel_no: e.target.value}))} />
                  : detailUser.tel_no}</div>
                <div className={styles.detailLabel}>メールアドレス</div>
                <div className={styles.detailValue}>: {editMode
                  ? <input value={editUser.mail_address} onChange={e => setEditUser(u => ({...u, mail_address: e.target.value}))} />
                  : detailUser.mail_address}</div>
                <div className={styles.detailLabel}>年齢</div>
                <div className={styles.detailValue}>: {editMode
                  ? <input type="number" value={editUser.age} onChange={e => setEditUser(u => ({...u, age: e.target.value}))} />
                  : detailUser.age}</div>
                <div className={styles.detailLabel}>性別</div>
                <div className={styles.detailValue}>: {editMode
                  ? (
                    <select value={editUser.gender} onChange={e => setEditUser(u => ({...u, gender: e.target.value}))}>
                      {genderOptions.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  )
                  : (typeof detailUser.gender === 'number'
                      ? (detailUser.gender === 0 ? '男性' : detailUser.gender === 1 ? '女性' : 'その他')
                      : detailUser.gender)
                }</div>
                <div className={styles.detailLabel}>役職</div>
                <div className={styles.detailValue}>: {editMode
                  ? <input value={editUser.position} onChange={e => setEditUser(u => ({...u, position: e.target.value}))} />
                  : detailUser.position}</div>
                <div className={styles.detailLabel}>アカウントレベル</div>
                <div className={styles.detailValue}>: {editMode
                  ? (
                    <select value={editUser.account_level} onChange={e => setEditUser(u => ({...u, account_level: e.target.value, password: ''}))}>
                      {accountLevelOptions.map(level => <option key={level} value={level}>{level}</option>)}
                    </select>
                  )
                  : detailUser.account_level}
                </div>
                {editMode && editUser.account_level === '管理者' && (
                  <>
                    <div className={styles.detailLabel}>パスワード</div>
                    <div className={styles.detailValue}>: <input
                      type="password"
                      value={editUser.password || ''}
                      onChange={e => setEditUser(u => ({...u, password: e.target.value}))}
                      required
                    /></div>
                  </>
                )}
                <div className={styles.detailLabel}>登録日</div>
                <div className={styles.detailValue}>
                  : {detailUser.register_date
                    ? new Date(detailUser.register_date).toLocaleDateString('ja-JP', {year: 'numeric', month: '2-digit', day: '2-digit'})
                    : ''}
                </div>
                {detailUser.update_date && (
                  <>
                    <div className={styles.detailLabel}>最終更新日</div>
                    <div className={styles.detailValue}>
                      : {new Date(detailUser.update_date).toLocaleDateString('ja-JP', {year: 'numeric', month: '2-digit', day: '2-digit'})}
                    </div>
                  </>
                )}
              </div>
              <div className={styles.detailBtnGroup}>
                <button className={styles.deleteBtn} onClick={handleDelete}>削除</button>
                {editMode ? (
                  <button className={styles.updateBtn} onClick={handleUpdate}>保存</button>
                ) : (
                  <button className={styles.updateBtn} onClick={() => setEditMode(true)}>更新</button>
                )}
                <button className={styles.closeBtn} onClick={() => {
                  setDetailUser(null);
                  setEditMode(false);
                }}>戻る</button>
              </div>
              {editError && <div className={styles.errorMsg}>{editError}</div>}
            </div>
          </div>
        )}

        {showForm && (
          <div className={styles.modalOverlay} onClick={() => setShowForm(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h2>新規ユーザ登録</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                  <label className={styles.formLabel}>社員番号</label>
                  <input
                    name="employee_no"
                    placeholder="社員番号"
                    value={newUser.employee_no}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>名前</label>
                  <input
                    name="name"
                    placeholder="名前"
                    value={newUser.name}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>名前カナ</label>
                  <input
                    name="name_kana"
                    placeholder="名前カナ"
                    value={newUser.name_kana}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>部署</label>
                  <input
                    name="department"
                    placeholder="部署"
                    value={newUser.department}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>電話番号</label>
                  <input
                    name="tel_no"
                    placeholder="電話番号"
                    value={newUser.tel_no}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>メールアドレス</label>
                  <input
                    name="mail_address"
                    placeholder="メールアドレス"
                    value={newUser.mail_address}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>年齢</label>
                  <input
                    name="age"
                    type="number"
                    placeholder="年齢"
                    value={newUser.age}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>役職</label>
                  <input
                    name="position"
                    placeholder="役職"
                    value={newUser.position}
                    onChange={handleInputChange}
                    className={styles.formInput}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>性別</label>
                  <select
                    name="gender"
                    value={newUser.gender}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                  >
                    <option value="">性別を選択</option>
                    {genderOptions.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={styles.formLabel}>アカウントレベル</label>
                  <select
                    name="account_level"
                    value={newUser.account_level}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    required
                  >
                    <option value="">アカウントレベルを選択</option>
                    {accountLevelOptions.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                {newUser.account_level === '管理者' && (
                  <div>
                    <label className={styles.formLabel}>パスワード</label>
                    <input
                      name="password"
                      type="password"
                      placeholder="パスワード"
                      value={newUser.password}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      required
                    />
                  </div>
                )}
                <div className={styles.formButtonGroup}>
                  <button type="submit" className={styles.formButton}>登録</button>
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className={`${styles.formButton} ${styles.secondary}`}
                  >
                    戻る
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
