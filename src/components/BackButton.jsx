import { useRouter } from 'next/navigation';

export default function BackButton({ to = '/home', children = '戻る', className = '' }) {
    const router = useRouter();
    return (
        <button className={className} onClick={() => router.push(to)}>
            {children}
        </button>
    );
}