#!/usr/bin/env python3
"""
Test script to verify authentication flow works correctly
"""

import requests
import json
import sys
import os

# Add backend to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_auth_flow():
    """Test the complete authentication flow"""
    
    # Use the deployed backend URL
    BASE_URL = "https://resume-doctor-ai.onrender.com"
    
    print("🧪 Testing Authentication Flow")
    print("=" * 50)
    
    # Test 1: Register a test user
    print("\n1. Testing User Registration...")
    register_data = {
        "first_name": "Test",
        "last_name": "User",
        "email": "test@example.com",
        "password": "testpassword123",
        "confirm_password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/register", json=register_data)
        print(f"   Status: {response.status_code}")
        result = response.json()
        print(f"   Response: {result.get('message', 'No message')}")
        
        if response.status_code == 201:
            print("   ✅ Registration successful")
        elif response.status_code == 400 and "already registered" in result.get('message', ''):
            print("   ℹ️ User already exists, continuing with login test")
        else:
            print(f"   ❌ Registration failed: {result}")
            
    except Exception as e:
        print(f"   ❌ Registration error: {e}")
    
    # Test 2: Login
    print("\n2. Testing User Login...")
    login_data = {
        "email": "test@example.com",
        "password": "testpassword123"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/api/login", json=login_data)
        print(f"   Status: {response.status_code}")
        result = response.json()
        print(f"   Response: {result.get('message', 'No message')}")
        
        if response.status_code == 200 and result.get('success'):
            print("   ✅ Login successful")
            tokens = result.get('tokens', {})
            access_token = tokens.get('access_token')
            refresh_token = tokens.get('refresh_token')
            
            if access_token and refresh_token:
                print("   ✅ Tokens received")
                
                # Test 3: Access protected route
                print("\n3. Testing Protected Route Access...")
                headers = {"Authorization": f"Bearer {access_token}"}
                
                try:
                    response = requests.get(f"{BASE_URL}/api/profile", headers=headers)
                    print(f"   Status: {response.status_code}")
                    result = response.json()
                    print(f"   Response: {result.get('message', 'No message')}")
                    
                    if response.status_code == 200 and result.get('success'):
                        print("   ✅ Protected route access successful")
                        user = result.get('user', {})
                        print(f"   User: {user.get('email')} ({user.get('first_name')} {user.get('last_name')})")
                    else:
                        print(f"   ❌ Protected route access failed: {result}")
                        
                except Exception as e:
                    print(f"   ❌ Protected route error: {e}")
                
                # Test 4: Token refresh
                print("\n4. Testing Token Refresh...")
                refresh_headers = {"Authorization": f"Bearer {refresh_token}"}
                
                try:
                    response = requests.post(f"{BASE_URL}/api/refresh", headers=refresh_headers)
                    print(f"   Status: {response.status_code}")
                    result = response.json()
                    print(f"   Response: {result.get('message', 'No message')}")
                    
                    if response.status_code == 200 and result.get('success'):
                        print("   ✅ Token refresh successful")
                        new_access_token = result.get('access_token')
                        
                        if new_access_token:
                            print("   ✅ New access token received")
                            
                            # Test 5: Use new token
                            print("\n5. Testing New Token...")
                            new_headers = {"Authorization": f"Bearer {new_access_token}"}
                            
                            try:
                                response = requests.get(f"{BASE_URL}/api/profile", headers=new_headers)
                                print(f"   Status: {response.status_code}")
                                result = response.json()
                                
                                if response.status_code == 200 and result.get('success'):
                                    print("   ✅ New token works correctly")
                                else:
                                    print(f"   ❌ New token failed: {result}")
                                    
                            except Exception as e:
                                print(f"   ❌ New token error: {e}")
                        else:
                            print("   ❌ No new access token in refresh response")
                    else:
                        print(f"   ❌ Token refresh failed: {result}")
                        
                except Exception as e:
                    print(f"   ❌ Token refresh error: {e}")
                    
            else:
                print("   ❌ No tokens in login response")
        else:
            print(f"   ❌ Login failed: {result}")
            
    except Exception as e:
        print(f"   ❌ Login error: {e}")
    
    print("\n" + "=" * 50)
    print("🏁 Authentication Flow Test Complete")

if __name__ == "__main__":
    test_auth_flow()
