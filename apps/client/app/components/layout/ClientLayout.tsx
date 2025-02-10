'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex h-screen">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    {children}
                </div>
            </main>
        </div>
    );
} 