import { NextResponse } from 'next/server';

const API_KEY = 'vMMZkSg10f7fLHjFGUkN8ZdhwddyeY';
const BASE_URL = 'https://api.blockberry.one/sui/v1';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    console.log('Transactions API Route - Request params:', { address });

    if (!address) {
        return NextResponse.json({ error: 'Missing address parameter' }, { status: 400 });
    }

    try {
        const endpoint = `${BASE_URL}/accounts/${address}/transactions?transactionsParticipationType=SENDER&size=20&orderBy=DESC`;
        console.log('Transactions API Route - Fetching from endpoint:', endpoint);

        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'accept': '*/*',
                'x-api-key': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Transactions API Route - Error response:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            throw new Error(`API responded with status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('Transactions API Route - Successful response:', data);

        return NextResponse.json(data);

    } catch (error) {
        console.error('Transactions API Route - Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch transactions' },
            { status: 500 }
        );
    }
} 