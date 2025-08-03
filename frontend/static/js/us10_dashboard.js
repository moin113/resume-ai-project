// Resume Doctor.Ai US-10 Dashboard JavaScript with Scan History

// Global variables for pagination
let currentPage = 1;
let currentFilter = '';

document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 Resume Doctor.Ai Dashboard Loaded (US-10)');

    // Check authentication
    checkAuthentication();

    // Load user info
    loadUserInfo();

    // Load user job descriptions
    loadUserJobDescriptions();

    // Load user resumes
    loadUserResumes();

    // Load scan history
    loadScanHistory();

    // Load dashboard statistics
    loadDashboardStats();

    // Initialize new dashboard features
    initializeDashboardFeatures();
});

// Global variables for suggestions
let selectedResumeId = null;
let selectedJobDescriptionId = null;
let currentJobDescriptionText = '';

// Global variables for dropdowns
let availableResumes = [];
let availableJobDescriptions = [];
let currentResumeMode = 'upload'; // 'upload' or 'select'
let currentJDMode = 'enter'; // 'enter' or 'select'

function initializeDashboardFeatures() {
    // Setup drag and drop for resume upload
    setupResumeUpload();

    // Setup job description text area
    setupJobDescription();

    // Setup dropdown functionality
    setupDropdowns();

    // Setup button states
    updateButtonStates();
}

function setupResumeUpload() {
    const dropZone = document.getElementById('resumeDropZone');
    const fileInput = document.getElementById('resumeFileInput');

    if (!dropZone || !fileInput) return;

    // Click to upload
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleResumeFile(e.target.files[0]);
        }
    });

    // Drag and drop events
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#475569';
        dropZone.style.backgroundColor = '#f3f4f6';
    });

    dropZone.addEventListener('dragleave', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#cbd5e1';
        dropZone.style.backgroundColor = 'transparent';
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.borderColor = '#cbd5e1';
        dropZone.style.backgroundColor = 'transparent';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleResumeFile(files[0]);
        }
    });
}

async function handleResumeFile(file) {
    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
        showAlert('Please upload a PDF, DOC, or DOCX file.', 'warning');
        return;
    }

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
        showAlert('File size must be less than 10MB.', 'warning');
        return;
    }

    // Upload the file
    const formData = new FormData();
    formData.append('resume', file);

    try {
        showLoading(true);

        const token = localStorage.getItem('dr_resume_token');
        const response = await fetch('/api/upload_resume', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok && data.success) {
            selectedResumeId = data.resume.id;
            updateButtonStates();
            showAlert('Resume uploaded successfully!', 'success');
            console.log('Resume upload response:', data); // Debug log
        } else {
            throw new Error(data.message || 'Upload failed');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showAlert('Error uploading resume. Please try again.', 'danger');
    } finally {
        showLoading(false);
    }
}

// Resume display function removed - info section no longer needed

function setupJobDescription() {
    const textarea = document.getElementById('jobDescriptionText');
    if (!textarea) return;

    textarea.addEventListener('input', (e) => {
        currentJobDescriptionText = e.target.value.trim();
        updateButtonStates();
        updateSaveJobDescriptionButton();
    });
}

function updateSaveJobDescriptionButton() {
    const saveBtn = document.getElementById('saveJobDescriptionBtn');
    if (!saveBtn) return;

    const hasText = currentJobDescriptionText.length > 50; // Minimum length for job description
    saveBtn.disabled = !hasText;
    saveBtn.style.opacity = hasText ? '1' : '0.5';
    saveBtn.style.cursor = hasText ? 'pointer' : 'not-allowed';
}

async function manualSaveJobDescription() {
    if (!currentJobDescriptionText || currentJobDescriptionText.length < 50) {
        showAlert('Please enter a job description with at least 50 characters.', 'warning');
        return;
    }

    try {
        const saveBtn = document.getElementById('saveJobDescriptionBtn');
        if (saveBtn) {
            saveBtn.disabled = true;
            saveBtn.textContent = '💾 Saving...';
        }

        await saveJobDescription(currentJobDescriptionText);

        if (saveBtn) {
            saveBtn.textContent = '✅ Saved';
            setTimeout(() => {
                saveBtn.textContent = '💾 Save & Extract Keywords';
                updateSaveJobDescriptionButton();
            }, 2000);
        }
    } catch (error) {
        showAlert(`Failed to save job description: ${error.message}`, 'error');
        const saveBtn = document.getElementById('saveJobDescriptionBtn');
        if (saveBtn) {
            saveBtn.textContent = '💾 Save & Extract Keywords';
            updateSaveJobDescriptionButton();
        }
    }
}

function updateButtonStates() {
    const basicBtn = document.getElementById('generateBasicBtn');
    const premiumBtn = document.getElementById('generatePremiumBtn');

    // Check if we have a resume (either uploaded or selected)
    let hasResume = false;
    if (currentResumeMode === 'upload') {
        hasResume = selectedResumeId !== null;
    } else {
        hasResume = selectedResumeId !== null;
    }

    // Check if we have job description content (either entered or selected)
    let hasJobDescription = false;
    if (currentJDMode === 'enter') {
        hasJobDescription = currentJobDescriptionText.length > 0;
    } else {
        // In select mode, just check if we have a selected job description ID
        hasJobDescription = selectedJobDescriptionId !== null;
    }

    const canGenerate = hasResume && hasJobDescription;

    console.log('Button state check:', {
        currentResumeMode,
        currentJDMode,
        selectedResumeId,
        selectedJobDescriptionId,
        hasResume,
        hasJobDescription,
        canGenerate
    });

    if (basicBtn) {
        basicBtn.disabled = !canGenerate;
        basicBtn.style.opacity = canGenerate ? '1' : '0.5';
        basicBtn.style.cursor = canGenerate ? 'pointer' : 'not-allowed';
    }

    if (premiumBtn) {
        premiumBtn.disabled = !canGenerate;
        premiumBtn.style.opacity = canGenerate ? '1' : '0.5';
        premiumBtn.style.cursor = canGenerate ? 'pointer' : 'not-allowed';
    }
}

