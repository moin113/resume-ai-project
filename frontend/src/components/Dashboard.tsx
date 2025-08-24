import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import NavigationHeader from './NavigationHeader';
import WelcomeHero from './WelcomeHero';
import StatsCard from './StatsCard';
import ScanHistoryCard from './ScanHistoryCard';
import ResumeUploadSection from './ResumeUploadSection';
import JobDescriptionSection from './JobDescriptionSection';
import ActionButtons from './ActionButtons';
import { DashboardProps } from '../types/schema';

const DashboardContainer = styled(Box)({
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 25%, #cbd5e1 50%, #f8fafc 75%, #ffffff 100%)',
  backgroundAttachment: 'fixed',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `
      linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%),
      linear-gradient(-45deg, transparent 25%, rgba(226,232,240,0.3) 25%, rgba(226,232,240,0.3) 50%, transparent 50%, transparent 75%, rgba(226,232,240,0.3) 75%)
    `,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
    zIndex: -1
  }
});

const ContentContainer = styled(Box)({
  padding: '30px',
  maxWidth: '1200px',
  margin: '0 auto'
});

const WelcomeSection = styled(Box)({
  marginBottom: '40px'
});

const MainContentGrid = styled(Stack)({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '30px',
  marginBottom: '40px',
  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
    gap: '20px'
  }
});

const StatsGrid = styled(Stack)({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
  gap: '30px',
  marginBottom: '40px'
});

const SectionTitle = styled(Typography)({
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '#1f2937',
  marginBottom: '20px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
});

interface DashboardComponentProps extends DashboardProps {
  onNavigate?: (section: string) => void;
}

const Dashboard: React.FC<DashboardComponentProps> = ({ 
  user, 
  stats, 
  recentScans, 
  onNavigate 
}) => {
  const handleGenerateBasic = () => {
    console.log('Generating basic suggestions...');
  };

  const handleGeneratePremium = () => {
    console.log('Generating premium suggestions...');
  };

  return (
    <DashboardContainer>
      <NavigationHeader 
        userName={user.greeting} 
        onNavigate={onNavigate}
      />
      
      <ContentContainer>
        <WelcomeSection>
          <WelcomeHero userName={user.name} />
          
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#6b7280', 
              marginBottom: '40px',
              textAlign: 'center',
              fontSize: '1rem'
            }}
          >
            AI-Powered Resume Analysis & Job Matching Platform
          </Typography>
        </WelcomeSection>

        <MainContentGrid>
          <ResumeUploadSection />
          <JobDescriptionSection />
        </MainContentGrid>

        <ActionButtons 
          onGenerateBasic={handleGenerateBasic}
          onGeneratePremium={handleGeneratePremium}
        />

        <StatsGrid>
          <StatsCard number={stats.resumes} label="Resumes" />
          <StatsCard number={stats.jobDescriptions} label="Job Descriptions" />
          <StatsCard number={stats.scans} label="Scans" />
        </StatsGrid>

        <Box>
          <SectionTitle variant="h3">
            📈 Recent Scan History
          </SectionTitle>
          
          <Stack spacing={2}>
            {recentScans.map((scan) => (
              <ScanHistoryCard key={scan.id} scan={scan} />
            ))}
          </Stack>
        </Box>
      </ContentContainer>
    </DashboardContainer>
  );
};

export default Dashboard;