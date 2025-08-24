import React from 'react';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const KeywordContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '16px',
  marginTop: '12px',
  flexWrap: 'wrap',
  justifyContent: 'center',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: '8px',
  },
}));

const KeywordItem = styled(Box)(({ theme }) => ({
  flex: 1,
  backgroundColor: '#f1f5f9',
  borderRadius: '8px',
  padding: '12px 8px',
  textAlign: 'center',
  minWidth: '80px',
}));

const KeywordPercentage = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: theme.palette.text.primary,
  fontSize: '1rem',
  marginBottom: '4px',
}));

const KeywordLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 400,
  fontSize: '0.85rem',
  color: theme.palette.text.secondary,
}));

interface KeywordData {
  keyword: string;
  percentage: number;
}

interface KeywordBreakdownProps {
  keywords: KeywordData[];
}

export const KeywordBreakdown: React.FC<KeywordBreakdownProps> = ({ keywords }) => {
  return (
    <KeywordContainer>
      {keywords.map((item, index) => (
        <KeywordItem key={index}>
          <KeywordPercentage variant="body1">
            {item.percentage} %
          </KeywordPercentage>
          <KeywordLabel variant="body2">
            {item.keyword}
          </KeywordLabel>
        </KeywordItem>
      ))}
    </KeywordContainer>
  );
};