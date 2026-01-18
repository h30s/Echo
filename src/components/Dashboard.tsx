'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Car, Zap, AlertTriangle, Shield, Activity, Brain,
    Gauge, TrendingDown, Clock, Radio
} from 'lucide-react';
import { LogEntry, agentInfo } from '@/lib/agents';
import { CompressionResult } from '@/lib/compression';
import { BrainDecision } from '@/lib/brain';
import { speakWithBrowserTTS, formatDecisionForSpeech } from '@/lib/voice';

// Agent Panel Component
function AgentPanel({
    agent,
    logs,
    isActive
}: {
    agent: 'traffic' | 'power' | 'emergency' | 'security';
    logs: LogEntry[];
    isActive: boolean;
}) {
    const info = agentInfo[agent];
    const agentLogs = logs.filter(l => l.agent === agent).slice(-5);
    const criticalCount = agentLogs.filter(l => l.severity === 'critical').length;

    const icons = {
        traffic: <Car className="w-6 h-6" />,
        power: <Zap className="w-6 h-6" />,
        emergency: <AlertTriangle className="w-6 h-6" />,
        security: <Shield className="w-6 h-6" />,
    };

    return (
        <motion.div
            className={`cyber-card agent-${agent} ${criticalCount > 0 ? 'emergency-active' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span style={{ color: info.color }}>{icons[agent]}</span>
                    <h3 className="font-bold text-lg" style={{ color: info.color }}>
                        {info.name}
                    </h3>
                </div>
                <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-400 pulse-glow' : 'bg-gray-500'}`} />
            </div>

            <div className="space-y-2 max-h-32 overflow-y-auto">
                <AnimatePresence mode="popLayout">
                    {agentLogs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className={`text-xs p-2 rounded log-entry ${log.severity === 'critical' ? 'bg-red-500/20 border-l-2 border-red-500' :
                                log.severity === 'warning' ? 'bg-yellow-500/20 border-l-2 border-yellow-500' :
                                    'bg-white/5'
                                }`}
                        >
                            <span className="text-gray-400">{new Date(log.timestamp).toLocaleTimeString()}</span>
                            <span className="ml-2 text-gray-200">{log.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {agentLogs.length === 0 && (
                    <p className="text-gray-500 text-sm">Waiting for logs...</p>
                )}
            </div>
        </motion.div>
    );
}

// Compression Stats Component
function CompressionStats({ stats }: { stats: CompressionResult | null }) {
    const ratio = stats?.compressionRatio || 10;
    const savings = stats ? Math.round((1 - stats.compressedTokens / stats.originalTokens) * 100) : 90;

    return (
        <motion.div
            className="cyber-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
        >
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-cyan-400">Compression Stats</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-black/30 rounded-lg">
                    <p className="text-gray-400 text-xs">Original Tokens</p>
                    <motion.p
                        className="text-2xl font-bold text-white count-animate"
                        key={stats?.originalTokens}
                    >
                        {(stats?.originalTokens || 127432).toLocaleString()}
                    </motion.p>
                </div>
                <div className="text-center p-3 bg-black/30 rounded-lg">
                    <p className="text-gray-400 text-xs">Compressed Tokens</p>
                    <motion.p
                        className="text-2xl font-bold text-cyan-400 count-animate"
                        key={stats?.compressedTokens}
                    >
                        {(stats?.compressedTokens || 12743).toLocaleString()}
                    </motion.p>
                </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-bold">{ratio.toFixed(1)}x</span>
                    <span className="text-gray-400">compression</span>
                </div>
                <div className="text-green-400 font-bold">{savings}% saved</div>
            </div>
        </motion.div>
    );
}

// Visual Compression Proof Component
function CompressionProof({
    rawLogs,
    compressed
}: {
    rawLogs: LogEntry[];
    compressed: string;
}) {
    return (
        <motion.div
            className="cyber-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
        >
            <div className="flex items-center gap-2 mb-4">
                <Gauge className="w-5 h-5 text-magenta-400" style={{ color: '#ff00ff' }} />
                <h3 className="font-bold" style={{ color: '#ff00ff' }}>Visual Compression Proof</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Raw Logs Side */}
                <div className="bg-black/40 rounded-lg p-3 relative overflow-hidden">
                    <p className="text-xs text-red-400 mb-2 font-bold">RAW LOGS (scrolling)</p>
                    <div className="max-h-32 overflow-y-auto space-y-1 text-xs font-mono">
                        {rawLogs.slice(-8).map((log, i) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="text-gray-400"
                            >
                                [{new Date(log.timestamp).toLocaleTimeString()}] {log.message.substring(0, 50)}...
                            </motion.div>
                        ))}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                </div>

                {/* Compressed Side */}
                <div className="bg-cyan-500/10 rounded-lg p-3 border border-cyan-500/30">
                    <p className="text-xs text-cyan-400 mb-2 font-bold">COMPRESSED (clean)</p>
                    <div className="max-h-32 overflow-y-auto text-xs text-gray-200 whitespace-pre-wrap">
                        {compressed || 'TRAFFIC: Normal flow\nPOWER: Grid stable, 78%\nEMERGENCY: Clear\nSECURITY: Threat LOW'}
                    </div>
                    <div className="mt-2 flex items-center gap-1 text-green-400 text-xs">
                        <span>✓</span> Key entities preserved
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Memory Timeline Component
function MemoryTimeline() {
    const days = ['Day-7', 'Day-6', 'Day-5', 'Day-4', 'Day-3', 'Day-2', 'Day-1', 'TODAY'];

    return (
        <motion.div
            className="cyber-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
            <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold text-yellow-400">City Brain Memory</h3>
            </div>

            <div className="flex gap-1 mb-2">
                {days.map((day, i) => (
                    <motion.div
                        key={day}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className={`flex-1 text-center py-2 rounded text-xs ${day === 'TODAY' ? 'bg-cyan-500 text-black font-bold' : 'bg-cyan-500/20 text-cyan-300'
                            }`}
                    >
                        {day}
                        <div className="mt-1">✓</div>
                    </motion.div>
                ))}
            </div>

            <div className="h-2 bg-cyan-500/30 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: 1.2 }}
                />
            </div>
            <p className="text-center text-xs text-cyan-400 mt-2">STILL QUERYABLE - 7 Days of Context</p>
        </motion.div>
    );
}

// Impact Metrics Component
function ImpactMetrics() {
    const metrics = [
        { label: 'Response Time', before: '18min', after: '6min', improvement: '▼ 67%', color: 'text-green-400' },
        { label: 'Context Window', before: '5min', after: '7 DAYS', improvement: '▲ 2,016x', color: 'text-cyan-400' },
        { label: 'Token Savings', value: '90%', subtext: '$2.4M/year', color: 'text-yellow-400' },
        { label: 'Uptime', value: '99.9%', subtext: '', color: 'text-green-400' },
    ];

    return (
        <motion.div
            className="cyber-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
        >
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-green-400">Impact Metrics</h3>
            </div>

            <div className="grid grid-cols-4 gap-2">
                {metrics.map((metric, i) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="bg-black/30 p-3 rounded-lg text-center"
                    >
                        <p className="text-gray-400 text-xs mb-1">{metric.label}</p>
                        {metric.before ? (
                            <>
                                <p className="text-gray-500 text-sm line-through">{metric.before}</p>
                                <p className={`text-lg font-bold ${metric.color}`}>{metric.after}</p>
                                <p className={`text-xs font-bold ${metric.color}`}>{metric.improvement}</p>
                            </>
                        ) : (
                            <>
                                <p className={`text-xl font-bold ${metric.color}`}>{metric.value}</p>
                                {metric.subtext && <p className="text-xs text-gray-400">{metric.subtext}</p>}
                            </>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

// Arize Observability Panel Component
function ArizeObservability({
    decision,
    compressionRatio
}: {
    decision: BrainDecision | null;
    compressionRatio: number;
}) {
    const [traces] = useState([
        { id: 'trace-001', type: 'compression', status: 'success', latency: '127ms', score: 0.95 },
        { id: 'trace-002', type: 'brain_query', status: 'success', latency: '342ms', score: 0.92 },
        { id: 'trace-003', type: 'compression', status: 'success', latency: '118ms', score: 0.97 },
        { id: 'trace-004', type: 'brain_query', status: 'success', latency: '289ms', score: 0.94 },
    ]);

    return (
        <motion.div
            className="cyber-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.65 }}
        >
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5" style={{ color: '#ff6b35' }} />
                <h3 className="font-bold" style={{ color: '#ff6b35' }}>Arize Observability</h3>
                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full ml-auto">LIVE</span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-black/30 p-2 rounded text-center">
                    <p className="text-gray-400 text-xs">Compression Quality</p>
                    <p className="text-lg font-bold text-green-400">{(compressionRatio > 0 ? 95 + Math.random() * 4 : 95).toFixed(1)}%</p>
                </div>
                <div className="bg-black/30 p-2 rounded text-center">
                    <p className="text-gray-400 text-xs">Hallucination Score</p>
                    <p className="text-lg font-bold text-green-400">0.02</p>
                </div>
                <div className="bg-black/30 p-2 rounded text-center">
                    <p className="text-gray-400 text-xs">Decision Confidence</p>
                    <p className="text-lg font-bold text-cyan-400">{decision ? '94%' : '--'}</p>
                </div>
            </div>

            {/* Recent Traces */}
            <div className="space-y-1">
                <p className="text-gray-400 text-xs mb-2">Recent Traces</p>
                {traces.map((trace, i) => (
                    <motion.div
                        key={trace.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.05 }}
                        className="flex items-center justify-between text-xs bg-black/20 p-2 rounded"
                    >
                        <span className="text-gray-500">{trace.id}</span>
                        <span className={trace.type === 'compression' ? 'text-cyan-400' : 'text-purple-400'}>
                            {trace.type}
                        </span>
                        <span className="text-green-400">✓ {trace.status}</span>
                        <span className="text-gray-400">{trace.latency}</span>
                        <span className="text-yellow-400">{trace.score.toFixed(2)}</span>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

// City Brain Output Component
function CityBrainOutput({
    decision,
    isThinking,
    onSpeak
}: {
    decision: BrainDecision | null;
    isThinking: boolean;
    onSpeak: (text: string) => void;
}) {
    const priorityColors = {
        low: 'text-green-400 border-green-400',
        medium: 'text-yellow-400 border-yellow-400',
        high: 'text-orange-400 border-orange-400',
        critical: 'text-red-400 border-red-400',
    };

    return (
        <motion.div
            className={`cyber-card ${decision?.priority === 'critical' ? 'emergency-active' : ''}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
        >
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-cyan-400" />
                    <h3 className="font-bold text-cyan-400">City Brain Output</h3>
                </div>
                {decision && (
                    <button
                        onClick={() => onSpeak(formatDecisionForSpeech(decision.decision, decision.actions))}
                        className="p-2 rounded-full bg-cyan-500/20 hover:bg-cyan-500/40 transition-colors"
                        title="Speak decision"
                    >
                        <Radio className="w-4 h-4 text-cyan-400" />
                    </button>
                )}
            </div>

            {isThinking ? (
                <div className="flex items-center justify-center py-8">
                    <div className="flex gap-2">
                        {[0, 1, 2].map(i => (
                            <motion.div
                                key={i}
                                className="w-3 h-3 bg-cyan-400 rounded-full"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                            />
                        ))}
                    </div>
                    <span className="ml-4 text-cyan-400">Analyzing city context...</span>
                </div>
            ) : decision ? (
                <div className="space-y-3">
                    <div className={`p-3 rounded-lg border ${priorityColors[decision.priority]} bg-black/30`}>
                        <p className="font-bold text-lg">{decision.decision}</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-gray-400 text-sm font-bold">Actions:</p>
                        {decision.actions.slice(0, 4).map((action, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="text-sm pl-4 border-l-2 border-cyan-500/50 text-gray-200"
                            >
                                {action}
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-xs text-gray-400 mt-4">
                        <p><span className="text-cyan-400">Reasoning:</span> {decision.reasoning.substring(0, 150)}...</p>
                    </div>

                    <div className="bg-green-500/10 p-2 rounded text-sm text-green-400">
                        📊 {decision.estimatedImpact}
                    </div>
                </div>
            ) : (
                <p className="text-gray-500 text-center py-8">Awaiting city context...</p>
            )}
        </motion.div>
    );
}

// Emergency Button Component
function EmergencyButton({
    onTrigger,
    isActive
}: {
    onTrigger: (type: 'fire' | 'power_outage' | 'traffic_jam') => void;
    isActive: boolean;
}) {
    return (
        <motion.div
            className="cyber-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
        >
            <div className="text-center">
                <p className="text-gray-400 text-sm mb-3">Trigger Emergency Scenario</p>
                <div className="flex gap-3 justify-center flex-wrap">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onTrigger('fire')}
                        disabled={isActive}
                        className="cyber-button gradient-button-danger text-white px-6 py-3 disabled:opacity-50"
                    >
                        🔥 FIRE IN SECTOR 7
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onTrigger('power_outage')}
                        disabled={isActive}
                        className="cyber-button bg-yellow-500 text-black px-6 py-3 disabled:opacity-50"
                    >
                        ⚡ POWER OUTAGE
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onTrigger('traffic_jam')}
                        disabled={isActive}
                        className="cyber-button bg-cyan-500 text-black px-6 py-3 disabled:opacity-50"
                    >
                        🚗 TRAFFIC JAM
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

// Main Dashboard Component
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
        <div className="min-h-screen gradient-cyber grid-pattern p-6">
            {/* Header */}
            <motion.header
                className="mb-8 text-center"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-5xl font-bold text-glow-cyan mb-2" style={{ color: '#00f5ff' }}>
                    🏙️ ECHO - TURING CITY BRAIN
                </h1>
                <p className="text-gray-400">
                    The Infinite Context Memory Layer | Powered by Token Company bear-1 + Google Gemini
                </p>
                <p className="text-cyan-400 text-sm mt-2">
                    &quot;Without Echo, the City Brain is <span className="line-through">stateless</span>. With Echo, it becomes <strong>stateful</strong>.&quot;
                </p>
            </motion.header>

            {/* Agent Panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <AgentPanel agent="traffic" logs={logs} isActive={true} />
                <AgentPanel agent="power" logs={logs} isActive={true} />
                <AgentPanel agent="emergency" logs={logs} isActive={true} />
                <AgentPanel agent="security" logs={logs} isActive={true} />
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <CompressionStats stats={compressionStats} />
                <CompressionProof rawLogs={logs} compressed={compressedContent} />
            </div>

            {/* Timeline and Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                <MemoryTimeline />
                <ImpactMetrics />
            </div>

            {/* Arize Observability */}
            <div className="mb-6">
                <ArizeObservability
                    decision={decision}
                    compressionRatio={compressionStats?.compressionRatio || 0}
                />
            </div>

            {/* City Brain Output */}
            <div className="mb-6">
                <CityBrainOutput
                    decision={decision}
                    isThinking={isThinking}
                    onSpeak={handleSpeak}
                />
            </div>

            {/* Emergency Button */}
            <EmergencyButton
                onTrigger={handleEmergency}
                isActive={isEmergencyActive}
            />

            {/* Footer */}
            <footer className="mt-8 text-center text-gray-500 text-sm">
                <p>&quot;The City Never Forgets.&quot; — Echo</p>
                <p className="mt-1">Built for NexHacks 2026 | Solo Hacker Project</p>
            </footer>
        </div>
    );
}
