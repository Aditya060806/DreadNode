import React, { useState } from 'react';
import { useSimulationStore } from '../store/simulationStore';
import { FileText, Clock, AlertTriangle, Network } from 'lucide-react';
import { motion } from 'framer-motion';

const ForensicsPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const attackEvents = useSimulationStore(s => s.attackEvents);
  const nodes = useSimulationStore(s => s.nodes);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 border-red-500 bg-red-900/20';
      case 'high': return 'text-orange-400 border-orange-500 bg-orange-900/20';
      case 'medium': return 'text-yellow-400 border-yellow-500 bg-yellow-900/20';
      case 'low': return 'text-green-400 border-green-500 bg-green-900/20';
      default: return 'text-gray-400 border-gray-500 bg-gray-900/20';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getEventNode = (nodeId: string) => {
    return nodes.find(n => n.id === nodeId);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-32 right-4 bg-black/60 border border-cyan-500/30 rounded-lg px-4 py-2 text-cyan-300 font-mono text-sm hover:bg-cyan-900/40 transition-all duration-300 shadow-cyberpunk flex items-center gap-2"
      >
        <FileText className="w-4 h-4" />
        FORENSICS
      </button>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-black/95 border border-cyan-500/50 rounded-xl p-6 max-w-6xl w-full mx-4 shadow-cyberpunk max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-cyan-300 font-mono text-xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6" />
            DIGITAL FORENSICS ANALYSIS
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-y-auto">
          {/* Attack Events List */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-cyan-400 font-mono text-sm font-bold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                ATTACK EVENTS
              </h3>
              <span className="text-xs font-mono text-gray-400">
                {attackEvents.length} events
              </span>
            </div>

            {attackEvents.length === 0 ? (
              <div className="text-gray-400 text-sm font-mono text-center py-8 border border-gray-600 rounded-lg">
                No attack events
              </div>
            ) : (
              <div className="space-y-2 max-h-[70vh] overflow-y-auto">
                {attackEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${getSeverityColor(event.severity)} ${
                      selectedEvent === event.id ? 'ring-2 ring-cyan-400' : ''
                    }`}
                    onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-mono text-xs font-bold uppercase">
                        {event.attackType}
                      </div>
                      <div className="text-xs font-mono uppercase">
                        {event.severity}
                      </div>
                    </div>
                    <div className="text-xs font-mono text-gray-300 mb-1">
                      {formatTimestamp(event.timestamp)}
                    </div>
                    <div className="text-xs font-mono text-gray-400">
                      {event.targetNodeIds.length} nodes affected
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Event Details */}
          <div className="lg:col-span-2 space-y-4">
            {selectedEvent ? (
              (() => {
                const event = attackEvents.find(e => e.id === selectedEvent);
                if (!event) return null;

                return (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-cyan-400 font-mono text-sm font-bold mb-2 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        ATTACK TIMELINE
                      </h3>
                      <div className="border border-gray-600 rounded-lg p-4 space-y-2">
                        {event.timeline.map((timelineEvent, idx) => (
                          <div key={timelineEvent.id} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0" />
                            <div className="flex-1">
                              <div className="text-xs font-mono text-cyan-300">
                                {formatTimestamp(timelineEvent.timestamp)}
                              </div>
                              <div className="text-xs font-mono text-gray-300 font-bold">
                                {timelineEvent.event}
                              </div>
                              <div className="text-xs font-mono text-gray-400 mt-1">
                                {timelineEvent.details}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-cyan-400 font-mono text-sm font-bold mb-2 flex items-center gap-2">
                        <Network className="w-4 h-4" />
                        ATTACK CHAIN
                      </h3>
                      <div className="border border-gray-600 rounded-lg p-4">
                        <div className="flex flex-wrap gap-2">
                          {event.attackChain.map((nodeId, idx) => {
                            const node = getEventNode(nodeId);
                            return (
                              <div
                                key={nodeId}
                                className="px-3 py-1 bg-cyan-900/40 border border-cyan-500/50 rounded text-xs font-mono text-cyan-300"
                              >
                                {node ? `${node.id} (${node.role})` : nodeId}
                                {idx < event.attackChain.length - 1 && (
                                  <span className="ml-2 text-gray-400">→</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-cyan-400 font-mono text-sm font-bold mb-2">
                        EVIDENCE
                      </h3>
                      <div className="border border-gray-600 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                        {event.evidence.length === 0 ? (
                          <div className="text-gray-400 text-xs font-mono text-center py-4">
                            No evidence collected
                          </div>
                        ) : (
                          event.evidence.map((evidence) => (
                            <div key={evidence.id} className="border-b border-gray-700 pb-2 last:border-0">
                              <div className="flex justify-between items-start mb-1">
                                <div className="text-xs font-mono text-cyan-300">
                                  {evidence.type.toUpperCase()} - {evidence.source}
                                </div>
                                <div className="text-xs font-mono text-gray-400">
                                  Relevance: {evidence.relevance}%
                                </div>
                              </div>
                              <div className="text-xs font-mono text-gray-300">
                                {typeof evidence.data === 'string' ? evidence.data : JSON.stringify(evidence.data)}
                              </div>
                              <div className="text-xs font-mono text-gray-500 mt-1">
                                {formatTimestamp(evidence.timestamp)}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-cyan-400 font-mono text-sm font-bold mb-2">
                        IMPACT ANALYSIS
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="border border-gray-600 rounded-lg p-3">
                          <div className="text-xs font-mono text-gray-400 mb-1">Nodes Affected</div>
                          <div className="text-lg font-mono text-red-400 font-bold">
                            {event.impact.nodesAffected}
                          </div>
                        </div>
                        <div className="border border-gray-600 rounded-lg p-3">
                          <div className="text-xs font-mono text-gray-400 mb-1">Data Corrupted</div>
                          <div className="text-lg font-mono text-orange-400 font-bold">
                            {event.impact.dataCorrupted} MB
                          </div>
                        </div>
                        <div className="border border-gray-600 rounded-lg p-3">
                          <div className="text-xs font-mono text-gray-400 mb-1">Downtime</div>
                          <div className="text-lg font-mono text-yellow-400 font-bold">
                            {event.impact.downtime}s
                          </div>
                        </div>
                        <div className="border border-gray-600 rounded-lg p-3">
                          <div className="text-xs font-mono text-gray-400 mb-1">Estimated Cost</div>
                          <div className="text-lg font-mono text-cyan-400 font-bold">
                            ${event.impact.cost.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>

                    {event.iocs && event.iocs.length > 0 && (
                      <div>
                        <h3 className="text-cyan-400 font-mono text-sm font-bold mb-2">
                          INDICATORS OF COMPROMISE (IOCs)
                        </h3>
                        <div className="border border-gray-600 rounded-lg p-4">
                          <div className="space-y-2">
                            {event.iocs.map((ioc, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                <span className="text-xs font-mono text-cyan-400 uppercase">
                                  {ioc.type}:
                                </span>
                                <span className="text-xs font-mono text-gray-300">
                                  {ioc.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()
            ) : (
              <div className="text-gray-400 text-sm font-mono text-center py-20 border border-gray-600 rounded-lg">
                Select an attack event to view forensic details
              </div>
            )}
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

export default ForensicsPanel;

