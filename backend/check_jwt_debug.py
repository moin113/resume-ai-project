#!/usr/bin/env python3
"""
Check JWT debug endpoint
"""

import requests

def check_jwt_debug():
    """Check JWT debug endpoint"""
    try:
        response = requests.get("https://resume-doctor-ai.onrender.com/api/debug/jwt")
        print(f"Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print("JWT Debug Info:")
            for key, value in data.items():
                print(f"  {key}: {value}")
        else:
            print(f"Error: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_jwt_debug()
