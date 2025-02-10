import { MOCK_TOKENS } from "./constant";
import { BluefinMarketData, Token, TokenData, CandlestickData } from "./types";

const LOGO_MAPPING: Record<string, string> = {
    SUI: 'https://cryptologos.cc/logos/sui-sui-logo.png',
    USDC: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png',
    ETH: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    BTC: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    BNB: 'https://cryptologos.cc/logos/bnb-bnb-logo.png',
    SOL: 'https://cryptologos.cc/logos/solana-sol-logo.png'
};

export function normalizeNumber(value: string): number {
    return parseFloat(value) / 1e18; // Convert from wei-like format
}

export async function getTokenCandlestickData(symbol: string): Promise<CandlestickData[]> {
    try {
        const response = await fetch(
            `https://dapi.api.sui-prod.bluefin.io/candlestickData?symbol=${symbol}&interval=15m`,
            {
                headers: {
                    'accept': 'application/json'
                }
            }
        );

        if (!response.ok) {
            throw new Error('Failed to fetch candlestick data');
        }

        const data = await response.json();

        // Transform the data into candlestick format
        // API returns array in format: [startTime, open, high, low, close, volume, endTime, quoteVolume, trades, takerBuyBaseVolume, takerBuyQuoteVolume, symbol]
        return data.map((item: any[]) => ({
            time: item[0] / 1000, // Convert milliseconds to seconds for the chart
            open: parseFloat(item[1]) / 1e18,
            high: parseFloat(item[2]) / 1e18,
            low: parseFloat(item[3]) / 1e18,
            close: parseFloat(item[4]) / 1e18,
            volume: parseFloat(item[5]) / 1e18
        }));
    } catch (error) {
        console.error('Error fetching candlestick data:', error);
        return [];
    }
}

export async function getTokenData() {
    try {
        const response = await fetch('https://dapi.api.sui-prod.bluefin.io/marketData', {
            headers: {
                'accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch market data');
        }

        const data: BluefinMarketData[] = await response.json();

        // Transform market data into our token format for trending section
        const tokens = data.map((item: BluefinMarketData) => ({
            name: item.symbol.split('-')[0], // Remove the -PERP suffix
            symbol: item.symbol,
            price: normalizeNumber(item.lastPrice),
            priceChange: normalizeNumber(item._24hrPriceChangePercent),
            volume: normalizeNumber(item._24hrVolume),
            logoUrl: LOGO_MAPPING[item.symbol.split('-')[0]] || `/token-logos/${item.symbol.toLowerCase()}.png`,
            marketData: item // Store the full market data for the detail page
        }));

        // Sort by volume for trending
        const trending = [...tokens].sort((a, b) => b.volume - a.volume);

        // Major tokens for Smart Money Inflows
        const majorSymbols = ['BTC-PERP', 'ETH-PERP', 'SUI-PERP', 'BNB-PERP', 'SOL-PERP', 'POL-PERP', 'AVAX-PERP'];
        const smartMoney = tokens
            .filter(token => majorSymbols.includes(token.symbol))
            .map(token => ({
                ...token,
                netInflow: token.volume * (token.priceChange >= 0 ? 0.15 : -0.15) // Simulate inflow based on price change
            }))
            .sort((a, b) => (b.netInflow || 0) - (a.netInflow || 0));

        return {
            trending,
            smartMoney
        };

    } catch (error) {
        console.error('Error fetching token data:', error);
        return {
            trending: [],
            smartMoney: []
        };
    }
} 