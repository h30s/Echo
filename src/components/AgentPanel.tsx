import { motion, AnimatePresence } from 'framer-motion';
import { LogEntry, agentInfo } from '@/lib/agents';
import { Car, Zap, AlertTriangle, Shield } from 'lucide-react';

interface AgentPanelProps {
    agent: 'traffic' | 'power' | 'emergency' | 'security';
    logs: LogEntry[];
    isActive: boolean;
}

const icons = {
    traffic: <Car className="w-5 h-5" />,
    power: <Zap className="w-5 h-5" />,
    emergency: <AlertTriangle className="w-5 h-5" />,
    security: <Shield className="w-5 h-5" />,
};

export default function AgentPanel({ agent, logs, isActive }: AgentPanelProps) {
    const info = agentInfo[agent];
    const agentLogs = logs.filter(l => l.agent === agent).slice(-5);
    const criticalCount = agentLogs.filter(l => l.severity === 'critical').length;
    const isCritical = criticalCount > 0;

    return (
        <motion.div
            className={`cyber-card relative overflow-hidden group hover:border-opacity-100 transition-all duration-300
                ${isCritical ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-cyan-500/30'}
                ${agent === 'traffic' ? 'hover:border-cyan-400' : ''}
                ${agent === 'power' ? 'hover:border-yellow-400' : ''}
                ${agent === 'emergency' ? 'hover:border-red-400' : ''}
                ${agent === 'security' ? 'hover:border-magenta-400' : ''}
            `}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
        >
            {/* Background Grid Effect */}
            <div className={`absolute inset-0 opacity-[0.03] pointer-events-none 
                bg-[linear-gradient(rgba(0,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.1)_1px,transparent_1px)] 
                bg-[size:20px_20px]`}
            />

            {/* Header */}
            <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-opacity-20 backdrop-blur-sm
                        ${agent === 'traffic' ? 'bg-cyan-500 text-cyan-400' : ''}
                        ${agent === 'power' ? 'bg-yellow-500 text-yellow-400' : ''}
                        ${agent === 'emergency' ? 'bg-red-500 text-red-400' : ''}
                        ${agent === 'security' ? 'bg-fuchsia-500 text-fuchsia-400' : ''}
                    `}>
                        {icons[agent]}
                    </div>
                    <div>
                        <h3 className="font-bold text-sm tracking-wider uppercase" style={{ color: info.color }}>
                            {info.name}
                        </h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
                            <span className="text-[10px] text-gray-500 font-mono uppercase">
                                {isActive ? 'ONLINE' : 'OFFLINE'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Pill */}
                <div className={`px-2 py-0.5 rounded text-[10px] font-mono border ${isCritical
                        ? 'bg-red-500/20 text-red-400 border-red-500/50 animate-pulse'
                        : 'bg-green-500/10 text-green-400 border-green-500/30'
                    }`}>
                    {isCritical ? 'CRITICAL' : 'STABLE'}
                </div>
            </div>

            {/* Logs Area */}
            <div className="space-y-2 max-h-[140px] overflow-y-auto pr-1 custom-scrollbar relative z-10">
                <AnimatePresence mode="popLayout">
                    {agentLogs.map((log) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className={`text-xs p-2 rounded border-l-2 font-mono relative overflow-hidden
                                ${log.severity === 'critical'
                                    ? 'bg-red-500/10 border-red-500 text-red-200'
                                    : log.severity === 'warning'
                                        ? 'bg-yellow-500/10 border-yellow-500 text-yellow-200'
                                        : 'bg-white/5 border-gray-600 text-gray-400'
                                }
                            `}
                        >
                            <div className="flex justify-between items-start">
                                <span className="mb-0.5 block opacity-70 text-[10px]">
                                    {new Date(log.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                </span>
                            </div>
                            <span>{log.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
                {agentLogs.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-20 text-gray-600 space-y-2">
                        <div className="w-4 h-4 border-2 border-t-cyan-500 border-gray-700 rounded-full animate-spin" />
                        <p className="text-xs font-mono">Initializing Stream...</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

// Add these to global.css or local style block if "custom-scrollbar" isn't defined
// .custom-scrollbar::-webkit-scrollbar { width: 4px; }
// .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
// .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
