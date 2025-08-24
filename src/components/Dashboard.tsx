import React from 'react';
import { Box, Container, Stack } from '@mui/material';
import { HeaderNavigation } from './HeaderNavigation';
import { WelcomeBanner } from './WelcomeBanner';
import { StatsDashboard } from './StatsDashboard';
import { RecentScanHistory } from './RecentScanHistory';

interface KeywordData {
  keyword: string;
  percentage: number;
}

interface ScanData {
  fileName: string;
  jobDescription: string;
  scanDate: string;
  matchPercentage: number;
  keywordCount: number;
  keywordBreakdown: KeywordData[];
}

interface StatsData {
  resumes: number;
  jobDescriptions: number;
  scans: number;
}

interface UserData {
  name: string;
  greeting: string;
}

interface DashboardProps {
  user: UserData;
  stats: StatsData;
  recentScan: ScanData;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, stats, recentScan }) => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <HeaderNavigation userGreeting={user.greeting} />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={4}>
          <WelcomeBanner userName={user.name} />
          
          <StatsDashboard stats={stats} />
          
          <RecentScanHistory scanData={recentScan} />
        </Stack>
      </Container>
    </Box>
  );
};