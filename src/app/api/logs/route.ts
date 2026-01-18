// Log Generator API Route
import { NextResponse } from 'next/server';
import { generateBatchLogs, generateEmergencyScenario, LogEntry } from '@/lib/agents';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '10');
    const emergency = searchParams.get('emergency') as 'fire' | 'power_outage' | 'traffic_jam' | null;

    let logs: LogEntry[];

    if (emergency) {
        logs = generateEmergencyScenario(emergency);
    } else {
        logs = generateBatchLogs(Math.min(count, 50));
    }

    return NextResponse.json({
        success: true,
        logs,
        count: logs.length,
        timestamp: new Date().toISOString(),
    });
}
