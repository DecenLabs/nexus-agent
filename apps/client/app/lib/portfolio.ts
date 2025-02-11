export async function fetchUserTokens(address: string) {
    try {
        // Use Blockberry API to fetch tokens
        const response = await fetch(`https://api.blockberry.one/sui/v1/accounts/${address}/balance`, {
            method: 'GET',
            headers: {
                'accept': '*/*',
                'x-api-key': 'vMMZkSg10f7fLHjFGUkN8ZdhwddyeY'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch user tokens');
        }

        const data = await response.json();
        
        // Transform the data into our token format
        return data.map((token: any) => ({
            name: token.coinName || token.coinSymbol || 'Unknown Token',
            symbol: token.coinSymbol || '???',
            amount: parseFloat(token.balance) / Math.pow(10, token.decimals),
            value: token.balanceUsd || 0,
            coinType: token.coinType,
            price: token.coinPrice || 0,
            logoUrl: `/token-logos/${token.coinSymbol?.toLowerCase()}.png`
        }));

    } catch (error) {
        console.error('Error fetching user tokens:', error);
        return [];
    }
}

// Update the Transaction interface
interface Transaction {
    hash: string;
    type: string;
    amount: number;
    symbol: string;
    timestamp: Date;
    status: 'success' | 'pending' | 'failed';
    senderName: string | null;
    senderAddress: string;
    recipients: string[];
}

export async function fetchUserTransactions(address: string) {
    try {
        const response = await fetch(`/api/transactions?address=${address}`);

        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }

        const data = await response.json();
        console.log('Transactions data:', data);

        // Transform the data into our transaction format
        return data.content.map((tx: any) => {
            const senderChange = tx.balanceChanges.find((change: any) => 
                change.owner.addressOwner.toLowerCase() === address.toLowerCase() &&
                change.coinType === '0x2::sui::SUI'
            );
            
            const amount = senderChange ? Math.abs(Number(senderChange.amount)) / 1000000000 : 0;

            return {
                hash: tx.txHash,
                type: tx.txType || 'Transaction',
                amount: amount,
                symbol: 'SUI',
                timestamp: new Date(tx.timestamp),
                status: tx.txStatus.toLowerCase() as 'success' | 'pending' | 'failed',
                senderName: tx.senderName || null,
                senderAddress: tx.senderAddress,
                recipients: tx.recipients || []
            };
        });

    } catch (error) {
        console.error('Error fetching transactions:', error);
        return [];
    }
}

export async function fetchUserNFTs(address: string) {
    try {
        console.log('Fetching NFTs for address:', address);
        
        const response = await fetch(`/api/portfolio?address=${address}&type=nfts`);
        const responseText = await response.text();
        
        console.log('NFT Response status:', response.status);
        console.log('NFT Response text:', responseText);

        if (!response.ok) {
            throw new Error(`Failed to fetch NFTs: ${response.status} - ${responseText}`);
        }

        let data;
        try {
            data = JSON.parse(responseText);
        } catch (e) {
            console.error('Failed to parse NFT response:', e);
            throw new Error('Invalid JSON response from NFT endpoint');
        }

        console.log('NFT raw response:', data);

        // Check if data has content array
        if (!data.content || !Array.isArray(data.content)) {
            console.error('Expected content array in NFTs response, got:', data);
            return [];
        }

        // Transform the data into our NFT format
        const transformedNFTs = data.content
            .filter((nft: any) => nft !== null) // Filter out null entries
            .map((nft: any) => {
                console.log('Processing NFT:', nft);
                return {
                    id: nft.id || 'unknown-id',
                    name: nft.objectName || nft.type?.split('::').pop() || 'Unnamed NFT',
                    imageUrl: nft.imgUrl || '/placeholder-nft.png',
                    collection: nft.type?.split('::')[2] || 'Unknown Collection',
                    description: nft.description || '',
                    type: nft.type || '',
                    latestPrice: nft.latestPrice || null
                };
            })
            .filter((nft: any) => nft.imageUrl !== '/placeholder-nft.png'); // Optional: Filter out NFTs without images

        console.log('Transformed NFTs:', transformedNFTs);
        return transformedNFTs;

    } catch (error) {
        console.error('Error fetching NFTs:', error);
        return [];
    }
} 