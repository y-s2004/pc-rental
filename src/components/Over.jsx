import { useState, useEffect, useRef } from 'react';
import Header from './Header';
import OverTable from './OverTable';
import styles from '../styles/OverList.module.css';
import { axiosInstance } from '../lib/axios';
import BackButton from './BackButton';

export default function Over() {
    const [overList, setOverList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const hamburgerRef = useRef(null);

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

    return (
        <>
            <Header styles={styles} />

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
                            <OverTable filteredList={filteredList} styles={styles} />
                        )}
                    </div>
                </div>
                
                <div className={styles.backButtonWrapper}>
                    <BackButton className={styles.backButton} to="/home">
                        戻る
                    </BackButton>
                </div>
            </div>
        </>
    );
}