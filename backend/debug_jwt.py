#!/usr/bin/env python3
"""
Debug JWT token issues
"""

import requests
import json
import jwt
import base64

def debug_jwt():
    """Debug JWT token generation and validation"""
    
    BASE_URL = "https://resume-doctor-ai.onrender.com"
    
    print("🔍 Debugging JWT Issues")
    print("=" * 50)
    
    # Test login and get tokens
    print("\n1. Getting tokens from login...")
    login_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/login", json=login_data)
        print(f"   Login Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            tokens = result.get('tokens', {})
            access_token = tokens.get('access_token')
            refresh_token = tokens.get('refresh_token')
            
            print(f"   Access token length: {len(access_token) if access_token else 0}")
            print(f"   Refresh token length: {len(refresh_token) if refresh_token else 0}")
            
            if access_token:
                # Decode token without verification to see contents
                try:
                    # Split token into parts
                    parts = access_token.split('.')
                    if len(parts) == 3:
                        header = parts[0]
                        payload = parts[1]
                        
                        # Add padding if needed
                        header += '=' * (4 - len(header) % 4)
                        payload += '=' * (4 - len(payload) % 4)
                        
                        # Decode
                        header_decoded = json.loads(base64.urlsafe_b64decode(header))
                        payload_decoded = json.loads(base64.urlsafe_b64decode(payload))
                        
                        print(f"   Token header: {header_decoded}")
                        print(f"   Token payload: {payload_decoded}")
                        
                        # Check expiration
                        import time
                        current_time = time.time()
                        exp_time = payload_decoded.get('exp', 0)
                        
                        print(f"   Current time: {current_time}")
                        print(f"   Token expires: {exp_time}")
                        print(f"   Time until expiry: {exp_time - current_time} seconds")
                        
                        if exp_time < current_time:
                            print("   ⚠️ TOKEN IS EXPIRED!")
                        else:
                            print("   ✅ Token is not expired")
                            
                except Exception as e:
                    print(f"   ❌ Error decoding token: {e}")
                
                # Test the token immediately
                print("\n2. Testing token immediately after login...")
                headers = {"Authorization": f"Bearer {access_token}"}
                
                try:
                    response = requests.get(f"{BASE_URL}/api/profile", headers=headers)
                    print(f"   Profile Status: {response.status_code}")
                    
                    if response.status_code != 200:
                        result = response.json()
                        print(f"   Error: {result}")
                        
                        # Check response headers for more info
                        print(f"   Response headers: {dict(response.headers)}")
                        
                except Exception as e:
                    print(f"   ❌ Profile request error: {e}")
                    
            else:
                print("   ❌ No access token received")
                
        else:
            result = response.json()
            print(f"   Login failed: {result}")
            
    except Exception as e:
        print(f"   ❌ Login error: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 JWT Debug Complete")

if __name__ == "__main__":
    debug_jwt()
