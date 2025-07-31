import requests
import json

# Test different types of ideas
test_ideas = [
    "A mobile app for food delivery",
    "A fitness tracking platform for seniors", 
    "An educational platform for coding bootcamps",
    "A cryptocurrency trading bot"
]

for idea in test_ideas:
    print(f"\n{'='*60}")
    print(f"Testing idea: {idea}")
    print('='*60)
    
    url = "http://localhost:8000/api/generate"
    data = {
        "idea": idea,
        "target_audience": "investors",
        "funding_stage": "seed"
    }

    try:
        response = requests.post(url, json=data)
        result = response.json()
        if result.get('success'):
            # Show first 300 characters to see the differences
            deck_preview = result['deck'][:300] + "..."
            print(deck_preview)
        else:
            print(f"Error: {result.get('message')}")
    except Exception as e:
        print(f"Request failed: {e}")
