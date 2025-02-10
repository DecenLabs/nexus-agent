import { BluefinClient, Networks } from '@bluefin-exchange/bluefin-v2-client';

export async function getTokenData() {
    try {
        const client = new BluefinClient(
            true,
            Networks.TESTNET_SUI,
            process.env.BLUEFIN_ACCOUNT_KEY || '',
            'ED25519'
        );

        await client.init();
        const marketData = await client.getMarketData();

        console.log("marketData", marketData);

        // Transform market data into our token format
        // const tokens = marketData.data.map((item: any) => ({
        //     name: item.symbol,
        //     symbol: item.symbol,
        //     price: parseFloat(item.lastPrice),
        //     priceChange: parseFloat(item.priceChangePercent),
        //     volume: parseFloat(item.volume),
        //     logoUrl: `/token-logos/${item.symbol.toLowerCase()}.png`, // You'll need to add token logos
        // }));

        // const trending = [...tokens].sort((a, b) => b.volume - a.volume).slice(0, 6);

        // For demo purposes, we'll use the same data for smart money inflows
        // In a real app, you'd want to get this from a different source
        // const smartMoney = tokens.slice(0, 6).map(token => ({
        //     ...token,
        //     netInflow: token.volume * 0.1 // Demo calculation
        // }));

        return {
            marketData
        };
    } catch (error) {
        console.error('Error fetching token data:', error);
        return {
            marketData: []  
        };
    }
} 