// ElevenLabs TTS Integration for City Brain Voice Alerts

export interface VoiceConfig {
    voiceId: string;
    modelId: string;
    stability: number;
    similarityBoost: number;
}

const DEFAULT_VOICE_CONFIG: VoiceConfig = {
    voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah - professional female voice
    modelId: 'eleven_turbo_v2',
    stability: 0.5,
    similarityBoost: 0.75,
};

// Generate speech from text using ElevenLabs API
export async function generateSpeech(
    text: string,
    config: Partial<VoiceConfig> = {}
): Promise<ArrayBuffer | null> {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
        console.log('ELEVENLABS_API_KEY not found, voice alerts disabled');
        return null;
    }

    const voiceConfig = { ...DEFAULT_VOICE_CONFIG, ...config };

    try {
        const response = await fetch(
            `https://api.elevenlabs.io/v1/text-to-speech/${voiceConfig.voiceId}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey,
                },
                body: JSON.stringify({
                    text,
                    model_id: voiceConfig.modelId,
                    voice_settings: {
                        stability: voiceConfig.stability,
                        similarity_boost: voiceConfig.similarityBoost,
                    },
                }),
            }
        );

        if (!response.ok) {
            console.error('ElevenLabs API error:', response.statusText);
            return null;
        }

        return await response.arrayBuffer();
    } catch (error) {
        console.error('ElevenLabs TTS error:', error);
        return null;
    }
}

// Format decision for speech
export function formatDecisionForSpeech(decision: string, actions: string[]): string {
    const primaryAction = actions[0] || 'Monitoring situation';
    return `ALERT. City Brain decision. ${decision}. Primary action: ${primaryAction}.`;
}

// Browser-based TTS fallback using Web Speech API
export function speakWithBrowserTTS(text: string): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        // Try to find a good English voice
        const voices = speechSynthesis.getVoices();
        const englishVoice = voices.find(
            voice => voice.lang.startsWith('en') && voice.name.includes('Female')
        ) || voices.find(voice => voice.lang.startsWith('en'));

        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        speechSynthesis.speak(utterance);
    }
}
