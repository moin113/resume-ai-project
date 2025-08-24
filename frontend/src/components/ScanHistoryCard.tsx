import React from 'react';
import { Card, Typography, Box, Stack, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import { RecentScan } from '../types/schema';

const HistoryCard = styled(Card)(({ theme }) => ({
  background: 'white',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  padding: '20px',
  marginBottom: '16px',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#475569',
    boxShadow: '0 4px 12px rgba(71, 85, 105, 0.1)',
    transform: 'translateY(-2px)'
  }
}));

const FileName = styled(Typography)({
  fontWeight: 600,
  color: '#1f2937',
  fontSize: '1.125rem',
  marginBottom: '4px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
});

const Description = styled(Typography)({
  color: '#6b7280',
  fontSize: '0.875rem',
  marginBottom: '8px'
});

const Timestamp = styled(Typography)({
  color: '#9ca3af',
  fontSize: '0.75rem'
});

const PercentageChip = styled(Chip)<{ percentage: number }>(({ percentage }) => ({
  fontWeight: 'bold',
  fontSize: '1rem',
  padding: '8px 16px',
  height: 'auto',
  backgroundColor: percentage >= 80 ? '#dcfce7' : 
                   percentage >= 60 ? '#dbeafe' :
                   percentage >= 40 ? '#fef3c7' : '#fee2e2',
  color: percentage >= 80 ? '#166534' :
         percentage >= 60 ? '#1e40af' :
         percentage >= 40 ? '#92400e' : '#dc2626',
  border: percentage >= 80 ? '1px solid #bbf7d0' :
          percentage >= 60 ? '1px solid #bfdbfe' :
          percentage >= 40 ? '1px solid #fde68a' : '1px solid #fecaca'
}));

const KeywordText = styled(Typography)({
  color: '#6b7280',
  fontSize: '0.875rem'
});

const CategoryContainer = styled(Box)({
  display: 'flex',
  gap: '12px',
  marginTop: '12px',
  flexWrap: 'wrap'
});

const CategoryItem = styled(Box)({
  textAlign: 'center',
  minWidth: '80px'
});

const CategoryPercentage = styled(Typography)({
  fontSize: '1.25rem',
  fontWeight: 'bold',
  color: '#1f2937'
});

const CategoryName = styled(Typography)({
  fontSize: '0.75rem',
  color: '#6b7280',
  textTransform: 'capitalize'
});

interface ScanHistoryCardProps {
  scan: RecentScan;
}

const ScanHistoryCard: React.FC<ScanHistoryCardProps> = ({ scan }) => {
  return (
    <HistoryCard elevation={0}>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
        <Box flex={1}>
          <FileName variant="h6">
            <DescriptionOutlinedIcon sx={{ fontSize: 20, color: '#3b82f6' }} />
            {scan.fileName}
          </FileName>
          <Description variant="body2">
            {scan.description}
          </Description>
          <Timestamp variant="caption">
            {scan.timestamp}
          </Timestamp>
        </Box>
        
        <Stack alignItems="flex-end" spacing={1}>
          <PercentageChip 
            label={`${scan.matchPercentage} %`}
            percentage={scan.matchPercentage}
          />
          <KeywordText variant="body2">
            {scan.keywordCount} keywords
          </KeywordText>
        </Stack>
      </Stack>

      <CategoryContainer>
        {scan.categories.map((category, index) => (
          <CategoryItem key={index}>
            <CategoryPercentage variant="h6">
              {category.percentage} %
            </CategoryPercentage>
            <CategoryName variant="caption">
              {category.name}
            </CategoryName>
          </CategoryItem>
        ))}
      </CategoryContainer>
    </HistoryCard>
  );
};

export default ScanHistoryCard;