# 🔌 API Documentation

## Overview

Resume Doctor.Ai provides a comprehensive REST API for resume analysis, job description processing, and AI-powered suggestion generation. All endpoints use JSON for data exchange and JWT for authentication.

## 🔐 Authentication

### Base URL
```
Development: http://localhost:5000/api
Production: https://api.resumedoctor.ai/api
```

### Authentication Header
```http
Authorization: Bearer <jwt_token>
```

### Token Management
```javascript
// Login to get token
POST /api/login
{
    "email": "user@example.com",
    "password": "password123"
}

// Response
{
    "success": true,
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
    "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "user@example.com",
        "role": "basic"
    }
}
```

## 📋 API Endpoints

### 1. Authentication Endpoints

#### POST /api/login
**Purpose**: Authenticate user and receive JWT token

**Request**:
```http
POST /api/login
Content-Type: application/json

{
    "email": "user@example.com",
    "password": "password123"
}
```

**Response**:
```json
{
    "success": true,
    "access_token": "jwt_token_here",
    "user": {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "user@example.com",
        "role": "basic"
    }
}
```

**Error Responses**:
```json
// Invalid credentials
{
    "success": false,
    "message": "Invalid email or password"
}

// Account inactive
{
    "success": false,
    "message": "Account is inactive"
}
```

#### POST /api/register
**Purpose**: Create new user account

**Request**:
```http
POST /api/register
Content-Type: application/json

{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "password123"
}
```

**Response**:
```json
{
    "success": true,
    "message": "Account created successfully",
    "user_id": 123
}
```

### 2. Resume Management Endpoints

#### POST /api/upload_resume
**Purpose**: Upload and process resume file

**Request**:
```http
POST /api/upload_resume
Content-Type: multipart/form-data
Authorization: Bearer <jwt_token>

file: <resume.pdf>
```

**Response**:
```json
{
    "success": true,
    "message": "Resume uploaded and processed successfully",
    "resume_id": 123,
    "original_filename": "john_doe_resume.pdf",
    "file_size": 245760,
    "keywords_extracted": true,
    "keyword_count": 45,
    "technical_skills": ["Python", "React", "SQL", "Docker"],
    "soft_skills": ["Leadership", "Communication", "Problem Solving"],
    "other_keywords": ["Agile", "Scrum", "CI/CD"]
}
```

**Error Responses**:
```json
// File too large
{
    "success": false,
    "message": "File size exceeds 10MB limit"
}

// Invalid file type
{
    "success": false,
    "message": "Only PDF, DOC, and DOCX files are allowed"
}

// Processing error
{
    "success": false,
    "message": "Failed to extract text from file"
}
```

#### GET /api/resumes
**Purpose**: Get user's uploaded resumes

**Request**:
```http
GET /api/resumes
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
    "success": true,
    "resumes": [
        {
            "id": 123,
            "original_filename": "resume_v1.pdf",
            "keyword_count": 45,
            "keywords_extracted": true,
            "upload_status": "completed",
            "created_at": "2024-01-15T10:30:00Z"
        },
        {
            "id": 124,
            "original_filename": "resume_v2.pdf",
            "keyword_count": 52,
            "keywords_extracted": true,
            "upload_status": "completed",
            "created_at": "2024-01-16T14:20:00Z"
        }
    ],
    "total_count": 2
}
```

#### GET /api/resumes/{id}
**Purpose**: Get specific resume details

**Request**:
```http
GET /api/resumes/123
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
    "success": true,
    "resume": {
        "id": 123,
        "original_filename": "resume.pdf",
        "file_size": 245760,
        "extracted_text": "Full resume text content...",
        "technical_skills": ["Python", "React", "SQL"],
        "soft_skills": ["Leadership", "Communication"],
        "other_keywords": ["Agile", "Scrum"],
        "keyword_count": 45,
        "created_at": "2024-01-15T10:30:00Z"
    }
}
```

### 3. Job Description Endpoints

#### POST /api/upload_jd
**Purpose**: Save and process job description

**Request**:
```http
POST /api/upload_jd
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
    "title": "Senior Software Engineer",
    "company_name": "Tech Corp",
    "job_text": "We are looking for a Senior Software Engineer with experience in Python, React, and cloud technologies..."
}
```

