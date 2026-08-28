<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<title>我的 AI 助手</title>
<style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, "Microsoft JhengHei", sans-serif; margin: 0; display: flex; height: 100vh; background: #212121; color: #ececec; }
    #sidebar { width: 260px; background: #171717; padding: 12px 8px; display: flex; flex-direction: column; }
    .sidebar-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; cursor: pointer; color: #ececec; font-size: 14px; }
    .sidebar-item:hover { background: #2a2a2a; }
    #main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    #chat { width: 100%; max-width: 700px; flex: 1; overflow-y: auto; padding: 30px 0; display: flex; flex-direction: column; gap: 20px; }
    .row { display: flex; gap: 14px; }
    .avatar { width: 30px; height: 30px; border-radius: 50%; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; }
    .row.user .avatar { background: #5436da; color: white; }
    .row.ai .avatar { background: #19c37d; color: white; }
    .text { line-height: 1.6; white-space: pre-wrap; padding-top: 4px; }
    #welcome { font-size: 26px; text-align: center; color: #ececec; margin-bottom: 20px; }
    footer { width: 100%; max-width: 700px; padding: 20px 0; }
    #inputWrap { display: flex; align-items: center; background: #2f2f2f; border-radius: 26px; padding: 10px 10px 10px 20px; }
    #userInput { flex: 1; background: transparent; border: none; outline: none; color: #ececec; font-size: 16px; }
    #sendBtn { background: #19c37d; border: none; color: white; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; font-size: 16px; }
    #sendBtn:disabled { background: #565869; cursor: not-allowed; }
</style>
</head>
<body>

<div id="sidebar">
    <div class="sidebar-item" onclick="newChat()">➕ 新對話</div>
    <div class="sidebar-item">🔍 搜尋</div>
    <div class="sidebar-item">📁 檔案庫</div>
</div>

<div id="main">
    <div id="chat"></div>
    <footer>
        <div id="inputWrap">
            <input type="text" id="userInput" placeholder="想問什麼都可以">
            <button id="sendBtn" onclick="sendMessage()">➤</button>
        </div>
    </footer>
</div>

<script>
    const API_KEY = "PASTE_HERE";
    const chatBox = document.getElementById("chat");
    const input = document.getElementById("userInput");
    const sendBtn = document.getElementById("sendBtn");
    let history = [];

    function addRow(text, sender) {
        const row = document.createElement("div");
        row.className = "row " + sender;
        row.innerHTML = `<div class="avatar">${sender === "user" ? "你" : "AI"}</div><div class="text"></div>`;
        row.querySelector(".text").innerText = text;
        chatBox.appendChild(row);
        chatBox.scrollTop = chatBox.scrollHeight;
        return row.querySelector(".text");
    }

    function newChat() {
        chatBox.innerHTML = "";
        history = [];
    }

    async function sendMessage() {
        const message = input.value.trim();
        if (!message) return;
        addRow(message, "user");
        history.push({ role: "user", content: message });
        input.value = "";
        sendBtn.disabled = true;
        const loadingText = addRow("思考中...", "ai");

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + API_KEY
                },
                body: JSON.stringify({ model: "gpt-4o-mini", messages: history })
            });
            const data = await response.json();
            if (data.error) {
                loadingText.innerText = "錯誤：" + data.error.message;
            } else {
                const reply = data.choices[0].message.content;
                loadingText.innerText = reply;
                history.push({ role: "assistant", content: reply });
            }
        } catch (err) {
            loadingText.innerText = "發生錯誤：" + err;
        } finally {
            sendBtn.disabled = false;
        }
    }

    input.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });
</script>
</body>
</html>
