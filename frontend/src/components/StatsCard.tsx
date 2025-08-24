import React from 'react';
import { Card, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StatCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  border: '1px solid rgba(148, 163, 184, 0.2)',
  borderRadius: '12px',
  padding: '30px',
  textAlign: 'center',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 8px rgba(71, 85, 105, 0.08)',
  backdropFilter: 'blur(20px)',
  '&:hover': {
    borderColor: '#475569',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 20px rgba(71, 85, 105, 0.15)'
  }
}));

const StatNumber = styled(Typography)({
  fontSize: '3rem',
  fontWeight: 'bold',
  color: '#1f2937',
  marginBottom: '8px',
  lineHeight: 1
});

const StatLabel = styled(Typography)({
  fontSize: '1.125rem',
  color: '#6b7280',
  fontWeight: 500
});

interface StatsCardProps {
  number: number;
  label: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ number, label }) => {
  return (
    <StatCard elevation={0}>
      <StatNumber variant="h2">
        {number}
      </StatNumber>
      <StatLabel variant="h6">
        {label}
      </StatLabel>
    </StatCard>
  );
};

export default StatsCard;