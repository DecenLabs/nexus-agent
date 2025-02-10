'use client';
import React, { useState, useEffect } from 'react';
import { useWallet } from '@suiet/wallet-kit';
import { Clock, Coins, Tag, ArrowUpRight, ExternalLink, Send, ReceiptText } from 'lucide-react';
import Image from 'next/image';
import { formatNumber } from '@/app/lib/utils';
import { fetchUserTokens, fetchUserTransactions, fetchUserNFTs } from '@/app/lib/portfolio';
import { Token, Transaction, NFT } from '@/app/lib/types';

export default function PortfolioPage() {
    const { address, connected } = useWallet();
    const [tokens, setTokens] = useState<Token[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [nfts, setNfts] = useState<NFT[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (connected && address) {
            fetchPortfolioData();
        }
    }, [address, connected]);

    const fetchPortfolioData = async () => {
        setIsLoading(true);
        try {
            const [tokensData, transactionsData, nftsData] = await Promise.all([
                fetchUserTokens(address!),
                fetchUserTransactions(address!),
                fetchUserNFTs(address!)
            ]);

            console.log('NFTs data received:', nftsData);
            setTokens(tokensData);
            setTransactions(transactionsData);
            setNfts(nftsData);
        } catch (error) {
            console.error('Error fetching portfolio data:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!connected) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Connect Wallet</h1>
                    <p className="text-gray-600">Please connect your wallet to view your portfolio</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
                </div>
            </div>
        );
    }

    return (
        <main className="container mx-auto px-4 py-8">
            {/* Portfolio Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
                <p className="text-gray-600">{address}</p>
            </div>

            {/* Tokens Section */}
            <section className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                    <Coins className="h-6 w-6 text-orange-500" />
                    <h2 className="text-xl font-semibold">Tokens</h2>
                </div>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    {tokens.length > 0 ? (
                        <div className="divide-y">
                            {tokens.map((token) => (
                                <div key={token.symbol} className="py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        {token.logoUrl && (
                                            <div className="relative w-8 h-8">
                                                <Image
                                                    src={token.logoUrl}
                                                    alt={token.name}
                                                    fill
                                                    className="rounded-full"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-medium">{token.name}</h3>
                                            <p className="text-sm text-gray-500">{token.amount} {token.symbol}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">${formatNumber(token.value)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No tokens found</p>
                    )}
                </div>
            </section>

            {/* NFTs Section */}
            <section className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                    <Tag className="h-6 w-6 text-orange-500" />
                    <h2 className="text-xl font-semibold">NFTs ({nfts.length})</h2>
                </div>
                {nfts.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No NFTs with images found</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {nfts.map((nft) => (
                            <div key={nft.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                                <div className="relative aspect-square">
                                    <Image
                                        src={nft.imageUrl}
                                        alt={nft.name}
                                        fill
                                        className="object-cover"
                                        onError={(e: any) => {
                                            console.error('Failed to load image:', nft.imageUrl);
                                            e.target.src = '/placeholder-nft.png';
                                        }}
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium mb-1">{nft.name}</h3>
                                    <p className="text-sm text-gray-500 mb-2 truncate">{nft.collection}</p>
                                    {nft.description && (
                                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{nft.description}</p>
                                    )}
                                    {nft.latestPrice && (
                                        <p className="text-sm font-medium text-orange-500">
                                            Last Price: ${formatNumber(nft.latestPrice)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Transactions Section */}
            <section className="mb-12">
                <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-6 w-6 text-orange-500" />
                    <h2 className="text-xl font-semibold">Recent Transactions</h2>
                </div>
                <div className="space-y-4">
                    {transactions.length > 0 ? (
                        transactions.map((tx: Transaction) => (
                            <div key={tx.hash} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-full ${tx.status === 'success' ? 'bg-green-100' :
                                            tx.status === 'failed' ? 'bg-red-100' :
                                                'bg-orange-100'
                                            }`}>
                                            <Send className={`h-4 w-4 ${tx.status === 'success' ? 'text-green-600' :
                                                tx.status === 'failed' ? 'text-red-600' :
                                                    'text-orange-600'
                                                }`} />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 text-sm">{tx.type}</h3>
                                            <p className="text-xs text-gray-500">{new Date(tx.timestamp).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-sm">{tx.amount} {tx.symbol}</p>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-xs ${tx.status === 'success' ? 'text-green-500' :
                                                tx.status === 'failed' ? 'text-red-500' :
                                                    'text-orange-500'
                                                }`}>
                                                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                                <a
                                                    href={`https://suiscan.xyz/mainnet/tx/${tx.hash}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 transition-colors"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-4 text-center">
                            <ReceiptText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">No transactions found</p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
} 