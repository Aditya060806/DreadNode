import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimiter, requestCache, generateCacheKey } from './rateLimiter';

// Get API key from environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Initialize Gemini client
let genAI: GoogleGenerativeAI | null = null;
let model: any = null;

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // Exponential backoff in ms

// Initialize Gemini models
export function initializeGemini() {
  if (!API_KEY) {
    console.warn('Gemini API key not found. Set VITE_GEMINI_API_KEY in .env file. Some features will be disabled.');
    return false;
  }

  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    console.log('✅ Gemini AI initialized successfully (gemini-2.5-flash)');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Gemini:', error);
    return false;
  }
}

// Check if Gemini is available
export function isGeminiAvailable(): boolean {
  return API_KEY !== '' && model !== null;
}

// Text analysis for threat intelligence
export interface ThreatAnalysisRequest {
  logs: string[];
  metrics: any;
  attackType?: string;
  context?: string;
}

export interface ThreatAnalysisResponse {
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  iocs: Array<{ type: string; value: string; confidence: number }>;
  attackPattern: string;
  recommendations: string[];
  confidence: number;
  relatedThreats: string[];
}

async function callGeminiWithRetry(prompt: string, cacheKey?: string): Promise<string | null> {
  // Check cache first
  if (cacheKey) {
    const cached = requestCache.get(cacheKey);
    if (cached) {
      return cached;
    }
  }

  // Wait for rate limit slot
  await rateLimiter.waitForSlot();

  let lastError: any = null;
  
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      rateLimiter.recordRequest();
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Cache the result
      if (cacheKey) {
        requestCache.set(cacheKey, text);
      }
      
      return text;
    } catch (error: any) {
      lastError = error;
      
      // If it's a rate limit error (429), wait longer
      if (error?.status === 429 || error?.message?.includes('429')) {
        const waitTime = RETRY_DELAYS[attempt] || 5000;
        console.warn(`Rate limit hit, waiting ${waitTime}ms before retry ${attempt + 1}/${MAX_RETRIES}`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // For other errors, retry with shorter delay
      if (attempt < MAX_RETRIES - 1) {
        const waitTime = RETRY_DELAYS[attempt] || 1000;
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  console.error('Gemini API call failed after retries:', lastError);
  return null;
}

export async function analyzeThreatIntelligence(
  request: ThreatAnalysisRequest
): Promise<ThreatAnalysisResponse | null> {
  if (!isGeminiAvailable()) {
    return null;
  }

  try {
    // Only analyze logs - DO NOT analyze network structure or nodes
    const logText = request.logs.slice(-15).join('\n'); // Reduced to 15 logs max
    
    const prompt = `You are a cybersecurity expert analyzing security logs for threats. Analyze ONLY the log data provided - do not analyze network structure.

Security Logs:
${logText}

Attack Type: ${request.attackType || 'Unknown'}
Context: ${request.context || 'No additional context'}

Provide a JSON response with:
1. threatLevel: "low", "medium", "high", or "critical"
2. summary: Brief summary of the threat based on logs
3. iocs: Array of indicators of compromise from logs (IPs, domains, hashes, etc.) with type, value, and confidence (0-100)
4. attackPattern: Description of the attack pattern from logs
5. recommendations: Array of recommended defense actions
6. confidence: Confidence level (0-100)
7. relatedThreats: Array of related threat types

Return only valid JSON, no markdown formatting. Focus on log analysis only.`;

    const cacheKey = generateCacheKey('threat', { 
      attackType: request.attackType, 
      logCount: request.logs.length 
    });
    
    const text = await callGeminiWithRetry(prompt, cacheKey);
    
    if (!text) {
      // Return fallback response instead of null
      return {
        threatLevel: 'medium',
        summary: `Attack detected: ${request.attackType || 'Unknown'}`,
        iocs: [],
        attackPattern: request.attackType || 'Unknown',
        recommendations: ['Monitor affected nodes', 'Review system logs'],
        confidence: 50,
        relatedThreats: [],
      };
    }
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const analysis = JSON.parse(jsonMatch[0]);
        return analysis as ThreatAnalysisResponse;
      } catch (parseError) {
        console.warn('Failed to parse Gemini response as JSON');
      }
    }

    // Fallback parsing
    return {
      threatLevel: 'medium',
      summary: text.substring(0, 200),
      iocs: [],
      attackPattern: request.attackType || 'Unknown',
      recommendations: [],
      confidence: 50,
      relatedThreats: [],
    };
  } catch (error) {
    console.error('Threat intelligence analysis error:', error);
    // Return fallback instead of null
    return {
      threatLevel: 'medium',
      summary: `Analysis unavailable for ${request.attackType || 'attack'}`,
      iocs: [],
      attackPattern: request.attackType || 'Unknown',
      recommendations: ['Review logs manually'],
      confidence: 30,
      relatedThreats: [],
    };
  }
}

// Function calling for automated defense
export interface DefenseFunction {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
}

export const defenseFunctions: DefenseFunction[] = [
  {
    name: 'activateFirewall',
    description: 'Activate firewall on a specific node to block attacks',
    parameters: {
      type: 'object',
      properties: {
        nodeId: { type: 'string', description: 'ID of the node to protect' },
      },
      required: ['nodeId'],
    },
  },
  {
    name: 'quarantineNode',
    description: 'Quarantine a compromised node to prevent spread',
    parameters: {
      type: 'object',
      properties: {
        nodeId: { type: 'string', description: 'ID of the node to quarantine' },
      },
      required: ['nodeId'],
    },
  },
  {
    name: 'triggerHealing',
    description: 'Trigger healing protocol on an attacked node',
    parameters: {
      type: 'object',
      properties: {
        nodeId: { type: 'string', description: 'ID of the node to heal' },
        reflexType: { type: 'string', description: 'Type of reflex: heal, reroute, isolate, scale' },
      },
      required: ['nodeId'],
    },
  },
  {
    name: 'createHoneypot',
    description: 'Create a honeypot node to trap attackers',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'triggerCascadingHeal',
    description: 'Trigger cascading healing wave from a source node',
    parameters: {
      type: 'object',
      properties: {
        sourceNodeId: { type: 'string', description: 'ID of the source node' },
      },
      required: ['sourceNodeId'],
    },
  },
];

export interface AutomatedDefenseRequest {
  threatAnalysis: ThreatAnalysisResponse;
  currentNodes: any[];
  attackContext: string;
}

export interface AutomatedDefenseResponse {
  actions: Array<{
    function: string;
    parameters: Record<string, any>;
    confidence: number;
    reason: string;
  }>;
  reasoning: string;
}

export async function getAutomatedDefenseResponse(
  request: AutomatedDefenseRequest
): Promise<AutomatedDefenseResponse | null> {
  if (!isGeminiAvailable()) {
    return null;
  }

  try {
    // Do not send node information to Gemini - only threat analysis data
    const functionsDescription = defenseFunctions
      .map(f => `${f.name}: ${f.description}`)
      .join('\n');

    const prompt = `You are an AI security system that automatically responds to threats. Based on the threat analysis from logs, recommend defense actions.

Threat Analysis (from log analysis):
- Level: ${request.threatAnalysis.threatLevel}
- Summary: ${request.threatAnalysis.summary}
- Attack Pattern: ${request.threatAnalysis.attackPattern}
- Recommendations: ${request.threatAnalysis.recommendations.join(', ')}

Available Functions:
${functionsDescription}

Context: ${request.attackContext}

Provide a JSON response with:
1. actions: Array of actions to take, each with:
   - function: Function name to call
   - parameters: Parameters for the function (use generic nodeId like "core-1" if needed)
   - confidence: Confidence in this action (0-100)
   - reason: Why this action is recommended
2. reasoning: Overall reasoning for the selected actions

Return only valid JSON, no markdown formatting. Prioritize actions that will effectively mitigate the threat. DO NOT analyze network structure.`;

    const cacheKey = generateCacheKey('defense', {
      threatLevel: request.threatAnalysis.threatLevel,
      attackPattern: request.threatAnalysis.attackPattern
    });
    
    const text = await callGeminiWithRetry(prompt, cacheKey);
    
    if (!text) {
      // Return fallback defense response - no API call needed
      return {
        actions: [{
          function: request.threatAnalysis.threatLevel === 'critical' ? 'quarantineNode' : 'activateFirewall',
          parameters: { nodeId: 'core-1' }, // Use generic node ID
          confidence: 60,
          reason: 'Fallback defense action'
        }],
        reasoning: 'Using fallback defense strategy',
      };
    }
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const defense = JSON.parse(jsonMatch[0]);
        return defense as AutomatedDefenseResponse;
      } catch (parseError) {
        console.warn('Failed to parse defense response as JSON');
      }
    }

    return {
      actions: [],
      reasoning: text.substring(0, 200),
    };
  } catch (error) {
    console.error('Automated defense error:', error);
    // Return fallback instead of null
    return {
      actions: [{
        function: 'activateFirewall',
        parameters: { nodeId: 'core-1' }, // Use generic node ID
        confidence: 50,
        reason: 'Fallback action'
      }],
      reasoning: 'Using fallback defense due to error',
    };
  }
}

