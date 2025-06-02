'use client'

import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import DeviceList from '@/components/DeviceList';

export default function Device() {
    const [cookies] = useCookies(['token']);
    const router = useRouter();

    useEffect(() => {
        if(!cookies.token){
            router.replace('/login');
        }
    }, [cookies, router]);

    if(!cookies.token) return null;

    return <DeviceList />;
}