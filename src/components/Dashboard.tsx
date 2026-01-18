'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { LogEntry } from '@/lib/agents';
import { CompressionResult } from '@/lib/compression';
import { BrainDecision } from '@/lib/brain';
import { speakWithBrowserTTS, formatDecisionForSpeech } from '@/lib/voice';

// Component Imports
import AgentPanel from './AgentPanel';
import CompressionStats from './CompressionStats';
import CompressionProof from './CompressionProof';
import MemoryTimeline from './MemoryTimeline';
import ImpactMetrics from './ImpactMetrics';
import ArizeObservability from './ArizeObservability';
import CityBrainOutput from './CityBrainOutput';
import EmergencyButton from './EmergencyButton';

export default function Dashboard() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [compressionStats, setCompressionStats] = useState<CompressionResult | null>(null);
    const [decision, setDecision] = useState<BrainDecision | null>(null);
    const [isThinking, setIsThinking] = useState(false);
    const [isEmergencyActive, setIsEmergencyActive] = useState(false);
    const [compressedContent, setCompressedContent] = useState('');

    // Fetch logs periodically
    const fetchLogs = useCallback(async (emergency?: 'fire' | 'power_outage' | 'traffic_jam') => {
        try {
            const url = emergency
                ? `/api/logs?emergency=${emergency}`
                : '/api/logs?count=5';
            const response = await fetch(url);
            const data = await response.json();

            if (data.success) {
                setLogs(prev => [...prev, ...data.logs].slice(-50));

                // Compress after getting logs
                await compressLogs([...logs, ...data.logs].slice(-20));
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        }
    }, [logs]);

    // Compress logs
    const compressLogs = async (logsToCompress: LogEntry[]) => {
        try {
            const response = await fetch('/api/compress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logs: logsToCompress }),
            });
            const data = await response.json();

            if (data.success) {
                setCompressionStats(data);
                setCompressedContent(data.compressedContent);
            }
        } catch (error) {
            console.error('Compression failed:', error);
        }
    };

    // Get City Brain decision
    const getBrainDecision = async (context: string, emergency?: string) => {
        setIsThinking(true);
        try {
            const response = await fetch('/api/brain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context, emergency }),
            });
            const data = await response.json();

            if (data.success) {
                setDecision(data.decision);

                // Auto-speak for critical decisions
                if (data.decision.priority === 'critical') {
                    speakWithBrowserTTS(formatDecisionForSpeech(data.decision.decision, data.decision.actions));
                }
            }
        } catch (error) {
            console.error('Brain decision failed:', error);
        } finally {
            setIsThinking(false);
        }
    };

    // Handle emergency trigger
    const handleEmergency = async (type: 'fire' | 'power_outage' | 'traffic_jam') => {
        setIsEmergencyActive(true);

        // Fetch emergency logs
        await fetchLogs(type);

        // Get brain decision
        const emergencyText = {
            fire: 'FIRE ALERT: Major fire detected in Sector 7!',
            power_outage: 'POWER OUTAGE: District 4 offline!',
            traffic_jam: 'TRAFFIC EMERGENCY: Highway A blocked!',
        };

        await getBrainDecision(compressedContent, emergencyText[type]);

        setTimeout(() => setIsEmergencyActive(false), 5000);
    };

    // Speak decision
    const handleSpeak = (text: string) => {
        speakWithBrowserTTS(text);
    };

    // Poll for logs
    useEffect(() => {
        fetchLogs();
        const interval = setInterval(() => fetchLogs(), 3000);
        return () => clearInterval(interval);
    }, []);

    // Get initial brain assessment
    useEffect(() => {
        if (compressedContent && !decision) {
            getBrainDecision(compressedContent);
        }
    }, [compressedContent]);

    return (
        <div className="min-h-screen gradient-cyber grid-pattern p-4 md:p-6 lg:p-8 text-gray-200">
            {/* Header */}
            <motion.header
                className="mb-10 text-center relative max-w-4xl mx-auto"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center justify-center gap-4 mb-2">
                    <div className="w-16 h-1 bg-gradient-to-r from-transparent to-cyan-500 rounded-full" />
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white" style={{ textShadow: '0 0 30px rgba(0,245,255,0.3)' }}>
                        <span className="text-cyan-400">ECHO</span> CITY BRAIN
                    </h1>
                    <div className="w-16 h-1 bg-gradient-to-l from-transparent to-cyan-500 rounded-full" />
                </div>

                <p className="text-cyan-400/80 text-sm font-mono tracking-wide uppercase mb-4">
                    Infinite Context Memory Layer | Powered by Bear-1 + Gemini
                </p>

                <div className="inline-block px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-sm">
                    <p className="text-cyan-200 text-xs">
                        &quot;Without Echo, the City Brain is <span className="line-through opacity-50">stateless</span>.
                        With Echo, it becomes <strong className="text-white text-shadow-cyan">STATEFUL</strong>.&quot;
                    </p>
                </div>
            </motion.header>

            <div className="max-w-[1600px] mx-auto space-y-6">
                {/* Top Row: Agent Panels */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <AgentPanel agent="traffic" logs={logs} isActive={true} />
                    <AgentPanel agent="power" logs={logs} isActive={true} />
                    <AgentPanel agent="emergency" logs={logs} isActive={true} />
                    <AgentPanel agent="security" logs={logs} isActive={true} />
                </div>

                {/* Middle Row: Compression Engine Viz */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:min-h-[400px]">
                    {/* Left Column: Stats & Timeline */}
                    <div className="lg:col-span-3 flex flex-col gap-4">
                        <CompressionStats stats={compressionStats} />
                        <div className="flex-1">
                            <MemoryTimeline />
                        </div>
                    </div>

                    {/* Center Column: Visual Proof (Main Focus) */}
                    <div className="lg:col-span-5 h-full">
                        <CompressionProof rawLogs={logs} compressed={compressedContent} />
                    </div>

                    {/* Right Column: Brain & Output */}
                    <div className="lg:col-span-4 flex flex-col gap-4 h-full">
                        <div className="flex-1">
                            <CityBrainOutput
                                decision={decision}
                                isThinking={isThinking}
                                onSpeak={handleSpeak}
                            />
                        </div>
                        <ArizeObservability
                            decision={decision}
                            compressionRatio={compressionStats?.compressionRatio || 0}
                        />
                    </div>
                </div>

                {/* Bottom Row: Controls & Impact */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-end">
                    <ImpactMetrics />
                    <EmergencyButton
                        onTrigger={handleEmergency}
                        isActive={isEmergencyActive}
                    />
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-12 text-center text-gray-600 text-xs font-mono">
                <p>&quot;THE CITY NEVER FORGETS&quot;</p>
                <div className="flex justify-center gap-4 mt-2 opacity-50 hover:opacity-100 transition-opacity">
                    <span>SYSTEM VER: 2.0.4-CYBER</span>
                    <span>•</span>
                    <span>LATENCY: 12ms</span>
                    <span>•</span>
                    <span>ENCRYPTION: AES-256</span>
                </div>
            </footer>
        </div>
    );
}
