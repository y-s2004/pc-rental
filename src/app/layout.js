'use client'

import { CookiesProvider } from 'react-cookie';
import Header from '../components/Header';
import '../styles/page.css'; 
import { usePathname } from 'next/navigation'; 

export default function RootLayout({ children }) {
    const pathname = usePathname();
    const noHeaderPaths = ['/login'];
    
    return (
        <html lang="ja">
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/favicon.png" />
                <title>PC貸出管理システム</title>
            </head>
            <body className='font-sans bg-gray-100 text-gray-900'>
                <CookiesProvider>
                    {!noHeaderPaths.includes(pathname) && <Header />}
                    {children}
                </CookiesProvider>
            </body>
        </html>
    );
}