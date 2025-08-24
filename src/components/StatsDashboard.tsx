import React from 'react';
import { Stack } from '@mui/material';
import { StatisticsCard } from './StatisticsCard';

interface StatsData {
  resumes: number;
  jobDescriptions: number;
  scans: number;
}

interface StatsDashboardProps {
  stats: StatsData;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({ stats }) => {
  return (
    <Stack 
      direction={{ xs: 'column', md: 'row' }} 
      spacing={2}
      sx={{ width: '100%' }}
    >
      <StatisticsCard value={stats.resumes} label="Resumes" />
      <StatisticsCard value={stats.jobDescriptions} label="Job Descriptions" />
      <StatisticsCard value={stats.scans} label="Scans" />
    </Stack>
  );
};