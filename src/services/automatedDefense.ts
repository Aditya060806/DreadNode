import { getAutomatedDefenseResponse, defenseFunctions, type AutomatedDefenseResponse } from './geminiService';
import { processingQueue, type ProcessingTask } from './processingQueue';
import type { ThreatAnalysisResponse } from './geminiService';
import type { Node, ReflexType } from '../store/simulationStore';

export interface DefenseAction {
  id: string;
  timestamp: number;
  function: string;
  parameters: Record<string, any>;
  confidence: number;
  reason: string;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: any;
  error?: string;
}

export interface AutomatedDefenseStore {
  actions: DefenseAction[];
  enabled: boolean;
  addAction: (action: DefenseAction) => void;
  updateAction: (id: string, update: Partial<DefenseAction>) => void;
  getActions: (filter?: { status?: string }) => DefenseAction[];
  setEnabled: (enabled: boolean) => void;
}

// In-memory store
const defenseStore: AutomatedDefenseStore = {
  actions: [],
  enabled: true,
  addAction: (action) => {
    defenseStore.actions.unshift(action);
    // Keep only last 50 actions
    if (defenseStore.actions.length > 50) {
      defenseStore.actions = defenseStore.actions.slice(0, 50);
    }
  },
  updateAction: (id, update) => {
    const index = defenseStore.actions.findIndex(a => a.id === id);
    if (index !== -1) {
      defenseStore.actions[index] = { ...defenseStore.actions[index], ...update };
    }
  },
  getActions: (filter) => {
    let actions = defenseStore.actions;
    if (filter?.status) {
      actions = actions.filter(a => a.status === filter.status);
    }
    return actions;
  },
  setEnabled: (enabled) => {
    defenseStore.enabled = enabled;
  },
};

// Execute defense action
export type DefenseActionHandler = (
  functionName: string,
  parameters: Record<string, any>
) => Promise<any>;

let defenseActionHandler: DefenseActionHandler | null = null;

export function setDefenseActionHandler(handler: DefenseActionHandler): void {
  defenseActionHandler = handler;
}

// Get automated defense response and execute actions
export async function processAutomatedDefense(
  threatAnalysis: ThreatAnalysisResponse,
  nodes: Node[],
  attackContext: string
): Promise<DefenseAction[]> {
  if (!defenseStore.enabled) {
    return [];
  }

  // Do not send node data to Gemini - only threat analysis
  const defenseResponse = await getAutomatedDefenseResponse({
    threatAnalysis,
    currentNodes: [], // Empty array - nodes not sent to Gemini
    attackContext,
  });

  if (!defenseResponse || !defenseResponse.actions || defenseResponse.actions.length === 0) {
    return [];
  }

  const executedActions: DefenseAction[] = [];

  for (const actionDef of defenseResponse.actions) {
    const action: DefenseAction = {
      id: `defense-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      timestamp: Date.now(),
      function: actionDef.function,
      parameters: actionDef.parameters,
      confidence: actionDef.confidence,
      reason: actionDef.reason,
      status: 'pending',
    };

    defenseStore.addAction(action);

    // Execute action if handler is available
    if (defenseActionHandler) {
      try {
        defenseStore.updateAction(action.id, { status: 'executing' });
        const result = await defenseActionHandler(actionDef.function, actionDef.parameters);
        defenseStore.updateAction(action.id, {
          status: 'completed',
          result,
        });
        action.status = 'completed';
        action.result = result;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        defenseStore.updateAction(action.id, {
          status: 'failed',
          error: errorMessage,
        });
        action.status = 'failed';
        action.error = errorMessage;
      }
    }

    executedActions.push(action);
  }

  return executedActions;
}

// Queue automated defense (real-time for critical threats)
export function queueAutomatedDefense(
  threatAnalysis: ThreatAnalysisResponse,
  nodes: Node[],
  attackContext: string,
  priority: 'critical' | 'high' | 'medium' | 'low' = 'high'
): void {
  if (!defenseStore.enabled) {
    return;
  }

  const isCritical = threatAnalysis.threatLevel === 'critical' || priority === 'critical';
  const taskType = isCritical ? 'real-time' : 'batch';

  const task: ProcessingTask = {
    id: `automated-defense-${Date.now()}`,
    type: taskType,
    priority,
    timestamp: Date.now(),
    data: { threatAnalysis, nodes, attackContext },
    handler: async (data) => {
      return await processAutomatedDefense(data.threatAnalysis, data.nodes, data.attackContext);
    },
    retries: 0,
    maxRetries: 2,
  };

  processingQueue.enqueue(task);
}

// Get defense store
export function getDefenseStore(): AutomatedDefenseStore {
  return defenseStore;
}

// Map function names to reflex types
export function mapFunctionToReflex(functionName: string): ReflexType | null {
  const mapping: Record<string, ReflexType> = {
    activateFirewall: 'firewall',
    quarantineNode: 'quarantine',
    triggerHealing: 'heal',
    triggerCascadingHeal: 'heal',
  };
  return mapping[functionName] || null;
}

// Validate defense action
export function validateDefenseAction(
  functionName: string,
  parameters: Record<string, any>
): { valid: boolean; error?: string } {
  const functionDef = defenseFunctions.find(f => f.name === functionName);
  if (!functionDef) {
    return { valid: false, error: `Unknown function: ${functionName}` };
  }

  // Check required parameters
  if (functionDef.parameters.required) {
    for (const param of functionDef.parameters.required) {
      if (!(param in parameters)) {
        return { valid: false, error: `Missing required parameter: ${param}` };
      }
    }
  }

  return { valid: true };
}

