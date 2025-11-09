import { analyzeThreatIntelligence, type ThreatAnalysisResponse } from './geminiService';
import { processingQueue, type ProcessingTask } from './processingQueue';
import type { LogEntry } from '../store/simulationStore';

export interface ThreatIntelligence {
  id: string;
  timestamp: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  iocs: Array<{ type: string; value: string; confidence: number }>;
  attackPattern: string;
  recommendations: string[];
  confidence: number;
  relatedThreats: string[];
  source: string;
  status: 'new' | 'analyzing' | 'analyzed' | 'archived';
}

export interface ThreatIntelligenceStore {
  threats: ThreatIntelligence[];
  addThreat: (threat: ThreatIntelligence) => void;
  updateThreat: (id: string, update: Partial<ThreatIntelligence>) => void;
  getThreats: (filter?: { status?: string; threatLevel?: string }) => ThreatIntelligence[];
}

// In-memory store
const threatStore: ThreatIntelligenceStore = {
  threats: [],
  addThreat: (threat) => {
    threatStore.threats.unshift(threat);
    // Keep only last 100 threats
    if (threatStore.threats.length > 100) {
      threatStore.threats = threatStore.threats.slice(0, 100);
    }
  },
  updateThreat: (id, update) => {
    const index = threatStore.threats.findIndex(t => t.id === id);
    if (index !== -1) {
      threatStore.threats[index] = { ...threatStore.threats[index], ...update };
    }
  },
  getThreats: (filter) => {
    let threats = threatStore.threats;
    if (filter?.status) {
      threats = threats.filter(t => t.status === filter.status);
    }
    if (filter?.threatLevel) {
      threats = threats.filter(t => t.threatLevel === filter.threatLevel);
    }
    return threats;
  },
};

// Analyze logs for threat intelligence
export async function analyzeLogsForThreats(
  logs: LogEntry[],
  attackType?: string,
  context?: string
): Promise<ThreatIntelligence | null> {
  const logTexts = logs.map(log => log.text);
  const recentLogs = logTexts.slice(-50);

  const analysis = await analyzeThreatIntelligence({
    logs: recentLogs,
    metrics: {},
    attackType,
    context,
  });

  if (!analysis) {
    return null;
  }

  const threat: ThreatIntelligence = {
    id: `threat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: Date.now(),
    threatLevel: analysis.threatLevel,
    summary: analysis.summary,
    iocs: analysis.iocs,
    attackPattern: analysis.attackPattern,
    recommendations: analysis.recommendations,
    confidence: analysis.confidence,
    relatedThreats: analysis.relatedThreats,
    source: 'gemini-analysis',
    status: 'analyzed',
  };

  threatStore.addThreat(threat);
  
  // Note: Automated defense will be triggered from the store after nodes are available
  // This avoids circular dependency issues
  
  return threat;
}

// Queue threat analysis (real-time for critical, batch for others)
// Only queue if we haven't analyzed this attack type recently (debouncing)
const recentAnalysisCache = new Map<string, number>();
const ANALYSIS_DEBOUNCE_MS = 30000; // Increased to 30 seconds to reduce API calls

export function queueThreatAnalysis(
  logs: LogEntry[],
  attackType: string,
  priority: 'critical' | 'high' | 'medium' | 'low' = 'medium',
  context?: string
): void {
  // Only analyze logs - do not include network/node structure
  // Debounce: Skip if we analyzed this attack type recently
  const cacheKey = `${attackType}-${priority}`;
  const lastAnalysis = recentAnalysisCache.get(cacheKey);
  if (lastAnalysis && Date.now() - lastAnalysis < ANALYSIS_DEBOUNCE_MS) {
    return; // Skip duplicate analysis
  }
  recentAnalysisCache.set(cacheKey, Date.now());
  
  // Clean old cache entries
  if (recentAnalysisCache.size > 10) { // Reduced from 20
    const oldest = Array.from(recentAnalysisCache.entries())
      .sort((a, b) => a[1] - b[1])[0];
    recentAnalysisCache.delete(oldest[0]);
  }
  
  // Only process critical threats in real-time, others go to batch
  // This reduces API calls significantly
  const isCritical = priority === 'critical' && (attackType === 'Zero-Day' || attackType === 'Insider Exploit');
  const taskType = isCritical ? 'real-time' : 'batch';

  const task: ProcessingTask = {
    id: `threat-analysis-${Date.now()}`,
    type: taskType,
    priority,
    timestamp: Date.now(),
    data: { logs, attackType, context },
    handler: async (data) => {
      // Create pending threat
      const threatId = `threat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
      const pendingThreat: ThreatIntelligence = {
        id: threatId,
        timestamp: Date.now(),
        threatLevel: 'medium',
        summary: 'Analyzing threat from logs...',
        iocs: [],
        attackPattern: data.attackType,
        recommendations: [],
        confidence: 0,
        relatedThreats: [],
        source: 'gemini-analysis',
        status: 'analyzing',
      };
      threatStore.addThreat(pendingThreat);

      // Perform analysis - ONLY LOGS, NO NODE/NETWORK DATA
      // Limit logs to prevent excessive API usage
      const logEntries = data.logs.slice(-15); // Reduced from 50 to 15
      const analysis = await analyzeLogsForThreats(logEntries, data.attackType, data.context);
      
      if (analysis) {
        threatStore.updateThreat(threatId, {
          ...analysis,
          status: 'analyzed',
        });
      } else {
        threatStore.updateThreat(threatId, {
          status: 'analyzed',
          summary: `Threat detected: ${data.attackType}`,
          threatLevel: priority === 'critical' ? 'critical' : priority === 'high' ? 'high' : 'medium',
        });
      }

      return analysis;
    },
    retries: 0,
    maxRetries: 2, // Reduced from 3
  };

  processingQueue.enqueue(task);
}

