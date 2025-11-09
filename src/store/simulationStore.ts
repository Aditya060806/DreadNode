import { create } from 'zustand';
import type { AttackEvent, ForensicReport } from '../types/forensics';
import type { CommunicationChannel } from '../types/communication';

export type NodeStatus = 'healthy' | 'healing' | 'attacked' | 'adapting' | 'overloaded' | 'maintenance' | 'quarantined' | 'honeypot';
export type AttackType = 'DDoS' | 'AI Corruption' | 'Node Overload' | 'Web3 Congestion' | 'Memory Leak' | 'CPU Spike' | 'Network Partition' | 'Data Corruption' | 'DNS Poisoning' | 'Insider Exploit' | 'Zero-Day';
export type ReflexType = 'reroute' | 'isolate' | 'heal' | 'mutate' | 'scale' | 'throttle' | 'cache' | 'replicate' | 'quarantine' | 'firewall';
export type ChaosMode = 'single' | 'multi-vector' | 'cascading';

export interface NodeMetrics {
  cpuUsage: number;
  memoryUsage: number;
  networkLatency: number;
  throughput: number;
  errorRate: number;
  responseTime: number;
  queueLength: number;
  cacheHitRate: number;
  bandwidth: number;
  packetLoss: number;
}

export interface AttackSignature {
  id: string;
  type: AttackType;
  firstSeen: number;
  lastSeen: number;
  count: number;
  immunityLevel: number; // 0-100, increases as system learns
}

export interface ImmuneMemory {
  signatures: AttackSignature[];
  totalAttacks: number;
  learnedDefenses: number;
}

export interface AIPrediction {
  nodeId: string;
  probability: number;
  attackType: AttackType;
  confidence: number;
  timestamp: number;
}

export interface QuarantineZone {
  id: string;
  nodes: string[];
  createdAt: number;
  studyProgress: number;
}

export interface Node {
  id: string;
  x: number;
  y: number;
  z: number;
  status: NodeStatus;
  health: number;
  pain: number;
  uptime: number;
  learningStrategy: string;
  connections: string[];
  lastActivity: number;
  metrics: NodeMetrics;
  capacity: {
    maxCpu: number;
    maxMemory: number;
    maxConnections: number;
    maxThroughput: number;
  };
  role: 'core' | 'edge' | 'gateway' | 'storage' | 'compute' | 'router' | 'honeypot';
  layer: number;
  region: string;
  version: string;
  lastUpdate: number;
  attackResistance: number;
  adaptiveCapability: number;
  // New fields
  firewallActive: boolean;
  firewallStrength: number;
  isHoneypot: boolean;
  quarantineZoneId?: string;
  immuneToAttacks: AttackType[];
  healingWaveProgress: number;
  patchNodeId?: string;
  isPatchNode: boolean;
  geographicLocation?: { lat: number; lng: number; city: string };
}

export interface DataPacket {
  id: string;
  source: string;
  destination: string;
  size: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  ttl: number;
  payload: any;
  route: string[];
  currentHop: number;
  progress: number;
}

export interface LogEntry {
  id: string;
  text: string;
  timestamp: number;
  priority?: 'low' | 'medium' | 'high' | 'critical';
  blockchainHash?: string;
  blockNumber?: number;
  syncing?: boolean;
  synced?: boolean;
  source?: string;
  category?: 'system' | 'attack' | 'healing' | 'performance' | 'network' | 'security';
}

export interface AIAdversary {
  intelligence: number;
  tactics: string[];
  lastAdaptation: number;
  attackHistory: AttackType[];
  successRate: number;
}

export interface SimulationState {
  nodes: Node[];
  logs: LogEntry[];
  dataPackets: DataPacket[];
  globalThreat: number;
  reflexMode: 'auto' | 'manual';
  isPaused: boolean;
  isDemoMode: boolean;
  currentAttack?: AttackType;
  blockNumber: number;
  simulationSpeed: number;
  networkLatency: number;
  totalThroughput: number;
  systemLoad: number;
  securityLevel: number;
  averageResponseTime: number;
  errorRate: number;
  networkEfficiency: number;
  adaptiveScore: number;
  // New features
  chaosMode: ChaosMode;
  aiAdversary: AIAdversary;
  immuneMemory: ImmuneMemory;
  predictions: AIPrediction[];
  quarantineZones: QuarantineZone[];
  healingWaves: Array<{ id: string; sourceNodeId: string; progress: number; radius: number }>;
  cascadingHealing: boolean;
  firewallActive: boolean;
  efficiencyScore: number;
  humanVsAI: { aiScore: number; humanScore: number; aiTime: number; humanTime: number };
  // Local threat intelligence (no API required)
  automatedDefenseEnabled: boolean;
  threatIntelligence: Array<{ id: string; timestamp: number; threatLevel: string; summary: string; attackType: string }>;
  attackEvents: AttackEvent[];
  forensicReports: ForensicReport[];
  communicationChannels: CommunicationChannel[];
  // Actions
  simulateAttack: (type: AttackType) => void;
  simulateMultiVectorAttack: () => void;
  injectFailure: () => void;
  triggerReflex: (nodeId: string, reflex: ReflexType) => void;
  addLog: (text: string, priority?: 'low' | 'medium' | 'high' | 'critical', category?: string, source?: string) => void;
  setReflexMode: (mode: 'auto' | 'manual') => void;
  setPaused: (paused: boolean) => void;
  setDemoMode: (demo: boolean) => void;
  updateNode: (id: string, update: Partial<Node>) => void;
  advanceBlock: () => void;
  setSimulationSpeed: (speed: number) => void;
  addDataPacket: (packet: Omit<DataPacket, 'id' | 'timestamp' | 'progress'>) => void;
  updateSystemMetrics: () => void;
  setChaosMode: (mode: ChaosMode) => void;
  generateZeroDayExploit: () => void;
  activateFirewall: (nodeId: string) => void;
  quarantineNode: (nodeId: string) => void;
  releaseFromQuarantine: (nodeId: string) => void;
  createHoneypot: () => void;
  triggerCascadingHeal: (sourceNodeId: string) => void;
  updatePredictions: () => void;
  adaptAdversary: () => void;
  recordAttackSignature: (type: AttackType) => void;
  startHealingWave: (sourceNodeId: string) => void;
  updateHealingWaves: () => void;
  // Local threat intelligence actions
  setAutomatedDefenseEnabled: (enabled: boolean) => void;
  addThreatIntelligence: (threatLevel: string, summary: string, attackType: string) => void;
  collectForensicData: (attackType: AttackType, affectedNodes: string[]) => void;
  // Enhanced recovery actions
  autoRepairFirewall: (nodeId: string) => void;
  activateBackupNode: (failedNodeId: string) => void;
  progressiveHeal: (nodeId: string) => void;
}

// Geographic locations for global map
const regions = [
  { lat: 40.7128, lng: -74.0060, city: 'New York' },
  { lat: 51.5074, lng: -0.1278, city: 'London' },
  { lat: 35.6762, lng: 139.6503, city: 'Tokyo' },
  { lat: 37.7749, lng: -122.4194, city: 'San Francisco' },
  { lat: 52.5200, lng: 13.4050, city: 'Berlin' },
  { lat: -33.8688, lng: 151.2093, city: 'Sydney' },
  { lat: 25.2048, lng: 55.2708, city: 'Dubai' },
  { lat: 1.3521, lng: 103.8198, city: 'Singapore' },
];

