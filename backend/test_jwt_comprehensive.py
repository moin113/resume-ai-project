#!/usr/bin/env python3
"""
Comprehensive JWT Test - Deep dive into the JWT issue
"""

import requests
import json
import jwt as pyjwt

def test_jwt_comprehensive():
    """Comprehensive JWT testing"""
    base_url = "https://resume-doctor-ai.onrender.com"
    
    print("🔍 Comprehensive JWT Testing")
    print("=" * 60)
    
    # Test login
    login_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    try:
        print("1. Testing login...")
        response = requests.post(f"{base_url}/api/login", json=login_data)
        print(f"   Login Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"   Login Success: {data.get('success')}")
            
            # Get the token (new structure)
            tokens = data.get('tokens', {})
            access_token = tokens.get('access_token')
            print(f"   Access token in response: {access_token is not None}")
            if access_token:
                print(f"   ✅ Access token received (length: {len(access_token)})")
                print(f"   Token (first 50 chars): {access_token[:50]}...")
                
                # Decode the token to see its contents
                print("\n2. Analyzing token contents...")
                try:
                    # Decode without verification to see contents
                    decoded = pyjwt.decode(access_token, options={"verify_signature": False})
                    print(f"   Token payload:")
                    for key, value in decoded.items():
                        print(f"     {key}: {value}")
                except Exception as e:
                    print(f"   ❌ Error decoding token: {e}")
                
                # Test with different headers
                print("\n3. Testing token with profile endpoint...")
                headers = {
                    'Authorization': f'Bearer {access_token}',
                    'Content-Type': 'application/json'
                }
                
                profile_response = requests.get(f"{base_url}/api/profile", headers=headers)
                print(f"   Profile Status: {profile_response.status_code}")
                
                if profile_response.status_code == 200:
                    print("   ✅ Token works!")
                    profile_data = profile_response.json()
                    print(f"   User: {profile_data.get('first_name')} {profile_data.get('last_name')}")
                else:
                    print(f"   ❌ Token failed: {profile_response.text}")
                    
                    # Try different endpoints
                    print("\n4. Testing with other endpoints...")
                    
                    # Test account endpoint
                    account_response = requests.get(f"{base_url}/api/account", headers=headers)
                    print(f"   Account Status: {account_response.status_code}")
                    if account_response.status_code != 200:
                        print(f"   Account Error: {account_response.text}")
                    
                    # Test refresh endpoint
                    refresh_data = {"refresh_token": tokens.get('refresh_token')}
                    refresh_response = requests.post(f"{base_url}/api/refresh", json=refresh_data)
                    print(f"   Refresh Status: {refresh_response.status_code}")
                    if refresh_response.status_code != 200:
                        print(f"   Refresh Error: {refresh_response.text}")
                    
                    # Test with different header formats
                    print("\n5. Testing different header formats...")
                    
                    # Without Bearer prefix
                    headers_no_bearer = {'Authorization': access_token}
                    test1 = requests.get(f"{base_url}/api/profile", headers=headers_no_bearer)
                    print(f"   No Bearer prefix: {test1.status_code}")
                    
                    # With different case
                    headers_lower = {'authorization': f'Bearer {access_token}'}
                    test2 = requests.get(f"{base_url}/api/profile", headers=headers_lower)
                    print(f"   Lowercase header: {test2.status_code}")
                    
                    # With extra spaces
                    headers_spaces = {'Authorization': f'Bearer  {access_token}'}
                    test3 = requests.get(f"{base_url}/api/profile", headers=headers_spaces)
                    print(f"   Extra spaces: {test3.status_code}")
            else:
                print("   ❌ No access token in response")
                print(f"   Response data: {data}")

        else:
            print(f"   ❌ Login failed: {response.text}")
            
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print("\n" + "=" * 60)
    print("🏁 Comprehensive JWT Test Complete")

if __name__ == "__main__":
    test_jwt_comprehensive()
