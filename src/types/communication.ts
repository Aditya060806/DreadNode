export interface CommunicationChannel {
  id: string;
  sourceNodeId: string;
  destinationNodeId: string;
  protocol: 'http' | 'https' | 'websocket' | 'tcp' | 'udp' | 'encrypted' | 'unencrypted';
  encrypted: boolean;
  status: 'active' | 'inactive' | 'suspicious' | 'blocked';
  packetsTransmitted: number;
  packetsReceived: number;
  bytesTransmitted: number;
  bytesReceived: number;
  latency: number;
  errorRate: number;
  lastActivity: number;
  securityLevel: number; // 0-100
  threats: ChannelThreat[];
  certificateInfo?: CertificateInfo;
}

export interface ChannelThreat {
  id: string;
  type: 'mitm' | 'eavesdropping' | 'tampering' | 'replay' | 'downgrade';
  severity: 'low' | 'medium' | 'high' | 'critical';
  detectedAt: number;
  status: 'detected' | 'mitigated' | 'false_positive';
  description: string;
}

export interface CertificateInfo {
  issuer: string;
  subject: string;
  validFrom: number;
  validTo: number;
  signatureAlgorithm: string;
  isValid: boolean;
}

export interface CommunicationPattern {
  id: string;
  pattern: string;
  frequency: number;
  nodes: string[];
  risk: number;
  anomalyScore: number;
  description: string;
}

