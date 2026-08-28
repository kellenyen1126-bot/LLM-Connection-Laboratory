import os
from flask import Flask, request, render_template
from openai import OpenAI

app = Flask(__name__)
client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

DIFFICULTY_PROMPTS = {
    "初級": "用非常簡單、初學者容易理解的方式回答，避免專業術語。",
    "中級": "用一般程度的方式回答，可以包含一些技術細節。",
    "高級": "用深入、專業的方式回答，可包含技術細節與進階概念。",
}

LANGUAGE_PROMPTS = {
    "中文": "請用繁體中文回答。",
    "English": "Please answer in English.",
    "日本語": "日本語で答えてください。",
}


def ask_ai(question, difficulty, language):
    if not question.strip():
        return "請輸入問題。"

    if not os.environ.get("OPENAI_API_KEY"):
        return "錯誤：尚未設定 OPENAI_API_KEY 環境變數。"

    system_prompt = (
        f"你是一個樂於助人的 AI 助手。"
        f"{DIFFICULTY_PROMPTS.get(difficulty, '')} "
        f"{LANGUAGE_PROMPTS.get(language, '')}"
    )

    try:
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": question},
            ],
        )
        return response.choices[0].message.content
    except Exception as e:
        return f"發生錯誤：{str(e)}"


@app.route("/", methods=["GET", "POST"])
def index():
    answer = None
    question = ""
    difficulty = "初級"
    language = "中文"

    if request.method == "POST":
        question = request.form.get("question", "")
        difficulty = request.form.get("difficulty", "初級")
        language = request.form.get("language", "中文")
        answer = ask_ai(question, difficulty, language)

    return render_template(
        "index.html",
        answer=answer,
        question=question,
        difficulty=difficulty,
        language=language,
    )


if __name__ == "__main__":
    app.run(debug=True)
