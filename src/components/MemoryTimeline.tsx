import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function MemoryTimeline() {
    const days = ['Day-7', 'Day-6', 'Day-5', 'Day-4', 'Day-3', 'Day-2', 'Day-1', 'TODAY'];

    return (
        <motion.div
            className="cyber-card relative group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold text-sm tracking-wider uppercase text-yellow-400">City Brain Memory</h3>
                <span className="ml-auto text-[10px] text-gray-500 font-mono">CONTEXT WINDOW EXTENDED</span>
            </div>

            <div className="flex gap-1 mb-2 relative">
                {days.map((day, i) => {
                    const isToday = day === 'TODAY';
                    return (
                        <motion.div
                            key={day}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: 0.3 + i * 0.1 }}
                            className={`flex-1 relative cursor-default group/day`}
                        >
                            <div className={`p-2 rounded-t text-center transition-all duration-300
                                ${isToday
                                    ? 'bg-cyan-500 text-black font-bold shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                                    : 'bg-cyan-900/30 text-cyan-400/60 hover:bg-cyan-500/20 hover:text-cyan-300'
                                }
                            `}>
                                <div className="text-[10px] uppercase font-mono mb-1">{day}</div>
                                <div className={`w-full h-1 rounded-full ${isToday ? 'bg-black' : 'bg-cyan-500/40'}`} />
                            </div>

                            {/* Hover tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover/day:opacity-100 transition-opacity pointer-events-none bg-black border border-cyan-500 text-cyan-400 text-[10px] p-1 px-2 rounded whitespace-nowrap z-20">
                                Context Available
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Visual connector line */}
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden relative mt-1">
                <div className="absolute inset-0 flex justify-between px-[6%]">
                    {/* Ticks */}
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-0.5 h-full bg-black/50" />
                    ))}
                </div>
                <motion.div
                    className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-yellow-300"
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, delay: 1 }}
                />
            </div>

            <div className="flex justify-between items-center mt-3">
                <p className="text-[10px] text-gray-500">RETENTION POLICY: <span className="text-gray-300">INFINITE (COMPRESSED)</span></p>
                <p className="text-xs text-cyan-400 font-bold tracking-wide animate-pulse">
                    🟢 7 DAYS OF CONTEXT ONLINE
                </p>
            </div>
        </motion.div>
    );
}
