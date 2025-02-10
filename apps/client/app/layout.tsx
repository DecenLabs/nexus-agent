import './globals.css';
import { Manrope } from 'next/font/google';
import '@suiet/wallet-kit/style.css';
import './walletCustomCss.css';
import ClientLayout from './components/layout/ClientLayout';
import Providers from '@/app/providers';

const manrope = Manrope({ subsets: ['latin'] });

export const metadata = {
  title: 'AtomaSage',
  description: 'AtomaSage is a simple ai agent that allows you to interact with the LLM model.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${manrope.className} bg-[#F8F9FB] h-screen`}>
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
