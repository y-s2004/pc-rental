'use client'

import { CookiesProvider } from 'react-cookie';
import Header from '../components/Header'; 

export default function RootLayout({ children }) {
    return (
        <html lang="ja">
            <body>
                <CookiesProvider>
                    {children}
                </CookiesProvider>
            </body>
        </html>
    );
}