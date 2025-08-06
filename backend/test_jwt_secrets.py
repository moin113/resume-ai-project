#!/usr/bin/env python3
"""
Test JWT Secrets - Check what secrets are being used on the server
"""

import requests
import json

def test_jwt_secrets():
    """Test what JWT secrets are being used on the server"""
    base_url = "https://resume-doctor-ai.onrender.com"
    
    print("🔍 Testing JWT Secrets on Server")
    print("=" * 60)
    
    # Test login to see debug output
    login_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    try:
        print("1. Testing login to see server debug output...")
        response = requests.post(f"{base_url}/api/login", json=login_data)
        print(f"   Login Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Login Success: {data.get('success')}")
            
            # Get the token
            access_token = data.get('access_token')
            if access_token:
                print(f"   ✅ Access token received (length: {len(access_token)})")
                
                # Try to use the token immediately
                headers = {
                    'Authorization': f'Bearer {access_token}',
                    'Content-Type': 'application/json'
                }
                
                print("\n2. Testing token immediately after login...")
                profile_response = requests.get(f"{base_url}/api/profile", headers=headers)
                print(f"   Profile Status: {profile_response.status_code}")
                
                if profile_response.status_code == 200:
                    print("   ✅ Token works immediately after login!")
                    profile_data = profile_response.json()
                    print(f"   User: {profile_data.get('first_name')} {profile_data.get('last_name')}")
                else:
                    print(f"   ❌ Token failed: {profile_response.text}")
                    
        else:
            print(f"   ❌ Login failed: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("🏁 JWT Secrets Test Complete")

if __name__ == "__main__":
    test_jwt_secrets()
