import React, { useState, useEffect } from 'react';
import { useSimulationStore } from '../store/simulationStore';

interface HistoricalData {
  timestamp: number;
  systemLoad: number;
  globalThreat: number;
  averageResponseTime: number;
  errorRate: number;
  networkEfficiency: number;
  healthyNodes: number;
  attackedNodes: number;
  totalThroughput: number;
}

const HistoricalAnalysis = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<keyof HistoricalData>('systemLoad');
  const [timeRange, setTimeRange] = useState(300000); // 5 minutes default

  const { 
    systemLoad, 
    globalThreat, 
    averageResponseTime, 
    errorRate, 
    networkEfficiency, 
    totalThroughput,
    nodes 
  } = useSimulationStore();

  // Collect historical data
  useEffect(() => {
    const interval = setInterval(() => {
      const healthyNodes = nodes.filter(n => n.status === 'healthy').length;
      const attackedNodes = nodes.filter(n => n.status === 'attacked').length;
      
      const newDataPoint: HistoricalData = {
        timestamp: Date.now(),
        systemLoad,
        globalThreat,
        averageResponseTime,
        errorRate,
        networkEfficiency,
        healthyNodes,
        attackedNodes,
        totalThroughput,
      };

      setHistoricalData(prev => {
        const updated = [...prev, newDataPoint];
        // Keep only data within time range
        const cutoff = Date.now() - timeRange;
        return updated.filter(data => data.timestamp > cutoff);
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [systemLoad, globalThreat, averageResponseTime, errorRate, networkEfficiency, totalThroughput, nodes, timeRange]);

  const getMetricDisplayName = (metric: keyof HistoricalData) => {
    switch (metric) {
      case 'systemLoad': return 'System Load (%)';
      case 'globalThreat': return 'Global Threat (%)';
      case 'averageResponseTime': return 'Avg Response Time (ms)';
      case 'errorRate': return 'Error Rate (%)';
      case 'networkEfficiency': return 'Network Efficiency (%)';
      case 'healthyNodes': return 'Healthy Nodes';
      case 'attackedNodes': return 'Attacked Nodes';
      case 'totalThroughput': return 'Total Throughput (/s)';
      default: return metric;
    }
  };

  const getMetricColor = (metric: keyof HistoricalData) => {
    switch (metric) {
      case 'systemLoad': return 'text-orange-400';
      case 'globalThreat': return 'text-red-400';
      case 'averageResponseTime': return 'text-yellow-400';
      case 'errorRate': return 'text-red-400';
      case 'networkEfficiency': return 'text-green-400';
      case 'healthyNodes': return 'text-green-400';
      case 'attackedNodes': return 'text-red-400';
      case 'totalThroughput': return 'text-cyan-400';
      default: return 'text-gray-400';
    }
  };

  const getMinMaxValues = (data: HistoricalData[], metric: keyof HistoricalData) => {
    if (data.length === 0) return { min: 0, max: 100 };
    
    const values = data.map(d => d[metric] as number);
    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  };

  const renderChart = () => {
    if (historicalData.length < 2) {
      return (
        <div className="text-gray-400 text-center py-8 font-mono text-sm">
          Insufficient data for analysis
        </div>
      );
    }

    const { min, max } = getMinMaxValues(historicalData, selectedMetric);
    const range = max - min || 1;
    const width = 400;
    const height = 200;

    return (
      <div className="relative">
        <svg width={width} height={height} className="border border-gray-600 rounded">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
            <g key={i}>
              <line
                x1={0}
                y1={height * ratio}
                x2={width}
                y2={height * ratio}
                stroke="#374151"
                strokeWidth={1}
              />
              <text
                x={-10}
                y={height * ratio + 4}
                fill="#9CA3AF"
                fontSize="10"
                textAnchor="end"
              >
                {Math.round(max - (range * ratio))}
              </text>
            </g>
          ))}

          {/* Data line */}
          <polyline
            fill="none"
            stroke="#00FFFF"
            strokeWidth={2}
            points={historicalData.map((data, index) => {
              const x = (index / (historicalData.length - 1)) * width;
              const y = height - ((data[selectedMetric] as number - min) / range) * height;
              return `${x},${y}`;
            }).join(' ')}
          />

          {/* Data points */}
          {historicalData.map((data, index) => {
            const x = (index / (historicalData.length - 1)) * width;
            const y = height - ((data[selectedMetric] as number - min) / range) * height;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r={3}
                fill="#00FFFF"
                className="hover:r-4 transition-all"
              />
            );
          })}
        </svg>

        {/* Time axis */}
        <div className="flex justify-between text-xs text-gray-400 font-mono mt-2">
          <span>{new Date(historicalData[0]?.timestamp || Date.now()).toLocaleTimeString()}</span>
          <span>{new Date(historicalData[historicalData.length - 1]?.timestamp || Date.now()).toLocaleTimeString()}</span>
        </div>
      </div>
    );
  };

  const getStatistics = () => {
    if (historicalData.length === 0) return null;

    const values = historicalData.map(d => d[selectedMetric] as number);
    const avg = values.reduce((sum, val) => sum + val, 0) / values.length;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const latest = values[values.length - 1];

    return (
      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
        <div className="flex justify-between">
          <span className="text-gray-400">Current:</span>
          <span className={getMetricColor(selectedMetric)}>{latest.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Average:</span>
          <span className="text-cyan-400">{avg.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Min:</span>
          <span className="text-green-400">{min.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Max:</span>
          <span className="text-red-400">{max.toFixed(2)}</span>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-4 right-4 bg-black/60 border border-cyan-500/30 rounded-lg px-4 py-2 text-cyan-300 font-mono text-sm hover:bg-cyan-900/40 transition-all duration-300 shadow-cyberpunk"
      >
        📊 ANALYZE
      </button>
    );
  }

  return (
    <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="bg-black/95 border border-cyan-500/50 rounded-xl p-6 max-w-4xl w-full mx-4 shadow-cyberpunk">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-cyan-300 font-mono text-xl font-bold">HISTORICAL ANALYSIS</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls */}
          <div className="space-y-4">
            <div>
              <label className="text-cyan-400 font-mono text-sm font-bold block mb-2">
                METRIC
              </label>
              <select
                value={selectedMetric}
                onChange={e => setSelectedMetric(e.target.value as keyof HistoricalData)}
                className="w-full px-3 py-2 bg-cyan-900/40 border border-cyan-500/50 text-cyan-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value="systemLoad">System Load</option>
                <option value="globalThreat">Global Threat</option>
                <option value="averageResponseTime">Response Time</option>
                <option value="errorRate">Error Rate</option>
                <option value="networkEfficiency">Network Efficiency</option>
                <option value="healthyNodes">Healthy Nodes</option>
                <option value="attackedNodes">Attacked Nodes</option>
                <option value="totalThroughput">Total Throughput</option>
              </select>
            </div>

            <div>
              <label className="text-cyan-400 font-mono text-sm font-bold block mb-2">
                TIME RANGE
              </label>
              <select
                value={timeRange}
                onChange={e => setTimeRange(parseInt(e.target.value))}
                className="w-full px-3 py-2 bg-cyan-900/40 border border-cyan-500/50 text-cyan-300 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
              >
                <option value={60000}>1 Minute</option>
                <option value={300000}>5 Minutes</option>
                <option value={900000}>15 Minutes</option>
                <option value={1800000}>30 Minutes</option>
                <option value={3600000}>1 Hour</option>
              </select>
            </div>

            {getStatistics()}
          </div>

          {/* Chart */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h3 className={`text-lg font-mono font-bold ${getMetricColor(selectedMetric)}`}>
                {getMetricDisplayName(selectedMetric)}
              </h3>
              <p className="text-gray-400 text-sm font-mono">
                {historicalData.length} data points over {Math.round(timeRange / 60000)} minutes
              </p>
            </div>
            
            {renderChart()}
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

export default HistoricalAnalysis;
