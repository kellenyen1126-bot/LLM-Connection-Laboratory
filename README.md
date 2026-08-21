from flask import Flask, render_template, request
import requests, os
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")
API_URL = "https://openrouter.ai/api/v1/chat/completions"

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    answer = None
    if request.method == "POST":
        user_input = request.form["question"]
        difficulty = request.form.get("difficulty", "初級")
        language = request.form.get("language", "中文")

        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
            "model": "meta-llama/llama-3-8b-instruct",
            "messages": [
                {"role": "system", "content": f"你是一個友善的 AI 助手，回答要用 {language}，難度設定為 {difficulty}"},
                {"role": "user", "content": user_input}
            ]
        }
        response = requests.post(API_URL, headers=headers, json=data)
        if response.status_code == 200:
            result = response.json()
            answer = result
