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
        console.log(" TokenCandlestickData symbol", symbol);
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

        console.log("candlestick data", data);

        // Transform the data into candlestick format
        return data.map((item: any) => ({
            time: item[0] / 1000, // Convert to Unix timestamp
            open: normalizeNumber(item[1]),
            high: normalizeNumber(item[2]),
            low: normalizeNumber(item[3]),
            close: normalizeNumber(item[4]),
            volume: normalizeNumber(item[5])
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

        // Use mock data for smart money inflows
        const smartMoney = MOCK_TOKENS.map(token => ({
            ...token,
            netInflow: token.volume * 0.15
        }));

        return {
            trending,
            smartMoney
        };

    } catch (error) {
        console.error('Error fetching token data:', error);
        return {
            trending: MOCK_TOKENS,
            smartMoney: MOCK_TOKENS.map(token => ({
                ...token,
                netInflow: token.volume * 0.15
            }))
        };
    }
} 