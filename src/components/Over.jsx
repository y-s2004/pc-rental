'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import  styles from '../styles/Over.module.css';
import { axiosInstance } from '../lib/axios';

export default function Over() {
  const [over, setOver] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    axiosInstance.get('/over')
      .then(res => {
        setOver(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('データ取得失敗');
        setLoading(false);
      });
  }, []);

  if (!hasMounted) return null;

  return (
    <div className={styles.container}>
      <h1>Over</h1>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      <ul>
        {over.map((item) => (
          <li key={item.id}>
            <Link href={`/over/${item.id}`}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}