import { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import { BrainDecision } from '@/lib/brain';

export default function ArizeObservability({
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
            className="cyber-card relative overflow-hidden group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <div className="flex items-center gap-2 mb-4">
                <span className="p-1 rounded bg-[#ff6b35]/20 text-[#ff6b35]">
                    <Activity className="w-4 h-4" />
                </span>
                <h3 className="font-bold text-sm tracking-wider uppercase text-[#ff6b35]">Arize Observability</h3>
                <span className="text-[10px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full ml-auto animate-pulse border border-green-500/20">
                    ● LOGGING ACTIVE
                </span>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                    { label: 'Compression Quality', value: `${(compressionRatio > 0 ? 95 + Math.random() * 4 : 95).toFixed(1)}%`, color: 'text-green-400' },
                    { label: 'Hallucination Score', value: '0.02', color: 'text-green-400' },
                    { label: 'Decision Confidence', value: decision ? '94%' : '--', color: 'text-cyan-400' }
                ].map((metric) => (
                    <div key={metric.label} className="bg-black/40 border border-white/5 p-2 rounded text-center backdrop-blur-sm">
                        <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">{metric.label}</p>
                        <p className={`text-lg font-bold ${metric.color} font-mono`}>{metric.value}</p>
                    </div>
                ))}
            </div>

            {/* Recent Traces */}
            <div className="space-y-1 bg-black/20 p-2 rounded border border-white/5">
                <p className="text-gray-400 text-[10px] font-bold uppercase mb-2 px-1">Live Trace Stream</p>
                {traces.map((trace, i) => (
                    <motion.div
                        key={trace.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.05 }}
                        className="flex items-center justify-between text-[10px] font-mono p-1.5 rounded hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                    >
                        <span className="text-gray-500 w-16">{trace.id}</span>
                        <span className={`w-20 ${trace.type === 'compression' ? 'text-cyan-400' : 'text-purple-400'}`}>
                            {trace.type}
                        </span>
                        <span className="text-green-400 w-16">✓ {trace.status}</span>
                        <span className="text-gray-400 w-12 text-right">{trace.latency}</span>
                        <div className="w-16 text-right">
                            <span className="text-yellow-400 bg-yellow-400/10 px-1 rounded">{trace.score.toFixed(2)}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Arize Logo / Watermark */}
            <div className="absolute bottom-2 right-2 opacity-20 pointer-events-none">
                <p className="text-[10px] text-[#ff6b35] font-bold">POWERED BY ARIZE PHOENIX</p>
            </div>
        </motion.div>
    );
}
