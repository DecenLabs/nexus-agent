import React from 'react';
import { getTokenData, getTokenCandlestickData } from '@/app/lib/tokens';
import { formatNumber, formatPercentage } from '@/app/lib/utils';
import { normalizeNumber } from '@/app/lib/tokens';
import Image from 'next/image';
import Link from 'next/link';
import CandlestickChart from '@/app/components/tokens/CandlestickChart';

// Helper function to safely format market data
function formatMarketPrice(value: string | undefined): string {
    if (!value) return '0.00';
    return formatNumber(normalizeNumber(value));
}

export default async function TokenDetailPage({
    params: { symbol }
}: {
    params: { symbol: string }
}) {
    const { trending, smartMoney } = await getTokenData();
    
    // First try to find in trending (real data)
    let token = trending.find(t => t.symbol.split('-')[0].toLowerCase() === symbol.toLowerCase());
    
    // If not found in trending, check smart money (mock data)
    if (!token) {
        token = smartMoney.find(t => t.symbol.toLowerCase() === symbol.toLowerCase());
    }

    // Fetch candlestick data if it's a trending token
    const candlestickData = await getTokenCandlestickData(token?.symbol || '');

    if (!token) {
        return (
            <main className="container mx-auto px-4 py-8">
                <div className="bg-white rounded-lg p-6 shadow-lg">
                    <h1 className="text-2xl font-bold mb-4">Token not found</h1>
                    <Link href="/tokens" className="text-orange-500 hover:text-orange-600">
                        ← Back to Tokens
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="container mx-auto px-4 py-8 mt-3">
            <div className="bg-white rounded-lg p-6 shadow-lg">
                <Link href="/tokens" className="text-orange-500 hover:text-orange-600 mb-6 inline-block">
                    ← Back to Tokens
                </Link>
                
                {/* Token Header */}
                <div className="flex items-center space-x-4 mb-6">
                    <div className="relative w-12 h-12">
                        <Image
                            src={token.logoUrl}
                            alt={token.name}
                            fill
                            className="rounded-full"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold">{token.name}</h1>
                        <p className="text-gray-500">{token.symbol}</p>
                    </div>
                </div>

                {/* Candlestick Chart */}
                {candlestickData.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-lg font-semibold mb-4">Price Chart (15m)</h2>
                        <CandlestickChart data={candlestickData} />
                    </div>
                )}

                {/* Price Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm text-gray-500 mb-1">Price</h3>
                        <p className="text-xl font-semibold">${formatNumber(token.price)}</p>
                        <span className={`text-sm ${token.priceChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {formatPercentage(token.priceChange)}
                        </span>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-sm text-gray-500 mb-1">24h Volume</h3>
                        <p className="text-xl font-semibold">${formatNumber(token.volume)}</p>
                    </div>
                    {token.marketData && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-sm text-gray-500 mb-1">Market Price</h3>
                            <p className="text-xl font-semibold">
                                ${formatMarketPrice(token.marketData.marketPrice)}
                            </p>
                        </div>
                    )}
                </div>

                {/* Market Details */}
                {token?.marketData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold mb-4">Market Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">24h High</p>
                                    <p className="font-medium">
                                        ${formatMarketPrice(token.marketData._24hrHighPrice)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">24h Low</p>
                                    <p className="font-medium">
                                        ${formatMarketPrice(token.marketData._24hrLowPrice)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Best Bid</p>
                                    <p className="font-medium">
                                        ${formatMarketPrice(token.marketData.bestBidPrice)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Best Ask</p>
                                    <p className="font-medium">
                                        ${formatMarketPrice(token.marketData.bestAskPrice)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Oracle Price</p>
                                    <p className="font-medium">
                                        ${formatMarketPrice(token.marketData.oraclePrice)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Index Price</p>
                                    <p className="font-medium">
                                        ${formatMarketPrice(token.marketData.indexPrice)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Funding Rate</p>
                                    <p className="font-medium">
                                        {formatPercentage(normalizeNumber(token.marketData.lastFundingRate || '0'))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
} 