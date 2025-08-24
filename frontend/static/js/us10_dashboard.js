// Resume Doctor.Ai - Clean Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    console.log('🤖 Resume Doctor.Ai Dashboard Loaded');
    
    // Check authentication
    const token = localStorage.getItem('dr_resume_token');
    if (!token) {
        console.log('❌ No token found, redirecting to login');
        window.location.href = 'us10_login.html';
        return;
    }
    
    // Initialize dashboard
    initializeDashboard();
    
    // Add event listeners
    addEventListeners();
});

function initializeDashboard() {
    console.log('✅ Dashboard initialized');
    
    // Load user data
    const userData = JSON.parse(localStorage.getItem('dr_resume_user') || '{}');
    updateUserGreeting(userData);
    
    // Load dashboard stats (mock data for now)
    loadDashboardStats();
    
    // Load recent scan history
    loadRecentScanHistory();
}

function addEventListeners() {
    // Navigation items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            console.log('Navigation clicked:', this.textContent);
        });
    });
    
    // Stat cards hover effects
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(-2px)';
        });
    });
}

function updateUserGreeting(userData) {
    const greetingElement = document.querySelector('.user-greeting');
    if (greetingElement && userData.name) {
        greetingElement.textContent = `Hi, ${userData.name}!`;
    }
}

function loadDashboardStats() {
    // Mock data - in real app, this would come from API
    const stats = {
        resumes: 3,
        jobDescriptions: 2,
        scans: 1
    };
    
    // Update stat cards with animation
    updateStatCard(0, stats.resumes);
    updateStatCard(1, stats.jobDescriptions);
    updateStatCard(2, stats.scans);
}

function updateStatCard(index, value) {
    const statCards = document.querySelectorAll('.stat-card');
    if (statCards[index]) {
        const numberElement = statCards[index].querySelector('.stat-number');
        if (numberElement) {
            // Animate number counting up
            animateNumber(numberElement, 0, value, 1000);
        }
    }
}

function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(start + (end - start) * easeOutQuart);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

function loadRecentScanHistory() {
    // Mock data - in real app, this would come from API
    const scanData = {
        fileName: "Md_Moin_Ashrai_2_1 docx",
        jobDescription: "Job Description from Dashboard at 1 Unknown Company",
        scanDate: "2016 21 2 297:R6 pm",
        matchPercentage: 28.48,
        keywordCount: 9.55,
        keywordBreakdown: [
            { keyword: "Tustrared", percentage: 10.34 },
            { keyword: "Exhilones", percentage: 100 },
            { keyword: "Office", percentage: 4.35 }
        ]
    };
    
    // Update the scan card with real data
    updateScanCard(scanData);
}

function updateScanCard(scanData) {
    // Update file name
    const fileNameElement = document.querySelector('.file-name');
    if (fileNameElement) {
        fileNameElement.textContent = scanData.fileName;
    }
    
    // Update job description
    const jobDescElement = document.querySelector('.job-description');
    if (jobDescElement) {
        jobDescElement.textContent = scanData.jobDescription;
    }
    
    // Update scan date
    const scanDateElement = document.querySelector('.scan-date');
    if (scanDateElement) {
        scanDateElement.textContent = scanData.scanDate;
    }
    
    // Update match percentage
    const matchPercentageElement = document.querySelector('.match-percentage');
    if (matchPercentageElement) {
        matchPercentageElement.textContent = `${scanData.matchPercentage} %`;
    }
    
    // Update keyword count
    const keywordCountElement = document.querySelector('.keyword-count');
    if (keywordCountElement) {
        keywordCountElement.textContent = `${scanData.keywordCount} keywords`;
    }
    
    // Update keyword breakdown
    updateKeywordBreakdown(scanData.keywordBreakdown);
}

function updateKeywordBreakdown(keywords) {
    const keywordItems = document.querySelectorAll('.keyword-item');
    
    keywords.forEach((keyword, index) => {
        if (keywordItems[index]) {
            const percentageElement = keywordItems[index].querySelector('.keyword-percentage');
            const labelElement = keywordItems[index].querySelector('.keyword-label');
            
            if (percentageElement) {
                percentageElement.textContent = `${keyword.percentage} %`;
            }
            
            if (labelElement) {
                labelElement.textContent = keyword.keyword;
            }
        }
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '12px 20px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        info: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Export functions for global access
window.DashboardApp = {
    showNotification,
    updateUserGreeting,
    loadDashboardStats,
    loadRecentScanHistory
};