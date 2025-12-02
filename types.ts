export interface CallRecord {
  id: string;
  agentName: string;
  department: string; // e.g., Support, Sales, Billing
  topic: string; // e.g., "Payment Issue", "Technical Support"
  date: string; // ISO Date string
  time: string; // HH:MM
  answered: boolean;
  resolved: boolean;
  speedOfAnswer: number; // in seconds
  duration: number; // in minutes
  satisfactionRating: number; // 1-5
}

export interface AgentPerformance {
  agentName: string;
  totalCalls: number;
  resolvedCount: number;
  avgSatisfaction: number;
  avgSpeedOfAnswer: number;
}

export interface TopicSummary {
  topic: string;
  count: number;
  avgDuration: number;
}

export interface DashboardSummary {
  totalCalls: number;
  answeredPercentage: number;
  resolvedPercentage: number;
  avgSatisfaction: number;
  avgSpeedOfAnswer: number;
}

export interface AnalysisResult {
  markdown: string;
  loading: boolean;
  timestamp: Date | null;
}

export interface MarketNews {
  title: string;
  url: string;
  source?: string;
}
