import type { Metadata } from 'next';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard built with Next.js, MUI, and Zustand',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}