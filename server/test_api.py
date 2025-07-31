import requests
import json

url = "http://localhost:8000/api/generate"
data = {
    "idea": "A mobile app for food delivery",
    "target_audience": "investors",
    "industry": "food tech", 
    "funding_stage": "seed"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
