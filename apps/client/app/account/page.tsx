'use client';
import React from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { User, Twitter, Mail, Phone, ChevronRight, Camera } from 'lucide-react';
import Image from 'next/image';

export default function AccountPage() {
    const { address, connected } = useWallet();

    if (!connected) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Connect Wallet</h1>
                    <p className="text-gray-600">Please connect your wallet to view your account</p>
                </div>
            </div>
        );
    }

    // Format the date to match the image (MM/DD/YYYY)
    const joinDate = new Date().toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric'
    });

    return (
        <main className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold">Account</h1>
                <div className="text-sm text-gray-500">
                    Joined on {joinDate}
                </div>
            </div>

            {/* Profile Section */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 mb-6">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 text-orange-500" />
                        </div>
                        <button 
                            className="absolute -bottom-1 -right-1 p-1.5 bg-orange-500 rounded-full text-white hover:bg-orange-600 transition-colors shadow-sm"
                            aria-label="Change Profile Picture"
                        >
                            <Camera className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold mb-1">
                            {address?.slice(0, 8)}...{address?.slice(-4)}
                        </h2>
                        <p className="text-sm text-gray-500">Change Profile Picture</p>
                    </div>
                </div>
            </div>

            {/* User Details Section */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 mb-6">
                <h2 className="text-sm font-medium text-gray-500 mb-2">User Wallet</h2>
                <p className="font-mono text-sm text-gray-800 break-all bg-gray-50 p-3 rounded-lg">
                    {address}
                </p>
            </div>

            {/* Connected Wallets Section */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 mb-6">
                <h2 className="text-sm font-medium text-gray-500 mb-2">Agent Wallet</h2>
                <div className="font-mono text-sm text-gray-800 break-all bg-gray-50 p-3 rounded-lg">
                    {address}
                </div>
            </div>

            {/* Connected Accounts Section */}
            <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6">
                <h2 className="text-sm font-medium text-gray-500 mb-6">Connected Accounts</h2>
                
                {/* Twitter */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                            <Twitter className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-800">Twitter</h3>
                            <p className="text-xs text-gray-500">Not Connected</p>
                        </div>
                    </div>
                    <button className="px-3 py-1.5 text-sm text-orange-500 font-medium hover:bg-orange-50 rounded-lg transition-colors">
                        Connect
                    </button>
                </div>

                {/* Google */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                            <Image src="/google-icon.png" alt="Google" width={20} height={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-800">Google</h3>
                            <p className="text-xs text-gray-500">xerox336699@gmail.com</p>
                        </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>

                {/* Email */}
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                            <Mail className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-800">Email</h3>
                            <p className="text-xs text-gray-500">Not Connected</p>
                        </div>
                    </div>
                    <button className="px-3 py-1.5 text-sm text-orange-500 font-medium hover:bg-orange-50 rounded-lg transition-colors">
                        Connect
                    </button>
                </div>

                {/* Phone */}
                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                            <Phone className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-800">Phone</h3>
                            <p className="text-xs text-gray-500">Not Connected</p>
                        </div>
                    </div>
                    <button className="px-3 py-1.5 text-sm text-orange-500 font-medium hover:bg-orange-50 rounded-lg transition-colors">
                        Connect
                    </button>
                </div>
            </div>
        </main>
    );
} 