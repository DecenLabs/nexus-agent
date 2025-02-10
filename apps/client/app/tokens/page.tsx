import React from 'react';
import { Search } from 'lucide-react';
import TokenList from '../components/tokens/TokenList';
import SearchBar from '../components/tokens/SearchBar';
import { getTokenData } from '@/app/lib/tokens';

export default async function TokensPage() {
    // Fetch token data
    const tokenData = await getTokenData();

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Tokens</h1>

            {/* Search Section */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4">Search</h2>
                <SearchBar />
            </section>

            {/* Trending Tokens Section */}
            <section className="mb-12">
                <h2 className="text-xl font-semibold mb-4">Trending Tokens</h2>
                <TokenList
                    tokens={tokenData.trending}
                    type="trending"
                />
            </section>

            {/* Smart Money Inflows Section */}
            <section>
                <h2 className="text-xl font-semibold mb-4">Smart Money Inflows</h2>
                <TokenList
                    tokens={tokenData.smartMoney}
                    type="inflow"
                />
            </section>
        </main>
    );
}
