#!/usr/bin/env python3
"""
Test script to verify API endpoints
"""
import requests
import json
import sys

def test_endpoint(url, description):
    """Test a specific endpoint"""
    try:
        print(f"🔍 Testing {description}...")
        print(f"   URL: {url}")
        
        response = requests.get(url, timeout=10)
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            try:
                data = response.json()
                print(f"   ✅ Success: {json.dumps(data, indent=2)}")
                return True
            except:
                print(f"   ✅ Success (text): {response.text[:200]}...")
                return True
        else:
            print(f"   ❌ Error: {response.text}")
            return False
            
    except requests.exceptions.Timeout:
        print(f"   ⏰ Timeout")
        return False
    except requests.exceptions.ConnectionError:
        print(f"   🔌 Connection failed")
        return False
    except Exception as e:
        print(f"   ❌ Error: {str(e)}")
        return False

def main():
    base_url = "https://2ebb6db71568.ngrok-free.app"
    
    print("🚀 DexVault API Testing")
    print("=" * 50)
    print(f"Base URL: {base_url}")
    print()
    
    # Test endpoints
    endpoints = [
        ("/", "Root endpoint"),
        ("/api/health", "Health check"),
        ("/api/campaign-detail/5LKmh8SLt4FkbddUhLHWP1ufsvdcBAovkH1Gyaw5pump", "Campaign detail"),
        ("/api/escrow-transactions/9o24Px7asSDJ1ZLyQhZd7vehm9kX4VuTeJh7VGryjXkm", "Escrow transactions"),
        ("/api/escrow-balance?wallet=9o24Px7asSDJ1ZLyQhZd7vehm9kX4VuTeJh7VGryjXkm", "Escrow balance"),
    ]
    
    results = []
    for endpoint, description in endpoints:
        url = base_url + endpoint
        success = test_endpoint(url, description)
        results.append((description, success))
        print()
    
    print("📊 Summary:")
    print("=" * 30)
    for description, success in results:
        status = "✅ Working" if success else "❌ Failed"
        print(f"{status} - {description}")
    
    print()
    print("💡 Next steps:")
    if any(success for _, success in results):
        print("   - Some endpoints are working, check the frontend")
        print("   - Open browser console to see detailed logs")
    else:
        print("   - All endpoints failed, check backend status")
        print("   - Verify ngrok tunnel is active")

if __name__ == "__main__":
    main()
