import { motion } from 'framer-motion';

export default function EmergencyButton({
    onTrigger,
    isActive
}: {
    onTrigger: (type: 'fire' | 'power_outage' | 'traffic_jam') => void;
    isActive: boolean;
}) {
    return (
        <motion.div
            className="cyber-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
        >
            <div className="text-center">
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest mb-4">
                    Wait for Logic to Start Simulation
                </p>

                <div className="flex gap-4 justify-center flex-wrap">
                    {[
                        { id: 'fire', label: '🔥 FIRE ALERT', style: 'gradient-button-danger text-white shadow-red-500/50' },
                        { id: 'power_outage', label: '⚡ GRID FAIL', style: 'bg-yellow-500 text-black shadow-yellow-500/50 hover:bg-yellow-400' },
                        { id: 'traffic_jam', label: '🚗 GRIDLOCK', style: 'bg-cyan-500 text-black shadow-cyan-500/50 hover:bg-cyan-400' }
                    ].map((btn) => (
                        <motion.button
                            key={btn.id}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onTrigger(btn.id as any)}
                            disabled={isActive}
                            className={`cyber-button shadow-lg ${btn.style} disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]`}
                        >
                            {btn.label}
                        </motion.button>
                    ))}
                </div>

                <p className="text-[10px] text-gray-600 mt-4 font-mono">
                    SIMULATION MODE: <span className="text-gray-400">ACTIVE</span> • SAFETY LOCKS: <span className="text-green-500">DISENGAGED</span>
                </p>
            </div>
        </motion.div>
    );
}