async function generateBasicSuggestions() {
    if (!selectedResumeId || (!selectedJobDescriptionId && !currentJobDescriptionText)) {
        showAlert('Please upload a resume and enter a job description.', 'warning');
        return;
    }

    try {
        showLoading(true);

        // First, save the job description if it's new text
        let jobId = selectedJobDescriptionId;
        if (!jobId && currentJobDescriptionText) {
            jobId = await saveJobDescription(currentJobDescriptionText);
        }

        // Calculate and display matching score first
        await calculateAndDisplayMatchingScore(selectedResumeId, jobId);

        const token = localStorage.getItem('dr_resume_token');
        const response = await fetch('/api/basic_suggestions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                resume_id: selectedResumeId,
                job_description_id: jobId
            })
        });

        const data = await response.json();

        if (response.ok) {
            try {
                displaySuggestions(data.suggestions, 'basic');
                if (data.matching_score) {
                    displayMatchingScore(data.matching_score);
                }
                showAlert(`Generated ${data.total_suggestions || data.suggestions?.length || 0} basic suggestions!`, 'success');
            } catch (displayError) {
                console.error('Error displaying basic suggestions:', displayError);
                // Still show success since API call worked, just display failed
                showAlert(`Generated ${data.total_suggestions || data.suggestions?.length || 0} basic suggestions!`, 'success');
            }
        } else {
            throw new Error(data.message || 'Failed to generate suggestions');
        }
    } catch (error) {
        console.error('Error generating basic suggestions:', error);
        showAlert('Error generating basic suggestions. Please try again.', 'danger');
    } finally {
        showLoading(false);
    }
}

async function generatePremiumSuggestions() {
    if (!selectedResumeId || (!selectedJobDescriptionId && !currentJobDescriptionText)) {
        showAlert('Please upload a resume and enter a job description.', 'warning');
        return;
    }

    try {
        showLoading(true);

        // First, save the job description if it's new text
        let jobId = selectedJobDescriptionId;
        if (!jobId && currentJobDescriptionText) {
            jobId = await saveJobDescription(currentJobDescriptionText);
        }

        // Calculate and display matching score first
        await calculateAndDisplayMatchingScore(selectedResumeId, jobId);

        const token = localStorage.getItem('dr_resume_token');
        const response = await fetch('/api/premium_suggestions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                resume_id: selectedResumeId,
                job_description_id: jobId
            })
        });

        const data = await response.json();

        if (response.ok) {
            try {
                displaySuggestions(data.suggestions, 'premium');
                if (data.matching_score) {
                    displayMatchingScore(data.matching_score);
                }
                showAlert(`Generated ${data.total_suggestions || data.suggestions?.length || 0} premium suggestions!`, 'success');
            } catch (displayError) {
                console.error('Error displaying premium suggestions:', displayError);
                // Still show success since API call worked, just display failed
                showAlert(`Generated ${data.total_suggestions || data.suggestions?.length || 0} premium suggestions!`, 'success');
            }
        } else {
            throw new Error(data.message || 'Failed to generate suggestions');
        }
    } catch (error) {
        console.error('Error generating premium suggestions:', error);
        showAlert('Error generating premium suggestions. Please try again.', 'danger');
    } finally {
        showLoading(false);
    }
}

async function saveJobDescription(jobText) {
    try {
        const token = localStorage.getItem('dr_resume_token');
        const response = await fetch('/api/upload_jd', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: 'Job Description from Dashboard',
                company_name: 'Unknown Company',
                job_text: jobText
            })
        });

        const data = await response.json();
        if (response.ok && data.success) {
            selectedJobDescriptionId = data.job_description.id;
            showAlert('Job description saved successfully!', 'success');
            console.log('Job description save response:', data); // Debug log
            return data.job_description.id;
        } else {
            throw new Error(data.message || 'Failed to save job description');
        }
    } catch (error) {
        console.error('Error saving job description:', error);
        throw error;
    }
}

// Job description display function removed - info section no longer needed

async function calculateAndDisplayMatchingScore(resumeId, jobDescriptionId) {
    try {
        const token = localStorage.getItem('dr_resume_token');
        const response = await fetch('/api/calculate_match', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                resume_id: parseInt(resumeId),
                job_description_id: parseInt(jobDescriptionId)
            })
        });

        const data = await response.json();
        if (response.ok && data.success) {
            displayMatchingScore(data);
            console.log('Matching score calculated:', data); // Debug log
        } else {
            console.error('Failed to calculate matching score:', data.message);
        }
    } catch (error) {
        console.error('Error calculating matching score:', error);
    }
}

