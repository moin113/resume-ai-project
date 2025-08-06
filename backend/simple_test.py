#!/usr/bin/env python3
"""
Simple test to check if backend is responding
"""

import requests

def test_backend():
    BASE_URL = "https://resume-doctor-ai.onrender.com"
    
    print("Testing backend connectivity...")
    
    try:
        # Test basic connectivity
        response = requests.get(f"{BASE_URL}/", timeout=10)
        print(f"Root endpoint status: {response.status_code}")
        
        # Test login page
        response = requests.get(f"{BASE_URL}/login", timeout=10)
        print(f"Login page status: {response.status_code}")
        
        # Test API endpoint
        response = requests.get(f"{BASE_URL}/api/test-available-data", timeout=10)
        print(f"API test endpoint status: {response.status_code}")
        if response.status_code == 200:
            print(f"API response: {response.json()}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_backend()
