<!DOCTYPE html>
<html>
<head>
    <title>我的 AI 助手</title>
</head>
<body>
    <h1>🎓 我的 AI 助手</h1>
    <form method="POST">
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
        <button type="submit">送出</button>
    </form>
    {% if answer %}
        <h2>AI 回答：</h2>
        <p>{{ answer
