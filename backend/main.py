import os
from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app) 

API_KEY = os.getenv("API_KEY")
API_URL = "https://api.together.xyz/v1/chat/completions"

def query_mistral_model(prompt: str, max_tokens: int = 100):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    
    data = {
        "model": "mistralai/Mistral-7B-Instruct-v0.2",
        "prompt": prompt,
        "max_tokens": max_tokens
    }
    
    response = requests.post(API_URL, json=data, headers=headers)
    
    print(f"Response Status Code: {response.status_code}")
    print(f"Response Body: {response.text}")

    if response.status_code == 200:
        return response.json()['choices'][0]['message']['content']
    else:
        return f"Error {response.status_code}: {response.text}"

@app.route('/explain', methods=['POST'])
def explain():
    try:
        
        data = request.get_json()
        prompt = data.get('concept', '')

        if not prompt:
            return jsonify({"error": "Concept is required."}), 400
        
        
        explanation = query_mistral_model(prompt)
        
        return jsonify({"explanation": explanation})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8000)), debug=False)