**Response**:
```json
{
    "success": true,
    "message": "Job description saved and processed successfully",
    "jd_id": 456,
    "keywords_extracted": true,
    "keyword_count": 38,
    "technical_skills": ["Python", "React", "AWS", "Docker"],
    "soft_skills": ["Leadership", "Collaboration"],
    "other_keywords": ["Agile", "Microservices"]
}
```

#### GET /api/job_descriptions
**Purpose**: Get user's job descriptions

**Request**:
```http
GET /api/job_descriptions
Authorization: Bearer <jwt_token>
```

**Response**:
```json
{
    "success": true,
    "job_descriptions": [
        {
            "id": 456,
            "title": "Senior Software Engineer",
            "company_name": "Tech Corp",
            "keyword_count": 38,
            "keywords_extracted": true,
            "created_at": "2024-01-15T11:00:00Z"
        }
    ],
    "total_count": 1
}
```

### 4. Matching & Analysis Endpoints

#### POST /api/calculate_match
**Purpose**: Calculate compatibility score between resume and job description

**Request**:
```http
POST /api/calculate_match
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
    "resume_id": 123,
    "job_description_id": 456
}
```

**Response**:
```json
{
    "success": true,
    "match_score_id": 789,
    "overall_score": 78.5,
    "detailed_scores": {
        "technical_score": 85.2,
        "soft_skills_score": 72.1,
        "other_keywords_score": 68.9
    },
    "analysis": {
        "total_resume_keywords": 45,
        "total_jd_keywords": 38,
        "matched_keywords": 28,
        "missing_keywords": {
            "technical": ["AWS", "Kubernetes"],
            "soft_skills": ["Project Management"],
            "other": ["DevOps"]
        },
        "extra_keywords": {
            "technical": ["Vue.js", "MongoDB"],
            "soft_skills": ["Mentoring"],
            "other": ["Scrum Master"]
        }
    },
    "algorithm_used": "jaccard",
    "calculated_at": "2024-01-15T12:00:00Z"
}
```

### 5. AI Suggestions Endpoints

#### POST /api/basic_suggestions
**Purpose**: Generate basic improvement suggestions

**Request**:
```http
POST /api/basic_suggestions
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
    "resume_id": 123,
    "job_description_id": 456
}
```

**Response**:
```json
{
    "success": true,
    "suggestions": [
        {
            "type": "technical",
            "priority": "high",
            "title": "Add AWS Experience",
            "description": "The job description emphasizes cloud technologies, particularly AWS. Adding AWS experience would significantly improve your match score.",
            "keywords": ["AWS", "Cloud", "EC2", "S3"],
            "action": "Add AWS to your Skills section and describe a project where you used AWS services.",
            "placement": ["Skills", "Projects"]
        },
        {
            "type": "soft_skills",
            "priority": "medium",
            "title": "Highlight Project Management",
            "description": "The role requires project management skills which are not clearly demonstrated in your resume.",
            "keywords": ["Project Management", "Team Leadership"],
            "action": "Add examples of projects you've managed or led in your Experience section."
        }
    ],
    "total_suggestions": 8,
    "matching_score": {
        "overall_score": 78.5,
        "technical_score": 85.2,
        "soft_skills_score": 72.1
    },
    "generated_at": "2024-01-15T12:05:00Z"
}
```

#### POST /api/premium_suggestions
**Purpose**: Generate advanced premium suggestions

**Request**:
```http
POST /api/premium_suggestions
Content-Type: application/json
Authorization: Bearer <jwt_token>

{
    "resume_id": 123,
    "job_description_id": 456
}
```

**Response**:
```json
{
    "success": true,
    "suggestions": [
        {
            "type": "critical_gaps",
            "priority": "critical",
            "title": "URGENT: Add Kubernetes Experience",
            "description": "This is a critical skill gap. The job description heavily emphasizes container orchestration with Kubernetes.",
            "keywords": ["Kubernetes", "Container Orchestration", "K8s"],
            "action": "Add Kubernetes experience immediately. Consider building a sample project or taking a course to demonstrate proficiency.",
            "placement": ["Skills", "Projects", "Experience"],
            "example": "Build a portfolio project showcasing Kubernetes deployment and best practices."
        },
        {
            "type": "contextual_advice",
            "priority": "high",
            "title": "Optimize for ATS Systems",
            "description": "Based on the job posting format, this company likely uses ATS. Your resume should be optimized for keyword scanning.",
            "action": "Use exact keyword matches from the job description and avoid complex formatting.",
            "tips": [
                "Use standard section headers (Experience, Skills, Education)",
                "Include keywords in context, not just lists",
                "Use standard fonts and avoid graphics"
            ]
        },
        {
            "type": "quantification",
            "priority": "medium",
            "title": "Add Quantifiable Achievements",
            "description": "Your experience lacks specific metrics and quantifiable results.",
            "action": "Add numbers, percentages, and measurable outcomes to your achievements.",
            "examples": [
                "Improved system performance by 40%",
                "Led a team of 5 developers",
                "Reduced deployment time from 2 hours to 15 minutes"
            ]
        }
    ],
    "total_suggestions": 15,
    "additional_premium_categories": {
        "critical_gaps": 3,
        "contextual_advice": 4,
        "quantification": 5,
        "skill_development": 3
    },
    "generated_at": "2024-01-15T12:10:00Z"
}
```

