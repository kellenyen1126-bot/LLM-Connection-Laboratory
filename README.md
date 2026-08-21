<!DOCTYPE html>
<html>
<head>
    <title>我的 AI 助手</title>
</head>
<body>
    <h1>🎓 我的 AI 助手</h1>
    <!-- 表單 action="/" method="POST" 必須完全對齊 -->
    <form action="/" method="POST">
        <input type="text" name="question" placeholder="請輸入你的問題">
        <br><br>
        <label>選擇難度：</label>
        <select name="difficulty">
            <option value="初級">初級</option>
            <option value="中級">中級</option>
            <option value="高級">高級</option>
        </select>
        <br><br>
        <label>選擇語言：</label>
        <select name="language">
            <option value="中文">中文</option>
            <option value="英文">英文</option>
        </select>
        <br><br>
        <!-- 送出按鈕必須是 submit -->
        <button type="submit">送出問題</button>
    </form>

    {% if answer %}
        <h2>AI 回答：</h2>
        <p>{{ answer }}</p>
    {% endif %}
</body>
</html>
from flask import Flask, render_template, request
import requests, os
from dotenv import load_dotenv

# 載入 API key
load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")
API_URL = "https://openrouter.ai/api/v1/chat/completions"

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    answer = None
    if request.method == "POST":
        user_input = request.form.get("question", "")
        difficulty = request.form.get("difficulty", "初級")
        language = request.form.get("language", "中文")

        if user_input.strip():
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
                answer = result["choices"][0]["message"]["content"]
            else:
                answer = f"API 錯誤：{response.status_code}"
        else:
            answer = "請輸入內容！"
    return render_template("index.html", answer=answer)

if __name__ == "__main__":
    app.run(debug=True)

