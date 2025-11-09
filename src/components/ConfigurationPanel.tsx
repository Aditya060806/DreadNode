import React, { useState } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { isGeminiAvailable } from '../services/geminiService';

interface SimulationConfig {
  nodeCount: number;
  attackFrequency: number;
  healingRate: number;
  networkLatency: number;
  dataPacketRate: number;
  mlAnalysisInterval: number;
  reflexEfficiency: number;
  systemComplexity: number;
}

const ConfigurationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState<SimulationConfig>({
    nodeCount: 10,
    attackFrequency: 0.15,
    healingRate: 0.3,
    networkLatency: 50,
    dataPacketRate: 0.3,
    mlAnalysisInterval: 5000,
    reflexEfficiency: 0.7,
    systemComplexity: 0.5,
  });

  const geminiEnabled = useSimulationStore(s => s.geminiEnabled);
  const automatedDefenseEnabled = useSimulationStore(s => s.automatedDefenseEnabled);
  const setGeminiEnabled = useSimulationStore(s => s.setGeminiEnabled);
  const setAutomatedDefenseEnabled = useSimulationStore(s => s.setAutomatedDefenseEnabled);
  const geminiAvailable = isGeminiAvailable();

  const updateConfig = (key: keyof SimulationConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const applyConfig = () => {
    // Apply configuration to simulation
    useSimulationStore.getState().setSimulationSpeed(config.systemComplexity + 0.5);
    
    // Add log about configuration change
    useSimulationStore.getState().addLog(
      `Configuration updated: ${Object.keys(config).map(k => `${k}=${config[k as keyof SimulationConfig]}`).join(', ')}`,
      'medium',
      'system',
      'config-panel'
    );
    
    setIsOpen(false);
  };

  const resetToDefaults = () => {
    setConfig({
      nodeCount: 10,
      attackFrequency: 0.15,
      healingRate: 0.3,
      networkLatency: 50,
      dataPacketRate: 0.3,
      mlAnalysisInterval: 5000,
      reflexEfficiency: 0.7,
      systemComplexity: 0.5,
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-1/2 transform translate-x-1/2 bg-black/60 border border-cyan-500/30 rounded-lg px-4 py-2 text-cyan-300 font-mono text-sm hover:bg-cyan-900/40 transition-all duration-300 shadow-cyberpunk"
      >
        ⚙️ CONFIG
      </button>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-black/95 border border-cyan-500/50 rounded-xl p-6 max-w-2xl w-full mx-4 shadow-cyberpunk">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-cyan-300 font-mono text-xl font-bold">SIMULATION CONFIGURATION</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Node Configuration */}
          <div className="space-y-4">
            <h3 className="text-cyan-400 font-mono text-sm font-bold">NETWORK TOPOLOGY</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-mono text-sm">Node Count:</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={config.nodeCount}
                    onChange={e => updateConfig('nodeCount', parseInt(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-cyan-400 font-mono text-sm w-8">{config.nodeCount}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-mono text-sm">System Complexity:</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={config.systemComplexity}
                    onChange={e => updateConfig('systemComplexity', parseFloat(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-cyan-400 font-mono text-sm w-8">{config.systemComplexity.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attack Configuration */}
          <div className="space-y-4">
            <h3 className="text-red-400 font-mono text-sm font-bold">ATTACK SIMULATION</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-mono text-sm">Attack Frequency:</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.01"
                    max="0.5"
                    step="0.01"
                    value={config.attackFrequency}
                    onChange={e => updateConfig('attackFrequency', parseFloat(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-cyan-400 font-mono text-sm w-8">{(config.attackFrequency * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-mono text-sm">Reflex Efficiency:</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={config.reflexEfficiency}
                    onChange={e => updateConfig('reflexEfficiency', parseFloat(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-cyan-400 font-mono text-sm w-8">{(config.reflexEfficiency * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Configuration */}
          <div className="space-y-4">
            <h3 className="text-green-400 font-mono text-sm font-bold">PERFORMANCE</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-mono text-sm">Healing Rate:</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={config.healingRate}
                    onChange={e => updateConfig('healingRate', parseFloat(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-cyan-400 font-mono text-sm w-8">{(config.healingRate * 100).toFixed(0)}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-mono text-sm">Network Latency:</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={config.networkLatency}
                    onChange={e => updateConfig('networkLatency', parseInt(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-cyan-400 font-mono text-sm w-8">{config.networkLatency}ms</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-mono text-sm">Data Packet Rate:</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={config.dataPacketRate}
                    onChange={e => updateConfig('dataPacketRate', parseFloat(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-cyan-400 font-mono text-sm w-8">{(config.dataPacketRate * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* ML Configuration */}
          <div className="space-y-4">
            <h3 className="text-purple-400 font-mono text-sm font-bold">MACHINE LEARNING</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-mono text-sm">Analysis Interval:</span>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1000"
                    max="10000"
                    step="500"
                    value={config.mlAnalysisInterval}
                    onChange={e => updateConfig('mlAnalysisInterval', parseInt(e.target.value))}
                    className="w-32"
                  />
                  <span className="text-cyan-400 font-mono text-sm w-12">{config.mlAnalysisInterval}ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gemini AI Configuration */}
          <div className="space-y-4">
            <h3 className="text-cyan-400 font-mono text-sm font-bold">GEMINI AI</h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-mono text-sm">Gemini Status:</span>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono ${geminiAvailable ? 'text-green-400' : 'text-red-400'}`}>
                    {geminiAvailable ? 'AVAILABLE' : 'NOT CONFIGURED'}
                  </span>
                  {!geminiAvailable && (
                    <span className="text-xs font-mono text-gray-400">
                      (Set VITE_GEMINI_API_KEY)
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-mono text-sm">Gemini Enabled:</span>
                <button
                  onClick={() => setGeminiEnabled(!geminiEnabled)}
                  className={`px-3 py-1 rounded-lg font-mono text-xs border transition ${
                    geminiEnabled && geminiAvailable
                      ? 'bg-green-800/60 border-green-400 text-green-200'
                      : 'bg-gray-800/60 border-gray-400 text-gray-200'
                  }`}
                  disabled={!geminiAvailable}
                >
                  {geminiEnabled && geminiAvailable ? 'ON' : 'OFF'}
                </button>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300 font-mono text-sm">Automated Defense:</span>
                <button
                  onClick={() => setAutomatedDefenseEnabled(!automatedDefenseEnabled)}
                  className={`px-3 py-1 rounded-lg font-mono text-xs border transition ${
                    automatedDefenseEnabled && geminiEnabled && geminiAvailable
                      ? 'bg-cyan-800/60 border-cyan-400 text-cyan-200'
                      : 'bg-gray-800/60 border-gray-400 text-gray-200'
                  }`}
                  disabled={!geminiEnabled || !geminiAvailable}
                >
                  {automatedDefenseEnabled && geminiEnabled && geminiAvailable ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center mt-8 pt-4 border-t border-gray-600">
          <button
            onClick={resetToDefaults}
            className="px-4 py-2 bg-gray-800/60 border border-gray-500 text-gray-300 rounded-lg font-mono text-sm hover:bg-gray-700/60 transition-all duration-300"
          >
            RESET DEFAULTS
          </button>
          
          <div className="flex gap-3">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-800/60 border border-gray-500 text-gray-300 rounded-lg font-mono text-sm hover:bg-gray-700/60 transition-all duration-300"
            >
              CANCEL
            </button>
            <button
              onClick={applyConfig}
              className="px-6 py-2 bg-cyan-900/60 border border-cyan-500 text-cyan-300 rounded-lg font-mono text-sm hover:bg-cyan-800/60 transition-all duration-300 shadow-cyberpunk"
            >
              APPLY CONFIG
            </button>
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

export default ConfigurationPanel;
