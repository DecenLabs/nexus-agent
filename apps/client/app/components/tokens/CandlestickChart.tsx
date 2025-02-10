'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import { CandlestickData } from '@/app/lib/types';

interface CandlestickChartProps {
    data: CandlestickData[];
}

export default function CandlestickChart({ data }: CandlestickChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { color: '#ffffff' },
                textColor: '#333',
            },
            grid: {
                vertLines: { color: '#f0f0f0' },
                horzLines: { color: '#f0f0f0' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
        });

        const candlestickSeries = chart.addCandlestickSeries({
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        candlestickSeries.setData(data);

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
            }
        };

        window.addEventListener('resize', handleResize);
        chartRef.current = chart;

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data]);

    return <div ref={chartContainerRef} />;
} 