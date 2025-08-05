from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt
from backend.models import db, User
import re

# Create blueprint for authentication routes
auth_bp = Blueprint('auth', __name__, url_prefix='/api')

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user (same as US-03)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        confirm_password = data.get('confirm_password', '')
        
        errors = []
        
        if not first_name: errors.append('First name is required')
        if not last_name: errors.append('Last name is required')
        if not email: errors.append('Email is required')
        if not password: errors.append('Password is required')
        if not confirm_password: errors.append('Password confirmation is required')
        
        if email and not User.validate_email(email):
            errors.append('Invalid email format')
        
        if password:
            is_valid, message = User.validate_password(password)
            if not is_valid: errors.append(message)
        
        if password and confirm_password and password != confirm_password:
            errors.append('Passwords do not match')
        
        if email and User.query.filter_by(email=email).first():
            errors.append('Email already registered')
        
        if errors:
            return jsonify({'success': False, 'message': 'Validation failed', 'errors': errors}), 400
        
        new_user = User(first_name=first_name, last_name=last_name, email=email, password=password)
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Account created successfully! Please sign in.',
            'user': new_user.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'success': False, 'message': 'Registration failed. Please try again.', 'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user and return JWT tokens (same as US-03)"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'success': False, 'message': 'No data provided'}), 400
        
        email = data.get('email', '').strip().lower()
        password = data.get('password', '')
        
        errors = []
        if not email: errors.append('Email is required')
        if not password: errors.append('Password is required')
        
        if errors:
            return jsonify({'success': False, 'message': 'Validation failed', 'errors': errors}), 400
        
        user = User.query.filter_by(email=email).first()
        
        if not user:
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
        
        if not user.is_active:
            return jsonify({'success': False, 'message': 'Account is deactivated. Please contact support.'}), 401
        
        if not user.check_password(password):
            return jsonify({'success': False, 'message': 'Invalid email or password'}), 401
        
        user.update_last_login()
        tokens = user.generate_tokens()
        
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': user.to_dict(),
            'tokens': tokens
        }), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': 'Login failed. Please try again.', 'error': str(e)}), 500

@auth_bp.route('/check-email', methods=['POST'])
def check_email():
    """Check if email is already registered"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        
        if not email:
            return jsonify({'success': False, 'message': 'Email is required'}), 400
        
        user_exists = User.query.filter_by(email=email).first() is not None
        
        return jsonify({'success': True, 'exists': user_exists}), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': 'Error checking email', 'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """Get current user profile (protected route)"""
    try:
        # Get current user from JWT
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'success': False, 'message': 'User not found'}), 404
        
        return jsonify({'success': True, 'user': user.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'success': False, 'message': 'Error fetching profile', 'error': str(e)}), 500

@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user"""
    try:
        return jsonify({'success': True, 'message': 'Logged out successfully'}), 200
    except Exception as e:
        return jsonify({'success': False, 'message': 'Logout failed', 'error': str(e)}), 500
