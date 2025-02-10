'use client';
import React from 'react';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import Image from 'next/image';
import GoogleLoginButton from '../GoogleLoginButton';
const Header = () => {
  const { address, connected } = useWallet();

  return (
    <div className="fixed top-0 right-0 left-64 h-16 z-50">
      <div className="flex justify-end items-center h-full px-6 gap-4">
        <GoogleLoginButton />
        <ConnectButton className='bg-orange-500 text-black' />
      </div>
    </div>
  );
};

export default Header;