function displayMatchingScore(matchData) {
    const container = document.getElementById('suggestionsContainer');
    const scoreSection = document.getElementById('matchingScoreSection');
    const scoreContent = document.getElementById('matchingScoreContent');

    if (!container || !scoreSection || !scoreContent) return;

    const { detailed_scores, keyword_analysis } = matchData;

    // Show the suggestions container and score section
    container.style.display = 'block';
    scoreSection.style.display = 'block';

    // Create the score display HTML
    const scoreHtml = `
        <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 30px; align-items: center;">
            <!-- Overall Score Circle -->
            <div style="text-align: center;">
                <div style="width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(${getScoreColor(detailed_scores.overall_score)} 0deg, ${getScoreColor(detailed_scores.overall_score)} ${(detailed_scores.overall_score / 100) * 360}deg, #e5e7eb ${(detailed_scores.overall_score / 100) * 360}deg); display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">
                    <div style="width: 90px; height: 90px; border-radius: 50%; background: white; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <div style="font-size: 24px; font-weight: bold; color: ${getScoreColor(detailed_scores.overall_score)};">${detailed_scores.overall_score}%</div>
                        <div style="font-size: 12px; color: #6b7280;">Overall</div>
                    </div>
                </div>
                <div style="color: #374151; font-weight: 600;">Match Score</div>
            </div>

            <!-- Detailed Scores -->
            <div style="space-y: 16px;">
                <div style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="color: #374151; font-weight: 500;">Technical Skills</span>
                        <span style="color: #6b7280; font-weight: 600;">${detailed_scores.technical_score}%</span>
                    </div>
                    <div style="width: 100%; background: #e5e7eb; border-radius: 4px; height: 8px;">
                        <div style="background: ${getScoreColor(detailed_scores.technical_score)}; height: 8px; border-radius: 4px; width: ${detailed_scores.technical_score}%;"></div>
                    </div>
                </div>

                <div style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="color: #374151; font-weight: 500;">Soft Skills</span>
                        <span style="color: #6b7280; font-weight: 600;">${detailed_scores.soft_skills_score}%</span>
                    </div>
                    <div style="width: 100%; background: #e5e7eb; border-radius: 4px; height: 8px;">
                        <div style="background: ${getScoreColor(detailed_scores.soft_skills_score)}; height: 8px; border-radius: 4px; width: ${detailed_scores.soft_skills_score}%;"></div>
                    </div>
                </div>

                <div style="margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                        <span style="color: #374151; font-weight: 500;">Other Keywords</span>
                        <span style="color: #6b7280; font-weight: 600;">${detailed_scores.other_keywords_score}%</span>
                    </div>
                    <div style="width: 100%; background: #e5e7eb; border-radius: 4px; height: 8px;">
                        <div style="background: ${getScoreColor(detailed_scores.other_keywords_score)}; height: 8px; border-radius: 4px; width: ${detailed_scores.other_keywords_score}%;"></div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Keyword Analysis Summary -->
        <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 16px; text-align: center;">
                <div>
                    <div style="font-size: 20px; font-weight: bold; color: #059669;">${keyword_analysis.matched_keywords}</div>
                    <div style="color: #6b7280; font-size: 14px;">Matched Keywords</div>
                </div>
                <div>
                    <div style="font-size: 20px; font-weight: bold; color: #0ea5e9;">${keyword_analysis.total_resume_keywords}</div>
                    <div style="color: #6b7280; font-size: 14px;">Resume Keywords</div>
                </div>
                <div>
                    <div style="font-size: 20px; font-weight: bold; color: #64748b;">${keyword_analysis.total_jd_keywords}</div>
                    <div style="color: #6b7280; font-size: 14px;">JD Keywords</div>
                </div>
                <div>
                    <div style="font-size: 20px; font-weight: bold; color: #f59e0b;">${Math.round(keyword_analysis.match_percentage)}%</div>
                    <div style="color: #6b7280; font-size: 14px;">Coverage</div>
                </div>
            </div>
        </div>
    `;

    scoreContent.innerHTML = scoreHtml;
}

function getScoreColor(score) {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#3b82f6'; // Blue
    if (score >= 40) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
}

function displaySuggestions(suggestions, type) {
    const container = document.getElementById('suggestionsContainer');
    const basicCard = document.getElementById('basicSuggestionsCard');
    const premiumCard = document.getElementById('premiumSuggestionsCard');

    if (!container || !basicCard || !premiumCard) return;

    // Show the suggestions container
    container.style.display = 'block';

    if (type === 'basic') {
        displayBasicSuggestions(suggestions);
        basicCard.style.display = 'block';
        premiumCard.style.display = 'none';
    } else if (type === 'premium') {
        displayPremiumSuggestions(suggestions);
        premiumCard.style.display = 'block';
        basicCard.style.display = 'none';
    }

    // Scroll to suggestions
    container.scrollIntoView({ behavior: 'smooth' });
}

function displayBasicSuggestions(suggestions) {
    const body = document.getElementById('basicSuggestionsBody');
    const count = document.getElementById('basicCount');

    if (!body || !count) return;

    count.textContent = suggestions.length;

    // Group suggestions by category for better organization
    const groupedSuggestions = groupSuggestionsByType(suggestions);

    let html = '';

    // Display suggestions by category
    Object.keys(groupedSuggestions).forEach(category => {
        const categorySuggestions = groupedSuggestions[category];
        if (categorySuggestions.length > 0) {
            html += `
                <div class="suggestion-category-group" style="margin-bottom: 20px;">
                    <h6 style="color: #475569; font-weight: 600; margin-bottom: 12px; text-transform: capitalize;">
                        ${getCategoryDisplayName(category)} (${categorySuggestions.length})
                    </h6>
                    ${categorySuggestions.map(suggestion => createSuggestionHTML(suggestion, false)).join('')}
                </div>
            `;
        }
    });

    if (html === '') {
        html = '<p style="color: #6b7280; text-align: center; padding: 20px;">No basic suggestions available.</p>';
    }

    body.innerHTML = html;
}

function displayPremiumSuggestions(suggestions) {
    const body = document.getElementById('premiumSuggestionsBody');
    const count = document.getElementById('premiumCount');

    if (!body || !count) return;

    count.textContent = suggestions.length;

    // Group suggestions by category for better organization
    const groupedSuggestions = groupSuggestionsByType(suggestions);

    let html = '';

    // Display suggestions by category
    Object.keys(groupedSuggestions).forEach(category => {
        const categorySuggestions = groupedSuggestions[category];
        if (categorySuggestions.length > 0) {
            html += `
                <div class="suggestion-category-group" style="margin-bottom: 20px;">
                    <h6 style="color: #f59e0b; font-weight: 600; margin-bottom: 12px; text-transform: capitalize;">
                        ${getCategoryDisplayName(category)} (${categorySuggestions.length})
                        <span class="badge" style="background: #f59e0b; color: white; font-size: 10px; margin-left: 8px;">PREMIUM</span>
                    </h6>
                    ${categorySuggestions.map(suggestion => createSuggestionHTML(suggestion, true)).join('')}
                </div>
            `;
        }
    });

    if (html === '') {
        html = '<p style="color: #6b7280; text-align: center; padding: 20px;">No premium suggestions available.</p>';
    }

    body.innerHTML = html;
}



