import { motion } from 'framer-motion';
import { Brain, Radio } from 'lucide-react';
import { BrainDecision } from '@/lib/brain';
import { formatDecisionForSpeech } from '@/lib/voice';

export default function CityBrainOutput({
    decision,
    isThinking,
    onSpeak
}: {
    decision: BrainDecision | null;
    isThinking: boolean;
    onSpeak: (text: string) => void;
}) {
    const priorityColors = {
        low: 'text-green-400 border-green-500/30 bg-green-500/5',
        medium: 'text-yellow-400 border-yellow-500/30 bg-yellow-500/5',
        high: 'text-orange-400 border-orange-500/30 bg-orange-500/5',
        critical: 'text-red-400 border-red-500/30 bg-red-500/5',
    };

    return (
        <motion.div
            className={`cyber-card relative overflow-hidden group min-h-[300px] flex flex-col
                ${decision?.priority === 'critical' ? 'shadow-[0_0_30px_rgba(248,113,113,0.3)] animate-pulse-slow' : 'shadow-[0_0_20px_rgba(0,245,255,0.1)]'}
            `}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
        >
            {/* Background Element */}
            <div className="absolute -right-10 -top-10 opacity-10 pointer-events-none">
                <Brain className="w-64 h-64 text-cyan-500" />
            </div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(0,245,255,0.4)]">
                        <Brain className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg tracking-wider text-cyan-400 uppercase">City Brain Core</h3>
                        <div className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${isThinking ? 'bg-yellow-400 animate-ping' : 'bg-green-400'}`} />
                            <span className="text-[10px] text-gray-400 font-mono uppercase">
                                {isThinking ? 'PROCESSING CONTEXT...' : 'SYSTEM STANDBY'}
                            </span>
                        </div>
                    </div>
                </div>
                {decision && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSpeak(formatDecisionForSpeech(decision.decision, decision.actions))}
                        className="p-3 rounded-full bg-cyan-500/10 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-500/30 transition-all shadow-[0_0_15px_rgba(0,245,255,0.2)]"
                        title="Broadcast Decision"
                    >
                        <Radio className="w-5 h-5" />
                    </motion.button>
                )}
            </div>

            <div className="flex-1 relative z-10 flex flex-col justify-center">
                {isThinking ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="relative w-20 h-20">
                            <motion.span
                                className="absolute inset-0 border-4 border-cyan-500/30 rounded-full"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <motion.span
                                className="absolute inset-0 border-4 border-t-cyan-400 rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                        </div>
                        <p className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse">ANALYZING GEOSPATIAL DATA...</p>
                    </div>
                ) : decision ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className={`p-4 rounded-lg border-l-4 ${priorityColors[decision.priority]} backdrop-blur-md`}>
                            <p className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-1">Recommended Action</p>
                            <p className="font-bold text-xl leading-relaxed">{decision.decision}</p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest pl-1">Execution Plan</p>
                            {decision.actions.map((action, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex items-center gap-3 text-sm p-3 bg-white/5 rounded-r border-l-2 border-cyan-500/50 hover:bg-white/10 transition-colors"
                                >
                                    <span className="text-cyan-400 font-mono">[{String(i + 1).padStart(2, '0')}]</span>
                                    <span className="text-gray-200">{action}</span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5 flex gap-4">
                            <div className="flex-1">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Reasoning Engine</p>
                                <p className="text-xs text-gray-400 italic leading-relaxed">
                                    &quot;{decision.reasoning}&quot;
                                </p>
                            </div>
                            <div className="w-24">
                                <p className="text-[10px] text-gray-500 font-bold uppercase mb-1">Impact Est.</p>
                                <div className="text-sm font-bold text-green-400 font-mono bg-green-500/10 p-1 rounded text-center border border-green-500/20">
                                    {decision.estimatedImpact}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8 opacity-50">
                        <Brain className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-500 font-mono text-sm">Awaiting city context packet...</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
