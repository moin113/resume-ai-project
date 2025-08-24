import React, { useState } from 'react';
import { Paper, Typography, Button, Box, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadFileOutlinedIcon from '@mui/icons-material/UploadFileOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import FolderOpenOutlinedIcon from '@mui/icons-material/FolderOpenOutlined';

const UploadContainer = styled(Paper)(({ theme }) => ({
  background: 'rgba(51, 65, 85, 0.6)',
  border: '2px dashed rgba(71, 85, 105, 0.4)',
  borderRadius: '12px',
  padding: '30px',
  textAlign: 'center',
  transition: 'all 0.2s ease',
  backdropFilter: 'blur(10px)',
  '&:hover': {
    borderColor: 'rgba(71, 85, 105, 0.6)',
    background: 'rgba(51, 65, 85, 0.8)'
  }
}));

const SectionHeader = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '20px'
});

const SectionTitle = styled(Typography)({
  color: '#e2e8f0',
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

const DropZone = styled(Box)({
  border: '2px dashed #cbd5e1',
  borderRadius: '8px',
  padding: '40px 20px',
  marginBottom: '20px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: '#94a3af',
    background: 'rgba(255, 255, 255, 0.05)'
  }
});

const UploadIcon = styled(FolderOpenOutlinedIcon)({
  fontSize: '48px',
  marginBottom: '16px',
  color: '#94a3b8'
});

const UploadText = styled(Typography)({
  color: '#64748b',
  fontSize: '16px',
  marginBottom: '8px'
});

const UploadSubtext = styled(Typography)({
  color: '#94a3b8',
  fontSize: '14px'
});

const SelectButton = styled(Button)({
  background: 'rgba(71, 85, 105, 0.6)',
  color: '#e2e8f0',
  border: '1px solid rgba(71, 85, 105, 0.4)',
  borderRadius: '6px',
  padding: '4px 12px',
  fontSize: '12px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  textTransform: 'none',
  '&:hover': {
    background: 'rgba(71, 85, 105, 0.8)'
  }
});

const ResumeUploadSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'select'>('upload');

  return (
    <UploadContainer elevation={0}>
      <SectionHeader>
        <DescriptionOutlinedIcon sx={{ fontSize: 24, color: '#e2e8f0' }} />
        <SectionTitle>Resume</SectionTitle>
        <SelectButton>Select Saved</SelectButton>
      </SectionHeader>

      <TabContainer>
        <TabButton 
          active={activeTab === 'upload'}
          onClick={() => setActiveTab('upload')}
          startIcon={<UploadFileOutlinedIcon />}
        >
          Upload New
        </TabButton>
        <TabButton 
          active={activeTab === 'select'}
          onClick={() => setActiveTab('select')}
          startIcon={<DescriptionOutlinedIcon />}
        >
          Select Saved
        </TabButton>
      </TabContainer>

      {activeTab === 'upload' && (
        <DropZone>
          <UploadIcon />
          <UploadText>Drag & Drop or Upload</UploadText>
          <UploadSubtext>Supports PDF, DOC, DOCX files</UploadSubtext>
        </DropZone>
      )}

      {activeTab === 'select' && (
        <Box sx={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          borderRadius: '8px', 
          padding: '20px',
          color: '#94a3b8',
          fontSize: '14px'
        }}>
          Select from your saved resumes...
        </Box>
      )}
    </UploadContainer>
  );
};

export default ResumeUploadSection;