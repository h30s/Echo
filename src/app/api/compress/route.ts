// Compression API Route - Token Company bear-1 Integration
import { NextResponse } from 'next/server';
import { compressLogs, CompressionResult } from '@/lib/compression';
import { LogEntry } from '@/lib/agents';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const logs: LogEntry[] = body.logs;

        if (!logs || !Array.isArray(logs)) {
            return NextResponse.json(
                { success: false, error: 'Invalid logs array' },
                { status: 400 }
            );
        }

        const result: CompressionResult = await compressLogs(logs);

        return NextResponse.json({
            success: true,
            ...result,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Compression error:', error);
        return NextResponse.json(
            { success: false, error: 'Compression failed' },
            { status: 500 }
        );
    }
}
