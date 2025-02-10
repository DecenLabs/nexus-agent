/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            'cryptologos.cc',
            'ipfs.io',
            'suicamp.b-cdn.net',
            'github.com',
            'd315pvdvxi2gex.cloudfront.net',
            'raw.githubusercontent.com',
            'ipfs.io',
            'get-sui.pages.dev'
        ],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
}

module.exports = nextConfig