// Enhanced node initialization
const createNode = (id: string, x: number, y: number, role: Node['role'], layer: number, region: string, isHoneypot = false): Node => {
  const geoLocation = regions[Math.floor(Math.random() * regions.length)];
  return {
    id,
    x,
    y,
    z: Math.random() * 20 - 10,
    status: isHoneypot ? 'honeypot' : 'healthy',
    health: 100,
    pain: 0,
    uptime: 100,
    learningStrategy: randomStrategy(),
    connections: [],
    lastActivity: Date.now(),
    metrics: {
      cpuUsage: Math.random() * 30 + 10,
      memoryUsage: Math.random() * 40 + 20,
      networkLatency: Math.random() * 50 + 10,
      throughput: Math.random() * 1000 + 500,
      errorRate: Math.random() * 2,
      responseTime: Math.random() * 100 + 50,
      queueLength: Math.random() * 10,
      cacheHitRate: Math.random() * 20 + 70,
      bandwidth: Math.random() * 1000 + 100,
      packetLoss: Math.random() * 1,
    },
    capacity: {
      maxCpu: role === 'core' ? 100 : role === 'edge' ? 80 : 60,
      maxMemory: role === 'core' ? 1000 : role === 'edge' ? 500 : 250,
      maxConnections: role === 'core' ? 100 : role === 'edge' ? 50 : 25,
      maxThroughput: role === 'core' ? 10000 : role === 'edge' ? 5000 : 1000,
    },
    role: isHoneypot ? 'honeypot' : role,
    layer,
    region,
    version: `v${Math.floor(Math.random() * 3) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 10)}`,
    lastUpdate: Date.now(),
    attackResistance: Math.random() * 50 + 50,
    adaptiveCapability: Math.random() * 40 + 60,
    firewallActive: false,
    firewallStrength: 0,
    isHoneypot,
    immuneToAttacks: [],
    healingWaveProgress: 0,
    isPatchNode: false,
    geographicLocation: geoLocation,
  };
};

// Organized web-like network layout - aligned and structured mesh
// Nodes positioned at exact coordinates for perfect line alignment
const initialNodes: Node[] = [
  // Core node at exact center
  createNode('core-1', 50, 50, 'core', 0, 'us-east'),
  
  // Layer 1 - Primary ring around core (8 nodes in perfect circle)
  // Positions calculated for perfect alignment: 45° intervals from center
  createNode('node-2', 50, 35, 'edge', 1, 'us-west'),        // Top
  createNode('node-3', 62, 38, 'compute', 1, 'eu-central'),  // Top-right
  createNode('node-4', 65, 50, 'router', 1, 'eu-west'),      // Right
  createNode('node-5', 62, 62, 'storage', 1, 'us-east'),     // Bottom-right
  createNode('node-6', 50, 65, 'edge', 1, 'us-central'),     // Bottom
  createNode('node-7', 38, 62, 'compute', 1, 'us-south'),    // Bottom-left
  createNode('node-8', 35, 50, 'gateway', 1, 'asia-pacific'), // Left
  createNode('node-9', 38, 38, 'router', 1, 'eu-north'),     // Top-left
  
  // Layer 2 - Outer ring (12 nodes in organized pattern)
  // Organized in symmetric positions for clean alignment
  createNode('edge-10', 50, 20, 'edge', 2, 'us-west'),       // Top center
  createNode('edge-11', 72, 28, 'edge', 2, 'asia-pacific'),  // Upper-right
  createNode('edge-12', 80, 50, 'gateway', 2, 'eu-west'),    // Far right
  createNode('edge-13', 72, 72, 'edge', 2, 'us-central'),    // Lower-right
  createNode('edge-14', 50, 80, 'edge', 2, 'us-south'),      // Bottom center
  createNode('edge-15', 28, 72, 'compute', 2, 'eu-north'),   // Lower-left
  createNode('edge-16', 20, 50, 'storage', 2, 'us-east'),    // Far left
  createNode('edge-17', 28, 28, 'compute', 2, 'us-west'),    // Upper-left
  createNode('edge-18', 42, 22, 'router', 2, 'asia-pacific'), // Upper mid-left
  createNode('edge-19', 58, 22, 'gateway', 2, 'eu-central'), // Upper mid-right
  createNode('edge-20', 78, 42, 'storage', 2, 'eu-west'),    // Right mid-upper
  createNode('edge-21', 78, 58, 'compute', 2, 'us-central'), // Right mid-lower
];

