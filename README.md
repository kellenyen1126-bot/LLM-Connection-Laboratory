import requests
import os
from dotenv import load_dotenv

# 載入 .env 檔案中的 API key
load_dotenv()
API_KEY = os.getenv("OPENROUTER_API_KEY")

API_URL = "https://openrouter.ai/api/v1/chat/completions"

def ask_ai(question, difficulty="初級", language="中文"):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }
    data = {
        "model": "meta-llama/llama-3-8b-instruct",
        "messages": [
            {"role": "system", "content": f"你是一個友善的 AI 助手，回答要用 {language}，難度設定為 {difficulty}"},
            {"role": "user", "content": question}
        ]
    }

    response = requests.post(API_URL, headers=headers, json=data)
    if response.status_code == 200:
        result = response.json()
        return result["choices"][0]["message"]["content"]
    else:
        return f"API 錯誤：{response.status_code}"

if __name__ == "__main__":
    print("🎓 我的 AI 助手")
    user_input = input("請輸入你的問題：")
    difficulty = input("選擇難度（初級/中級/高級）：")
    language = input("選擇語言（中文/英文）：")

    if user_input.strip():
        answer = ask_ai(user_input, difficulty, language)
        print("\nAI 回答：")
        print(answer)
    else:
        print("請輸入內容！"
