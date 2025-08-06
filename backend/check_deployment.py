#!/usr/bin/env python3
"""
Check if our latest changes are deployed
"""

import requests

def check_deployment():
    """Check if the latest changes are deployed"""
    
    BASE_URL = "https://resume-doctor-ai.onrender.com"
    
    print("🔍 Checking Deployment Status")
    print("=" * 50)
    
    # Test if our new routes are working
    print("\n1. Testing new HTML routes...")
    
    routes_to_test = [
        "/us10_login.html",
        "/us10_register.html", 
        "/us10_dashboard.html",
        "/us10_account.html"
    ]
    
    for route in routes_to_test:
        try:
            response = requests.get(f"{BASE_URL}{route}", timeout=10)
            print(f"   {route}: {response.status_code}")
        except Exception as e:
            print(f"   {route}: ERROR - {e}")
    
    # Test if refresh endpoint is working
    print("\n2. Testing refresh endpoint...")
    try:
        # This should return 401 (missing token) not 404
        response = requests.post(f"{BASE_URL}/api/refresh", timeout=10)
        print(f"   /api/refresh: {response.status_code}")
        if response.status_code == 401:
            result = response.json()
            print(f"   Response: {result.get('message', 'No message')}")
            print("   ✅ Refresh endpoint is working (401 expected without token)")
        elif response.status_code == 404:
            print("   ❌ Refresh endpoint not found - old deployment")
        else:
            print(f"   Unexpected status: {response.status_code}")
    except Exception as e:
        print(f"   /api/refresh: ERROR - {e}")
    
    print("\n" + "=" * 50)
    print("🏁 Deployment Check Complete")

if __name__ == "__main__":
    check_deployment()
