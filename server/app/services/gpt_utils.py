import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_pitch_deck(idea):
    prompt = f"Generate a startup pitch deck in 5 sections: Problem, Solution, Market, Business Model, and Call-to-Action. The startup idea is: {idea}"
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return {"deck": response.choices[0].message.content}
