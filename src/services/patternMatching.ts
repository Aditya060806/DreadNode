import { generateEmbedding, cosineSimilarity, analyzePatterns, type PatternAnalysisResponse } from './geminiService';
import { processingQueue, type ProcessingTask } from './processingQueue';

export interface Pattern {
  id: string;
  pattern: string;
  embedding: number[] | null;
  frequency: number;
  risk: number;
  description: string;
  firstSeen: number;
  lastSeen: number;
  nodes: string[];
}

export interface Anomaly {
  id: string;
  timestamp: number;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  pattern: string;
  nodes: string[];
  details: any;
}

export interface PatternMatchingStore {
  patterns: Pattern[];
  anomalies: Anomaly[];
  addPattern: (pattern: Pattern) => void;
  updatePattern: (id: string, update: Partial<Pattern>) => void;
  addAnomaly: (anomaly: Anomaly) => void;
  getPatterns: () => Pattern[];
  getAnomalies: (filter?: { severity?: string }) => Anomaly[];
}

// In-memory store
const patternStore: PatternMatchingStore = {
  patterns: [],
  anomalies: [],
  addPattern: (pattern) => {
    const existing = patternStore.patterns.find(p => p.pattern === pattern.pattern);
    if (existing) {
      patternStore.updatePattern(existing.id, {
        frequency: existing.frequency + 1,
        lastSeen: Date.now(),
        nodes: [...new Set([...existing.nodes, ...pattern.nodes])],
      });
    } else {
      patternStore.patterns.push(pattern);
      // Keep only last 100 patterns
      if (patternStore.patterns.length > 100) {
        patternStore.patterns = patternStore.patterns.slice(0, 100);
      }
    }
  },
  updatePattern: (id, update) => {
    const index = patternStore.patterns.findIndex(p => p.id === id);
    if (index !== -1) {
      patternStore.patterns[index] = { ...patternStore.patterns[index], ...update };
    }
  },
  addAnomaly: (anomaly) => {
    patternStore.anomalies.unshift(anomaly);
    // Keep only last 50 anomalies
    if (patternStore.anomalies.length > 50) {
      patternStore.anomalies = patternStore.anomalies.slice(0, 50);
    }
  },
  getPatterns: () => patternStore.patterns,
  getAnomalies: (filter) => {
    let anomalies = patternStore.anomalies;
    if (filter?.severity) {
      anomalies = anomalies.filter(a => a.severity === filter.severity);
    }
    return anomalies;
  },
};

// Generate pattern embedding
export async function createPatternEmbedding(pattern: string): Promise<number[] | null> {
  return await generateEmbedding(pattern);
}

// Match pattern against existing patterns
export function matchPattern(
  patternText: string,
  patternEmbedding: number[] | null,
  threshold: number = 0.7
): Pattern | null {
  if (!patternEmbedding) {
    return null;
  }

  let bestMatch: Pattern | null = null;
  let bestSimilarity = 0;

  for (const pattern of patternStore.patterns) {
    if (!pattern.embedding) continue;

    const similarity = cosineSimilarity(patternEmbedding, pattern.embedding);
    if (similarity > bestSimilarity && similarity >= threshold) {
      bestSimilarity = similarity;
      bestMatch = pattern;
    }
  }

  return bestMatch;
}

// Detect anomalies using pattern analysis
export async function detectAnomalies(
  attackEvents: any[],
  nodeStates: any[],
  logs: string[]
): Promise<Anomaly[]> {
  const analysis = await analyzePatterns({
    attackEvents,
    nodeStates,
    logs,
  });

  if (!analysis) {
    return [];
  }

  const anomalies: Anomaly[] = [];

  for (const anomalyData of analysis.anomalies) {
    const anomaly: Anomaly = {
      id: `anomaly-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: Date.now(),
      description: anomalyData.description,
      severity: anomalyData.severity,
      confidence: anomalyData.confidence,
      pattern: '',
      nodes: nodeStates.map(n => n.id),
      details: anomalyData,
    };

    patternStore.addAnomaly(anomaly);
    anomalies.push(anomaly);
  }

  return anomalies;
}

// Queue pattern analysis (batch processing) - with debouncing
const patternAnalysisCache = new Map<string, number>();
const PATTERN_ANALYSIS_DEBOUNCE_MS = 30000; // Don't analyze patterns more than once per 30 seconds

export function queuePatternAnalysis(
  attackEvents: any[],
  nodeStates: any[],
  logs: string[],
  priority: 'critical' | 'high' | 'medium' | 'low' = 'medium'
): void {
  // DISABLED: Gemini should not analyze network/node structure
  // Pattern analysis is now local-only (no Gemini API calls)
  // Use local pattern detection instead
  return;
  
  // OLD CODE - DISABLED TO PREVENT NODE/NETWORK ANALYSIS
  /*
  const cacheKey = `pattern-${attackEvents.length}-${nodeStates.length}`;
  const lastAnalysis = patternAnalysisCache.get(cacheKey);
  if (lastAnalysis && Date.now() - lastAnalysis < PATTERN_ANALYSIS_DEBOUNCE_MS) {
    return;
  }
  patternAnalysisCache.set(cacheKey, Date.now());
  
  if (patternAnalysisCache.size > 10) {
    const oldest = Array.from(patternAnalysisCache.entries())
      .sort((a, b) => a[1] - b[1])[0];
    patternAnalysisCache.delete(oldest[0]);
  }
  
  const task: ProcessingTask = {
    id: `pattern-analysis-${Date.now()}`,
    type: 'batch',
    priority,
    timestamp: Date.now(),
    data: { attackEvents, nodeStates, logs },
    handler: async (data) => {
      const analysis = await analyzePatterns(data);
      // ... rest of code
    },
    retries: 0,
    maxRetries: 2,
  };

  processingQueue.enqueue(task);
  */
}

// Calculate anomaly score for a pattern
export function calculateAnomalyScore(pattern: Pattern, recentPatterns: Pattern[]): number {
  // Base score from risk
  let score = pattern.risk;

  // Increase score if pattern frequency is unusual
  const avgFrequency = recentPatterns.reduce((sum, p) => sum + p.frequency, 0) / recentPatterns.length;
  if (pattern.frequency < avgFrequency * 0.5 || pattern.frequency > avgFrequency * 2) {
    score += 20;
  }

  // Increase score if pattern is new
  const age = Date.now() - pattern.firstSeen;
  if (age < 60000) { // Less than 1 minute old
    score += 15;
  }

  return Math.min(100, score);
}

// Get pattern store
export function getPatternStore(): PatternMatchingStore {
  return patternStore;
}

// Extract attack pattern from events
export function extractAttackPattern(events: any[]): string {
  if (events.length === 0) return '';

  const attackTypes = events.map(e => e.attackType || e.type).filter(Boolean);
  const uniqueTypes = [...new Set(attackTypes)];
  
  if (uniqueTypes.length === 1) {
    return `Single ${uniqueTypes[0]} attack`;
  } else if (uniqueTypes.length <= 3) {
    return `Multi-vector attack: ${uniqueTypes.join(', ')}`;
  } else {
    return `Complex multi-vector attack with ${uniqueTypes.length} attack types`;
  }
}

// Compare patterns
export function comparePatterns(pattern1: Pattern, pattern2: Pattern): number {
  if (!pattern1.embedding || !pattern2.embedding) {
    return 0;
  }
  return cosineSimilarity(pattern1.embedding, pattern2.embedding);
}