// Embeddings for pattern matching
export async function generateEmbedding(text: string): Promise<number[] | null> {
  if (!isGeminiAvailable() || !API_KEY) {
    // Return fallback embedding if Gemini is not available
    return generateFallbackEmbedding(text);
  }

  try {
    // Use Gemini embedding API via REST
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'models/text-embedding-004',
          content: {
            parts: [{ text }]
          }
        }),
      }
    );
    
    if (response && response.ok) {
      const data = await response.json();
      if (data.embedding && data.embedding.values) {
        return data.embedding.values;
      }
    }
    
    // Fallback if API call fails
    console.warn('Embedding API failed, using fallback');
    return generateFallbackEmbedding(text);
  } catch (error) {
    console.error('Embedding generation error:', error);
    // Return fallback embedding on error
    return generateFallbackEmbedding(text);
  }
}

// Generate fallback embedding using hash-based approach
function generateFallbackEmbedding(text: string): number[] {
  const embedding: number[] = [];
  for (let i = 0; i < 768; i++) {
    let hash = 0;
    for (let j = 0; j < text.length; j++) {
      hash = ((hash << 5) - hash + text.charCodeAt(j) + i) & 0xffffffff;
    }
    embedding.push((hash / 0xffffffff) * 2 - 1); // Normalize to -1 to 1
  }
  return embedding;
}