## 🔧 Error Handling

### Standard Error Response Format
```json
{
    "success": false,
    "message": "Error description",
    "error_code": "ERROR_CODE",
    "details": {
        "field": "specific error details"
    }
}
```

### Common Error Codes
- `INVALID_TOKEN`: JWT token is invalid or expired
- `MISSING_REQUIRED_FIELD`: Required field is missing from request
- `FILE_TOO_LARGE`: Uploaded file exceeds size limit
- `INVALID_FILE_TYPE`: File type not supported
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `INSUFFICIENT_PERMISSIONS`: User lacks required permissions
- `RATE_LIMIT_EXCEEDED`: Too many requests in time window

### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `413`: Payload Too Large
- `429`: Too Many Requests
- `500`: Internal Server Error

## 📊 Rate Limiting

### Limits by Endpoint
```
Authentication: 5 requests/minute
File Upload: 10 requests/hour
Suggestions: 50 requests/hour
Other endpoints: 100 requests/hour
```

### Rate Limit Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

## 🔍 Request/Response Examples

### Complete Workflow Example
```javascript
// 1. Login
const loginResponse = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        email: 'user@example.com',
        password: 'password123'
    })
});
const { access_token } = await loginResponse.json();

// 2. Upload Resume
const formData = new FormData();
formData.append('file', resumeFile);

const uploadResponse = await fetch('/api/upload_resume', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${access_token}` },
    body: formData
});
const { resume_id } = await uploadResponse.json();

// 3. Save Job Description
const jdResponse = await fetch('/api/upload_jd', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
    },
    body: JSON.stringify({
        title: 'Software Engineer',
        company_name: 'Tech Corp',
        job_text: 'Job description content...'
    })
});
const { jd_id } = await jdResponse.json();

// 4. Calculate Match Score
const matchResponse = await fetch('/api/calculate_match', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
    },
    body: JSON.stringify({
        resume_id: resume_id,
        job_description_id: jd_id
    })
});
const matchData = await matchResponse.json();

// 5. Generate Suggestions
const suggestionsResponse = await fetch('/api/premium_suggestions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${access_token}`
    },
    body: JSON.stringify({
        resume_id: resume_id,
        job_description_id: jd_id
    })
});
const suggestions = await suggestionsResponse.json();
```

## 🧪 Testing

### API Testing with curl
```bash
# Login
curl -X POST http://localhost:5000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@resumedoctor.ai","password":"password123"}'

# Upload Resume
curl -X POST http://localhost:5000/api/upload_resume \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@resume.pdf"

# Generate Suggestions
curl -X POST http://localhost:5000/api/basic_suggestions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"resume_id":123,"job_description_id":456}'
```

### Postman Collection
```json
{
    "info": {
        "name": "Resume Doctor.Ai API",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "auth": {
        "type": "bearer",
        "bearer": [{"key": "token", "value": "{{jwt_token}}"}]
    },
    "variable": [
        {"key": "base_url", "value": "http://localhost:5000/api"}
    ]
}
```

## 📈 Performance Considerations

### Response Times
- Authentication: < 200ms
- File Upload: < 2s (typical resume)
- Keyword Extraction: < 1s
- Match Calculation: < 500ms
- Basic Suggestions: < 2s
- Premium Suggestions: < 3s

### Optimization Tips
- Use pagination for large result sets
- Implement caching for frequently accessed data
- Compress large responses
- Use connection pooling
- Monitor API performance metrics

---

This API provides a comprehensive interface for all Resume Doctor.Ai functionality with robust error handling, security measures, and performance optimizations.
