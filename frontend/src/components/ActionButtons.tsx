import React from 'react';
import { Button, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import DiamondOutlinedIcon from '@mui/icons-material/DiamondOutlined';

const ActionButton = styled(Button)<{ variant: 'basic' | 'premium' }>(({ variant }) => ({
  padding: '16px 24px',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textTransform: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
  ...(variant === 'basic' ? {
    background: 'linear-gradient(135deg, #475569 0%, #64748b 100%)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(71, 85, 105, 0.3)'
    }
  } : {
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: 'white',
    '&:hover': {
      background: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 8px 20px rgba(245, 158, 11, 0.3)'
    }
  })
}));

interface ActionButtonsProps {
  onGenerateBasic?: () => void;
  onGeneratePremium?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onGenerateBasic, 
  onGeneratePremium 
}) => {
  return (
    <Stack 
      direction={{ xs: 'column', sm: 'row' }} 
      spacing={2.5} 
      sx={{ marginBottom: '40px' }}
    >
      <ActionButton 
        variant="basic" 
        fullWidth
        onClick={onGenerateBasic}
      >
        <StarOutlineIcon sx={{ fontSize: 20 }} />
        Generate Basic Suggestions
      </ActionButton>
      
      <ActionButton 
        variant="premium" 
        fullWidth
        onClick={onGeneratePremium}
      >
        <DiamondOutlinedIcon sx={{ fontSize: 20 }} />
        Generate Premium Suggestions
      </ActionButton>
    </Stack>
  );
};

export default ActionButtons;