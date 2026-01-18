import { motion } from 'framer-motion';
import { Gauge } from 'lucide-react';
import { LogEntry } from '@/lib/agents';

export default function CompressionProof({
    rawLogs,
    compressed
}: {
    rawLogs: LogEntry[];
    compressed: string;
}) {
    return (
        <motion.div
            className="cyber-card relative overflow-hidden group h-full flex flex-col"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
        >
            {/* Background Matrix Effect */}
            <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif')] bg-cover mix-blend-screen opacity-[0.05]" />

            <div className="flex items-center gap-2 mb-4 px-2 relative z-10">
                <Gauge className="w-5 h-5 text-magenta-400" style={{ color: '#ff00ff' }} />
                <h3 className="font-bold text-sm tracking-wider uppercase" style={{ color: '#ff00ff' }}>Visual Compression Proof</h3>
                <span className="ml-auto text-[10px] bg-magenta-500/10 text-magenta-300 px-2 py-0.5 rounded border border-magenta-500/20">
                    SEMANTIC RETENTION: 95%
                </span>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1 relative z-10 min-h-0">
                {/* Raw Logs Side */}
                <div className="bg-black/60 rounded-lg border border-red-500/20 relative overflow-hidden flex flex-col h-full">
                    <div className="bg-red-500/10 p-2 border-b border-red-500/20 flex justify-between items-center">
                        <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">Raw Input Stream</p>
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    </div>

                    <div className="overflow-hidden relative flex-1">
                        <div className="absolute inset-0 space-y-1 p-3 text-[10px] font-mono opacity-80">
                            {/* Simulated endless scroll effect */}
                            <motion.div
                                animate={{ y: [0, -100] }}
                                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                            >
                                {rawLogs.slice(-15).map((log, i) => (
                                    <div key={`${log.id}-${i}`} className="truncate text-gray-400 border-b border-white/5 py-0.5">
                                        <span className="text-gray-600 mr-2">[{new Date(log.timestamp).toLocaleTimeString("en-US", { hour12: false })}]</span>
                                        <span className={log.severity === 'critical' ? 'text-red-400' : ''}>{log.message}</span>
                                    </div>
                                ))}
                                {rawLogs.length < 5 && <div className="text-gray-600 italic">Waiting for stream...</div>}
                            </motion.div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none" />
                    </div>
                </div>

                {/* Compressed Side */}
                <div className="bg-cyan-900/10 rounded-lg border border-cyan-500/30 relative overflow-hidden flex flex-col h-full">
                    <div className="bg-cyan-500/10 p-2 border-b border-cyan-500/20 flex justify-between items-center">
                        <p className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Compressed Context</p>
                        <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#00f5ff]" />
                    </div>

                    <div className="p-3 text-[10px] text-cyan-100 font-mono whitespace-pre-wrap leading-relaxed flex-1 overflow-y-auto custom-scrollbar">
                        {compressed ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key={compressed}
                            >
                                <span className="text-cyan-500/50 select-none">{'>>> START CONTEXT PACKET'}</span>
                                <br />
                                {compressed}
                                <br />
                                <span className="text-cyan-500/50 select-none">{'<<< END PACKET'}</span>
                            </motion.div>
                        ) : (
                            <div className="text-cyan-500/40 italic mt-4 text-center">
                                Awaiting data packet...
                            </div>
                        )}
                    </div>

                    <div className="p-2 border-t border-cyan-500/20 bg-cyan-500/5 flex items-center justify-between text-[10px]">
                        <span className="text-cyan-300">Entities Extracted</span>
                        <div className="flex gap-1">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-1.5 h-1.5 bg-cyan-400 rounded-full opacity-50" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Center Connection Graphic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black border border-gray-700 z-20 flex items-center justify-center">
                <TrendingDownIcon className="w-4 h-4 text-white rotate-[-90deg]" />
            </div>
        </motion.div>
    );
}

function TrendingDownIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            style={style}
        >
            <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
            <polyline points="17 18 23 18 23 12"></polyline>
        </svg>
    )
}
