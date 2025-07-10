#!/usr/bin/env python3
"""
Focused test for specific issues
"""

import requests
import json

BASE_URL = "https://bd8fe65f-5502-435f-97f3-e555b369a86c.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

def test_registration_issue():
    """Test registration with existing users"""
    print("Testing registration with existing email...")
    
    user_data = {
        "email": "priya.sharma@gmail.com",
        "password": "SecurePass123!",
        "name": "Priya Sharma",
        "role": "candidate"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/register", json=user_data, headers=HEADERS, timeout=10)
        print(f"Status: {response.status_code}")
        if response.status_code == 400:
            print("✅ Registration correctly rejected existing email")
        else:
            print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Request failed: {e}")

def test_role_access():
    """Test role-based access with proper tokens"""
    print("\nTesting role-based access...")
    
    # Login as candidate
    login_data = {"email": "priya.sharma@gmail.com", "password": "SecurePass123!"}
    try:
        response = requests.post(f"{BASE_URL}/auth/login", json=login_data, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            token = response.json()["access_token"]
            
            # Try to access company endpoint
            auth_headers = {"Authorization": f"Bearer {token}"}
            response = requests.get(f"{BASE_URL}/company/profile", headers=auth_headers, timeout=10)
            print(f"Candidate accessing company endpoint: {response.status_code}")
            if response.status_code == 403:
                print("✅ Role-based access control working")
            else:
                print(f"❌ Expected 403, got {response.status_code}")
        else:
            print(f"❌ Login failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Request failed: {e}")

def test_invalid_token():
    """Test invalid token handling"""
    print("\nTesting invalid token...")
    
    try:
        headers = {"Authorization": "Bearer invalid_token_12345"}
        response = requests.get(f"{BASE_URL}/candidate/profile", headers=headers, timeout=10)
        print(f"Invalid token response: {response.status_code}")
        if response.status_code == 401:
            print("✅ Invalid token properly rejected")
        else:
            print(f"❌ Expected 401, got {response.status_code}")
    except Exception as e:
        print(f"❌ Request failed: {e}")

if __name__ == "__main__":
    test_registration_issue()
    test_role_access()
    test_invalid_token()