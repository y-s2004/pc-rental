'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
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
  const [cookies, setCookie, removeCookie] = useCookies(['token']); 

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

  const handleLogout = () => {
        removeCookie('token');

        localStorage.removeItem('authToken'); 
        sessionStorage.removeItem('authToken'); 


        console.log('ログアウトしました');
        router.push('/login'); 
  };

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
            <Link href="/over" onClick={() => setOpen(false)}>延滞者リスト</Link>
          </nav>
        )}

        <button className={styles.logoutButton} onClick={handleLogout}>
                ログアウト
        </button>
      </header>

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
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>資産番号</th>
                  <th>メーカー</th>
                  <th>OS</th>
                  <th>メモリ</th>
                  <th>容量</th>
                  <th>備考</th>
                  <th>詳細</th>
                </tr>
              </thead>
              <tbody>
                {(filteredDevices ?? devices).map(device => (
                  <tr key={device.asset_num}>
                    <td>{device.asset_num}</td>
                    <td>{device.maker}</td>
                    <td>{device.os}</td>
                    <td>{device.memory}</td>
                    <td>{device.disc_capacity}</td>
                    <td>{device.remarks}</td>
                    <td>
                      <button
                        className={styles.detailBtn}
                        onClick={() => setDetailDevice(device)}
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
          <button className={styles.btn} onClick={() => setShowForm(true)}>
            新規登録
          </button>
          <button className={`${styles.btn} ${styles.secondary}`} onClick={() => router.push('/home')}>
            戻る
          </button>
        </div>

        {detailDevice && (
            <div className={styles.modalOverlay} onClick={() => setDetailDevice(null)}>
                <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <h2 className={styles.detailTitle}>機器詳細</h2>
                <div className={styles.detailGrid}>
                    <div className={styles.detailLabel}>資産番号</div>
                    <div className={styles.detailValue}>: {editMode
                    ? <input value={editDevice.asset_num} disabled />
                    : detailDevice.asset_num}</div>
                    <div className={styles.detailLabel}>メーカー</div>
                    <div className={styles.detailValue}>: {editMode
                    ? <input value={editDevice.maker} onChange={e => setEditDevice(d => ({...d, maker: e.target.value}))} />
                    : detailDevice.maker}</div>
                    <div className={styles.detailLabel}>OS</div>
                    <div className={styles.detailValue}>: {editMode
                    ? <input value={editDevice.os} onChange={e => setEditDevice(d => ({...d, os: e.target.value}))} />
                    : detailDevice.os}</div>
                    <div className={styles.detailLabel}>メモリ</div>
                    <div className={styles.detailValue}>: {editMode
                    ? <input value={editDevice.memory} onChange={e => setEditDevice(d => ({...d, memory: e.target.value}))} />
                    : detailDevice.memory}</div>
                    <div className={styles.detailLabel}>グラフィックボード</div>
                    <div className={styles.detailValue}>
                        : {editMode ? (
                            <select
                            value={editDevice.graphic_board ? 'true' : 'false'} 
                            onChange={e => setEditDevice(d => ({ ...d, graphic_board: e.target.value === 'true' }))}
                            className={styles.remarksInputSmall}
                            >
                            <option value="true">⭕️</option>
                            <option value="false">❌</option>
                            </select>
                        ) : (
                            detailDevice.graphic_board ? '⭕️' : '❌' 
                        )}
                    </div>
                    <div className={styles.detailLabel}>保管場所</div>
                    <div className={styles.detailValue}>: {editMode
                    ? <input value={editDevice.place || ''} onChange={e => setEditDevice(d => ({...d, place: e.target.value}))} />
                    : detailDevice.place}</div>
                    <div className={styles.detailLabel}>容量</div>
                    <div className={styles.detailValue}>: {editMode
                    ? <input value={editDevice.disc_capacity} onChange={e => setEditDevice(d => ({...d, disc_capacity: e.target.value}))} />
                    : detailDevice.disc_capacity}</div>
                    <div className={styles.detailLabel}>備考</div>
                    <div className={styles.detailValue}>
                        : {editMode ? (
                            <input
                            className={styles.remarksInputSmall} 
                            value={editDevice.remarks || ''}
                            onChange={e => setEditDevice(d => ({ ...d, remarks: e.target.value }))}
                            />
                        ) : (
                            detailDevice.remarks || '' 
                        )}
                    </div>
                    <div className={styles.detailLabel}>棚卸日</div>
                    <div className={styles.detailValue}>
                    : {editMode ? (
                        <input
                            type="date"
                            className={styles.re} 
                            value={editDevice.inventory_date || ''} 
                            onChange={e => setEditDevice(d => ({ ...d, inventory_date: e.target.value }))}
                            />
                    ) : (
                        editDevice.inventory_date
                        ? new Date(editDevice.inventory_date).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })
                        : ''
                    )}
                    </div>
                    <div className={styles.detailLabel}>リース開始日</div>
                    <div className={styles.detailValue}>
                    : {detailDevice.rental_start
                        ? new Date(detailDevice.rental_start).toLocaleDateString('ja-JP', {year: 'numeric', month: '2-digit', day: '2-digit'})
                        : ''}
                    </div>
                    <div className={styles.detailLabel}>リース期限日</div>
                    <div className={styles.detailValue}>
                    : {detailDevice.rental_deadline
                        ? new Date(detailDevice.rental_deadline).toLocaleDateString('ja-JP', {year: 'numeric', month: '2-digit', day: '2-digit'})
                        : ''}
                    </div>
                    <div className={styles.detailLabel}>登録日</div>
                    <div className={styles.detailValue}>: {detailDevice.registration_date
                    ? new Date(detailDevice.registration_date).toLocaleDateString('ja-JP', {year: 'numeric', month: '2-digit', day: '2-digit'})
                    : ''}</div>
                    <div className={styles.detailLabel}>更新日</div>
                    <div className={styles.detailValue}>: {detailDevice.update_date
                    ? new Date(detailDevice.update_date).toLocaleDateString('ja-JP', {year: 'numeric', month: '2-digit', day: '2-digit'})
                    : ''}</div>
                </div>
                <div className={styles.detailBtnGroup}>
                    <button className={styles.deleteBtn} onClick={handleDelete}>削除</button>
                    {editMode ? (
                    <button className={styles.updateBtn} onClick={handleUpdate}>保存</button>
                    ) : (
                    <button className={styles.updateBtn} onClick={() => setEditMode(true)}>更新</button>
                    )}
                    <button className={styles.closeBtn} onClick={() => {
                    setDetailDevice(null);
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
              <h2>新規機器登録</h2>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div>
                  <label className={styles.formLabel}>資産番号</label>
                  <input
                        name="asset_num"
                        placeholder="資産番号"
                        value={newDevice.asset_num}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>メーカー</label>
                  <input
                        name="maker"
                        placeholder="メーカー"
                        value={newDevice.maker}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>OS</label>
                  <input
                        name="os"
                        placeholder="OS"
                        value={newDevice.os}
                        onChange={handleInputChange}
                        className={styles.formInput}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>メモリ</label>
                  <input
                        name="memory"
                        placeholder="メモリ"
                        value={newDevice.memory}
                        onChange={handleInputChange}
                        className={styles.formInput}
                  />
                </div>
                <div>
                  <label className={styles.formLabel}>容量</label>
                  <input
                        name="disc_capacity"
                        placeholder="容量"
                        value={newDevice.disc_capacity}
                        onChange={handleInputChange}
                        className={styles.formInput}
                  />
                </div>
                <div>
                <label>グラフィックボード</label>
                <select
                    name="graphic_board"
                    value={newDevice.graphic_board}
                    onChange={e => setNewDevice({ ...newDevice, graphic_board: e.target.value === 'true' })}
                    className={styles.formInput}
                    required
                >
                    <option value="true">⭕️</option>
                    <option value="false">❌</option>
                </select>
                </div>
                <div>
                    <label>保管場所</label>
                    <input
                        name="place"
                        placeholder="保管場所"
                        value={newDevice.place || ''}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                    />
                </div>
                <div>
                    <label>リース開始日</label>
                    <input
                        type="date"
                        name="rental_start"
                        value={newDevice.rental_start}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                    />
                </div>
                <div>
                <label>リース終了日</label>
                    <input
                        type="date"
                        name="rental_deadline"
                        value={newDevice.rental_deadline}
                        onChange={handleInputChange}
                        className={styles.formInput}
                        required
                    />
                </div>
                <div>
                    <label>棚卸日</label>
                    <input
                        type="date"
                        value={newDevice.inventory_date || ''}
                        onChange={e => setNewDevice({ ...newDevice, inventory_date: e.target.value })}
                        className={styles.inventoryDateInput} 
                        required
                    />
                </div>
                <div className={styles.remarksWrapper}>
                    <label>備考</label>
                    <textarea
                        className={styles.remarksInput}
                        name="remarks"
                        placeholder="備考"
                        value={newDevice.remarks || ''} 
                        onChange={e => setNewDevice({ ...newDevice, remarks: e.target.value })}
                    />
                </div>
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