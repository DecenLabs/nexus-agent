import { BluefinClient, Networks } from '@bluefin-exchange/bluefin-v2-client';
import { ProtocolConfig, TradeParams, MarketData, ProtocolResponse } from '../../@types/interface';

// Define the ExchangeInfo interface based on the actual API response
interface ExchangeInfo {
    symbol: string;
    lastPrice: string;
    volume24h: string;
    marketPrice: string;
    _24hrHighPrice: string;
    _24hrLowPrice: string;
    _24hrVolume: string;
    _24hrPriceChangePercent: string;
}

interface BluefinResponse<T> {
    data: T;
    ok: boolean;
    status: number;
    response: {
        data: T;
        message: string;
        errorCode: number;
    };
}

interface OrderResponse {
    orderId: string;
    status: string;
    symbol: string;
    side: string;
    price: string;
    quantity: string;
}

export class BluefinProtocol {
    private client: BluefinClient;
    private static instance: BluefinProtocol;

    private constructor(config: ProtocolConfig) {
        this.client = new BluefinClient(
            config.isTestnet,
            config.isTestnet ? Networks.TESTNET_SUI : Networks.PRODUCTION_SUI,
            config.accountKey,
            'ED25519'
        );
    }

    public static getInstance(config: ProtocolConfig): BluefinProtocol {
        if (!BluefinProtocol.instance) {
            BluefinProtocol.instance = new BluefinProtocol(config);
        }
        return BluefinProtocol.instance;
    }

    public async initialize(): Promise<void> {
        try {
            await this.client.init();
        } catch (error) {
            throw new Error(`Failed to initialize Bluefin client: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    public async getExchangeInfo(): Promise<ProtocolResponse<MarketData[]>> {
        try {
            const response = await this.client.getExchangeInfo() as unknown as BluefinResponse<ExchangeInfo[]>;
            return {
                success: true,
                data: response.data.map((item) => ({
                    symbol: item.symbol,
                    price: parseFloat(item.lastPrice),
                    volume: parseFloat(item.volume24h),
                    timestamp: Date.now()
                }))
            };
        } catch (error) {
            return {
                success: false,
                error: `Failed to fetch exchange info: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    public async executeTrade(params: TradeParams): Promise<ProtocolResponse<string>> {
        try {
            const order = await this.client.submitOrder({
                symbol: params.symbol,
                price: params.price.toString(),
                quantity: params.quantity.toString(),
                side: params.side,
                orderType: 'LIMIT'
            });

            return {
                success: true,
                data: order.orderId
            };
        } catch (error) {
            return {
                success: false,
                error: `Failed to execute trade: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }

    public async getOrderStatus(orderId: string): Promise<ProtocolResponse<OrderResponse>> {
        try {
            // Using the correct method name from the Bluefin client
            const status = await this.client.getOrderById(orderId) as OrderResponse;
            return {
                success: true,
                data: status
            };
        } catch (error) {
            return {
                success: false,
                error: `Failed to get order status: ${error instanceof Error ? error.message : 'Unknown error'}`
            };
        }
    }
}
