export interface AttackEvent {
  id: string;
  timestamp: number;
  attackType: string;
  sourceNodeId: string;
  targetNodeIds: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'detected' | 'mitigated' | 'ongoing' | 'resolved';
  evidence: Evidence[];
  impact: {
    nodesAffected: number;
    dataCorrupted: number;
    downtime: number;
    cost: number;
  };
  timeline: TimelineEvent[];
  attackChain: string[];
  iocs: IOC[];
  geminiAnalysis?: GeminiAnalysis;
}

export interface Evidence {
  id: string;
  type: 'log' | 'metric' | 'packet' | 'state' | 'network';
  timestamp: number;
  source: string;
  data: any;
  relevance: number; // 0-100
  category: string;
}

export interface TimelineEvent {
  id: string;
  timestamp: number;
  event: string;
  nodeId?: string;
  action?: string;
  details: string;
}

export interface IOC {
  type: 'ip' | 'domain' | 'hash' | 'url' | 'signature';
  value: string;
  confidence: number;
  source: string;
  firstSeen: number;
  lastSeen: number;
}

export interface GeminiAnalysis {
  summary: string;
  attackPattern: string;
  recommendations: string[];
  severityAssessment: string;
  attribution: string;
  relatedThreats: string[];
  confidence: number;
}

export interface ForensicReport {
  id: string;
  createdAt: number;
  attackEvents: AttackEvent[];
  summary: string;
  totalIncidents: number;
  totalImpact: number;
  recommendations: string[];
  geminiInsights: string;
}

