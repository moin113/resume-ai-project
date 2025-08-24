import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme }) => ({
  background: '#f9fafb',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  textAlign: 'center',
  transition: 'all 0.2s ease',
  cursor: 'default',
  '&:hover': {
    boxShadow: '0 4px 20px rgba(37, 99, 235, 0.2)',
    transform: 'translateY(-2px)',
  },
}));

const StatNumber = styled(Typography)(({ theme }) => ({
  fontSize: '2.25rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  marginBottom: '8px',
  lineHeight: 1,
}));

const StatLabel = styled(Typography)(({ theme }) => ({
  fontSize: '1rem',
  fontWeight: 500,
  color: theme.palette.text.secondary,
}));

interface StatisticsCardProps {
  value: number;
  label: string;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({ value, label }) => {
  return (
    <StyledCard elevation={0}>
      <CardContent sx={{ py: 3, px: 2 }}>
        <StatNumber variant="h2">
          {value}
        </StatNumber>
        <StatLabel variant="body1">
          {label}
        </StatLabel>
      </CardContent>
    </StyledCard>
  );
};