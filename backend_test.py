#!/usr/bin/env python3
"""
Comprehensive Backend API Testing for CMO India Hiring Platform
Tests all backend endpoints systematically with realistic data
"""

import requests
import json
import base64
import time
from datetime import datetime

# Configuration
BASE_URL = "https://bd8fe65f-5502-435f-97f3-e555b369a86c.preview.emergentagent.com/api"
HEADERS = {"Content-Type": "application/json"}

# Test data storage
test_data = {
    "tokens": {},
    "users": {},
    "profiles": {},
    "jobs": {},
    "applications": {}
}

def log_test(test_name, status, details=""):
    """Log test results"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    status_symbol = "✅" if status == "PASS" else "❌" if status == "FAIL" else "⚠️"
    print(f"[{timestamp}] {status_symbol} {test_name}")
    if details:
        print(f"    Details: {details}")
    print()

def make_request(method, endpoint, data=None, headers=None, files=None):
    """Make HTTP request with error handling"""
    url = f"{BASE_URL}{endpoint}"
    request_headers = HEADERS.copy()
    if headers:
        request_headers.update(headers)
    
    try:
        if method == "GET":
            response = requests.get(url, headers=request_headers)
        elif method == "POST":
            if files:
                response = requests.post(url, files=files, headers={k: v for k, v in request_headers.items() if k != "Content-Type"})
            else:
                response = requests.post(url, json=data, headers=request_headers)
        elif method == "PUT":
            response = requests.put(url, json=data, headers=request_headers)
        elif method == "DELETE":
            response = requests.delete(url, headers=request_headers)
        
        return response
    except Exception as e:
        print(f"Request failed: {str(e)}")
        return None

def test_user_registration():
    """Test user registration for all roles"""
    print("=" * 60)
    print("TESTING USER REGISTRATION")
    print("=" * 60)
    
    # Test data for different roles
    users_to_register = [
        {
            "email": "priya.sharma@gmail.com",
            "password": "SecurePass123!",
            "name": "Priya Sharma",
            "role": "candidate"
        },
        {
            "email": "techcorp.hr@techcorp.com",
            "password": "CompanyPass456!",
            "name": "TechCorp Solutions",
            "role": "company"
        },
        {
            "email": "admin@cmoindia.com",
            "password": "AdminPass789!",
            "name": "CMO Admin",
            "role": "admin"
        }
    ]
    
    for user_data in users_to_register:
        response = make_request("POST", "/auth/register", user_data)
        
        if response and response.status_code == 200:
            result = response.json()
            test_data["tokens"][user_data["role"]] = result["access_token"]
            test_data["users"][user_data["role"]] = {
                "user_id": result["user_id"],
                "email": user_data["email"],
                "name": result["name"],
                "role": result["role"]
            }
            log_test(f"Register {user_data['role']} user", "PASS", 
                    f"User ID: {result['user_id']}, Token received")
        else:
            error_msg = response.json().get("detail", "Unknown error") if response else "No response"
            log_test(f"Register {user_data['role']} user", "FAIL", error_msg)

def test_user_login():
    """Test user login functionality"""
    print("=" * 60)
    print("TESTING USER LOGIN")
    print("=" * 60)
    
    login_data = [
        {"email": "priya.sharma@gmail.com", "password": "SecurePass123!", "role": "candidate"},
        {"email": "techcorp.hr@techcorp.com", "password": "CompanyPass456!", "role": "company"},
        {"email": "admin@cmoindia.com", "password": "AdminPass789!", "role": "admin"}
    ]
    
    for login in login_data:
        response = make_request("POST", "/auth/login", {
            "email": login["email"],
            "password": login["password"]
        })
        
        if response and response.status_code == 200:
            result = response.json()
            # Update token (in case registration failed but login works)
            test_data["tokens"][login["role"]] = result["access_token"]
            log_test(f"Login {login['role']} user", "PASS", 
                    f"Token refreshed, Role: {result['role']}")
        else:
            error_msg = response.json().get("detail", "Unknown error") if response else "No response"
            log_test(f"Login {login['role']} user", "FAIL", error_msg)

def test_jwt_authentication():
    """Test JWT token validation"""
    print("=" * 60)
    print("TESTING JWT AUTHENTICATION")
    print("=" * 60)
    
    # Test with valid token
    if "candidate" in test_data["tokens"]:
        headers = {"Authorization": f"Bearer {test_data['tokens']['candidate']}"}
        response = make_request("GET", "/candidate/profile", headers=headers)
        
        if response and response.status_code in [200, 404]:  # 404 is OK if profile doesn't exist yet
            log_test("Valid JWT token authentication", "PASS", "Token accepted")
        else:
            log_test("Valid JWT token authentication", "FAIL", 
                    f"Status: {response.status_code if response else 'No response'}")
    
    # Test with invalid token
    headers = {"Authorization": "Bearer invalid_token_12345"}
    response = make_request("GET", "/candidate/profile", headers=headers)
    
    if response and response.status_code == 401:
        log_test("Invalid JWT token rejection", "PASS", "Invalid token properly rejected")
    else:
        log_test("Invalid JWT token rejection", "FAIL", 
                f"Expected 401, got {response.status_code if response else 'No response'}")

def test_role_based_access_control():
    """Test role-based access control"""
    print("=" * 60)
    print("TESTING ROLE-BASED ACCESS CONTROL")
    print("=" * 60)
    
    # Test candidate trying to access company endpoints
    if "candidate" in test_data["tokens"]:
        headers = {"Authorization": f"Bearer {test_data['tokens']['candidate']}"}
        response = make_request("GET", "/company/profile", headers=headers)
        
        if response and response.status_code == 403:
            log_test("Candidate blocked from company endpoints", "PASS", "Access properly denied")
        else:
            log_test("Candidate blocked from company endpoints", "FAIL", 
                    f"Expected 403, got {response.status_code if response else 'No response'}")
    
    # Test company trying to access admin endpoints
    if "company" in test_data["tokens"]:
        headers = {"Authorization": f"Bearer {test_data['tokens']['company']}"}
        response = make_request("GET", "/admin/users", headers=headers)
        
        if response and response.status_code == 403:
            log_test("Company blocked from admin endpoints", "PASS", "Access properly denied")
        else:
            log_test("Company blocked from admin endpoints", "FAIL", 
                    f"Expected 403, got {response.status_code if response else 'No response'}")

def test_candidate_profile_management():
    """Test candidate profile CRUD operations"""
    print("=" * 60)
    print("TESTING CANDIDATE PROFILE MANAGEMENT")
    print("=" * 60)
    
    if "candidate" not in test_data["tokens"]:
        log_test("Candidate profile tests", "SKIP", "No candidate token available")
        return
    
    headers = {"Authorization": f"Bearer {test_data['tokens']['candidate']}"}
    
    # Get initial profile
    response = make_request("GET", "/candidate/profile", headers=headers)
    if response and response.status_code == 200:
        log_test("Get candidate profile", "PASS", "Profile retrieved successfully")
        test_data["profiles"]["candidate"] = response.json()
    else:
        log_test("Get candidate profile", "FAIL", 
                f"Status: {response.status_code if response else 'No response'}")
    
    # Update profile
    profile_update = {
        "skills": ["Python", "FastAPI", "React", "MongoDB", "Machine Learning"],
        "experience": "3 years in software development",
        "location": "Mumbai, Maharashtra",
        "phone": "+91-9876543210"
    }
    
    response = make_request("PUT", "/candidate/profile", profile_update, headers=headers)
    if response and response.status_code == 200:
        log_test("Update candidate profile", "PASS", "Profile updated successfully")
        updated_profile = response.json()
        if updated_profile.get("skills") == profile_update["skills"]:
            log_test("Profile data persistence", "PASS", "Updated data saved correctly")
        else:
            log_test("Profile data persistence", "FAIL", "Updated data not saved correctly")
    else:
        log_test("Update candidate profile", "FAIL", 
                f"Status: {response.status_code if response else 'No response'}")

def test_job_management():
    """Test job posting and management"""
    print("=" * 60)
    print("TESTING JOB MANAGEMENT")
    print("=" * 60)
    
    if "company" not in test_data["tokens"]:
        log_test("Job management tests", "SKIP", "No company token available")
        return
    
    headers = {"Authorization": f"Bearer {test_data['tokens']['company']}"}
    
    # First update company profile
    company_update = {
        "company_name": "TechCorp Solutions Pvt Ltd",
        "description": "Leading technology solutions provider specializing in AI and ML",
        "website": "https://techcorp.com",
        "location": "Bangalore, Karnataka"
    }
    
    response = make_request("PUT", "/company/profile", company_update, headers=headers)
    if response and response.status_code == 200:
        log_test("Update company profile", "PASS", "Company profile updated")
    
    # Create a job posting
    job_data = {
        "title": "Senior Python Developer",
        "description": "We are looking for an experienced Python developer to join our AI team. You will work on cutting-edge machine learning projects and help build scalable backend systems.",
        "requirements": "5+ years Python experience, FastAPI, MongoDB, Machine Learning frameworks (TensorFlow/PyTorch), Docker, AWS",
        "location": "Bangalore, Karnataka",
        "experience_level": "Senior (5-8 years)",
        "salary_range": "₹15-25 LPA",
        "job_type": "full-time"
    }
    
    response = make_request("POST", "/company/jobs", job_data, headers=headers)
    if response and response.status_code == 200:
        job_result = response.json()
        test_data["jobs"]["senior_python"] = job_result
        log_test("Create job posting", "PASS", f"Job ID: {job_result['id']}")
    else:
        log_test("Create job posting", "FAIL", 
                f"Status: {response.status_code if response else 'No response'}")
    
    # Get company jobs
    response = make_request("GET", "/company/jobs", headers=headers)
    if response and response.status_code == 200:
        jobs = response.json()
        log_test("Get company jobs", "PASS", f"Retrieved {len(jobs)} jobs")
    else:
        log_test("Get company jobs", "FAIL", 
                f"Status: {response.status_code if response else 'No response'}")
    
    # Create another job for testing
    job_data2 = {
        "title": "Frontend React Developer",
        "description": "Join our frontend team to build beautiful and responsive user interfaces using React and modern web technologies.",
        "requirements": "3+ years React experience, JavaScript, HTML/CSS, Redux, REST APIs",
        "location": "Mumbai, Maharashtra",
        "experience_level": "Mid-level (3-5 years)",
        "salary_range": "₹8-15 LPA",
        "job_type": "full-time"
    }
    
    response = make_request("POST", "/company/jobs", job_data2, headers=headers)
    if response and response.status_code == 200:
        job_result2 = response.json()
        test_data["jobs"]["react_dev"] = job_result2
        log_test("Create second job posting", "PASS", f"Job ID: {job_result2['id']}")

def test_job_search():
    """Test job search functionality"""
    print("=" * 60)
    print("TESTING JOB SEARCH")
    print("=" * 60)
    
    if "candidate" not in test_data["tokens"]:
        log_test("Job search tests", "SKIP", "No candidate token available")
        return
    
    headers = {"Authorization": f"Bearer {test_data['tokens']['candidate']}"}
    
    # Search all jobs
    response = make_request("GET", "/candidate/jobs", headers=headers)
    if response and response.status_code == 200:
        jobs = response.json()
        log_test("Search all jobs", "PASS", f"Found {len(jobs)} jobs")
    else:
        log_test("Search all jobs", "FAIL", 
                f"Status: {response.status_code if response else 'No response'}")
    
    # Search by title
    response = make_request("GET", "/candidate/jobs?title=Python", headers=headers)
    if response and response.status_code == 200:
        jobs = response.json()
        log_test("Search jobs by title", "PASS", f"Found {len(jobs)} Python jobs")
    else:
        log_test("Search jobs by title", "FAIL", 
                f"Status: {response.status_code if response else 'No response'}")
    
    # Search by location
    response = make_request("GET", "/candidate/jobs?location=Bangalore", headers=headers)
    if response and response.status_code == 200:
        jobs = response.json()
        log_test("Search jobs by location", "PASS", f"Found {len(jobs)} jobs in Bangalore")
    else:
        log_test("Search jobs by location", "FAIL", 
                f"Status: {response.status_code if response else 'No response'}")

def test_job_applications():
    """Test job application workflow"""
    print("=" * 60)
    print("TESTING JOB APPLICATIONS")
    print("=" * 60)
    
    if "candidate" not in test_data["tokens"] or not test_data["jobs"]:
        log_test("Job application tests", "SKIP", "Missing candidate token or jobs")
        return
    
    headers = {"Authorization": f"Bearer {test_data['tokens']['candidate']}"}
    
    # Apply for a job
    if "senior_python" in test_data["jobs"]:
        application_data = {
            "job_id": test_data["jobs"]["senior_python"]["id"],
            "cover_letter": "Dear Hiring Manager,\n\nI am excited to apply for the Senior Python Developer position. With 3+ years of experience in Python development and a strong background in machine learning, I believe I would be a great fit for your AI team. I have worked extensively with FastAPI, MongoDB, and various ML frameworks including TensorFlow and PyTorch.\n\nI am particularly interested in this role because of TechCorp's reputation for innovation in AI solutions. I would love to contribute to your cutting-edge projects and help build scalable systems.\n\nThank you for considering my application.\n\nBest regards,\nPriya Sharma"
        }
        
        response = make_request("POST", "/candidate/applications", application_data, headers=headers)
        if response and response.status_code == 200:
            application = response.json()
            test_data["applications"]["python_app"] = application
            log_test("Apply for job", "PASS", f"Application ID: {application['id']}")
        else:
            log_test("Apply for job", "FAIL", 
                    f"Status: {response.status_code if response else 'No response'}")
    
    # Get candidate applications
    response = make_request("GET", "/candidate/applications", headers=headers)
    if response and response.status_code == 200:
        applications = response.json()
        log_test("Get candidate applications", "PASS", f"Found {len(applications)} applications")
    else:
        log_test("Get candidate applications", "FAIL", 
                f"Status: {response.status_code if response else 'No response'}")
    
    # Test duplicate application prevention
    if "senior_python" in test_data["jobs"]:
        application_data = {
            "job_id": test_data["jobs"]["senior_python"]["id"],
            "cover_letter": "Another application for the same job"
        }
        
        response = make_request("POST", "/candidate/applications", application_data, headers=headers)
        if response and response.status_code == 400:
            log_test("Prevent duplicate applications", "PASS", "Duplicate application properly blocked")
        else:
            log_test("Prevent duplicate applications", "FAIL", 
                    f"Expected 400, got {response.status_code if response else 'No response'}")

def test_company_application_management():
    """Test company's application management"""
    print("=" * 60)
    print("TESTING COMPANY APPLICATION MANAGEMENT")
    print("=" * 60)
    
    if "company" not in test_data["tokens"] or not test_data["jobs"]:
        log_test("Company application tests", "SKIP", "Missing company token or jobs")
        return
    
    headers = {"Authorization": f"Bearer {test_data['tokens']['company']}"}
    
    # Get applications for a job
    if "senior_python" in test_data["jobs"]:
        job_id = test_data["jobs"]["senior_python"]["id"]
        response = make_request("GET", f"/company/jobs/{job_id}/applications", headers=headers)
        
        if response and response.status_code == 200:
            applications = response.json()
            log_test("Get job applications", "PASS", f"Found {len(applications)} applications")
            
            # Update application status
            if applications and "python_app" in test_data["applications"]:
                app_id = test_data["applications"]["python_app"]["id"]
                status_update = {"status": "shortlisted"}
                
                response = make_request("PUT", f"/company/applications/{app_id}/status", 
                                      status_update, headers=headers)
                
                if response and response.status_code == 200:
                    log_test("Update application status", "PASS", "Status updated to shortlisted")
                else:
                    log_test("Update application status", "FAIL", 
                            f"Status: {response.status_code if response else 'No response'}")
        else:
            log_test("Get job applications", "FAIL", 
                    f"Status: {response.status_code if response else 'No response'}")

