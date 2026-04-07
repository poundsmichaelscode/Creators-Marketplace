import './globals.css';
import { Header } from '@/components/layout/header';
import { AppQueryProvider } from '@/providers/query-provider';

export const metadata = {
  title: 'Creators Marketplace',
  description: 'AI-powered marketplace for digital creators.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppQueryProvider>
          <Header />
          {children}
        </AppQueryProvider>
      </body>
    </html>
  );
}
