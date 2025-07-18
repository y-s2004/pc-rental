'use client'

import { useEffect, useRef} from 'react';
import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';

export default function SessionTimeout(timeout = 30 * 60 * 1000) {
    const router = useRouter();
    const [cookies, removeCokie] = useCookies(['token']);
    const timeRef = useRef(null);

    const logout = () => {
        removeCokie('token');
        localStorage.removeItem('loginUser');
        router.push('login');
    }

    const resetTimer = () => {
        if(timeRef.current) clearTimeout(timeRef.current);
        timeRef.current = setTimeout(logout, timeout);
    }

    useEffect(() => {
        resetTimer();
        const events = ['click', 'keydown', 'scroll', 'mousemove'];
        events.forEach(event => {window.removeEventListener(events, resetTimer)})

        return () => {
            events.forEach(event => {window.removeEventListener(event, resetTimer)});
            clearTimeout(timeRef.current);
        }
    },[]); 
}