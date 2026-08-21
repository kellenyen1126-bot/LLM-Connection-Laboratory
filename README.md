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

from flask import Flask, request

app = Flask(__name__)

@app.route("/", methods=["GET", "POST"])
def index():
    if request.method == "POST":
        return f"你送出的文字是：{request.form.get('question', '')}"
    return '''
        <form action="/" method="POST">
            <input type="text" name="question" placeholder="請輸入文字">
            <button type="submit">送出</button>
        </form>
    '''

if __name__ == "__main__":
    app.run(debug=True)
