'use client'

import { CookiesProvider } from 'react-cookie';

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