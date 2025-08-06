#!/usr/bin/env python3
"""
Test JWT functionality locally to isolate the issue
"""

import os
import sys
from flask import Flask
from flask_jwt_extended import JWTManager, create_access_token, decode_token
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_jwt_locally():
    """Test JWT functionality locally"""
    print("🔍 Testing JWT Locally")
    print("=" * 50)
    
    # Create a simple Flask app
    app = Flask(__name__)
    
    # Get the same secrets as our main app
    secret_key = os.getenv('SECRET_KEY', 'dev-secret-key')
    jwt_secret_key = os.getenv('JWT_SECRET_KEY', secret_key)
    
    print(f"🔑 SECRET_KEY: {secret_key[:10]}...")
    print(f"🔑 JWT_SECRET_KEY: {jwt_secret_key[:10]}...")
    print(f"🔑 Keys match: {secret_key == jwt_secret_key}")
    
    # Configure the app
    app.config['SECRET_KEY'] = secret_key
    app.config['JWT_SECRET_KEY'] = jwt_secret_key
    
    # Initialize JWT
    jwt = JWTManager(app)
    
    with app.app_context():
        try:
            print("\n1. Creating access token...")
            token = create_access_token(
                identity=123,
                additional_claims={
                    'email': 'test@example.com',
                    'first_name': 'Test',
                    'last_name': 'User',
                    'role': 'basic'
                }
            )
            print(f"   ✅ Token created (length: {len(token)})")
            
            print("\n2. Decoding token...")
            decoded = decode_token(token)
            print(f"   ✅ Token decoded successfully")
            print(f"   User ID: {decoded.get('sub')}")
            print(f"   Email: {decoded.get('email')}")
            print(f"   Algorithm: {decoded.get('alg')}")
            
            print("\n3. Testing with different secret...")
            app.config['JWT_SECRET_KEY'] = 'different-secret'
            jwt_different = JWTManager(app)
            
            try:
                decoded_different = decode_token(token)
                print("   ❌ Token should have failed with different secret!")
            except Exception as e:
                print(f"   ✅ Token correctly failed with different secret: {type(e).__name__}")
            
            # Reset to correct secret
            app.config['JWT_SECRET_KEY'] = jwt_secret_key
            jwt_correct = JWTManager(app)
            
            print("\n4. Testing with correct secret again...")
            decoded_correct = decode_token(token)
            print(f"   ✅ Token works with correct secret")
            
        except Exception as e:
            print(f"   ❌ Error: {e}")
            import traceback
            traceback.print_exc()
    
    print("\n" + "=" * 50)
    print("🏁 Local JWT Test Complete")

if __name__ == "__main__":
    test_jwt_locally()
