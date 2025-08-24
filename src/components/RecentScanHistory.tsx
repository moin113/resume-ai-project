import React from 'react';
import { Paper, Typography, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { KeywordBreakdown } from './KeywordBreakdown';

const SectionContainer = styled(Paper)(({ theme }) => ({
  padding: '24px',
  borderRadius: '12px',
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '1.375rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: '20px',
}));

const ScanCard = styled(Box)(({ theme }) => ({
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  padding: '20px',
  backgroundColor: '#f9fafb',
}));

const ScanHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '8px',
}));

const DocumentIcon = styled(Box)(({ theme }) => ({
  fontSize: '22px',
  color: theme.palette.primary.main,
}));

const FileName = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  fontSize: '1.125rem',
}));

const JobDescription = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  fontWeight: 500,
  color: theme.palette.text.secondary,
  marginBottom: '4px',
  marginLeft: '34px',
}));

const ScanDate = styled(Typography)(({ theme }) => ({
  fontSize: '0.75rem',
  fontWeight: 400,
  color: '#cbd5e1',
  marginLeft: '34px',
  marginBottom: '12px',
}));

const ScoreContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px',
  flexWrap: 'wrap',
}));

const MatchPercentage = styled(Box)(({ theme }) => ({
  backgroundColor: '#fee2e2',
  color: '#991b1b',
  padding: '6px 12px',
  borderRadius: '20px',
  fontSize: '0.9rem',
  fontWeight: 700,
}));

const KeywordCount = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontWeight: 500,
  fontSize: '0.875rem',
}));

const ScoreBlock = styled(Box)(({ theme }) => ({
  marginTop: '16px',
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  padding: '16px 12px',
}));

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

interface RecentScanHistoryProps {
  scanData: ScanData;
}

export const RecentScanHistory: React.FC<RecentScanHistoryProps> = ({ scanData }) => {
  return (
    <SectionContainer elevation={0}>
      <SectionTitle variant="h5">
        Recent Scan History
      </SectionTitle>
      
      <ScanCard>
        <ScanHeader>
          <DocumentIcon>📄</DocumentIcon>
          <FileName variant="h6">
            {scanData.fileName}
          </FileName>
        </ScanHeader>
        
        <JobDescription variant="body2">
          {scanData.jobDescription}
        </JobDescription>
        
        <ScanDate variant="caption">
          {scanData.scanDate}
        </ScanDate>
        
        <ScoreContainer>
          <MatchPercentage>
            {scanData.matchPercentage} %
          </MatchPercentage>
          <KeywordCount variant="body2">
            {scanData.keywordCount} keywords
          </KeywordCount>
        </ScoreContainer>
        
        <ScoreBlock>
          <KeywordBreakdown keywords={scanData.keywordBreakdown} />
        </ScoreBlock>
      </ScanCard>
    </SectionContainer>
  );
};