def test_admin_functionality():
    """Test admin dashboard functionality"""
    print("=" * 60)
    print("TESTING ADMIN FUNCTIONALITY")
    print("=" * 60)
    
    if "admin" not in test_data["tokens"]:
        log_test("Admin functionality tests", "SKIP", "No admin token available")
        return
    
    headers = {"Authorization": f"Bearer {test_data['tokens']['admin']}"}
    
    # Get all users
    response = make_request("GET", "/admin/users", headers=headers)
    if response and response.status_code == 200:
        users = response.json()
        log_test("Get all users", "PASS", f"Retrieved {len(users)} users")
    else:
        log_test("Get all users", "FAIL", 
                f"Status: {response.status_code if response else 'No response'}")
    
    # Get all companies
    response = make_request("GET", "/admin/companies", headers=headers)
    if response and response.status_code == 200:
        companies = response.json()
        log_test("Get all companies", "PASS", f"Retrieved {len(companies)} companies")
        
        # Approve a company
        if companies:
            company_id = companies[0]["id"]
            response = make_request("PUT", f"/admin/companies/{company_id}/approve", headers=headers)
            
            if response and response.status_code == 200:
                log_test("Approve company", "PASS", "Company approved successfully")
            else:
                log_test("Approve company", "FAIL", 
                        f"Status: {response.status_code if response else 'No response'}")
    else:
        log_test("Get all companies", "FAIL", 
                f"Status: {response.status_code if response else 'No response'}")
    
    # Get analytics
    response = make_request("GET", "/admin/analytics", headers=headers)
    if response and response.status_code == 200:
        analytics = response.json()
        log_test("Get analytics", "PASS", 
                f"Users: {analytics.get('total_users', 0)}, Jobs: {analytics.get('total_jobs', 0)}")
    else:
        log_test("Get analytics", "FAIL", 
                f"Status: {response.status_code if response else 'No response'}")

