#!/usr/bin/env python3
"""
Advanced Keyword Extraction Engine for Dr. Resume US-10
Implements the exact algorithm specified with regex patterns, normalization, and multi-word support
"""

import re
from typing import Dict, List, Set, Tuple

class AdvancedKeywordExtractor:
    """Advanced keyword extraction with comprehensive pattern matching"""

    def __init__(self):
        """Initialize the advanced keyword extractor"""

        # Simple keyword normalization mapping
        self.keyword_variations = {
            'c#': ['c#', 'csharp', 'c sharp'],
            'asp.net': ['asp.net', 'aspnet', 'asp net'],
            'javascript': ['javascript', 'js'],
            'typescript': ['typescript', 'ts'],
            'sql server': ['sql server', 'sqlserver', 'mssql'],
            'entity framework': ['entity framework', 'ef', 'ef core'],
        }

        # Priority levels for keywords
        self.priority_keywords = {
            'critical': ['c#', 'asp.net', 'sql server', 'javascript', 'python', 'java'],
            'high': ['typescript', 'angular', 'react', 'node.js', 'mongodb'],
            'medium': ['html', 'css', 'git', 'docker', 'kubernetes']
        }

    def get_all_variations(self, keyword: str) -> List[str]:
        """Get all variations of a keyword"""
        keyword_lower = keyword.lower()
        if keyword_lower in self.keyword_variations:
            return self.keyword_variations[keyword_lower]
        return [keyword_lower]

    def normalize_keyword(self, keyword: str) -> str:
        """Normalize a keyword to its canonical form"""
        keyword_lower = keyword.lower().strip()

        # Find the canonical form
        for canonical, variations in self.keyword_variations.items():
            if keyword_lower in [v.lower() for v in variations]:
                return canonical

        return keyword_lower

    def get_priority_level(self, keyword: str, context_text: str = "") -> str:
        """Get priority level of a keyword"""
        keyword_lower = keyword.lower()

        for priority, keywords in self.priority_keywords.items():
            if keyword_lower in [k.lower() for k in keywords]:
                return priority

        return "medium"  # Default priority
        
        # Comprehensive technical keywords list
        self.TECH_KEYWORDS = [
            "asp.net core", "c#", "entity framework", "sql server", "angular", "typescript",
            "tailwind", "rest", "jwt", "guards", "rbac", "rxjs", "ngrx",
            "swagger", "postman", "redis", "docker", "azure", "ci/cd", "github actions",
            "signalr", "web api", "mvc", "blazor", "razor", "linq", "dependency injection",
            "unit testing", "integration testing", "xunit", "nunit", "moq", "iis",
            "microservices", "authentication", "authorization", "pipes", "observables",
            "httpclient", "bootstrap", "sass", "less", "webpack", "npm", "yarn",
            "git", "visual studio", "vs code", "javascript", "html", "css",
            # Additional keywords for better resume matching
            "python", "java", "springboot", "django", "fastapi", "sql", "aws", "mongodb",
            "kafka", "github", "mysql", "hibernate", "jquery", "opencv", "tensorflow",
            "sqlalchemy", "orm", "pymupdf", "palm2", "llm", "google", "postgresql",
            "spring mvc", "data jpa", "crud", "tomcat", "jasper", "jstl", "ec2", "s3", "rds",
            "serializer", "compose", "jdbc", "scrum", "stored procedures", "cloud",
            "certification", "full stack", "microsoft", "api", "restful", "machine learning",
            "ai", "classification", "realtime", "event driven", "obstacle detection"
        ]
        
        # Soft skills list - Enhanced for better resume detection
        self.SOFT_SKILLS = [
            "communication", "collaboration", "problem solving", "problem-solving", "innovation", "writing",
            "leadership", "project management", "time management", "critical thinking",
            "adaptability", "teamwork", "analytical", "creative", "organized",
            # Additional patterns for resume detection
            "team work", "team player", "independent", "self-motivated", "detail-oriented",
            "attention to detail", "multitasking", "multi-tasking", "debugging", "troubleshooting",
            "research", "analysis", "planning", "coordination", "mentoring", "training"
        ]
        
        # Industry terms list - Enhanced for better coverage
        self.INDUSTRY_TERMS = [
            "high", "write", "core", "asp", "skill", "integration", "frontend", "backend",
            "full-stack", "scalable", "secure", "responsive", "cross-platform", "performance",
            "maintainable", "extensible", "architecture", "framework", "component",
            "deployment", "environment", "configuration", "workflow", "agile", "devops",
            "develop", "build", "create", "design", "implement", "maintain", "optimize",
            # Additional industry terms for better resume matching
            "automation", "testing", "quality", "production", "development", "software",
            "application", "system", "platform", "solution", "service", "technology"
        ]
    
    def extract_keywords(self, text: str, keyword_list: List[str]) -> Set[str]:
        """Extract keywords using regex patterns with normalization"""
        text_lower = text.lower()
        found = set()
        
        for kw in keyword_list:
            # Get all variations of the keyword
            variations = self.get_all_variations(kw)

            for variation in variations:
                # Create regex pattern for exact word boundary matching
                pattern = r"\b" + re.escape(variation.lower()) + r"\b"

                if re.search(pattern, text_lower):
                    # Add the canonical form
                    canonical = self.normalize_keyword(variation)
                    found.add(canonical)
                    break  # Found one variation, no need to check others
        
        return found
    
    def extract_multi_word_keywords(self, text: str) -> Set[str]:
        """Extract multi-word keywords like 'Entity Framework', 'Role-Based Access Control'"""
        text_lower = text.lower()
        found = set()
        
        # Multi-word patterns to look for
        multi_word_patterns = [
            r"asp\.net\s+core",
            r"entity\s+framework(?:\s+core)?",
            r"sql\s+server",
            r"web\s+api",
            r"role[-\s]based\s+access(?:\s+control)?",
            r"json\s+web\s+token",
            r"github\s+actions",
            r"unit\s+testing",
            r"integration\s+testing",
            r"dependency\s+injection",
            r"visual\s+studio(?:\s+code)?",
            r"continuous\s+integration",
            r"continuous\s+deployment",
            r"project\s+management",
            r"time\s+management",
            r"problem\s+solving",
            r"critical\s+thinking"
        ]
        
        for pattern in multi_word_patterns:
            matches = re.findall(pattern, text_lower)
            for match in matches:
                # Normalize the match
                normalized = self.normalize_keyword(match)
                found.add(normalized)
        
        return found
    
    def normalize_text(self, text: str) -> str:
        """Normalize text by removing punctuation and extra spaces"""
        # Remove extra punctuation but keep important ones
        text = re.sub(r'[^\w\s\.\-#\+]', ' ', text)
        # Normalize multiple spaces
        text = re.sub(r'\s+', ' ', text)
        return text.strip()
    
    def extract_with_stemming(self, text: str, keyword_list: List[str]) -> Set[str]:
        """Extract keywords with basic stemming (RESTful → REST)"""
        text_lower = text.lower()
        found = set()
        
        # Basic stemming patterns
        stemming_patterns = {
            r'\brestful\b': 'rest',
            r'\bapis?\b': 'api',
            r'\bdatabases?\b': 'database',
            r'\bframeworks?\b': 'framework',
            r'\bservices?\b': 'service',
            r'\bcomponents?\b': 'component',
            r'\bmicroservices?\b': 'microservices',
            r'\bcontainers?\b': 'container',
            r'\btechnologies?\b': 'technology'
        }
        
        # Apply stemming
        normalized_text = text_lower
        for pattern, replacement in stemming_patterns.items():
            normalized_text = re.sub(pattern, replacement, normalized_text)
        
        # Extract from normalized text
        for kw in keyword_list:
            variations = self.get_all_variations(kw)
            for variation in variations:
                pattern = r"\b" + re.escape(variation.lower()) + r"\b"
                if re.search(pattern, normalized_text):
                    canonical = self.normalize_keyword(variation)
                    found.add(canonical)
                    break
        
        return found

    def extract_keywords_comprehensive(self, text: str) -> Dict[str, List[str]]:
        """
        Comprehensive keyword extraction that returns the format expected by the routes
        Returns: {
            'technical_skills': [...],
            'soft_skills': [...],
            'other_keywords': [...]
        }
        """
        # Extract technical skills using all methods
        technical_skills = self.extract_keywords(text, self.TECH_KEYWORDS)
        technical_skills.update(self.extract_multi_word_keywords(text))
        technical_skills.update(self.extract_with_stemming(text, self.TECH_KEYWORDS))

        # Extract soft skills
        soft_skills = self.extract_keywords(text, self.SOFT_SKILLS)

        # Extract industry terms as other keywords
        other_keywords = self.extract_keywords(text, self.INDUSTRY_TERMS)

        return {
            'technical_skills': list(technical_skills),
            'soft_skills': list(soft_skills),
            'other_keywords': list(other_keywords)
        }

    def generate_suggestions(self, jd_text: str, resume_text: str) -> Dict:
        """Generate comprehensive suggestions using the exact algorithm specified"""
        
        # Step 1: Extract keywords from both texts
        jd_tech = self.extract_keywords(jd_text, self.TECH_KEYWORDS)
        jd_tech.update(self.extract_multi_word_keywords(jd_text))
        jd_tech.update(self.extract_with_stemming(jd_text, self.TECH_KEYWORDS))
        
        resume_tech = self.extract_keywords(resume_text, self.TECH_KEYWORDS)
        resume_tech.update(self.extract_multi_word_keywords(resume_text))
        resume_tech.update(self.extract_with_stemming(resume_text, self.TECH_KEYWORDS))
        
        jd_soft = self.extract_keywords(jd_text, self.SOFT_SKILLS)
        resume_soft = self.extract_keywords(resume_text, self.SOFT_SKILLS)
        
        jd_industry = self.extract_keywords(jd_text, self.INDUSTRY_TERMS)
        resume_industry = self.extract_keywords(resume_text, self.INDUSTRY_TERMS)
        
        # Step 2: Find missing keywords
        missing_tech = jd_tech - resume_tech
        missing_soft = jd_soft - resume_soft
        missing_industry = jd_industry - resume_industry
        
        # Step 3: Classify missing keywords by priority
        suggestions = []
        
        # Critical Tech Skills
        for kw in missing_tech:
            priority = self.get_priority_level(kw, jd_text)
            if priority == "critical":
                suggestions.append({
                    "keyword": kw,
                    "priority": "Critical",
                    "category": "technical",
                    "action": f"Add '{kw}' to Skills and describe a project or hands-on work using it."
                })

        # High Priority Tech Skills
        for kw in missing_tech:
            priority = self.get_priority_level(kw, jd_text)
            if priority == "high":
                suggestions.append({
                    "keyword": kw,
                    "priority": "High",
                    "category": "technical",
                    "action": f"Add '{kw}' to Skills and describe a project or hands-on work using it."
                })
        
        # Medium Priority (Soft Skills)
        for kw in missing_soft:
            suggestions.append({
                "keyword": kw,
                "priority": "Medium",
                "category": "soft_skills",
                "action": f"Show an example where you demonstrated '{kw}' in your experience."
            })
        
        # Low Priority (Industry Terms)
        for kw in missing_industry:
            suggestions.append({
                "keyword": kw,
                "priority": "Low",
                "category": "industry",
                "action": f"Integrate the industry keyword '{kw}' naturally in your resume."
            })
        
        # Calculate matching scores
        tech_score = (len(jd_tech & resume_tech) / len(jd_tech) * 100) if jd_tech else 100
        soft_score = (len(jd_soft & resume_soft) / len(jd_soft) * 100) if jd_soft else 100
        industry_score = (len(jd_industry & resume_industry) / len(jd_industry) * 100) if jd_industry else 100
        overall_score = (tech_score * 0.5 + soft_score * 0.2 + industry_score * 0.3)
        
        return {
            "suggestions": suggestions,
            "matching_score": {
                "overall_score": round(overall_score, 2),
                "technical_score": round(tech_score, 2),
                "soft_skills_score": round(soft_score, 2),
                "industry_score": round(industry_score, 2),
                "total_missing": len(suggestions),
                "missing_critical": len([s for s in suggestions if s["priority"] == "Critical"]),
                "missing_high": len([s for s in suggestions if s["priority"] == "High"]),
                "missing_medium": len([s for s in suggestions if s["priority"] == "Medium"]),
                "missing_low": len([s for s in suggestions if s["priority"] == "Low"])
            },
            "keyword_analysis": {
                "jd_technical": list(jd_tech),
                "resume_technical": list(resume_tech),
                "missing_technical": list(missing_tech),
                "jd_soft_skills": list(jd_soft),
                "resume_soft_skills": list(resume_soft),
                "missing_soft_skills": list(missing_soft),
                "jd_industry": list(jd_industry),
                "resume_industry": list(resume_industry),
                "missing_industry": list(missing_industry)
            }
        }
