'use client';

import { useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import Rental from '@/components/Rental';

export default function RentalPage() {
    const [cookies] = useCookies(['token']);
    const router = useRouter();
    
    useEffect(() => {
        if(!cookies.token){
            router.replace('/login');
        }
    }, [cookies, router]);

    if(!cookies.token) return null;

    return <Rental />;
}