// Establish organized web-like mesh connections with better alignment
initialNodes.forEach(node => {
  const connections: string[] = [];
  const nodeDistance = (n1: Node, n2: Node) => 
    Math.sqrt((n1.x - n2.x) ** 2 + (n1.y - n2.y) ** 2);
  
  if (node.role === 'core') {
    // Core connects to all layer 1 nodes (primary ring) - clean radial connections
    const layer1Nodes = initialNodes.filter(n => n.layer === 1);
    connections.push(...layer1Nodes.map(n => n.id));
  }
  else if (node.layer === 1) {
    // Layer 1 nodes: organized connections for better alignment
    const coreNode = initialNodes.find(n => n.role === 'core');
    if (coreNode) connections.push(coreNode.id);
    
    // Connect to immediate neighbors in the ring (2 adjacent nodes for cleaner look)
    const layer1Nodes = initialNodes
      .filter(n => n.layer === 1 && n.id !== node.id)
      .map(n => ({ node: n, distance: nodeDistance(node, n) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2) // Reduced to 2 for cleaner alignment
      .map(item => item.node.id);
    connections.push(...layer1Nodes);
    
    // Connect to 1-2 nearest layer 2 nodes (closest for better alignment)
    const layer2Nodes = initialNodes
      .filter(n => n.layer === 2)
      .map(n => ({ node: n, distance: nodeDistance(node, n) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2)
      .map(item => item.node.id);
    connections.push(...layer2Nodes);
  }
  else if (node.layer === 2) {
    // Layer 2 nodes: connect to 2 nearest layer 1 nodes for cleaner structure
    const layer1Nodes = initialNodes
      .filter(n => n.layer === 1)
      .map(n => ({ node: n, distance: nodeDistance(node, n) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2) // Reduced to 2 for better alignment
      .map(item => item.node.id);
    connections.push(...layer1Nodes);
    
    // Connect to 1 nearby layer 2 node (nearest neighbor for cleaner mesh)
    const layer2Nodes = initialNodes
      .filter(n => n.layer === 2 && n.id !== node.id)
      .map(n => ({ node: n, distance: nodeDistance(node, n) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 1) // Only 1 connection for cleaner look
      .map(item => item.node.id);
    connections.push(...layer2Nodes);
  }
  
  // Remove duplicates
  node.connections = [...new Set(connections)];
  
  // Ensure bidirectional connections for proper alignment
  node.connections.forEach(connId => {
    const connectedNode = initialNodes.find(n => n.id === connId);
    if (connectedNode && !connectedNode.connections.includes(node.id)) {
      connectedNode.connections.push(node.id);
    }
  });
});

function randomHash(length = 64) {
  const chars = 'abcdef0123456789';
  let hash = '';
  for (let i = 0; i < length; i++) hash += chars[Math.floor(Math.random() * chars.length)];
  return hash;
}

function randomStrategy() {
  const strategies = [
    'Alpha-Adaptive', 'Beta-Resilient', 'Gamma-Optimized', 'Delta-Distributed',
    'Epsilon-Elastic', 'Zeta-Intelligent', 'Eta-Predictive', 'Theta-Reactive',
    'Sigma-SelfHealing', 'Omega-Evolutionary'
  ];
  return strategies[Math.floor(Math.random() * strategies.length)];
}

// Enhanced attack simulation with cascading impact
function simulateAdvancedAttack(type: AttackType, nodes: Node[], chaosMode: ChaosMode = 'single'): { affectedNodes: string[], impact: number } {
  const affectedNodes = new Set<string>();
  let impact = 0;

  // Check immune memory
  const immuneNodes = nodes.filter(n => n.immuneToAttacks.includes(type));
  
  switch (type) {
    case 'DDoS':
      const highTrafficNodes = nodes
        .filter(n => n.metrics.throughput > 800 && !n.immuneToAttacks.includes(type) && !n.isHoneypot)
        .sort((a, b) => b.metrics.throughput - a.metrics.throughput)
        .slice(0, Math.ceil(nodes.length * 0.3));
      
      highTrafficNodes.forEach(node => {
        affectedNodes.add(node.id);
        impact += 0.8;
      });
      
      if (chaosMode === 'multi-vector' || chaosMode === 'cascading') {
        // Cascading: affect connected nodes
        highTrafficNodes.forEach(node => {
          node.connections.forEach(connId => {
            if (Math.random() < 0.4) {
              affectedNodes.add(connId);
              impact += 0.3;
            }
          });
        });
      }
      break;

    case 'DNS Poisoning':
      const gatewayNodes = nodes.filter(n => (n.role === 'gateway' || n.role === 'router') && !n.immuneToAttacks.includes(type));
      gatewayNodes.forEach(node => {
        affectedNodes.add(node.id);
        impact += 0.7;
      });
      break;

    case 'Insider Exploit':
      const coreNodes = nodes.filter(n => n.role === 'core' && !n.immuneToAttacks.includes(type));
      if (coreNodes.length > 0) {
        const target = coreNodes[Math.floor(Math.random() * coreNodes.length)];
        affectedNodes.add(target.id);
        impact += 0.9;
        
        // Insider exploit spreads to connected nodes
        target.connections.forEach(connId => {
          if (Math.random() < 0.6) {
            affectedNodes.add(connId);
            impact += 0.5;
          }
        });
      }
      break;

    case 'Zero-Day':
      // Zero-day affects random nodes, higher impact
      const vulnerableNodes = nodes
        .filter(n => !n.immuneToAttacks.includes(type) && !n.isHoneypot)
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.ceil(nodes.length * 0.2));
      
      vulnerableNodes.forEach(node => {
        affectedNodes.add(node.id);
        impact += 0.95;
      });
      break;

    case 'AI Corruption':
      const adaptiveNodes = nodes
        .filter(n => n.adaptiveCapability > 70 && !n.immuneToAttacks.includes(type))
        .sort((a, b) => b.adaptiveCapability - a.adaptiveCapability)
        .slice(0, Math.ceil(nodes.length * 0.2));
      
      adaptiveNodes.forEach(node => {
        affectedNodes.add(node.id);
        impact += 0.9;
      });
      break;

    case 'Node Overload':
      const overloadedNodes = nodes
        .filter(n => n.metrics.cpuUsage > 70 && !n.immuneToAttacks.includes(type))
        .sort((a, b) => b.metrics.cpuUsage - a.metrics.cpuUsage)
        .slice(0, Math.ceil(nodes.length * 0.25));
      
      overloadedNodes.forEach(node => {
        affectedNodes.add(node.id);
        impact += 0.7;
      });
      break;

    case 'Web3 Congestion':
      const criticalNodes = nodes.filter(n => (n.role === 'core' || n.role === 'gateway') && !n.immuneToAttacks.includes(type));
      criticalNodes.forEach(node => {
        affectedNodes.add(node.id);
        impact += 0.6;
      });
      break;

    case 'Memory Leak':
      const storageNodes = nodes.filter(n => n.role === 'storage' && !n.immuneToAttacks.includes(type));
      storageNodes.forEach(node => {
        affectedNodes.add(node.id);
        impact += 0.5;
      });
      break;

    case 'CPU Spike':
      const computeNodes = nodes.filter(n => n.role === 'compute' && !n.immuneToAttacks.includes(type));
      computeNodes.forEach(node => {
        affectedNodes.add(node.id);
        impact += 0.6;
      });
      break;

    case 'Network Partition':
      const routerNodes = nodes.filter(n => n.role === 'router' && !n.immuneToAttacks.includes(type));
      routerNodes.forEach(node => {
        affectedNodes.add(node.id);
        impact += 0.8;
      });
      break;

    case 'Data Corruption':
      const randomNodes = nodes
        .filter(n => !n.immuneToAttacks.includes(type) && !n.isHoneypot)
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.ceil(nodes.length * 0.15));
      
      randomNodes.forEach(node => {
        affectedNodes.add(node.id);
        impact += 0.9;
      });
      break;
  }

  return { affectedNodes: Array.from(affectedNodes), impact: Math.min(1, impact) };
}

function calculateHealingRate(node: Node, reflex: ReflexType): number {
  let baseRate = 0.1;
  
  switch (reflex) {
    case 'heal':
      baseRate = 0.3;
      break;
    case 'reroute':
      baseRate = 0.2;
      break;
    case 'isolate':
      baseRate = 0.4;
      break;
    case 'mutate':
      baseRate = 0.25;
      break;
    case 'scale':
      baseRate = 0.35;
      break;
    case 'throttle':
      baseRate = 0.15;
      break;
    case 'cache':
      baseRate = 0.2;
      break;
    case 'replicate':
      baseRate = 0.3;
      break;
    case 'firewall':
      baseRate = 0.1;
      break;
    case 'quarantine':
      baseRate = 0.5;
      break;
  }

  const adaptiveBonus = node.adaptiveCapability / 100 * 0.1;
  const resistanceBonus = node.attackResistance / 100 * 0.05;
  
  return Math.min(0.8, baseRate + adaptiveBonus + resistanceBonus);
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  nodes: initialNodes,
  logs: [],
  dataPackets: [],
  globalThreat: 0,
  reflexMode: 'auto',
  isPaused: false,
  isDemoMode: false,
  chaosMode: 'single',
  blockNumber: 923042,
  simulationSpeed: 1,
  networkLatency: 0,
  totalThroughput: 0,
  systemLoad: 0,
  securityLevel: 85,
  averageResponseTime: 0,
  errorRate: 0,
  networkEfficiency: 0,
  adaptiveScore: 0,
  aiAdversary: {
    intelligence: 50,
    tactics: ['DDoS', 'AI Corruption'],
    lastAdaptation: Date.now(),
    attackHistory: [],
    successRate: 0.3,
  },
  immuneMemory: {
    signatures: [],
    totalAttacks: 0,
    learnedDefenses: 0,
  },
  predictions: [],
  quarantineZones: [],
  healingWaves: [],
  cascadingHealing: true,
  firewallActive: false,
  efficiencyScore: 0,
  humanVsAI: { aiScore: 0, humanScore: 0, aiTime: 0, humanTime: 0 },
  // Local threat intelligence initial state
  automatedDefenseEnabled: true,
  threatIntelligence: [],
  attackEvents: [],
  forensicReports: [],
  communicationChannels: [],

  simulateAttack: (type) => {
    const now = Date.now();
    const { nodes, chaosMode } = get();
    const { affectedNodes, impact } = simulateAdvancedAttack(type, nodes, chaosMode);
    
    // Record attack signature
    get().recordAttackSignature(type);
    
    set(state => {
      const updatedNodes = state.nodes.map(n => {
        if (affectedNodes.includes(n.id)) {
          // Honeypots attract attacks but don't get damaged
          if (n.isHoneypot) {
            get().addLog(`Honeypot ${n.id} detected and trapped attack: ${type}`, 'high', 'security', 'honeypot');
            return n;
          }
          
          const healthLoss = Math.max(10, impact * 40 + Math.random() * 20);
          const painGain = Math.min(100, impact * 50 + Math.random() * 30);
          
          return {
            ...n,
            status: 'attacked' as NodeStatus,
            health: Math.max(5, n.health - healthLoss),
            pain: Math.min(100, n.pain + painGain),
            lastActivity: now,
            metrics: {
              ...n.metrics,
              cpuUsage: Math.min(100, n.metrics.cpuUsage + impact * 30),
              memoryUsage: Math.min(100, n.metrics.memoryUsage + impact * 25),
              errorRate: Math.min(100, n.metrics.errorRate + impact * 20),
              responseTime: n.metrics.responseTime * (1 + impact * 0.5),
              queueLength: n.metrics.queueLength + impact * 20,
            }
          };
        }
        return n;
      });

      const threatIncrease = Math.min(100, state.globalThreat + impact * 25);
      const logText = `${type} attack detected — ${affectedNodes.length} nodes affected (${Math.round(impact * 100)}% impact)`;
      
      // Collect forensic data
      get().collectForensicData(type, affectedNodes);
      
      // Local threat intelligence (no API required)
      const threatLevel = type === 'Zero-Day' || type === 'Insider Exploit' ? 'critical' : 
                          impact > 0.7 ? 'high' : impact > 0.4 ? 'medium' : 'low';
      
      get().addThreatIntelligence(
        threatLevel,
        `${type} attack detected on ${affectedNodes.length} nodes with ${Math.round(impact * 100)}% impact`,
        type
      );
      
      // Auto-trigger defenses for high/critical threats
      if (state.automatedDefenseEnabled && (threatLevel === 'high' || threatLevel === 'critical')) {
        // Auto-activate firewalls on affected nodes
        affectedNodes.forEach(nodeId => {
          const node = state.nodes.find(n => n.id === nodeId);
          if (node && !node.firewallActive) {
            setTimeout(() => get().activateFirewall(nodeId), 500);
          }
        });
        
        // Auto-heal if health is critical
        affectedNodes.forEach(nodeId => {
          const node = state.nodes.find(n => n.id === nodeId);
          if (node && node.health < 30) {
            setTimeout(() => get().progressiveHeal(nodeId), 1000);
          }
        });
      }
      
      return {
        ...state,
        nodes: updatedNodes,
        globalThreat: threatIncrease,
        logs: [
          ...state.logs.slice(-19),
          {
            id: Math.random().toString(36).slice(2),
            text: logText,
            timestamp: now,
            priority: 'high',
            category: 'attack',
            source: 'security-monitor',
            syncing: true,
          },
        ],
        currentAttack: type,
      };
    });

    // Blockchain sync simulation
    setTimeout(() => {
      set(state => {
        const lastLog = state.logs[state.logs.length - 1];
        if (!lastLog) return state;
        const hash = randomHash(64);
        return {
          ...state,
          logs: [
            ...state.logs.slice(0, -1),
            {
              ...lastLog,
              syncing: false,
              synced: true,
              blockchainHash: hash,
              blockNumber: state.blockNumber,
            },
          ],
        };
      });
      get().advanceBlock();
    }, 1800);

    // Auto-reflex response
    if (get().reflexMode === 'auto') {
      setTimeout(() => {
        const attackedNodes = get().nodes.filter(n => n.status === 'attacked' && !n.isHoneypot);
        if (attackedNodes.length > 0) {
          attackedNodes.forEach(node => {
            // Activate firewall for critical nodes
            if (node.role === 'core' || node.role === 'gateway') {
              get().activateFirewall(node.id);
            }
            
            // Trigger healing reflexes
            if (Math.random() < 0.6) {
              const reflexes: ReflexType[] = ['heal', 'reroute', 'isolate', 'scale'];
              const selectedReflex = reflexes[Math.floor(Math.random() * reflexes.length)];
              get().triggerReflex(node.id, selectedReflex);
            }
          });
        }
      }, 1200);
    }
  },

  simulateMultiVectorAttack: () => {
    const attackTypes: AttackType[] = ['DDoS', 'DNS Poisoning', 'Insider Exploit'];
    attackTypes.forEach((type, index) => {
      setTimeout(() => {
        get().simulateAttack(type);
      }, index * 500);
    });
    get().addLog('MULTI-VECTOR CHAOS: Coordinated attack launched', 'critical', 'attack', 'adversary');
  },

  generateZeroDayExploit: () => {
    get().addLog('ZERO-DAY EXPLOIT DETECTED: Unknown threat signature identified', 'critical', 'attack', 'security');
    
    // Create patch node
    const { nodes } = get();
    const attackedNode = nodes.find(n => n.status === 'attacked');
    if (attackedNode) {
      const patchNode: Node = createNode(
        `patch-${Date.now()}`,
        attackedNode.x + 5,
        attackedNode.y + 5,
        'compute',
        attackedNode.layer,
        attackedNode.region
      );
      patchNode.isPatchNode = true;
      patchNode.status = 'healing';
      patchNode.health = 0;
      patchNode.learningStrategy = 'Zero-Day-Patch';
      
      set(state => ({
        nodes: [...state.nodes, patchNode],
        logs: [
          ...state.logs.slice(-19),
          {
            id: Math.random().toString(36).slice(2),
            text: `Patch node generated: ${patchNode.id} - Analyzing zero-day exploit`,
            timestamp: Date.now(),
            priority: 'high',
            category: 'healing',
            source: 'ai-engine',
          },
        ],
      }));
      
      // Patch node grows and heals
      setTimeout(() => {
        set(state => ({
          nodes: state.nodes.map(n => 
            n.id === patchNode.id 
              ? { ...n, health: Math.min(100, n.health + 20), status: n.health > 80 ? 'healthy' : 'healing' }
              : n
          ),
        }));
      }, 2000);
    }
    
    get().simulateAttack('Zero-Day');
  },

  activateFirewall: (nodeId) => {
    set(state => ({
      nodes: state.nodes.map(n => 
        n.id === nodeId 
          ? { 
              ...n, 
              firewallActive: true, 
              firewallStrength: Math.min(100, n.firewallStrength + 30),
              attackResistance: Math.min(100, n.attackResistance + 10)
            }
          : n
      ),
      logs: [
        ...state.logs.slice(-19),
        {
          id: Math.random().toString(36).slice(2),
          text: `Firewall activated on ${nodeId} - Shield strength: ${Math.min(100, (state.nodes.find(n => n.id === nodeId)?.firewallStrength || 0) + 30)}%`,
          timestamp: Date.now(),
          priority: 'medium',
          category: 'security',
          source: 'firewall-system',
        },
      ],
    }));
  },

  quarantineNode: (nodeId) => {
    const node = get().nodes.find(n => n.id === nodeId);
    if (!node || node.status === 'quarantined') return;
    
    const zoneId = `quarantine-${Date.now()}`;
    set(state => {
      const quarantineZone: QuarantineZone = {
        id: zoneId,
        nodes: [nodeId],
        createdAt: Date.now(),
        studyProgress: 0,
      };
      
      return {
        nodes: state.nodes.map(n => 
          n.id === nodeId 
            ? { 
                ...n, 
                status: 'quarantined',
                quarantineZoneId: zoneId,
                x: 10 + Math.random() * 10, // Move to quarantine area
                y: 90 + Math.random() * 5,
              }
            : n
        ),
        quarantineZones: [...state.quarantineZones, quarantineZone],
        logs: [
          ...state.logs.slice(-19),
          {
            id: Math.random().toString(36).slice(2),
            text: `Node ${nodeId} quarantined - Isolated for analysis`,
            timestamp: Date.now(),
            priority: 'high',
            category: 'security',
            source: 'quarantine-system',
          },
        ],
      };
    });
  },

  releaseFromQuarantine: (nodeId) => {
    const node = get().nodes.find(n => n.id === nodeId);
    if (!node || !node.quarantineZoneId) return;
    
    set(state => ({
      nodes: state.nodes.map(n => 
        n.id === nodeId 
          ? { 
              ...n, 
              status: 'healthy',
              quarantineZoneId: undefined,
              health: 100,
              pain: 0,
            }
          : n
      ),
      quarantineZones: state.quarantineZones.filter(z => z.id !== node.quarantineZoneId),
      logs: [
        ...state.logs.slice(-19),
        {
          id: Math.random().toString(36).slice(2),
          text: `Node ${nodeId} released from quarantine - Clean and secure`,
          timestamp: Date.now(),
          priority: 'medium',
          category: 'security',
          source: 'quarantine-system',
        },
      ],
    }));
  },

  createHoneypot: () => {
    const honeypot: Node = createNode(
      `honeypot-${Date.now()}`,
      50 + Math.random() * 20,
      50 + Math.random() * 20,
      'honeypot',
      1,
      'global',
      true
    );
    
    set(state => ({
      nodes: [...state.nodes, honeypot],
      logs: [
        ...state.logs.slice(-19),
        {
          id: Math.random().toString(36).slice(2),
          text: `Honeypot deployed: ${honeypot.id} - Decoy node active`,
          timestamp: Date.now(),
          priority: 'medium',
          category: 'security',
          source: 'honeypot-system',
        },
      ],
    }));
  },

  triggerCascadingHeal: (sourceNodeId) => {
    get().startHealingWave(sourceNodeId);
  },

  startHealingWave: (sourceNodeId) => {
    const sourceNode = get().nodes.find(n => n.id === sourceNodeId);
    if (!sourceNode) return;
    
    const waveId = `wave-${Date.now()}`;
    set(state => ({
      healingWaves: [
        ...state.healingWaves,
        {
          id: waveId,
          sourceNodeId,
          progress: 0,
          radius: 0,
        },
      ],
      logs: [
        ...state.logs.slice(-19),
        {
          id: Math.random().toString(36).slice(2),
          text: `Healing wave initiated from ${sourceNodeId} - Cascading repair in progress`,
          timestamp: Date.now(),
          priority: 'medium',
          category: 'healing',
          source: 'healing-system',
        },
      ],
    }));
  },

  updateHealingWaves: () => {
    set(state => {
      const updatedNodes = [...state.nodes];
      const updatedWaves = state.healingWaves.map(wave => {
        const newProgress = Math.min(100, wave.progress + 2);
        const newRadius = wave.radius + 3;
        
        // Heal nodes within radius
        const sourceNode = updatedNodes.find(n => n.id === wave.sourceNodeId);
        if (sourceNode) {
          updatedNodes.forEach((node, index) => {
            if (node.id === wave.sourceNodeId || node.isHoneypot) return;
            const distance = Math.sqrt((node.x - sourceNode.x) ** 2 + (node.y - sourceNode.y) ** 2);
            if (distance <= newRadius / 10 && node.status === 'attacked') {
              updatedNodes[index] = {
                ...node,
                status: 'healing' as NodeStatus,
                health: Math.min(100, node.health + 5),
                pain: Math.max(0, node.pain - 5),
                healingWaveProgress: newProgress,
              };
            } else if (distance <= newRadius / 10) {
              updatedNodes[index] = {
                ...node,
                healingWaveProgress: newProgress,
              };
            }
          });
        }
        
        return {
          ...wave,
          progress: newProgress,
          radius: newRadius,
        };
      }).filter(wave => wave.progress < 100);
      
      return {
        ...state,
        healingWaves: updatedWaves,
        nodes: updatedNodes,
      };
    });
  },

  recordAttackSignature: (type) => {
    set(state => {
      const existing = state.immuneMemory.signatures.find(s => s.type === type);
      const now = Date.now();
      let learnedDefenses = state.immuneMemory.learnedDefenses;
      
      if (existing) {
        existing.lastSeen = now;
        existing.count += 1;
        // Increase immunity after multiple encounters
        if (existing.count > 3) {
          existing.immunityLevel = Math.min(100, existing.immunityLevel + 10);
          
          // Apply immunity to nodes
          const updatedNodes = state.nodes.map(node => {
            if (!node.immuneToAttacks.includes(type) && existing.immunityLevel > 50) {
              learnedDefenses += 1;
              return {
                ...node,
                immuneToAttacks: [...node.immuneToAttacks, type],
              };
            }
            return node;
          });
          
          return {
            ...state,
            nodes: updatedNodes,
            immuneMemory: {
              ...state.immuneMemory,
              signatures: state.immuneMemory.signatures.map(s => 
                s.id === existing.id ? existing : s
              ),
              totalAttacks: state.immuneMemory.totalAttacks + 1,
              learnedDefenses,
            },
          };
        }
      } else {
        state.immuneMemory.signatures.push({
          id: Math.random().toString(36).slice(2),
          type,
          firstSeen: now,
          lastSeen: now,
          count: 1,
          immunityLevel: 0,
        });
      }
      
      return {
        ...state,
        immuneMemory: {
          ...state.immuneMemory,
          totalAttacks: state.immuneMemory.totalAttacks + 1,
          learnedDefenses,
        },
      };
    });
  },

  updatePredictions: () => {
    const { nodes, immuneMemory } = get();
    
    // ML-based prediction of next attack location
    const predictions: AIPrediction[] = nodes
      .filter(n => !n.isHoneypot && n.status === 'healthy')
      .map(node => {
        // Calculate vulnerability score
        const vulnerability = 
          (node.metrics.cpuUsage / 100) * 0.3 +
          (node.metrics.memoryUsage / 100) * 0.2 +
          (node.metrics.errorRate / 100) * 0.2 +
          ((100 - node.attackResistance) / 100) * 0.3;
        
        // Predict attack type based on node role and history
        const attackType = node.role === 'core' ? 'DDoS' : 
                          node.role === 'gateway' ? 'DNS Poisoning' :
                          node.role === 'storage' ? 'Data Corruption' : 'AI Corruption';
        
        return {
          nodeId: node.id,
          probability: vulnerability,
          attackType: attackType as AttackType,
          confidence: Math.min(95, vulnerability * 100 + Math.random() * 20),
          timestamp: Date.now(),
        };
      })
      .filter(p => p.probability > 0.4)
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3);
    
    set({ predictions });
  },

  adaptAdversary: () => {
    const { aiAdversary, nodes, immuneMemory } = get();
    const now = Date.now();
    
    // Adversary learns from system defenses
    if (now - aiAdversary.lastAdaptation > 30000) {
      const successfulDefenses = immuneMemory.signatures.filter(s => s.immunityLevel > 50).length;
      const adaptationRate = successfulDefenses / Math.max(1, immuneMemory.totalAttacks);
      
      if (adaptationRate > 0.5) {
        // System is adapting well, adversary needs to evolve
        const newTactics: AttackType[] = ['Zero-Day', 'Insider Exploit', 'DNS Poisoning'];
        const unusedTactics = newTactics.filter(t => !aiAdversary.tactics.includes(t));
        
        set(state => ({
          aiAdversary: {
            ...state.aiAdversary,
            intelligence: Math.min(100, state.aiAdversary.intelligence + 5),
            tactics: [...state.aiAdversary.tactics, ...unusedTactics.slice(0, 1)],
            lastAdaptation: now,
          },
          logs: [
            ...state.logs.slice(-19),
            {
              id: Math.random().toString(36).slice(2),
              text: `AI Adversary evolving - New tactics detected`,
              timestamp: now,
              priority: 'high',
              category: 'security',
              source: 'adversary-ai',
            },
          ],
        }));
      }
    }
  },

  injectFailure: () => {
    const now = Date.now();
    set(state => {
      const idx = Math.floor(Math.random() * state.nodes.length);
      const node = state.nodes[idx];
      if (node.isHoneypot) return state; // Don't attack honeypots directly
      
      const failureType = Math.random() < 0.5 ? 'hardware' : 'software';
      
      const updatedNodes = state.nodes.map((n, i) =>
        i === idx
          ? {
              ...n,
              status: 'attacked' as NodeStatus,
              health: Math.max(5, n.health - 40),
              pain: Math.min(100, n.pain + 60),
              lastActivity: now,
              metrics: {
                ...n.metrics,
                cpuUsage: failureType === 'hardware' ? 100 : n.metrics.cpuUsage + 40,
                memoryUsage: failureType === 'software' ? 100 : n.metrics.memoryUsage + 30,
                errorRate: 100,
                responseTime: n.metrics.responseTime * 3,
                queueLength: n.metrics.queueLength + 50,
              }
            }
          : n
      );
      
      return {
        ...state,
        nodes: updatedNodes,
        logs: [
          ...state.logs.slice(-19),
          {
            id: Math.random().toString(36).slice(2),
            text: `${node.id.toUpperCase()}: Critical ${failureType} failure — system degradation detected`,
            timestamp: now,
            priority: 'critical',
            category: 'system',
            source: node.id,
            syncing: true,
          },
        ],
      };
    });

    setTimeout(() => {
      set(state => {
        const lastLog = state.logs[state.logs.length - 1];
        if (!lastLog) return state;
        const hash = randomHash(64);
        return {
          ...state,
          logs: [
            ...state.logs.slice(0, -1),
            {
              ...lastLog,
              syncing: false,
              synced: true,
              blockchainHash: hash,
              blockNumber: state.blockNumber,
            },
          ],
        };
      });
      get().advanceBlock();
    }, 1200);

    if (get().reflexMode === 'auto') {
      setTimeout(() => {
        const failedNode = get().nodes.find(n => n.status === 'attacked');
        if (failedNode) {
          get().triggerReflex(failedNode.id, 'reroute');
        }
      }, 900);
    }
  },

  triggerReflex: (nodeId, reflex) => {
    const now = Date.now();
    set(state => {
      const nodes = state.nodes.map(n => {
        if (n.id === nodeId) {
          const healingRate = calculateHealingRate(n, reflex);
          const healthGain = healingRate * 50;
          const painReduction = healingRate * 40;
          
          let newStatus: NodeStatus = n.status;
          if (reflex === 'heal' && n.status === 'attacked') {
            newStatus = 'healing';
            if (state.cascadingHealing) {
              get().startHealingWave(nodeId);
            }
          } else if (reflex === 'reroute' && n.status === 'attacked') {
            newStatus = 'adapting';
          } else if (reflex === 'isolate' && n.status === 'attacked') {
            newStatus = 'maintenance';
          } else if (reflex === 'quarantine' && n.status === 'attacked') {
            get().quarantineNode(nodeId);
            return n;
          } else if (reflex === 'firewall') {
            get().activateFirewall(nodeId);
            return n;
          }

          return {
            ...n,
            status: newStatus,
            health: Math.min(100, n.health + healthGain),
            pain: Math.max(0, n.pain - painReduction),
            learningStrategy: reflex === 'mutate' ? randomStrategy() : n.learningStrategy,
            lastActivity: now,
            metrics: {
              ...n.metrics,
              cpuUsage: reflex === 'throttle' ? Math.max(0, n.metrics.cpuUsage - 20) : n.metrics.cpuUsage,
              memoryUsage: reflex === 'cache' ? Math.max(0, n.metrics.memoryUsage - 15) : n.metrics.memoryUsage,
              responseTime: reflex === 'scale' ? n.metrics.responseTime * 0.8 : n.metrics.responseTime,
              queueLength: reflex === 'throttle' ? Math.max(0, n.metrics.queueLength - 10) : n.metrics.queueLength,
            }
          };
        }
        return n;
      });

      let logText = '';
      switch (reflex) {
        case 'heal':
          const node = nodes.find(n => n.id === nodeId);
          const healRate = node ? calculateHealingRate(node, 'heal') : 0.3;
          logText = `Reflex protocol Beta-2 activated on ${nodeId} — healing initiated (${Math.round(healRate * 100)}% efficiency)`;
          break;
        case 'reroute':
          logText = `Reflex protocol Sigma-1: rerouting neural traffic around ${nodeId}`;
          break;
        case 'isolate':
          logText = `Reflex protocol Delta-4: isolating ${nodeId} from mesh for maintenance`;
          break;
        case 'mutate':
          logText = `Strategy ${nodes.find(n => n.id === nodeId)?.learningStrategy} activated on ${nodeId}`;
          break;
        case 'scale':
          logText = `Auto-scaling protocol activated on ${nodeId} — resource allocation optimized`;
          break;
        case 'throttle':
          logText = `Traffic throttling applied to ${nodeId} — load balancing active`;
          break;
        case 'cache':
          logText = `Cache optimization protocol on ${nodeId} — memory efficiency improved`;
          break;
        case 'replicate':
          logText = `Data replication protocol on ${nodeId} — redundancy increased`;
          break;
        case 'firewall':
          logText = `Adaptive firewall deployed on ${nodeId} — shield active`;
          break;
        case 'quarantine':
          logText = `Quarantine protocol activated for ${nodeId}`;
          break;
      }

      return {
        ...state,
        nodes,
        logs: [
          ...state.logs.slice(-19),
          {
            id: Math.random().toString(36).slice(2),
            text: logText,
            timestamp: now,
            priority: 'medium',
            category: 'healing',
            source: 'reflex-system',
            syncing: true,
          },
        ],
      };
    });

    setTimeout(() => {
      set(state => {
        const lastLog = state.logs[state.logs.length - 1];
        if (!lastLog) return state;
        const hash = randomHash(64);
        return {
          ...state,
          logs: [
            ...state.logs.slice(0, -1),
            {
              ...lastLog,
              syncing: false,
              synced: true,
              blockchainHash: hash,
              blockNumber: state.blockNumber,
            },
          ],
        };
      });
      get().advanceBlock();
    }, 1000);
  },

  addLog: (text, priority = 'low', category = 'system', source = 'system') => {
    const now = Date.now();
    set(state => ({
      logs: [
        ...state.logs.slice(-19),
        {
          id: Math.random().toString(36).slice(2),
          text,
          timestamp: now,
          priority,
          category: category as 'system' | 'attack' | 'healing' | 'performance' | 'network' | 'security',
          source,
          syncing: false,
        },
      ],
    }));
  },

  setReflexMode: (mode) => set({ reflexMode: mode }),
  setPaused: (paused) => set({ isPaused: paused }),
  setDemoMode: (demo) => set({ isDemoMode: demo }),
  setChaosMode: (mode) => set({ chaosMode: mode }),
  updateNode: (id, update) => set(state => ({
    nodes: state.nodes.map(n => n.id === id ? { ...n, ...update } : n)
  })),
  advanceBlock: () => set(state => ({ blockNumber: state.blockNumber + 1 })),
  setSimulationSpeed: (speed) => set({ simulationSpeed: Math.max(0.1, Math.min(5, speed)) }),

  addDataPacket: (packet) => {
    const now = Date.now();
    set(state => ({
      dataPackets: [
        ...state.dataPackets,
        {
          ...packet,
          id: Math.random().toString(36).slice(2),
          timestamp: now,
          progress: 0,
        }
      ]
    }));
  },

  updateSystemMetrics: () => {
    set(state => {
      const nodes = state.nodes.filter(n => !n.isHoneypot);
      const totalCpu = nodes.reduce((sum, n) => sum + n.metrics.cpuUsage, 0);
      const totalMemory = nodes.reduce((sum, n) => sum + n.metrics.memoryUsage, 0);
      const totalThroughput = nodes.reduce((sum, n) => sum + n.metrics.throughput, 0);
      const totalErrorRate = nodes.reduce((sum, n) => sum + n.metrics.errorRate, 0);
      const totalResponseTime = nodes.reduce((sum, n) => sum + n.metrics.responseTime, 0);
      const nodeCount = nodes.length;
      
      const healthyNodes = nodes.filter(n => n.status === 'healthy').length;
      const healingTime = state.healingWaves.length > 0 ? Date.now() - state.healingWaves[0].progress : 0;
      
      // Calculate efficiency score
      const efficiencyScore = Math.max(0, Math.min(100, 
        (healthyNodes / nodeCount) * 50 +
        (100 - totalErrorRate / nodeCount) * 30 +
        (state.immuneMemory.learnedDefenses / Math.max(1, state.immuneMemory.totalAttacks)) * 20
      ));

      return {
        systemLoad: (totalCpu + totalMemory) / (nodeCount * 2),
        totalThroughput,
        averageResponseTime: totalResponseTime / nodeCount,
        errorRate: totalErrorRate / nodeCount,
        networkEfficiency: Math.max(0, 100 - (totalErrorRate / nodeCount) - (totalResponseTime / nodeCount / 10)),
        adaptiveScore: nodes.reduce((sum, n) => sum + n.adaptiveCapability, 0) / nodeCount,
        efficiencyScore,
        humanVsAI: {
          ...state.humanVsAI,
          aiTime: healingTime,
          aiScore: efficiencyScore,
        },
      };
    });
  },

  // Local threat intelligence actions
  setAutomatedDefenseEnabled: (enabled) => set({ automatedDefenseEnabled: enabled }),
  
  addThreatIntelligence: (threatLevel, summary, attackType) => set(state => ({
    threatIntelligence: [
      {
        id: `threat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        timestamp: Date.now(),
        threatLevel,
        summary,
        attackType,
      },
      ...state.threatIntelligence.slice(0, 49), // Keep last 50 threats
    ],
  })),
  
  collectForensicData: (attackType, affectedNodes) => {
    const now = Date.now();
    const state = get();
    
    // Create attack event
    const attackEvent: AttackEvent = {
      id: `attack-event-${now}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: now,
      attackType,
      sourceNodeId: affectedNodes[0] || 'unknown',
      targetNodeIds: affectedNodes,
      severity: attackType === 'Zero-Day' || attackType === 'Insider Exploit' ? 'critical' :
                attackType === 'DDoS' || attackType === 'Data Corruption' ? 'high' :
                attackType === 'AI Corruption' ? 'medium' : 'low',
      status: 'detected',
      evidence: state.logs
        .filter(log => log.category === 'attack' && Date.now() - log.timestamp < 60000)
        .slice(-10)
        .map(log => ({
          id: log.id,
          type: 'log' as const,
          timestamp: log.timestamp,
          source: log.source || 'system',
          data: log.text,
          relevance: log.priority === 'critical' ? 100 : log.priority === 'high' ? 80 : 60,
          category: log.category || 'attack',
        })),
      impact: {
        nodesAffected: affectedNodes.length,
        dataCorrupted: Math.floor(Math.random() * 100),
        downtime: 0,
        cost: affectedNodes.length * 1000,
      },
      timeline: [
        {
          id: `timeline-${now}`,
          timestamp: now,
          event: 'Attack detected',
          details: `${attackType} attack detected on ${affectedNodes.length} nodes`,
        },
      ],
      attackChain: affectedNodes,
      iocs: [],
    };
    
    set(state => ({
      attackEvents: [attackEvent, ...state.attackEvents.slice(0, 49)], // Keep last 50 events
    }));
  },
  
  // Enhanced recovery actions
  autoRepairFirewall: (nodeId) => {
    const now = Date.now();
    set(state => {
      const nodes = state.nodes.map(n => {
        if (n.id === nodeId && n.firewallActive && n.firewallStrength < 100) {
          const repairRate = 2; // Firewall repairs at 2% per tick
          const newStrength = Math.min(100, n.firewallStrength + repairRate);
          
          get().addLog(
            `${nodeId}: Firewall auto-repair in progress (${newStrength.toFixed(0)}% strength)`,
            newStrength > 80 ? 'low' : 'medium',
            'security',
            nodeId
          );
          
          return {
            ...n,
            firewallStrength: newStrength,
            lastActivity: now,
          };
        }
        return n;
      });
      
      return { nodes };
    });
  },
  
  activateBackupNode: (failedNodeId) => {
    const state = get();
    const failedNode = state.nodes.find(n => n.id === failedNodeId);
    if (!failedNode || failedNode.status === 'healthy') return;
    
    // Find a healthy backup node of the same role
    const backupNode = state.nodes.find(n => 
      n.role === failedNode.role && 
      n.status === 'healthy' && 
      !n.isHoneypot &&
      n.id !== failedNodeId
    );
    
    if (backupNode) {
      // Transfer load to backup
      set(state => ({
        nodes: state.nodes.map(n => {
          if (n.id === backupNode.id) {
            return {
              ...n,
              metrics: {
                ...n.metrics,
                cpuUsage: Math.min(100, n.metrics.cpuUsage + 10),
                memoryUsage: Math.min(100, n.metrics.memoryUsage + 10),
                throughput: n.metrics.throughput + failedNode.metrics.throughput * 0.5,
              },
            };
          }
          return n;
        }),
      }));
      
      get().addLog(
        `Backup node ${backupNode.id} activated for failed node ${failedNodeId}`,
        'high',
        'network',
        'redundancy-system'
      );
    }
  },
  
  progressiveHeal: (nodeId) => {
    const now = Date.now();
    set(state => {
      const nodes = state.nodes.map(n => {
        if (n.id === nodeId && n.status !== 'healthy') {
          let newStatus: NodeStatus = n.status;
          let healthGain = 0;
          let painReduction = 0;
          
          // Progressive healing stages
          if (n.health < 20) {
            // Critical stage: Slow healing
            healthGain = 1;
            painReduction = 0.5;
            newStatus = 'healing';
          } else if (n.health < 50) {
            // Moderate stage: Medium healing
            healthGain = 2;
            painReduction = 1;
            newStatus = 'healing';
          } else if (n.health < 80) {
            // Recovery stage: Fast healing
            healthGain = 3;
            painReduction = 2;
            newStatus = 'healing';
          } else {
            // Near healthy: Complete recovery
            healthGain = 5;
            painReduction = 3;
            newStatus = n.health >= 95 ? 'healthy' : 'healing';
          }
          
          const newHealth = Math.min(100, n.health + healthGain);
          const newPain = Math.max(0, n.pain - painReduction);
          
          if (newHealth >= 95 && newStatus === 'healing') {
            newStatus = 'healthy';
            get().addLog(
              `${nodeId}: Progressive healing complete - node restored to healthy state`,
              'low',
              'healing',
              nodeId
            );
          }
          
          return {
            ...n,
            status: newStatus,
            health: newHealth,
            pain: newPain,
            lastActivity: now,
          };
        }
        return n;
      });
      
      return { nodes };
    });
  },
}));

// --- Enhanced Simulation Engine ---

let simInterval: NodeJS.Timeout | null = null;

// Enhanced recovery functions (no API required)

export function startSimulationEngine() {
  if (simInterval) return;
  
  simInterval = setInterval(() => {
    const { isPaused, isDemoMode, nodes, reflexMode, simulationSpeed, chaosMode, aiAdversary, automatedDefenseEnabled } = useSimulationStore.getState();
    if (isPaused) return;

    // Update system metrics
    useSimulationStore.getState().updateSystemMetrics();
    
    // Update predictions
    useSimulationStore.getState().updatePredictions();
    
    // Update healing waves
    useSimulationStore.getState().updateHealingWaves();
    
    // Local threat intelligence is automatically updated via addThreatIntelligence
    
    // Update quarantine zones
    useSimulationStore.setState(state => ({
      quarantineZones: state.quarantineZones.map(zone => ({
        ...zone,
        studyProgress: Math.min(100, zone.studyProgress + 1),
      })),
    }));

    // Enhanced node behavior simulation
    useSimulationStore.setState(state => {
      let updatedNodes = state.nodes.map(n => {
        let { status, health, pain, uptime, metrics, lastActivity, firewallStrength } = n;
        const timeSinceActivity = Date.now() - lastActivity;
        
        // Firewall decay
        if (n.firewallActive && firewallStrength > 0) {
          firewallStrength = Math.max(0, firewallStrength - 0.5);
        } else if (firewallStrength <= 0) {
          n.firewallActive = false;
        }
        
        // Realistic healing and adaptation
        if (status === 'attacked') {
          if (reflexMode === 'auto' && Math.random() < 0.3) {
            status = 'healing';
            pain = Math.max(0, pain - 20);
          }
          // Gradual degradation if not healing
          health = Math.max(5, health - 0.5);
          pain = Math.min(100, pain + 0.3);
        }
        
        if (status === 'healing') {
          const healingRate = calculateHealingRate(n, 'heal');
          // Enhanced progressive healing
          const baseHeal = healingRate * 2;
          const bonusHeal = n.adaptiveCapability > 70 ? healingRate * 0.5 : 0;
          health = Math.min(100, health + baseHeal + bonusHeal);
          pain = Math.max(0, pain - healingRate * 1.5);
          
          // Faster recovery if firewall is active
          if (n.firewallActive && n.firewallStrength > 50) {
            health = Math.min(100, health + healingRate * 0.5);
          }
          
          if (health >= 95) {
            status = 'healthy';
            // Restore some adaptive capability after healing
            n.adaptiveCapability = Math.min(100, n.adaptiveCapability + 2);
          }
        }
        
        if (status === 'adapting') {
          if (Math.random() < 0.2) {
            status = 'healthy';
            n.adaptiveCapability = Math.min(100, n.adaptiveCapability + 1);
          }
        }

        if (status === 'maintenance') {
          if (Math.random() < 0.1) {
            status = 'healthy';
            health = Math.min(100, health + 20);
            pain = Math.max(0, pain - 30);
          }
        }
        
        if (status === 'quarantined') {
          // Study progress affects healing
          const zone = state.quarantineZones.find(z => z.id === n.quarantineZoneId);
          if (zone && zone.studyProgress > 50) {
            health = Math.min(100, health + 1);
            pain = Math.max(0, pain - 1);
            if (health >= 90 && zone.studyProgress >= 100) {
              useSimulationStore.getState().releaseFromQuarantine(n.id);
            }
          }
        }

        // Update metrics based on status and time
        if (status === 'healthy') {
          metrics.cpuUsage = Math.max(10, Math.min(80, metrics.cpuUsage + (Math.random() - 0.5) * 2));
          metrics.memoryUsage = Math.max(20, Math.min(90, metrics.memoryUsage + (Math.random() - 0.5) * 1.5));
          metrics.errorRate = Math.max(0, metrics.errorRate - 0.1);
          metrics.responseTime = Math.max(50, metrics.responseTime + (Math.random() - 0.5) * 10);
        } else if (status === 'attacked') {
          metrics.cpuUsage = Math.min(100, metrics.cpuUsage + Math.random() * 2);
          metrics.memoryUsage = Math.min(100, metrics.memoryUsage + Math.random() * 1.5);
          metrics.errorRate = Math.min(100, metrics.errorRate + Math.random() * 0.5);
          metrics.responseTime = Math.min(1000, metrics.responseTime + Math.random() * 20);
        }

        // Update uptime
        uptime = Math.max(80, Math.min(100, uptime + (status === 'healthy' ? 0.1 : -0.2)));

        return { ...n, status, health, pain, uptime, metrics, lastActivity: Date.now(), firewallStrength };
      });

      return { ...state, nodes: updatedNodes };
    });

    // Demo mode enhancements
    if (isDemoMode) {
      const { simulateAttack, simulateMultiVectorAttack, generateZeroDayExploit, injectFailure, triggerReflex, adaptAdversary } = useSimulationStore.getState();
      
      // Adversary adaptation
      if (Math.random() < 0.05) {
        adaptAdversary();
      }
      
      // Multi-vector attacks in chaos mode
      if (chaosMode === 'multi-vector' && Math.random() < 0.1) {
        simulateMultiVectorAttack();
      } else if (chaosMode === 'cascading' && Math.random() < 0.08) {
        simulateAttack('DDoS');
      } else if (Math.random() < 0.12) {
        const attacks: AttackType[] = aiAdversary.tactics.length > 0 
          ? aiAdversary.tactics as AttackType[]
          : ['DDoS', 'AI Corruption', 'Node Overload', 'Web3 Congestion', 'Memory Leak', 'CPU Spike'];
        simulateAttack(attacks[Math.floor(Math.random() * attacks.length)]);
      }
      
      // Zero-day exploits
      if (Math.random() < 0.03) {
        generateZeroDayExploit();
      }
      
      if (Math.random() < 0.08) {
        injectFailure();
      }
      
      if (Math.random() < 0.12) {
        const availableNodes = useSimulationStore.getState().nodes.filter(n => (n.status === 'attacked' || n.status === 'healing') && !n.isHoneypot);
        if (availableNodes.length > 0) {
          const node = availableNodes[Math.floor(Math.random() * availableNodes.length)];
          const reflexes: ReflexType[] = ['heal', 'reroute', 'mutate', 'scale', 'throttle', 'cache', 'firewall'];
          triggerReflex(node.id, reflexes[Math.floor(Math.random() * reflexes.length)]);
        }
      }
    }

    // Generate random data packets
    if (Math.random() < 0.3) {
      const { addDataPacket } = useSimulationStore.getState();
      const realNodes = useSimulationStore.getState().nodes.filter(n => !n.isHoneypot);
      const sourceNode = realNodes[Math.floor(Math.random() * realNodes.length)];
      const targetNode = realNodes[Math.floor(Math.random() * realNodes.length)];
      
      if (sourceNode.id !== targetNode.id) {
        addDataPacket({
          source: sourceNode.id,
          destination: targetNode.id,
          size: Math.floor(Math.random() * 1000) + 100,
          priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as any,
          ttl: 30,
          payload: { type: 'data', content: 'simulation packet' },
          route: [],
          currentHop: 0,
        });
      }
    }
    
    // Update data packet progress
    useSimulationStore.setState(state => ({
      dataPackets: state.dataPackets
        .map(packet => {
          const progress = Math.min(100, packet.progress + 2);
          return { ...packet, progress };
        })
        .filter(packet => packet.progress < 100 && Date.now() - packet.timestamp < packet.ttl * 1000),
    }));
  }, 1800 / useSimulationStore.getState().simulationSpeed);
}

export function stopSimulationEngine() {
  if (simInterval) clearInterval(simInterval);
  simInterval = null;
}
