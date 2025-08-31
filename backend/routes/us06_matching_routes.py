"""
US-06: Matching Score Routes
API endpoints for calculating and retrieving resume-job description matching scores
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from backend.models import db, User, Resume, JobDescription, MatchScore, ScanHistory
from backend.services.matching_service import MatchingService
from backend.services.enhanced_matching_service import RealTimeLLMService
from datetime import datetime
import time

# Create blueprint for matching routes
matching_bp = Blueprint('matching', __name__, url_prefix='/api')

# Initialize services
matching_service = MatchingService()
realtime_llm_service = RealTimeLLMService()


@matching_bp.route('/calculate_match', methods=['POST'])
@jwt_required()
def calculate_match_score():
    """
    Calculate matching score between resume and job description
    Expected JSON payload:
    {
        "resume_id": 1,
        "job_description_id": 2
    }
    """
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400
        
        resume_id = data.get('resume_id')
        job_description_id = data.get('job_description_id')
        
        if not resume_id or not job_description_id:
            return jsonify({
                'success': False,
                'message': 'Both resume_id and job_description_id are required'
            }), 400
        
        # Calculate match score
        result = matching_service.calculate_match_score(
            resume_id=resume_id,
            job_description_id=job_description_id,
            user_id=current_user_id
        )
        
        if not result['success']:
            return jsonify({
                'success': False,
                'message': 'Failed to calculate match score',
                'error': result.get('error')
            }), 400
        
        return jsonify({
            'success': True,
            'message': 'Match score calculated successfully',
            'match_score': result['match_score'],
            'detailed_scores': result['detailed_scores'],
            'keyword_analysis': result['keyword_analysis']
        }), 200
        
    except Exception as e:
        current_app.logger.error(f"Error in calculate_match_score: {e}")
        return jsonify({
            'success': False,
            'message': 'Error calculating match score',
            'error': str(e)
        }), 500


@matching_bp.route('/analyze_realtime', methods=['POST'])
@jwt_required()
def analyze_realtime():
    """
    Real-time analysis of resume text against job description text
    Expected JSON payload:
    {
        "resume_text": "resume content...",
        "job_description_text": "job description content..."
    }
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404

        # Check if user can perform scan
        if not user.can_perform_scan():
            return jsonify({
                'success': False,
                'message': 'No free scans remaining. Please upgrade to premium for unlimited scans.',
                'scan_status': user.get_scan_status()
            }), 403

        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400

        resume_text = data.get('resume_text', '').strip()
        job_description_text = data.get('job_description_text', '').strip()

        if not resume_text or not job_description_text:
            return jsonify({
                'success': False,
                'message': 'Both resume_text and job_description_text are required'
            }), 400

        # Use one free scan before performing analysis
        scan_used = user.use_free_scan()
        if not scan_used:
            return jsonify({
                'success': False,
                'message': 'Failed to use free scan. Please try again.',
                'scan_status': user.get_scan_status()
            }), 400

        # Track scan duration
        scan_start_time = time.time()

        # Perform real-time LLM analysis
        analysis_result = realtime_llm_service.analyze_resume_realtime(
            resume_text=resume_text,
            job_description_text=job_description_text
        )

        scan_duration = time.time() - scan_start_time

        if not analysis_result['success']:
            # If analysis fails, restore the scan count
            user.free_scans_remaining += 1
            user.total_scans_used -= 1
            db.session.commit()

            return jsonify({
                'success': False,
                'message': 'Failed to perform real-time analysis',
                'error': analysis_result.get('error'),
                'scan_status': user.get_scan_status()
            }), 400

        # Save scan results to ScanHistory
        try:
            scan_history = ScanHistory(
                user_id=current_user_id,
                resume_text=resume_text[:5000],  # Store first 5000 chars for reference
                job_description_text=job_description_text[:5000],  # Store first 5000 chars for reference
                overall_match_score=analysis_result.get('overall_match_score', 0),
                category_scores=analysis_result.get('category_scores', {}),
                detailed_analysis=analysis_result.get('detailed_analysis', {}),
                recommendations=analysis_result.get('recommendations', []),
                keyword_analysis=analysis_result.get('keyword_analysis', {}),
                ats_compatibility=analysis_result.get('ats_compatibility', 0),
                scan_type='realtime',
                algorithm_used='llm_enhanced',
                scan_duration=scan_duration
            )

            db.session.add(scan_history)
            db.session.commit()

            current_app.logger.info(f"Scan history saved with ID {scan_history.id} for user {current_user_id}")

            # Add scan history ID to response
            analysis_result['scan_history_id'] = scan_history.id

        except Exception as save_error:
            current_app.logger.error(f"Failed to save scan history: {save_error}")
            # Don't fail the request if saving history fails
            pass

        current_app.logger.info(f"Real-time analysis completed for user {current_user_id}, scan used: {scan_used}")

        return jsonify({
            'success': True,
            'message': 'Real-time analysis completed successfully',
            'analysis': analysis_result,
            'scan_status': user.get_scan_status()
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error in analyze_realtime: {e}")
        return jsonify({
            'success': False,
            'message': 'Error performing real-time analysis',
            'error': str(e)
        }), 500


@matching_bp.route('/scan_status', methods=['GET'])
@jwt_required()
def get_scan_status():
    """Get current scan status for user"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({
                'success': False,
                'message': 'User not found'
            }), 404

        return jsonify({
            'success': True,
            'scan_status': user.get_scan_status()
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error getting scan status: {e}")
        return jsonify({
            'success': False,
            'message': 'Error getting scan status',
            'error': str(e)
        }), 500


@matching_bp.route('/enhanced_match', methods=['POST'])
@jwt_required()
def calculate_enhanced_match():
    """
    Calculate enhanced matching score using the new LLM service
    Expected JSON payload:
    {
        "resume_id": 1,
        "job_description_id": 2
    }
    """
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        if not data:
            return jsonify({
                'success': False,
                'message': 'No data provided'
            }), 400

        resume_id = data.get('resume_id')
        job_description_id = data.get('job_description_id')

        if not resume_id or not job_description_id:
            return jsonify({
                'success': False,
                'message': 'Both resume_id and job_description_id are required'
            }), 400

        # Calculate enhanced match score
        result = realtime_llm_service.calculate_enhanced_match_score(
            resume_id=resume_id,
            job_description_id=job_description_id,
            user_id=current_user_id
        )

        if not result['success']:
            return jsonify({
                'success': False,
                'message': 'Failed to calculate enhanced match score',
                'error': result.get('error')
            }), 400

        return jsonify({
            'success': True,
            'message': 'Enhanced match score calculated successfully',
            'analysis': result
        }), 200

    except Exception as e:
        current_app.logger.error(f"Error in calculate_enhanced_match: {e}")
        return jsonify({
            'success': False,
            'message': 'Error calculating enhanced match score',
            'error': str(e)
        }), 500