function showAlert(message, type = 'info') {
    const container = document.getElementById('alertContainer');
    if (!container) return;

    const alertClass = {
        'success': 'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;',
        'danger': 'background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;',
        'warning': 'background: #fef3c7; color: #92400e; border: 1px solid #fcd34d;',
        'info': 'background: #dbeafe; color: #1e40af; border: 1px solid #93c5fd;'
    };

    const alertHtml = `
        <div style="${alertClass[type]} padding: 12px 16px; border-radius: 8px; margin-bottom: 16px; font-size: 14px;">
            ${message}
        </div>
    `;

    container.innerHTML = alertHtml;

    // Auto-hide after 5 seconds
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

function showLoading(show) {
    const indicator = document.getElementById('loadingIndicator');
    if (!indicator) return;

    indicator.style.display = show ? 'block' : 'none';
}

// New dropdown functionality
function setupDropdowns() {
    // Setup resume dropdown
    const resumeDropdown = document.getElementById('savedResumeDropdown');
    if (resumeDropdown) {
        resumeDropdown.addEventListener('change', handleResumeSelection);
    }

    // Setup job description dropdown
    const jdDropdown = document.getElementById('savedJDDropdown');
    if (jdDropdown) {
        jdDropdown.addEventListener('change', handleJDSelection);
    }

    // Load available data for dropdowns
    loadDropdownData();
}

async function loadDropdownData() {
    try {
        const token = localStorage.getItem('dr_resume_token');

        // Load resumes
        const resumeResponse = await fetch('/api/resumes', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (resumeResponse.ok) {
            const resumeResult = await resumeResponse.json();
            if (resumeResult.success) {
                availableResumes = resumeResult.resumes;
                populateResumeDropdown();
            }
        }

        // Load job descriptions
        const jdResponse = await fetch('/api/job_descriptions', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (jdResponse.ok) {
            const jdResult = await jdResponse.json();
            if (jdResult.success) {
                availableJobDescriptions = jdResult.job_descriptions;
                populateJDDropdown();
            }
        }

    } catch (error) {
        console.error('Error loading dropdown data:', error);
    }
}

function populateResumeDropdown() {
    const dropdown = document.getElementById('savedResumeDropdown');
    if (!dropdown) return;

    // Clear existing options except the first one
    dropdown.innerHTML = '<option value="">Select a saved resume...</option>';

    // Add resume options
    availableResumes.forEach(resume => {
        const option = document.createElement('option');
        option.value = resume.id;
        option.textContent = `${resume.title} (${resume.file_type.toUpperCase()}, ${resume.file_size_formatted})`;
        dropdown.appendChild(option);
    });
}

function populateJDDropdown() {
    const dropdown = document.getElementById('savedJDDropdown');
    if (!dropdown) return;

    // Clear existing options except the first one
    dropdown.innerHTML = '<option value="">Select a saved job description...</option>';

    // Add job description options
    availableJobDescriptions.forEach(jd => {
        const option = document.createElement('option');
        option.value = jd.id;
        option.textContent = `${jd.title}${jd.company_name ? ' - ' + jd.company_name : ''} (${jd.word_count} words)`;
        dropdown.appendChild(option);
    });
}

function handleResumeSelection(event) {
    const resumeId = event.target.value;
    const selectedResumeInfo = document.getElementById('selectedResumeInfo');

    if (!resumeId) {
        selectedResumeInfo.style.display = 'none';
        selectedResumeId = null;
        updateButtonStates();
        return;
    }

    const resume = availableResumes.find(r => r.id == resumeId);
    if (resume) {
        selectedResumeId = resume.id;

        // Update info display
        document.getElementById('selectedResumeTitle').textContent = resume.title;
        document.getElementById('selectedResumeMeta').textContent =
            `${resume.file_type.toUpperCase()} • ${resume.file_size_formatted} • ${formatDate(resume.created_at)}`;

        selectedResumeInfo.style.display = 'block';
        updateButtonStates();
    }
}

function handleJDSelection(event) {
    const jdId = event.target.value;
    const selectedJDInfo = document.getElementById('selectedJDInfo');

    if (!jdId) {
        selectedJDInfo.style.display = 'none';
        selectedJobDescriptionId = null;
        currentJobDescriptionText = '';
        updateButtonStates();
        return;
    }

    const jd = availableJobDescriptions.find(j => j.id == jdId);
    if (jd) {
        selectedJobDescriptionId = jd.id;
        currentJobDescriptionText = jd.job_text || '';

        // Update info display
        document.getElementById('selectedJDTitle').textContent = jd.title;
        document.getElementById('selectedJDMeta').textContent =
            `${jd.company_name || 'Unknown Company'} • ${jd.word_count} words • ${formatDate(jd.created_at)}`;

        // Show preview of job description text
        const preview = jd.job_text ? jd.job_text.substring(0, 200) + (jd.job_text.length > 200 ? '...' : '') : 'No text available';
        document.getElementById('selectedJDPreview').textContent = preview;

        selectedJDInfo.style.display = 'block';
        updateButtonStates();
    }
}

function switchResumeMode(mode) {
    currentResumeMode = mode;

    const uploadMode = document.getElementById('resumeUploadMode');
    const selectMode = document.getElementById('resumeSelectMode');
    const uploadTab = document.getElementById('uploadResumeTab');
    const selectTab = document.getElementById('selectResumeTab');

    if (mode === 'upload') {
        uploadMode.style.display = 'block';
        selectMode.style.display = 'none';
        uploadTab.style.background = '#3b82f6';
        selectTab.style.background = '#6b7280';

        // Clear selection from select mode
        selectedResumeId = null;
        document.getElementById('savedResumeDropdown').value = '';
        document.getElementById('selectedResumeInfo').style.display = 'none';
    } else {
        uploadMode.style.display = 'none';
        selectMode.style.display = 'block';
        uploadTab.style.background = '#6b7280';
        selectTab.style.background = '#3b82f6';

        // Clear any uploaded file
        selectedResumeId = null;
        document.getElementById('resumeFileInput').value = '';
    }

    updateButtonStates();
}

function switchJDMode(mode) {
    currentJDMode = mode;

    const enterMode = document.getElementById('jobDescriptionEnterMode');
    const selectMode = document.getElementById('jobDescriptionSelectMode');
    const enterTab = document.getElementById('enterJDTab');
    const selectTab = document.getElementById('selectJDTab');

    if (mode === 'enter') {
        enterMode.style.display = 'block';
        selectMode.style.display = 'none';
        enterTab.style.background = '#3b82f6';
        selectTab.style.background = '#6b7280';

        // Clear selection from select mode
        selectedJobDescriptionId = null;
        document.getElementById('savedJDDropdown').value = '';
        document.getElementById('selectedJDInfo').style.display = 'none';

        // Restore text area content
        currentJobDescriptionText = document.getElementById('jobDescriptionText').value.trim();
    } else {
        enterMode.style.display = 'none';
        selectMode.style.display = 'block';
        enterTab.style.background = '#6b7280';
        selectTab.style.background = '#3b82f6';

        // Clear text area
        selectedJobDescriptionId = null;
        currentJobDescriptionText = '';
        document.getElementById('jobDescriptionText').value = '';
    }

    updateButtonStates();
}

function toggleResumeSelection() {
    if (currentResumeMode === 'upload') {
        switchResumeMode('select');
    } else {
        switchResumeMode('upload');
    }
}

function toggleJobDescriptionSelection() {
    if (currentJDMode === 'enter') {
        switchJDMode('select');
    } else {
        switchJDMode('enter');
    }
}

function showSavedResumes() {
    // Switch to select mode when button is clicked
    switchResumeMode('select');
}

function showSavedJobDescriptions() {
    // Switch to select mode when button is clicked
    switchJDMode('select');
}

function groupSuggestionsByType(suggestions) {
    const grouped = {
        'technical_skills': [],
        'soft_skills': [],
        'industry_keywords': [],
        'ats_optimization': [],
        'structure': [],
        'quick_wins': [],
        'critical_gaps': [],
        'contextual_advice': [],
        'quantification': [],
        'skill_development': [],
        'other': []
    };

    suggestions.forEach(suggestion => {
        const type = suggestion.type || suggestion.category || 'other';
        const normalizedType = type.toLowerCase().replace(/\s+/g, '_');

        if (grouped[normalizedType]) {
            grouped[normalizedType].push(suggestion);
        } else {
            grouped['other'].push(suggestion);
        }
    });

    // Remove empty categories
    Object.keys(grouped).forEach(key => {
        if (grouped[key].length === 0) {
            delete grouped[key];
        }
    });

    return grouped;
}

function getCategoryDisplayName(category) {
    const displayNames = {
        'technical_skills': 'Technical Skills',
        'soft_skills': 'Soft Skills',
        'industry_keywords': 'Industry Keywords',
        'ats_optimization': 'ATS Optimization',
        'structure': 'Resume Structure',
        'quick_wins': 'Quick Wins',
        'critical_gaps': 'Critical Gaps',
        'contextual_advice': 'Contextual Advice',
        'quantification': 'Quantification',
        'skill_development': 'Skill Development',
        'other': 'General Suggestions'
    };

    return displayNames[category] || category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

function createSuggestionHTML(suggestion, isPremium) {
    const priority = suggestion.priority || 'medium';
    const priorityColors = {
        'critical': '#ef4444',
        'high': '#f59e0b',
        'medium': '#3b82f6',
        'low': '#10b981'
    };

    return `
        <div class="suggestion-item" style="
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            transition: all 0.2s ease;
        " onmouseover="this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)'" onmouseout="this.style.boxShadow='0 1px 3px rgba(0,0,0,0.1)'">
            <div style="display: flex; justify-content: between; align-items: flex-start; margin-bottom: 8px;">
                <div class="suggestion-title" style="
                    font-weight: 600;
                    color: #1f2937;
                    font-size: 14px;
                    flex: 1;
                    line-height: 1.4;
                ">${suggestion.title || suggestion.description}</div>
                <span class="suggestion-priority" style="
                    background: ${priorityColors[priority.toLowerCase()] || priorityColors.medium};
                    color: white;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 500;
                    text-transform: uppercase;
                    margin-left: 12px;
                    white-space: nowrap;
                ">${priority}</span>
            </div>

            ${suggestion.description && suggestion.title !== suggestion.description ? `
                <div class="suggestion-description" style="
                    color: #6b7280;
                    font-size: 13px;
                    line-height: 1.5;
                    margin-bottom: 8px;
                ">${suggestion.description}</div>
            ` : ''}

            ${suggestion.action ? `
                <div style="
                    margin-top: 12px;
                    padding: 12px;
                    background: ${isPremium ? '#fef3c7' : '#f3f4f6'};
                    border-radius: 6px;
                    border-left: 3px solid ${isPremium ? '#f59e0b' : '#475569'};
                ">
                    <div style="font-weight: 600; color: #374151; font-size: 12px; margin-bottom: 4px;">
                        💡 ${isPremium ? 'Premium Action' : 'Recommended Action'}
                    </div>
                    <div style="color: #4b5563; font-size: 13px; line-height: 1.4;">
                        ${suggestion.action}
                    </div>
                </div>
            ` : ''}

            ${suggestion.keywords && suggestion.keywords.length > 0 ? `
                <div style="margin-top: 12px;">
                    <div style="font-size: 12px; color: #6b7280; margin-bottom: 6px;">🔑 Related Keywords:</div>
                    <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                        ${suggestion.keywords.map(keyword => `
                            <span style="
                                background: #e0e7ff;
                                color: #3730a3;
                                padding: 2px 6px;
                                border-radius: 4px;
                                font-size: 11px;
                                font-weight: 500;
                            ">${keyword}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${suggestion.example ? `
                <div style="
                    margin-top: 12px;
                    padding: 10px;
                    background: #f8fafc;
                    border-radius: 6px;
                    border: 1px solid #e2e8f0;
                ">
                    <div style="font-weight: 600; color: #374151; font-size: 12px; margin-bottom: 4px;">
                        📝 Example
                    </div>
                    <div style="color: #4b5563; font-size: 13px; line-height: 1.4; font-style: italic;">
                        "${suggestion.example}"
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

async function checkAuthentication() {
    const token = localStorage.getItem('dr_resume_token');
    
    if (!token) {
        console.log('❌ No token found, redirecting to login');
        window.location.href = '/login';
        return;
    }
    
    try {
        // Verify token by calling protected endpoint
        const response = await fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Token verification failed');
        }
        
        const result = await response.json();
        
        if (!result.success) {
            throw new Error('Invalid token response');
        }
        
        console.log('✅ Token verified successfully');
        
        // Update user info in localStorage if needed
        localStorage.setItem('dr_resume_user', JSON.stringify(result.user));
        
    } catch (error) {
        console.error('Authentication error:', error);
        
        // Clear invalid tokens and redirect
        localStorage.removeItem('dr_resume_token');
        localStorage.removeItem('dr_resume_refresh_token');
        localStorage.removeItem('dr_resume_user');
        
        alert('Your session has expired. Please log in again.');
        window.location.href = '/login';
    }
}

function loadUserInfo() {
    try {
        const userStr = localStorage.getItem('dr_resume_user');
        
        if (userStr) {
            const user = JSON.parse(userStr);
            
            // Update welcome message
            const welcomeMessage = document.getElementById('welcomeMessage');
            const userName = document.getElementById('userName');
            
            if (welcomeMessage) {
                welcomeMessage.textContent = `Welcome, ${user.first_name}`;
            }
            
            if (userName) {
                userName.textContent = user.first_name;
            }
            
            // Update logout button
            const logoutBtn = document.querySelector('.logout-btn');
            if (logoutBtn) {
                logoutBtn.textContent = '🚪 Logout';
                logoutBtn.onclick = logout;
            }
            
            console.log('👤 User info loaded:', user.first_name, user.email);
        }
        
    } catch (error) {
        console.error('Error loading user info:', error);
    }
}

async function loadUserJobDescriptions() {
    try {
        const token = localStorage.getItem('dr_resume_token');
        
        const response = await fetch('/api/job_descriptions', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch job descriptions');
        }
        
        const result = await response.json();
        
        if (result.success) {
            displayJobDescriptions(result.job_descriptions);
            updateJDStats(result.count);

            // Update dropdown data
            availableJobDescriptions = result.job_descriptions;
            populateJDDropdown();
        } else {
            console.error('Error fetching job descriptions:', result.message);
        }
        
    } catch (error) {
        console.error('Error loading job descriptions:', error);
    }
}

function displayJobDescriptions(jobDescriptions) {
    const jdListSection = document.getElementById('jdListSection');
    const jdList = document.getElementById('jdList');
    const jdCardDescription = document.getElementById('jdCardDescription');
    
    if (jobDescriptions.length === 0) {
        jdListSection.style.display = 'none';
        jdCardDescription.textContent = 'No job descriptions yet. Add one to get started!';
        return;
    }
    
    // Update card description
    jdCardDescription.textContent = `${jobDescriptions.length} job description${jobDescriptions.length > 1 ? 's' : ''} saved. Add more or manage existing ones.`;
    
    // Show job description list
    jdListSection.style.display = 'block';
    
    // Generate job description list HTML
    const jdHTML = jobDescriptions.map(jd => `
        <div class="jd-item">
            <div class="jd-header">
                <div>
                    <div class="jd-title">${jd.title}</div>
                    ${jd.company_name ? `<div class="jd-company">${jd.company_name}</div>` : ''}
                    <div class="jd-meta">
                        <span>${jd.word_count.toLocaleString()} words</span>
                        <span>${jd.character_count.toLocaleString()} characters</span>
                        <span>${formatDate(jd.created_at)}</span>
                    </div>
                </div>
                <div class="jd-actions">
                    <button class="btn-small btn-view" onclick="viewJobDescription(${jd.id})">
                        👁️ View
                    </button>
                    <button class="btn-small btn-edit" onclick="editJobDescription(${jd.id})">
                        ✏️ Edit
                    </button>
                    <button class="btn-small btn-delete" onclick="deleteJobDescription(${jd.id}, '${jd.title}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
    
    jdList.innerHTML = jdHTML;
}

function updateJDStats(count) {
    const jdCount = document.getElementById('jdCount');
    if (jdCount) {
        jdCount.textContent = count;
    }
}

async function viewJobDescription(jdId) {
    try {
        const token = localStorage.getItem('dr_resume_token');
        
        const response = await fetch(`/api/job_descriptions/${jdId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch job description details');
        }
        
        const result = await response.json();
        
        if (result.success) {
            showJobDescriptionModal(result.job_description);
        } else {
            alert('Error loading job description details: ' + result.message);
        }
        
    } catch (error) {
        console.error('Error viewing job description:', error);
        alert('Error loading job description details. Please try again.');
    }
}

async function deleteJobDescription(jdId, jdTitle) {
    if (!confirm(`Are you sure you want to delete "${jdTitle}"? This action cannot be undone.`)) {
        return;
    }
    
    try {
        const token = localStorage.getItem('dr_resume_token');
        
        const response = await fetch(`/api/job_descriptions/${jdId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete job description');
        }
        
        const result = await response.json();
        
        if (result.success) {
            alert('Job description deleted successfully');
            // Reload job descriptions
            loadUserJobDescriptions();
        } else {
            alert('Error deleting job description: ' + result.message);
        }
        
    } catch (error) {
        console.error('Error deleting job description:', error);
        alert('Error deleting job description. Please try again.');
    }
}

function editJobDescription(jdId) {
    // For now, redirect to add page with edit functionality
    // In a full implementation, you'd pass the ID and load existing data
    alert('Edit functionality will be enhanced in future versions. For now, you can create a new job description.');
}

function showJobDescriptionModal(jd) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 30px;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        margin: 20px;
    `;
    
    content.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #1f2937;">${jd.title}</h3>
        ${jd.company_name ? `<div style="margin-bottom: 20px; color: #475569; font-weight: 500;">${jd.company_name}</div>` : ''}
        <div style="margin-bottom: 20px; color: #6b7280;">
            <strong>Words:</strong> ${jd.word_count.toLocaleString()}<br>
            <strong>Characters:</strong> ${jd.character_count.toLocaleString()}<br>
            <strong>Created:</strong> ${formatDate(jd.created_at)}
        </div>
        <div style="margin-bottom: 20px;">
            <strong>Job Description:</strong>
            <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; max-height: 400px; overflow-y: auto; white-space: pre-wrap; font-family: inherit; font-size: 14px; line-height: 1.5; margin-top: 10px;">
${jd.job_text}
            </div>
        </div>
        <button onclick="this.closest('div').parentElement.remove()" style="background: #475569; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
            Close
        </button>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

async function logout() {
    try {
        const token = localStorage.getItem('dr_resume_token');
        
        if (token) {
            await fetch('/api/logout', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
        }
        
    } catch (error) {
        console.error('Logout API error:', error);
    } finally {
        // Clear all stored data
        localStorage.removeItem('dr_resume_token');
        localStorage.removeItem('dr_resume_refresh_token');
        localStorage.removeItem('dr_resume_user');
        
        console.log('🚪 Logged out successfully');
        
        // Redirect to landing page
        window.location.href = '/';
    }
}

// Navigation functions removed - all functionality integrated into dashboard

async function loadUserResumes() {
    try {
        const token = localStorage.getItem('dr_resume_token');

        const response = await fetch('/api/resumes', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch resumes');
        }

        const result = await response.json();

        if (result.success) {
            displayResumes(result.resumes);
            updateResumeStats(result.count);

            // Update dropdown data
            availableResumes = result.resumes;
            populateResumeDropdown();
        } else {
            console.error('Error fetching resumes:', result.message);
        }

    } catch (error) {
        console.error('Error loading resumes:', error);
    }
}

function displayResumes(resumes) {
    const resumeListSection = document.getElementById('resumeListSection');
    const resumeList = document.getElementById('resumeList');
    const resumeCardDescription = document.getElementById('resumeCardDescription');

    if (resumes.length === 0) {
        resumeListSection.style.display = 'none';
        resumeCardDescription.textContent = 'No resumes uploaded yet. Upload one to get started!';
        return;
    }

    // Update card description
    resumeCardDescription.textContent = `${resumes.length} resume${resumes.length > 1 ? 's' : ''} uploaded. Upload more or manage existing ones.`;

    // Show resume list
    resumeListSection.style.display = 'block';

    // Generate resume list HTML
    const resumeHTML = resumes.map(resume => `
        <div class="jd-item">
            <div class="jd-header">
                <div>
                    <div class="jd-title">${resume.title}</div>
                    <div class="jd-meta">
                        <span>${resume.file_size_formatted}</span>
                        <span>${resume.file_type.toUpperCase()}</span>
                        <span style="color: ${getStatusColor(resume.upload_status)}">${getStatusText(resume.upload_status)}</span>
                        <span>${formatDate(resume.created_at)}</span>
                    </div>
                </div>
                <div class="jd-actions">
                    <button class="btn-small btn-view" onclick="viewResume(${resume.id})">
                        👁️ View
                    </button>
                    <button class="btn-small btn-delete" onclick="deleteResume(${resume.id}, '${resume.title}')">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    resumeList.innerHTML = resumeHTML;
}

function updateResumeStats(count) {
    const resumeCount = document.getElementById('resumeCount');
    if (resumeCount) {
        resumeCount.textContent = count;
    }
}

async function viewResume(resumeId) {
    try {
        const token = localStorage.getItem('dr_resume_token');

        const response = await fetch(`/api/resumes/${resumeId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch resume details');
        }

        const result = await response.json();

        if (result.success) {
            showResumeModal(result.resume);
        } else {
            alert('Error loading resume details: ' + result.message);
        }

    } catch (error) {
        console.error('Error viewing resume:', error);
        alert('Error loading resume details. Please try again.');
    }
}

async function deleteResume(resumeId, resumeTitle) {
    if (!confirm(`Are you sure you want to delete "${resumeTitle}"? This action cannot be undone.`)) {
        return;
    }

    try {
        const token = localStorage.getItem('dr_resume_token');

        const response = await fetch(`/api/resumes/${resumeId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to delete resume');
        }

        const result = await response.json();

        if (result.success) {
            alert('Resume deleted successfully');
            // Reload resumes
            loadUserResumes();
        } else {
            alert('Error deleting resume: ' + result.message);
        }

    } catch (error) {
        console.error('Error deleting resume:', error);
        alert('Error deleting resume. Please try again.');
    }
}

function showResumeModal(resume) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 30px;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        margin: 20px;
    `;

    content.innerHTML = `
        <h3 style="margin-bottom: 20px; color: #1f2937;">${resume.title}</h3>
        <div style="margin-bottom: 20px; color: #6b7280;">
            <strong>File:</strong> ${resume.original_filename}<br>
            <strong>Size:</strong> ${resume.file_size_formatted}<br>
            <strong>Type:</strong> ${resume.file_type.toUpperCase()}<br>
            <strong>Status:</strong> <span style="color: ${getStatusColor(resume.upload_status)}">${getStatusText(resume.upload_status)}</span><br>
            <strong>Uploaded:</strong> ${formatDate(resume.created_at)}
        </div>
        ${resume.extracted_text ? `
            <div style="margin-bottom: 20px;">
                <strong>Extracted Text:</strong>
                <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; max-height: 300px; overflow-y: auto; white-space: pre-wrap; font-family: monospace; font-size: 14px;">
${resume.extracted_text}
                </div>
            </div>
        ` : ''}
        <button onclick="this.closest('div').parentElement.remove()" style="background: #475569; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer;">
            Close
        </button>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

function getStatusColor(status) {
    switch (status) {
        case 'completed': return '#10b981';
        case 'processing': return '#f59e0b';
        case 'failed': return '#ef4444';
        default: return '#6b7280';
    }
}

function getStatusText(status) {
    switch (status) {
        case 'completed': return 'Processed';
        case 'processing': return 'Processing';
        case 'failed': return 'Failed';
        default: return 'Unknown';
    }
}

// US-10: Scan History Functions
async function loadScanHistory(page = 1, filter = '') {
    const token = localStorage.getItem('dr_resume_token');

    if (!token) {
        console.log('❌ No token found');
        return;
    }

    try {
        showHistoryLoading();

        const params = new URLSearchParams({
            page: page,
            per_page: 5,
            sort_by: 'created_at',
            sort_order: 'desc'
        });

        if (filter) {
            params.append('filter_score', filter);
        }

        const response = await fetch(`/api/history?${params}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            displayScanHistory(result.scan_history, result.pagination);
            currentPage = result.pagination.page;
            currentFilter = filter;
        } else {
            throw new Error(result.message || 'Failed to load scan history');
        }

    } catch (error) {
        console.error('❌ Error loading scan history:', error);
        showHistoryError('Failed to load scan history. Please try again.');
    }
}

async function loadDashboardStats() {
    const token = localStorage.getItem('dr_resume_token');

    if (!token) {
        return;
    }

    try {
        const response = await fetch('/api/dashboard_stats', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
            updateDashboardStats(result.stats);
        }

    } catch (error) {
        console.error('❌ Error loading dashboard stats:', error);
    }
}

function displayScanHistory(scanHistory, pagination) {
    const container = document.getElementById('scanHistoryContainer');
    const listElement = document.getElementById('scanHistoryList');
    const emptyElement = document.getElementById('scanHistoryEmpty');
    const loadingElement = document.getElementById('scanHistoryLoading');

    // Hide loading
    loadingElement.style.display = 'none';

    if (!scanHistory || scanHistory.length === 0) {
        emptyElement.style.display = 'block';
        listElement.style.display = 'none';
        hidePagination();
        return;
    }

    emptyElement.style.display = 'none';
    listElement.style.display = 'block';

    // Create scan history cards
    listElement.innerHTML = scanHistory.map(scan => `
        <div class="scan-history-card" style="background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 15px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="display: flex; justify-content: between; align-items: flex-start; margin-bottom: 15px;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 5px 0; color: #1f2937; font-size: 16px;">
                        📄 ${scan.resume.title || 'Untitled Resume'}
                    </h4>
                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 14px;">
                        📋 ${scan.job_description.title} at ${scan.job_description.company_name}
                    </p>
                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                        📅 ${formatDate(scan.created_at)}
                    </p>
                </div>
                <div style="text-align: right;">
                    <div class="score-badge ${getScoreClass(scan.score_category)}" style="display: inline-block; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 14px; margin-bottom: 8px;">
                        ${scan.match_score}%
                    </div>
                    <div style="font-size: 12px; color: #6b7280;">
                        ${scan.matched_keywords}/${scan.total_jd_keywords} keywords
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px;">
                <div style="text-align: center; padding: 8px; background: #f9fafb; border-radius: 6px;">
                    <div style="font-weight: bold; color: #475569;">${scan.technical_score}%</div>
                    <div style="font-size: 12px; color: #6b7280;">Technical</div>
                </div>
                <div style="text-align: center; padding: 8px; background: #f9fafb; border-radius: 6px;">
                    <div style="font-weight: bold; color: #475569;">${scan.soft_skills_score}%</div>
                    <div style="font-size: 12px; color: #6b7280;">Soft Skills</div>
                </div>
                <div style="text-align: center; padding: 8px; background: #f9fafb; border-radius: 6px;">
                    <div style="font-weight: bold; color: #475569;">${scan.other_keywords_score}%</div>
                    <div style="font-size: 12px; color: #6b7280;">Other</div>
                </div>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end;">
                <div style="padding: 6px 12px; background: #e5e7eb; color: #6b7280; border-radius: 4px; font-size: 12px;">
                    📊 Scan Complete
                </div>
            </div>
        </div>
    `).join('');

    // Update pagination
    updatePagination(pagination);
}

function updateDashboardStats(stats) {
    // Update the stats display in the dashboard
    const resumeCountElement = document.getElementById('resumeCount');
    const jdCountElement = document.getElementById('jdCount');
    const scanCountElement = document.getElementById('scanCount');

    if (resumeCountElement) {
        resumeCountElement.textContent = stats.total_resumes;
    }

    if (jdCountElement) {
        jdCountElement.textContent = stats.total_job_descriptions;
    }

    if (scanCountElement) {
        scanCountElement.textContent = stats.total_scans || 0;
    }

    // Update other stats if elements exist
    const elements = document.querySelectorAll('[data-stat]');
    elements.forEach(element => {
        const statName = element.getAttribute('data-stat');
        if (stats[statName] !== undefined) {
            element.textContent = stats[statName];
        }
    });
}

function getScoreClass(category) {
    switch (category) {
        case 'excellent': return 'score-excellent';
        case 'good': return 'score-good';
        case 'fair': return 'score-fair';
        case 'poor': return 'score-poor';
        default: return 'score-fair';
    }
}

function showHistoryLoading() {
    document.getElementById('scanHistoryLoading').style.display = 'block';
    document.getElementById('scanHistoryEmpty').style.display = 'none';
    document.getElementById('scanHistoryList').style.display = 'none';
}

function showHistoryError(message) {
    const container = document.getElementById('scanHistoryContainer');
    container.innerHTML = `
        <div style="text-align: center; padding: 40px; color: #ef4444;">
            <div style="font-size: 48px; margin-bottom: 20px;">❌</div>
            <h4 style="margin: 0 0 10px 0;">Error Loading History</h4>
            <p style="margin: 0;">${message}</p>
            <button onclick="loadScanHistory()" style="margin-top: 15px; padding: 8px 16px; background: #475569; color: white; border: none; border-radius: 6px; cursor: pointer;">
                🔄 Try Again
            </button>
        </div>
    `;
}

function updatePagination(pagination) {
    const paginationElement = document.getElementById('historyPagination');
    const prevBtn = document.getElementById('prevPageBtn');
    const nextBtn = document.getElementById('nextPageBtn');
    const pageInfo = document.getElementById('pageInfo');

    if (pagination.total_pages <= 1) {
        paginationElement.style.display = 'none';
        return;
    }

    paginationElement.style.display = 'block';
    prevBtn.disabled = !pagination.has_prev;
    nextBtn.disabled = !pagination.has_next;
    pageInfo.textContent = `Page ${pagination.page} of ${pagination.total_pages}`;

    // Update button styles
    prevBtn.style.opacity = pagination.has_prev ? '1' : '0.5';
    nextBtn.style.opacity = pagination.has_next ? '1' : '0.5';
    prevBtn.style.cursor = pagination.has_prev ? 'pointer' : 'not-allowed';
    nextBtn.style.cursor = pagination.has_next ? 'pointer' : 'not-allowed';
}

function hidePagination() {
    document.getElementById('historyPagination').style.display = 'none';
}

// Event handlers for scan history
function filterHistory() {
    const filter = document.getElementById('scoreFilter').value;
    currentPage = 1; // Reset to first page when filtering
    loadScanHistory(currentPage, filter);
}

function refreshHistory() {
    loadScanHistory(currentPage, currentFilter);
}

function changePage(direction) {
    const newPage = currentPage + direction;
    if (newPage >= 1) {
        loadScanHistory(newPage, currentFilter);
    }
}

// History navigation functions removed - all functionality integrated into dashboard

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}
