import { useRouter } from 'next/navigation';
import { useCookies } from 'react-cookie';

export default function useLogout() {
    const [ , , removeCookie ] = useCookies(['token']);
    const router = useRouter();

    const logout = () => {
        removeCookie('token');
        localStorage.removeItem('authToken');
        sessionStorage.removeItem('authToken');
        router.push('/login');
    };

    return logout;
}