def test_file_upload():
    """Test resume upload functionality"""
    print("=" * 60)
    print("TESTING FILE UPLOAD")
    print("=" * 60)
    
    if "candidate" not in test_data["tokens"]:
        log_test("File upload tests", "SKIP", "No candidate token available")
        return
    
    headers = {"Authorization": f"Bearer {test_data['tokens']['candidate']}"}
    
    # Create a dummy PDF content
    pdf_content = b"%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n>>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000074 00000 n \n0000000120 00000 n \ntrailer\n<<\n/Size 4\n/Root 1 0 R\n>>\nstartxref\n179\n%%EOF"
    
    files = {
        'file': ('priya_sharma_resume.pdf', pdf_content, 'application/pdf')
    }
    
    # Remove Content-Type header for file upload
    upload_headers = {k: v for k, v in headers.items() if k != "Content-Type"}
    
    response = make_request("POST", "/upload/resume", files=files, headers=upload_headers)
    
    if response and response.status_code == 200:
        result = response.json()
        if "resume_url" in result and result["resume_url"].startswith("data:application/pdf;base64,"):
            log_test("Upload resume", "PASS", "Resume uploaded and encoded successfully")
        else:
            log_test("Upload resume", "FAIL", "Invalid resume URL format")
    else:
        log_test("Upload resume", "FAIL", 
                f"Status: {response.status_code if response else 'No response'}")

def run_all_tests():
    """Run all backend tests"""
    print("🚀 STARTING COMPREHENSIVE BACKEND API TESTING")
    print("=" * 80)
    print(f"Backend URL: {BASE_URL}")
    print(f"Test started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    # Run tests in logical order
    test_user_registration()
    test_user_login()
    test_jwt_authentication()
    test_role_based_access_control()
    test_candidate_profile_management()
    test_job_management()
    test_job_search()
    test_job_applications()
    test_company_application_management()
    test_admin_functionality()
    test_file_upload()
    
    print("=" * 80)
    print("🏁 BACKEND TESTING COMPLETED")
    print(f"Test completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 80)
    
    # Print summary of test data
    print("\n📊 TEST DATA SUMMARY:")
    print(f"Registered users: {len(test_data['users'])}")
    print(f"Active tokens: {len(test_data['tokens'])}")
    print(f"Created jobs: {len(test_data['jobs'])}")
    print(f"Job applications: {len(test_data['applications'])}")

if __name__ == "__main__":
    run_all_tests()