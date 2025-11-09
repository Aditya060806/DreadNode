import React, { useState } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { Shield, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const ThreatIntelligencePanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const threatIntelligence = useSimulationStore(s => s.threatIntelligence);
  const [selectedThreat, setSelectedThreat] = useState<string | null>(null);

  const getThreatColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-red-400 border-red-500';
      case 'high': return 'text-orange-400 border-orange-500';
      case 'medium': return 'text-yellow-400 border-yellow-500';
      case 'low': return 'text-green-400 border-green-500';
      default: return 'text-gray-400 border-gray-500';
    }
  };

  const getThreatBgColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-900/20';
      case 'high': return 'bg-orange-900/20';
      case 'medium': return 'bg-yellow-900/20';
      case 'low': return 'bg-green-900/20';
      default: return 'bg-gray-900/20';
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-20 right-4 bg-black/60 border border-cyan-500/30 rounded-lg px-4 py-2 text-cyan-300 font-mono text-sm hover:bg-cyan-900/40 transition-all duration-300 shadow-cyberpunk flex items-center gap-2"
      >
        <Shield className="w-4 h-4" />
        THREAT INTEL
      </button>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-black/95 border border-cyan-500/50 rounded-xl p-6 max-w-6xl w-full mx-4 shadow-cyberpunk max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-cyan-300 font-mono text-xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6" />
            THREAT INTELLIGENCE DASHBOARD
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-y-auto">
          {/* Real-time Threats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-cyan-400 font-mono text-sm font-bold flex items-center gap-2">
                <Activity className="w-4 h-4" />
                REAL-TIME THREATS
              </h3>
              <span className="text-xs font-mono text-green-400">
                LOCAL ANALYSIS
              </span>
            </div>

            {threatIntelligence.length === 0 ? (
              <div className="text-gray-400 text-sm font-mono text-center py-8 border border-gray-600 rounded-lg">
                No threats detected
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {threatIntelligence.slice(0, 10).map((threat) => (
                  <motion.div
                    key={threat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${getThreatBgColor(threat.threatLevel)} ${getThreatColor(threat.threatLevel)}`}
                    onClick={() => setSelectedThreat(selectedThreat === threat.id ? null : threat.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="font-mono text-xs font-bold uppercase">
                          {threat.threatLevel} THREAT
                        </div>
                        <div className="text-xs font-mono text-gray-300 mt-1">
                          {new Date(threat.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <div className="text-xs font-mono text-cyan-400">
                        {threat.attackType}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-gray-300 mb-2">
                      {threat.summary}
                    </div>
                    {selectedThreat === threat.id && (
                      <div className="mt-2 pt-2 border-t border-gray-600 space-y-2">
                        <div>
                          <div className="text-xs font-mono text-cyan-400 font-bold mb-1">ATTACK TYPE:</div>
                          <div className="text-xs font-mono text-gray-300">{threat.attackType}</div>
                        </div>
                        <div>
                          <div className="text-xs font-mono text-cyan-400 font-bold mb-1">THREAT LEVEL:</div>
                          <div className="text-xs font-mono text-gray-300 uppercase">{threat.threatLevel}</div>
                        </div>
                        <div>
                          <div className="text-xs font-mono text-cyan-400 font-bold mb-1">DETECTED:</div>
                          <div className="text-xs font-mono text-gray-300">
                            {new Date(threat.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Threat Statistics */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-cyan-400 font-mono text-sm font-bold flex items-center gap-2">
                <Activity className="w-4 h-4" />
                THREAT STATISTICS
              </h3>
            </div>

            <div className="space-y-3">
              <div className="border border-cyan-500/30 rounded-lg p-4">
                <div className="text-xs font-mono text-gray-300 mb-2">Total Threats Detected:</div>
                <div className="text-2xl font-mono text-cyan-400 font-bold">
                  {threatIntelligence.length}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="border border-red-500/30 rounded-lg p-3 bg-red-900/10">
                  <div className="text-xs font-mono text-gray-300">Critical</div>
                  <div className="text-lg font-mono text-red-400 font-bold">
                    {threatIntelligence.filter(t => t.threatLevel === 'critical').length}
                  </div>
                </div>
                <div className="border border-orange-500/30 rounded-lg p-3 bg-orange-900/10">
                  <div className="text-xs font-mono text-gray-300">High</div>
                  <div className="text-lg font-mono text-orange-400 font-bold">
                    {threatIntelligence.filter(t => t.threatLevel === 'high').length}
                  </div>
                </div>
                <div className="border border-yellow-500/30 rounded-lg p-3 bg-yellow-900/10">
                  <div className="text-xs font-mono text-gray-300">Medium</div>
                  <div className="text-lg font-mono text-yellow-400 font-bold">
                    {threatIntelligence.filter(t => t.threatLevel === 'medium').length}
                  </div>
                </div>
                <div className="border border-green-500/30 rounded-lg p-3 bg-green-900/10">
                  <div className="text-xs font-mono text-gray-300">Low</div>
                  <div className="text-lg font-mono text-green-400 font-bold">
                    {threatIntelligence.filter(t => t.threatLevel === 'low').length}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          .shadow-cyberpunk {
            box-shadow: 0 0 12px 2px #0ff, 0 0 32px 4px #f0f, 0 0 2px 0 #fff;
          }
        `}</style>
      </div>
    </div>
  );
};

export default ThreatIntelligencePanel;

