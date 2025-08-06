#!/usr/bin/env python3
"""
Test JWT generation and verification endpoint
"""

import requests

def test_jwt_generation():
    """Test JWT generation and verification"""
    try:
        response = requests.get("https://resume-doctor-ai.onrender.com/api/debug/jwt-test")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print("JWT Generation Test Results:")
            for key, value in data.items():
                print(f"  {key}: {value}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_jwt_generation()
