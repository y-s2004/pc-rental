'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import styles from '../styles/Rental.module.css';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '../lib/axios';
import { useCookies } from 'react-cookie';

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
  const [returnMessage, setReturnMessage] = useState('');
  const [cookies, setCookie, removeCookie] = useCookies(['token']); 
  

  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);

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

  const availableDevices = devices.filter(device => !device.rental_status);

  const handleSearch = () => {
    if (searchText.trim() === '') {
      setFilteredDevices(null); 
    } else {
      const filtered = availableDevices.filter(device =>
        Object.values(device).some(value =>
          String(value).toLowerCase().includes(searchText.toLowerCase())
        )
      );
      setFilteredDevices(filtered);
    }
  };

  const handleRental = (device) => {
    setRentalDevice(device);
    setShowRentalForm(true);
    setRentalMessage('');
  };

  const handleRentalSubmit = async (e) => {
    e.preventDefault();
    try {
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
      console.error('エラー詳細:', err.response?.data);
      setRentalMessage('貸出登録に失敗しました。');
    }
  };

  const handleReturn = async (device) => {
    try {
      const payload = {
        user_no: device.user_no,
      };

      const res = await axiosInstance.post(`/rental/${device.asset_num}/return`, payload);

      setDevices(devices.filter(d => d.asset_num !== device.asset_num));

      setReturnMessage(`資産番号 ${device.asset_num} の返却が完了しました！`);
    } catch (err) {
      console.error('返却エラー:', err);
      setReturnMessage(`資産番号 ${device.asset_num} の返却に失敗しました。`);
    }
  };

  if (!hasMounted) return null;
  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  const displayDevices = filteredDevices ?? availableDevices;

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
            <h1>貸出可能なデバイス</h1>
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
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>資産番号</th>
                  <th>メーカー</th>
                  <th>OS</th>
                  <th>メモリ</th>
                  <th>容量</th>
                  <th>備考</th>
                  <th>貸出</th>
                </tr>
              </thead>
              <tbody>
                {displayDevices.map(device => (
                  <tr key={device.asset_num}>
                    <td>{device.asset_num}</td>
                    <td>{device.maker}</td>
                    <td>{device.os}</td>
                    <td>{device.memory}</td>
                    <td>{device.disc_capacity}</td>
                    <td>{device.remarks}</td>
                    <td>
                      <button
                        className={styles.rentalBtn}
                        onClick={() => handleRental(device)}
                      >
                        貸出
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={styles.backButtonWrapper}>
          <button
            className={styles.backButton}
            onClick={() => router.push('/home')}
          >
            戻る
          </button>
        </div>

        {showRentalForm && (
          <div className={styles.modalOverlay} onClick={() => setShowRentalForm(false)}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
              <h2>貸出登録</h2>
              <form onSubmit={handleRentalSubmit} className={styles.form}>
                <div><label>資産番号</label><input value={rentalDevice.asset_num} disabled /></div>
                <div><label>保管場所</label><input value={rentalDevice.place || ''} disabled /></div>
                <div><label>OS</label><input value={rentalDevice.os || ''} disabled /></div>
                <div><label>メーカー</label><input value={rentalDevice.maker || ''} disabled /></div>
                <div>
                  <label>ユーザ番号</label>
                  <input
                    value={rentalDevice.user_no || ''}
                    onChange={e => setRentalDevice({ ...rentalDevice, user_no: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label>名前</label>
                  <input
                    type="text"
                    value={rentalDevice.name || ''}
                    onChange={e => setRentalDevice({ ...rentalDevice, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label>返却予定日</label>
                  <input
                    type="date"
                    value={rentalDevice.return_date || ''}
                    onChange={e => setRentalDevice({ ...rentalDevice, return_date: e.target.value })}
                    required
                  />
                </div>
                <div className={styles.remarksWrapper}>
                  <label>備考</label>
                  <textarea
                    className={styles.remarksInput}
                    value={rentalDevice.remarks || ''}
                    onChange={e => setRentalDevice({ ...rentalDevice, remarks: e.target.value })}
                  />
                </div>
                <div className={styles.buttonGroup}>
                  <button type="submit" className={`${styles.formButton} ${styles.orangeButton}`}>登録</button>
                  <button type="button" className={`${styles.formButton} ${styles.secondaryButton}`} onClick={() => setShowRentalForm(false)}>戻る</button>
                </div>
              </form>
              {rentalMessage && <p>{rentalMessage}</p>}
            </div>
          </div>
        )}

        {returnMessage && <p className={styles.message}>{returnMessage}</p>}
      </div>
    </>
  );
}