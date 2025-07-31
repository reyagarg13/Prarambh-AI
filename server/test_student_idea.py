import requests

# Test with a specific idea
url = "http://localhost:8000/api/generate"
data = {
    "idea": "A mobile app that helps students find part-time internships based on their skill set and location",
    "target_audience": "seed investors",
    "funding_stage": "seed"
}

try:
    response = requests.post(url, json=data)
    result = response.json()
    print(f"Success: {result.get('success')}")
    print(f"Message: {result.get('message')}")
    print("\nGenerated Pitch Deck:")
    print("=" * 50)
    print(result.get('deck', 'No deck content'))
except Exception as e:
    print(f"Error: {e}")
