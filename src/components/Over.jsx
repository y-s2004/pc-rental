import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from '../styles/OverList.module.css';
import { axiosInstance } from '../lib/axios';
import { useRouter } from 'next/navigation';

export default function Over() {
  const [overList, setOverList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const hamburgerRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current && !dropdownRef.current.contains(event.target) &&
        hamburgerRef.current && !hamburgerRef.current.contains(event.target)
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
    const today = new Date().toISOString().slice(0, 10);
    axiosInstance.get('/rental/over')
      .then(res => {
        const filtered = res.data.filter(item =>
          item.return_date < today && item.rental_status === true
        );
        setOverList(filtered);
        setFilteredList(filtered);
        setLoading(false);
      })
      .catch(err => {
        setError('データ取得失敗');
        setLoading(false);
      });
  }, []);

  const handleSearch = () => {
    if (!searchText) {
      setFilteredList(overList);
      return;
    }
    const lower = searchText.toLowerCase();
    setFilteredList(
      overList.filter(item =>
        (item.asset_num && item.asset_num.toLowerCase().includes(lower)) ||
        (item.user_no && item.user_no.toLowerCase().includes(lower)) ||
        (item.name && item.name.toLowerCase().includes(lower)) ||
        (item.remarks && item.remarks.toLowerCase().includes(lower))
      )
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // --- ここからJSX ---
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
        <button className={styles.logoutButton} onClick={() => router.push('/login')}>
          ログアウト
        </button>
      </header>

      


      <div className={styles.container}>
        <div className={styles.listWrapper}>
          <div className={styles.headerRow}>
            <h1>延滞者リスト</h1>
            <div className={styles.searchBoxWrapper}>
              <input
                className={styles.searchInput}
                type="text"
                placeholder="検索"
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className={styles.searchBtn} onClick={handleSearch}>検索</button>
            </div>
          </div>
          <div className={styles.listContent}>
            {loading && <p>読み込み中...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>資産番号</th>
                    <th>ユーザ番号</th>
                    <th>名前</th>
                    <th>返却予定日</th>
                    <th>備考</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.length === 0 ? (
                    <tr>
                      <td colSpan={5} style={{ textAlign: "center" }}>延滞中の貸出はありません</td>
                    </tr>
                  ) : (
                    filteredList.map(item => (
                      <tr key={item.id || item.asset_num}>
                        <td>{item.asset_num}</td>
                        <td>{item.user_no}</td>
                        <td>{item.name}</td>
                        <td className={styles.redText}>
                          {item.return_date ? item.return_date.replace(/-/g, "/").slice(0, 10) : ''}
                        </td>
                        <td>{item.remarks}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
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
      </div>
    </>
  );
}