'use client';
import React from 'react';
import { ConnectButton, useWallet } from '@suiet/wallet-kit';
import Image from 'next/image';

const Header = () => {
  const { address, connected } = useWallet();

  return (
    <div className="fixed top-0 right-0 left-64 h-16 z-50">
      <div className="flex justify-end items-center h-full px-6">
        <ConnectButton className='bg-orange-500 text-black' />
      </div>
    </div>
  );
};

export default Header;
