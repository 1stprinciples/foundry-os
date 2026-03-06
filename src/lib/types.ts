export type CompanyStage = "idea" | "building" | "launching" | "scaling";

export type CompanyStatus = "draft" | "running" | "paused";

export type AgentRole =
  | "CEO"
  | "Research"
  | "Product"
  | "Engineering"
  | "Growth"
  | "Operations"
  | "Finance";

export type AgentStatus = "idle" | "planning" | "executing" | "blocked";

export type TaskStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "review"
  | "done";

export type TaskPriority = "low" | "medium" | "high" | "critical";

export type DocumentType =
  | "market_brief"
  | "launch_plan"
  | "roadmap"
  | "copy"
  | "operating_system"
  | "experiment_report"
  | "investor_update";

export type ConnectorStatus = "connected" | "available" | "attention";

export type LogLevel = "info" | "warn" | "error";

export type LogStage =
  | "planning"
  | "tool_use"
  | "tool_result"
  | "execution"
  | "review";

export interface MetricPoint {
  date: string;
  visitors: number;
  signups: number;
  customers: number;
  mrrUsd: number;
  arrUsd: number;
  aiSpendUsd: number;
  adSpendUsd: number;
  tasksCompleted: number;
}

export interface CompanyMetrics {
  visitors: number;
  signups: number;
  customers: number;
  conversionRate: number;
  mrrUsd: number;
  arrUsd: number;
  aiSpendUsd: number;
  adSpendUsd: number;
  runwayMonths: number;
  nps: number;
}

export interface AgentProfile {
  id: string;
  name: string;
  role: AgentRole;
  mission: string;
  status: AgentStatus;
  mood: string;
  spendTodayUsd: number;
  tasksCompleted: number;
  tools: string[];
  lastRunAt: string;
  latestUpdate: string;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  owner: AgentRole;
  tag: string;
  createdAt: string;
  updatedAt: string;
  dueAt?: string;
  outcome?: string;
}

export interface DocumentRecord {
  id: string;
  title: string;
  type: DocumentType;
  summary: string;
  author: AgentRole;
  createdAt: string;
  body: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  stage: LogStage;
  agentName: string;
  companyId: string;
  companyLabel: string;
  message: string;
}

export interface ConnectionRecord {
  id: string;
  name: string;
  category: "code" | "distribution" | "analytics" | "payments" | "operations";
  status: ConnectorStatus;
  description: string;
  connectedAt?: string;
}

export interface GrowthExperiment {
  id: string;
  name: string;
  channel: string;
  hypothesis: string;
  status: "queued" | "running" | "won" | "lost";
  resultSummary: string;
}

export interface CompanyRecord {
  id: string;
  slug: string;
  name: string;
  label: string;
  tagline: string;
  thesis: string;
  audience: string;
  offer: string;
  pricePoint: string;
  website: string;
  stage: CompanyStage;
  status: CompanyStatus;
  market: string;
  location: string;
  day: number;
  monthlyBudgetUsd: number;
  dailyBudgetUsd: number;
  runCadence: string;
  mood: string;
  createdAt: string;
  updatedAt: string;
  agents: AgentProfile[];
  tasks: TaskItem[];
  documents: DocumentRecord[];
  connections: ConnectionRecord[];
  experiments: GrowthExperiment[];
  metrics: CompanyMetrics;
  history: MetricPoint[];
  logs: ActivityLog[];
}

export interface UserProfile {
  email: string;
  name: string;
  timezone: string;
  defaultCompanySlug: string;
}

export interface MagicLinkRecord {
  id: string;
  email: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  usedAt?: string;
}

export interface SessionRecord {
  id: string;
  email: string;
  companySlug: string;
  createdAt: string;
  expiresAt: string;
}

export interface AppState {
  brand: {
    name: string;
    descriptor: string;
    supportEmail: string;
  };
  user: UserProfile;
  magicLinks: MagicLinkRecord[];
  sessions: SessionRecord[];
  companies: CompanyRecord[];
}

export interface PublicCompanyCard {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  website: string;
  stage: CompanyStage;
  day: number;
  arrUsd: number;
  visitors: number;
  customers: number;
}

export interface PublicDashboardPayload {
  success: true;
  brand: AppState["brand"];
  stats: {
    arrUsd: number;
    companies: number;
    tasksCompleted: number;
    docsCreated24h: number;
    messagesSent: number;
    activeAgents: number;
  };
  companies: PublicCompanyCard[];
  logs: ActivityLog[];
  tasks: TaskItem[];
  arrHistory: Array<{ date: string; arrUsd: number }>;
  dailyMetrics: {
    computedAt: string;
    activeCompanies: number;
    liveCompanies: number;
    wowArrGrowthPct: number;
    avgConversionPct: number;
    aiSpendTodayUsd: number;
  };
}

export interface OperatingCycleResult {
  company: CompanyRecord;
  createdTasks: TaskItem[];
  createdDocuments: DocumentRecord[];
  logs: ActivityLog[];
}
