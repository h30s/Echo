import { motion } from 'framer-motion';
import { Activity, TrendingDown } from 'lucide-react';
import { CompressionResult } from '@/lib/compression';

export default function CompressionStats({ stats }: { stats: CompressionResult | null }) {
    const ratio = stats?.compressionRatio || 10;
    const savings = stats ? Math.round((1 - stats.compressedTokens / stats.originalTokens) * 100) : 90;

    return (
        <motion.div
            className="cyber-card relative overflow-hidden group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <div className="absolute top-0 right-0 p-3 opacity-10">
                <Activity className="w-24 h-24 text-cyan-400" />
            </div>

            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shadow-[0_0_15px_rgba(0,245,255,0.3)]">
                    <Activity className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-gray-100 text-sm tracking-wider uppercase">Compression Efficiency</h3>
                    <p className="text-[10px] text-cyan-400/80 font-mono">BEAR-1 MODEL ACTIVE</p>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="relative group/stat">
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent rounded-lg" />
                    <div className="text-center p-4 border border-cyan-500/10 rounded-lg backdrop-blur-sm">
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Raw Tokens</p>
                        <motion.p
                            className="text-2xl font-bold text-white font-mono tracking-tighter"
                            key={stats?.originalTokens}
                            initial={{ scale: 1.1, color: '#fff' }}
                            animate={{ scale: 1, color: '#e5e7eb' }}
                        >
                            {(stats?.originalTokens || 127432).toLocaleString()}
                        </motion.p>
                    </div>
                </div>

                <div className="relative group/stat">
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-lg" />
                    <div className="text-center p-4 border border-green-500/10 rounded-lg backdrop-blur-sm">
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1">Compressed</p>
                        <motion.p
                            className="text-2xl font-bold text-green-400 font-mono tracking-tighter shadow-green-400/20 text-shadow"
                            key={stats?.compressedTokens}
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                        >
                            {(stats?.compressedTokens || 12743).toLocaleString()}
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Progress Bar Visual */}
            <div className="mt-6 relative z-10">
                <div className="flex justify-between text-xs mb-2">
                    <div className="flex items-center gap-2 text-cyan-400">
                        <TrendingDown className="w-4 h-4" />
                        <span className="font-bold font-mono">{ratio.toFixed(1)}x RATIO</span>
                    </div>
                    <span className="text-green-400 font-bold font-mono">{savings}% SAVED</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${savings}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                    />
                </div>
                <p className="text-[10px] text-gray-500 mt-2 text-right font-mono">
                    TOKEN COST REDUCTION: <span className="text-white">$2.4M/YR (EST)</span>
                </p>
            </div>
        </motion.div>
    );
}
