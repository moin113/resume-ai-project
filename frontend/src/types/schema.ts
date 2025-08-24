// TypeScript interfaces for the dashboard data structure
export interface UserInfo {
  name: string;
  greeting: string;
}

export interface DashboardStats {
  resumes: number;
  jobDescriptions: number;
  scans: number;
}

export interface ScanCategory {
  name: string;
  percentage: number;
}

export interface RecentScan {
  id: number;
  fileName: string;
  description: string;
  timestamp: string;
  matchPercentage: number;
  keywordCount: number;
  categories: ScanCategory[];
}

export interface DashboardProps {
  user: UserInfo;
  stats: DashboardStats;
  recentScans: RecentScan[];
}