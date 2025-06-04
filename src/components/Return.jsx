'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import styles from '../styles/Return.module.css';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { axiosInstance } from '../lib/axios';

export default function ReturnDeviceList() {
    const [devices, setDevices] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filteredDevices, setFilteredDevices] = useState(null);
    const [returnMessage, setReturnMessage] = useState('');
    const [showModal, setShowModal] = useState(false); 
    const [cookies, setCookie, removeCookie] = useCookies(['token']); 
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const hamburgerRef = useRef(null);
    const router = useRouter();

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

    const handleSearch = () => {
        if (searchText.trim() === '') {
        setFilteredDevices(null);
        } else {
        setFilteredDevices(
            devices.filter(device =>
            device.asset_num.includes(searchText) ||
            device.user_no.includes(searchText) ||
            device.name.includes(searchText)
            )
        );
        }
    };

    const handleReturn = async (device) => {
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
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>
          <span className={styles.title}>PC返却システム</span>
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
              <h1>貸出中のデバイス</h1>
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
                    <th>社員番号</th>
                    <th>社員名</th>
                    <th>貸出日</th>
                    <th>返却期限</th>
                    <th>返却</th>
                  </tr>
                </thead>
                <tbody>
                  {(filteredDevices ?? devices).map(device => (
                    <tr key={device.asset_num}>
                      <td>{device.asset_num}</td>
                      <td>{device.user_no}</td>
                      <td>{device.name}</td>
                      <td>{formatDate(device.rental_date)}</td>
                      <td>{formatDate(device.return_date)}</td>
                      <td>
                        <button
                          className={`${styles.rentalBtn}`}
                          onClick={() => handleReturn(device)}
                        >
                          返却
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
        </div>
      </>
    );
}