// Get threat intelligence store
export function getThreatIntelligenceStore(): ThreatIntelligenceStore {
  return threatStore;
}

// Extract IOCs from text
export function extractIOCs(text: string): Array<{ type: string; value: string }> {
  const iocs: Array<{ type: string; value: string }> = [];

  // IP addresses
  const ipRegex = /\b(?:\d{1,3}\.){3}\d{1,3}\b/g;
  const ips = text.match(ipRegex);
  if (ips) {
    ips.forEach(ip => iocs.push({ type: 'ip', value: ip }));
  }

  // Domains
  const domainRegex = /\b(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}\b/gi;
  const domains = text.match(domainRegex);
  if (domains) {
    domains.forEach(domain => iocs.push({ type: 'domain', value: domain }));
  }

  // Hashes (MD5, SHA1, SHA256)
  const hashRegex = /\b[a-f0-9]{32}\b|\b[a-f0-9]{40}\b|\b[a-f0-9]{64}\b/gi;
  const hashes = text.match(hashRegex);
  if (hashes) {
    hashes.forEach(hash => {
      const type = hash.length === 32 ? 'md5' : hash.length === 40 ? 'sha1' : 'sha256';
      iocs.push({ type: 'hash', value: hash });
    });
  }

  // URLs
  const urlRegex = /https?:\/\/[^\s]+/gi;
  const urls = text.match(urlRegex);
  if (urls) {
    urls.forEach(url => iocs.push({ type: 'url', value: url }));
  }

  return iocs;
}

// Get real-world threat data (simulated)
export function getRealWorldThreatData(): Array<{
  name: string;
  type: string;
  severity: string;
  description: string;
  iocs: Array<{ type: string; value: string }>;
}> {
  return [
    {
      name: 'APT29 Cozy Bear',
      type: 'Advanced Persistent Threat',
      severity: 'critical',
      description: 'State-sponsored group known for long-term network infiltration',
      iocs: [
        { type: 'domain', value: 'update.microsoft-analytics.com' },
        { type: 'ip', value: '185.220.101.0' },
      ],
    },
    {
      name: 'Emotet Banking Trojan',
      type: 'Malware',
      severity: 'high',
      description: 'Modular banking trojan with worm capabilities',
      iocs: [
        { type: 'domain', value: 'emotet-update.net' },
        { type: 'hash', value: 'a1b2c3d4e5f6789012345678901234567890abcd' },
      ],
    },
    {
      name: 'SolarWinds Supply Chain',
      type: 'Supply Chain Attack',
      severity: 'critical',
      description: 'Supply chain compromise through software update mechanism',
      iocs: [
        { type: 'domain', value: 'solarwinds-update.com' },
        { type: 'hash', value: '32519b85c0b422e4656de6e6c41878e95fd95026267daab4215ee59c107d6c77' },
      ],
    },
  ];
}

