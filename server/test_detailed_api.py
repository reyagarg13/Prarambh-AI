import requests
import json

url = "http://localhost:8000/api/generate-detailed"
data = {
    "idea": "A mobile app that helps students find part-time internships based on their skill set and location",
    "target_audience": "investors",
    "industry": "edtech", 
    "funding_stage": "seed"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    result = response.json()
    print(f"Success: {result.get('success')}")
    print(f"Message: {result.get('message')}")
    if result.get('deck'):
        print(f"Deck Preview: {result['deck'][:200]}...")
except Exception as e:
    print(f"Error: {e}")
