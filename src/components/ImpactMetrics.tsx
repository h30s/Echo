import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

export default function ImpactMetrics() {
    const metrics = [
        { label: 'Response Time', before: '18min', after: '6min', improvement: '67%', color: 'text-green-400', unit: 'FASTER' },
        { label: 'Context Window', before: '5min', after: '7 DAYS', improvement: '2016x', color: 'text-cyan-400', unit: 'MORE' },
        { label: 'Token Savings', value: '90%', subtext: '$2.4M/year', color: 'text-yellow-400' },
        { label: 'System Uptime', value: '99.99%', subtext: '0 downtime', color: 'text-green-400' },
    ];

    return (
        <motion.div
            className="cyber-card group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
        >
            <div className="flex items-center gap-2 mb-4">
                <Activity className="w-5 h-5 text-green-400" />
                <h3 className="font-bold text-sm tracking-wider uppercase text-green-400">System Impact Metrics</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {metrics.map((metric, i) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 + i * 0.1 }}
                        className="bg-black/40 border border-white/5 p-3 rounded-lg text-center relative overflow-hidden group/metric hover:border-white/20 transition-colors"
                    >
                        {/* Hover Glow */}
                        <div className="absolute inset-0 bg-white/5 opacity-0 group-hover/metric:opacity-100 transition-opacity pointer-events-none" />

                        <p className="text-gray-500 text-[10px] uppercase font-bold mb-2">{metric.label}</p>

                        {metric.before ? (
                            <div className="flex flex-col items-center justify-between h-20">
                                <div className="flex items-center gap-2 text-xs text-gray-600 line-through decoration-red-500/50">
                                    {metric.before}
                                </div>
                                <div className={`text-xl font-bold ${metric.color} font-mono`}>
                                    {metric.after}
                                </div>
                                <div className={`text-[10px] font-bold ${metric.color} bg-white/5 px-2 py-0.5 rounded-full`}>
                                    ▲ {metric.improvement} {metric.unit}
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-20">
                                <div className={`text-2xl font-bold ${metric.color} font-mono mb-1`}>{metric.value}</div>
                                {metric.subtext && <div className="text-[10px] text-gray-400">{metric.subtext}</div>}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
