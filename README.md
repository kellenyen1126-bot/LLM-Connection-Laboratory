<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <title>我的 AI 助手</title>
</head>
<body>
    <h1>🎓 我的 AI 助手</h1>

    <input type="text" id="nameInput" placeholder="請輸入你的名字">
    <button onclick="sendName()">送出</button>

    <p id="result"></p>

    <script>
        const API_KEY = "YOUR_OPENAI_API_KEY_HERE"; // ⚠️ see warning below

        async function sendName() {
            const name = document.getElementById("nameInput").value;
            const resultBox = document.getElementById("result");

            if (!name.trim()) {
                resultBox.innerText = "請輸入名字。";
                return;
            }

            resultBox.innerText = "思考中...";

            try {
                const response = await fetch("https://api.openai.com/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + API_KEY
                    },
                    body: JSON.stringify({
                        model: "gpt-4o-mini",
                        messages: [
                            { role: "user", content: `Say hello to ${name} in a friendly way.` }
                        ]
                    })
                });

                const data = await response.json();
                resultBox.innerText = data.choices[0].message.content;
            } catch (err) {
                resultBox.innerText = "發生錯誤：" + err;
            }
        }
    </script>
</body>
</html>
