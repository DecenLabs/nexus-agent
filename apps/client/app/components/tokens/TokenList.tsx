"use client"
import React, { useState } from 'react';
import { Star, BadgeDollarSign } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatNumber, formatPercentage } from '@/app/lib/utils';
import { Token } from '@/app/lib/types';

interface TokenListProps {
    tokens: Token[];
    type: 'trending' | 'inflow';
}

export default function TokenList({ tokens, type }: TokenListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tokens.map((token) => {
                const [logoError, setLogoError] = useState(false);
                return (
                    <Link 
                        key={token.symbol} 
                        href={`/tokens/${token.symbol.replace(/-PERP$/, '')}`}
                        className="bg-white rounded-lg p-4 shadow-sm border hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="relative w-8 h-8">
                                    {!logoError && token.logoUrl ? (
                                        <Image
                                            src={token.logoUrl}
                                            alt={token.name}
                                            fill
                                            className="rounded-full"
                                            onError={() => setLogoError(true)}
                                        />
                                    ) : (
                                        <BadgeDollarSign className="text-xl text-yellow-500 " />
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-medium">{token.name}</h3>
                                    <p className="text-sm text-gray-500">{token.symbol}</p>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-orange-500">
                                <Star className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-3">
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-semibold">
                                    ${formatNumber(token.price)}
                                </span>
                                <span className={`text-sm ${token.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {formatPercentage(token.priceChange)}
                                </span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                {type === 'trending' ? (
                                    <span>24h Volume: ${formatNumber(token.volume)}</span>
                                ) : (
                                    <span>Net inflow: ${formatNumber(token.netInflow || 0)}</span>
                                )}
                            </div>
                        </div>
                    </Link>
                );
            })}
        </div>
    );
} 