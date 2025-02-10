import { SuilendClient, LENDING_MARKET_ID, LENDING_MARKET_TYPE } from '@suilend/sdk';
import { 
    ProtocolConfig, 
    LendingParams, 
    BorrowParams, 
    LendingRate, 
    ProtocolResponse,
    MarketInfo 
} from '../../@types/interface'; 
import { SuiClient } from "@mysten/sui/client";
import { NETWORK_CONFIG } from '../../@types/interface';
import { Transaction } from "@mysten/sui/transactions";
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { Keypair } from '@mysten/sui/cryptography';

export class SuilendProtocol {
    private client!: SuilendClient;
    private suiClient: SuiClient;
    private signer: Keypair;
    private static instance: SuilendProtocol;

    private constructor(config: ProtocolConfig) {
        // Initialize SUI client based on network
        this.suiClient = new SuiClient({ 
            url: config.isTestnet ? NETWORK_CONFIG.TESTNET.fullnode : NETWORK_CONFIG.MAINNET.fullnode 
        });
        
        // Initialize signer from private key
        this.signer = Ed25519Keypair.fromSecretKey(Buffer.from(config.accountKey, 'hex'));
    }

    public static getInstance(config: ProtocolConfig): SuilendProtocol {
        if (!SuilendProtocol.instance) {
            SuilendProtocol.instance = new SuilendProtocol(config);
        }
        return SuilendProtocol.instance;
    }

    public async initialize(): Promise<void> {
        try {
            // Initialize Suilend client properly
            this.client = await SuilendClient.initialize(
                LENDING_MARKET_ID,
                LENDING_MARKET_TYPE,
                this.suiClient
            );
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            throw new Error(`Failed to initialize Suilend client: ${errorMessage}`);
        }
    }

    public async getLendingRates(): Promise<ProtocolResponse<LendingRate[]>> {
        try {
            if (!this.client) {
                throw new Error('Suilend client not initialized');
            }
            // @ts-ignore
            const marketInfo = await this.client.getMarketInfo() as Record<string, MarketInfo>;
            
            const markets = Object.entries(marketInfo).map(([asset, info]) => ({
                asset,
                supplyRate: Number(info.supplyRate || 0),
                borrowRate: Number(info.borrowRate || 0),
                utilization: Number(info.utilization || 0)
            }));

            return {
                success: true,
                data: markets
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                error: `Failed to fetch lending rates: ${errorMessage}`
            };
        }
    }

    public async lendTokens(params: LendingParams): Promise<ProtocolResponse<string>> {
        try {
            if (!this.client) {
                throw new Error('Suilend client not initialized');
            }

            // Create new transaction
            const tx = new Transaction();
            
            // Get user's coins
            const coins = await this.suiClient.getCoins({
                owner: params.walletAddress,
                coinType: params.asset
            });

            if (!coins.data.length) {
                throw new Error(`No coins found for type ${params.asset}`);
            }

            // Merge coins if needed
            const mergeCoin = coins.data[0];
            if (coins.data.length > 1) {
                tx.mergeCoins(
                    tx.object(mergeCoin.coinObjectId),
                    coins.data.slice(1).map(c => tx.object(c.coinObjectId))
                );
            }

            // Split the exact amount needed
            const [sendCoin] = tx.splitCoins(
                tx.object(mergeCoin.coinObjectId),
                [params.amount.toString()]
            );

            // Deposit and mint cTokens
            await this.client.depositLiquidityAndGetCTokens(
                sendCoin.toString(),
                params.asset,
                tx.toString(),
                { maxGasForMint: BigInt(1000000) }
            );

            // Execute transaction
            const result = await this.suiClient.signAndExecuteTransaction({
                transaction: tx,
                signer: this.signer,
                options: {
                    showEffects: true,
                    showEvents: true,
                }
            });

            return {
                success: true,
                data: result.digest
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                error: `Failed to lend tokens: ${errorMessage}`
            };
        }
    }

    public async borrowTokens(params: BorrowParams): Promise<ProtocolResponse<string>> {
        try {
            if (!this.client) {
                throw new Error('Suilend client not initialized');
            }

            // Create new transaction
            const tx = new Transaction();

            // Borrow tokens and send to user
            await this.client.borrowAndSendToUser(
                params.walletAddress,
                params.obligationOwnerCapId,
                params.obligationId,
                params.asset,
                params.amount.toString(),
                tx
            );

            // Execute transaction
            const result = await this.suiClient.signAndExecuteTransaction({
                transaction: tx,
                signer: this.signer,
                options: {
                    showEffects: true,
                    showEvents: true,
                }
            });

            return {
                success: true,
                data: result.digest
            };
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            return {
                success: false,
                error: `Failed to borrow tokens: ${errorMessage}`
            };
        }
    }
}
