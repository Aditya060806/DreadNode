
export interface NodeData {
  id: string;
  x: number;
  y: number;
  status: 'healthy' | 'healing' | 'attacked' | 'adapting';
  health: number;
  connections: string[];
  lastActivity: number;
}

export interface SystemMessage {
  id: string;
  text: string;
  timestamp: number;
  priority?: 'low' | 'medium' | 'high';
}
