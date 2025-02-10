'use client';

import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';
import { CandlestickData } from '@/app/lib/types';

interface CandlestickChartProps {
    data: CandlestickData[];
}

export default function CandlestickChart({ data }: CandlestickChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!chartContainerRef.current || !data.length) return;

        const chartOptions = {
            layout: {
                background: { color: '#ffffff' },
                textColor: '#333333',
            },
            grid: {
                vertLines: { color: '#f0f0f0' },
                horzLines: { color: '#f0f0f0' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        };

        const chart = createChart(chartContainerRef.current, chartOptions);

        // Create area series for price
        const areaSeries = chart.addAreaSeries({
            lineColor: '#2962FF',
            topColor: 'rgba(41, 98, 255, 0.3)',
            bottomColor: 'rgba(41, 98, 255, 0)',
            lineWidth: 2,
        });

        const priceData = data.map(item => ({
            time: item.time,
            value: item.close,
        }));

        areaSeries.setData(priceData);

        // Create volume series as bars
        const volumeSeries = chart.addHistogramSeries({
            color: '#26a69a',
            priceFormat: {
                type: 'volume',
            },
            priceScaleId: 'volume',
            scaleMargins: {
                top: 0.8,
                bottom: 0,
            },
        });

        const volumeData = data.map(item => ({
            time: item.time,
            value: item.volume,
            color: item.close >= item.open ? '#26a69a80' : '#ef535080'
        }));

        volumeSeries.setData(volumeData);

        // Fit the chart to the data
        chart.timeScale().fitContent();

        // Handle resize
        const handleResize = () => {
            if (chartContainerRef.current) {
                chart.applyOptions({
                    width: chartContainerRef.current.clientWidth,
                });
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [data]);

    return (
        <div className="w-full h-[400px] bg-white rounded-lg shadow-sm">
            <div ref={chartContainerRef} className="w-full h-full" />
        </div>
    );
} 