#!/usr/bin/env python3
"""
Deep debug of JWT issues with environment variables set
"""

import requests
import json
import base64
import time

def deep_debug():
    """Deep debug of JWT token issues"""
    
    BASE_URL = "https://resume-doctor-ai.onrender.com"
    
    print("🔍 Deep Debugging JWT Issues")
    print("=" * 60)
    
    # Test 1: Check if login generates valid tokens
    print("\n1. Testing Login and Token Generation...")
    login_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/login", json=login_data, timeout=15)
        print(f"   Login Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"   Login Success: {result.get('success')}")
            print(f"   Message: {result.get('message')}")
            
            tokens = result.get('tokens', {})
            access_token = tokens.get('access_token')
            refresh_token = tokens.get('refresh_token')
            
            if access_token:
                print(f"   ✅ Access token received (length: {len(access_token)})")
                
                # Decode token to check structure
                try:
                    parts = access_token.split('.')
                    if len(parts) == 3:
                        # Decode payload
                        payload = parts[1]
                        payload += '=' * (4 - len(payload) % 4)
                        payload_decoded = json.loads(base64.urlsafe_b64decode(payload))
                        
                        print(f"   Token Subject (user_id): {payload_decoded.get('sub')}")
                        print(f"   Token Type: {payload_decoded.get('type')}")
                        print(f"   Token Algorithm: HS256")
                        print(f"   Token Expires: {payload_decoded.get('exp')}")
                        print(f"   Current Time: {int(time.time())}")
                        
                        # Check if token is expired
                        exp_time = payload_decoded.get('exp', 0)
                        current_time = int(time.time())
                        if exp_time > current_time:
                            print(f"   ✅ Token is valid (expires in {exp_time - current_time} seconds)")
                        else:
                            print(f"   ❌ Token is expired!")
                            
                except Exception as e:
                    print(f"   ❌ Error decoding token: {e}")
                
                # Test 2: Try different ways to send the token
                print(f"\n2. Testing Token with Different Headers...")
                
                # Test with standard Authorization header
                headers1 = {
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json"
                }
                
                try:
                    response = requests.get(f"{BASE_URL}/api/profile", headers=headers1, timeout=10)
                    print(f"   Standard Bearer: {response.status_code}")
                    if response.status_code != 200:
                        result = response.json()
                        print(f"   Error: {result.get('message')} ({result.get('error')})")
                except Exception as e:
                    print(f"   Standard Bearer Error: {e}")
                
                # Test 3: Check if it's a CORS issue
                print(f"\n3. Testing with CORS headers...")
                headers2 = {
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json",
                    "Origin": "https://resume-doctor-ai-frontend.onrender.com"
                }
                
                try:
                    response = requests.get(f"{BASE_URL}/api/profile", headers=headers2, timeout=10)
                    print(f"   With Origin header: {response.status_code}")
                    if response.status_code != 200:
                        result = response.json()
                        print(f"   Error: {result.get('message')} ({result.get('error')})")
                    else:
                        result = response.json()
                        print(f"   ✅ SUCCESS! User: {result.get('user', {}).get('email')}")
                except Exception as e:
                    print(f"   With Origin Error: {e}")
                
                # Test 4: Try the account info endpoint
                print(f"\n4. Testing Account Info Endpoint...")
                try:
                    response = requests.get(f"{BASE_URL}/api/account_info", headers=headers1, timeout=10)
                    print(f"   Account Info: {response.status_code}")
                    if response.status_code != 200:
                        result = response.json()
                        print(f"   Error: {result.get('message')} ({result.get('error')})")
                    else:
                        result = response.json()
                        print(f"   ✅ Account Info Success!")
                except Exception as e:
                    print(f"   Account Info Error: {e}")
                
                # Test 5: Check refresh token
                if refresh_token:
                    print(f"\n5. Testing Refresh Token...")
                    refresh_headers = {
                        "Authorization": f"Bearer {refresh_token}",
                        "Content-Type": "application/json"
                    }
                    
                    try:
                        response = requests.post(f"{BASE_URL}/api/refresh", headers=refresh_headers, timeout=10)
                        print(f"   Refresh Status: {response.status_code}")
                        if response.status_code == 200:
                            result = response.json()
                            print(f"   ✅ Refresh Success! New token received.")
                        else:
                            result = response.json()
                            print(f"   Refresh Error: {result.get('message')} ({result.get('error')})")
                    except Exception as e:
                        print(f"   Refresh Error: {e}")
                
            else:
                print("   ❌ No access token in response")
                
        else:
            result = response.json()
            print(f"   Login Failed: {result}")
            
    except Exception as e:
        print(f"   ❌ Login Error: {e}")
    
    print("\n" + "=" * 60)
    print("🏁 Deep Debug Complete")

if __name__ == "__main__":
    deep_debug()
