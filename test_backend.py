#!/usr/bin/env python3
"""
Test script to verify backend connectivity
"""
import requests
import json
import sys

def test_endpoint(url, description):
    """Test a specific endpoint and return the result"""
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            try:
                data = response.json()
                return f"✅ {description}: {json.dumps(data, indent=2)}"
            except:
                return f"✅ {description}: {response.text[:100]}..."
        else:
            return f"❌ {description}: HTTP {response.status_code}"
    except requests.exceptions.Timeout:
        return f"⏰ {description}: Timeout"
    except requests.exceptions.ConnectionError:
        return f"🔌 {description}: Connection failed"
    except Exception as e:
        return f"❌ {description}: {str(e)}"

def main():
    base_url = "https://2ebb6db71568.ngrok-free.app"
    
    print("🔍 Testing DexVault Backend Connectivity")
    print("=" * 50)
    print(f"Base URL: {base_url}")
    print()
    
    # Test endpoints
    endpoints = [
        ("/", "Root endpoint"),
        ("/api/health", "Health check"),
        ("/docs", "API documentation"),
        ("/openapi.json", "OpenAPI spec")
    ]
    
    for endpoint, description in endpoints:
        url = base_url + endpoint
        result = test_endpoint(url, description)
        print(result)
        print()
    
    print("🎯 Test completed!")
    print()
    print("💡 If the health endpoint is not working, try:")
    print("   1. Restart your backend server")
    print("   2. Check if ngrok tunnel is still active")
    print("   3. Verify the backend is running and accessible")

if __name__ == "__main__":
    main()
