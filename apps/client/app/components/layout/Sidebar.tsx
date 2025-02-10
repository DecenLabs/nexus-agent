'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet, ConnectButton } from '@suiet/wallet-kit';
import {
  MessageCircle,
  Coins,
  User,
  Clock,
  Twitter,
  MessageSquare,
  ChevronRight,
  Plus,
  ChevronDown
} from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../../lib/api';
import GoogleLoginButton from '../GoogleLoginButton';

interface Chat {
  text: string;
  timestamp: Date;
}

const Sidebar = () => {
  const pathname = usePathname();
  const { address, connected } = useWallet();
  const [chats, setChats] = useState<Chat[]>([]);
  const [isChatsOpen, setIsChatsOpen] = useState(false);

  const navigation = [
    { name: 'Tokens', href: '/tokens', icon: Coins },
    { name: 'Account', href: '/account', icon: User },
    { name: 'Portfolio', href: '/portfolio', icon: Clock },
  ];

  // Load chat history when wallet connects
  useEffect(() => {
    if (address && connected) {
      loadChats();
    }
  }, [address, connected]);

  const loadChats = async () => {
    try {
      const response = await api.get(`/v1/query/all-chats/${address}`);
      setChats(response.data);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  return (
    <div className="fixed w-64 bg-gradient-to-b from-orange-50 to-white border-r border-orange-100 flex flex-col h-screen">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <img src="/nexus-ai-icon.png" alt="The Nexus" className="h-10 w-10" />
          <span className="font-bold text-2xl text-black font-serif">
            Nexus AI
          </span>
        </div>
      </div>

      {/* Chat Section */}
      <div className="px-4">
        <div className="relative">
          <Link
            href="/"
            className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isChatsOpen
              ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200'
              : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
            }`}
            onClick={() => setIsChatsOpen(!isChatsOpen)}
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-orange-500" />
              <span className="font-medium flex-1 text-left">Chats</span>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${isChatsOpen ? 'rotate-180' : ''}`}
            />
          </Link>

          {isChatsOpen && (
            <Link
              href="/chat-history"
              className="block w-full mt-1 px-4 pl-8 py-3 text-gray-600 hover:bg-orange-50 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                <span className="text-sm">Chat History</span>
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="px-4 pb-4 flex-1">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200'
                  : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-orange-500'}`} />
                  {item.name}
                </div>
                {isActive && <ChevronRight className="h-4 w-4 text-white" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Wallet Address */}
      {address && (
        <div className="p-4 mx-4 mb-4 rounded-xl bg-gradient-to-r from-orange-50 to-orange-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-2.5 w-2.5 bg-green-500 rounded-full ring-2 ring-green-200" />
            <span className="text-sm font-medium text-gray-700">
              {address.slice(0, 6)}...{address.slice(-4)}
            </span>
          </div>
        </div>
      )}
      <GoogleLoginButton />

      {/* Social Links */}
      <div className="p-4 border-t border-orange-100">
        <div className="flex items-center justify-center gap-6">
          <Link href="https://twitter.com" className="text-orange-400 hover:text-orange-600 transition-colors">
            <Twitter className="h-5 w-5" />
          </Link>
          <Link href="https://discord.com" className="text-orange-400 hover:text-orange-600 transition-colors">
            <MessageSquare className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
