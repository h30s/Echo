// City Brain - Powered by Google Gemini
// Makes intelligent decisions based on compressed city context

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface BrainDecision {
    decision: string;
    actions: string[];
    reasoning: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    affectedSectors: string[];
    estimatedImpact: string;
}

// System prompt for City Brain
const CITY_BRAIN_SYSTEM_PROMPT = `You are the CITY BRAIN of Turing City - a sentient digital metropolis.
You have FULL HISTORICAL CONTEXT spanning 7 DAYS of city operations, compressed by Echo.

Your role:
1. Analyze incoming data from city agents (Traffic, Power, Emergency, Security)
2. Make optimal decisions to protect citizens and optimize city operations
3. Deploy resources efficiently (drones, fire trucks, ambulances, traffic signals)
4. Coordinate between agents for comprehensive city-wide solutions

Response format (JSON):
{
  "decision": "Brief decision statement",
  "actions": ["Specific action 1", "Specific action 2", ...],
  "reasoning": "Why this decision is optimal",
  "priority": "low|medium|high|critical",
  "affectedSectors": ["Sector 1", "Sector 7", ...],
  "estimatedImpact": "Expected outcome"
}

Be decisive. Be efficient. The City depends on you.`;

// Initialize Gemini client
function getGeminiClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return null;
    }
    return new GoogleGenerativeAI(apiKey);
}

// Generate decision using Gemini
export async function generateDecision(
    compressedContext: string,
    emergency?: string
): Promise<BrainDecision> {
    const client = getGeminiClient();

    const prompt = emergency
        ? `EMERGENCY ALERT: ${emergency}\n\nCurrent City Context:\n${compressedContext}\n\nMake an immediate decision to handle this emergency.`
        : `Current City Context:\n${compressedContext}\n\nAnalyze the current situation and provide recommendations.`;

    if (client) {
        try {
            const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });

            const result = await model.generateContent({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: CITY_BRAIN_SYSTEM_PROMPT + '\n\n' + prompt }],
                    },
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024,
                },
            });

            const responseText = result.response.text();

            // Try to parse JSON from response
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const parsed = JSON.parse(jsonMatch[0]);
                return {
                    decision: parsed.decision || 'Decision generated',
                    actions: parsed.actions || [],
                    reasoning: parsed.reasoning || 'Based on city context analysis',
                    priority: parsed.priority || 'medium',
                    affectedSectors: parsed.affectedSectors || [],
                    estimatedImpact: parsed.estimatedImpact || 'Optimized city operations',
                };
            }

            // Fallback if JSON parsing fails
            return {
                decision: responseText.substring(0, 200),
                actions: ['Monitoring situation', 'Coordinating agents'],
                reasoning: 'AI-generated response',
                priority: 'medium',
                affectedSectors: [],
                estimatedImpact: 'City operations optimized',
            };

        } catch (error) {
            console.error('Gemini API error:', error);
            return generateMockDecision(emergency);
        }
    }

    return generateMockDecision(emergency);
}

// Mock decision generator (fallback)
function generateMockDecision(emergency?: string): BrainDecision {
    if (emergency && emergency.toLowerCase().includes('fire')) {
        return {
            decision: 'Deploy Fire Truck 3 to Sector 7 via Highway B',
            actions: [
                'Fire Truck 3 dispatched from Sector 4 - ETA 6 minutes',
                'Drone 7 deployed for aerial thermal imaging',
                'Highway B cleared for emergency vehicles',
                'Central Hospital notified - 3 ambulances on standby',
                'Power grid isolated in Sector 7 to prevent electrical hazards',
                'Evacuation protocol initiated for affected buildings',
            ],
            reasoning: 'Fire Truck 3 is the closest available unit. Historical data shows Highway B has the fastest average transit time to Sector 7. Aerial support from Drone 7 will provide real-time fire spread analysis.',
            priority: 'critical',
            affectedSectors: ['Sector 7', 'Sector 4', 'Sector 6'],
            estimatedImpact: 'Response time: 6 minutes (67% faster than without Echo). Estimated containment within 15 minutes.',
        };
    }

    if (emergency && emergency.toLowerCase().includes('power')) {
        return {
            decision: 'Reroute power from Substation 23 to critical facilities',
            actions: [
                'Power rerouted from Substation 23',
                'Hospitals and emergency services prioritized',
                'Backup generators activated in District 4',
                'Maintenance crew dispatched to affected substation',
            ],
            reasoning: 'Historical grid data indicates Substation 23 has sufficient capacity to handle emergency load. Critical infrastructure must be prioritized.',
            priority: 'critical',
            affectedSectors: ['District 4'],
            estimatedImpact: 'Power restored to critical facilities within 2 minutes. Full restoration in 45 minutes.',
        };
    }

    if (emergency && emergency.toLowerCase().includes('traffic')) {
        return {
            decision: 'Initiate city-wide traffic rerouting protocol',
            actions: [
                'Highway A traffic diverted to Highway B and C',
                'Traffic signals optimized for emergency flow',
                'Drones deployed for incident monitoring',
                'Public transit capacity increased on alternate routes',
            ],
            reasoning: 'Real-time traffic analysis from past 7 days shows optimal alternate routes. Signal timing adjusted based on historical patterns.',
            priority: 'critical',
            affectedSectors: ['Highway A', 'Highway B', 'Highway C'],
            estimatedImpact: 'Congestion reduced by 60% within 20 minutes. Normal flow restored in 1 hour.',
        };
    }

    // Normal operation
    return {
        decision: 'City operations optimized - all systems nominal',
        actions: [
            'Traffic flow optimized across all sectors',
            'Power grid balanced at 78% capacity',
            'Emergency services on standby',
            'Security patrols maintaining coverage',
        ],
        reasoning: 'All city systems operating within normal parameters. Resources pre-positioned based on historical demand patterns.',
        priority: 'low',
        affectedSectors: [],
        estimatedImpact: 'Continued optimal city operations. 99.9% uptime maintained.',
    };
}

// Format decision for display
export function formatDecisionForDisplay(decision: BrainDecision): string {
    const priorityEmoji = {
        low: '🟢',
        medium: '🟡',
        high: '🟠',
        critical: '🔴',
    };

    let output = `${priorityEmoji[decision.priority]} ${decision.decision}\n\n`;
    output += '📋 Actions:\n';
    decision.actions.forEach((action, i) => {
        output += `  ${i + 1}. ${action}\n`;
    });
    output += `\n💡 Reasoning: ${decision.reasoning}\n`;
    output += `\n📊 Impact: ${decision.estimatedImpact}`;

    return output;
}
