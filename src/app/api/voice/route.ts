// Voice API Route - ElevenLabs TTS Integration
import { NextResponse } from 'next/server';
import { generateSpeech, formatDecisionForSpeech } from '@/lib/voice';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { text, decision, actions } = body;

        let speechText: string;

        if (decision && actions) {
            speechText = formatDecisionForSpeech(decision, actions);
        } else if (text) {
            speechText = text;
        } else {
            return NextResponse.json(
                { success: false, error: 'Text or decision is required' },
                { status: 400 }
            );
        }

        const audioBuffer = await generateSpeech(speechText);

        if (!audioBuffer) {
            // Return success but indicate voice is not available
            return NextResponse.json({
                success: true,
                voiceEnabled: false,
                message: 'Voice generation not available, use browser TTS',
                text: speechText,
            });
        }

        // Return audio as base64
        const base64Audio = Buffer.from(audioBuffer).toString('base64');

        return NextResponse.json({
            success: true,
            voiceEnabled: true,
            audio: base64Audio,
            text: speechText,
        });
    } catch (error) {
        console.error('Voice generation error:', error);
        return NextResponse.json(
            { success: false, error: 'Voice generation failed' },
            { status: 500 }
        );
    }
}
