export function formatNumber(num: number): string {
    if (num >= 1_000_000_000) {
        return `${(num / 1_000_000_000).toFixed(2)}B`;
    }
    if (num >= 1_000_000) {
        return `${(num / 1_000_000).toFixed(2)}M`;
    }
    if (num >= 1_000) {
        return `${(num / 1_000).toFixed(2)}K`;
    }
    return num.toFixed(2);
}

export function formatPercentage(num: number): string {
    const sign = num >= 0 ? '+' : '';
    return `${sign}${num.toFixed(2)}%`;
} 