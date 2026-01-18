// City Brain API Route - Gemini-powered Decision Engine
import { NextResponse } from 'next/server';
import { generateDecision, BrainDecision } from '@/lib/brain';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { context, emergency } = body;

        if (!context) {
            return NextResponse.json(
                { success: false, error: 'Context is required' },
                { status: 400 }
            );
        }

        const decision: BrainDecision = await generateDecision(context, emergency);

        return NextResponse.json({
            success: true,
            decision,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Brain decision error:', error);
        return NextResponse.json(
            { success: false, error: 'Decision generation failed' },
            { status: 500 }
        );
    }
}
