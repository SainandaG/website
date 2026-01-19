import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sigma, BrainCircuit, Activity } from 'lucide-react';

const EvolutionMathOverlay = ({ snapshot }) => {
    if (!snapshot) return null;

    // Aggregate values for math visualization
    const avgGlow = snapshot.global_metrics?.intelligence_score || 0;
    const avgVitality = snapshot.global_metrics?.avg_vitality || 0;
    const density = snapshot.global_metrics?.data_density || 0;

    return (
        <div className="fixed top-24 left-[300px] w-[350px] z-40 pointer-events-none">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-slate-900/40 backdrop-blur-sm border border-white/5 rounded-2xl p-5 shadow-2xl"
            >
                <div className="flex items-center gap-2 mb-6 text-indigo-400">
                    <Sigma size={18} />
                    <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Neural Mathematics (Director Formulation)</h3>
                </div>

                <div className="space-y-6">
                    {/* Glow Formula */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Node Glow (G)</span>
                            <span className="text-xs font-mono text-indigo-300">avg: {avgGlow}</span>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 font-mono text-[10px] text-slate-300">
                            <div className="text-indigo-400 mb-1">Γ(v) = α · log₁₀(N + 1) + β · C</div>
                            <div className="text-[8px] text-slate-500">
                                α=0.8, β=0.6 | N={density.toLocaleString()} | C=1.5
                            </div>
                        </div>
                    </div>

                    {/* Vitality Formula */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-end">
                            <span className="text-[9px] text-slate-500 uppercase font-bold tracking-widest">Neural Vitality (V)</span>
                            <span className="text-xs font-mono text-emerald-300">{avgVitality}%</span>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg border border-white/5 font-mono text-[10px] text-slate-300">
                            <div className="text-emerald-400 mb-1">V(t) = min(100, Φ(N) + Ψ(I))</div>
                            <div className="text-[8px] text-slate-500">
                                Φ=log-growth, Ψ=static-weight
                            </div>
                        </div>
                    </div>

                    {/* Simulation Engine Status */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                            <span className="text-[8px] text-slate-400 uppercase font-bold">Evolution Engine Active</span>
                        </div>
                        <div className="text-[8px] text-indigo-400 font-mono">
                            STEP_RESOLUTION: 50kf
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default EvolutionMathOverlay;