// Calculate cosine similarity
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Analyze attack patterns with Gemini
export interface PatternAnalysisRequest {
  attackEvents: any[];
  nodeStates: any[];
  logs: string[];
}

export interface PatternAnalysisResponse {
  patterns: Array<{
    pattern: string;
    frequency: number;
    risk: number;
    description: string;
  }>;
  anomalies: Array<{
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
  }>;
  recommendations: string[];
}

export async function analyzePatterns(
  request: PatternAnalysisRequest
): Promise<PatternAnalysisResponse | null> {
  // DISABLED: Gemini should not analyze network/node structure
  // This function is kept for API compatibility but returns null
  // Use local pattern detection instead
  return null;
  
  /* DISABLED CODE - DO NOT USE GEMINI FOR NODE/NETWORK ANALYSIS
  if (!isGeminiAvailable()) {
    return null;
  }

  try {
    // Only analyze logs, NOT node states or network structure
    const recentLogs = request.logs.slice(-10);
    const recentEvents = request.attackEvents.slice(-5);
    
    const prompt = `Analyze attack patterns from logs only (do not analyze network structure):

Attack Events: ${recentEvents.length} recent events
Recent Logs: ${recentLogs.join('\n')}

Provide a JSON response with:
1. patterns: Array of identified attack patterns
2. anomalies: Array of detected anomalies
3. recommendations: Array of security recommendations

Return only valid JSON, no markdown formatting.`;

    const cacheKey = generateCacheKey('pattern', {
      eventCount: recentEvents.length,
      logCount: recentLogs.length
    });
    
    const text = await callGeminiWithRetry(prompt, cacheKey);
    // ... rest of code
  } catch (error) {
    console.error('Pattern analysis error:', error);
    return null;
  }
  */
}

// Initialize on import
initializeGemini();

