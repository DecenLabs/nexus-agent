export interface BluefinMarketData {
    symbol: string;
    lastPrice: string;
    _24hrVolume: string;
    _24hrPriceChangePercent: string;
    marketPrice: string;
    _24hrHighPrice: string;
    _24hrLowPrice: string;
    bestBidPrice: string;
    bestAskPrice: string;
    lastFundingRate: string;
    oraclePrice: string;
    indexPrice: string;
}

export interface Token {
    name: string;
    symbol: string;
    price: number;
    priceChange: number;
    volume: number;
    netInflow?: number;
    logoUrl: string;
    marketData?: BluefinMarketData;
}

export interface TokenData {
    trending: Token[];
    smartMoney: Token[];
}

export interface CandlestickData {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

