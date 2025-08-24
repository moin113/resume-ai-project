import React, { useState } from 'react';
import { Paper, Typography, Button, Box, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';

const JobDescriptionContainer = styled(Paper)({
  background: '#f8fafc',
  border: '2px solid #e2e8f0',
  borderRadius: '12px',
  padding: '30px'
});

const SectionHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '20px'
});

const SectionTitle = styled(Typography)({
  color: '#1f2937',
  margin: 0,
  fontSize: '18px',
  fontWeight: 600
});

const TabContainer = styled(Box)({
  display: 'flex',
  gap: '10px',
  justifyContent: 'center',
  marginBottom: '15px'
});

const TabButton = styled(Button)<{ active?: boolean }>(({ active }) => ({
  background: active ? '#3b82f6' : '#6b7280',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '8px 16px',
  fontSize: '14px',
  cursor: 'pointer',
  textTransform: 'none',
  '&:hover': {
    background: active ? '#2563eb' : '#4b5563'
  }
}));

const ExampleContainer = styled(Box)({
  marginBottom: '16px'
});

const ExampleTitle = styled(Typography)({
  color: '#374151',
  fontWeight: 600,
  marginBottom: '8px'
});

const ExampleBox = styled(Box)({
  background: 'white',
  border: '1px solid #d1d5db',
  borderRadius: '6px',
  padding: '12px',
  fontSize: '14px',
  color: '#4b5563',
  maxHeight: '120px',
  overflowY: 'auto'
});

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    background: 'white',
    '& fieldset': {
      border: '1px solid #d1d5db'
    },
    '&:hover fieldset': {
      border: '1px solid #9ca3af'
    },
    '&.Mui-focused fieldset': {
      border: '2px solid #3b82f6'
    }
  },
  '& .MuiOutlinedInput-input': {
    padding: '12px',
    fontSize: '14px',
    fontFamily: 'inherit',
    '&::placeholder': {
      color: '#9ca3af',
      opacity: 1
    }
  }
});

const SaveButton = styled(Button)({
  background: '#059669',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '8px 16px',
  fontSize: '14px',
  cursor: 'pointer',
  textTransform: 'none',
  opacity: 0.5,
  '&:hover': {
    background: '#047857'
  },
  '&:disabled': {
    opacity: 0.5,
    background: '#9ca3af'
  }
});

const SelectButton = styled(Button)({
  background: '#6b7280',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  padding: '4px 12px',
  fontSize: '12px',
  cursor: 'pointer',
  textTransform: 'none',
  '&:hover': {
    background: '#4b5563'
  }
});

const JobDescriptionSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'enter' | 'select'>('enter');
  const [jobDescription, setJobDescription] = useState('');

  const exampleText = `We are seeking a talented Software Engineer to join our dynamic team. The ideal candidate will have experience in:

• Python, JavaScript, and modern web frameworks
• Database design and optimization
• Agile development methodologies
• Cloud platforms (AWS, Azure, GCP)`;

  return (
    <JobDescriptionContainer elevation={0}>
      <SectionHeader>
        <WorkOutlineOutlinedIcon sx={{ fontSize: 24, color: '#1f2937' }} />
        <SectionTitle>Job Description</SectionTitle>
        <SelectButton>Select Saved</SelectButton>
      </SectionHeader>

      <TabContainer>
        <TabButton 
          active={activeTab === 'enter'}
          onClick={() => setActiveTab('enter')}
          startIcon={<EditOutlinedIcon />}
        >
          Enter New
        </TabButton>
        <TabButton 
          active={activeTab === 'select'}
          onClick={() => setActiveTab('select')}
          startIcon={<FolderOpenOutlinedIcon />}
        >
          Select Saved
        </TabButton>
      </TabContainer>

      {activeTab === 'enter' && (
        <>
          <ExampleContainer>
            <ExampleTitle>Example:</ExampleTitle>
            <ExampleBox>
              {exampleText}
            </ExampleBox>
          </ExampleContainer>

          <StyledTextField
            fullWidth
            multiline
            rows={4}
            placeholder="Paste your job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            sx={{ marginBottom: '12px' }}
          />

          <Box sx={{ marginTop: '12px' }}>
            <SaveButton
              startIcon={<SaveOutlinedIcon />}
              disabled={!jobDescription.trim()}
            >
              Save & Extract Keywords
            </SaveButton>
          </Box>
        </>
      )}

      {activeTab === 'select' && (
        <Box sx={{ 
          background: 'white', 
          border: '1px solid #d1d5db', 
          borderRadius: '6px', 
          padding: '20px',
          color: '#6b7280',
          fontSize: '14px',
          textAlign: 'center'
        }}>
          Select from your saved job descriptions...
        </Box>
      )}
    </JobDescriptionContainer>
  );
};

export default JobDescriptionSection;