import { useState, useEffect, useRef } from 'react';
import OverTable from './OverTable';
import styles from '../styles/OverList.module.css';
import { axiosInstance } from '../lib/axios';
import BackButton from './BackButton';

export default function Over() {
    const [overList, setOverList] = useState([]);
    const [filteredList, setFilteredList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const hamburgerRef = useRef(null);

    useEffect(() => {
        function ClickOutside(event) {
            if (
                dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                hamburgerRef.current && !hamburgerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener('mousedown', ClickOutside);
        } else {
            document.removeEventListener('mousedown', ClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', ClickOutside);
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

    return (
        <>
            <div className={styles.container}>
                <div className={styles.listWrapper}>
                    <div className={styles.headerRow}>
                        <h1>延滞者一覧</h1>
                    </div>
                    <div className={styles.listContent}>
                        {loading && <p>読み込み中...</p>}
                        {error && <p>{error}</p>}
                        {!loading && !error && (
                            <OverTable filteredList={filteredList} styles={styles} />
                        )}
                    </div>
                </div>

                <div className={styles.cardList}>
                    {(filteredList ?? List).map(item => (
                        <div className={styles.listWrapper2} key={item.id || item.asset_num}>
                            <div className={styles.useCard}>
                                <span className={styles.label}>資産番号：</span>
                                <span className={styles.badge}>{item.asset_num}</span>
                            </div>
                            <div className={styles.useCard}>
                                <span className={styles.label}>社員番号：</span>
                                <span className={styles.badge}>{item.user_no}</span>
                            </div>
                            <div className={styles.useCard}>
                                <span className={styles.label}>社員名：</span>
                                <span className={styles.badge}>{item.name}</span>
                            </div>
                            <div className={styles.useCard}>
                                <span className={styles.label}>返却期限日：</span>
                                <span className={styles.badge2}>{item.return_date ? item.return_date.replace(/-/g, "/").slice(0, 10) : ''}</span>
                            </div>
                        </div>
                    ))}
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