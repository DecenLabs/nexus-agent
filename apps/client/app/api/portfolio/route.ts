import { NextResponse } from 'next/server';

const API_KEY = 'vMMZkSg10f7fLHjFGUkN8ZddwddyeY';
const BASE_URL = 'https://api.blockberry.one/sui/v1';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    const type = searchParams.get('type'); 
    console.log('API Route - Request params:', { address, type });

    if (!address || !type) {
        return NextResponse.json({ error: 'Missing address or type parameter' }, { status: 400 });
    }

    try {
        let endpoint = '';
        switch (type) {
            case 'nfts':
                endpoint = `${BASE_URL}/nfts/wallet/${address}?page=0&size=20&orderBy=DESC&sortBy=AGE`;
                break;
            default:
                return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
        }

        console.log('API Route - Fetching from endpoint:', endpoint);

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
            console.error('API Route - Error response:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText
            });
            throw new Error(`API responded with status: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        console.log('API Route - Successful response:', data);

        return NextResponse.json(data);

    } catch (error) {
        console.error('API Route - Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to fetch data' },
            { status: 500 }
        );
    }
} 