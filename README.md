<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<title>我的 AI 助手</title>
<style>
    body { font-family: -apple-system, "Microsoft JhengHei", sans-serif; background: #f7f7f8; margin: 0; display: flex; flex-direction: column; height: 100vh; }
    header { background: #ffffff; padding: 16px; border-bottom: 1px solid #e5e5e5; text-align: center; font-weight: bold; font-size: 18px; }
    #chat { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; }
    .bubble { max-width: 70%; padding: 10px 14px; border-radius: 16px; line-height: 1.4; white-space: pre-wrap; }
    .user { align-self: flex-end; background: #2563eb; color: white; border-bottom-right-radius: 4px; }
    .ai { align-self: flex-start; background: #ffffff; border: 1px solid #e5e5e5; border-bottom-left-radius: 4px; }
    footer { display: flex; padding: 12px; background: #ffffff; border-top: 1px solid #e5e5e5; gap: 8px; }
    #userInput { flex: 1; padding: 10px 14px; border: 1px solid #ccc; border-radius: 20px; font-size: 15px; outline: none; }
    #sendBtn { padding: 10px 20px; border: none; border-radius: 20px; background: #2563eb; color: white; font-size: 15px; cursor: pointer; }
</style>
</head>
<body>

<header>🎓 我的 AI 助手</header>
<div id="chat"></div>
<footer>
    <input type="text" id="userInput" placeholder="請輸入訊息...">
    <button id="sendBtn" onclick="sendMessage()">送出</button>
</footer>

<script>
    const API_KEY = "PASTE_HERE";

    const chatBox = document.getElementById("chat");
    const input = document.getElementById("userInput");

    function addBubble(text, sender) {
        const div = document.createElement("div");
        div.className = "bubble " + sender;
        div.innerText = text;
        chatBox.appendChild(div);
        return div;
    }

    async function sendMessage() {
        const message = input.value.trim();
        if (!message) return;
        addBubble(message, "user");
        input.value = "";
        const loadingBubble = addBubble("思考中...", "ai");

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + API_KEY
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: message }]
                })
            });
            const data = await response.json();

            if (data.error) {
                loadingBubble.innerText = "錯誤：" + data.error.message;
            } else {
                loadingBubble.innerText = data.choices[0].message.content;
            }
        } catch (err) {
            loadingBubble.innerText = "發生錯誤：" + err;
        }
    }

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") sendMessage();
    });
</script>
</body>
</html>
