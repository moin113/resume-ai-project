import requests

BASE_URL = "http://localhost:5000/api"  # Change to your deployed URL if needed
LOGIN_ENDPOINT = f"{BASE_URL}/login"
PROFILE_ENDPOINT = f"{BASE_URL}/profile"

# Test credentials (replace with a real user in your DB)
TEST_EMAIL = "testuser@example.com"
TEST_PASSWORD = "testpassword"

def test_login_and_profile():
    print("\n--- Testing Login ---")
    login_resp = requests.post(LOGIN_ENDPOINT, json={
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    })
    print("Login status:", login_resp.status_code)
    print("Login response:", login_resp.text)
    if login_resp.status_code != 200 or not login_resp.json().get("success"):
        print("❌ Login failed. Check credentials or backend.")
        return
    tokens = login_resp.json()["tokens"]
    access_token = tokens["access_token"]
    print("Access token:", access_token)

    print("\n--- Testing /profile with token ---")
    headers = {"Authorization": f"Bearer {access_token}"}
    profile_resp = requests.get(PROFILE_ENDPOINT, headers=headers)
    print("Profile status:", profile_resp.status_code)
    print("Profile response:", profile_resp.text)
    if profile_resp.status_code == 200 and profile_resp.json().get("success"):
        print("✅ Profile fetch succeeded.")
    else:
        print("❌ Profile fetch failed. Check token validity and backend JWT config.")

if __name__ == "__main__":
    test_login_and_profile()
